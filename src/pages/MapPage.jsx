import { useLanguage } from '../context/LanguageContext.jsx'
import { useReports } from '../hooks/useReports.js'
import LakeMap from '../components/map/LakeMap.jsx'

export default function MapPage() {
  const { t } = useLanguage()
  const { reports } = useReports()
  return (
    <section>
      <h1>{t('map.title')}</h1>
      <LakeMap reports={reports} />
    </section>
  )
}