import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/services/multilanguageService'
import { useCookies } from '@/services/browserCookieManager'

export function RecentlyViewedVehicles() {
  const [recentVehicles, setRecentVehicles] = useState([])
  const { formatPrice } = useLanguage()
  const { isAllowed } = useCookies()

  useEffect(() => {
    if (isAllowed('functional') && typeof window !== 'undefined') {
      try {
        const recent = JSON.parse(localStorage.getItem('campershare_recent_vehicles') || '[]')
        setRecentVehicles(recent.slice(0, 4)) // Show max 4
      } catch (error) {
        console.warn('Fehler beim Laden der zuletzt angesehenen Fahrzeuge:', error)
      }
    }
  }, [isAllowed])

  if (!recentVehicles.length || !isAllowed('functional')) {
    return null
  }

  return (
    <div className="relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-zinc-700/50 shadow-xl">
      {/* Glassmorphism Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-teal-500/10 opacity-50 rounded-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Zuletzt angesehen
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Ihre kürzlich besuchten Fahrzeuge
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentVehicles.map((vehicle, index) => (
            <Link
              key={vehicle.id}
              href={`/campers/${vehicle.slug}`}
              className="group block p-4 bg-white/60 dark:bg-zinc-700/60 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-600/50 hover:bg-white/80 dark:hover:bg-zinc-700/80 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 rounded-lg overflow-hidden">
                  {vehicle.image ? (
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      🚐
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {vehicle.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {formatPrice(vehicle.price)}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      / Tag
                    </span>
                  </div>
                </div>
                
                <div className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                  <EyeIcon className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TravelPlanningHub() {
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [routeDestination, setRouteDestination] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [nearestBranch, setNearestBranch] = useState(null)
  
  // CamperShare Filialen in Deutschland
  const branches = [
    { name: 'CamperShare München', city: 'München', coordinates: { lat: 48.1351, lng: 11.5820 }, address: 'Maximilianstrasse 1, 80539 München' },
    { name: 'CamperShare Hamburg', city: 'Hamburg', coordinates: { lat: 53.5511, lng: 9.9937 }, address: 'Speicherstadt 10, 20457 Hamburg' },
    { name: 'CamperShare Berlin', city: 'Berlin', coordinates: { lat: 52.5200, lng: 13.4050 }, address: 'Unter den Linden 77, 10117 Berlin' },
    { name: 'CamperShare Köln', city: 'Köln', coordinates: { lat: 50.9375, lng: 6.9603 }, address: 'Domkloster 4, 50667 Köln' },
    { name: 'CamperShare Frankfurt', city: 'Frankfurt', coordinates: { lat: 50.1109, lng: 8.6821 }, address: 'Kaiserstraße 13, 60311 Frankfurt' },
    { name: 'CamperShare Stuttgart', city: 'Stuttgart', coordinates: { lat: 48.7758, lng: 9.1829 }, address: 'Königstraße 28, 70173 Stuttgart' },
    { name: 'CamperShare Mannheim', city: 'Mannheim', coordinates: { lat: 49.4875, lng: 8.4660 }, address: 'Planken 7, 68161 Mannheim' },
    { name: 'CamperShare Heidelberg', city: 'Heidelberg', coordinates: { lat: 49.4032, lng: 8.6756 }, address: 'Willy-Brandt-Platz 5, 69115 Heidelberg' },
    { name: 'CamperShare Karlsruhe', city: 'Karlsruhe', coordinates: { lat: 49.0069, lng: 8.4037 }, address: 'Bahnhofplatz 1, 76137 Karlsruhe' },
    { name: 'CamperShare Hannover', city: 'Hannover', coordinates: { lat: 52.3759, lng: 9.7320 }, address: 'Bahnhofstraße 8, 30159 Hannover' },
    { name: 'CamperShare Bremen', city: 'Bremen', coordinates: { lat: 53.0793, lng: 8.8017 }, address: 'Sögestraße 72, 28195 Bremen' }
  ]

  // Haversine Formel für Entfernungsberechnung
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Erdradius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Standort ermitteln
  const getCurrentLocation = () => {
    setLocationLoading(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coords)
          
          // Nächste Filiale finden
          const branchesWithDistance = branches.map(branch => ({
            ...branch,
            distance: calculateDistance(coords.lat, coords.lng, branch.coordinates.lat, branch.coordinates.lng)
          })).sort((a, b) => a.distance - b.distance)
          
          setNearestBranch(branchesWithDistance[0])
          setLocationLoading(false)
        },
        (error) => {
          console.warn('Standort konnte nicht ermittelt werden:', error)
          setLocationLoading(false)
          // Fallback: München als Standard
          setNearestBranch(branches[0])
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 300000 // 5 Minuten Cache
        }
      )
    } else {
      console.warn('Geolocation wird nicht unterstützt')
      setLocationLoading(false)
      setNearestBranch(branches[0])
    }
  }

  // Automatisch Standort beim Laden der Komponente ermitteln
  useEffect(() => {
    getCurrentLocation()
  }, [])
  
  const travelDestinations = [
    { 
      name: 'München & Alpen', 
      region: 'Bayern',
      vehicles: 8,
      icon: '🏔️',
      description: 'Bergerlebnis & Oktoberfest',
      duration: '3-5 Tage',
      highlights: ['Neuschwanstein', 'Berchtesgaden', 'Oktoberfest'],
      bestSeason: 'Mai - Oktober',
      activities: ['Wandern', 'Kultur', 'Festivals']
    },
    { 
      name: 'Berlin & Brandenburg', 
      region: 'Berlin',
      vehicles: 6,
      icon: '🏛️',
      description: 'Kultur & Geschichte',
      duration: '4-6 Tage',
      highlights: ['Brandenburger Tor', 'Potsdam', 'Spreewald'],
      bestSeason: 'Ganzjährig',
      activities: ['Sightseeing', 'Museen', 'Natur']
    },
    { 
      name: 'Hamburg & Nordsee', 
      region: 'Hamburg',
      vehicles: 4,
      icon: '⚓',
      description: 'Maritime Erlebnisse',
      duration: '3-4 Tage',
      highlights: ['Speicherstadt', 'Wattenmeer', 'St. Pauli'],
      bestSeason: 'April - September',
      activities: ['Hafenrundfahrt', 'Strand', 'Nachtleben']
    },
    { 
      name: 'Rheinland & Eifel', 
      region: 'Nordrhein-Westfalen',
      vehicles: 7,
      icon: '🏰',
      description: 'Romantik & Weinkultur',
      duration: '5-7 Tage',
      highlights: ['Kölner Dom', 'Burg Eltz', 'Rheintal'],
      bestSeason: 'April - Oktober',
      activities: ['Weinverkostung', 'Burgen', 'Rheinkreuzfahrt']
    },
    { 
      name: 'Schwarzwald & Baden', 
      region: 'Baden-Württemberg',
      vehicles: 5,
      icon: '🌲',
      description: 'Wellness & Natur',
      duration: '4-6 Tage',
      highlights: ['Titisee', 'Baden-Baden', 'Kuckucksuhren'],
      bestSeason: 'März - November',
      activities: ['Wellness', 'Wandern', 'Kultur']
    }
  ]

  const handleDestinationClick = (destination) => {
    showRoutePreview(destination)
  }

  const showRoutePreview = (destination) => {
    setRouteDestination(destination)
    setShowRouteModal(true)
  }

  const planTrip = (destination) => {
    // Implementierung für Trip-Planung
    console.log('Planning trip to:', destination.name)
  }

  const getRouteStops = (destination) => {
    // Basis-Route ohne Benutzerstandort
    const baseRouteMap = {
      'München & Alpen': [
        { name: 'München Zentrum', icon: '🏰', time: 'Start', distance: '0 km', location: 'Marienplatz' },
        { name: 'Schloss Neuschwanstein', icon: '🏰', time: '1h 45min', distance: '125 km' },
        { name: 'Garmisch-Partenkirchen', icon: '🏔️', time: '45 Min', distance: '35 km' },
        { name: 'Berchtesgaden', icon: '🏔️', time: '2h 15min', distance: '150 km' }
      ],
      'Berlin & Brandenburg': [
        { name: 'Berlin Mitte', icon: '🏛️', time: 'Start', distance: '0 km', location: 'Brandenburger Tor' },
        { name: 'Potsdam', icon: '👑', time: '45 Min', distance: '35 km' },
        { name: 'Spreewald', icon: '🛶', time: '1h 20min', distance: '85 km' },
        { name: 'Tropical Islands', icon: '🌴', time: '30 Min', distance: '25 km' }
      ],
      'Hamburg & Nordsee': [
        { name: 'Hamburg Hafen', icon: '⚓', time: 'Start', distance: '0 km', location: 'Speicherstadt' },
        { name: 'St. Peter-Ording', icon: '🏖️', time: '1h 30min', distance: '110 km' },
        { name: 'Sylt', icon: '🌊', time: '2h 45min', distance: '180 km' },
        { name: 'Helgoland', icon: '🦭', time: '3h', distance: '200 km' }
      ],
      'Rheinland & Eifel': [
        { name: 'Köln Dom', icon: '⛪', time: 'Start', distance: '0 km', location: 'Kölner Dom' },
        { name: 'Bonn', icon: '🏛️', time: '30 Min', distance: '25 km' },
        { name: 'Burg Eltz', icon: '🏰', time: '1h 20min', distance: '75 km' },
        { name: 'Rheintal', icon: '🍇', time: '45 Min', distance: '40 km' }
      ],
      'Schwarzwald & Baden': [
        { name: 'Stuttgart', icon: '🏭', time: 'Start', distance: '0 km', location: 'Stadtmitte' },
        { name: 'Baden-Baden', icon: '♨️', time: '1h 15min', distance: '70 km' },
        { name: 'Titisee', icon: '🏔️', time: '1h 30min', distance: '95 km' },
        { name: 'Freiburg', icon: '🌲', time: '45 Min', distance: '40 km' }
      ]
    }

    const baseRoute = baseRouteMap[destination.name] || []

    // Wenn wir den Benutzerstandort und die nächste Filiale haben, Route anpassen
    if (userLocation && nearestBranch) {
      const distanceToNearestBranch = Math.round(nearestBranch.distance)
      const timeToNearestBranch = Math.ceil(nearestBranch.distance / 60) // Annahme: 60 km/h Durchschnitt
      
      // Erste Station: Route von aktuellem Standort zur nächsten Filiale
      const startStep = {
        name: `${nearestBranch.name}`,
        icon: '🚐',
        time: `${timeToNearestBranch}h ${Math.round((nearestBranch.distance / 60 - Math.floor(nearestBranch.distance / 60)) * 60)}min`,
        distance: `${distanceToNearestBranch} km`,
        location: nearestBranch.address,
        isUserRoute: true
      }

      // Kombiniere Benutzer-Route mit Ziel-Route
      return [startStep, ...baseRoute]
    }

    return baseRoute
  }

  // Gesamtrouten-Statistiken berechnen
  const getRouteStats = (destination) => {
    const stops = getRouteStops(destination)
    let totalDistance = 0
    let totalTime = 0

    stops.forEach(stop => {
      const distance = parseInt(stop.distance) || 0
      totalDistance += distance
      
      // Zeit parsen (z.B. "1h 30min" -> 90 Minuten)
      const timeStr = stop.time
      if (timeStr !== 'Start') {
        const hours = timeStr.match(/(\d+)h/) ? parseInt(timeStr.match(/(\d+)h/)[1]) : 0
        const minutes = timeStr.match(/(\d+)min/) ? parseInt(timeStr.match(/(\d+)min/)[1]) : 0
        totalTime += hours * 60 + minutes
      }
    })

    const totalHours = Math.floor(totalTime / 60)
    const remainingMinutes = totalTime % 60

    return {
      totalDistance: `~${totalDistance}km`,
      totalTime: `~${totalHours}h ${remainingMinutes}min`
    }
  }

  return (
    <div className="relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-zinc-700/50 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 opacity-50 rounded-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Reiseplanung
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Komplette Trips mit Fahrzeug & Route
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {travelDestinations.map((destination, index) => (
            <div key={index} className="group">
              <div 
                className="p-4 bg-white/60 dark:bg-zinc-700/60 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-600/50 hover:bg-white/80 dark:hover:bg-zinc-700/80 transition-all duration-200 hover:shadow-lg cursor-pointer"
                onClick={() => handleDestinationClick(destination)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{destination.icon}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {destination.name}
                      </h4>
                      <div className="flex gap-2">
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                          {destination.vehicles} Fahrzeuge
                        </span>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                          {destination.duration}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {destination.description}
                    </p>
                  </div>
                  
                  <div className="text-zinc-400 group-hover:text-emerald-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Destinations Link */}
        <div className="mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50">
          <Link
            href="/campers"
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Alle Fahrzeuge durchsuchen
          </Link>
        </div>
      </div>

      {/* Route Preview Modal - Optimized for no scrolling */}
      {showRouteModal && routeDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-700/50 h-[85vh] flex flex-col overflow-hidden">
            
            {/* Header - Fixed */}
            <div className="relative p-6 border-b border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{routeDestination.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      Route nach {routeDestination.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Optimale Route mit Zwischenstopps • {routeDestination.region}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRouteModal(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area - Flexible */}
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Route Steps - In 2 columns to fit better */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Standort-Info falls verfügbar */}
                {userLocation && nearestBranch && (
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">Ihr Standort erkannt</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                          Nächste Filiale: {nearestBranch.name} ({Math.round(nearestBranch.distance)} km entfernt)
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                          GPS: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ladezustand für Standorterkennung */}
                {locationLoading && (
                  <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center animate-pulse">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Standort wird ermittelt für optimale Routenplanung...
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {getRouteStops(routeDestination).map((stop, index) => (
                    <div key={index} className="relative">
                      {/* Connection Line - Only for left column on desktop */}
                      {index < getRouteStops(routeDestination).length - 1 && index % 2 === 0 && (
                        <div className="hidden md:block absolute left-6 top-16 w-0.5 h-6 bg-gradient-to-b from-emerald-300 to-teal-300 dark:from-emerald-600 dark:to-teal-600" />
                      )}
                      
                      {/* Route Stop */}
                      <div className={`h-fit p-4 backdrop-blur-sm rounded-xl border transition-all duration-200 ${
                        stop.isUserRoute 
                          ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/50 hover:bg-blue-100/80 dark:hover:bg-blue-900/40' 
                          : 'bg-white/60 dark:bg-zinc-700/60 border-zinc-200/50 dark:border-zinc-600/50 hover:bg-white/80 dark:hover:bg-zinc-700/80'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            stop.isUserRoute 
                              ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50' 
                              : 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30'
                          }`}>
                            {stop.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {stop.isUserRoute && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                                  Fahrzeug abholen
                                </span>
                              </div>
                            )}
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-2">
                              {stop.name}
                            </h4>
                            <div className="flex gap-2 mb-1">
                              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                                {stop.time}
                              </span>
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                {stop.distance}
                              </span>
                            </div>
                            {stop.location && (
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                📍 {stop.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Summary - Fixed bottom part */}
              <div className="flex-shrink-0 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-t border-emerald-200/50 dark:border-emerald-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="font-semibold text-emerald-800 dark:text-emerald-300 text-lg flex items-center gap-2">
                      🛣️ Gesamt-Route
                      {userLocation && <span className="text-sm text-emerald-600 dark:text-emerald-400">(ab Ihrem Standort)</span>}
                    </h5>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {routeDestination.duration} • {routeDestination.bestSeason}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center bg-white dark:bg-zinc-700/50 rounded-lg p-3 min-w-[80px]">
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {getRouteStats(routeDestination).totalDistance}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Gesamt</div>
                    </div>
                    <div className="text-center bg-white dark:bg-zinc-700/50 rounded-lg p-3 min-w-[80px]">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {getRouteStats(routeDestination).totalTime}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Fahrzeit</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                                    <button
                    onClick={() => {
                      planTrip(routeDestination)
                      setShowRouteModal(false)
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0721 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Trip starten & Fahrzeug wählen
                  </button>
                  
                  {/* Google Maps Button für Filiale */}
                  {nearestBranch && (
                    <button
                      onClick={() => {
                        const start = userLocation ? `${userLocation.lat},${userLocation.lng}` : ''
                        const destination = `${nearestBranch.coordinates.lat},${nearestBranch.coordinates.lng}`
                        const url = `https://maps.google.com/maps/dir/${start}/${destination}`
                        window.open(url, '_blank')
                      }}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                      title="Route zur Filiale"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Zur Filiale
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.open(`https://maps.google.com/maps/dir/${routeDestination.region}`, '_blank')}
                    className="px-4 py-3 bg-white dark:bg-zinc-700 border border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 rounded-xl font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Tour-Route
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
