import { useLanguage } from '../context/LanguageContext.jsx'
import ComingSoon from '../components/common/ComingSoon.jsx'

export default function DashboardPage() {
  const { t } = useLanguage()
  return (
    <section>
      <h1>{t('dashboard.title')}</h1>
      <ComingSoon note="Grafik laporan per zona, jenis, bulan + skor prioritas" />
    </section>
  )
}