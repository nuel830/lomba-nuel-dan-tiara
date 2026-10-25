import { Fragment, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap } from 'react-leaflet'
import '../../lib/leafletIcons.js'
import { MAP_CENTER, MAP_ZOOM, REPORT_TYPES } from '../../lib/constants.js'
import { formatDateTime } from '../../lib/format.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { pinIcon } from './pinIcon.js'

const LEVEL_COLORS = { high: '#dc2626', medium: '#f97316', low: '#eab308' }

// Mengatur kamera: sesuaikan zoom sekali saat data pertama tiba, dan terbang ke `focus`.
function Controller({ allPoints, focus }) {
  const map = useMap()
  const fitted = useRef(false)

  useEffect(() => {
    if (fitted.current || allPoints.length === 0) return
    fitted.current = true
    if (allPoints.length === 1) {
      map.setView([allPoints[0].lat, allPoints[0].lng], 14)
    } else {
      map.fitBounds(allPoints.map((p) => [p.lat, p.lng]), { padding: [50, 50], maxZoom: 15 })
    }
  }, [allPoints, map])

  useEffect(() => {
    if (focus) map.flyTo([focus.lat, focus.lng], focus.zoom ?? 16, { duration: 0.8 })
  }, [focus, map])

  return null
}

export default function ReportMap({ reports, allPoints, hotspots, showHotspots, focus }) {
  const { t, lang } = useLanguage()

  return (
    <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} className="lg-report-map" scrollWheelZoom>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Controller allPoints={allPoints} focus={focus} />

      {showHotspots &&
        hotspots.map((h) => (
          <Fragment key={h.id}>
            {/* Cincin berukuran piksel tetap: titik rawan selalu terlihat di zoom berapa pun */}
            <CircleMarker
              center={[h.lat, h.lng]}
              radius={Math.min(46, 20 + h.count * 4)}
              className="lg-hotspot-ring"
              pathOptions={{
                color: LEVEL_COLORS[h.level],
                fillColor: LEVEL_COLORS[h.level],
                fillOpacity: 0.22,
                weight: 3,
              }}
              interactive={false}
            />
            {/* Lingkaran radius sebenarnya (meter), tampak jelas saat peta diperbesar */}
            <Circle
              center={[h.lat, h.lng]}
              radius={h.radius}
              pathOptions={{
                color: LEVEL_COLORS[h.level],
                fillColor: LEVEL_COLORS[h.level],
                fillOpacity: 0.12,
                weight: 2,
                dashArray: '6 6',
              }}
              interactive={false}
            />
          </Fragment>
        ))}

      {reports.map((r) => {
        const icon = REPORT_TYPES.find((x) => x.value === r.type)?.icon
        return (
          <Marker
            key={r.id ?? r.code}
            position={[r.lat, r.lng]}
            icon={pinIcon(r.type, r.status)}
            zIndexOffset={r.status === 'cleaned' ? 0 : 500}
          >
            <Popup minWidth={220} maxWidth={260}>
              <div className="lg-popup">
                {r.photo_url && <img src={r.photo_url} alt="" className="lg-popup-photo" />}
                <strong>{icon} {t(`type.${r.type}`)}</strong>
                <span className={`lg-pill ${r.status}`}>{t(`status.${r.status}`)}</span>
                <small>{r.code} · {t(`size.${r.size}`)}</small>
                <small>{formatDateTime(r.created_at, lang)}</small>
                <Link to={`/lacak/${r.code}`} className="lg-popup-link">{t('map.popup.detail')} →</Link>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}