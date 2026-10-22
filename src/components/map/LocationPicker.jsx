import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import '../../lib/leafletIcons.js'
import { MAP_CENTER, MAP_ZOOM } from '../../lib/constants.js'

// Ketuk peta untuk menaruh penanda; penanda bisa digeser.
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng, accuracy: null, fly: false })
    },
  })
  return null
}

// Peta terbang ke lokasi hanya saat lokasi berasal dari GPS
function FlyTo({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position?.fly) {
      map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 16), { duration: 0.8 })
    }
  }, [position?.lat, position?.lng, position?.fly, map])
  return null
}

export default function LocationPicker({ position, onPick, height = '280px' }) {
  return (
    <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} style={{ height, width: '100%', borderRadius: 14 }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      <FlyTo position={position} />
      {position && (
        <Marker
          position={[position.lat, position.lng]}
          draggable
          eventHandlers={{
            dragend(e) {
              const { lat, lng } = e.target.getLatLng()
              onPick({ lat, lng, accuracy: null, fly: false })
            },
          }}
        />
      )}
    </MapContainer>
  )
}