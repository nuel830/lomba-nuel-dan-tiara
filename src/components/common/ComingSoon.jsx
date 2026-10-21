import { useLanguage } from '../../context/LanguageContext.jsx'

// Penanda bagian yang kerangkanya ada tapi isinya belum dibuat.
export default function ComingSoon({ note }) {
  const { t } = useLanguage()
  return (
    <div className="card soon">
      <strong>{t('common.soon')}</strong>
      {note && <p className="muted">{note}</p>}
    </div>
  )
}