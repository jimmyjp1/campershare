/**
 * CamperShare - Buchungsservice (bookingService.js)
 * 
 * Zentrale Business Logic für alle buchungsbezogenen Operationen.
 * Verwaltet den kompletten Buchungslebenszyklus von der Erstellung
 * bis zur Stornierung.
 * 
 * Kernfunktionen:
 * - Buchungserstellung und -validierung
 * - Status-Management (pending, confirmed, completed, cancelled)
 * - Verfügbarkeitsprüfung
 * - Preisberechnung
 * - Integration mit Zahlungssystem
 * - E-Mail-Benachrichtigungen
 * 
 * Design Pattern: Service Class mit Singleton-ähnlichem Verhalten
 * Datenpersistierung: LocalStorage (Development) + Database API (Production)
 */

import { authService } from './userAuthenticationService';

/**
 * Hauptklasse für Buchungsoperationen
 * Verwaltet Buchungslogik und Datenmanagement
 */
export class BookingService {
  constructor() {
    // Initialisierung der Buchungsdaten
    this.bookings = this.loadBookings();
    this.isBrowser = typeof window !== 'undefined' && window.localStorage;
  }

  /**
   * Lädt gespeicherte Buchungen aus LocalStorage
   * Fallback für Development-Umgebung ohne Database
   */
  loadBookings() {
    try {
      if (this.isBrowser) {
        const saved = localStorage.getItem('campervan_bookings');
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading bookings:', error);
      return [];
    }
  }

  /**
   * Gibt alle Buchungen zurück
   * In Production: Würde Datenbankabfrage verwenden
   */
  getAllBookings() {
    return this.bookings;
  }

  /**
   * Aktualisiert den Status einer Buchung
   * Status-Übergang: pending → confirmed → completed/cancelled
   */
  async updateBookingStatus(bookingId, newStatus) {
    const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    // Status-Update mit Timestamp
    this.bookings[bookingIndex].status = newStatus;
    this.bookings[bookingIndex].updatedAt = new Date().toISOString();
    this.saveBookings();

    return this.bookings[bookingIndex];
  }

  /**
   * Allgemeine Buchungs-Update-Funktion
   * Ermöglicht partielle Updates an Buchungsdaten
   */
  async updateBooking(bookingId, updatedData) {
    const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    this.saveBookings();

    return this.bookings[bookingIndex];
  }

  saveBookings() {
    try {
      if (this.isBrowser) {
        localStorage.setItem('campervan_bookings', JSON.stringify(this.bookings));
      }
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  }

  async createBooking(bookingData) {
    try {
      // Validate user is logged in
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'You must be logged in to make a booking' };
      }

      // Validate booking data
      const validation = this.validateBookingData(bookingData);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      // Check van availability
      const isAvailable = this.checkAvailability(bookingData.vanId, bookingData.startDate, bookingData.endDate);
      if (!isAvailable) {
        return { success: false, error: 'Van is not available for selected dates' };
      }

      // Create booking
      const booking = {
        id: 'booking-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        ...bookingData,
        userId: currentUser.id,
        status: bookingData.paymentStatus === 'paid' ? 'confirmed' : 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmationNumber: this.generateConfirmationNumber(),
        paymentId: bookingData.paymentId || null,
        paymentStatus: bookingData.paymentStatus || 'pending',
        totalAmount: bookingData.totalAmount || 0
      };

      this.bookings.push(booking);
      this.saveBookings();

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, booking };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: 'Failed to create booking. Please try again.' };
    }
  }

  validateBookingData(data) {
    const errors = [];

    if (!data.vanId) errors.push('Van selection is required');
    if (!data.startDate || !data.endDate) errors.push('Check-in and check-out dates are required');
    if (!data.pickupLocation) errors.push('Pickup location is required');
    if (!data.returnLocation) errors.push('Return location is required');
    if (!data.guestCount || data.guestCount < 1) errors.push('Number of guests is required');
    if (!data.primaryDriver) errors.push('Primary driver information is required');

    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) errors.push('Check-in date cannot be in the past');
    if (endDate <= startDate) errors.push('Check-out date must be after check-in date');

    // Validate driver
    if (data.primaryDriver) {
      if (!data.primaryDriver.licenseNumber) errors.push('Driver license number is required');
      if (!data.primaryDriver.issueDate) errors.push('License issue date is required');
      if (!data.primaryDriver.expiryDate) errors.push('License expiry date is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  checkAvailability(vanId, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check against existing bookings
    const conflictingBookings = this.bookings.filter(booking => 
      booking.vanId === vanId &&
      booking.status !== 'cancelled' &&
      (
        (start >= new Date(booking.startDate) && start < new Date(booking.endDate)) ||
        (end > new Date(booking.startDate) && end <= new Date(booking.endDate)) ||
        (start <= new Date(booking.startDate) && end >= new Date(booking.endDate))
      )
    );

    return conflictingBookings.length === 0;
  }

  generateConfirmationNumber() {
    const prefix = 'CV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  getUserBookings(userId) {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  getBookingById(id) {
    return this.bookings.find(booking => booking.id === id);
  }

  async cancelBooking(bookingId, reason = '') {
    try {
      const booking = this.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser || (booking.userId !== currentUser.id && !authService.isAdmin())) {
        return { success: false, error: 'Unauthorized to cancel this booking' };
      }

      // Calculate cancellation fee
      const daysUntilPickup = Math.ceil((new Date(booking.startDate) - new Date()) / (1000 * 60 * 60 * 24));
      const van = require('./camperVehicleDataService').getCamperVanById(booking.vanId);
      
      let cancellationFee = 0;
      if (van && van.policies.cancellationFees) {
        const applicableFee = van.policies.cancellationFees
          .sort((a, b) => a.daysBeforePickup - b.daysBeforePickup)
          .find(fee => daysUntilPickup <= fee.daysBeforePickup);
        
        if (applicableFee) {
          cancellationFee = booking.totalPrice * (applicableFee.feePercentage / 100);
        }
      }

      // Update booking
      const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
      this.bookings[bookingIndex] = {
        ...booking,
        status: 'cancelled',
        cancellationReason: reason,
        cancellationDate: new Date().toISOString(),
        cancellationFee,
        refundAmount: booking.totalPrice - cancellationFee,
        updatedAt: new Date().toISOString()
      };

      this.saveBookings();

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return { 
        success: true, 
        booking: this.bookings[bookingIndex],
        cancellationFee,
        refundAmount: booking.totalPrice - cancellationFee
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return { success: false, error: 'Failed to cancel booking. Please try again.' };
    }
  }

  getBookingsByStatus(status) {
    return this.bookings.filter(booking => booking.status === status);
  }

  getBookingsByVan(vanId) {
    return this.bookings.filter(booking => booking.vanId === vanId);
  }
}

