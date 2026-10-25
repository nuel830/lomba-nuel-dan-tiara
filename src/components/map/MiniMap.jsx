import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import '../../lib/leafletIcons.js'

// Peta kecil untuk menampilkan satu titik laporan (hanya lihat, tidak bisa diubah).
export default function MiniMap({ lat, lng, height = '220px' }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height, width: '100%', borderRadius: 14 }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  )
}