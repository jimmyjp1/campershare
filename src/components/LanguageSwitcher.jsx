import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/services/multilanguageService'

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Defensive check for supportedLanguages and currentLanguage
  if (!supportedLanguages || !currentLanguage || !supportedLanguages[currentLanguage]) {
    console.warn('LanguageSwitcher: Missing language data', { supportedLanguages, currentLanguage })
    return null
  }

  const currentLang = supportedLanguages[currentLanguage]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors bg-white/90 dark:bg-zinc-800/90 px-3 py-2 rounded-full shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:ring-white/10"
        aria-label="Language switcher"
        aria-expanded={isOpen}
      >
        <span className="text-lg" role="img" aria-label={`${currentLang.name} flag`}>
          {currentLang.flag}
        </span>
        <span className="hidden sm:block">{currentLang.name}</span>
        <svg 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-zinc-800 dark:ring-white/10 backdrop-blur-sm">
          {Object.entries(supportedLanguages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => {
                changeLanguage(code)
                setIsOpen(false)
              }}
              className={`group flex w-full items-center px-4 py-3 text-sm transition-colors ${
                currentLanguage === code 
                  ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400' 
                  : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700/50'
              }`}
              role="menuitem"
            >
              <span className="mr-3 text-lg" role="img" aria-label={`${lang.name} flag`}>
                {lang.flag}
              </span>
              <span className="flex-1 text-left">{lang.name}</span>
              {currentLanguage === code && (
                <span className="ml-auto text-sm text-teal-500" aria-label="Current language">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
