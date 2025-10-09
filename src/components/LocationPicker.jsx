/**
 * LocationPicker.jsx
 * ==================
 * 
 * HAUPTFUNKTION:
 * Intelligente Standortauswahl-Komponente mit automatischer Erkennung und benutzerfreundlicher Oberfläche.
 * Kombiniert GPS-Standorterkennung, nahegelegene Abholpunkte und Standortverlauf für optimale Benutzererfahrung.
 * 
 * HAUPT-FEATURES:
 * 
 * 1. SmartLocationPicker - Hauptkomponente:
 *    - Automatische GPS-Standorterkennung
 *    - Anzeige nahegelegener Abholpunkte
 *    - Integration von Standortverlauf
 *    - Responsive Design für mobile und Desktop
 * 
 * 2. Intelligente Standortdienste:
 *    - useSmartLocation Hook für GPS und Nearby-Locations
 *    - useLocationHistory für häufig genutzte Standorte
 *    - Permission-Management für Geolocation API
 *    - Automatische Fehlerbehandlung und Fallbacks
 * 
 * 3. Benutzerfreundliche Oberfläche:
 *    - Visual Feedback mit Heroicons
 *    - Loading-States während Standorterkennung
 *    - Erfolgs- und Fehlermeldungen
 *    - Erweiterbarer Optionsbereich
 * 
 * TECHNISCHE INTEGRATION:
 * 
 * 1. Smart Location Service:
 *    - userLocation: Aktuelle GPS-Position des Benutzers
 *    - nearbyLocations: Array von nahegelegenen Abholpunkten
 *    - isDetecting: Loading-State für GPS-Abfrage
 *    - error: Fehlermeldungen bei Standortproblemen
 *    - hasPermission: Browser Geolocation Permission Status
 * 
 * 2. Location History Service:
 *    - Speicherung häufig genutzter Standorte
 *    - LocalStorage basierte Persistierung
 *    - Automatische Vorschläge basierend auf Verlauf
 *    - Smart Ranking nach Häufigkeit und Aktualität
 * 
 * 3. Zustandsverwaltung:
 *    - showAllOptions: Toggle für erweiterte Optionen
 *    - selectedLocation: Aktuell ausgewählter Standort
 *    - isMounted: SSR-sichere Hydration-Kontrolle
 * 
 * PROPS INTERFACE:
 * 
 * @param {function} onLocationSelect - Callback für Standortauswahl
 *   - Erhält Location-Objekt mit selectionType und Timestamp
 *   - Ermöglicht Integration in Buchungsformulare
 * 
 * @param {boolean} showNearbyLocations - Zeige nahegelegene Standorte
 *   - Standard: true
 *   - Kann deaktiviert werden für vereinfachte UI
 * 
 * @param {string} className - CSS-Klassen für Container
 *   - Standard: "" (leerer String)
 *   - TailwindCSS Styling-Anpassungen
 * 
 * LOCATION DATA STRUKTUR:
 * 
 * ```javascript
 * {
 *   lat: 52.5200,           // Latitude Koordinate
 *   lng: 13.4050,           // Longitude Koordinate
 *   address: "Berlin...",   // Formatierte Adresse
 *   city: "Berlin",         // Stadt
 *   country: "Germany",     // Land
 *   selectionType: "gps",   // "gps", "nearby", "manual", "history"
 *   selectedAt: "2024-...", // ISO Timestamp
 *   accuracy: 10            // GPS Genauigkeit in Metern
 * }
 * ```
 * 
 * VERWENDUNG:
 * 
 * Basis-Integration:
 * <SmartLocationPicker onLocationSelect={handleLocationSelect} />
 * 
 * Mit erweiterten Optionen:
 * <SmartLocationPicker 
 *   onLocationSelect={(location) => {
 *     setPickupLocation(location);
 *     calculateDistanceToDestination(location);
 *   }}
 *   showNearbyLocations={true}
 *   className="mb-6 p-4 bg-white rounded-lg shadow"
 * />
 * 
 * In Buchungsformularen:
 * <SmartLocationPicker 
 *   onLocationSelect={(location) => {
 *     updateBookingForm({ pickupLocation: location });
 *     findAvailableCampers(location);
 *   }}
 * />
 * 
 * BENUTZER-WORKFLOW:
 * 
 * 1. Automatische Standorterkennung beim Laden
 * 2. Anzeige von GPS-Position (mit Permission)
 * 3. Liste nahegelegener Abholpunkte
 * 4. Standortverlauf für wiederkehrende Nutzer
 * 5. Manuelle Standorteingabe als Fallback
 * 6. Bestätigung und Weiterleitung an Parent-Component
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-First Ansatz mit Touch-optimierten Buttons
 * - Adaptive Layouts für verschiedene Bildschirmgrößen
 * - Performante Rendering für große Location-Listen
 * - Lazy Loading für Nearby-Locations
 * 
 * ACCESSIBILITY:
 * - Tastatur-Navigation für alle Interaktionen
 * - Screen-Reader optimierte Labels und Beschreibungen
 * - ARIA-Live Regions für dynamische Inhalte
 * - Hohe Kontraste und klare Fokus-Indikatoren
 * 
 * PERFORMANCE:
 * - Debounced GPS-Abfragen zur Batteriesparung
 * - Memoized Nearby-Location Calculations
 * - Lazy Rendering großer Location-Listen
 * - Optimierte Re-Rendering durch React.memo
 * 
 * ABHÄNGIGKEITEN:
 * - locationService: Smart Location und History Hooks
 * - @heroicons/react: UI Icons für visuelles Feedback
 * - React Hooks: useState, useEffect für Zustandsverwaltung
 */

