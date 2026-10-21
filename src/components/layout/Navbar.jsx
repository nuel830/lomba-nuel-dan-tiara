import { NavLink, Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'

const links = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/lapor', key: 'nav.report' },
  { to: '/lacak', key: 'nav.track' },
  { to: '/peta', key: 'nav.map' },
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/misi', key: 'nav.missions' },
]

export default function Navbar() {
  const { t, lang, changeLang } = useLanguage()
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">Lake<span>Guard</span></Link>
        <nav className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>{t(l.key)}</NavLink>
          ))}
        </nav>
        <div className="nav-right">
          <button className="btn-lang" onClick={() => changeLang(lang === 'id' ? 'en' : 'id')}>
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
          <Link to="/login" className="btn-ghost">{t('nav.login')}</Link>
        </div>
      </div>
    </header>
  )
}