// Google Maps API integration service for interactive maps and location features
import { useState, useEffect, useRef, useCallback } from 'react';

// Map configuration and constants
const MAP_CONFIG = {
  defaultCenter: { lat: 30.2672, lng: -97.7431 }, // Austin, TX
  defaultZoom: 10,
  styles: {
    standard: [],
    satellite: [{ elementType: 'labels', stylers: [{ visibility: 'on' }] }],
    terrain: [],
    hybrid: [
      { featureType: 'all', elementType: 'labels', stylers: [{ visibility: 'on' }] }
    ]
  },
  markerIcons: {
    pickup: {
      url: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#10B981" stroke="#ffffff" stroke-width="2"/>
          <path d="M16 8l-6 8h4v6h4v-6h4z" fill="#ffffff"/>
        </svg>
      `),
      scaledSize: { width: 32, height: 32 }
    },
    attraction: {
      url: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="10" fill="#F59E0B" stroke="#ffffff" stroke-width="2"/>
          <path d="M14 6l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#ffffff"/>
        </svg>
      `),
      scaledSize: { width: 28, height: 28 }
    },
    van: {
      url: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="11" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
          <path d="M6 15h3l3-6h6l3 6h3c1 0 2 1 2 2v2h-1c0 1-1 2-2 2s-2-1-2-2H11c0 1-1 2-2 2s-2-1-2-2H6v-2c0-1 1-2 2-2z" fill="#ffffff"/>
          <circle cx="10" cy="21" r="1" fill="#ffffff"/>
          <circle cx="20" cy="21" r="1" fill="#ffffff"/>
        </svg>
      `),
      scaledSize: { width: 30, height: 30 }
    }
  }
};

// Google Maps service class
class MapsService {
  constructor() {
    this.isLoaded = false;
    this.loadPromise = null;
    this.geocoder = null;
    this.directionsService = null;
    this.placesService = null;
  }

  // Load Google Maps API
  async loadMapsAPI(apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY') {
    if (this.isLoaded) return window.google;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        this.initializeServices();
        resolve(window.google);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Global callback function
      window.initMap = () => {
        this.isLoaded = true;
        this.initializeServices();
        resolve(window.google);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  initializeServices() {
    if (window.google && window.google.maps) {
      this.geocoder = new window.google.maps.Geocoder();
      this.directionsService = new window.google.maps.DirectionsService();
    }
  }

  // Geocoding functions
  async geocodeAddress(address) {
    if (!this.geocoder) {
      throw new Error('Maps API not loaded');
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            location: results[0].geometry.location,
            address: results[0].formatted_address,
            placeId: results[0].place_id
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  async reverseGeocode(lat, lng) {
    if (!this.geocoder) {
      throw new Error('Maps API not loaded');
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            address: results[0].formatted_address,
            components: results[0].address_components
          });
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });
  }

  // Route planning
  async calculateRoute(origin, destination, waypoints = []) {
    if (!this.directionsService) {
      throw new Error('Maps API not loaded');
    }

    const request = {
      origin,
      destination,
      waypoints: waypoints.map(point => ({ location: point, stopover: true })),
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      avoidTolls: false,
      avoidHighways: false
    };

    return new Promise((resolve, reject) => {
      this.directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          resolve({
            routes: result.routes,
            distance: result.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0),
            duration: result.routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0),
            waypoint_order: result.routes[0].waypoint_order
          });
        } else {
          reject(new Error(`Route calculation failed: ${status}`));
        }
      });
    });
  }

  // Find nearby attractions
  async findNearbyAttractions(location, radius = 50000, types = ['tourist_attraction', 'park', 'museum']) {
    if (!this.placesService) {
      throw new Error('Places service not initialized');
    }

    const request = {
      location,
      radius,
      types
    };

    return new Promise((resolve, reject) => {
      this.placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results.map(place => ({
            name: place.name,
            location: place.geometry.location,
            rating: place.rating,
            photos: place.photos,
            types: place.types,
            placeId: place.place_id
          })));
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  // Calculate distance between two points
  calculateDistance(point1, point2) {
    if (!window.google || !window.google.maps) {
      // Fallback to Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = this.deg2rad(point2.lat - point1.lat);
      const dLon = this.deg2rad(point2.lng - point1.lng);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c * 1000; // Distance in meters
    }

    return window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(point1.lat, point1.lng),
      new window.google.maps.LatLng(point2.lat, point2.lng)
    );
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Get user's current location mit verbesserter Fehlerbehandlung
  async getCurrentLocation(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation wird von diesem Browser nicht unterstützt'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 15000, // 15 Sekunden
        maximumAge: 5 * 60 * 1000, // 5 Minuten
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          let errorMessage = 'Standort konnte nicht ermittelt werden';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Standortzugriff wurde verweigert';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Standortinformationen sind nicht verfügbar';
              break;
            case error.TIMEOUT:
              errorMessage = 'Zeitüberschreitung beim Ermitteln des Standorts';
              break;
            default:
              errorMessage = `Geolocation Fehler: ${error.message}`;
              break;
          }
          
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }
}

// Create singleton instance
const mapsService = new MapsService();

// React hooks for Google Maps functionality

// Main map hook
export function useGoogleMap(containerId, options = {}) {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await mapsService.loadMapsAPI();
        
        const mapOptions = {
          center: options.center || MAP_CONFIG.defaultCenter,
          zoom: options.zoom || MAP_CONFIG.defaultZoom,
          styles: MAP_CONFIG.styles[options.mapStyle || 'standard'],
          disableDefaultUI: options.disableDefaultUI || false,
          zoomControl: options.zoomControl !== false,
          mapTypeControl: options.mapTypeControl !== false,
          streetViewControl: options.streetViewControl !== false,
          fullscreenControl: options.fullscreenControl !== false,
          ...options
        };

        const container = document.getElementById(containerId);
        if (container) {
          const mapInstance = new window.google.maps.Map(container, mapOptions);
          mapsService.placesService = new window.google.maps.places.PlacesService(mapInstance);
          setMap(mapInstance);
          mapRef.current = mapInstance;
          setIsLoaded(true);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    initializeMap();
  }, [containerId, options]);

  return { map, isLoaded, error };
}

// Markers hook
export function useMapMarkers(map, markers = []) {
  const [mapMarkers, setMapMarkers] = useState([]);

  useEffect(() => {
    if (!map || !markers.length) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = markers.map(markerData => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        icon: markerData.icon || MAP_CONFIG.markerIcons[markerData.type] || undefined
      });

      // Add info window if content provided
      if (markerData.content) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: markerData.content
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }

      // Add click listener if provided
      if (markerData.onClick) {
        marker.addListener('click', () => markerData.onClick(markerData));
      }

      return marker;
    });

    setMapMarkers(newMarkers);

    // Cleanup function
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, markers]);

  return mapMarkers;
}

// Directions hook
export function useDirections(map, origin, destination, waypoints = []) {
  const [directions, setDirections] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const directionsRenderer = useRef(null);

  useEffect(() => {
    if (!map || !origin || !destination) return;

    const calculateRoute = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mapsService.calculateRoute(origin, destination, waypoints);
        
        if (!directionsRenderer.current) {
          directionsRenderer.current = new window.google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#3B82F6',
              strokeWeight: 4
            }
          });
          directionsRenderer.current.setMap(map);
        }

        directionsRenderer.current.setDirections({ routes: result.routes });
        setDirections(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    calculateRoute();

    return () => {
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
      }
    };
  }, [map, origin, destination, waypoints]);

  return { directions, isLoading, error };
}

// Places search hook
export function usePlacesSearch(map) {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchNearby = useCallback(async (location, options = {}) => {
    if (!map) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await mapsService.findNearbyAttractions(
        location,
        options.radius,
        options.types
      );
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [map]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  return { searchResults, isLoading, error, searchNearby, clearResults };
}

// Geolocation hook mit verbesserter Fehlerbehandlung
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  // Prüfe Geolocation Permission Status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);
        
        result.addEventListener('change', () => {
          setPermissionStatus(result.state);
        });
      }).catch(() => {
        // Fallback für Browser ohne Permissions API
        setPermissionStatus('unknown');
      });
    }
  }, []);

  const getCurrentLocation = useCallback(async (options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prüfe Browser-Support
      if (!navigator.geolocation) {
        throw new Error('Geolocation wird von diesem Browser nicht unterstützt');
      }

      // Standard Optionen mit verbesserter Konfiguration
      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 15000, // 15 Sekunden
        maximumAge: 5 * 60 * 1000, // 5 Minuten
        ...options
      };

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            let errorMessage = 'Standort konnte nicht ermittelt werden';
            
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Standortzugriff wurde verweigert. Bitte erlauben Sie den Zugriff in den Browser-Einstellungen.';
                setPermissionStatus('denied');
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Standortinformationen sind nicht verfügbar.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Zeitüberschreitung beim Ermitteln des Standorts. Bitte versuchen Sie es erneut.';
                break;
              default:
                errorMessage = `Unbekannter Fehler: ${error.message}`;
                break;
            }
            
            reject(new Error(errorMessage));
          },
          defaultOptions
        );
      });

      const locationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        source: 'geolocation'
      };

      setLocation(locationData);
      setPermissionStatus('granted');
      
      // Speichere in localStorage für spätere Verwendung
      try {
        localStorage.setItem('lastKnownLocation', JSON.stringify({
          ...locationData,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Could not save location to localStorage:', e);
      }

      return locationData;

    } catch (err) {
      console.error('Geolocation error:', err);
      setError(err.message);
      
      // Versuche letzte bekannte Position zu laden
      try {
        const lastLocation = localStorage.getItem('lastKnownLocation');
        if (lastLocation) {
          const parsed = JSON.parse(lastLocation);
          // Nur verwenden wenn nicht älter als 1 Stunde
          if (Date.now() - parsed.timestamp < 60 * 60 * 1000) {
            setLocation({ ...parsed, source: 'cached' });
            setError(`${err.message} (Verwende letzte bekannte Position)`);
          }
        }
      } catch (e) {
        console.warn('Could not load cached location:', e);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatisches Laden beim ersten Mount (nur wenn Permission bereits granted)
  useEffect(() => {
    if (permissionStatus === 'granted' && !location) {
      getCurrentLocation().catch((error) => {
        console.warn('Auto-location failed:', error);
      });
    }
  }, [permissionStatus, location, getCurrentLocation]);

  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    // Fallback für Browser ohne Google Maps
    const R = 6371; // Erdradius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Entfernung in km
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    try {
      localStorage.removeItem('lastKnownLocation');
    } catch (e) {
      console.warn('Could not clear cached location:', e);
    }
  }, []);

  return { 
    location, 
    isLoading, 
    error, 
    permissionStatus,
    getCurrentLocation, 
    calculateDistance,
    clearLocation
  };
}

export default mapsService;
