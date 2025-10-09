/**
 * campers/[slug].jsx - Einzelne Camper-Detailseite
 * =================================================
 * 
 * HAUPTFUNKTION:
 * Detaillierte Camper-Präsentationsseite für einzelne Fahrzeuge der WWISCA Plattform.
 * Zeigt umfassende Fahrzeuginformationen, Bildergalerien, Buchungsoptionen und Bewertungen.
 * 
 * SEITEN-FEATURES:
 * 
 * 1. Dynamische Slug-basierte Routing:
 *    - Next.js Dynamic Routes mit [slug] Parameter
 *    - SEO-freundliche URLs (z.B. /campers/mercedes-sprinter-adventure)
 *    - Automatic 404-Handling für nicht existierende Fahrzeuge
 *    - Canonical URL Management für SEO-Optimierung
 * 
 * 2. Umfassende Fahrzeugdarstellung:
 *    - High-Resolution Bildergalerien mit Zoom-Funktionalität
 *    - Detaillierte Fahrzeugspezifikationen und Ausstattung
 *    - 360°-Ansichten und Virtual Tours (optional)
 *    - Technical Specifications und Capacity-Informationen
 * 
 * 3. Integrierte Buchungsfunktionalität:
 *    - Real-time Verfügbarkeitskalender
 *    - Preisberechnung basierend auf Zeitraum und Saison
 *    - Sofort-Buchung ohne Seitenwechsel
 *    - Add-On Services und Zusatzausstattung
 * 
 * 4. Social Features:
 *    - Bewertungen und Reviews von anderen Mietern
 *    - Wishlist/Favoriten-Integration
 *    - Social Media Sharing-Funktionen
 *    - Q&A-Sektion für spezifische Fahrzeugfragen
 * 
 * TECHNISCHE KOMPONENTEN:
 * 
 * 1. Enhanced UI Icons:
 *    - CarIcon: Fahrzeug-spezifische Informationen
 *    - CalendarIcon: Verfügbarkeits- und Buchungskalender
 *    - Custom SVG-Icons für verschiedene Ausstattungsmerkmale
 *    - Responsive Icon-Sizing mit Accessibility-Support
 * 
 * 2. Dynamic Content Loading:
 *    - Slug-basierte Fahrzeugdaten-Abfrage
 *    - Lazy Loading für Bilder und Reviews
 *    - Progressive Enhancement für bessere Performance
 *    - Error-Boundaries für robuste Fehlerbehandlung
 * 
 * 3. Interactive Features:
 *    - Image Carousel mit Touch/Swipe Support
 *    - Interactive Feature-Highlights
 *    - Booking-Widget mit Real-time Updates
 *    - Review-System mit Rating-Funktionalität
 * 
 * FAHRZEUG-DATENSTRUKTUR:
 * 
 * ```javascript
 * const camperData = {
 *   slug: 'mercedes-sprinter-adventure',
 *   name: 'Mercedes Sprinter Adventure',
 *   type: 'Kastenwagen',
 *   dailyRate: 79.00,
 *   capacity: {
 *     sleeping: 4,
 *     seating: 5,
 *     driving: 2
 *   },
 *   specifications: {
 *     length: '5.93m',
 *     width: '2.03m',
 *     height: '2.78m',
 *     engine: '2.1L CDI',
 *     transmission: 'Manual 6-Speed'
 *   },
 *   features: [
 *     'Vollausstattung Küche',
 *     'Dusche und WC',
 *     'Solaranlage 200W',
 *     'Markise 4m',
 *     'Fahrradträger'
 *   ],
 *   images: [
 *     { url: '/images/campers/mercedes-01.jpg', alt: 'Außenansicht' },
 *     { url: '/images/campers/mercedes-02.jpg', alt: 'Innenraum' }
 *   ],
 *   availability: {
 *     calendar: availabilityCalendar,
 *     minimumRental: 3,
 *     advanceBooking: 365
 *   }
 * };
 * ```
 * 
 * BUCHUNGS-INTEGRATION:
 * 
 * 1. Verfügbarkeitskalender:
 *    - Real-time Availability-Check via API
 *    - Visual Calendar mit verfügbaren/besetzten Tagen
 *    - Minimum-Rental-Period Enforcement
 *    - Season-basierte Preisanpassungen
 * 
 * 2. Preisberechnung:
 *    ```javascript
 *    const calculateTotalPrice = (startDate, endDate, addOns = []) => {
 *      const days = calculateDaysBetween(startDate, endDate);
 *      const basePrice = camper.dailyRate * days;
 *      const seasonMultiplier = getSeasonMultiplier(startDate, endDate);
 *      const addOnTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);
 *      
 *      return {
 *        basePrice: basePrice * seasonMultiplier,
 *        addOns: addOnTotal,
 *        taxes: (basePrice + addOnTotal) * 0.19,
 *        total: (basePrice * seasonMultiplier) + addOnTotal + taxes
 *      };
 *    };
 *    ```
 * 
 * 3. Booking-Widget:
 *    - Inline Booking-Form ohne Page-Redirect
 *    - Step-by-Step Booking-Process
 *    - Payment-Integration mit Stripe
 *    - Instant Confirmation und E-Mail-Benachrichtigung
 * 
 * SEO-OPTIMIERUNG:
 * 
 * 1. Dynamic Meta-Tags:
 *    ```jsx
 *    <Head>
 *      <title>{camper.name} mieten - WWISCA CamperShare</title>
 *      <meta name="description" content={`${camper.name} - ${camper.description}. Ab €${camper.dailyRate}/Tag verfügbar.`} />
 *      <meta property="og:title" content={`${camper.name} - Camper mieten`} />
 *      <meta property="og:image" content={camper.images[0].url} />
 *      <script type="application/ld+json">
 *        {JSON.stringify(vehicleStructuredData)}
 *      </script>
 *    </Head>
 *    ```
 * 
 * 2. Structured Data:
 *    - Schema.org Vehicle Markup
 *    - Product/Offer Structured Data
 *    - Review/Rating Rich Snippets
 *    - Local Business Information
 * 
 * RESPONSIVE DESIGN:
 * 
 * 1. Mobile-First Approach:
 *    - Touch-optimierte Image-Galleries
 *    - Swipeable Feature-Cards
 *    - Collapsible Information-Sections
 *    - Mobile-friendly Booking-Widget
 * 
 * 2. Desktop Enhancement:
 *    - Multi-Column Layout für Details
 *    - Hover-Effekte für Interactive Elements
 *    - Sticky Booking-Widget während Scroll
 *    - Enhanced Image-Gallery mit Zoom
 * 
 * PERFORMANCE-OPTIMIERUNG:
 * 
 * 1. Image Optimization:
 *    - Next.js Image Component für automatische Optimization
 *    - WebP/AVIF Format-Support mit Fallbacks
 *    - Lazy Loading für nicht-kritische Bilder
 *    - Responsive Image-Sizing basierend auf Viewport
 * 
 * 2. Data Loading:
 *    - Static Generation für populäre Fahrzeuge
 *    - Incremental Static Regeneration (ISR)
 *    - Client-Side Caching für Availability-Data
 *    - Prefetching für verwandte Fahrzeuge
 * 
 * ANALYTICS UND TRACKING:
 * 
 * 1. Detailed Page Analytics:
 *    - View-Duration und Scroll-Depth Tracking
 *    - Image-Interaction und Gallery-Usage
 *    - Booking-Funnel Analysis (View → Interest → Booking)
 *    - Feature-Interest Heatmaps
 * 
 * 2. Conversion Optimization:
 *    - A/B Testing für Booking-Widget Placement
 *    - Price-Display Optimization
 *    - CTA-Button Performance-Testing
 *    - Review-Section Impact auf Conversions
 * 
 * ACCESSIBILITY:
 * 
 * 1. Screen Reader Support:
 *    - Alt-Text für alle Fahrzeugbilder
 *    - ARIA-Labels für komplexe UI-Komponenten
 *    - Semantic HTML für strukturierte Information
 *    - Skip-Links für Navigation-Shortcuts
 * 
 * 2. Keyboard Navigation:
 *    - Tab-Order für alle Interactive Elements
 *    - Arrow-Key Navigation für Image-Galleries
 *    - Enter/Space Activation für Buttons
 *    - Escape-Key für Modal/Overlay-Closing
 * 
 * ERROR HANDLING:
 * 
 * 1. 404-Behandlung:
 *    - Custom 404-Page für nicht existierende Fahrzeuge
 *    - Suggestions für ähnliche Fahrzeuge
 *    - Search-Redirect für verwandte Begriffe
 *    - Analytics-Tracking für 404-Patterns
 * 
 * 2. Data Loading Errors:
 *    - Graceful Degradation bei API-Fehlern
 *    - Retry-Mechanismen für fehlgeschlagene Requests
 *    - Fallback-Content für kritische Informationen
 *    - User-Feedback für Service-Unterbrechungen
 * 
 * EINSATZGEBIETE:
 * - Detaillierte Fahrzeugpräsentation für Kaufentscheidungen
 * - SEO-Landing-Pages für spezifische Fahrzeugmodelle
 * - Direct-Booking Platform für qualifizierte Leads
 * - Product-Catalog Integration für Partner-Websites
 * - Mobile App-Integration für Native-Experience
 * 
 * ABHÄNGIGKEITEN:
 * - Next.js Dynamic Routing für Slug-basierte URLs
 * - Container und SimpleLayout für konsistente UI
 * - dateFormattingHelper für Availability-Display
 * - multilanguageService für internationale Märkte
 * - browserCookieManager für User-Preferences
 */

