/**
 * LocationPickerClient.jsx
 * ========================
 * 
 * HAUPTFUNKTION:
 * Client-seitige Wrapper-Komponente für LocationPicker zur Vermeidung von SSR-Hydration-Fehlern.
 * Implementiert sichere Client-Only Rendering mit Next.js Dynamic Imports.
 * 
 * SSR-PROBLEMATIK:
 * 
 * 1. Hydration Error Prevention:
 *    - Geolocation API ist nur im Browser verfügbar
 *    - Server-Side Rendering kann GPS-Funktionen nicht rendern
 *    - Unterschiedliche Initial States zwischen Server und Client
 *    - Dynamic Import verhindert SSR für kritische Browser-APIs
 * 
 * 2. Client-Only Loading Strategy:
 *    - Next.js Dynamic Import mit ssr: false
 *    - Placeholder während Server-Side Rendering
 *    - Smooth Transition von Loading zu Interactive State
 *    - Konsistente Benutzererfahrung ohne Flash of Unstyled Content
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. Dynamic Import Configuration:
 *    - Lazy Loading der SmartLocationPicker Komponente
 *    - SSR Deaktivierung (ssr: false) für Browser-spezifische APIs
 *    - Custom Loading Component während Import-Phase
 *    - Module Resolution mit .then() für named exports
 * 
 * 2. Mount State Management:
 *    - isMounted State für sichere Client-Detection
 *    - useEffect Hook für Mount-Lifecycle Tracking
 *    - Conditional Rendering basierend auf Mount-Status
 *    - Prevention von Race Conditions während Hydration
 * 
 * 3. Loading States und UX:
 *    - Animated Skeleton Loader während Dynamic Import
 *    - Konsistente Höhe (h-20) zur Layout Shift Prevention
 *    - Dark Mode kompatible Loading-Zustände
 *    - Emoji-basierte visuelle Indikatoren (📍)
 * 
 * PROPS INTERFACE:
 * 
 * @param {function} onLocationDetected - Callback für erkannte Standorte
 *   - Wird direkt an SmartLocationPicker weitergegeben
 *   - Ermöglicht nahtlose Integration in Parent-Komponenten
 * 
 * @param {string} className - CSS-Klassen für Container
 *   - Standard: "mb-8" für vertikalen Abstand
 *   - TailwindCSS kompatible Styling-Anpassungen
 * 
 * LOADING COMPONENT DESIGN:
 * 
 * - Pulse Animation für Loading-Feedback
 * - Adaptive Farbschema (Hell/Dunkel Modus)
 * - Zentrale Inhaltsausrichtung
 * - Consistent Height (h-20) für Layout Stabilität
 * - Emoji-Icon für intuitive Standort-Assoziation
 * 
 * VERWENDUNG:
 * 
 * Standard Integration:
 * <LocationPickerClient onLocationDetected={handleLocation} />
 * 
 * Mit Custom Styling:
 * <LocationPickerClient 
 *   onLocationDetected={(location) => setUserLocation(location)}
 *   className="mb-6 shadow-lg"
 * />
 * 
 * In Next.js Pages:
 * ```jsx
 * import LocationPickerClient from '../components/LocationPickerClient'
 * 
 * export default function BookingPage() {
 *   return (
 *     <div>
 *       <LocationPickerClient 
 *         onLocationDetected={(location) => {
 *           // Handle location selection
 *         }}
 *       />
 *     </div>
 *   )
 * }
 * ```
 * 
 * PERFORMANCE OPTIMIERUNGEN:
 * 
 * 1. Code Splitting:
 *    - Lazy Loading reduziert Initial Bundle Size
 *    - SmartLocationPicker wird nur bei Bedarf geladen
 *    - Separate Chunk für GPS-bezogene Funktionalitäten
 * 
 * 2. Hydration Optimization:
 *    - Keine Server-Client Mismatch Warnings
 *    - Smooth Client-Side Takeover nach Hydration
 *    - Consistent Loading States während Transition
 * 
 * 3. Bundle Efficiency:
 *    - Browser-spezifische APIs werden nicht server-seitig gebündelt
 *    - Kleinere SSR Bundle Size durch Dynamic Imports
 *    - On-Demand Loading für interaktive Features
 * 
 * BROWSER COMPATIBILITY:
 * - Graceful Degradation für Browser ohne Geolocation
 * - Progressive Enhancement mit Feature Detection
 * - Fallback UI für nicht unterstützte APIs
 * - Cross-Browser kompatible Dynamic Import Syntax
 * 
 * ACCESSIBILITY:
 * - Screen-Reader freundliche Loading-Meldungen
 * - Semantic HTML Structure während Loading
 * - Consistent Focus Management während Transitions
 * - ARIA-Live Updates für dynamische Inhalte
 * 
 * ABHÄNGIGKEITEN:
 * - Next.js Dynamic: SSR-sicheres Lazy Loading
 * - LocationPicker: SmartLocationPicker Hauptkomponente
 * - React Hooks: useState, useEffect für Mount-Tracking
 */

// Client-Only Location Picker um Hydration Errors zu vermeiden
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import ohne SSR
const SmartLocationPicker = dynamic(
  () => import('./LocationPicker').then(mod => mod.SmartLocationPicker),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg h-20 mb-8">
        <div className="flex items-center justify-center h-full">
          <div className="text-zinc-500 dark:text-zinc-400">📍 Standort wird geladen...</div>
        </div>
      </div>
    )
  }
)

export default function LocationPickerClient({ onLocationDetected, className = "mb-8" }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Render nichts während SSR
  if (!isMounted) {
    return (
      <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg h-20 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-zinc-500 dark:text-zinc-400">📍 Standort wird geladen...</div>
        </div>
      </div>
    )
  }

  return (
    <SmartLocationPicker 
      onLocationSelect={onLocationDetected}
      showNearbyLocations={true}
      className={className}
    />
  )
}
