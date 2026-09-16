/**
 * Single source of truth for Putnam-area district boundaries. Fetches and
 * dissolves shapes from WV's public election-district layer (the same one
 * mapwv.gov/vote uses) once, then feeds BOTH consumers from that one pass:
 *
 *   1. Writes src/data/putnam-district-boundaries.json — the snapshot the
 *      "Find Your District" search block does its point-in-polygon match
 *      against, so that feature never has to call WV's server at request
 *      time.
 *   2. Updates the matching `districts` collection docs (District 19/20/21,
 *      Countywide) that Candidates link to, so those boundaries stay in
 *      sync with the exact same data instead of being fetched and dissolved
 *      independently.
 *
 * Source layer: https://services1.arcgis.com/cTNi34MxOdcfum3A/arcgis/rest/services/WV_Elections_Query_Layer/FeatureServer/5
 *
 * US Congressional district is NOT snapshotted — all of Putnam County falls
 * within Congressional District 1 with no exceptions, and that district's
 * shape has 2000+ overlay fragments statewide (the server caps the response
 * before finishing), so it isn't worth fetching for a value that never
 * varies for our service area. It's hardcoded instead.
 *
 * "City of Bancroft" is a municipal boundary, not present in this
 * election-district layer at all — left unchanged either way.
 *
 * Re-run this after WV redistricts to refresh both consumers at once:
 *   NODE_ENV=production npx payload run ./scripts/build-district-boundaries.ts
 * (NODE_ENV=production skips Payload's interactive dev-schema-push prompt.)
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { arcgisToGeoJSON } from '@terraformer/arcgis'
import { featureCollection, feature, union, area } from '@turf/turf'
import type { Geometry, Polygon, MultiPolygon } from 'geojson'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const LAYER_URL =
  'https://services1.arcgis.com/cTNi34MxOdcfum3A/arcgis/rest/services/WV_Elections_Query_Layer/FeatureServer/5/query'

type EsriFeature = {
  attributes: Record<string, string>
  geometry?: { rings: number[][][] }
}

type DistrictEntry = { district: string; geometry: Geometry }

async function queryFeatures(where: string): Promise<EsriFeature[]> {
  const url = new URL(LAYER_URL)
  url.searchParams.set('f', 'json')
  url.searchParams.set('where', where)
  url.searchParams.set('outFields', 'LONGNAME_1,DISTRICT,DISTRICT_1,County_Name')
  url.searchParams.set('outSR', '4326')
  url.searchParams.set('returnGeometry', 'true')
  url.searchParams.set('resultRecordCount', '2000')

  const res = await fetch(url)
  if (!res.ok) throw new Error(`ArcGIS query failed: ${res.status}`)
  const data = await res.json()
  if (data.exceededTransferLimit) {
    throw new Error(`Query "${where}" exceeded the server's transfer limit — needs pagination.`)
  }
  return data.features ?? []
}

function dissolve(features: EsriFeature[]): Geometry | null {
  const geometries = features
    .filter((f): f is EsriFeature & { geometry: { rings: number[][][] } } => !!f.geometry?.rings?.length)
    .map(
      (f) =>
        arcgisToGeoJSON({ rings: f.geometry.rings, spatialReference: { wkid: 4326 } }) as
          | Polygon
          | MultiPolygon,
    )

  if (geometries.length === 0) return null
  if (geometries.length === 1) return geometries[0]

  const fc = featureCollection(geometries.map((g) => feature(g)))
  return union(fc)?.geometry ?? null
}

async function buildGroup(
  fieldWhere: (value: string) => string,
  values: string[],
  label: string,
): Promise<DistrictEntry[]> {
  const results: DistrictEntry[] = []
  for (const value of values) {
    const features = await queryFeatures(fieldWhere(value))
    const geometry = dissolve(features)
    if (!geometry) {
      console.log(`  ${label} ${value}: no geometry found — skipping.`)
      continue
    }
    console.log(`  ${label} ${value}: dissolved ${features.length} fragments.`)
    results.push({ district: value, geometry })
  }
  return results
}

async function updateDistrictDoc(
  payload: Awaited<ReturnType<typeof getPayload>>,
  title: string,
  geometry: Geometry | null,
) {
  if (!geometry) {
    console.log(`  No geometry for "${title}" — skipping.`)
    return
  }

  const existing = await payload.find({
    collection: 'districts',
    where: { title: { equals: title } },
    limit: 1,
  })

  const doc = existing.docs[0]
  if (!doc) {
    console.log(`  No existing "${title}" doc in the districts collection — skipping.`)
    return
  }

  await payload.update({
    collection: 'districts',
    id: doc.id,
    // `boundary` is a generic Payload `json` field — GeoJSON geometry
    // objects are perfectly valid JSON, just structurally narrower than
    // the field's permissive TS type.
    data: { boundary: geometry as unknown as Record<string, unknown> },
  })

  const sqKm = area(feature(geometry)) / 1_000_000
  console.log(`  Synced "${title}" — ~${sqKm.toFixed(1)} sq km.`)
}

async function run() {
  const payload = await getPayload({ config })

  console.log('Magisterial districts (Putnam-only, so no cross-county dissolve needed):')
  const magisterialRaw = await queryFeatures("County_Name='Putnam'")
  const byMagisterial = new Map<string, EsriFeature[]>()
  for (const f of magisterialRaw) {
    let name = (f.attributes.LONGNAME_1 || '').trim()
    if (!name) continue
    if (name === 'District IV') name = 'District 4' // source data typo
    if (!byMagisterial.has(name)) byMagisterial.set(name, [])
    byMagisterial.get(name)!.push(f)
  }
  const magisterial: DistrictEntry[] = []
  for (const [name, features] of byMagisterial) {
    const geometry = dissolve(features)
    if (!geometry) continue
    console.log(`  ${name}: dissolved ${features.length} fragments.`)
    magisterial.push({ district: name, geometry })
  }

  console.log('\nWV House districts (full multi-county shape):')
  const house = await buildGroup((v) => `DISTRICT='${v}'`, ['18', '19', '20', '21', '59'], 'House')

  console.log('\nWV Senate districts (full multi-county shape):')
  const senate = await buildGroup((v) => `DISTRICT_1='${v}'`, ['4', '8'], 'Senate')

  console.log('\nCountywide (union of every Putnam County fragment, any type):')
  const countyGeometry = dissolve(magisterialRaw)
  if (countyGeometry) {
    const sqKm = area(feature(countyGeometry)) / 1_000_000
    console.log(`  Dissolved ${magisterialRaw.length} fragments, ~${sqKm.toFixed(1)} sq km.`)
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source:
      'https://services1.arcgis.com/cTNi34MxOdcfum3A/arcgis/rest/services/WV_Elections_Query_Layer/FeatureServer/5 (public layer backing mapwv.gov/vote) — snapshot, not a live connection',
    magisterial,
    house,
    senate,
    congressional: {
      district: '1',
      note: 'Hardcoded — all of Putnam County falls within Congressional District 1, and that district spans too much of the state to be worth fetching for a value that never varies here.',
    },
  }

  const outPath = path.join(dirname, '..', 'src', 'data', 'putnam-district-boundaries.json')
  await writeFile(outPath, JSON.stringify(output), 'utf-8')
  console.log(`\nWrote ${outPath}`)

  console.log('\nSyncing the districts collection (Candidate-linked boundaries) from the same data:')
  const houseByNumber = new Map(house.map((h) => [h.district, h.geometry]))
  for (const num of ['19', '20', '21']) {
    await updateDistrictDoc(payload, `District ${num}`, houseByNumber.get(num) ?? null)
  }
  await updateDistrictDoc(payload, 'Countywide', countyGeometry)

  console.log(
    '\nNote: "City of Bancroft" is a municipal boundary, not present in this election-district ' +
      'layer — left unchanged. A separate municipal-boundary data source would be needed for that one.',
  )

  process.exit(0)
}

await run()
