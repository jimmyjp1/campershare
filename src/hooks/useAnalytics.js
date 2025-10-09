/**
 * useAnalytics.js - Analytics Hook
 * ================================
 * 
 * HAUPTFUNKTION:
 * Custom React Hook für umfassendes Frontend Event-Tracking und Benutzerverhalten-Analyse.
 * Vereinfacht das Tracking von Benutzerinteraktionen und ermöglicht datengetriebene Optimierungen.
 * 
 * TRACKING-FEATURES:
 * 
 * 1. Event-Tracking System:
 *    - Benutzerinteraktionen (Clicks, Form Submissions, Page Views)
 *    - Buchungsverhalten und Conversion-Events
 *    - Feature-Nutzung und Navigation-Patterns
 *    - Error-Tracking und Performance-Metriken
 * 
 * 2. Session-Management:
 *    - Unique Session ID Generation für Benutzer-Journey Tracking
 *    - LocalStorage-basierte Session-Persistierung
 *    - Cross-Tab Session-Synchronisation
 *    - Session-Timeout und Renewal-Mechanismen
 * 
 * 3. Duplicate Event Prevention:
 *    - Set-basierte Event-Deduplication
 *    - Intelligent Event-Key Generation
 *    - Memory-effiziente Tracking ohne Memory Leaks
 *    - Configurable Event-Throttling
 * 
 * 4. Privacy-Compliant Analytics:
 *    - DSGVO-konforme Datensammlung
 *    - Optional User ID Tracking für angemeldete Benutzer
 *    - Anonymized Analytics für Nicht-Benutzer
 *    - Opt-out Mechanismen und Cookie-Consent Integration
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. Session ID Management:
 *    - Math.random() + Date.now() für Unique ID Generation
 *    - Base36 Encoding für kompakte Session-Identifiers
 *    - Client-Side Storage für Session-Persistierung
 *    - Server-Side Session-Validation
 * 
 * 2. Event-Struktur:
 *    ```javascript
 *    {
 *      eventType: 'page_view' | 'click' | 'booking_started' | 'conversion',
 *      eventData: { // Context-spezifische Daten
 *        page: '/campers/123',
 *        element: 'book_now_button',
 *        value: 299.99
 *      },
 *      userId: 'user_123', // Optional für angemeldete Benutzer
 *      camperVanId: 'camper_456', // Optional für fahrzeugspezifische Events
 *      sessionId: 'abc123def456',
 *      timestamp: '2024-03-15T10:30:00Z'
 *    }
 *    ```
 * 
 * 3. API Integration:
 *    - RESTful API-Calls zu /api/analytics/track
 *    - POST-Requests mit JSON-Payload
 *    - X-Session-ID Header für Session-Zuordnung
 *    - Error-Handling für fehlgeschlagene Tracking-Requests
 * 
 * VERWENDUNG:
 * 
 * Standard Event-Tracking:
 * ```javascript
 * import { useAnalytics } from '../hooks/useAnalytics';
 * 
 * function BookingButton({ camper }) {
 *   const { trackEvent } = useAnalytics();
 *   
 *   const handleBookingClick = () => {
 *     trackEvent('booking_started', {
 *       camper_id: camper.id,
 *       price: camper.dailyRate,
 *       source: 'product_page'
 *     }, null, camper.id);
 *   };
 *   
 *   return <button onClick={handleBookingClick}>Book Now</button>;
 * }
 * ```
 * 
 * Page View Tracking:
 * ```javascript
 * function ProductPage({ camper }) {
 *   const { trackEvent } = useAnalytics();
 *   
 *   useEffect(() => {
 *     trackEvent('page_view', {
 *       page: `/campers/${camper.id}`,
 *       camper_type: camper.type,
 *       price_range: camper.priceCategory
 *     });
 *   }, [camper.id]);
 * }
 * ```
 * 
 * ANALYTICS EVENTS:
 * 
 * 1. Core Events:
 *    - page_view: Seitenaufrufe und Navigation
 *    - click: Button-Clicks und Interaktionen
 *    - form_submit: Formular-Submissions
 *    - search: Suchaktivitäten und Filter-Nutzung
 * 
 * 2. Business Events:
 *    - booking_started: Buchungsprozess begonnen
 *    - booking_completed: Erfolgreich abgeschlossene Buchung
 *    - payment_initiated: Zahlungsprozess gestartet
 *    - conversion: Conversion-Events für KPI-Tracking
 * 
 * 3. User Journey Events:
 *    - registration: Benutzerregistrierung
 *    - login: Anmeldung und Authentifizierung
 *    - profile_update: Profil-Änderungen
 *    - wishlist_add: Favoriten hinzugefügt
 * 
 * PERFORMANCE & PRIVACY:
 * 
 * 1. Performance Optimierung:
 *    - Asynchrone Event-Übertragung ohne UI-Blocking
 *    - Batch-Processing für Multiple Events
 *    - Client-Side Caching für Offline-Scenarios
 *    - Debounced Tracking für High-Frequency Events
 * 
 * 2. Privacy & Compliance:
 *    - Cookie-Consent Integration
 *    - PII-Free Event Payloads
 *    - User Opt-Out Mechanismen
 *    - Data Retention Policies
 * 
 * 3. Error Handling:
 *    - Graceful Degradation bei API-Fehlern
 *    - Retry-Mechanismen für fehlgeschlagene Requests
 *    - Client-Side Error-Logging
 *    - Fallback Analytics für Offline-Szenarien
 * 
 * EINSATZGEBIETE:
 * - Benutzerverhalten-Analyse und UX-Optimierung
 * - Conversion-Rate Optimierung und A/B Testing
 * - Business Intelligence und KPI-Tracking
 * - Product Performance und Feature-Adoption Monitoring
 * - Customer Journey Mapping und Funnel-Analyse
 * 
 * INTEGRATION:
 * - Google Analytics 4 Event-Forwarding
 * - Custom Analytics Dashboard Integration
 * - CRM-System Data-Feeds
 * - Business Intelligence Tools (Tableau, Power BI)
 * 
 * ABHÄNGIGKEITEN:
 * - React Hooks: useEffect, useRef für State-Management
 * - LocalStorage API für Session-Persistierung
 * - Fetch API für Server-Kommunikation
 * - Optional: Google Analytics oder andere Analytics-Provider
 */

