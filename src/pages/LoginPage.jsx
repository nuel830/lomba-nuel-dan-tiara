import { useLanguage } from '../context/LanguageContext.jsx'
import ComingSoon from '../components/common/ComingSoon.jsx'

export default function LoginPage() {
  const { t } = useLanguage()
  return (
    <section>
      <h1>{t('login.title')}</h1>
      <ComingSoon note="Form login admin (Supabase Auth)" />
    </section>
  )
}