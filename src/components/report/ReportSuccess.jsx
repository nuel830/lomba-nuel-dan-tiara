import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function ReportSuccess({ code, photoFailed, onNew }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Abaikan: pengguna masih bisa menyalin kode secara manual
    }
  }

  return (
    <div className="lg-report-form lg-success">
      <div className="lg-success-icon">✓</div>
      <h2>{t('success.title')}</h2>
      <p className="lg-hint">{t('success.desc')}</p>

      <div className="lg-success-code-box">
        <span>{t('success.code')}</span>
        <strong data-testid="report-code">{code}</strong>
      </div>

      {photoFailed && <div className="lg-form-message error">{t('success.photoWarn')}</div>}

      <div className="lg-success-actions">
        <button type="button" className="lg-btn-secondary" onClick={copyCode}>
          {copied ? t('success.copied') : t('success.copy')}
        </button>
        <Link to={`/lacak/${code}`} className="lg-btn-primary">{t('success.track')}</Link>
        <button type="button" className="lg-btn-secondary" onClick={onNew}>{t('success.new')}</button>
      </div>
    </div>
  )
}