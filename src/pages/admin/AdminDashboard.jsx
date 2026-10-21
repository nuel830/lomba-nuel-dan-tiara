import { useLanguage } from '../../context/LanguageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import ComingSoon from '../../components/common/ComingSoon.jsx'

export default function AdminDashboard() {
  const { t } = useLanguage()
  const { signOut } = useAuth()
  return (
    <section>
      <h1>{t('admin.title')}</h1>
      <button className="btn-ghost" onClick={signOut}>Keluar</button>
      <ComingSoon note="Verifikasi laporan, ubah status, buat misi" />
    </section>
  )
}