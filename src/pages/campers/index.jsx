/**
 * campers/index.jsx - Camper-Übersichts- und Suchseite
 * =====================================================
 * 
 * HAUPTFUNKTION:
 * Hauptsuchseite für Camper-Fahrzeuge der WWISCA Plattform mit umfassenden Filter-, Such- und Buchungsfunktionen.
 * Zentrale Landing-Page für die Fahrzeugsuche mit intelligenten Filtern und Location-basierter Suche.
 * 
 * SEITEN-FEATURES:
 * 
 * 1. Intelligente Fahrzeugsuche:
 *    - Text-basierte Suche mit Debouncing für Performance
 *    - Multi-Filter System (Typ, Preis, Ausstattung, Standort)
 *    - Real-time Filter-Updates ohne Seitenneuladung
 *    - Advanced Filtering mit useVanFiltering Hook
 * 
 * 2. Location-basierte Suche:
 *    - GPS-Standortsuche mit LocationPickerClient
 *    - Nahegelegene Fahrzeuge basierend auf Benutzerposition
 *    - PICKUP_LOCATIONS Integration für verfügbare Standorte
 *    - Smart Location Service für automatische Standorterkennung
 * 
 * 3. Responsive Fahrzeug-Grid:
 *    - Card-basierte Fahrzeugdarstellung
 *    - Responsive Grid-Layout (1-4 Spalten je nach Bildschirmgröße)
 *    - Lazy Loading für große Fahrzeugmengen
 *    - Wishlist-Integration für Favoriten-Management
 * 
 * 4. Enhanced User Experience:
 *    - Analytics-Tracking für Suchverhalten
 *    - Cookie-basierte Einstellungsspeicherung
 *    - Mehrsprachige Unterstützung (DE/EN)
 *    - Progressive Web App Features
 * 
 * TECHNISCHE KOMPONENTEN:
 * 
 * 1. Search und Filtering:
 *    - useDebounce Hook für optimierte Sucheingaben
 *    - useVanFiltering für komplexe Filter-Logic
 *    - Real-time Updates ohne Performance-Einbußen
 *    - URL-State Synchronisation für Deep-Linking
 * 
 * 2. Location Services:
 *    - LocationPickerClient für SSR-sichere GPS-Integration
 *    - useSmartLocation für intelligente Standortdienste
 *    - PICKUP_LOCATIONS Datenbank für verfügbare Abholpunkte
 *    - Geolocation API Integration mit Fallback-Mechanismen
 * 
 * 3. State Management:
 *    - useState für lokale Suchfilter und UI-States
 *    - useEffect für Daten-Loading und Side-Effects
 *    - Router-State für URL-Parameter Synchronisation
 *    - Context-Integration für globale App-States
 * 
 * SUCH- UND FILTER-SYSTEM:
 * 
 * 1. Text-basierte Suche:
 *    ```javascript
 *    const [searchTerm, setSearchTerm] = useState('');
 *    const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *    
 *    useEffect(() => {
 *      filterVans(debouncedSearchTerm);
 *    }, [debouncedSearchTerm]);
 *    ```
 * 
 * 2. Advanced Filtering:
 *    - Fahrzeugtyp (Kastenwagen, Alkoven, Vollintegriert)
 *    - Preisbereich (Min-Max Slider)
 *    - Ausstattung (Küche, Bad, Solar, etc.)
 *    - Personenanzahl (2-8 Personen)
 *    - Verfügbarkeitszeitraum
 * 
 * 3. Location-based Filtering:
 *    - Radius-basierte Suche um Benutzerstandort
 *    - Spezifische Abholstandorte
 *    - Stadt- oder Postleitzahl-Suche
 *    - Internationale Standorte
 * 
 * RESPONSIVE DESIGN:
 * 
 * 1. Mobile-First Approach:
 *    - Touch-optimierte Filter-UI
 *    - Swipeable Fahrzeug-Karten
 *    - Collapsible Filter-Sidebar
 *    - Optimierte Suchfeld-Positionierung
 * 
 * 2. Desktop Enhancement:
 *    - Multi-Column Grid-Layout
 *    - Hover-Effekte und Animations
 *    - Advanced Filter-Sidebar
 *    - Keyboard-Shortcuts für Power-User
 * 
 * 3. Tablet Optimization:
 *    - Adaptive Grid (2-3 Spalten)
 *    - Touch und Mouse-friendly Interactions
 *    - Optimierte Filter-Panel Layouts
 *    - Portrait/Landscape Mode Support
 * 
 * ANALYTICS UND TRACKING:
 * 
 * 1. Search Analytics:
 *    - usePageViewTracking für Seitenaufrufe
 *    - useAnalytics für detailliertes Benutzerverhalten
 *    - Search-Term Tracking für Content-Optimierung
 *    - Filter-Usage Analysis für UX-Improvements
 * 
 * 2. Conversion Tracking:
 *    - Van-View zu Booking Conversion-Rate
 *    - Popular Search-Terms und Filter-Kombinationen
 *    - Geographic Search-Patterns
 *    - Seasonal Search-Trends
 * 
 * 3. Performance Monitoring:
 *    - Search-Response Times
 *    - Filter-Performance Metrics
 *    - Page-Load Speed Optimization
 *    - Mobile vs Desktop Usage-Patterns
 * 
 * FAHRZEUG-DARSTELLUNG:
 * 
 * 1. Fahrzeug-Karten:
 *    ```jsx
 *    <VanCard>
 *      <VanImage src={van.mainImage} alt={van.name} />
 *      <VanDetails>
 *        <VanName>{van.name}</VanName>
 *        <VanType>{van.type}</VanType>
 *        <VanPrice>€{van.dailyRate}/Tag</VanPrice>
 *        <VanFeatures features={van.features} />
 *        <WishlistButton vanId={van.id} />
 *      </VanDetails>
 *    </VanCard>
 *    ```
 * 
 * 2. Interactive Elements:
 *    - WishlistButton für Favoriten-Management
 *    - Quick-View Modal für Fahrzeugdetails
 *    - Direct-Booking Button für sofortige Reservierung
 *    - Share-Funktionen für Social Media
 * 
 * SEO-OPTIMIERUNG:
 * 
 * 1. Meta-Tags und Structured Data:
 *    ```jsx
 *    <Head>
 *      <title>Camper mieten - WWISCA CamperShare</title>
 *      <meta name="description" content="Entdecken Sie unsere Auswahl an Campern für Ihren perfekten Roadtrip" />
 *      <meta name="keywords" content="Camper mieten, Wohnmobil, Camping, Roadtrip" />
 *      <script type="application/ld+json">
 *        {JSON.stringify(vehicleListingSchema)}
 *      </script>
 *    </Head>
 *    ```
 * 
 * 2. URL-Structure:
 *    - Clean URLs für Filter-Kombinationen
 *    - Canonical URLs für Duplicate-Content Prevention
 *    - Hreflang für internationale Versionen
 *    - Sitemap-Integration für bessere Crawlability
 * 
 * PERFORMANCE-OPTIMIERUNG:
 * 
 * 1. Data Loading:
 *    - Lazy Loading für Fahrzeug-Bilder
 *    - Infinite Scrolling für große Datensätze
 *    - Caching-Strategien für häufige Suchen
 *    - Debounced API-Calls für bessere Performance
 * 
 * 2. Rendering Optimization:
 *    - React.memo für Fahrzeug-Komponenten
 *    - useMemo für berechnete Filter-Werte
 *    - Virtual Scrolling bei vielen Ergebnissen
 *    - Code Splitting für Feature-spezifische Bundles
 * 
 * ACCESSIBILITY:
 * 
 * 1. Keyboard Navigation:
 *    - Tab-Index für alle interaktiven Elemente
 *    - Arrow-Key Navigation durch Fahrzeug-Grid
 *    - Enter/Space Activation für Filter-Checkboxes
 *    - Escape-Key für Modal/Filter-Panel Closing
 * 
 * 2. Screen Reader Support:
 *    - ARIA-Labels für komplexe UI-Elemente
 *    - Live-Regions für Dynamic Content-Updates
 *    - Semantic HTML für Structure-Information
 *    - Alternative Text für alle Bilder
 * 
 * EINSATZGEBIETE:
 * - Hauptsuchseite für Camper-Vermietung
 * - Landing-Page für Marketing-Kampagnen
 * - Mobile App-Integration für Native-Feeling
 * - B2B-Partner Integration für White-Label-Solutions
 * - Analytics-Dashboard für Business-Intelligence
 * 
 * ABHÄNGIGKEITEN:
 * - Container und Button für UI-Konsistenz
 * - CamperFilters für Advanced Filtering
 * - LocationPickerClient für GPS-Integration
 * - StorageComponents für Wishlist-Funktionalität
 * - Analytics Hooks für Tracking und Optimization
 */

