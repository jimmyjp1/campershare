// Wishlist components and user preferences panel
import React, { useState, useEffect } from 'react';
import { useWishlist, useUserPreferences, useRecentViews } from '../services/localDataStorageService';
import { Button } from './Button';
import { VanIcon, LocationIcon, CalendarIcon } from '../services/imageProcessingHelper';

// Wishlist Heart Icon Component
export function WishlistButton({ vanId, vanData, className = "", size = "w-6 h-6" }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const inWishlist = isInWishlist(vanId);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (inWishlist) {
      removeFromWishlist(vanId);
    } else {
      addToWishlist(vanId, vanData);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`${className} ${isAnimating ? 'animate-pulse' : ''} transition-all duration-200 hover:scale-110`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={inWishlist ? '#EF4444' : 'none'}
          className={inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
        />
      </svg>
    </button>
  );
}

// Wishlist Page Component
export function WishlistPage() {
  const { wishlist, isLoading, removeFromWishlist, clearWishlist } = useWishlist();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Start exploring and save your favorite camper vans for later!</p>
          <Button href="/campers">Browse Camper Vans</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} saved camper van{wishlist.length !== 1 ? 's' : ''}</p>
        </div>
        
        {wishlist.length > 0 && (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(true)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <WishlistCard
            key={item.vanId}
            item={item}
            onRemove={() => removeFromWishlist(item.vanId)}
          />
        ))}
      </div>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Clear Wishlist</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your wishlist? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  clearWishlist();
                  setShowClearConfirm(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual wishlist card component
function WishlistCard({ item, onRemove }) {
  const { vanData, addedAt } = item;
  const addedDate = new Date(addedAt);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={vanData.image || '/images/placeholder-van.jpg'}
          alt={vanData.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          title="Remove from wishlist"
        >
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{vanData.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vanData.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <VanIcon className="w-4 h-4" />
            <span>{vanData.beds} beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <LocationIcon className="w-4 h-4" />
            <span>{vanData.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">${vanData.pricePerNight}</span>
            <span className="text-gray-600 text-sm">/night</span>
          </div>
          <Button
            href={`/campers/${vanData.slug}`}
            size="sm"
          >
            View Details
          </Button>
        </div>
        
        <div className="mt-3 text-xs text-gray-400">
          Added {addedDate.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// User Preferences Panel
export function UserPreferencesPanel({ isOpen, onClose }) {
  const { preferences, updatePreference, isLoading } = useUserPreferences();
  const [localPrefs, setLocalPrefs] = useState(null);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs({ ...preferences });
    }
  }, [preferences]);

  if (!isOpen || isLoading || !localPrefs) return null;

  const handleSave = () => {
    Object.entries(localPrefs).forEach(([key, value]) => {
      if (preferences[key] !== value) {
        updatePreference(key, value);
      }
    });
    onClose();
  };

  const handleInputChange = (key, value) => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedInputChange = (parentKey, key, value) => {
    setLocalPrefs(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [key]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">User Preferences</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Display Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Display</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={localPrefs.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items per page
                  </label>
                  <select
                    value={localPrefs.itemsPerPage}
                    onChange={(e) => handleInputChange('itemsPerPage', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Regional Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Regional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={localPrefs.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={localPrefs.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Search & Maps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default search radius (km)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={localPrefs.defaultSearchRadius}
                    onChange={(e) => handleInputChange('defaultSearchRadius', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default sort by
                  </label>
                  <select
                    value={localPrefs.defaultSortBy}
                    onChange={(e) => handleInputChange('defaultSortBy', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Highest Rated</option>
                    <option value="distance_asc">Nearest First</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Map style
                </label>
                <select
                  value={localPrefs.mapStyle}
                  onChange={(e) => handleInputChange('mapStyle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="satellite">Satellite</option>
                  <option value="terrain">Terrain</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Notification Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localPrefs.notifications.email}
                    onChange={(e) => handleNestedInputChange('notifications', 'email', e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Email notifications</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localPrefs.notifications.push}
                    onChange={(e) => handleNestedInputChange('notifications', 'push', e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Push notifications</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localPrefs.notifications.sms}
                    onChange={(e) => handleNestedInputChange('notifications', 'sms', e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">SMS notifications</span>
                </label>
              </div>
            </div>

            {/* Other Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Other</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPrefs.autoSave}
                  onChange={(e) => handleInputChange('autoSave', e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Auto-save form data</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3 justify-end mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent Views Component
export function RecentViewsSection() {
  const { recentViews, isLoading } = useRecentViews();

  if (isLoading || recentViews.length === 0) return null;

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentViews.slice(0, 4).map((item) => (
            <div key={item.vanId} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <img
                src={item.vanData.image || '/images/placeholder-van.jpg'}
                alt={item.vanData.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1 truncate">{item.vanData.name}</h3>
                <p className="text-xs text-gray-600 mb-2">${item.vanData.pricePerNight}/night</p>
                <Button
                  href={`/campers/${item.vanData.slug}`}
                  size="sm"
                  className="w-full text-xs py-1"
                >
                  View Again
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
