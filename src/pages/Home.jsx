import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Home() {
  const { t } = useLanguage()
  return (
    <section className="hero">
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <Link to="/lapor" className="btn">{t('home.cta')}</Link>
    </section>
  )
}