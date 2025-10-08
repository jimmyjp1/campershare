// Cookie Management Service für CamperShare
import { useState, useEffect, createContext, useContext } from 'react'

// Cookie-Kategorien definieren
export const COOKIE_CATEGORIES = {
  NECESSARY: 'necessary',
  FUNCTIONAL: 'functional', 
  ANALYTICS: 'analytics',
  MARKETING: 'marketing'
}

// Standard Cookie-Einstellungen
export const DEFAULT_COOKIE_PREFERENCES = {
  [COOKIE_CATEGORIES.NECESSARY]: true,  // Immer aktiv
  [COOKIE_CATEGORIES.FUNCTIONAL]: false,
  [COOKIE_CATEGORIES.ANALYTICS]: false,
  [COOKIE_CATEGORIES.MARKETING]: false,
  bannerShown: false,
  consentGiven: false,
  consentDate: null
}

class CookieService {
  constructor() {
    this.cookieKey = 'campershare_cookie_preferences'
    this.preferences = this.loadPreferences()
  }

  // Cookie-Präferenzen laden
  loadPreferences() {
    if (typeof window === 'undefined') return DEFAULT_COOKIE_PREFERENCES
    
    try {
      const saved = localStorage.getItem(this.cookieKey)
      if (saved) {
        return { ...DEFAULT_COOKIE_PREFERENCES, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.warn('Fehler beim Laden der Cookie-Präferenzen:', error)
    }
    
    return DEFAULT_COOKIE_PREFERENCES
  }

  // Cookie-Präferenzen speichern
  savePreferences(preferences) {
    this.preferences = { 
      ...this.preferences, 
      ...preferences,
      consentDate: new Date().toISOString()
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.cookieKey, JSON.stringify(this.preferences))
    }
    
    return this.preferences
  }

  // Alle Cookies akzeptieren
  acceptAll() {
    return this.savePreferences({
      [COOKIE_CATEGORIES.NECESSARY]: true,
      [COOKIE_CATEGORIES.FUNCTIONAL]: true,
      [COOKIE_CATEGORIES.ANALYTICS]: true,
      [COOKIE_CATEGORIES.MARKETING]: true,
      bannerShown: true,
      consentGiven: true
    })
  }

  // Nur notwendige Cookies akzeptieren
  acceptNecessaryOnly() {
    return this.savePreferences({
      [COOKIE_CATEGORIES.NECESSARY]: true,
      [COOKIE_CATEGORIES.FUNCTIONAL]: false,
      [COOKIE_CATEGORIES.ANALYTICS]: false,
      [COOKIE_CATEGORIES.MARKETING]: false,
      bannerShown: true,
      consentGiven: true
    })
  }

  // Custom Cookie-Auswahl
  acceptCustom(customPreferences) {
    return this.savePreferences({
      ...customPreferences,
      [COOKIE_CATEGORIES.NECESSARY]: true, // Immer true
      bannerShown: true,
      consentGiven: true
    })
  }

  // === LOCATION SERVICES ===
  
  // Nutzer-Standort speichern
  saveUserLocation(location) {
    if (!this.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return null
    
    const locationData = {
      lat: location.lat,
      lng: location.lng,
      address: location.address || '',
      city: location.city || '',
      country: location.country || '',
      timestamp: new Date().toISOString(),
      source: location.source || 'manual' // 'geolocation', 'manual', 'search'
    }
    
    localStorage.setItem('userLocation', JSON.stringify(locationData))
    localStorage.setItem('lastLocationUpdate', Date.now().toString())
    return locationData
  }

  // Gespeicherten Standort abrufen
  getUserLocation() {
    if (!this.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return null
    
    try {
      const locationStr = localStorage.getItem('userLocation')
      const lastUpdate = localStorage.getItem('lastLocationUpdate')
      
      if (locationStr && lastUpdate) {
        const location = JSON.parse(locationStr)
        const updateTime = parseInt(lastUpdate)
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        
        // Location ist nur 1 Woche gültig
        if (updateTime > oneWeekAgo) {
          return location
        }
      }
    } catch (error) {
      console.warn('Error reading user location:', error)
    }
    
    return null
  }

  // Heimat-Standort setzen (für wiederkehrende Nutzer)
  setHomeLocation(location) {
    if (!this.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return null
    
    const homeData = {
      ...location,
      isHome: true,
      savedAt: new Date().toISOString()
    }
    
    localStorage.setItem('homeLocation', JSON.stringify(homeData))
    return homeData
  }

  // Heimat-Standort abrufen
  getHomeLocation() {
    if (!this.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return null
    
    try {
      const homeStr = localStorage.getItem('homeLocation')
      return homeStr ? JSON.parse(homeStr) : null
    } catch (error) {
      console.warn('Error reading home location:', error)
      return null
    }
  }

  // Standort-Verlauf speichern
  addToLocationHistory(location) {
    if (!this.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return []
    
    try {
      const historyStr = localStorage.getItem('locationHistory')
      let history = historyStr ? JSON.parse(historyStr) : []
      
      // Duplikate vermeiden (gleiche Stadt)
      history = history.filter(loc => loc.city !== location.city)
      
      // Neue Location hinzufügen
      history.unshift({
        ...location,
        visitedAt: new Date().toISOString()
      })
      
      // Maximal 10 Einträge behalten
      history = history.slice(0, 10)
      
      localStorage.setItem('locationHistory', JSON.stringify(history))
      return history
    } catch (error) {
      console.warn('Error saving location history:', error)
      return []
    }
  }

  // Standort-Verlauf abrufen
  getLocationHistory() {
    if (!this.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return []
    
    try {
      const historyStr = localStorage.getItem('locationHistory')
      return historyStr ? JSON.parse(historyStr) : []
    } catch (error) {
      console.warn('Error reading location history:', error)
      return []
    }
  }

  // Cookie-Status prüfen
  isAllowed(category) {
    return this.preferences[category] === true
  }

  // Banner wurde bereits gezeigt?
  isBannerShown() {
    return this.preferences.bannerShown === true
  }

  // Consent wurde gegeben?
  hasConsent() {
    return this.preferences.consentGiven === true
  }

  // Aktuelle Präferenzen abrufen
  getPreferences() {
    return this.preferences
  }

  // Cookie setzen (nur wenn erlaubt)
  setCookie(name, value, category = COOKIE_CATEGORIES.NECESSARY, days = 30) {
    if (!this.isAllowed(category)) {
      return false
    }

    if (typeof window === 'undefined') return false

    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
    return true
  }

  // Cookie lesen
  getCookie(name) {
    if (typeof window === 'undefined') return null
    
    const nameEQ = name + '='
    const cookies = document.cookie.split(';')
    
    for (let cookie of cookies) {
      let c = cookie.trim()
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length)
      }
    }
    
    return null
  }

  // Cookie löschen
  deleteCookie(name) {
    if (typeof window === 'undefined') return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  }

  // Alle Cookies einer Kategorie löschen
  clearCategoryData(category) {
    if (typeof window === 'undefined') return

    // Je nach Kategorie entsprechende Daten löschen
    switch (category) {
      case COOKIE_CATEGORIES.FUNCTIONAL:
        // Funktionale Daten löschen
        localStorage.removeItem('campershare_recent_searches')
        localStorage.removeItem('campershare_search_filters')
        localStorage.removeItem('campershare_user_location')
        break
        
      case COOKIE_CATEGORIES.ANALYTICS:
        // Analytics Daten löschen
        localStorage.removeItem('campershare_analytics_id')
        this.deleteCookie('_ga')
        this.deleteCookie('_gid')
        break
        
      case COOKIE_CATEGORIES.MARKETING:
        // Marketing Daten löschen
        localStorage.removeItem('campershare_marketing_prefs')
        this.deleteCookie('facebook_pixel')
        break
    }
  }

    // Einstellungen zurücksetzen
  resetAll() {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.cookieKey)
    this.preferences = DEFAULT_COOKIE_PREFERENCES
    
    // Alle Cookie-Kategorien durchgehen und Daten löschen
    Object.values(COOKIE_CATEGORIES).forEach(category => {
      if (category !== COOKIE_CATEGORIES.NECESSARY) {
        this.clearCategoryData(category)
      }
    })
  }

  // Cookie-Banner für Tests zurücksetzen
  resetBannerForTesting() {
    if (typeof window === 'undefined') return
    
    this.preferences = {
      ...this.preferences,
      bannerShown: false,
      consentGiven: false,
      consentDate: null
    }
    
    localStorage.setItem(this.cookieKey, JSON.stringify(this.preferences))
    console.log('🍪 Cookie-Banner wurde zurückgesetzt - Seite neu laden um Banner zu sehen')
  }
}

// Singleton Service
export const cookieService = new CookieService()

// React Context für Cookie-Management
const CookieContext = createContext()

export function CookieProvider({ children }) {
  const [preferences, setPreferences] = useState(DEFAULT_COOKIE_PREFERENCES)
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Client-only initialization um Hydration Errors zu vermeiden
  useEffect(() => {
    setIsClient(true)
    const clientPrefs = cookieService.getPreferences()
    setPreferences(clientPrefs)
    setShowBanner(!cookieService.isBannerShown())
  }, [])

  const updatePreferences = (newPrefs) => {
    const updated = cookieService.savePreferences(newPrefs)
    setPreferences(updated)
    setShowBanner(false)
  }

  const acceptAll = () => {
    const updated = cookieService.acceptAll()
    setPreferences(updated)
    setShowBanner(false)
  }

  const acceptNecessaryOnly = () => {
    const updated = cookieService.acceptNecessaryOnly()
    setPreferences(updated)
    setShowBanner(false)
  }

  const acceptCustom = (customPrefs) => {
    const updated = cookieService.acceptCustom(customPrefs)
    setPreferences(updated)
    setShowBanner(false)
    setShowSettings(false)
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  const closeSettings = () => {
    setShowSettings(false)
  }

  const isAllowed = (category) => {
    return cookieService.isAllowed(category)
  }

  return (
    <CookieContext.Provider value={{
      preferences,
      showBanner,
      showSettings,
      updatePreferences,
      acceptAll,
      acceptNecessaryOnly,
      acceptCustom,
      openSettings,
      closeSettings,
      isAllowed,
      setShowBanner
    }}>
      {children}
    </CookieContext.Provider>
  )
}

// Hook für Cookie-Management
export function useCookies() {
  const context = useContext(CookieContext)
  if (!context) {
    throw new Error('useCookies muss innerhalb eines CookieProviders verwendet werden')
  }
  return context
}

// Funktionale Cookie-Funktionen
export const functionalCookies = {
  // Suchhistorie speichern
  saveSearch: (searchTerm, filters) => {
    if (!cookieService.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return
    
    const searches = JSON.parse(localStorage.getItem('campershare_recent_searches') || '[]')
    const newSearch = {
      term: searchTerm,
      filters,
      timestamp: Date.now()
    }
    
    searches.unshift(newSearch)
    localStorage.setItem('campershare_recent_searches', JSON.stringify(searches.slice(0, 10)))
  },

  // Zuletzt angesehene Fahrzeuge
  addRecentVehicle: (vehicle) => {
    if (!cookieService.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return
    
    const recent = JSON.parse(localStorage.getItem('campershare_recent_vehicles') || '[]')
    const filtered = recent.filter(v => v.id !== vehicle.id)
    
    filtered.unshift({
      id: vehicle.id,
      name: vehicle.name,
      imageUrl: vehicle.imageUrl,
      pricePerDay: vehicle.pricePerDay,
      location: vehicle.location,
      timestamp: Date.now()
    })
    
    localStorage.setItem('campershare_recent_vehicles', JSON.stringify(filtered.slice(0, 8)))
  },

  // Bevorzugte Filter speichern
  savePreferredFilters: (filters) => {
    if (!cookieService.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return
    localStorage.setItem('campershare_preferred_filters', JSON.stringify(filters))
  },

  // User Location
  saveUserLocation: (location) => {
    if (!cookieService.isAllowed(COOKIE_CATEGORIES.FUNCTIONAL)) return
    localStorage.setItem('campershare_user_location', JSON.stringify(location))
  }
}

// Debug-Funktion global verfügbar machen (nur in Development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.resetCookieBanner = () => {
    cookieService.resetBannerForTesting()
  }
  
  window.showCookieStatus = () => {
    console.log('🍪 Cookie Status:', cookieService.getPreferences())
  }
}

export default cookieService