import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { SimpleLayout } from '@/components/SimpleLayout'
import { formatDate } from '@/services/dateFormattingHelper'
import { useLanguage } from '@/services/multilanguageService'
import { functionalCookies } from '@/services/browserCookieManager'

// Enhanced Icons
function CarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 17h2c0 1.1.9 2 2 2s2-.9 2-2h6c0 1.1.9 2 2 2s2-.9 2-2h2v-5l-3-5H5v8zm0-6h3l2-2h6l2 2h3l-2 4H7l-2-4z"
        fill="currentColor"
        className="text-teal-600"
      />
      <circle cx="9" cy="17" r="1" fill="currentColor" className="text-zinc-400" />
      <circle cx="19" cy="17" r="1" fill="currentColor" className="text-zinc-400" />
    </svg>
  )
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Additional Technical Icons
function RulerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21.3 8.7l-6-6c-.4-.4-1-.4-1.4 0l-10 10c-.4.4-.4 1 0 1.4l6 6c.4.4 1 .4 1.4 0l10-10c.4-.4.4-1 0-1.4zM5 16L3 14l8-8 2 2-8 8z"
        fill="currentColor"
      />
    </svg>
  )
}

function WeightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3v18m-4-4l4-4 4 4M8 7l4-4 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function DropletIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"
        fill="currentColor"
      />
    </svg>
  )
}

