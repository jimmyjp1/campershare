// Smart Location Service für standortbasierte Features
import { useState, useEffect, useCallback } from 'react'
import { cookieService } from './browserCookieManager'
import { PICKUP_LOCATIONS } from './camperVehicleDataService'

// Utility function for browser detection (memoized)
const isBrowser = typeof window !== 'undefined';

// Location Service Klasse
class LocationService {
  constructor() {
    this.currentLocation = null
    this.isGeolocationAvailable = isBrowser && 'geolocation' in navigator
  }

  // Browser-Geolocation abfragen
  async getCurrentPosition() {
    if (!this.isGeolocationAvailable) {
      throw new Error('Geolocation nicht verfügbar')
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: 'geolocation',
            timestamp: new Date().toISOString()
          }
          resolve(location)
        },
        (error) => {
          reject(new Error(`Geolocation Fehler: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Längere Timeout für bessere Genauigkeit
          maximumAge: 60000 // Kürzeres Cache für aktuellere Position (1 Minute)
        }
      )
    })
  }

  // Reverse Geocoding für Koordinaten
  async reverseGeocode(lat, lng) {
    try {
      // Google Maps Reverse Geocoding nutzen wenn verfügbar
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder()
        
        return new Promise((resolve, reject) => {
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const result = results[0]
              const components = result.address_components
              
              const location = {
                lat,
                lng,
                address: result.formatted_address,
                city: this.extractComponent(components, 'locality') || 
                      this.extractComponent(components, 'sublocality') ||
                      this.extractComponent(components, 'administrative_area_level_2'),
                state: this.extractComponent(components, 'administrative_area_level_1'),
                country: this.extractComponent(components, 'country'),
                postalCode: this.extractComponent(components, 'postal_code'),
                accuracy: 'high' // Google Maps ist sehr genau
              }
              
              // Verbessere Genauigkeit für Rhein-Neckar Region
              const improvedLocation = this.improveLocationAccuracyForRegion(location);
              resolve(improvedLocation)
            } else {
              reject(new Error(`Reverse Geocoding fehlgeschlagen: ${status}`))
            }
          })
        })
      }
      
      // Fallback zu OpenStreetMap Nominatim mit höherer Genauigkeit
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=de`
      )
      
      if (!response.ok) {
        throw new Error('Reverse Geocoding Anfrage fehlgeschlagen')
      }
      
      const data = await response.json()
      
      const locationData = {
        lat,
        lng,
        address: data.display_name,
        city: data.address?.city || 
              data.address?.town || 
              data.address?.village || 
              data.address?.municipality ||
              data.address?.suburb,
        state: data.address?.state || data.address?.region,
        country: data.address?.country,
        postalCode: data.address?.postcode,
        accuracy: 'medium' // OpenStreetMap ist weniger genau als Google
      }
      
      // Verbessere Genauigkeit für Rhein-Neckar Region
      return this.improveLocationAccuracyForRegion(locationData);
      
    } catch (error) {
      console.warn('Reverse Geocoding Fehler:', error)
      return { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }
    }
  }

  // Helper: Komponente aus Google Maps Ergebnis extrahieren
  extractComponent(components, type) {
    const component = components.find(comp => comp.types.includes(type))
    return component ? component.long_name : null
  }

  // Spezielle Funktion für Rhein-Neckar Region (Heidelberg/Mannheim)
  improveLocationAccuracyForRegion(location) {
    const { lat, lng, city } = location;
    
    // Koordinaten für bekannte Städte in der Region mit präziseren Thresholds
    const cities = {
      'Mannheim': { lat: 49.4875, lng: 8.4660, threshold: 0.015 },        // Kleinerer Threshold für Mannheim
      'Heidelberg': { lat: 49.3988, lng: 8.6724, threshold: 0.015 },      // Kleinerer Threshold für Heidelberg  
      'Ludwigshafen': { lat: 49.4771, lng: 8.4454, threshold: 0.015 },
      'Weinheim': { lat: 49.5515, lng: 8.6696, threshold: 0.015 }
    };

    // Finde die nächstgelegene Stadt mit minimaler Entfernung
    let closestCity = null;
    let minDistance = Infinity;
    
    for (const [cityName, cityCoords] of Object.entries(cities)) {
      const distance = Math.sqrt(
        Math.pow(lat - cityCoords.lat, 2) + Math.pow(lng - cityCoords.lng, 2)
      );
      
      if (distance < cityCoords.threshold && distance < minDistance) {
        minDistance = distance;
        closestCity = cityName;
      }
    }
    
    // Nur zuweisen wenn eine Stadt eindeutig näher ist
    if (closestCity) {
      console.log(`🎯 Location corrected to ${closestCity} (distance: ${minDistance.toFixed(4)})`);
      return { ...location, city: closestCity, accuracy: 'corrected' };
    }
    
    return location;
  }

