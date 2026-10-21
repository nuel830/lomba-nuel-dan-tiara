import { useLanguage } from '../context/LanguageContext.jsx'

export default function NotFound() {
  const { t } = useLanguage()
  return <h1>{t('common.notfound')}</h1>
}