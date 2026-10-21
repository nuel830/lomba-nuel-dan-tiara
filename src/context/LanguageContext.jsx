import { createContext, useContext, useState, useCallback } from 'react'
import { dictionaries, DEFAULT_LANG } from '../i18n/index.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lg_lang') || DEFAULT_LANG)

  const changeLang = useCallback((next) => {
    setLang(next)
    localStorage.setItem('lg_lang', next)
  }, [])

  // t('nav.home') -> teks sesuai bahasa aktif
  const t = useCallback((key) => dictionaries[lang]?.[key] ?? key, [lang])

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)