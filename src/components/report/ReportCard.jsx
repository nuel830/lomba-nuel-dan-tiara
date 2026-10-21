import { useLanguage } from '../../context/LanguageContext.jsx'

export default function ReportCard({ report }) {
  const { t } = useLanguage()
  return (
    <div className="card">
      <strong>{t(`type.${report.type}`)}</strong>
      <p className="muted">{t(`status.${report.status}`)}</p>
    </div>
  )
}