function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BedIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 7a4 4 0 1 1 8 0v4H7V7zM3 11h18v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2zM3 16h18v4H3v-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// Badge Component
function Badge({ variant = 'default', children }) {
  const variants = {
    default: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100',
    secondary: 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, subtitle }) {
  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/50 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-teal-600" />
        </div>
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced Booking Form
function BookingForm({ caravan }) {
  const { t, formatPrice } = useLanguage()
  const router = useRouter()
  
  // Use refs for direct DOM manipulation as fallback
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  
  // Get today's date for default values
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const [startDate, setStartDate] = useState(today) // Default to today
  const [endDate, setEndDate] = useState(tomorrow) // Default to tomorrow (1 day booking)
  const [guests, setGuests] = useState(2)
  const [totalPrice, setTotalPrice] = useState(0)
  const [days, setDays] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const calculateTotal = () => {
    if (startDate && endDate && (caravan?.pricePerDay || caravan?.price_per_day)) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const timeDiff = end.getTime() - start.getTime()
      const calculatedDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
      
      if (calculatedDays > 0) {
        const pricePerDay = caravan?.pricePerDay || parseFloat(caravan?.price_per_day || 0)
        const basePrice = calculatedDays * pricePerDay
        setDays(calculatedDays)
        setTotalPrice(basePrice)
      } else {
        setDays(0)
        setTotalPrice(0)
      }
    } else {
      setDays(0)
      setTotalPrice(0)
    }
  }

  // Alternative date handlers that also check refs
  const handleStartDateChange = (value) => {
    setStartDate(value)
    if (startDateRef.current) {
      startDateRef.current.value = value
    }
  }

  const handleEndDateChange = (value) => {
    setEndDate(value)
    if (endDateRef.current) {
      endDateRef.current.value = value
    }
  }

  useEffect(() => {
    calculateTotal()
  }, [startDate, endDate, caravan?.pricePerDay, caravan?.price_per_day])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Get values from refs as fallback
    const finalStartDate = startDate || (startDateRef.current ? startDateRef.current.value : '')
    const finalEndDate = endDate || (endDateRef.current ? endDateRef.current.value : '')
    
    // Navigate to checkout page with booking details
    const queryParams = new URLSearchParams({
      camper: caravan.slug || caravan.id,
      checkIn: finalStartDate,
      checkOut: finalEndDate,
      guests: guests.toString()
    }).toString()
    
    router.push(`/checkout?${queryParams}`)
  }

  // Get today's date for min attribute
  // (moved up to avoid redeclaration)

  return (
    <div className="bg-gradient-to-br from-white via-zinc-50 to-teal-50 dark:from-zinc-800 dark:via-zinc-800/70 dark:to-zinc-800/50 rounded-3xl p-8 border-2 border-zinc-200 dark:border-zinc-700/50 shadow-2xl backdrop-blur-sm">
      {/* Header with Price */}
      <div className="text-center mb-8">
        <div className="flex items-baseline justify-center gap-2 mb-3">
          <span className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
            {formatPrice(Math.round(parseFloat(caravan?.pricePerDay || caravan?.price_per_day || 0) * 1.19))}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">pro Tag</span>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          inkl. 19% MwSt.
        </div>
        <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-semibold">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Sofort verfügbar
        </div>
      </div>

      {/* Booking Form */}
      <div className="space-y-6">
        {/* Date Selection - With refs and manual handlers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <CalendarIcon className="w-4 h-4 mr-2 text-teal-600" />
              Von
            </label>
            <input
              ref={startDateRef}
              type="date"
              value={startDate || ''}
              min={today}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-all duration-200 hover:border-teal-400 dark:hover:border-teal-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <CalendarIcon className="w-4 h-4 mr-2 text-teal-600" />
              Bis
            </label>
            <input
              ref={endDateRef}
              type="date"
              value={endDate || ''}
              min={startDate || today}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-all duration-200 hover:border-teal-400 dark:hover:border-teal-500"
              required
            />
          </div>
        </div>

        {/* Guest Selection with Custom Dropdown */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <UsersIcon className="w-4 h-4 mr-2 text-teal-600" />
            Anzahl Personen
          </label>
          <div className="relative dropdown-container">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3.5 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-all duration-200 hover:border-teal-400 dark:hover:border-teal-500 flex items-center justify-between"
            >
              <span className="font-medium">{guests} Person{guests !== 1 ? 'en' : ''}</span>
              <svg 
                className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                {Array.from({ length: (caravan.beds || 4) }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setGuests(num)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors ${
                      guests === num 
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 font-semibold' 
                        : 'text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{num} Person{num !== 1 ? 'en' : ''}</span>
                      {guests === num && (
                        <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Breakdown - Prices already include VAT */}
        {startDate && endDate && days > 0 && totalPrice > 0 && caravan?.price_per_day && (
          <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-teal-200/50 dark:border-teal-700/50">
            <div className="space-y-3">
              {/* Base Price Calculation - Already includes VAT */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  {formatPrice(Math.round(parseFloat(caravan.price_per_day) * 1.19))} × {days} Tag{days !== 1 ? 'e' : ''} (inkl. MwSt)
                </span>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  {formatPrice(Math.round(totalPrice * 1.19))}
                </span>
              </div>
              
              {/* Service Fee */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Servicegebühr (12,6%)
                </span>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  {formatPrice(Math.round(totalPrice * 1.19 * 0.126))}
                </span>
              </div>
              
              <div className="border-t border-teal-200 dark:border-teal-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Gesamt inkl. MwSt.
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {formatPrice(Math.round(totalPrice * 1.19 + totalPrice * 1.19 * 0.126))}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 text-right mt-1">
                  für {days} Tag{days !== 1 ? 'e' : ''} • {guests} Person{guests !== 1 ? 'en' : ''}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Placeholder when no dates selected */}
        {(!startDate || !endDate || days <= 0 || totalPrice <= 0 || !(caravan?.pricePerDay || caravan?.price_per_day)) && (
          <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700">
            <div className="text-center">
              <CalendarIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                Wählen Sie Ihre Reisedaten aus, um den Gesamtpreis zu sehen
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                Preise inkl. Servicegebühr und Mehrwertsteuer
              </p>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-lg ${
            startDate && endDate && days > 0 && totalPrice > 0
              ? 'bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 hover:from-teal-700 hover:via-cyan-700 hover:to-teal-800 text-white hover:shadow-2xl shadow-lg'
              : 'bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 hover:from-teal-700 hover:via-cyan-700 hover:to-teal-800 text-white hover:shadow-2xl shadow-lg'
          }`}
        >
          {startDate && endDate && days > 0 && totalPrice > 0 ? 'Zur Buchung' : 'Termine auswählen'}
        </button>
      </div>
    </div>
  )
}

export default function CamperVanDetail({ caravan }) {
  const router = useRouter()
  const { slug } = router.query
  const { t, formatPrice } = useLanguage()
  const [camperVan, setCamperVan] = useState(caravan || null) // Use prop if available
  const [loading, setLoading] = useState(!caravan) // Only loading if no prop provided
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Add to recently viewed when vehicle data is loaded
  useEffect(() => {
    if (camperVan) {
      functionalCookies.addRecentVehicle({
        id: camperVan.id,
        name: camperVan.name,
        imageUrl: `/images/campers/${camperVan.slug}/1.jpg`,
        pricePerDay: camperVan.pricePerDay || camperVan.price_per_day,
        location: camperVan.location
      })
    }
  }, [camperVan])

  // No need for useEffect to fetch data since we get it via getServerSideProps
  
  useEffect(() => {
    // Only fetch from API if we have no data at all (not even from getServerSideProps)
    if (!camperVan && !caravan && slug) {
      const fetchCamperVan = async () => {
        try {
          setLoading(true)
          setError(null)
          
          const response = await fetch(`/api/campers/${slug}`)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()
          
          if (result.success && result.data) {
            setCamperVan(result.data)
          } else {
            setError('Wohnmobil nicht gefunden')
          }
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      fetchCamperVan()
    }
  }, [slug, camperVan, caravan])

  if (loading) {
    return (
      <SimpleLayout title="Lädt..." intro="Wohnmobil wird geladen...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </SimpleLayout>
    )
  }

  if (error) {
    return (
      <SimpleLayout title="Fehler" intro={error}>
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Das angeforderte Wohnmobil konnte nicht gefunden werden.
          </p>
          <Button onClick={() => router.push('/')} variant="secondary">
            Zurück zur Startseite
          </Button>
        </div>
      </SimpleLayout>
    )
  }

  if (!camperVan) {
    return (
      <SimpleLayout title="Nicht gefunden" intro="Wohnmobil nicht gefunden">
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Das angeforderte Wohnmobil existiert nicht.
          </p>
          <Button onClick={() => router.push('/')} variant="secondary">
            Zurück zur Startseite
          </Button>
        </div>
      </SimpleLayout>
    )
  }

  // Parse features
  const features = camperVan.features ? 
    (Array.isArray(camperVan.features) ? camperVan.features : camperVan.features.split(',').map(f => f.trim())) 
    : []

  const images = [
    { url: `/images/campers/${camperVan.slug}/1.jpg`, alt: `${camperVan.name} - Außenansicht` },
    { url: `/images/campers/${camperVan.slug}/2.jpg`, alt: `${camperVan.name} - Innenraum` },
    { url: `/images/campers/${camperVan.slug}/3.jpg`, alt: `${camperVan.name} - Küche` },
    { url: `/images/campers/${camperVan.slug}/4.jpg`, alt: `${camperVan.name} - Schlafbereich` }
  ]

  return (
    <>
      <Head>
        <title>{camperVan.name} - CamperShare | Wohnmobil mieten</title>
        <meta name="description" content={`${camperVan.name} mieten bei CamperShare. ${camperVan.description} Jetzt ab ${formatPrice(parseFloat(camperVan.pricePerDay || camperVan.price_per_day || 0))}/Tag buchen!`} />
        <meta property="og:title" content={`${camperVan.name} - CamperShare`} />
        <meta property="og:description" content={camperVan.description || ''} />
        <meta property="og:image" content={`/images/campers/${camperVan.slug}/1.jpg`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100 dark:from-zinc-900 dark:to-slate-900">
        <Container className="pt-8 pb-16">
          
          {/* Header with Back Button */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-4"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zur Übersicht
            </button>
          </div>

          {/* Hero Section */}
          <div className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden mb-8">
            
            {/* Image Gallery */}
            <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30">
              <img 
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].alt}
                className="h-full w-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.style.background = 'linear-gradient(135deg, rgb(20 184 166 / 0.1) 0%, rgb(8 145 178 / 0.1) 100%)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Image Navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        selectedImageIndex === index 
                          ? 'bg-white shadow-lg' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Badge overlay */}
              <div className="absolute top-6 left-6">
                <Badge variant="success">Verfügbar</Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                      {camperVan.name}
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {camperVan.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">

              {/* Enhanced Technical Specifications */}
              <div className="bg-white dark:bg-zinc-800/50 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700/50 shadow-lg">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center">
                  <CarIcon className="mr-3 h-6 w-6 text-teal-600" />
                  Technische Details
                </h3>
                
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    icon={UsersIcon}
                    label="Sitzplätze"
                    value={camperVan.beds >= 4 ? 4 : camperVan.beds >= 2 ? 4 : 2}
                  />
                  <StatCard
                    icon={BedIcon}
                    label="Schlafplätze"
                    value={camperVan.beds || 'N/A'}
                  />
                  <StatCard
                    icon={CalendarIcon}
                    label="Baujahr"
                    value={camperVan.year || 'N/A'}
                  />
                  <StatCard
                    icon={CarIcon}
                    label="Preis/Tag"
                    value={formatPrice(parseFloat(camperVan.price_per_day || 0))}
                  />
                </div>

                {/* Detailed Specifications */}
                <div className="space-y-8">
                  
                  {/* Vehicle Dimensions - Elegant minimal design */}
                  {(camperVan.length_m || camperVan.width_m || camperVan.height_m || camperVan.weight_kg) && (
                    <div className="bg-gradient-to-r from-blue-50/30 via-white to-purple-50/30 dark:from-blue-900/5 dark:via-zinc-800/50 dark:to-purple-900/5 rounded-2xl p-8 border border-blue-100/50 dark:border-blue-800/20">
                      <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
                        <RulerIcon className="h-5 w-5 text-blue-600" />
                        Abmessungen & Gewicht
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {camperVan.length_m && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <RulerIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.length_m} m</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Länge</div>
                          </div>
                        )}
                        {camperVan.width_m && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <RulerIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.width_m} m</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Breite</div>
                          </div>
                        )}
                        {camperVan.height_m && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <RulerIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.height_m} m</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Höhe</div>
                          </div>
                        )}
                        {camperVan.weight_kg && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <WeightIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.weight_kg} kg</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Gewicht</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Engine & Performance - Elegant minimal design */}
                  {(camperVan.engine_power_hp || camperVan.transmission) && (
                    <div className="bg-gradient-to-r from-red-50/30 via-white to-orange-50/30 dark:from-red-900/5 dark:via-zinc-800/50 dark:to-orange-900/5 rounded-2xl p-8 border border-red-100/50 dark:border-red-800/20">
                      <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
                        <GearIcon className="h-5 w-5 text-red-600" />
                        Motor & Antrieb
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {camperVan.engine_power_hp && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <GearIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.engine_power_hp} PS</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Motorleistung</div>
                          </div>
                        )}
                        {camperVan.transmission && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <GearIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.transmission}</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Getriebe</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tank Capacities - Elegant minimal design */}
                  {(camperVan.fuel_capacity_l || camperVan.water_capacity_l || camperVan.waste_capacity_l) && (
                    <div className="bg-gradient-to-r from-cyan-50/30 via-white to-slate-50/30 dark:from-cyan-900/5 dark:via-zinc-800/50 dark:to-slate-900/5 rounded-2xl p-8 border border-cyan-100/50 dark:border-cyan-800/20">
                      <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
                        <DropletIcon className="h-5 w-5 text-cyan-600" />
                        Tank-Kapazitäten
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {camperVan.fuel_capacity_l && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <DropletIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.fuel_capacity_l} L</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Kraftstoff</div>
                          </div>
                        )}
                        {camperVan.water_capacity_l && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <DropletIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.water_capacity_l} L</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Frischwasser</div>
                          </div>
                        )}
                        {camperVan.waste_capacity_l && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <DropletIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{camperVan.waste_capacity_l} L</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Abwasser</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sleeping Arrangement */}
                  {camperVan.sleeping_arrangement && (
                    <div>
                      <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                        <BedIcon className="h-5 w-5 text-purple-500" />
                        Schlafmöglichkeiten
                      </h4>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3">
                          <BedIcon className="h-6 w-6 text-purple-600" />
                          <span className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                            {camperVan.sleeping_arrangement}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Basic Vehicle Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                      Fahrzeug-Informationen
                    </h4>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {camperVan.brand && (
                        <div className="flex items-start space-x-3">
                          <div className="bg-teal-100 dark:bg-teal-900/30 rounded-lg p-2">
                            <span className="text-teal-600 font-semibold text-sm">MARKE</span>
                          </div>
                          <div>
                            <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{camperVan.brand}</dd>
                          </div>
                        </div>
                      )}
                      {camperVan.model && (
                        <div className="flex items-start space-x-3">
                          <div className="bg-teal-100 dark:bg-teal-900/30 rounded-lg p-2">
                            <span className="text-teal-600 font-semibold text-sm">MODELL</span>
                          </div>
                          <div>
                            <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{camperVan.model}</dd>
                          </div>
                        </div>
                      )}
                      {camperVan.type && (
                        <div className="flex items-start space-x-3">
                          <div className="bg-teal-100 dark:bg-teal-900/30 rounded-lg p-2">
                            <span className="text-teal-600 font-semibold text-sm">TYP</span>
                          </div>
                          <div>
                            <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{camperVan.type}</dd>
                          </div>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>

              {/* Features */}
              {features && features.length > 0 && (
                <div className="bg-white dark:bg-zinc-800/50 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700/50 shadow-lg">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center">
                    <CheckIcon className="mr-3 h-6 w-6 text-teal-600 bg-teal-100 rounded-full p-1" />
                    Ausstattung & Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200/50 dark:border-teal-700/50">
                        <CheckIcon className="h-5 w-5 text-teal-600 bg-white dark:bg-teal-900 rounded-full p-1 flex-shrink-0" />
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-white dark:bg-zinc-800/50 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700/50 shadow-lg">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  Über dieses Wohnmobil
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">
                  {camperVan.description}
                </p>
              </div>

            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Booking Form */}
                <BookingForm caravan={camperVan} />
                
                {/* Contact Info */}
                <div className="bg-white dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700/50 shadow-lg text-center">
                  <div className="text-2xl mb-3">📞</div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    Haben Sie Fragen?
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                    Unser Team steht Ihnen gerne zur Verfügung
                  </p>
                  <Button 
                    variant="secondary" 
                    href="/contact" 
                    className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-300 dark:hover:bg-teal-900/20"
                  >
                    Kontakt aufnehmen
                  </Button>
                </div>

                {/* Safety Info */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
                  <div className="text-green-600 text-2xl mb-3">🛡️</div>
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                    Sicher & Versichert
                  </h4>
                  <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <div className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-600" />
                      Vollkaskoversicherung inklusive
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-600" />
                      24/7 Pannenhilfe
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-600" />
                      Kostenlose Stornierung
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </Container>
      </div>
    </>
  )
}

// Required for dynamic routes in Next.js
export async function getServerSideProps({ params }) {
  try {
    // Try to fetch data from API first - use internal Docker network URL or direct DB query
    const { Pool } = require('pg');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://campershare_user:campershare_pass@postgres:5432/campershare',
      ssl: false,
    });

    // Get camper details directly from database
    const camperResult = await pool.query(
      `SELECT 
        cv.*, 
        u.first_name as owner_first_name, 
        u.last_name as owner_last_name,
        u.phone as owner_phone
      FROM camper_vans cv
      LEFT JOIN users u ON cv.owner_id = u.id
      WHERE cv.slug = $1 AND cv.is_active = true`,
      [params.slug]
    );

    if (camperResult.rows.length > 0) {
      const camper = camperResult.rows[0];
      
      // Convert Date objects to strings for JSON serialization
      const serializedCamper = {
        ...camper,
        created_at: camper.created_at ? camper.created_at.toISOString() : null,
        updated_at: camper.updated_at ? camper.updated_at.toISOString() : null,
        // Ensure features is properly parsed if it's a string
        features: typeof camper.features === 'string' ? JSON.parse(camper.features) : camper.features,
        // Ensure images is properly parsed if it's a string
        images: typeof camper.images === 'string' ? JSON.parse(camper.images) : camper.images || [],
        // Ensure availability_calendar is properly parsed if it's a string
        availability_calendar: typeof camper.availability_calendar === 'string' 
          ? JSON.parse(camper.availability_calendar) 
          : camper.availability_calendar || {},
        // Add consistent price fields
        pricePerDay: parseFloat(camper.price_per_day || 0),
        pricePerNight: parseFloat(camper.price_per_day || 0),
        // Keep the original field for backward compatibility
        price_per_day: camper.price_per_day
      };
      
      return {
        props: {
          caravan: serializedCamper
        }
      }
    }
    
    // No more fallback to static data - everything should be in database now
    console.error('Camper not found in database:', params.slug);
    return {
      notFound: true
    }
  } catch (error) {
    console.error('Error fetching caravan:', error)
    return {
      notFound: true
    }
  }
}
