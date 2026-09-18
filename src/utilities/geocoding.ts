// Biases Photon results toward Putnam County, WV — it still returns matches
// elsewhere, this just ranks nearby ones higher.
export const PUTNAM_COUNTY_LAT = 38.55
export const PUTNAM_COUNTY_LON = -81.87

export type PhotonProperties = {
  housenumber?: string
  street?: string
  name?: string
  city?: string
  state?: string
  postcode?: string
}

export function formatPhotonAddress(props: PhotonProperties): string {
  const line1 = [props.housenumber, props.street].filter(Boolean).join(' ') || props.name || ''
  const line2 = [props.city, props.state].filter(Boolean).join(', ')
  return [line1, [line2, props.postcode].filter(Boolean).join(' ')].filter(Boolean).join(', ')
}
