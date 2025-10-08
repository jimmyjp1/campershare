import React, { useState, useEffect } from 'react'
import { useCookies, COOKIE_CATEGORIES } from '../services/browserCookieManager'
import { 
  XMarkIcon, 
  Cog6ToothIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  MegaphoneIcon 
} from '@heroicons/react/24/outline'

// Cookie Banner Component
export function CookieBanner() {
  const { showBanner, acceptAll, acceptNecessaryOnly, openSettings } = useCookies()
  const [isClient, setIsClient] = useState(false)

  // Client-only rendering um Hydration Errors zu vermeiden
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-zinc-800/90 border border-white/20 dark:border-zinc-700/50 shadow-xl">
          {/* Glassmorphism Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-teal-500/10 opacity-50" />
          
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col gap-4">
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      Wir verwenden Cookies
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Wir nutzen Cookies und ähnliche Technologien, um Ihnen die bestmögliche Erfahrung auf CamperShare zu bieten. 
                      Notwendige Cookies sind für die Grundfunktionen erforderlich, während optionale Cookies uns helfen, 
                      unsere Plattform zu verbessern und Ihnen personalisierte Inhalte zu zeigen.
                    </p>
                  </div>
                </div>

                {/* Cookie Categories Preview and Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                      <ShieldCheckIcon className="w-3 h-3" />
                      Notwendig
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                      <Cog6ToothIcon className="w-3 h-3" />
                      Funktional
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                      <ChartBarIcon className="w-3 h-3" />
                      Analytik
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium">
                      <MegaphoneIcon className="w-3 h-3" />
                      Marketing
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                    <button
                      onClick={acceptAll}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Alle akzeptieren
                    </button>
                    
                    <button
                      onClick={acceptNecessaryOnly}
                      className="px-6 py-3 bg-white/80 dark:bg-zinc-700/80 hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-medium rounded-xl border border-zinc-200 dark:border-zinc-600 transition-all duration-200 hover:shadow-lg"
                    >
                      Nur Notwendige
                    </button>
                    
                    <button
                      onClick={openSettings}
                      className="px-6 py-3 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 font-medium rounded-xl border border-zinc-300 dark:border-zinc-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      Einstellungen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Cookie Settings Modal
export function CookieSettings() {
  const { showSettings, closeSettings, acceptCustom, preferences } = useCookies()
  const [isClient, setIsClient] = useState(false)
  const [customPrefs, setCustomPrefs] = useState({
    [COOKIE_CATEGORIES.NECESSARY]: true,
    [COOKIE_CATEGORIES.FUNCTIONAL]: false,
    [COOKIE_CATEGORIES.ANALYTICS]: false,
    [COOKIE_CATEGORIES.MARKETING]: false,
  })

  // Client-only initialization
  useEffect(() => {
    setIsClient(true)
    setCustomPrefs({
      [COOKIE_CATEGORIES.NECESSARY]: true,
      [COOKIE_CATEGORIES.FUNCTIONAL]: preferences[COOKIE_CATEGORIES.FUNCTIONAL] || false,
      [COOKIE_CATEGORIES.ANALYTICS]: preferences[COOKIE_CATEGORIES.ANALYTICS] || false,
      [COOKIE_CATEGORIES.MARKETING]: preferences[COOKIE_CATEGORIES.MARKETING] || false,
    })
  }, [preferences])

  if (!isClient || !showSettings) return null

  const cookieInfo = {
    [COOKIE_CATEGORIES.NECESSARY]: {
      title: 'Notwendige Cookies',
      icon: ShieldCheckIcon,
      description: 'Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich. Sie ermöglichen grundlegende Funktionen wie Sicherheit, Netzwerkmanagement und Zugänglichkeit.',
      examples: ['Sitzungs-IDs', 'Sicherheits-Token', 'Cookie-Einstellungen'],
      color: 'green'
    },
    [COOKIE_CATEGORIES.FUNCTIONAL]: {
      title: 'Funktionale Cookies',
      icon: Cog6ToothIcon,
      description: 'Diese Cookies erweitern die Funktionalität der Website und personalisieren Ihre Erfahrung. Sie merken sich Ihre Präferenzen und Interaktionen.',
      examples: ['Suchverlauf', 'Zuletzt angesehen', 'Bevorzugte Filter', 'Standort-Einstellungen'],
      color: 'blue'
    },
    [COOKIE_CATEGORIES.ANALYTICS]: {
      title: 'Analytische Cookies',
      icon: ChartBarIcon,
      description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, indem sie anonymisierte Informationen sammeln und über die Leistung berichten.',
      examples: ['Google Analytics', 'Nutzungsstatistiken', 'Performance-Monitoring'],
      color: 'purple'
    },
    [COOKIE_CATEGORIES.MARKETING]: {
      title: 'Marketing Cookies',
      icon: MegaphoneIcon,
      description: 'Diese Cookies werden verwendet, um Ihnen relevante Werbung und Inhalte basierend auf Ihren Interessen anzuzeigen und die Effektivität von Werbekampagnen zu messen.',
      examples: ['Facebook Pixel', 'Google Ads', 'Retargeting', 'Personalisierte Angebote'],
      color: 'orange'
    }
  }

  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700',
    blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
    purple: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700',
    orange: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700'
  }

  const togglePreference = (category) => {
    if (category === COOKIE_CATEGORIES.NECESSARY) return // Kann nicht deaktiviert werden
    
    setCustomPrefs(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleSave = () => {
    acceptCustom(customPrefs)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSettings} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/95 dark:bg-zinc-800/95 border border-white/20 dark:border-zinc-700/50 shadow-2xl">
            {/* Glassmorphism Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/5" />
            
            <div className="relative">
              {/* Header */}
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                      <Cog6ToothIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        Cookie-Einstellungen
                      </h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Passen Sie Ihre Datenschutz-Präferenzen an
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeSettings}
                    className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-6">
                  {Object.entries(cookieInfo).map(([category, info]) => {
                    const IconComponent = info.icon
                    const isEnabled = customPrefs[category]
                    const isNecessary = category === COOKIE_CATEGORIES.NECESSARY
                    
                    return (
                      <div
                        key={category}
                        className={`rounded-xl border p-6 transition-all duration-200 ${
                          isEnabled ? colorClasses[info.color] : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                              isEnabled 
                                ? `bg-${info.color}-500 text-white` 
                                : 'bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-400'
                            }`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                                {info.title}
                              </h3>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                                {info.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                <span className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">Beispiele:</span>
                                {info.examples.map((example, index) => (
                                  <span
                                    key={index}
                                    className="inline-block px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-md"
                                  >
                                    {example}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => togglePreference(category)}
                              disabled={isNecessary}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                isEnabled
                                  ? 'bg-blue-600'
                                  : 'bg-zinc-300 dark:bg-zinc-600'
                              } ${isNecessary ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        
                        {isNecessary && (
                          <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
                            Diese Cookies sind immer aktiv und können nicht deaktiviert werden.
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={closeSettings}
                    className="px-6 py-2.5 text-zinc-600 dark:text-zinc-400 font-medium rounded-lg border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Einstellungen speichern
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Cookie Status Button (für Footer/Header)
export function CookieStatusButton() {
  const { openSettings, preferences } = useCookies()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  const activeCategories = Object.entries(preferences)
    .filter(([key, value]) => key !== 'bannerShown' && key !== 'consentGiven' && key !== 'consentDate' && value === true)
    .length

  return (
    <button
      onClick={openSettings}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
    >
      <Cog6ToothIcon className="w-4 h-4" />
      Cookie-Einstellungen ({activeCategories}/4)
    </button>
  )
}
