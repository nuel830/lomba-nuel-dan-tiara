import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { REPORT_TYPES } from '../../lib/constants.js'
import { formatDateTime } from '../../lib/format.js'
import MiniMap from '../map/MiniMap.jsx'
import StatusTimeline from './StatusTimeline.jsx'

export default function TrackResult({ report, onRefresh, refreshing }) {
  const { t, lang } = useLanguage()
  const [copied, setCopied] = useState(false)
  const typeInfo = REPORT_TYPES.find((x) => x.value === report.type)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/lacak/${report.code}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Abaikan: tautan tetap ada di address bar
    }
  }

  return (
    <article className="lg-result" data-testid="track-result">
      <header className="lg-result-head">
        <div>
          <span className="lg-result-label">{t('success.code')}</span>
          <h2 data-testid="result-code">{report.code}</h2>
          <p className="lg-muted">
            {t('track.reportedAt')} {formatDateTime(report.created_at, lang)}
          </p>
        </div>
        <span className={`lg-pill ${report.status}`} data-testid="result-status">
          {t(`status.${report.status}`)}
        </span>
      </header>

      <div className="lg-chips">
        <span className="lg-chip">{typeInfo?.icon} {t(`type.${report.type}`)}</span>
        <span className="lg-chip">📏 {t(`size.${report.size}`)}</span>
        {report.has_odor && <span className="lg-chip warn">〰️ {t('form.odor')}</span>}
        {report.has_dead_fish && <span className="lg-chip warn">🐟 {t('form.deadFish')}</span>}
        {report.location_id && <span className="lg-chip">{t('track.qr')}: {report.location_id}</span>}
        {report.confirmations > 0 && (
          <span className="lg-chip">👥 {report.confirmations} {t('track.confirmations')}</span>
        )}
      </div>

      {report.description && (
        <section className="lg-result-section">
          <h3>{t('track.description')}</h3>
          <p className="lg-desc">{report.description}</p>
        </section>
      )}

      {report.photo_url && (
        <section className="lg-result-section">
          <h3>{t('track.photo')}</h3>
          <a href={report.photo_url} target="_blank" rel="noreferrer">
            <img className="lg-result-photo" src={report.photo_url} alt={t('track.photo')} />
          </a>
        </section>
      )}

      <section className="lg-result-section">
        <h3>{t('track.location')}</h3>
        <MiniMap lat={report.lat} lng={report.lng} />
        <p className="lg-muted lg-coords">
          {Number(report.lat).toFixed(5)}, {Number(report.lng).toFixed(5)} ·{' '}
          <a href={`https://www.google.com/maps?q=${report.lat},${report.lng}`} target="_blank" rel="noreferrer">
            {t('track.openMap')}
          </a>
        </p>
      </section>

      <section className="lg-result-section">
        <h3>{t('track.progress')}</h3>
        <StatusTimeline
          current={report.status}
          history={report.report_status_history ?? []}
          createdAt={report.created_at}
        />
      </section>

      <footer className="lg-result-actions">
        <button type="button" className="lg-track-btn primary" onClick={onRefresh} disabled={refreshing}>
          ↻ {t('track.refresh')}
        </button>
        <button type="button" className="lg-track-btn" onClick={copyLink}>
          {copied ? t('track.shared') : t('track.share')}
        </button>
      </footer>
    </article>
  )
}