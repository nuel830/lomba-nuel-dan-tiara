import { useLanguage } from '../../context/LanguageContext.jsx'
import { REPORT_TYPES, REPORT_STATUSES } from '../../lib/constants.js'

// Filter jenis, status, dan periode. `counts` = jumlah laporan per jenis.
export default function MapFilters({
  types, statuses, days, showHotspots, counts,
  onToggleType, onToggleStatus, onDays, onToggleHotspots, onReset,
}) {
  const { t } = useLanguage()

  return (
    <div className="lg-filters">
      <div className="lg-filter-group">
        <h4>{t('map.filter.type')}</h4>
        <div className="lg-filter-chips">
          {REPORT_TYPES.map((x) => (
            <button
              key={x.value}
              type="button"
              className={`lg-fchip ${types.has(x.value) ? 'on' : ''}`}
              onClick={() => onToggleType(x.value)}
              aria-pressed={types.has(x.value)}
            >
              {x.icon} {t(`type.${x.value}`)} <em>{counts[x.value] ?? 0}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="lg-filter-group">
        <h4>{t('map.filter.status')}</h4>
        <div className="lg-filter-chips">
          {REPORT_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`lg-fchip ${statuses.has(s) ? 'on' : ''}`}
              onClick={() => onToggleStatus(s)}
              aria-pressed={statuses.has(s)}
            >
              {t(`status.${s}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="lg-filter-group">
        <h4>{t('map.filter.period')}</h4>
        <select className="lg-select" value={days} onChange={(e) => onDays(Number(e.target.value))}>
          <option value={0}>{t('map.period.all')}</option>
          <option value={7}>{t('map.period.7')}</option>
          <option value={30}>{t('map.period.30')}</option>
        </select>
      </div>

      <label className="lg-switch">
        <input type="checkbox" checked={showHotspots} onChange={onToggleHotspots} />
        <span>{t('map.hotspot.show')}</span>
      </label>

      <button type="button" className="lg-link-btn" onClick={onReset}>{t('map.filter.reset')}</button>
    </div>
  )
}