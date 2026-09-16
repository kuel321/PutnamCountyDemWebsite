type GeoJSONGeometry = {
  type: 'Polygon' | 'MultiPolygon'
  coordinates: unknown
}

/** Converts a GeoJSON Polygon/MultiPolygon's [lon, lat] rings to Leaflet's [lat, lon] order. */
export function geoJsonToLeafletRings(geometry?: GeoJSONGeometry | null): [number, number][][] {
  if (!geometry) return []

  if (geometry.type === 'Polygon') {
    return (geometry.coordinates as [number, number][][]).map((ring) =>
      ring.map(([lon, lat]) => [lat, lon] as [number, number]),
    )
  }

  if (geometry.type === 'MultiPolygon') {
    return (geometry.coordinates as [number, number][][][]).flatMap((polygon) =>
      polygon.map((ring) => ring.map(([lon, lat]) => [lat, lon] as [number, number])),
    )
  }

  return []
}
