import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import '../../lib/leafletIcons.js'
import { MAP_CENTER, MAP_ZOOM } from '../../lib/constants.js'

export default function LakeMap({ reports = [], height = '480px' }) {
  return (
    <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} style={{ height, borderRadius: 16 }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]}>
          <Popup>{r.type} · {r.status}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}