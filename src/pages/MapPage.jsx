import { useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useReports } from '../hooks/useReports.js'
import { REPORT_TYPES, REPORT_STATUSES } from '../lib/constants.js'
import { buildHotspots } from '../lib/hotspot.js'
import ReportMap from '../components/map/ReportMap.jsx'
import MapFilters from '../components/map/MapFilters.jsx'
import HotspotList from '../components/map/HotspotList.jsx'
import './TrackPage.css' // gaya bersama: tombol, label status, pesan
import './MapPage.css'

const allTypes = () => new Set(REPORT_TYPES.map((x) => x.value))
const allStatuses = () => new Set(REPORT_STATUSES)

function toggled(set, value) {
  const next = new Set(set)
  next.has(value) ? next.delete(value) : next.add(value)
  return next
}

export default function MapPage() {
  const { t } = useLanguage()
  const { reports, loading, error, reload } = useReports()

  const [types, setTypes] = useState(allTypes)
  const [statuses, setStatuses] = useState(allStatuses)
  const [days, setDays] = useState(0)
  const [showHotspots, setShowHotspots] = useState(true)
  const [focus, setFocus] = useState(null)

  // Hanya laporan yang koordinatnya valid. Catatan: Number(null) = 0, jadi nilai kosong
  // harus dibuang lebih dulu agar tidak muncul sebagai titik 0,0 di tengah samudra.
  const valid = useMemo(
    () =>
      reports
        .filter((r) => r.lat != null && r.lng != null && r.lat !== '' && r.lng !== '')
        .map((r) => ({ ...r, lat: Number(r.lat), lng: Number(r.lng) }))
        .filter(
          (r) =>
            Number.isFinite(r.lat) && Number.isFinite(r.lng) &&
            Math.abs(r.lat) <= 90 && Math.abs(r.lng) <= 180
        ),
    [reports]
  )

  const filtered = useMemo(() => {
    const since = days > 0 ? Date.now() - days * 86400000 : 0
    return valid.filter(
      (r) =>
        types.has(r.type) &&
        statuses.has(r.status) &&
        (since === 0 || new Date(r.created_at).getTime() >= since)
    )
  }, [valid, types, statuses, days])

  // Titik rawan hanya dari laporan yang masih aktif (belum dibersihkan)
  const hotspots = useMemo(
    () => buildHotspots(filtered.filter((r) => r.status !== 'cleaned')),
    [filtered]
  )

  const counts = useMemo(() => {
    const c = {}
    valid.forEach((r) => { c[r.type] = (c[r.type] ?? 0) + 1 })
    return c
  }, [valid])

  const active = filtered.filter((r) => r.status !== 'cleaned').length

  function resetFilters() {
    setTypes(allTypes())
    setStatuses(allStatuses())
    setDays(0)
    setShowHotspots(true)
  }

  return (
    <section className="lg-map-page">
      <div className="lg-map-head">
        <div>
          <h1>{t('map.title')}</h1>
          <p className="lg-muted">{t('map.subtitle')}</p>
        </div>
        <button type="button" className="lg-track-btn" onClick={reload} disabled={loading}>
          ↻ {loading ? t('map.loading') : t('map.reload')}
        </button>
      </div>

      {error && (
        <div className="lg-track-msg error" role="alert">
          {t('map.err')}{' '}
          <button type="button" className="lg-link-btn" onClick={reload}>{t('track.retry')}</button>
        </div>
      )}

      <div className="lg-stats" data-testid="map-stats">
        <div><b data-testid="stat-total">{filtered.length}</b><span>{t('map.stats.total')}</span></div>
        <div><b data-testid="stat-active">{active}</b><span>{t('map.stats.active')}</span></div>
        <div><b data-testid="stat-cleaned">{filtered.length - active}</b><span>{t('map.stats.cleaned')}</span></div>
        <div><b data-testid="stat-hotspots">{hotspots.length}</b><span>{t('map.stats.hotspots')}</span></div>
      </div>

      <div className="lg-map-layout">
        <div className="lg-map-main">
          <div className="lg-map-box">
            <ReportMap
              reports={filtered}
              allPoints={valid}
              hotspots={hotspots}
              showHotspots={showHotspots}
              focus={focus}
            />
            {!loading && !error && valid.length === 0 && (
              <div className="lg-map-overlay">{t('map.noData')}</div>
            )}
            {!loading && valid.length > 0 && filtered.length === 0 && (
              <div className="lg-map-overlay">{t('map.empty')}</div>
            )}
          </div>

          <div className="lg-legend">
            <strong>{t('map.legend')}:</strong>
            {REPORT_TYPES.map((x) => (
              <span key={x.value} className="lg-legend-item">
                <i className={`lg-dot ${x.value}`} /> {x.icon} {t(`type.${x.value}`)}
              </span>
            ))}
            <span className="lg-legend-item">
              <i className="lg-dot cleaned" /> {t('map.legend.cleaned')}
            </span>
          </div>
        </div>

        <aside className="lg-map-side">
          <MapFilters
            types={types}
            statuses={statuses}
            days={days}
            showHotspots={showHotspots}
            counts={counts}
            onToggleType={(v) => setTypes((s) => toggled(s, v))}
            onToggleStatus={(v) => setStatuses((s) => toggled(s, v))}
            onDays={setDays}
            onToggleHotspots={() => setShowHotspots((v) => !v)}
            onReset={resetFilters}
          />
          <HotspotList hotspots={hotspots} onFocus={(h) => setFocus({ lat: h.lat, lng: h.lng, zoom: 16 })} />
        </aside>
      </div>
    </section>
  )
}