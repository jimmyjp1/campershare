import React, { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from '../services/mapIntegrationService';
import { PICKUP_LOCATIONS, CAMPER_VANS } from '../services/camperVehicleDataService';

// Main filter component with all filtering options
export const AdvancedFilters = ({ onFiltersChange, availableVans = CAMPER_VANS }) => {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 500],
    vanType: '',
    capacity: '',
    amenities: [],
    availability: {
      startDate: '',
      endDate: ''
    },
    distance: 50, // miles from user location
    sortBy: 'price-low',
    transmission: '',
    fuelType: '',
    year: '',
    features: []
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const { getCurrentLocation, calculateDistance } = useGeolocation();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.warn('Could not get user location:', error);
      }
    };
    getUserLocation();
  }, [getCurrentLocation]);

  // All available amenities from the camper van data
  const availableAmenities = useMemo(() => {
    const amenitiesSet = new Set();
    availableVans.forEach(van => {
      van.amenities?.forEach(amenity => amenitiesSet.add(amenity));
    });
    return Array.from(amenitiesSet).sort();
  }, [availableVans]);

  // All available features
  const availableFeatures = useMemo(() => {
    const featuresSet = new Set();
    availableVans.forEach(van => {
      van.features?.forEach(feature => featuresSet.add(feature));
    });
    return Array.from(featuresSet).sort();
  }, [availableVans]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const handleFeatureToggle = (feature) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    handleFilterChange('features', newFeatures);
  };

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
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-700 flex items-center"
          >
            {isExpanded ? 'Less Filters' : 'More Filters'}
            <svg className={`ml-1 h-4 w-4 transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Location</option>
            {PICKUP_LOCATIONS.map(location => (
              <option key={location.id} value={location.id}>
                {location.name} - {location.city}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Rate: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <div className="flex space-x-2">
            <input
              type="range"
              min="0"
              max="500"
              value={filters.priceRange[0]}
              onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
        </div>

        {/* Van Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Van Type
          </label>
          <select
            value={filters.vanType}
            onChange={(e) => handleFilterChange('vanType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Type</option>
            <option value="Class B">Class B</option>
            <option value="Class C">Class C</option>
            <option value="Van Conversion">Van Conversion</option>
            <option value="Travel Trailer">Travel Trailer</option>
            <option value="Motorhome">Motorhome</option>
          </select>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sleeps
          </label>
          <select
            value={filters.capacity}
            onChange={(e) => handleFilterChange('capacity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Capacity</option>
            <option value="2">2 People</option>
            <option value="4">4 People</option>
            <option value="6">6 People</option>
            <option value="8">8+ People</option>
          </select>
        </div>
      </div>

      {/* Availability Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            value={filters.availability.startDate}
            onChange={(e) => handleFilterChange('availability', {
              ...filters.availability,
              startDate: e.target.value
            })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date
          </label>
          <input
            type="date"
            value={filters.availability.endDate}
            onChange={(e) => handleFilterChange('availability', {
              ...filters.availability,
              endDate: e.target.value
            })}
            min={filters.availability.startDate || new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-6 border-t pt-6">
          {/* Distance Filter */}
          {userLocation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Within {filters.distance} miles of your location
              </label>
              <input
                type="range"
                min="5"
                max="200"
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Additional Van Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission
              </label>
              <select
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Range
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Year</option>
                <option value="2020+">2020 & Newer</option>
                <option value="2015-2019">2015-2019</option>
                <option value="2010-2014">2010-2014</option>
                <option value="2009-">2009 & Older</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Special Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableFeatures.map(feature => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="capacity">Capacity</option>
            <option value="year-new">Year: Newest First</option>
            <option value="year-old">Year: Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="distance">Distance (if location enabled)</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          {/* Active filter count will be calculated by parent component */}
        </div>
      </div>
    </div>
  );
};

// Search bar component with autocomplete
export const SearchBar = ({ onSearch, placeholder = "Search by van name, location, or features..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate search suggestions based on available data
  const generateSuggestions = (term) => {
    if (!term || term.length < 2) {
      setSuggestions([]);
      return;
    }

    const suggestions = [];
    const lowerTerm = term.toLowerCase();

    // Van names
    CAMPER_VANS.forEach(van => {
      if (van.name.toLowerCase().includes(lowerTerm)) {
        suggestions.push({ type: 'van', text: van.name, id: van.id });
      }
    });

    // Locations
    PICKUP_LOCATIONS.forEach(location => {
      if (location.name.toLowerCase().includes(lowerTerm) || 
          location.city.toLowerCase().includes(lowerTerm)) {
        suggestions.push({ 
          type: 'location', 
          text: `${location.name}, ${location.city}`, 
          id: location.id 
        });
      }
    });

    // Amenities and features
    const allAmenities = new Set();
    CAMPER_VANS.forEach(van => {
      van.amenities?.forEach(amenity => {
        if (amenity.toLowerCase().includes(lowerTerm)) {
          allAmenities.add(amenity);
        }
      });
    });

    Array.from(allAmenities).forEach(amenity => {
      suggestions.push({ type: 'amenity', text: amenity });
    });

    setSuggestions(suggestions.slice(0, 8)); // Limit to 8 suggestions
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    generateSuggestions(value);
    setShowSuggestions(true);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text);
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
            >
              <div className={`w-2 h-2 rounded-full ${
                suggestion.type === 'van' ? 'bg-blue-500' :
                suggestion.type === 'location' ? 'bg-green-500' :
                'bg-orange-500'
              }`} />
              <span className="text-gray-900">{suggestion.text}</span>
              <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Filter hook for applying all filters to van data
export const useVanFiltering = (vans = [], filters = {}, searchTerm = '') => {
  const { calculateDistance } = useGeolocation();

  return useMemo(() => {
    // Wenn keine vans übergeben wurden oder leer, return empty array
    if (!vans || vans.length === 0) {
      console.log('useVanFiltering: No vans provided')
      return [];
    }
    
    console.log('useVanFiltering: Starting with', vans.length, 'vans')
    console.log('useVanFiltering: Applied filters:', JSON.stringify(filters, null, 2))
    console.log('useVanFiltering: Search term:', searchTerm)
    
    let filteredVans = [...vans];
    console.log('useVanFiltering: After copy:', filteredVans.length)

    // Text search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const beforeCount = filteredVans.length;
      filteredVans = filteredVans.filter(van => 
        van.name?.toLowerCase().includes(lowerSearchTerm) ||
        van.description?.toLowerCase().includes(lowerSearchTerm) ||
        van.amenities?.some(amenity => amenity.toLowerCase().includes(lowerSearchTerm)) ||
        van.features?.some(feature => feature.toLowerCase().includes(lowerSearchTerm))
      );
      console.log('useVanFiltering: After search filter:', filteredVans.length, 'from', beforeCount)
    }

    // Location filter
    if (filters.location) {
      // This would typically filter by pickup location availability
      // For now, we'll assume all vans are available at all locations
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const beforeCount = filteredVans.length;
      filteredVans = filteredVans.filter(van => {
        // Handle different price field names from API
        const price = van.pricePerDay || van.price_per_day || van.dailyRate || 0;
        const priceNum = typeof price === 'string' ? parseFloat(price) : price;
        return priceNum >= filters.priceRange[0] && priceNum <= filters.priceRange[1];
      });
      console.log('useVanFiltering: After price filter:', filteredVans.length, 'from', beforeCount, 'range:', filters.priceRange)
    }

    // Van type filter
    if (filters.vanType) {
      const beforeCount = filteredVans.length;
      filteredVans = filteredVans.filter(van => van.type === filters.vanType);
      console.log('useVanFiltering: After type filter:', filteredVans.length, 'from', beforeCount, 'type:', filters.vanType)
    }

    // Capacity filter
    if (filters.capacity) {
      const beforeCount = filteredVans.length;
      const capacity = parseInt(filters.capacity);
      filteredVans = filteredVans.filter(van => {
        if (capacity === 8) return van.sleeps >= 8;
        return van.sleeps >= capacity;
      });
      console.log('useVanFiltering: After capacity filter:', filteredVans.length, 'from', beforeCount, 'capacity:', capacity)
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filteredVans = filteredVans.filter(van =>
        filters.amenities.every(amenity => van.amenities?.includes(amenity))
      );
    }

    // Features filter
    if (filters.features && filters.features.length > 0) {
      filteredVans = filteredVans.filter(van =>
        filters.features.every(feature => van.features?.includes(feature))
      );
    }

    // Transmission filter
    if (filters.transmission) {
      filteredVans = filteredVans.filter(van => van.transmission === filters.transmission);
    }

    // Fuel type filter
    if (filters.fuelType) {
      filteredVans = filteredVans.filter(van => van.fuelType === filters.fuelType);
    }

    // Year filter
    if (filters.year) {
      filteredVans = filteredVans.filter(van => {
        const vanYear = van.year || 2020; // Default year if not specified
        switch (filters.year) {
          case '2020+': return vanYear >= 2020;
          case '2015-2019': return vanYear >= 2015 && vanYear <= 2019;
          case '2010-2014': return vanYear >= 2010 && vanYear <= 2014;
          case '2009-': return vanYear <= 2009;
          default: return true;
        }
      });
    }

    // Availability filter (would integrate with booking system)
    if (filters.availability && filters.availability.startDate && filters.availability.endDate) {
      // This would check against actual booking data
      // For now, we'll assume all vans are available
    }

    // Sort the results
    if (filters.sortBy) {
      filteredVans.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return a.pricePerDay - b.pricePerDay;
          case 'price-high':
            return b.pricePerDay - a.pricePerDay;
          case 'capacity':
            return b.sleeps - a.sleeps;
          case 'year-new':
            return (b.year || 2020) - (a.year || 2020);
          case 'year-old':
            return (a.year || 2020) - (b.year || 2020);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'distance':
            // Would implement distance sorting based on user location
            return 0;
          default:
            return 0;
        }
      });
    }

    return filteredVans;
  }, [vans, filters, searchTerm, calculateDistance]);
};

// Filter summary component
export const ActiveFilters = ({ filters, onRemoveFilter, resultCount }) => {
  const getActiveFilters = () => {
    const active = [];
    
    if (filters.location) {
      const location = PICKUP_LOCATIONS.find(l => l.id === filters.location);
      active.push({ key: 'location', label: `Location: ${location?.name}` });
    }
    
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 500)) {
      active.push({ 
        key: 'priceRange', 
        label: `Price: $${filters.priceRange[0]} - $${filters.priceRange[1]}` 
      });
    }
    
    if (filters.vanType) {
      active.push({ key: 'vanType', label: `Type: ${filters.vanType}` });
    }
    
    if (filters.capacity) {
      active.push({ key: 'capacity', label: `Sleeps: ${filters.capacity}+` });
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        active.push({ key: 'amenities', value: amenity, label: amenity });
      });
    }
    
    if (filters.features && filters.features.length > 0) {
      filters.features.forEach(feature => {
        active.push({ key: 'features', value: feature, label: feature });
      });
    }

    return active;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Active Filters ({resultCount} result{resultCount !== 1 ? 's' : ''})
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <span
                key={`${filter.key}-${filter.value || index}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {filter.label}
                <button
                  onClick={() => onRemoveFilter(filter.key, filter.value)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
