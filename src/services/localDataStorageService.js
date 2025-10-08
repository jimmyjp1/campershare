// Browser storage service for wishlist, preferences, search history, and auto-save
import { useState, useEffect, useCallback } from 'react';

// Single browser check (memoized)
const isBrowser = typeof window !== 'undefined';

// Local storage keys
const STORAGE_KEYS = {
  WISHLIST: 'cvr_wishlist',
  USER_PREFERENCES: 'cvr_user_preferences',
  SEARCH_HISTORY: 'cvr_search_history',
  BOOKING_DRAFTS: 'cvr_booking_drafts',
  RECENT_VIEWS: 'cvr_recent_views',
  FILTER_PREFERENCES: 'cvr_filter_preferences',
  AUTO_SAVE: 'cvr_auto_save'
};

// Cache for frequently accessed items
const cache = new Map();

// Storage service class
class StorageService {
  constructor() {
    this.isClient = isBrowser;
  }

  // Generic storage methods with caching
  setItem(key, value) {
    if (!this.isClient) return;
    
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      
      // Update cache
      cache.set(key, value);
      
      // Set expiry for temporary items
      if (key.includes('temp') || key.includes('draft')) {
        const expiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
        localStorage.setItem(`${key}_expiry`, expiry.toString());
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getItem(key) {
    if (!this.isClient) return null;

    // Check cache first
    if (cache.has(key)) {
      return cache.get(key);
    }

    try {
      // Check if item has expired
      const expiryKey = `${key}_expiry`;
      const expiry = localStorage.getItem(expiryKey);
      if (expiry && Date.now() > parseInt(expiry)) {
        this.removeItem(key);
        this.removeItem(expiryKey);
        return null;
      }

      const item = localStorage.getItem(key);
      const parsedItem = item ? JSON.parse(item) : null;
      
      // Update cache
      if (parsedItem) {
        cache.set(key, parsedItem);
      }
      
      return parsedItem;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  removeItem(key) {
    if (!this.isClient) return;
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_expiry`);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear() {
    if (!this.isClient) return;
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_expiry`);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Wishlist methods
  addToWishlist(vanId, vanData) {
    const wishlist = this.getWishlist();
    const item = {
      vanId,
      vanData,
      addedAt: new Date().toISOString()
    };
    
    // Remove if already exists, then add to beginning
    const filteredWishlist = wishlist.filter(item => item.vanId !== vanId);
    const newWishlist = [item, ...filteredWishlist];
    
    this.setItem(STORAGE_KEYS.WISHLIST, newWishlist);
    return newWishlist;
  }

  removeFromWishlist(vanId) {
    const wishlist = this.getWishlist();
    const newWishlist = wishlist.filter(item => item.vanId !== vanId);
    this.setItem(STORAGE_KEYS.WISHLIST, newWishlist);
    return newWishlist;
  }

  getWishlist() {
    return this.getItem(STORAGE_KEYS.WISHLIST) || [];
  }

  isInWishlist(vanId) {
    const wishlist = this.getWishlist();
    return wishlist.some(item => item.vanId === vanId);
  }

  clearWishlist() {
    this.removeItem(STORAGE_KEYS.WISHLIST);
  }

  // User preferences methods
  setUserPreferences(preferences) {
    const currentPrefs = this.getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences, updatedAt: new Date().toISOString() };
    this.setItem(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
    return updatedPrefs;
  }

  getUserPreferences() {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES) || {
      theme: 'light',
      currency: 'USD',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      mapStyle: 'standard',
      defaultSearchRadius: 50,
      itemsPerPage: 12,
      defaultSortBy: 'price_asc',
      autoSave: true,
      createdAt: new Date().toISOString()
    };
  }

  updatePreference(key, value) {
    const preferences = this.getUserPreferences();
    preferences[key] = value;
    preferences.updatedAt = new Date().toISOString();
    this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
    return preferences;
  }

  // Search history methods
  addToSearchHistory(searchData) {
    const history = this.getSearchHistory();
    const searchItem = {
      query: searchData.query,
      filters: searchData.filters,
      location: searchData.location,
      resultCount: searchData.resultCount,
      timestamp: new Date().toISOString()
    };

    // Remove duplicate searches
    const filteredHistory = history.filter(item => 
      item.query !== searchData.query || 
      JSON.stringify(item.filters) !== JSON.stringify(searchData.filters)
    );

    // Add to beginning and limit to 50 items
    const newHistory = [searchItem, ...filteredHistory].slice(0, 50);
    this.setItem(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
    return newHistory;
  }

  getSearchHistory() {
    return this.getItem(STORAGE_KEYS.SEARCH_HISTORY) || [];
  }

  removeFromSearchHistory(index) {
    const history = this.getSearchHistory();
    history.splice(index, 1);
    this.setItem(STORAGE_KEYS.SEARCH_HISTORY, history);
    return history;
  }

  clearSearchHistory() {
    this.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  }

  // Booking drafts methods
  saveBookingDraft(vanId, bookingData) {
    const drafts = this.getBookingDrafts();
    const draftItem = {
      vanId,
      bookingData,
      lastModified: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString() // 24 hours
    };

    // Update existing draft or add new one
    const existingIndex = drafts.findIndex(draft => draft.vanId === vanId);
    if (existingIndex >= 0) {
      drafts[existingIndex] = draftItem;
    } else {
      drafts.unshift(draftItem);
    }

    // Limit to 10 drafts
    const limitedDrafts = drafts.slice(0, 10);
    this.setItem(STORAGE_KEYS.BOOKING_DRAFTS, limitedDrafts);
    return limitedDrafts;
  }

  getBookingDrafts() {
    const drafts = this.getItem(STORAGE_KEYS.BOOKING_DRAFTS) || [];
    // Filter out expired drafts
    const validDrafts = drafts.filter(draft => new Date() < new Date(draft.expiresAt));
    
    if (validDrafts.length !== drafts.length) {
      this.setItem(STORAGE_KEYS.BOOKING_DRAFTS, validDrafts);
    }
    
    return validDrafts;
  }

  getBookingDraft(vanId) {
    const drafts = this.getBookingDrafts();
    return drafts.find(draft => draft.vanId === vanId);
  }

  removeBookingDraft(vanId) {
    const drafts = this.getBookingDrafts();
    const filteredDrafts = drafts.filter(draft => draft.vanId !== vanId);
    this.setItem(STORAGE_KEYS.BOOKING_DRAFTS, filteredDrafts);
    return filteredDrafts;
  }

  clearBookingDrafts() {
    this.removeItem(STORAGE_KEYS.BOOKING_DRAFTS);
  }

  // Recent views methods
  addToRecentViews(vanId, vanData) {
    const recentViews = this.getRecentViews();
    const viewItem = {
      vanId,
      vanData,
      viewedAt: new Date().toISOString()
    };

    // Remove if already exists, then add to beginning
    const filteredViews = recentViews.filter(item => item.vanId !== vanId);
    const newViews = [viewItem, ...filteredViews].slice(0, 20); // Limit to 20 items

    this.setItem(STORAGE_KEYS.RECENT_VIEWS, newViews);
    return newViews;
  }

  getRecentViews() {
    return this.getItem(STORAGE_KEYS.RECENT_VIEWS) || [];
  }

  clearRecentViews() {
    this.removeItem(STORAGE_KEYS.RECENT_VIEWS);
  }

  // Filter preferences methods
  saveFilterPreferences(filters) {
    const filterPrefs = {
      filters,
      savedAt: new Date().toISOString()
    };
    this.setItem(STORAGE_KEYS.FILTER_PREFERENCES, filterPrefs);
    return filterPrefs;
  }

  getFilterPreferences() {
    const prefs = this.getItem(STORAGE_KEYS.FILTER_PREFERENCES);
    return prefs ? prefs.filters : null;
  }

  // Auto-save methods
  autoSave(key, data) {
    const autoSaveData = this.getItem(STORAGE_KEYS.AUTO_SAVE) || {};
    autoSaveData[key] = {
      data,
      timestamp: new Date().toISOString()
    };
    this.setItem(STORAGE_KEYS.AUTO_SAVE, autoSaveData);
  }

  getAutoSave(key) {
    const autoSaveData = this.getItem(STORAGE_KEYS.AUTO_SAVE) || {};
    return autoSaveData[key] || null;
  }

  clearAutoSave(key) {
    const autoSaveData = this.getItem(STORAGE_KEYS.AUTO_SAVE) || {};
    delete autoSaveData[key];
    this.setItem(STORAGE_KEYS.AUTO_SAVE, autoSaveData);
  }

  // Utility methods
  getStorageUsage() {
    if (!this.isClient) return { used: 0, quota: 0 };
    
    try {
      let totalUsed = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('cvr_')) {
          totalUsed += localStorage[key].length;
        }
      }
      return {
        used: totalUsed,
        quota: 5 * 1024 * 1024, // 5MB typical quota
        percentage: (totalUsed / (5 * 1024 * 1024)) * 100
      };
    } catch (error) {
      return { used: 0, quota: 0, percentage: 0 };
    }
  }

  exportData() {
    const data = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      const value = this.getItem(key);
      if (value) {
        data[key] = value;
      }
    });
    return data;
  }

