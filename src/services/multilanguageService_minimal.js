import { createContext, useContext, useState, useEffect } from 'react'

// Supported languages
export const SUPPORTED_LANGUAGES = {
  'de': {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€'
  },
  'en': {
    code: 'en', 
    name: 'English',
    flag: '🇺🇸',
    currency: 'EUR',
    currencySymbol: '€'
  }
}

// Translation data
const translations = {
  de: {
    analytics: {
      title: 'Analytics Dashboard',
      overview: 'Überblick über Buchungen, Umsatz und Leistung',
      loadingDashboard: 'Lade Dashboard...',
      loadingError: 'Fehler beim Laden der Daten',
      tryAgain: 'Erneut versuchen',
      '7days': '7 Tage',
      '30days': '30 Tage',
      '90days': '90 Tage',
      '1year': '1 Jahr',
      totalBookings: 'Gesamtbuchungen',
      totalRevenue: 'Gesamtumsatz',
      avgBookingValue: 'Ø Buchungswert',
      uniqueCustomers: 'Unique Kunden',
      noDataAvailable: 'Keine Daten verfügbar',
      camper: 'Camper',
      location: 'Standort',
      bookings: 'Buchungen',
      revenue: 'Umsatz',
      occupancyRate: 'Auslastung',
      topPerformingCampers: 'Top Performing Campers',
      revenueLastYear: 'Umsatz der letzten 12 Monate',
      recentActivity: 'Letzte Aktivitäten',
      newBookings: 'Neue Buchungen',
      noRecentActivity: 'Keine aktuellen Aktivitäten',
      booked: 'buchte',
      booking: 'Buchung',
      metaDescription: 'Analytics und Statistiken für CamperShare',
      performanceOverview: 'Übersicht über Performance, Umsätze und Trends'
    }
  },
  en: {
    analytics: {
      title: 'Analytics Dashboard',
      overview: 'Overview of bookings, revenue and performance',
      loadingDashboard: 'Loading dashboard...',
      loadingError: 'Error loading data',
      tryAgain: 'Try again',
      '7days': '7 Days',
      '30days': '30 Days', 
      '90days': '90 Days',
      '1year': '1 Year',
      totalBookings: 'Total Bookings',
      totalRevenue: 'Total Revenue',
      avgBookingValue: 'Avg. Booking Value',
      uniqueCustomers: 'Unique Customers',
      noDataAvailable: 'No data available',
      camper: 'Camper',
      location: 'Location',
      bookings: 'Bookings',
      revenue: 'Revenue',
      occupancyRate: 'Occupancy Rate',
      topPerformingCampers: 'Top Performing Campers',
      revenueLastYear: 'Revenue over the last 12 months',
      recentActivity: 'Recent Activity',
      newBookings: 'New Bookings',
      noRecentActivity: 'No recent activity',
      booked: 'booked',
      booking: 'Booking',
      metaDescription: 'Analytics and statistics for CamperShare',
      performanceOverview: 'Overview of performance, revenue and trends'
    }
  }
}

// Language Context
const LanguageContext = createContext()

// Language Provider Component
export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('de')

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language')
      if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
        setCurrentLanguage(savedLanguage)
      }
    }
  }, [])

  // Save language to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', currentLanguage)
    }
  }, [currentLanguage])

  const changeLanguage = (language) => {
    if (SUPPORTED_LANGUAGES[language]) {
      setCurrentLanguage(language)
    }
  }

  const t = (key, params = {}) => {
    const keys = key.split('.')
    let translation = translations[currentLanguage]
    
    for (const k of keys) {
      translation = translation?.[k]
    }
    
    if (!translation) {
      // Fallback to German if English translation not found
      translation = translations.de
      for (const k of keys) {
        translation = translation?.[k]
      }
    }
    
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`)
      return key
    }
    
    // Replace parameters in translation
    let result = translation
    Object.entries(params).forEach(([param, value]) => {
      result = result.replace(`{${param}}`, value)
    })
    
    return result
  }

  const formatPrice = (amount, currency = null) => {
    const currentCurrency = currency || SUPPORTED_LANGUAGES[currentLanguage].currencySymbol
    
    if (currentLanguage === 'de') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t,
      formatPrice,
      supportedLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use language
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
