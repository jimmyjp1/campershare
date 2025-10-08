// AJAX service for dynamic content loading and real-time interactions
import React, { useState, useEffect } from 'react';

export class AjaxService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    this.cache = new Map();
    this.requestQueue = new Map();
  }

  // Generic fetch wrapper with error handling and caching
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}-${url}-${JSON.stringify(options.body || {})}`;
    
    // Return cached result for GET requests if available
    if ((!options.method || options.method === 'GET') && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        return cached.data;
      }
    }

    // Prevent duplicate requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    const requestPromise = this.executeRequest(url, options, cacheKey);
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  async executeRequest(url, options, cacheKey) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    const authToken = this.getAuthToken();
    if (authToken) {
      defaultOptions.headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache GET requests
      if (!options.method || options.method === 'GET') {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  getAuthToken() {
    try {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
      return authCookie ? authCookie.split('=')[1] : null;
    } catch (error) {
      return null;
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Van search with debouncing
  async searchVans(query, filters = {}) {
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { searchCamperVans, filterCamperVans } = await import('./camperVehicleDataService');
      let results = searchCamperVans(query);
      
      if (Object.keys(filters).length > 0) {
        results = filterCamperVans(filters);
      }

      return {
        success: true,
        data: results,
        total: results.length
      };
    } catch (error) {
      console.error('Search failed:', error);
      return {
        success: false,
        error: 'Search failed. Please try again.'
      };
    }
  }

  // Real-time availability check
  async checkAvailability(vanId, startDate, endDate) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { isVanAvailable } = await import('./camperVehicleDataService');
      const isAvailable = isVanAvailable(vanId, startDate, endDate);

      return {
        success: true,
        available: isAvailable,
        vanId,
        startDate,
        endDate
      };
    } catch (error) {
      console.error('Availability check failed:', error);
      return {
        success: false,
        error: 'Failed to check availability'
      };
    }
  }

  // Dynamic price calculation
  async calculatePrice(vanId, startDate, endDate, options = {}) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { getCamperVanById, calculatePrice } = await import('./camperVehicleDataService');
      const van = getCamperVanById(vanId);
      
      if (!van) {
        throw new Error('Van not found');
      }

      const price = calculatePrice(
        van,
        new Date(startDate),
        new Date(endDate),
        options.addons || [],
        options.insurance,
        options.mileagePackage
      );

      return {
        success: true,
        price,
        vanId,
        breakdown: {
          basePrice: van.pricePerDay,
          days: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)),
          totalPrice: price
        }
      };
    } catch (error) {
      console.error('Price calculation failed:', error);
      return {
        success: false,
        error: 'Failed to calculate price'
      };
    }
  }

  // Load more vans (pagination)
  async loadMoreVans(page = 1, limit = 12, filters = {}) {
    try {
      // Simulate API call with pagination
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const { CAMPER_VANS, filterCamperVans } = await import('./camperVehicleDataService');
      let vans = Object.keys(filters).length > 0 ? filterCamperVans(filters) : CAMPER_VANS;
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVans = vans.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedVans,
        pagination: {
          page,
          limit,
          total: vans.length,
          totalPages: Math.ceil(vans.length / limit),
          hasMore: endIndex < vans.length
        }
      };
    } catch (error) {
      console.error('Load more vans failed:', error);
      return {
        success: false,
        error: 'Failed to load vans'
      };
    }
  }

  // Submit form without page refresh
  async submitForm(formData, endpoint) {
    try {
      const response = await this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Form submission failed:', error);
      return {
        success: false,
        error: 'Form submission failed. Please try again.'
      };
    }
  }

  // Live booking updates
  async getBookingUpdates(bookingId) {
    try {
      const { bookingService } = await import('./bookingService');
      const booking = bookingService.getBookingById(bookingId);
      
      return {
        success: true,
        data: booking
      };
    } catch (error) {
      console.error('Failed to get booking updates:', error);
      return {
        success: false,
        error: 'Failed to get booking updates'
      };
    }
  }

  // Auto-save functionality
  async autoSave(key, data) {
    try {
      localStorage.setItem(`autosave_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));

      return {
        success: true,
        message: 'Auto-saved successfully'
      };
    } catch (error) {
      console.error('Auto-save failed:', error);
      return {
        success: false,
        error: 'Auto-save failed'
      };
    }
  }

  // Load auto-saved data
  loadAutoSave(key, maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    try {
      const saved = localStorage.getItem(`autosave_${key}`);
      if (!saved) return null;

      const { data, timestamp } = JSON.parse(saved);
      
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(`autosave_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to load auto-save:', error);
      return null;
    }
  }

  // Clear auto-saved data
  clearAutoSave(key) {
    try {
      localStorage.removeItem(`autosave_${key}`);
    } catch (error) {
      console.error('Failed to clear auto-save:', error);
    }
  }
}

// Create singleton instance
export const ajaxService = new AjaxService();

// React hook for AJAX operations
export function useAjax() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ajaxService.request(endpoint, options);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    request,
    loading,
    error,
    clearError: () => setError(null)
  };
}

// Debounced search hook
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Live search component
export function LiveSearch({ onResults, placeholder = "Search vans..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setSuggestions([]);
      onResults && onResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    
    try {
      const result = await ajaxService.searchVans(searchQuery);
      if (result.success) {
        setSuggestions(result.data.slice(0, 5)); // Top 5 suggestions
        onResults && onResults(result.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (van) => {
    setQuery(van.name);
    setShowSuggestions(false);
    onResults && onResults([van]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Search suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((van) => (
            <button
              key={van.id}
              onClick={() => handleSuggestionClick(van)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={van.imageUrl}
                  alt={van.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">{van.name}</div>
                  <div className="text-sm text-gray-500">${van.pricePerDay}/night</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Real-time availability checker
export function AvailabilityChecker({ vanId, startDate, endDate, onAvailabilityChange }) {
  const [availability, setAvailability] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (vanId && startDate && endDate) {
      checkAvailability();
    }
  }, [vanId, startDate, endDate]);

  const checkAvailability = async () => {
    setIsChecking(true);
    
    try {
      const result = await ajaxService.checkAvailability(vanId, startDate, endDate);
      setAvailability(result);
      onAvailabilityChange && onAvailabilityChange(result);
    } catch (error) {
      console.error('Availability check failed:', error);
      setAvailability({ success: false, error: 'Check failed' });
    } finally {
      setIsChecking(false);
    }
  };

  if (!vanId || !startDate || !endDate) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {isChecking ? (
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm">Checking availability...</span>
        </div>
      ) : availability ? (
        availability.success ? (
          availability.available ? (
            <div className="flex items-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Available</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm font-medium">Not Available</span>
            </div>
          )
        ) : (
          <div className="flex items-center space-x-2 text-red-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm">Check failed</span>
          </div>
        )
      ) : null}
    </div>
  );
}

// Dynamic price display
export function DynamicPrice({ vanId, startDate, endDate, options = {} }) {
  const [price, setPrice] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (vanId && startDate && endDate) {
      calculatePrice();
    }
  }, [vanId, startDate, endDate, JSON.stringify(options)]);

  const calculatePrice = async () => {
    setIsCalculating(true);
    
    try {
      const result = await ajaxService.calculatePrice(vanId, startDate, endDate, options);
      setPrice(result);
    } catch (error) {
      console.error('Price calculation failed:', error);
      setPrice({ success: false, error: 'Calculation failed' });
    } finally {
      setIsCalculating(false);
    }
  };

  if (!vanId || !startDate || !endDate) {
    return <span className="text-gray-500">Select dates for pricing</span>;
  }

  if (isCalculating) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span>Calculating...</span>
      </div>
    );
  }

  if (price && price.success) {
    return (
      <div>
        <span className="text-2xl font-bold text-green-600">
          ${price.price.toFixed(2)}
        </span>
        {price.breakdown && (
          <div className="text-sm text-gray-600">
            ${price.breakdown.basePrice}/night × {price.breakdown.days} nights
          </div>
        )}
      </div>
    );
  }

  return <span className="text-red-500">Price unavailable</span>;
}

// Auto-save form component
export function AutoSaveForm({ formKey, children, data, interval = 30000 }) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load auto-saved data on mount
    const saved = ajaxService.loadAutoSave(formKey);
    if (saved) {
      // You would typically restore form data here
      console.log('Auto-saved data loaded:', saved);
    }
  }, [formKey]);

  useEffect(() => {
    // Auto-save at intervals
    if (!data) return;

    const autoSaveInterval = setInterval(async () => {
      try {
        setSaveStatus('Saving...');
        const result = await ajaxService.autoSave(formKey, data);
        if (result.success) {
          setLastSaved(new Date());
          setSaveStatus('Saved');
          setTimeout(() => setSaveStatus(''), 2000);
        }
      } catch (error) {
        setSaveStatus('Save failed');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    }, interval);

    return () => clearInterval(autoSaveInterval);
  }, [data, formKey, interval]);

  return (
    <div>
      {children}
      
      {saveStatus && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
          {saveStatus}
        </div>
      )}
      
      {lastSaved && !saveStatus && (
        <div className="text-xs text-gray-500 mt-2">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