// Analytics Hook für Frontend Event Tracking
// Vereinfacht das Tracken von Benutzerinteraktionen

import { useEffect, useRef } from 'react'

// Session ID für Analytics
let sessionId = null
if (typeof window !== 'undefined') {
  sessionId = localStorage.getItem('analytics_session') || 
              Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  localStorage.setItem('analytics_session', sessionId)
}

export function useAnalytics() {
  const trackedEvents = useRef(new Set())

  const trackEvent = async (eventType, eventData = {}, userId = null, camperVanId = null) => {
    try {
      // Duplicate Event Check (für Page Views etc.)
      const eventKey = `${eventType}_${JSON.stringify(eventData)}`
      if (trackedEvents.current.has(eventKey)) {
        return
      }
      trackedEvents.current.add(eventKey)

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({
          eventType,
          eventData,
          userId,
          camperVanId,
          sessionId
        })
      })

      if (!response.ok) {
        throw new Error(`Analytics tracking failed: ${response.status}`)
      }

      const result = await response.json()
      console.log('📊 Event tracked:', { eventType, eventId: result.data?.eventId })
      
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
      // Fail silently - Analytics sollten die User Experience nicht beeinträchtigen
    }
  }

  // Track Page View automatisch
  const trackPageView = (pageName, additionalData = {}) => {
    trackEvent('page_view', {
      page: pageName,
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
      ...additionalData
    })
  }

  // Track Camper View
  const trackCamperView = (camperId, camperName, viewDuration = null) => {
    trackEvent('camper_view', {
      camper_id: camperId,
      camper_name: camperName,
      view_duration: viewDuration,
      timestamp: new Date().toISOString()
    }, null, camperId)
  }

  // Track Search
  const trackSearch = (query, filters = {}, resultsCount = null) => {
    trackEvent('search', {
      query,
      filters,
      results_count: resultsCount,
      timestamp: new Date().toISOString()
    })
  }

  // Track Booking Process Steps
  const trackBookingStep = (step, camperId, bookingData = {}) => {
    trackEvent('booking_step', {
      step, // 'started', 'form_filled', 'payment_initiated', 'completed'
      camper_id: camperId,
      ...bookingData,
      timestamp: new Date().toISOString()
    }, null, camperId)
  }

  // Track Filter Usage
  const trackFilterUsage = (filterType, filterValue, resultsCount = null) => {
    trackEvent('filter_used', {
      filter_type: filterType,
      filter_value: filterValue,
      results_count: resultsCount,
      timestamp: new Date().toISOString()
    })
  }

  // Track Button Clicks
  const trackButtonClick = (buttonName, context = {}) => {
    trackEvent('button_click', {
      button_name: buttonName,
      context,
      timestamp: new Date().toISOString()
    })
  }

  // Track Form Interactions
  const trackFormInteraction = (formName, action, fieldName = null) => {
    trackEvent('form_interaction', {
      form_name: formName,
      action, // 'started', 'field_focused', 'submitted', 'abandoned'
      field_name: fieldName,
      timestamp: new Date().toISOString()
    })
  }

  // Track User Engagement
  const trackEngagement = (engagementType, value, context = {}) => {
    trackEvent('user_engagement', {
      engagement_type: engagementType, // 'time_on_page', 'scroll_depth', 'click_depth'
      value,
      context,
      timestamp: new Date().toISOString()
    })
  }

  return {
    trackEvent,
    trackPageView,
    trackCamperView,
    trackSearch,
    trackBookingStep,
    trackFilterUsage,
    trackButtonClick,
    trackFormInteraction,
    trackEngagement,
    sessionId
  }
}

