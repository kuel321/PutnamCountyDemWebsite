'use client'

import { MapContainer, TileLayer, Marker, Polygon, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #dc2626;
    border: 3px solid white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.5);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function FitToBounds({ rings, position }: { rings: [number, number][][]; position: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    if (rings.length > 0 && rings[0].length > 0) {
      const bounds = L.latLngBounds(rings.flat())
      map.fitBounds(bounds, { padding: [24, 24] })
    } else {
      map.setView(position, 13)
    }
  }, [rings, position, map])

  return null
}

export default function DistrictMap({
  position,
  rings,
}: {
  position: [number, number]
  rings: [number, number][][]
}) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rings.map((ring, index) => (
        <Polygon
          key={index}
          positions={ring}
          pathOptions={{ color: '#0891b2', weight: 3, fillOpacity: 0.1 }}
        />
      ))}
      <Marker position={position} icon={pinIcon} />
      <FitToBounds rings={rings} position={position} />
    </MapContainer>
  )
}
