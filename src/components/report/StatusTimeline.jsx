import { REPORT_STATUSES } from '../../lib/constants.js'
import { formatDateTime } from '../../lib/format.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

// Timeline vertikal: Dilaporkan -> Diverifikasi -> Dijadwalkan -> Selesai.
// `history` = baris dari tabel report_status_history (status, note, created_at).
export default function StatusTimeline({ current = 'reported', history = [], createdAt }) {
  const { t, lang } = useLanguage()
  const currentIndex = Math.max(0, REPORT_STATUSES.indexOf(current))

  // Ambil catatan terbaru untuk tiap status
  const latest = {}
  history.forEach((h) => {
    if (!latest[h.status] || new Date(h.created_at) > new Date(latest[h.status].created_at)) {
      latest[h.status] = h
    }
  })
  if (!latest.reported && createdAt) latest.reported = { created_at: createdAt }

  return (
    <ol className="lg-timeline">
      {REPORT_STATUSES.map((status, i) => {
        const isLast = i === REPORT_STATUSES.length - 1
        // Langkah terakhir yang sudah dicapai berarti proses tuntas, jadi ditandai selesai (hijau)
        const state = i < currentIndex ? 'done' : i === currentIndex ? (isLast ? 'done' : 'current') : 'todo'
        const entry = latest[status]
        return (
          <li key={status} className={`lg-tl-item ${state}`}>
            <span className="lg-tl-dot">{state === 'done' ? '✓' : i + 1}</span>
            <div className="lg-tl-body">
              <strong>{t(`status.${status}`)}</strong>
              <p>{t(`status.${status}.desc`)}</p>
              {entry?.created_at && state !== 'todo' && (
                <time>{formatDateTime(entry.created_at, lang)}</time>
              )}
              {entry?.note && state !== 'todo' && (
                <p className="lg-tl-note">{t('track.note')}: {entry.note}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}