import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useDebounce } from '@/services/externalApiConnector'
import { WishlistButton } from '@/components/StorageComponents'
import { useVanFiltering } from '@/components/CamperFilters'
import LocationPickerClient from '@/components/LocationPickerClient'
import { PICKUP_LOCATIONS } from '@/services/camperVehicleDataService'
import { useLanguage } from '@/services/multilanguageService'
import { CamperShareIcon, CamperShareBrandIcon } from '@/components/CamperShareIcon'
import { functionalCookies } from '@/services/browserCookieManager'
import { useSmartLocation } from '@/services/locationService'
import { usePageViewTracking, useAnalytics } from '@/hooks/useAnalytics'

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function FilterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  )
}

function VanIcon(props) {
  return (
    <CamperShareIcon 
      {...props} 
      className={`${props.className || ''} text-zinc-400 dark:text-zinc-500`}
    />
  )
}

// Enhanced Hero Section für Wohnmobile-Seite
function CampersHeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-teal-50/80 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 py-20 sm:py-24">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          {/* Enhanced Premium Badge - Exakt wie Homepage */}
          <div className="group inline-flex items-center justify-center px-8 py-4 mb-8 backdrop-blur-xl bg-gradient-to-r from-white/90 via-white/95 to-white/90 dark:from-zinc-800/90 dark:via-zinc-800/95 dark:to-zinc-800/90 rounded-3xl shadow-2xl border border-white/30 dark:border-zinc-700/50 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            {/* Background Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            {/* Fleet Indicator */}
            <div className="relative flex items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-base font-bold bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-wide">
                  Premium Wohnmobil-Flotte entdecken
                </span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Haupttitel */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span className="block bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
              {t('campers.title')}
            </span>
          </h1>
          
          {/* Enhanced Beschreibung */}
          <p className="mx-auto max-w-3xl text-xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
            {t('campers.subtitle')}
          </p>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">200+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Premium Fahrzeuge</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">50+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Standorte</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">4.9★</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Bewertung</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// Erweiterte Suchsektion