  importData(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(STORAGE_KEYS).includes(key)) {
        this.setItem(key, value);
      }
    });
  }
}

// Create singleton instance
const storageService = new StorageService();

// React hooks for storage functionality

// Wishlist hook
export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = () => {
      const savedWishlist = storageService.getWishlist();
      setWishlist(savedWishlist);
      setIsLoading(false);
    };

    loadWishlist();
  }, []);

  const addToWishlist = useCallback((vanId, vanData) => {
    const newWishlist = storageService.addToWishlist(vanId, vanData);
    setWishlist(newWishlist);
    return newWishlist;
  }, []);

  const removeFromWishlist = useCallback((vanId) => {
    const newWishlist = storageService.removeFromWishlist(vanId);
    setWishlist(newWishlist);
    return newWishlist;
  }, []);

  const isInWishlist = useCallback((vanId) => {
    return wishlist.some(item => item.vanId === vanId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    storageService.clearWishlist();
    setWishlist([]);
  }, []);

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };
}

// User preferences hook
export function useUserPreferences() {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = () => {
      const savedPreferences = storageService.getUserPreferences();
      setPreferences(savedPreferences);
      setIsLoading(false);
    };

    loadPreferences();
  }, []);

  const updatePreferences = useCallback((newPreferences) => {
    const updatedPrefs = storageService.setUserPreferences(newPreferences);
    setPreferences(updatedPrefs);
    return updatedPrefs;
  }, []);

  const updatePreference = useCallback((key, value) => {
    const updatedPrefs = storageService.updatePreference(key, value);
    setPreferences(updatedPrefs);
    return updatedPrefs;
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences,
    updatePreference
  };
}

