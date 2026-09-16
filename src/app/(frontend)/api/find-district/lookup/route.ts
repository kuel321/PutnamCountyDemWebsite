import { NextResponse } from 'next/server'
import { booleanPointInPolygon, point } from '@turf/turf'
import type { Polygon, MultiPolygon } from 'geojson'

import boundaries from '@/data/putnam-district-boundaries.json'

type DistrictEntry = { district: string; geometry: Polygon | MultiPolygon }

function findMatch(lat: number, lon: number, entries: DistrictEntry[]): DistrictEntry | null {
  const pt = point([lon, lat])
  for (const entry of entries) {
    if (booleanPointInPolygon(pt, entry.geometry)) {
      return entry
    }
  }
  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'A valid lat/lon is required.' }, { status: 400 })
  }

  const magisterial = findMatch(lat, lon, boundaries.magisterial as DistrictEntry[])
  const house = findMatch(lat, lon, boundaries.house as DistrictEntry[])
  const senate = findMatch(lat, lon, boundaries.senate as DistrictEntry[])

  if (!magisterial && !house && !senate) {
    return NextResponse.json(
      { error: "That address doesn't fall within a Putnam County-area district we have data for." },
      { status: 404 },
    )
  }

  return NextResponse.json({
    magisterial: magisterial?.district ?? '—',
    house: house?.district ?? '—',
    senate: senate?.district ?? '—',
    congressional: boundaries.congressional.district,
    // Only the magisterial boundary is returned for map display — it's the
    // smallest, most locally-relevant shape. House/Senate geometry is kept
    // server-side purely for the point-in-polygon match.
    magisterialGeometry: magisterial?.geometry ?? null,
  })
}
