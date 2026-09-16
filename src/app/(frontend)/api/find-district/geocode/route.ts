import { NextResponse } from 'next/server'

type CensusGeocodeResponse = {
  result: {
    addressMatches: Array<{
      matchedAddress: string
      coordinates: { x: number; y: number }
    }>
  }
}

// The Census Bureau's geocoder doesn't send CORS headers, so it can't be
// called directly from the browser — this route just proxies the one
// request that needs it. The district lookup itself (ArcGIS) is public
// and CORS-enabled, so that one is called directly from the client.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')?.trim()

  if (!address) {
    return NextResponse.json({ error: 'Please enter an address.' }, { status: 400 })
  }

  const censusUrl = new URL('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress')
  censusUrl.searchParams.set('address', address)
  censusUrl.searchParams.set('benchmark', 'Public_AR_Current')
  censusUrl.searchParams.set('format', 'json')

  let data: CensusGeocodeResponse
  try {
    const res = await fetch(censusUrl, { cache: 'no-store' })
    if (!res.ok) {
      throw new Error(`Census geocoder returned ${res.status}`)
    }
    data = await res.json()
  } catch (err) {
    console.error('Census geocoder request failed:', err)
    return NextResponse.json(
      { error: 'The address lookup service is unavailable right now. Please try again later.' },
      { status: 502 },
    )
  }

  const match = data.result?.addressMatches?.[0]
  if (!match) {
    return NextResponse.json(
      { error: "We couldn't find that address. Try including the city and state." },
      { status: 404 },
    )
  }

  return NextResponse.json({
    matchedAddress: match.matchedAddress,
    lat: match.coordinates.y,
    lon: match.coordinates.x,
  })
}
