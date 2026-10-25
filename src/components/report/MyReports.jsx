import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { REPORT_TYPES } from '../../lib/constants.js'
import { formatDateTime } from '../../lib/format.js'
import { getReportsByCodes } from '../../services/reportService.js'

const MY_REPORTS_KEY = 'lg_my_reports'

function readCodes() {
  try {
    return JSON.parse(localStorage.getItem(MY_REPORTS_KEY) || '[]').slice(0, 10)
  } catch {
    return []
  }
}

// Daftar laporan yang dikirim dari perangkat ini (kodenya disimpan form lapor di localStorage).
export default function MyReports() {
  const { t, lang } = useLanguage()
  const [codes, setCodes] = useState(readCodes)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(codes.length > 0)

  useEffect(() => {
    if (codes.length === 0) return
    let cancelled = false
    getReportsByCodes(codes).then(({ data }) => {
      if (cancelled) return
      setRows(data ?? [])
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [codes])

  function clearHistory() {
    try { localStorage.removeItem(MY_REPORTS_KEY) } catch { /* abaikan */ }
    setCodes([])
    setRows([])
  }

  // Urutan sesuai waktu kirim terbaru; kode yang tak ada di database tetap ditampilkan
  const byCode = Object.fromEntries(rows.map((r) => [r.code, r]))

  return (
    <section className="lg-my" data-testid="my-reports">
      <div className="lg-my-head">
        <h3>{t('track.my.title')}</h3>
        {codes.length > 0 && (
          <button type="button" className="lg-link-btn" onClick={clearHistory}>{t('track.my.clear')}</button>
        )}
      </div>

      {codes.length === 0 ? (
        <p className="lg-muted">{t('track.my.empty')}</p>
      ) : (
        <ul className="lg-my-list">
          {codes.map((code) => {
            const r = byCode[code]
            const icon = r && REPORT_TYPES.find((x) => x.value === r.type)?.icon
            return (
              <li key={code}>
                <Link to={`/lacak/${code}`} className="lg-my-item">
                  <span className="lg-my-icon">{icon ?? '📄'}</span>
                  <span className="lg-my-main">
                    <strong>{code}</strong>
                    <small>
                      {r
                        ? `${t(`type.${r.type}`)} · ${formatDateTime(r.created_at, lang)}`
                        : loading ? t('track.my.loading') : ''}
                    </small>
                  </span>
                  {r && <span className={`lg-pill ${r.status}`}>{t(`status.${r.status}`)}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}