// Search history hook
export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = storageService.getSearchHistory();
      setSearchHistory(savedHistory);
      setIsLoading(false);
    };

    loadHistory();
  }, []);

  const addToHistory = useCallback((searchData) => {
    const newHistory = storageService.addToSearchHistory(searchData);
    setSearchHistory(newHistory);
    return newHistory;
  }, []);

  const removeFromHistory = useCallback((index) => {
    const newHistory = storageService.removeFromSearchHistory(index);
    setSearchHistory(newHistory);
    return newHistory;
  }, []);

  const clearHistory = useCallback(() => {
    storageService.clearSearchHistory();
    setSearchHistory([]);
  }, []);

  return {
    searchHistory,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
}

// Auto-save hook
export function useAutoSave(key, data, delay = 1000) {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!data || !key) return;

    const timeoutId = setTimeout(() => {
      setIsSaving(true);
      storageService.autoSave(key, data);
      setLastSaved(new Date());
      setIsSaving(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [key, data, delay]);

  const loadAutoSave = useCallback(() => {
    return storageService.getAutoSave(key);
  }, [key]);

  const clearAutoSave = useCallback(() => {
    storageService.clearAutoSave(key);
  }, [key]);

  return {
    lastSaved,
    isSaving,
    loadAutoSave,
    clearAutoSave
  };
}

// Booking drafts hook
export function useBookingDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDrafts = () => {
      const savedDrafts = storageService.getBookingDrafts();
      setDrafts(savedDrafts);
      setIsLoading(false);
    };

    loadDrafts();
  }, []);

  const saveDraft = useCallback((vanId, bookingData) => {
    const newDrafts = storageService.saveBookingDraft(vanId, bookingData);
    setDrafts(newDrafts);
    return newDrafts;
  }, []);

  const getDraft = useCallback((vanId) => {
    return storageService.getBookingDraft(vanId);
  }, []);

  const removeDraft = useCallback((vanId) => {
    const newDrafts = storageService.removeBookingDraft(vanId);
    setDrafts(newDrafts);
    return newDrafts;
  }, []);

  const clearDrafts = useCallback(() => {
    storageService.clearBookingDrafts();
    setDrafts([]);
  }, []);

  return {
    drafts,
    isLoading,
    saveDraft,
    getDraft,
    removeDraft,
    clearDrafts
  };
}

// Recent views hook
export function useRecentViews() {
  const [recentViews, setRecentViews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentViews = () => {
      const savedViews = storageService.getRecentViews();
      setRecentViews(savedViews);
      setIsLoading(false);
    };

    loadRecentViews();
  }, []);

  const addToRecentViews = useCallback((vanId, vanData) => {
    const newViews = storageService.addToRecentViews(vanId, vanData);
    setRecentViews(newViews);
    return newViews;
  }, []);

  const clearRecentViews = useCallback(() => {
    storageService.clearRecentViews();
    setRecentViews([]);
  }, []);

  return {
    recentViews,
    isLoading,
    addToRecentViews,
    clearRecentViews
  };
}

export default storageService;