  // Entfernung zwischen zwei Punkten berechnen (Haversine)
  calculateDistance(point1, point2) {
    const R = 6371 // Erdradius in km
    const dLat = this.deg2rad(point2.lat - point1.lat)
    const dLon = this.deg2rad(point2.lng - point1.lng)
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Entfernung in km
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  // Nächste Pickup-Locations finden
  findNearbyPickupLocations(userLocation, maxDistance = 100, limit = 5) {
    const locationsWithDistance = PICKUP_LOCATIONS.map(location => ({
      ...location,
      distance: this.calculateDistance(userLocation, location.coordinates),
      travelTime: Math.round(this.calculateDistance(userLocation, location.coordinates) * 1.2) // Grobe Schätzung
    }))

    return locationsWithDistance
      .filter(location => location.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
  }

  // Smart Location Detection - kombiniert alle Quellen
  async detectSmartLocation() {
    let location = null
    
    // 1. Zuerst gespeicherte Location aus Cookies prüfen
    const savedLocation = cookieService.getUserLocation()
    if (savedLocation) {
      return {
        ...savedLocation,
        isFromCache: true,
        nearbyLocations: this.findNearbyPickupLocations(savedLocation)
      }
    }

    // 2. Heimat-Location prüfen
    const homeLocation = cookieService.getHomeLocation()
    if (homeLocation) {
      return {
        ...homeLocation,
        isFromHome: true,
        nearbyLocations: this.findNearbyPickupLocations(homeLocation)
      }
    }

    try {
      // 3. Browser Geolocation versuchen
      const coords = await this.getCurrentPosition()
      const geocoded = await this.reverseGeocode(coords.lat, coords.lng)
      
      location = {
        ...geocoded,
        source: 'geolocation',
        timestamp: new Date().toISOString()
      }

      // In Cookies speichern für zukünftige Besuche
      cookieService.saveUserLocation(location)
      
    } catch (error) {
      console.warn('⚠️ Geolocation fehlgeschlagen:', error.message)
      
      // 4. Fallback zu Standard-Location (Berlin)
      location = {
        lat: 52.5200,
        lng: 13.4050,
        address: 'Berlin, Deutschland',
        city: 'Berlin',
        country: 'Deutschland',
        source: 'default',
        isDefault: true
      }
    }

    // Nearby Locations hinzufügen
    location.nearbyLocations = this.findNearbyPickupLocations(location)
    
    return location
  }

  // Location in Verlauf speichern
  saveToHistory(location) {
    cookieService.addToLocationHistory(location)
  }

  // Als Heimat-Location setzen
  setAsHome(location) {
    cookieService.setHomeLocation(location)
  }
}

// Singleton Instance
const locationService = new LocationService()

// React Hook für Smart Location
export function useSmartLocation() {
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyLocations, setNearbyLocations] = useState([])
  const [isDetecting, setIsDetecting] = useState(false)
  const [error, setError] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  // Verhindere SSR-Client Mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Location Detection
  const detectLocation = useCallback(async (force = false) => {
    if (!isMounted) return null // Nur client-side ausführen
    if (userLocation && !force) return userLocation

    setIsDetecting(true)
    setError(null)

    try {
      const location = await locationService.detectSmartLocation()
      setUserLocation(location)
      setNearbyLocations(location.nearbyLocations || [])
      
      // Permission Status setzen
      if (location.source === 'geolocation') {
        setHasPermission(true)
      } else if (location.isDefault) {
        setHasPermission(false)
      }
      
      return location
    } catch (err) {
      setError(err.message)
      setHasPermission(false)
      console.error('Location Detection Fehler:', err)
    } finally {
      setIsDetecting(false)
    }
  }, [userLocation, isMounted])

  // Manual Location Update
  const updateLocation = useCallback(async (newLocation) => {
    if (!isMounted) return null
    
    const locationWithNearby = {
      ...newLocation,
      nearbyLocations: locationService.findNearbyPickupLocations(newLocation)
    }
    
    setUserLocation(locationWithNearby)
    setNearbyLocations(locationWithNearby.nearbyLocations)
    
    // In Cookies speichern
    cookieService.saveUserLocation(newLocation)
    locationService.saveToHistory(newLocation)
    
    return locationWithNearby
  }, [isMounted])

  // Als Heimat setzen
  const setAsHomeLocation = useCallback(() => {
    if (userLocation && isMounted) {
      locationService.setAsHome(userLocation)
    }
  }, [userLocation, isMounted])

  // Auto-detect beim ersten Laden (nur client-side)
  useEffect(() => {
    if (isMounted) {
      detectLocation()
    }
  }, [detectLocation, isMounted])

  return {
    userLocation,
    nearbyLocations,
    isDetecting,
    error,
    hasPermission,
    detectLocation,
    updateLocation,
    setAsHomeLocation,
    // Helper functions
    calculateDistance: locationService.calculateDistance.bind(locationService),
    findNearbyLocations: locationService.findNearbyPickupLocations.bind(locationService)
  }
}

// Utility Hook für Location History
export function useLocationHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const savedHistory = cookieService.getLocationHistory()
    setHistory(savedHistory)
  }, [])

  const addToHistory = useCallback((location) => {
    const newHistory = cookieService.addToLocationHistory(location)
    setHistory(newHistory)
  }, [])

  return { history, addToHistory }
}

export default locationService
