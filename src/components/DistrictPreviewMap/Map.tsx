'use client'

import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

function FitToRings({ rings }: { rings: [number, number][][] }) {
  const map = useMap()

  useEffect(() => {
    if (rings.length === 0) return
    const bounds = L.latLngBounds(rings.flat())
    const size = map.getSize()

    // Push the shape toward the right so it doesn't sit directly behind the
    // centered candidate info — less of a push on narrow viewports (there's
    // less room to work with), more on wide ones. Vertical padding is kept
    // separate from the right-side padding: bumping vertical padding zooms
    // the fit out (more breathing room top/bottom), without also pulling the
    // shape back toward center the way raising the right-side padding would.
    const isMobile = size.x < 640
    const pushRatio = isMobile ? 0.5 : 0.55
    const verticalPadding = 24
    const rightPadding = isMobile ? -20 : 24
    map.fitBounds(bounds, {
      paddingTopLeft: [size.x * pushRatio, verticalPadding],
      paddingBottomRight: [rightPadding, verticalPadding],
    })
  }, [rings, map])

  return null
}

function districtNumberIcon(districtNumber: number) {
  return L.divIcon({
    className: '',
    html: `<div style="transform:translate(-50%,-50%);font-size:22px;font-weight:700;color:#ffffff;line-height:1;font-family:inherit;text-shadow:0 2px 12px rgba(0,0,0,0.35);white-space:nowrap;">${districtNumber}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export default function DistrictPreviewMap({
  rings,
  districtNumber,
  labelPosition,
}: {
  rings: [number, number][][]
  districtNumber?: number | null
  labelPosition?: [number, number] | null
}) {
  if (rings.length === 0) return null

  return (
    <MapContainer
      center={rings[0][0]}
      zoom={10}
      style={{ height: '100%', width: '100%', background: '#1b3a6b', fontFamily: 'inherit' }}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      attributionControl={false}
    >
      {/* Faded so the map's own navy background shows through the tiles,
          tinting the whole thing toward the hero's color. */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={0.25} />
      {rings.map((ring, index) => (
        <Polygon
          key={index}
          positions={ring}
          pathOptions={{ color: '#ffffff', weight: 2, fill: false }}
        />
      ))}
      {districtNumber != null && labelPosition && (
        <Marker
          position={labelPosition}
          icon={districtNumberIcon(districtNumber)}
          interactive={false}
        />
      )}
      <FitToRings rings={rings} />
    </MapContainer>
  )
}
