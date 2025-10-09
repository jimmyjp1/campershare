/**
 * =============================================================================
 * LANGUAGE SWITCHER KOMPONENTE
 * =============================================================================
 * 
 * Interaktiver Sprachwechsel-Button mit Dropdown-Menü für die 
 * Internationalisierung der WWISCA Camper-Rental Plattform.
 * 
 * EIGENSCHAFTEN:
 * - Dropdown-Interface mit Flaggen und Sprach-Namen
 * - Click-Outside Detection zum automatischen Schließen
 * - Visueller Indikator für aktuelle Sprache
 * - Dark Mode kompatibles Styling
 * - Accessibility-optimiert mit ARIA-Attributen
 * - Smooth Animationen für bessere UX
 * - Glassmorphism-Effekt mit Backdrop-Blur
 * 
 * INTEGRATION:
 * - Verwendet useLanguage Hook aus multilanguageService
 * - Automatisches Error Handling bei fehlenden Sprachdaten
 * - Responsive Design: Sprach-Name nur auf größeren Screens
 * 
 * VERWENDUNG:
 * <LanguageSwitcher />
 * 
 * Wird typischerweise in Header-Navigation eingebunden.
 * 
 * UNTERSTÜTZTE SPRACHEN:
 * - Definiert in multilanguageService supportedLanguages
 * - Dynamisches Rendering basierend auf verfügbaren Sprachen
 * - Einfache Erweiterung durch Konfiguration
 */
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/services/multilanguageService'

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Schließt Dropdown bei Klick außerhalb
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

  // Defensive Prüfung für Sprachdaten - verhindert Crashes bei fehlen daten
  if (!supportedLanguages || !currentLanguage || !supportedLanguages[currentLanguage]) {
    console.warn('LanguageSwitcher: Missing language data', { supportedLanguages, currentLanguage })
    return null
  }

  const currentLang = supportedLanguages[currentLanguage]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Haupt-Button mit aktueller Sprache */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors bg-white/90 dark:bg-zinc-800/90 px-3 py-2 rounded-full shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:ring-white/10"
        aria-label="Language switcher"
        aria-expanded={isOpen}
      >
        {/* Flaggen-Emoji für visuelle Sprach-Identifikation */}
        <span className="text-lg" role="img" aria-label={`${currentLang.name} flag`}>
          {currentLang.flag}
        </span>
        {/* Sprach-Name nur auf größeren Bildschirmen sichtbar */}
        <span className="hidden sm:block">{currentLang.name}</span>
        {/* Dropdown-Pfeil mit Rotation-Animation */}
        <svg 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown-Menü mit verfügbaren Sprachen */}
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
                  ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'  // Aktive Sprache
                  : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700/50'  // Andere Sprachen
              }`}
              role="menuitem"
            >
              {/* Flagge */}
              <span className="mr-3 text-lg" role="img" aria-label={`${lang.name} flag`}>
                {lang.flag}
              </span>
              {/* Sprach-Name */}
              <span className="flex-1 text-left">{lang.name}</span>
              {/* Checkmark für aktuelle Sprache */}
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
