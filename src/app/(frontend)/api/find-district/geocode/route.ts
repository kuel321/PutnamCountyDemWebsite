import { NextResponse } from 'next/server'
import { PUTNAM_COUNTY_LAT, PUTNAM_COUNTY_LON, formatPhotonAddress } from '@/utilities/geocoding'

type CensusGeocodeResponse = {
  result: {
    addressMatches: Array<{
      matchedAddress: string
      coordinates: { x: number; y: number }
    }>
  }
}

type PhotonResponse = {
  features: Array<{
    properties: {
      housenumber?: string
      street?: string
      name?: string
      city?: string
      state?: string
      postcode?: string
    }
    geometry: { coordinates: [number, number] }
  }>
}

type GeocodeMatch = { matchedAddress: string; lat: number; lon: number }

// The Census Bureau's oneline geocoder is strict about formatting (comma
// placement, abbreviations, etc.) — it works great when it works, but users
// who type a messy address and hit submit (rather than picking an
// autocomplete suggestion) can get rejected for formatting alone. Try it
// first since it's the more precise match for US addresses, but fall back
// to Photon (the same lenient geocoder the autocomplete dropdown uses) so a
// formatting quirk doesn't just dead-end the lookup.
async function geocodeWithCensus(address: string): Promise<GeocodeMatch | null> {
  const url = new URL('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress')
  url.searchParams.set('address', address)
  url.searchParams.set('benchmark', 'Public_AR_Current')
  url.searchParams.set('format', 'json')

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Census geocoder returned ${res.status}`)

  const data: CensusGeocodeResponse = await res.json()
  const match = data.result?.addressMatches?.[0]
  if (!match) return null

  return { matchedAddress: match.matchedAddress, lat: match.coordinates.y, lon: match.coordinates.x }
}

async function geocodeWithPhoton(address: string): Promise<GeocodeMatch | null> {
  const url = new URL('https://photon.komoot.io/api/')
  url.searchParams.set('q', address)
  url.searchParams.set('limit', '1')
  url.searchParams.set('lat', String(PUTNAM_COUNTY_LAT))
  url.searchParams.set('lon', String(PUTNAM_COUNTY_LON))

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Photon geocoder returned ${res.status}`)

  const data: PhotonResponse = await res.json()
  const match = data.features?.[0]
  if (!match) return null

  return {
    matchedAddress: formatPhotonAddress(match.properties),
    lon: match.geometry.coordinates[0],
    lat: match.geometry.coordinates[1],
  }
}

// This route exists mainly to proxy Census, which doesn't send CORS headers
// (Photon does, and is normally called directly from the client for
// autocomplete — it's only called from here as a fallback). The district
// lookup itself (ArcGIS) is public and CORS-enabled, so that one is called
// directly from the client.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')?.trim()

  if (!address) {
    return NextResponse.json({ error: 'Please enter an address.' }, { status: 400 })
  }

  let match: GeocodeMatch | null = null
  try {
    match = await geocodeWithCensus(address)
  } catch (err) {
    console.error('Census geocoder request failed:', err)
  }

  if (!match) {
    try {
      match = await geocodeWithPhoton(address)
    } catch (err) {
      console.error('Photon geocoder request failed:', err)
    }
  }

  if (!match) {
    return NextResponse.json(
      { error: "We couldn't find that address. Try including the city and state." },
      { status: 404 },
    )
  }

  return NextResponse.json(match)
}
