import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getReportByCode } from '../services/reportService.js'
import { normalizeCode, isValidCode } from '../lib/reportCode.js'
import TrackResult from '../components/report/TrackResult.jsx'
import MyReports from '../components/report/MyReports.jsx'
import './TrackPage.css'

export default function TrackPage() {
  const { t } = useLanguage()
  const { code: codeParam } = useParams()
  const navigate = useNavigate()
  const code = codeParam ? normalizeCode(codeParam) : ''

  const [input, setInput] = useState(codeParam ?? '')
  // status: idle | loading | found | notfound | invalid | error
  const [state, setState] = useState({ status: 'idle', report: null, errorKey: '' })
  const requestId = useRef(0)

  const load = useCallback(async (c) => {
    const id = ++requestId.current // abaikan jawaban lama bila kode berganti cepat
    if (!c) return setState({ status: 'idle', report: null, errorKey: '' })
    if (!isValidCode(c)) return setState({ status: 'invalid', report: null, errorKey: '' })

    setState((s) => ({ status: 'loading', report: s.report?.code === c ? s.report : null, errorKey: '' }))
    const { data, error } = await getReportByCode(c)
    if (id !== requestId.current) return

    if (error) {
      console.error('Gagal mengambil laporan:', error)
      const key = error.message === 'NO_DB'
        ? 'track.err.nodb'
        : /failed to fetch|network/i.test(error.message) ? 'track.err.network' : 'track.err.generic'
      return setState({ status: 'error', report: null, errorKey: key })
    }
    setState(data ? { status: 'found', report: data, errorKey: '' } : { status: 'notfound', report: null, errorKey: '' })
  }, [])

  useEffect(() => {
    setInput(codeParam ?? '')
    load(code)
  }, [code, codeParam, load])

  function handleSubmit(event) {
    event.preventDefault()
    const c = normalizeCode(input)
    if (!c) return setState({ status: 'invalid', report: null, errorKey: '' })
    if (c === code) load(c)
    else navigate(`/lacak/${c}`)
  }

  const loading = state.status === 'loading'

  return (
    <section className="lg-track">
      <h1>{t('track.title')}</h1>
      <p className="lg-muted lg-track-sub">{t('track.subtitle')}</p>

      <form className="lg-track-search" onSubmit={handleSubmit} noValidate>
        <input
          className="lg-track-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('track.placeholder')}
          aria-label={t('track.title')}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={20}
        />
        <button className="lg-track-btn primary" type="submit" disabled={loading}>
          {loading ? '...' : t('track.button')}
        </button>
      </form>

      {state.status === 'invalid' && <p className="lg-track-msg error" role="alert">{t('track.invalid')}</p>}
      {state.status === 'notfound' && <p className="lg-track-msg error" role="alert">{t('track.notfound')}</p>}
      {state.status === 'error' && (
        <div className="lg-track-msg error" role="alert">
          {t(state.errorKey)}{' '}
          <button type="button" className="lg-link-btn" onClick={() => load(code)}>{t('track.retry')}</button>
        </div>
      )}
      {loading && !state.report && <p className="lg-track-msg">{t('track.loading')}</p>}

      {state.report && (
        <TrackResult report={state.report} refreshing={loading} onRefresh={() => load(code)} />
      )}

      {state.status === 'idle' && <MyReports />}
    </section>
  )
}