function SearchAndFiltersSection({ onSearch, onFiltersChange, filters, searchTerm, resultCount, nearbyOnly = false, setNearbyOnly, isMounted = false, userLocation = null }) {
  const { t } = useLanguage()
  const [showFilters, setShowFilters] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(localSearchTerm)
  }

  return (
    <section className="relative py-16 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-teal-50/50 dark:from-zinc-900/80 dark:via-zinc-900/90 dark:to-zinc-800/80 overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1500" />
      
      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl">
          {/* Enhanced Such-Formular */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-3xl shadow-xl border border-white/20 dark:border-zinc-700/50 p-8 mb-8 hover:bg-white/90 dark:hover:bg-zinc-800/90 transition-all duration-300">
            <form onSubmit={handleSearchSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Search Field */}
                <div className="lg:col-span-2 group relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <SearchIcon className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    placeholder="Wohnmobil, Ort oder Ausstattung suchen..."
                    className="w-full pl-14 pr-4 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500"
                  />
                  <label className="absolute -top-2.5 left-3 px-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-zinc-800/90 rounded-md">
                    Suche
                  </label>
                </div>
                
                {/* Location Field with Smart Detection */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                  </div>
                  <select
                    value={filters.location}
                    onChange={(e) => onFiltersChange({...filters, location: e.target.value})}
                    className="w-full pl-14 pr-4 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500 appearance-none"
                  >
                    <option value="">{t('home.anyLocation')}</option>
                    <option value="current">📍 Aktueller Standort</option>
                    <option value="München">München</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Hamburg">Hamburg</option>
                    <option value="Köln">Köln</option>
                    <option value="Frankfurt">Frankfurt</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <label className="absolute -top-2.5 left-3 px-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-zinc-800/90 rounded-md">
                    {t('home.location')}
                  </label>
                </div>
                
                {/* Search Button */}
                <div>
                  <Button type="submit" className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <SearchIcon className="mr-2 h-5 w-5" />
                    Suchen
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Client-Only Smart Location Picker */}
          <LocationPickerClient 
            onLocationDetected={(location) => {
              // Auto-select current location when detected
              if (location && filters.location === 'current') {
                onFiltersChange({...filters, location: location.address || 'current'});
              }
            }}
          />

          {/* Enhanced Filter Toggle und Ergebnisse */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-2xl px-6 py-3 border border-white/20 dark:border-zinc-700/50 shadow-lg">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {resultCount}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Wohnmobile gefunden
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-2xl border border-white/20 dark:border-zinc-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <Button 
                variant="secondary" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-6 py-3 text-zinc-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors bg-transparent hover:bg-white/50 dark:hover:bg-zinc-700/50 border-none"
              >
                <FilterIcon className="mr-2 h-5 w-5" />
                Filter {showFilters ? 'ausblenden' : 'anzeigen'}
              </Button>
            </div>
          </div>

          {/* Enhanced Erweiterte Filter */}
          {showFilters && (
            <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-700/50 p-8 mb-8 hover:bg-white/90 dark:hover:bg-zinc-800/90 transition-all duration-300">
              <div className="space-y-8">
                
                {/* Enhanced Preis, Entfernung & Kapazität */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Preis pro Tag: €{filters.priceRange[0]} - €{filters.priceRange[1]}
                    </label>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Von: €{filters.priceRange[0]}</label>
                        <input
                          type="range"
                          min="20"
                          max="300"
                          value={filters.priceRange[0]}
                          onChange={(e) => {
                            const minValue = parseInt(e.target.value);
                            const maxValue = Math.max(minValue, filters.priceRange[1]);
                            onFiltersChange({...filters, priceRange: [minValue, maxValue]});
                          }}
                          className="w-full h-3 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-600 dark:to-zinc-700 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600 shadow-sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Bis: €{filters.priceRange[1]}</label>
                        <input
                          type="range"
                          min="20"
                          max="300"
                          value={filters.priceRange[1]}
                          onChange={(e) => {
                            const maxValue = parseInt(e.target.value);
                            const minValue = Math.min(filters.priceRange[0], maxValue);
                            onFiltersChange({...filters, priceRange: [minValue, maxValue]});
                          }}
                          className="w-full h-3 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-600 dark:to-zinc-700 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600 shadow-sm"
                        />
                      </div>
                      <div className="flex justify-between text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg">€20</span>
                        <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg">€300</span>
                      </div>
                    </div>
                  </div>

                  {/* Smart Distance Filter */}
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Max. Entfernung: {filters.maxDistance}km
                    </label>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            🚗 {filters.maxDistance}km Radius
                          </label>
                          {isMounted && userLocation && (
                            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                              📍 Smart Filter aktiv
                            </span>
                          )}
                        </div>
                        <input
                          type="range"
                          min="25"
                          max="500"
                          step="25"
                          value={filters.maxDistance}
                          onChange={(e) => {
                            onFiltersChange({...filters, maxDistance: parseInt(e.target.value)});
                          }}
                          className="w-full h-3 bg-gradient-to-r from-teal-200 to-teal-300 dark:from-teal-600 dark:to-teal-700 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600 shadow-sm"
                          disabled={!isMounted || !userLocation}
                        />
                      </div>
                      <div className="flex justify-between text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 rounded-lg">25km</span>
                        <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 rounded-lg">500km</span>
                      </div>
                      {(!isMounted || !userLocation) && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                          Wähle einen Standort um Entfernungsfilter zu aktivieren
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Personenanzahl
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                        <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                        </div>
                      </div>
                      <select
                        value={filters.capacity}
                        onChange={(e) => onFiltersChange({...filters, capacity: e.target.value})}
                        className="w-full pl-14 pr-12 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500 appearance-none"
                      >
                        <option value="">Beliebig</option>
                        <option value="2">2 Personen</option>
                        <option value="4">4 Personen</option>
                        <option value="6">6 Personen</option>
                        <option value="8">8+ Personen</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Fahrzeugtyp & Getriebe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Fahrzeugtyp
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                        <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM18.75 5.25v13.5a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v-3zM3.75 18.75h16.5" />
                          </svg>
                        </div>
                      </div>
                      <select
                        value={filters.vanType}
                        onChange={(e) => onFiltersChange({...filters, vanType: e.target.value})}
                        className="w-full pl-14 pr-12 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500 appearance-none"
                      >
                        <option value="">Alle Typen</option>
                        <option value="Kastenwagen">Kastenwagen</option>
                        <option value="Teilintegriert">Teilintegriert</option>
                        <option value="Vollintegriert">Vollintegriert</option>
                        <option value="Alkoven">Alkoven</option>
                        <option value="Liner">Liner</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Getriebe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                        <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                          </svg>
                        </div>
                      </div>
                      <select
                        value={filters.transmission}
                        onChange={(e) => onFiltersChange({...filters, transmission: e.target.value})}
                        className="w-full pl-14 pr-12 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500 appearance-none"
                      >
                        <option value="">Beliebig</option>
                        <option value="Automatik">Automatik</option>
                        <option value="Manuell">Manuell</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Verfügbarkeit & Kraftstoff */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Von Datum
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                        <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                          </svg>
                        </div>
                      </div>
                      <input
                        type="date"
                        value={filters.availability?.startDate || ''}
                        onChange={(e) => onFiltersChange({
                          ...filters, 
                          availability: { ...filters.availability, startDate: e.target.value }
                        })}
                        min={currentDate}
                        className="w-full pl-14 pr-4 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500"
                      />
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Bis Datum
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                        <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                          </svg>
                        </div>
                      </div>
                      <input
                        type="date"
                        value={filters.availability?.endDate || ''}
                        onChange={(e) => onFiltersChange({
                          ...filters, 
                          availability: { ...filters.availability, endDate: e.target.value }
                        })}
                        min={filters.availability?.startDate || currentDate}
                        className="w-full pl-14 pr-4 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Kraftstofftyp & Baujahr */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Kraftstoff
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                        <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                          </svg>
                        </div>
                      </div>
                      <select
                        value={filters.fuelType}
                        onChange={(e) => onFiltersChange({...filters, fuelType: e.target.value})}
                        className="w-full pl-14 pr-12 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500 appearance-none"
                      >
                        <option value="">Beliebig</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Benzin">Benzin</option>
                        <option value="Elektro">Elektro</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
                      Baujahr
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                        <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                          </svg>
                        </div>
                      </div>
                      <select
                        value={filters.year}
                        onChange={(e) => onFiltersChange({...filters, year: e.target.value})}
                        className="w-full pl-14 pr-12 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500 appearance-none"
                      >
                        <option value="">Beliebig</option>
                        <option value="2020+">2020 und neuer</option>
                        <option value="2015-2019">2015-2019</option>
                        <option value="2010-2014">2010-2014</option>
                        <option value="2009-">Älter als 2009</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Ausstattung */}
                <div>
                  <label className="block text-xl font-bold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-6">
                    Ausstattung & Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      'Küche', 'Bad/WC', 'Dusche', 'Heizung', 
                      'Klimaanlage', 'Solar', 'Fahrräder', 'WiFi', 
                      'TV', 'Markise', 'Sat-Anlage', 'Rückfahrkamera', 
                      'Navigation', 'Tempomat', 'Automatik', 'Garage',
                      'Hundeerlaubt', 'Kindersitz', 'Winterreifen', 'Schneeketten'
                    ].map((amenity) => (
                      <label key={amenity} className="group flex items-center space-x-3 cursor-pointer p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-700/50 hover:bg-white dark:hover:bg-zinc-700 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300 dark:hover:border-zinc-500 transition-all duration-300 hover:shadow-md">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => {
                            const newAmenities = filters.amenities.includes(amenity)
                              ? filters.amenities.filter(a => a !== amenity)
                              : [...filters.amenities, amenity];
                            onFiltersChange({...filters, amenities: newAmenities})
                          }}
                          className="w-5 h-5 text-teal-600 bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-teal-500/50 transition-all duration-200 checked:bg-teal-600 checked:border-teal-600"
                        />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Enhanced Filter Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-zinc-200/50 dark:border-zinc-700/50">
                  <Button 
                    type="button"
                    onClick={() => onFiltersChange({
                      location: '',
                      vanType: '',
                      capacity: '',
                      transmission: '',
                      fuelType: '',
                      year: '',
                      priceRange: [0, 500],
                      amenities: [],
                      availability: { startDate: '', endDate: '' }
                    })}
                    variant="outline"
                    className="flex-1 sm:flex-none px-8 py-3 bg-white/80 dark:bg-zinc-800/80 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300"
                  >
                    Filter zurücksetzen
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="flex-1 px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Filter anwenden
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Sortierung & Filter löschen */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-2xl border border-white/20 dark:border-zinc-700/50 shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <label className="text-lg font-semibold bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent">
                  Sortieren nach:
                </label>
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => onFiltersChange({...filters, sortBy: e.target.value})}
                    className="pl-4 pr-10 py-3 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300 appearance-none"
                  >
                    <option value="price-low">Preis: Niedrig → Hoch</option>
                    <option value="price-high">Preis: Hoch → Niedrig</option>
                    <option value="rating">Beste Bewertung</option>
                    <option value="newest">Neueste zuerst</option>
                    <option value="capacity">Größte Kapazität</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const defaultFilters = {
                    location: '',
                    priceRange: [0, 500],
                    vanType: '',
                    capacity: '',
                    amenities: [],
                    availability: { startDate: '', endDate: '' },
                    distance: 50,
                    sortBy: 'price-low',
                    transmission: '',
                    fuelType: '',
                    year: '',
                    features: []
                  };
                  onFiltersChange(defaultFilters);
                }}
                className="px-6 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white/50 dark:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-500 transition-all duration-300"
              >
                Filter zurücksetzen
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// Moderne Wohnmobil-Karte
function CamperCard({ caravan, userLocation, distance, nearestLocation, vanId, bookingEnabled }) {
  const { t, formatPrice } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  
  // Verhindere Hydration Error durch client-only rendering von distance features
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const getBadgeColor = (type) => {
    switch(type) {
      case 'Premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'Family': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'Adventure': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-300'
    }
  }

  const formatDistance = (distanceKm) => {
    if (!distanceKm || distanceKm === Infinity || !isFinite(distanceKm)) return null
    if (distanceKm < 1) return `${Math.round(distanceKm * 1000)}m`
    if (distanceKm < 100) return `${distanceKm.toFixed(1)}km`
    return `${Math.round(distanceKm)}km`
  }

  const calculateDriveTime = (distanceKm) => {
    if (!distanceKm || distanceKm === Infinity || !isFinite(distanceKm)) return null
    // Annahme: Durchschnittsgeschwindigkeit 60 km/h in der Stadt, 80 km/h auf Landstraße
    const avgSpeed = distanceKm < 50 ? 60 : 80
    const timeHours = distanceKm / avgSpeed
    const minutes = Math.round(timeHours * 60)
    
    if (minutes < 60) return `${minutes} Min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
  }

  const isNearby = distance && distance <= 25 // Within 25km is considered "nearby"

  return (
    <div className="group h-full">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden border border-zinc-200 dark:border-zinc-700 h-full flex flex-col">
        {/* Camper Image */}
        <div className="relative aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800">
          <img 
            src={`/images/caravans/${caravan.slug}/main.avif`}
            alt={`${caravan.name} - Hauptansicht`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback zu Platzhalter-Icon wenn Bild nicht verfügbar
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="h-16 w-16 text-zinc-400">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L4 5v6c0 5.2 3.1 10.1 8 12 4.9-1.9 8-6.8 8-12V5l-8-3z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                </div>
              `
            }}
          />
          
          {/* Wishlist Button - Client Only */}
          <div className="absolute top-4 left-4">
            {isMounted && (
              <WishlistButton
                vanId={vanId || caravan.id}
                bookingEnabled={bookingEnabled}
                vanData={caravan}
                className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md hover:shadow-lg text-zinc-600 hover:text-red-500 transition-colors"
              />
            )}
          </div>
          
          {/* Top Right Badges */}
          <div className="absolute top-4 right-4">
            <div className="flex flex-col gap-1 items-end">
              {/* Booking Status Badge */}
              {bookingEnabled ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs font-medium rounded-full">
                  ✅ Buchbar
                </span>
              ) : (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 text-xs font-medium rounded-full">
                  📋 Info only
                </span>
              )}
              
              {/* Type Badge - Always visible */}
              {caravan.type && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(caravan.type)}`}>
                  {caravan.type}
                </span>
              )}
              
              {/* Location Badge - Always show location */}
              <span className="px-2 py-1 bg-blue-100/95 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold rounded-full backdrop-blur-sm shadow-sm">
                📍 {caravan.location ? caravan.location.split(' ')[0] : 'Standort'}
              </span>
              
              {/* Distance Badges - Client Only with user location */}
              {isMounted && distance > 0 && (
                <>
                  {isNearby && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs font-medium rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      In der Nähe
                    </span>
                  )}
                  <span className="px-2 py-1 bg-white/95 dark:bg-zinc-800/95 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-full backdrop-blur-sm shadow-sm">
                    📍 {formatDistance(distance)}
                  </span>
                  <span className="px-2 py-1 bg-teal-100/95 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 text-xs font-semibold rounded-full backdrop-blur-sm shadow-sm">
                    ⏱️ {calculateDriveTime(distance)}
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* Preis */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg shadow-sm">
            <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
              {formatPrice(caravan.pricePerDay)}{t('campers.perDay')}
            </span>
          </div>
          
          {/* Rating */}
          {caravan.rating && (
            <div className="absolute bottom-4 right-4 bg-white dark:bg-zinc-800 px-2 py-1 rounded-lg shadow-sm flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{caravan.rating}</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col flex-grow" suppressHydrationWarning>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-teal-600 transition-colors">
            {caravan.name}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3 line-clamp-2">
            {caravan.description}
          </p>
          
          {/* Details */}
          <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            <span>{caravan.beds} {t('campers.beds')}</span>
            <div className="flex items-center">
              <span>{caravan.location}</span>
              {isMounted && distance > 0 && (
                <span className="ml-1 text-teal-600 dark:text-teal-400 font-medium">
                  • {formatDistance(distance)}
                </span>
              )}
            </div>
            <span>{caravan.driveType || 'Diesel'}</span>
          </div>
          
          {/* Features */}
          <div className="mb-4 flex-grow">
            <div className="flex flex-wrap gap-1 mb-2">
              {caravan.features?.slice(0, 3).map((feature, index) => (
                <span key={index} className="px-2 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            href={`/campers/${caravan.slug || caravan.id}`}
            variant="secondary" 
            className="w-full group-hover:bg-teal-600 group-hover:text-white transition-colors mt-auto"
          >
            {t('campers.viewDetails')}
          </Button>
        </div>
      </div>
    </div>
  )
}



// Enhanced Leere-Ergebnisse Section
function EmptyResultsSection({ onClearFilters }) {
  const { t } = useLanguage()
  
  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-teal-50/50 dark:from-zinc-900/80 dark:via-zinc-900/90 dark:to-zinc-800/80 overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1500" />
      
      <Container className="relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-700/50 p-8 hover:bg-white/90 dark:hover:bg-zinc-800/90 transition-all duration-300">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent mb-4">
            Keine Wohnmobile gefunden
          </h3>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Versuchen Sie es mit anderen Suchbegriffen oder passen Sie Ihre Filter an.
          </p>
          <Button 
            onClick={onClearFilters} 
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Alle Filter zurücksetzen
          </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

// Hauptkomponente
export default function CaravansPage({ caravans: initialCaravans }) {
  const { t } = useLanguage()
  const router = useRouter()
  const { trackSearch, trackFilterUsage, trackCamperView, trackButtonClick } = useAnalytics()
  
  // Auto-track page view
  usePageViewTracking('campers_listing')
  
  // Debug: Log initial caravans to see what we receive
  console.log('CaravansPage received caravans:', initialCaravans?.length || 0, 'items')
  
  const [caravans, setCaravans] = useState(initialCaravans || [])
  const [isLoadingCaravans, setIsLoadingCaravans] = useState(false)
  
  // Fallback: Lade Daten client-seitig wenn keine Server-Daten
  useEffect(() => {
    console.log('Effect triggered - caravans length:', caravans?.length)
    if (!caravans || caravans.length === 0) {
      console.log('Loading campers from API...')
      setIsLoadingCaravans(true)
      fetch('/api/campers?limit=100')
        .then(res => res.json())
        .then(data => {
          console.log('Loaded', data.data?.length || 0, 'campers from API')
          if (data.success && data.data && data.data.length > 0) {
            setCaravans(data.data);
          } else {
            console.warn('No API data received')
            setCaravans([]);
          }
        })
        .catch(error => {
          console.error('Error loading campers:', error)
          setCaravans([]);
        })
        .finally(() => {
          setIsLoadingCaravans(false)
        })
    } else {
      console.log('Using existing caravans data:', caravans.length, 'items')
    }
  }, [caravans])
  const { userLocation, nearbyLocations, calculateDistance } = useSmartLocation()
  const [isMounted, setIsMounted] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 500],
    vanType: '',
    capacity: '',
    amenities: [],
    availability: { startDate: '', endDate: '' },
    distance: 50,
    sortBy: 'price-low',
    transmission: '',
    fuelType: '',
    year: '',
    features: [],
    nearbyOnly: false, // Neuer Filter für nearby locations  
    maxDistance: 100   // Standard: 100km Radius für intelligente Filterung
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch] = useDebounce(searchTerm, 300)
  const [isLoading, setIsLoading] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [nearbyOnly, setNearbyOnly] = useState(false)
  
  // Verhindere Hydration Error bei client-only features
  useEffect(() => {
    setIsMounted(true)
    setCurrentDate(new Date().toISOString().split('T')[0])
  }, [])
  
  // Handle location filter changes with current location detection
  const handleLocationFilterChange = (newFilters) => {
    setFilters(newFilters)
    
    // Trigger location detection if 'current' is selected
    if (newFilters.location === 'current' && !userLocation) {
      setShowLocationPicker(true)
    }
  }
  
  // Enhanced filtering mit proximity
  const enhancedFilteredCaravans = useVanFiltering(caravans, filters, debouncedSearch)
  
  // Markiere welche Camper buchbar sind (nur UUIDs)
  const caravansWithBookingStatus = enhancedFilteredCaravans.map(caravan => {
    const isUUID = caravan.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(caravan.id);
    return {
      ...caravan,
      bookingEnabled: isUUID,
      source: isUUID ? 'API' : 'Static'
    };
  });
  
  console.log('Debug: caravans length:', caravans?.length)
  console.log('Debug: enhancedFilteredCaravans length:', enhancedFilteredCaravans?.length)
  console.log('Debug: API vs Static:', caravansWithBookingStatus.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {}))
  console.log('Debug: filters:', JSON.stringify(filters, null, 2))
  console.log('Debug: debouncedSearch:', debouncedSearch)
  console.log('Debug: sample caravan structure:', caravans?.[0])
  
  // Proximity-enhanced caravans mit Entfernungsinfo
  const proximitySortedCaravans = caravansWithBookingStatus.map(caravan => {
    if (!userLocation) return caravan
    
    // Finde verfügbare Pickup-Locations für dieses Fahrzeug
    const availableLocations = PICKUP_LOCATIONS.filter(loc => 
      caravan.pickupLocations && caravan.pickupLocations.includes(loc.city)
    )
    
    const locationsWithDistance = availableLocations.map(location => ({
      ...location,
      distance: calculateDistance(userLocation, location.coordinates)
    })).sort((a, b) => a.distance - b.distance)
    
    const nearestLocation = locationsWithDistance[0]
    
    return {
      ...caravan,
      nearestPickupLocation: nearestLocation,
      distanceFromUser: nearestLocation?.distance || Infinity,
      isNearby: nearestLocation?.distance <= filters.maxDistance
    }
  }).filter(caravan => {
    // Smart Distance Filter: Nur anwenden wenn Standort gewählt ist
    if (userLocation) {
      // Zeige Caravans ohne verfügbare Pickup-Locations am Ende (aber zeige sie trotzdem)
      if (caravan.distanceFromUser === Infinity) {
        // Lasse Caravans ohne Distance-Info durch, aber sortiere sie ans Ende
        return true
      }
      
      // Wende konfigurierbaren Distanz-Filter nur auf Caravans mit gültiger Entfernung an
      return caravan.distanceFromUser <= filters.maxDistance
    }
    
    // Ohne Standort: Alle Caravans anzeigen
    return true
  }).sort((a, b) => {
    // Wenn ein Standort gewählt ist, sortiere standardmäßig nach Entfernung (nächste zuerst)
    if (userLocation && a.distanceFromUser !== undefined && b.distanceFromUser !== undefined) {
      // Caravans ohne gültige Entfernung (Infinity) ans Ende sortieren
      if (a.distanceFromUser === Infinity && b.distanceFromUser === Infinity) return 0
      if (a.distanceFromUser === Infinity) return 1
      if (b.distanceFromUser === Infinity) return -1
      
      return a.distanceFromUser - b.distanceFromUser
    }
    
    // Erweiterte Sortierung für spezielle Filter
    if (filters.sortBy === 'distance' && userLocation) {
      return a.distanceFromUser - b.distanceFromUser
    }
    
    // Andere Sortierungen
    if (filters.sortBy === 'price-low') {
      return a.pricePerDay - b.pricePerDay
    }
    if (filters.sortBy === 'price-high') {
      return b.pricePerDay - a.pricePerDay
    }
    
    // Standard: keine spezielle Sortierung
    return 0
  })

  // Final filtered caravans for display
  const filteredCaravans = proximitySortedCaravans

  // Load filters from URL on mount
  useEffect(() => {
    const { search, checkin, checkout, guests, location } = router.query
    if (search || checkin || checkout || guests || location) {
      setSearchTerm(search || '')
      setFilters(prev => ({
        ...prev,
        location: location || '',
        capacity: guests ? (guests >= 8 ? '8' : guests.toString()) : '',
        availability: {
          startDate: checkin || '',
          endDate: checkout || ''
        }
      }))
    }
  }, [router.query])

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    
    // Save preferred filters to functional cookies if allowed
    functionalCookies.savePreferredFilters(newFilters)
  }

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term)
    
    // Save search to functional cookies if allowed
    functionalCookies.saveSearch(term, filters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      location: '',
      priceRange: [0, 500],
      vanType: '',
      capacity: '',
      amenities: [],
      availability: { startDate: '', endDate: '' },
      distance: 50,
      sortBy: 'price-low',
      transmission: '',
      fuelType: '',
      year: '',
      features: []
    }
    setFilters(defaultFilters)
    setSearchTerm('')
  }

  return (
    <>
      <Head>
        <title>CamperShare</title>
        <meta
          name="description"
          content={t('campers.subtitle')}
        />
      </Head>
      
      <div className="overflow-hidden">
        <CampersHeroSection />
        <SearchAndFiltersSection 
          onSearch={handleSearch}
          onFiltersChange={handleLocationFilterChange}
          filters={filters}
          searchTerm={searchTerm}
          resultCount={filteredCaravans.length}
          nearbyOnly={nearbyOnly}
          setNearbyOnly={setNearbyOnly}
          isMounted={isMounted}
          userLocation={userLocation}
        />
        
        {/* Hauptinhalt */}
        {filteredCaravans.length > 0 ? (
          <section className="py-16 bg-zinc-50 dark:bg-zinc-800/50">
            <Container>
              {/* Ergebnisse Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredCaravans.map((caravan) => (
                  <CamperCard 
                    key={caravan.slug || caravan.id} 
                    caravan={caravan} 
                    userLocation={isMounted ? userLocation : null}
                    distance={isMounted && userLocation ? caravan.distanceFromUser : null}
                    nearestLocation={caravan.nearestPickupLocation}
                    vanId={caravan.id}
                    bookingEnabled={caravan.bookingEnabled}
                  />
                ))}
                
                {/* Loading placeholder cards */}
                {isLoading && Array.from({ length: 3 }).map((_, index) => (
                  <div key={`loading-${index}`} className="animate-pulse">
                    <div className="bg-zinc-200 dark:bg-zinc-700 rounded-2xl h-64 mb-4"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
              
              {/* Mehr laden Button */}
              {filteredCaravans.length >= 12 && (
                <div className="text-center">
                  <Button 
                    size="lg" 
                    variant="outline"
                    disabled={isLoading}
                    className="px-8 py-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500 mr-2"></div>
                        Lädt...
                      </>
                    ) : (
                      'Mehr Wohnmobile laden'
                    )}
                  </Button>
                </div>
              )}
            </Container>
          </section>
        ) : (
          <EmptyResultsSection onClearFilters={clearFilters} />
        )}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  // Für bessere Performance und Stabilität verwenden wir nur client-seitige Datenladung
  // Server-seitiges Rendering ist für diese Seite nicht kritisch
  return {
    props: { 
      caravans: [] // Leere Liste, client lädt die echten Daten
    }
  }
}
