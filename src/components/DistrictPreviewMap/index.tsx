'use client'

import dynamic from 'next/dynamic'
import { geoJsonToLeafletRings } from '@/utilities/geoJsonToLeafletRings'

const Map = dynamic(() => import('./Map'), { ssr: false })

export function DistrictPreviewMap({
  boundary,
  label,
  districtNumber,
  labelPosition,
  className,
}: {
  boundary?: Record<string, unknown> | null
  label: string
  districtNumber?: number | null
  labelPosition?: [number, number] | null
  className?: string
}) {
  const rings = geoJsonToLeafletRings(
    boundary as { type: 'Polygon' | 'MultiPolygon'; coordinates: unknown } | null | undefined,
  )

  if (rings.length === 0) return null

  return (
    // `isolate` is load-bearing here: Leaflet's internal panes use z-index up
    // to 1000 (tiles/markers/popups/controls), and .leaflet-container never
    // sets its own z-index — only position: relative — so without isolation
    // those pane z-indexes leak out of this box entirely and stack above
    // whatever sibling content (scrim, text) sits next to the map, no matter
    // what z-index or DOM order that sibling uses.
    <div className={`isolate overflow-hidden bg-brand-navy ${className ?? 'relative'}`}>
      <Map rings={rings} districtNumber={districtNumber ?? null} labelPosition={labelPosition ?? null} />
      <p className="pointer-events-none absolute bottom-2 right-3 z-10 text-[10px] text-white/40">
        {label} &middot; Map data &copy; OpenStreetMap
      </p>
    </div>
  )
}
