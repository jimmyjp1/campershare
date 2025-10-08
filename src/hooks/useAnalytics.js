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