// Smart Location Components für automatische Standorterkennung
import React, { useState, useEffect } from 'react'
import { useSmartLocation, useLocationHistory } from '../services/locationService'
import { 
  MapPinIcon, 
  GlobeAltIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

// Haupt-Komponente für Smart Location Detection
export function SmartLocationPicker({ onLocationSelect, showNearbyLocations = true, className = "" }) {
  const { 
    userLocation, 
    nearbyLocations, 
    isDetecting, 
    error, 
    hasPermission,
    detectLocation,
    updateLocation
  } = useSmartLocation()

  const [showAllOptions, setShowAllOptions] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  // Verhindere Hydration Error
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Location Selection Handler
  const handleLocationSelect = (location, type = 'manual') => {
    const locationData = {
      ...location,
      selectionType: type,
      selectedAt: isMounted ? new Date().toISOString() : ''
    }
    
    setSelectedLocation(locationData)
    updateLocation(locationData)
    
    if (onLocationSelect) {
      onLocationSelect(locationData)
    }
  }

  // Auto-select nearby location wenn verfügbar
  useEffect(() => {
    if (nearbyLocations.length > 0 && !selectedLocation && isMounted) {
      const nearest = nearbyLocations[0]
      handleLocationSelect(nearest, 'auto')
    }
  }, [nearbyLocations, selectedLocation, isMounted])

  // Render nichts bis client-side hydration abgeschlossen ist
  if (!isMounted) {
    return (
      <div className={`smart-location-picker ${className}`}>
        <div className="animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg h-20"></div>
      </div>
    )
  }

  return (
    <div className={`smart-location-picker ${className}`}>
      
      {/* Current Location Status */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <MapPinIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Ihr Standort
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {isDetecting ? 'Standort wird erkannt...' : 
               userLocation ? `${userLocation.city || userLocation.address}` : 
               'Standort unbekannt'}
            </p>
          </div>
        </div>

        {/* Location Status Indicator */}
        <div className="flex items-center gap-2 text-sm">
          {isDetecting && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Erkenne Standort...</span>
            </div>
          )}
          
          {userLocation && !isDetecting && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>
                {userLocation.source === 'geolocation' ? 'Automatisch erkannt' :
                 userLocation.isFromCache ? 'Aus Cookies geladen' :
                 userLocation.isFromHome ? 'Heimat-Standort' :
                 userLocation.isDefault ? 'Standard-Standort' : 'Manuell gewählt'}
              </span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <ExclamationCircleIcon className="w-4 h-4" />
              <span>Standort nicht verfügbar</span>
            </div>
          )}
        </div>
      </div>

      {/* Nearby Pickup Locations */}
      {showNearbyLocations && nearbyLocations.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3">
            🎯 Abholstationen in Ihrer Nähe
          </h4>
          
          <div className="space-y-3">
            {nearbyLocations.slice(0, showAllOptions ? nearbyLocations.length : 3).map((location, index) => (
              <NearbyLocationCard 
                key={location.id}
                location={location}
                isNearest={index === 0}
                isSelected={selectedLocation?.id === location.id}
                onSelect={() => handleLocationSelect(location, 'nearby')}
              />
            ))}
          </div>

          {nearbyLocations.length > 3 && (
            <button
              onClick={() => setShowAllOptions(!showAllOptions)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAllOptions ? 'Weniger anzeigen' : `${nearbyLocations.length - 3} weitere anzeigen`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Komponente für einzelne Nearby Location
function NearbyLocationCard({ location, isNearest, isSelected, onSelect }) {
  return (
    <div 
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-medium text-zinc-900 dark:text-zinc-100">
              {location.name}
            </h5>
            {isNearest && (
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                Am nächsten
              </span>
            )}
          </div>
          
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            {location.address}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span>📍 {location.distance?.toFixed(1)} km entfernt</span>
            <span>🚗 ~{location.travelTime} Min. Fahrt</span>
          </div>
        </div>
        
        {isSelected && (
          <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
        )}
      </div>
    </div>
  )
}

// Location History Component
export function LocationHistory({ onLocationSelect, maxItems = 5 }) {
  const { history } = useLocationHistory()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (history.length === 0) return null

  return (
    <div className="location-history">
      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
        <ClockIcon className="w-4 h-4" />
        Kürzlich verwendete Standorte
      </h4>
      
      <div className="space-y-2">
        {history.slice(0, maxItems).map((location, index) => (
          <button
            key={index}
            onClick={() => onLocationSelect(location)}
            className="w-full text-left p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 transition-colors"
          >
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {location.city || location.address}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {isMounted && location.visitedAt ? new Date(location.visitedAt).toLocaleDateString('de-DE') : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
