import { useLanguage } from '../context/LanguageContext.jsx'
import ComingSoon from '../components/common/ComingSoon.jsx'

export default function TrackPage() {
  const { t } = useLanguage()
  return (
    <section>
      <h1>{t('track.title')}</h1>
      <ComingSoon note="Cek status laporan lewat kode (/lacak/:code)" />
    </section>
  )
}