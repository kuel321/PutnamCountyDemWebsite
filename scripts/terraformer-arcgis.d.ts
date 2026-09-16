declare module '@terraformer/arcgis' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function arcgisToGeoJSON(arcgis: unknown, idAttribute?: string): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function geojsonToArcGIS(geojson: unknown, idAttribute?: string): any
}
