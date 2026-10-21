import { useLanguage } from '../context/LanguageContext.jsx'
import ComingSoon from '../components/common/ComingSoon.jsx'

export default function MissionsPage() {
  const { t } = useLanguage()
  return (
    <section>
      <h1>{t('missions.title')}</h1>
      <ComingSoon note="Daftar misi bersih-bersih + foto sebelum/sesudah" />
    </section>
  )
}