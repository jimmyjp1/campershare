// Interactive map components for pickup locations, route planning, and attractions
import React, { useState, useEffect, useRef } from 'react';
import { useGoogleMap, useMapMarkers, useDirections, usePlacesSearch, useGeolocation } from '../services/mapIntegrationService';
import { Button } from './Button';
import { PICKUP_LOCATIONS } from '../services/camperVehicleDataService';

// Main interactive map component for pickup locations
export function PickupLocationMap({ selectedLocation, onLocationSelect, height = "400px" }) {
  const mapId = `pickup-map-${Math.random().toString(36).substr(2, 9)}`;
  const { map, isLoaded, error } = useGoogleMap(mapId, {
    zoom: 10,
    center: selectedLocation ? selectedLocation.coordinates : { lat: 30.2672, lng: -97.7431 }
  });

  // Create markers for all pickup locations
  const markers = PICKUP_LOCATIONS.map(location => ({
    position: location.coordinates,
    title: location.name,
    type: 'pickup',
    content: `
      <div class="p-3 min-w-[200px]">
        <h3 class="font-semibold text-lg mb-2">${location.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${location.address}</p>
        <div class="flex items-center text-sm text-gray-500 mb-2">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ${location.hours}
        </div>
        <div class="flex items-center text-sm text-gray-500 mb-3">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          ${location.phone}
        </div>
        <button 
          onclick="window.selectPickupLocation('${location.id}')"
          class="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Select This Location
        </button>
      </div>
    `,
    onClick: (markerData) => {
      const location = PICKUP_LOCATIONS.find(loc => 
        loc.coordinates.lat === markerData.position.lat && 
        loc.coordinates.lng === markerData.position.lng
      );
      if (location && onLocationSelect) {
        onLocationSelect(location);
      }
    }
  }));

  // Set up global callback for info window buttons
  useEffect(() => {
    window.selectPickupLocation = (locationId) => {
      const location = PICKUP_LOCATIONS.find(loc => loc.id === locationId);
      if (location && onLocationSelect) {
        onLocationSelect(location);
      }
    };

    return () => {
      delete window.selectPickupLocation;
    };
  }, [onLocationSelect]);

  useMapMarkers(map, markers);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load map</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pickup-location-map">
      <div 
        id={mapId} 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Route planning component
export function RoutePlanningMap({ origin, destination, onRouteCalculated, height = "500px" }) {
  const mapId = `route-map-${Math.random().toString(36).substr(2, 9)}`;
  const [waypoints, setWaypoints] = useState([]);
  const [showAttractions, setShowAttractions] = useState(false);
  
  const { map, isLoaded, error } = useGoogleMap(mapId, {
    zoom: 8,
    center: origin || { lat: 30.2672, lng: -97.7431 }
  });

  const { directions, isLoading: routeLoading } = useDirections(
    map, 
    origin, 
    destination, 
    waypoints
  );

  const { searchResults, searchNearby, clearResults } = usePlacesSearch(map);

  // Search for attractions along the route
  useEffect(() => {
    if (directions && showAttractions && origin) {
      searchNearby(origin, {
        radius: 50000,
        types: ['tourist_attraction', 'park', 'museum', 'amusement_park']
      });
    } else {
      clearResults();
    }
  }, [directions, showAttractions, origin, searchNearby, clearResults]);

  // Create markers for attractions
  const attractionMarkers = searchResults.map(place => ({
    position: { lat: place.location.lat(), lng: place.location.lng() },
    title: place.name,
    type: 'attraction',
    content: `
      <div class="p-3 min-w-[200px]">
        <h3 class="font-semibold text-lg mb-2">${place.name}</h3>
        ${place.rating ? `
          <div class="flex items-center mb-2">
            <div class="flex text-yellow-400 mr-2">
              ${'★'.repeat(Math.floor(place.rating))}${'☆'.repeat(5 - Math.floor(place.rating))}
            </div>
            <span class="text-sm text-gray-600">${place.rating}/5</span>
          </div>
        ` : ''}
        <div class="flex flex-wrap gap-1 mb-3">
          ${place.types.slice(0, 3).map(type => 
            `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${type.replace(/_/g, ' ')}</span>`
          ).join('')}
        </div>
        <button 
          onclick="window.addWaypoint(${place.location.lat()}, ${place.location.lng()})"
          class="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add to Route
        </button>
      </div>
    `
  }));

  // Set up global callback for adding waypoints
  useEffect(() => {
    window.addWaypoint = (lat, lng) => {
      const newWaypoint = { lat, lng };
      setWaypoints(prev => [...prev, newWaypoint]);
    };

    return () => {
      delete window.addWaypoint;
    };
  }, []);

  useMapMarkers(map, attractionMarkers);

  // Call onRouteCalculated when directions are ready
  useEffect(() => {
    if (directions && onRouteCalculated) {
      onRouteCalculated({
        distance: Math.round(directions.distance / 1000), // Convert to km
        duration: Math.round(directions.duration / 60), // Convert to minutes
        routes: directions.routes
      });
    }
  }, [directions, onRouteCalculated]);

  const removeWaypoint = (index) => {
    setWaypoints(prev => prev.filter((_, i) => i !== index));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load map</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="route-planning-map">
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <Button
          onClick={() => setShowAttractions(!showAttractions)}
          variant={showAttractions ? "solid" : "outline"}
          size="sm"
        >
          {showAttractions ? 'Hide' : 'Show'} Nearby Attractions
        </Button>
        
        {waypoints.length > 0 && (
          <div className="text-sm text-gray-600">
            {waypoints.length} waypoint{waypoints.length !== 1 ? 's' : ''} added
          </div>
        )}
      </div>

      {waypoints.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Route Waypoints:</h4>
          <div className="space-y-2">
            {waypoints.map((waypoint, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>Stop {index + 1}: {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}</span>
                <button
                  onClick={() => removeWaypoint(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div 
        id={mapId} 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {routeLoading && (
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          Calculating route...
        </div>
      )}

      {directions && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Route Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700">Distance:</span>
              <span className="ml-2 font-medium">{Math.round(directions.distance / 1000)} km</span>
            </div>
            <div>
              <span className="text-green-700">Duration:</span>
              <span className="ml-2 font-medium">
                {Math.floor(directions.duration / 3600)}h {Math.floor((directions.duration % 3600) / 60)}m
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Nearby attractions display component
export function NearbyAttractionsMap({ center, radius = 25000, onAttractionSelect, height = "400px" }) {
  const mapId = `attractions-map-${Math.random().toString(36).substr(2, 9)}`;
  const [selectedTypes, setSelectedTypes] = useState(['tourist_attraction']);
  
  const { map, isLoaded, error } = useGoogleMap(mapId, {
    zoom: 11,
    center: center || { lat: 30.2672, lng: -97.7431 }
  });

  const { searchResults, isLoading: searchLoading, searchNearby } = usePlacesSearch(map);

  const attractionTypes = [
    { value: 'tourist_attraction', label: 'Tourist Attractions' },
    { value: 'park', label: 'Parks' },
    { value: 'museum', label: 'Museums' },
    { value: 'amusement_park', label: 'Amusement Parks' },
    { value: 'zoo', label: 'Zoos' },
    { value: 'aquarium', label: 'Aquariums' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'gas_station', label: 'Gas Stations' }
  ];

  // Search for attractions when center or types change
  useEffect(() => {
    if (map && center && selectedTypes.length > 0) {
      searchNearby(center, {
        radius,
        types: selectedTypes
      });
    }
  }, [map, center, selectedTypes, radius, searchNearby]);

  // Create markers for attractions
  const attractionMarkers = searchResults.map(place => ({
    position: { lat: place.location.lat(), lng: place.location.lng() },
    title: place.name,
    type: 'attraction',
    content: `
      <div class="p-3 min-w-[200px] max-w-[300px]">
        <h3 class="font-semibold text-lg mb-2">${place.name}</h3>
        ${place.rating ? `
          <div class="flex items-center mb-2">
            <div class="flex text-yellow-400 mr-2">
              ${'★'.repeat(Math.floor(place.rating))}${'☆'.repeat(5 - Math.floor(place.rating))}
            </div>
            <span class="text-sm text-gray-600">${place.rating}/5</span>
          </div>
        ` : ''}
        <div class="flex flex-wrap gap-1 mb-3">
          ${place.types.slice(0, 3).map(type => 
            `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${type.replace(/_/g, ' ')}</span>`
          ).join('')}
        </div>
        ${place.photos && place.photos.length > 0 ? `
          <img 
            src="${place.photos[0].getUrl({ maxWidth: 200, maxHeight: 150 })}" 
            alt="${place.name}"
            class="w-full h-32 object-cover rounded mb-3"
          />
        ` : ''}
        <button 
          onclick="window.selectAttraction('${place.placeId}')"
          class="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    `,
    onClick: (markerData) => {
      const attraction = searchResults.find(place => 
        place.location.lat() === markerData.position.lat && 
        place.location.lng() === markerData.position.lng
      );
      if (attraction && onAttractionSelect) {
        onAttractionSelect(attraction);
      }
    }
  }));

  // Set up global callback for attraction selection
  useEffect(() => {
    window.selectAttraction = (placeId) => {
      const attraction = searchResults.find(place => place.placeId === placeId);
      if (attraction && onAttractionSelect) {
        onAttractionSelect(attraction);
      }
    };

    return () => {
      delete window.selectAttraction;
    };
  }, [searchResults, onAttractionSelect]);

  useMapMarkers(map, attractionMarkers);

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load map</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nearby-attractions-map">
      <div className="mb-4">
        <h4 className="font-medium mb-3">Attraction Types:</h4>
        <div className="flex flex-wrap gap-2">
          {attractionTypes.map(({ value, label }) => (
            <label key={value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTypes.includes(value)}
                onChange={() => handleTypeChange(value)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div 
        id={mapId} 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {searchLoading && (
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          Searching for attractions...
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Found {searchResults.length} attraction{searchResults.length !== 1 ? 's' : ''} nearby
        </div>
      )}
    </div>
  );
}

// Location search component with autocomplete
export function LocationSearchInput({ onLocationSelect, placeholder = "Search for a location..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
    }
  }, []);

  const searchPlaces = async (input) => {
    if (!input.trim() || !autocompleteService.current) return;

    setIsLoading(true);
    
    const request = {
      input,
      types: ['geocode', 'establishment']
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    });
  };

  const selectPlace = (prediction) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId: prediction.place_id },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const location = {
            name: place.name || prediction.description,
            address: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            placeId: place.place_id
          };
          
          onLocationSelect(location);
          setQuery(prediction.description);
          setSuggestions([]);
        }
      }
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchPlaces(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <circle cx="12" cy="8" r="3" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => selectPlace(prediction)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {prediction.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-500">
                {prediction.structured_formatting.secondary_text}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Current location button component
export function CurrentLocationButton({ onLocationFound, className = "" }) {
  const { location, isLoading, error, getCurrentLocation } = useGeolocation();

  useEffect(() => {
    if (location && onLocationFound) {
      onLocationFound(location);
    }
  }, [location, onLocationFound]);

  return (
    <Button
      onClick={getCurrentLocation}
      disabled={isLoading}
      className={`${className} flex items-center`}
      variant="outline"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          Getting location...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <circle cx="12" cy="8" r="3" />
          </svg>
          Use Current Location
        </>
      )}
    </Button>
  );
}
