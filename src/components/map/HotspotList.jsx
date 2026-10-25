import { useLanguage } from '../../context/LanguageContext.jsx'
import { REPORT_TYPES } from '../../lib/constants.js'

// Daftar titik rawan, urut dari skor tertinggi. Klik untuk terbang ke lokasinya di peta.
export default function HotspotList({ hotspots, onFocus }) {
  const { t } = useLanguage()

  return (
    <section className="lg-hotspots" data-testid="hotspot-list">
      <h3>🔥 {t('map.hotspot.title')}</h3>
      <p className="lg-muted">{t('map.hotspot.desc')}</p>

      {hotspots.length === 0 ? (
        <p className="lg-hotspot-empty">{t('map.hotspot.empty')}</p>
      ) : (
        <ol className="lg-hotspot-items">
          {hotspots.map((h, i) => {
            const icon = REPORT_TYPES.find((x) => x.value === h.topType)?.icon
            return (
              <li key={h.id}>
                <button type="button" className="lg-hotspot-item" onClick={() => onFocus(h)}>
                  <span className={`lg-rank ${h.level}`}>{i + 1}</span>
                  <span className="lg-hotspot-main">
                    <strong>{icon} {t(`type.${h.topType}`)} · {h.count} {t('map.hotspot.reports')}</strong>
                    <small>
                      {t('map.hotspot.score')} {h.score} · {t(`map.hotspot.level.${h.level}`)}
                    </small>
                  </span>
                  <span className="lg-hotspot-go">{t('map.focus')} ›</span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}