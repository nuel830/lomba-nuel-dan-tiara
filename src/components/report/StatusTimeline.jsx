import { REPORT_STATUSES } from '../../lib/constants.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function StatusTimeline({ current = 'reported' }) {
  const { t } = useLanguage()
  const currentIndex = REPORT_STATUSES.indexOf(current)
  return (
    <ol className="timeline">
      {REPORT_STATUSES.map((s, i) => (
        <li key={s} className={i <= currentIndex ? 'done' : ''}>{t(`status.${s}`)}</li>
      ))}
    </ol>
  )
}