// Create singleton instance
export const bookingService = new BookingService();

// Calendar component for date selection
export function BookingCalendar({ 
  selectedDates, 
  onDateSelect, 
  blockedDates = [], 
  minDate = new Date(),
  maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    let currentDate = new Date(startDate);

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const isDateBlocked = (date) => {
    const dateStr = date.toDateString();
    return blockedDates.some(blockedDate => 
      new Date(blockedDate).toDateString() === dateStr
    );
  };

  const isDateInRange = (date) => {
    if (!selectedDates.start || !selectedDates.end) return false;
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const isDateSelected = (date) => {
    const dateStr = date.toDateString();
    return (selectedDates.start && selectedDates.start.toDateString() === dateStr) ||
           (selectedDates.end && selectedDates.end.toDateString() === dateStr);
  };

  const handleDateClick = (date) => {
    if (isDateBlocked(date) || date < minDate || date > maxDate) return;

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      onDateSelect({ start: date, end: null });
      setIsSelectingRange(true);
    } else if (selectedDates.start && !selectedDates.end) {
      // Complete selection
      if (date >= selectedDates.start) {
        onDateSelect({ start: selectedDates.start, end: date });
        setIsSelectingRange(false);
      } else {
        onDateSelect({ start: date, end: selectedDates.start });
        setIsSelectingRange(false);
      }
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-full"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isBlocked = isDateBlocked(date);
          const isPast = date < minDate;
          const isFuture = date > maxDate;
          const isSelected = isDateSelected(date);
          const isInRange = isDateInRange(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={isBlocked || isPast || isFuture}
              className={`
                p-2 text-sm rounded-md transition-colors relative
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${isInRange && !isSelected ? 'bg-blue-100 text-blue-800' : ''}
                ${isBlocked || isPast || isFuture ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}
                ${!isSelected && !isInRange && isCurrentMonth && !isBlocked && !isPast && !isFuture ? 'hover:bg-blue-50' : ''}
              `}
            >
              {date.getDate()}
              {isBlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selection Info */}
      {selectedDates.start && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="text-sm">
            <div className="font-medium text-blue-900">Selected Dates:</div>
            <div className="text-blue-700">
              Check-in: {selectedDates.start.toLocaleDateString()}
              {selectedDates.end && (
                <>
                  <br />
                  Check-out: {selectedDates.end.toLocaleDateString()}
                  <br />
                  Duration: {Math.ceil((selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24))} nights
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isSelectingRange && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          Select your check-out date
        </div>
      )}
    </div>
  );
}

// Price calculation component
export function PriceBreakdown({ van, startDate, endDate, addons = [], insurance, mileagePackage, guestCount = 1 }) {
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    if (van && startDate && endDate) {
      const { calculatePrice } = require('./camperVehicleDataService');
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      // Base price calculation
      let basePrice = van.pricePerDay * days;
      
      // Seasonal pricing
      const month = startDate.getMonth() + 1;
      const isHighSeason = month >= 6 && month <= 8;
      const isLowSeason = month >= 11 || month <= 2;
      
      let seasonalMultiplier = 1;
      if (isHighSeason) seasonalMultiplier = van.pricing.highSeasonMultiplier;
      else if (isLowSeason) seasonalMultiplier = van.pricing.lowSeasonMultiplier;
      
      const seasonalPrice = basePrice * seasonalMultiplier;
      
      // Duration discounts
      let discountRate = 0;
      if (days >= 28) discountRate = van.pricing.monthlyDiscount;
      else if (days >= 7) discountRate = van.pricing.weeklyDiscount;
      
      const discountAmount = seasonalPrice * discountRate;
      const discountedPrice = seasonalPrice - discountAmount;
      
      // Add-ons
      let addonTotal = 0;
      const addonDetails = [];
      if (addons && addons.length > 0) {
        const { ADDONS } = require('./camperVehicleDataService');
        addons.forEach(addonId => {
          const addon = ADDONS.find(a => a.id === addonId);
          if (addon) {
            const addonCost = addon.pricePerDay * days;
            addonTotal += addonCost;
            addonDetails.push({ ...addon, totalCost: addonCost });
          }
        });
      }
      
      // Insurance
      let insuranceCost = 0;
      let insuranceDetails = null;
      if (insurance) {
        const { INSURANCE_PACKAGES } = require('./camperVehicleDataService');
        const insurancePackage = INSURANCE_PACKAGES.find(i => i.id === insurance);
        if (insurancePackage) {
          insuranceCost = insurancePackage.pricePerDay * days;
          insuranceDetails = { ...insurancePackage, totalCost: insuranceCost };
        }
      }
      
      // Mileage package
      let mileageCost = 0;
      let mileageDetails = null;
      if (mileagePackage) {
        const { MILEAGE_PACKAGES } = require('./camperVehicleDataService');
        const mileagePkg = MILEAGE_PACKAGES.find(m => m.id === mileagePackage);
        if (mileagePkg && mileagePkg.extraCost) {
          mileageCost = mileagePkg.extraCost * days;
          mileageDetails = { ...mileagePkg, totalCost: mileageCost };
        }
      }
      
      // Taxes (simplified)
      const subtotal = discountedPrice + addonTotal + insuranceCost + mileageCost;
      const taxRate = 0.08; // 8% tax
      const taxAmount = subtotal * taxRate;
      
      // Security deposit
      const securityDeposit = van.policies.securityDepositAmount;
      
      // Cleaning fee
      const cleaningFee = van.policies.cleaningFee;
      
      const totalPrice = subtotal + taxAmount + cleaningFee;
      
      setPricing({
        days,
        basePrice,
        seasonalMultiplier,
        seasonalPrice,
        discountRate,
        discountAmount,
        discountedPrice,
        addonTotal,
        addonDetails,
        insuranceCost,
        insuranceDetails,
        mileageCost,
        mileageDetails,
        subtotal,
        taxRate,
        taxAmount,
        cleaningFee,
        securityDeposit,
        totalPrice
      });
    }
  }, [van, startDate, endDate, addons, insurance, mileagePackage, guestCount]);

  if (!pricing) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center text-gray-500">
          Select dates to see pricing
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
      
      <div className="space-y-3">
        {/* Base pricing */}
        <div className="flex justify-between">
          <span>${van.pricePerDay}/night × {pricing.days} nights</span>
          <span>${pricing.basePrice.toFixed(2)}</span>
        </div>
        
        {/* Seasonal adjustment */}
        {pricing.seasonalMultiplier !== 1 && (
          <div className="flex justify-between text-sm">
            <span>Seasonal adjustment ({(pricing.seasonalMultiplier * 100 - 100).toFixed(0)}%)</span>
            <span>${(pricing.seasonalPrice - pricing.basePrice).toFixed(2)}</span>
          </div>
        )}
        
        {/* Duration discount */}
        {pricing.discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Duration discount ({(pricing.discountRate * 100).toFixed(0)}%)</span>
            <span>-${pricing.discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        {/* Add-ons */}
        {pricing.addonDetails.map(addon => (
          <div key={addon.id} className="flex justify-between text-sm">
            <span>{addon.name}</span>
            <span>${addon.totalCost.toFixed(2)}</span>
          </div>
        ))}
        
        {/* Insurance */}
        {pricing.insuranceDetails && (
          <div className="flex justify-between text-sm">
            <span>{pricing.insuranceDetails.name}</span>
            <span>${pricing.insuranceDetails.totalCost.toFixed(2)}</span>
          </div>
        )}
        
        {/* Mileage package */}
        {pricing.mileageDetails && (
          <div className="flex justify-between text-sm">
            <span>{pricing.mileageDetails.name}</span>
            <span>${pricing.mileageDetails.totalCost.toFixed(2)}</span>
          </div>
        )}
        
        <hr className="my-3" />
        
        {/* Subtotal */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${pricing.subtotal.toFixed(2)}</span>
        </div>
        
        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span>Taxes ({(pricing.taxRate * 100).toFixed(0)}%)</span>
          <span>${pricing.taxAmount.toFixed(2)}</span>
        </div>
        
        {/* Cleaning fee */}
        <div className="flex justify-between text-sm">
          <span>Cleaning fee</span>
          <span>${pricing.cleaningFee.toFixed(2)}</span>
        </div>
        
        <hr className="my-3" />
        
        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${pricing.totalPrice.toFixed(2)}</span>
        </div>
        
        {/* Security deposit note */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-sm">
            <div className="font-medium text-yellow-800">Security Deposit</div>
            <div className="text-yellow-700">
              ${pricing.securityDeposit.toFixed(2)} security deposit will be held on your card and released after the rental.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Additional API methods for database operations
export const bookingAPI = {
  // Get user's bookings from API
  async getMyBookings() {
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch('/api/bookings/my-bookings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch bookings')
    }

    const data = await response.json()
    return data.bookings
  },

  // Cancel a booking
  async cancelBooking(bookingId, reason = '') {
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to cancel booking')
    }

    return await response.json()
  }
}