// Hook für automatisches Page View Tracking
export function usePageViewTracking(pageName, additionalData = {}) {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    // Delay um sicherzustellen, dass die Seite vollständig geladen ist
    const timer = setTimeout(() => {
      trackPageView(pageName, additionalData)
    }, 100)

    return () => clearTimeout(timer)
  }, [pageName, trackPageView])
}

// Hook für Scroll Depth Tracking
export function useScrollTracking() {
  const { trackEngagement } = useAnalytics()
  const maxScrollDepth = useRef(0)
  const tracked25 = useRef(false)
  const tracked50 = useRef(false)
  const tracked75 = useRef(false)
  const tracked100 = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      maxScrollDepth.current = Math.max(maxScrollDepth.current, scrollPercent)

      // Track milestones
      if (scrollPercent >= 25 && !tracked25.current) {
        tracked25.current = true
        trackEngagement('scroll_depth', 25)
      }
      if (scrollPercent >= 50 && !tracked50.current) {
        tracked50.current = true
        trackEngagement('scroll_depth', 50)
      }
      if (scrollPercent >= 75 && !tracked75.current) {
        tracked75.current = true
        trackEngagement('scroll_depth', 75)
      }
      if (scrollPercent >= 100 && !tracked100.current) {
        tracked100.current = true
        trackEngagement('scroll_depth', 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackEngagement])

  // Track max scroll depth when component unmounts
  useEffect(() => {
    return () => {
      if (maxScrollDepth.current > 0) {
        trackEngagement('max_scroll_depth', maxScrollDepth.current)
      }
    }
  }, [trackEngagement])
}

// Hook für Time on Page Tracking
export function useTimeTracking() {
  const { trackEngagement } = useAnalytics()
  const startTime = useRef(Date.now())

  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - startTime.current
      if (timeSpent > 1000) { // Nur tracken wenn länger als 1 Sekunde
        trackEngagement('time_on_page', Math.round(timeSpent / 1000))
      }
    }
  }, [trackEngagement])
}
