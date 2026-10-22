import { useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import ReportForm from '../components/report/ReportForm.jsx'

export default function ReportPage() {
  const { t } = useLanguage()
  const { locationId } = useParams() // terisi bila datang dari QR titik tertentu
  return (
    <section>
      <h1>{t('report.title')}</h1>
      <ReportForm locationId={locationId} />
    </section>
  )
}