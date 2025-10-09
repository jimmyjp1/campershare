/**
 * CamperShare - Buchungsformular (BookingForm.jsx)
 * 
 * Kernkomponente für den kompletten Buchungsprozess von der Auswahl
 * bis zur Zahlungsabwicklung. Multi-Step-Form mit umfassender Validierung.
 * 
 * Buchungsschritte:
 * 1. Datumsauswahl & Verfügbarkeitsprüfung
 * 2. Zusatzoptionen (Versicherung, Extras, Kilometer)
 * 3. Kundendaten & Abholort
 * 4. Zahlungsabwicklung
 * 5. Buchungsbestätigung
 * 
 * Features:
 * - Echtzeit-Verfügbarkeitsprüfung
 * - Dynamische Preisberechnung
 * - Auto-Save (Draft-System)
 * - Stripe-Integration
 * - PDF-Generierung
 * - E-Mail-Bestätigung
 * - Responsive Design
 * - Mehrsprachigkeit
 * 
 * State Management:
 * - Lokales State für Formulardaten
 * - Service-Integration für Backend-Calls
 * - Error Handling für alle Schritte
 */

import React, { useState, useEffect } from 'react';
import { BookingCalendar, PriceBreakdown, bookingService } from '../services/bookingService';
import { getCamperVanById, ADDONS, INSURANCE_PACKAGES, MILEAGE_PACKAGES, PICKUP_LOCATIONS } from '../services/camperVehicleDataService';
import { authService } from '../services/userAuthenticationService';
import { paymentService } from '../services/paymentService';
import { useAvailabilityCheck, AvailabilityIndicator } from '../services/camperAvailabilityChecker';
import { Button } from './Button';
import { AuthModal } from './AuthForms';
import { PaymentForm } from './PaymentForm';
import { VanLayoutCanvas, PricingChart, AvailabilityCalendar, SignatureCanvas } from '../services/imageProcessingHelper';
import { useAutoSave, useBookingDrafts } from '../services/localDataStorageService';
import { PickupLocationMap, RoutePlanningMap, LocationSearchInput } from './MapComponents';

/**
 * Hauptkomponente des Buchungsformulars
 * 
 * @param {string} vanId - ID des zu buchenden Wohnmobils
 * @param {Function} onBookingComplete - Callback nach erfolgreicher Buchung
 */
export function BookingForm({ vanId, onBookingComplete }) {
  // Fahrzeugdaten
  const [van, setVan] = useState(null);
  
  // UI-State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  /**
   * Verfügbarkeitsprüfung Hook
   * Prüft Echtzeit-Verfügbarkeit für gewählte Daten
   */
  const availability = useAvailabilityCheck(
    vanId,
    bookingData.selectedDates.start,
    bookingData.selectedDates.end
  );
  
  /**
   * Zentrale Buchungsdaten
   * Wird durch alle Schritte des Formulars aufgebaut
   */
  const [bookingData, setBookingData] = useState({
    vanId: vanId,
    selectedDates: { start: null, end: null },
    guestCount: 1,
    pickupLocation: '',
    returnLocation: '',
    pickupTime: '10:00',
    returnTime: '10:00',
    addons: [],
    insurancePackage: '',
    mileagePackage: 'standard',
    primaryDriver: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      postalCode: '',
      city: '',
      dateOfBirth: '',
      licenseNumber: '',
      licenseCountry: 'US',
      issueDate: '',
      expiryDate: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    specialRequests: '',
    signature: null,
    selectedFeatures: [],
    totalPrice: 0,
    paymentMethod: '',
    paymentData: {}
  });

  // Load van data
  useEffect(() => {
    const loadVanData = async () => {
      try {
        // Erst versuchen, von der API zu laden
        const response = await fetch('/api/campers');
        const result = await response.json();
        
        if (result.success && result.data) {
          const vanData = result.data.find(van => van.id === vanId);
          if (vanData) {
            console.log('✅ Van gefunden über API:', vanData);
            setVan(vanData);
            // Pre-fill pickup/return location if van has limited locations
            if (vanData.pickupLocations && vanData.pickupLocations.length === 1) {
              setBookingData(prev => ({
                ...prev,
                pickupLocation: vanData.pickupLocations[0],
                returnLocation: vanData.pickupLocations[0]
              }));
            }
            return;
          }
        }
        
        // Fallback zu statischen Daten
        const vanData = getCamperVanById(vanId);
        if (vanData) {
          console.log('✅ Van gefunden über statische Daten:', vanData);
          setVan(vanData);
          // Pre-fill pickup/return location if van has limited locations
          if (vanData.pickupLocations.length === 1) {
            setBookingData(prev => ({
              ...prev,
              pickupLocation: vanData.pickupLocations[0],
              returnLocation: vanData.pickupLocations[0]
            }));
          }
        } else {
          console.error('❌ Van nicht gefunden:', vanId);
        }
      } catch (error) {
        console.error('❌ Fehler beim Laden der Van-Daten:', error);
        // Fallback zu statischen Daten
        const vanData = getCamperVanById(vanId);
        if (vanData) {
          setVan(vanData);
        }
      }
    };
    
    if (vanId) {
      loadVanData();
    }
  }, [vanId]);

  // Auto-fill user data when logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      console.log('🔄 Auto-fülle Benutzerdaten:', currentUser);
      setBookingData(prev => ({
        ...prev,
        primaryDriver: {
          ...prev.primaryDriver,
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: currentUser.address || '',
          postalCode: currentUser.postalCode || '',
          city: currentUser.city || ''
        }
      }));
    }
  }, []);

  // Auto-save and draft functionality
  const { saveDraft, getDraft } = useBookingDrafts();
  const { lastSaved, isSaving } = useAutoSave(`booking_${vanId}`, bookingData, 2000);

  // Load existing draft on component mount
  useEffect(() => {
    const existingDraft = getDraft(vanId);
    if (existingDraft && existingDraft.bookingData) {
      const draftAge = new Date() - new Date(existingDraft.lastModified);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (draftAge < maxAge) {
        // Ask user if they want to restore the draft
        const restore = window.confirm(
          'We found a saved draft of your booking from ' + 
          new Date(existingDraft.lastModified).toLocaleString() + 
          '. Would you like to restore it?'
        );
        
        if (restore) {
          setBookingData(existingDraft.bookingData);
        }
      }
    }
  }, [vanId, getDraft]);

  // Save draft whenever booking data changes
  useEffect(() => {
    if (bookingData.selectedDates.start || bookingData.guestCount > 1 || 
        bookingData.primaryDriver.firstName || bookingData.primaryDriver.email) {
      const timeoutId = setTimeout(() => {
        saveDraft(vanId, bookingData);
      }, 3000); // Save after 3 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [bookingData, vanId, saveDraft]);

  const handleDateSelect = (dates) => {
    setBookingData(prev => ({
      ...prev,
      selectedDates: dates
    }));
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setBookingData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddonToggle = (addonId) => {
    setBookingData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter(id => id !== addonId)
        : [...prev.addons, addonId]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!bookingData.selectedDates.start || !bookingData.selectedDates.end) {
          newErrors.dates = 'Please select check-in and check-out dates';
        }
        if (!bookingData.guestCount || bookingData.guestCount < 1) {
          newErrors.guestCount = 'Number of guests is required';
        }
        if (van && bookingData.guestCount > van.beds) {
          newErrors.guestCount = `This van accommodates maximum ${van.beds} guests`;
        }
        break;

      case 2:
        if (!bookingData.pickupLocation) {
          newErrors.pickupLocation = 'Pickup location is required';
        }
        if (!bookingData.returnLocation) {
          newErrors.returnLocation = 'Return location is required';
        }
        break;

      case 3:
        // Addons and insurance validation (optional)
        break;

      case 4:
        if (!bookingData.primaryDriver.firstName) {
          newErrors.driverFirstName = 'Driver first name is required';
        }
        if (!bookingData.primaryDriver.lastName) {
          newErrors.driverLastName = 'Driver last name is required';
        }
        if (!bookingData.primaryDriver.email) {
          newErrors.driverEmail = 'Driver email is required';
        }
        if (!bookingData.primaryDriver.phone) {
          newErrors.driverPhone = 'Driver phone is required';
        }
        if (!bookingData.primaryDriver.address) {
          newErrors.driverAddress = 'Address is required';
        }
        if (!bookingData.primaryDriver.postalCode) {
          newErrors.driverPostalCode = 'Postal code is required';
        }
        if (!bookingData.primaryDriver.city) {
          newErrors.driverCity = 'City is required';
        }
        if (!bookingData.primaryDriver.dateOfBirth) {
          newErrors.driverDOB = 'Driver date of birth is required';
        }
        if (!bookingData.primaryDriver.licenseNumber) {
          newErrors.licenseNumber = 'License number is required';
        }
        if (!bookingData.primaryDriver.issueDate) {
          newErrors.licenseIssueDate = 'License issue date is required';
        }
        if (!bookingData.primaryDriver.expiryDate) {
          newErrors.licenseExpiryDate = 'License expiry date is required';
        }
        
        // Validate driver age (minimum 21)
        if (bookingData.primaryDriver.dateOfBirth) {
          const dob = new Date(bookingData.primaryDriver.dateOfBirth);
          const age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
          if (age < 21) {
            newErrors.driverAge = 'Driver must be at least 21 years old';
          }
        }

        // Validate license expiry
        if (bookingData.primaryDriver.expiryDate) {
          const expiryDate = new Date(bookingData.primaryDriver.expiryDate);
          if (expiryDate <= new Date()) {
            newErrors.licenseExpiry = 'Driver license has expired';
          }
        }

        if (!bookingData.emergencyContact.name) {
          newErrors.emergencyName = 'Emergency contact name is required';
        }
        if (!bookingData.emergencyContact.phone) {
          newErrors.emergencyPhone = 'Emergency contact phone is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    // 🛡️ Spezielle Validierung für Schritt 1 (Datumsauswahl)
    if (currentStep === 1) {
      if (!bookingData.selectedDates.start || !bookingData.selectedDates.end) {
        setErrors({ dates: 'Bitte wählen Sie Start- und Enddatum' });
        return;
      }
      
      if (!availability.available && availability.available !== null) {
        setErrors({ 
          dates: 'Die gewählten Daten sind nicht verfügbar. Bitte wählen Sie andere Termine.' 
        });
        return;
      }
    }
    
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitBooking = async () => {
    if (!authService.isLoggedIn()) {
      setShowAuthModal(true);
      return;
    }

    if (!validateStep(4)) {
      return;
    }

    // Move to payment step
    setCurrentStep(5);
  };

  const processPayment = async (paymentData) => {
    setPaymentLoading(true);
    setErrors({});

    try {
      // 🛡️ FINALE VERFÜGBARKEITSPRÜFUNG vor Zahlung
      console.log('🛡️ Finale Verfügbarkeitsprüfung vor Zahlung...');
      
      if (!availability.available) {
        setErrors({ 
          payment: 'Camper ist nicht mehr verfügbar. Bitte wählen Sie andere Daten.' 
        });
        setPaymentLoading(false);
        return;
      }

      // Calculate total amount
      const totalAmount = calculateTotalPrice();
      
      // Process payment
      const paymentResult = await paymentService.processPayment({
        amount: totalAmount,
        currency: 'USD',
        paymentMethod: paymentData.paymentMethod,
        customerData: {
          name: `${bookingData.primaryDriver.firstName} ${bookingData.primaryDriver.lastName}`,
          email: bookingData.primaryDriver.email,
          phone: bookingData.primaryDriver.phone
        },
        metadata: {
          vanId: bookingData.vanId,
          checkIn: bookingData.selectedDates.start.toISOString(),
          checkOut: bookingData.selectedDates.end.toISOString(),
          type: 'camper_van_booking'
        }
      });

      if (paymentResult.success) {
        setPaymentSuccess(true);
        
        // Create booking after successful payment mit echtem API-Aufruf
        try {
          console.log('🚀 Erstelle Buchung über API...');
          
          const bookingApiResponse = await fetch('/api/bookings/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              camperId: bookingData.vanId,
              startDate: bookingData.selectedDates.start.toISOString().split('T')[0],
              endDate: bookingData.selectedDates.end.toISOString().split('T')[0],
              totalDays: Math.ceil((bookingData.selectedDates.end - bookingData.selectedDates.start) / (1000 * 60 * 60 * 24)),
              totalPrice: totalAmount,
              customerData: {
                firstName: bookingData.primaryDriver.firstName,
                lastName: bookingData.primaryDriver.lastName,
                email: bookingData.primaryDriver.email,
                phone: bookingData.primaryDriver.phone,
                address: bookingData.primaryDriver.address || '',
                postalCode: bookingData.primaryDriver.postalCode || '',
                city: bookingData.primaryDriver.city || ''
              },
              paymentData: {
                paymentId: paymentResult.paymentId,
                amount: totalAmount
              },
              cancellationPolicy: 'Kostenlose Stornierung bis 48 Stunden vor Beginn. Danach erhalten Sie eine vollständige Rückerstattung abzüglich der Servicegebühren.'
            })
          });

          const bookingResult = await bookingApiResponse.json();

          if (bookingApiResponse.ok && bookingResult.success) {
            console.log('✅ Buchung erfolgreich erstellt:', bookingResult.bookingId);
            
            setBookingComplete(true);
            setCurrentStep(6); // Confirmation step
            onBookingComplete && onBookingComplete(bookingResult.booking);
            
            // Weiterleitung zur Bestätigungsseite
            setTimeout(() => {
              window.location.href = `/booking-confirmation?bookingId=${bookingResult.bookingId}`;
            }, 2000);
            
          } else {
            console.error('❌ Buchung fehlgeschlagen:', bookingResult);
            throw new Error(bookingResult.error || 'Buchung konnte nicht erstellt werden');
          }
        } catch (bookingError) {
          console.error('❌ Fehler bei Buchungserstellung:', bookingError);
          // Payment succeeded but booking failed - handle refund
          await paymentService.refundPayment(paymentResult.paymentId, 'Booking creation failed');
          setErrors({ payment: 'Buchungserstellung fehlgeschlagen. Zahlung wurde erstattet.' });
        }
      } else {
        setErrors({ payment: paymentResult.error || 'Payment processing failed' });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrors({ payment: 'Payment failed. Please try again.' });
    } finally {
      setPaymentLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!van || !bookingData.selectedDates.start || !bookingData.selectedDates.end) {
      return 0;
    }
    
    // Calculate base price
    const startDate = new Date(bookingData.selectedDates.start);
    const endDate = new Date(bookingData.selectedDates.end);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Handle different price field names (API vs static data)
    const pricePerNight = van.pricePerNight || van.price_per_day || van.pricePerDay || 0;
    const priceNum = typeof pricePerNight === 'string' ? parseFloat(pricePerNight) : pricePerNight;
    
    let total = priceNum * nights;

    // Add addon costs
    bookingData.addons.forEach(addonId => {
      const addon = ADDONS.find(a => a.id === addonId);
      if (addon) {
        total += addon.price;
      }
    });

    // Add insurance cost
    if (bookingData.insurancePackage) {
      const insurance = INSURANCE_PACKAGES.find(p => p.id === bookingData.insurancePackage);
      if (insurance) {
        total += insurance.price * nights;
      }
    }

    // Add mileage package cost
    if (bookingData.mileagePackage !== 'standard') {
      const mileage = MILEAGE_PACKAGES.find(p => p.id === bookingData.mileagePackage);
      if (mileage) {
        total += mileage.price;
      }
    }

    return total;
  };

  const getBlockedDates = () => {
    // Get dates when van is already booked
    const bookings = bookingService.getBookingsByVan(vanId);
    const blockedDates = [];

    bookings.forEach(booking => {
      if (booking.status !== 'cancelled') {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          blockedDates.push(new Date(d));
        }
      }
    });

    return blockedDates;
  };

  if (!van) {
    return <div className="text-center py-8">Loading van details...</div>;
  }

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Dates & Van' },
      { number: 2, title: 'Add-ons' },
      { number: 3, title: 'Location' },
      { number: 4, title: 'Details' },
      { number: 5, title: 'Payment' },
      { number: 6, title: 'Confirmation' }
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${step.number <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step.number < currentStep ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className="mt-1 text-xs text-gray-500 hidden sm:block">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Your Dates</h3>
        <BookingCalendar
          selectedDates={bookingData.selectedDates}
          onDateSelect={handleDateSelect}
          blockedDates={getBlockedDates()}
        />
        
        {/* 🛡️ Verfügbarkeitsanzeige */}
        {bookingData.selectedDates.start && bookingData.selectedDates.end && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <AvailabilityIndicator 
              availability={availability} 
              showDetails={true}
              className="mb-2"
            />
            {!availability.available && availability.available !== null && (
              <div className="text-sm text-orange-600 mt-2">
                ⚠️ Diese Daten sind nicht verfügbar. Bitte wählen Sie alternative Termine.
              </div>
            )}
          </div>
        )}
        
        {errors.dates && <p className="text-red-600 text-sm mt-2">{errors.dates}</p>}
      </div>

      <div>
        <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Guests *
        </label>
        <select
          id="guestCount"
          value={bookingData.guestCount}
          onChange={(e) => handleInputChange(null, 'guestCount', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {Array.from({ length: van.beds }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
          ))}
        </select>
        {errors.guestCount && <p className="text-red-600 text-sm mt-2">{errors.guestCount}</p>}
      </div>

      {/* Interactive Van Layout */}
      <div>
        <VanLayoutCanvas
          van={van}
          selectedAmenities={bookingData.selectedFeatures || []}
          onAmenityClick={(feature) => {
            const currentFeatures = bookingData.selectedFeatures || [];
            const updatedFeatures = currentFeatures.includes(feature)
              ? currentFeatures.filter(f => f !== feature)
              : [...currentFeatures, feature];
            handleInputChange(null, 'selectedFeatures', updatedFeatures);
          }}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Pickup & Return</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location *
          </label>
          <select
            id="pickupLocation"
            value={bookingData.pickupLocation}
            onChange={(e) => handleInputChange(null, 'pickupLocation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select pickup location</option>
            {van.pickupLocations.map(location => {
              const locationData = PICKUP_LOCATIONS.find(l => l.id === location.toLowerCase());
              return (
                <option key={location} value={location}>
                  {locationData ? locationData.name : location}
                </option>
              );
            })}
          </select>
          {errors.pickupLocation && <p className="text-red-600 text-sm mt-2">{errors.pickupLocation}</p>}
        </div>

        <div>
          <label htmlFor="returnLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Return Location *
          </label>
          <select
            id="returnLocation"
            value={bookingData.returnLocation}
            onChange={(e) => handleInputChange(null, 'returnLocation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select return location</option>
            {van.pickupLocations.map(location => {
              const locationData = PICKUP_LOCATIONS.find(l => l.id === location.toLowerCase());
              return (
                <option key={location} value={location}>
                  {locationData ? locationData.name : location}
                </option>
              );
            })}
          </select>
          {errors.returnLocation && <p className="text-red-600 text-sm mt-2">{errors.returnLocation}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Time
          </label>
          <select
            id="pickupTime"
            value={bookingData.pickupTime}
            onChange={(e) => handleInputChange(null, 'pickupTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const hour = 8 + i;
              const time = `${hour.toString().padStart(2, '0')}:00`;
              return <option key={time} value={time}>{time}</option>;
            })}
          </select>
        </div>

        <div>
          <label htmlFor="returnTime" className="block text-sm font-medium text-gray-700 mb-2">
            Return Time
          </label>
          <select
            id="returnTime"
            value={bookingData.returnTime}
            onChange={(e) => handleInputChange(null, 'returnTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const hour = 8 + i;
              const time = `${hour.toString().padStart(2, '0')}:00`;
              return <option key={time} value={time}>{time}</option>;
            })}
          </select>
        </div>
      </div>

      {/* Show location details */}
      {bookingData.pickupLocation && (
        <div className="p-4 bg-blue-50 rounded-md">
          {(() => {
            const locationData = PICKUP_LOCATIONS.find(l => l.id === bookingData.pickupLocation.toLowerCase());
            if (locationData) {
              return (
                <div>
                  <h4 className="font-medium text-blue-900">{locationData.name}</h4>
                  <p className="text-blue-700 text-sm">{locationData.address}</p>
                  <p className="text-blue-700 text-sm">{locationData.hours}</p>
                  <p className="text-blue-700 text-sm">📞 {locationData.phone}</p>
                  <div className="mt-2">
                    <span className="text-blue-700 text-sm">Amenities: </span>
                    <span className="text-blue-600 text-sm">{locationData.amenities?.join(', ')}</span>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Interactive Pickup Location Map */}
      <div>
        <h4 className="font-medium mb-3">Pickup Locations Map</h4>
        <PickupLocationMap
          selectedLocation={PICKUP_LOCATIONS.find(l => l.id === bookingData.pickupLocation?.toLowerCase())}
          onLocationSelect={(location) => {
            handleInputChange(null, 'pickupLocation', location.id);
            if (bookingData.returnLocation === bookingData.pickupLocation) {
              handleInputChange(null, 'returnLocation', location.id);
            }
          }}
          height="350px"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Add-ons & Insurance</h3>

      {/* Add-ons */}
      <div>
        <h4 className="font-medium mb-3">Add-ons</h4>
        <div className="space-y-3">
          {ADDONS.map(addon => (
            <label key={addon.id} className="flex items-start p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={bookingData.addons.includes(addon.id)}
                onChange={() => handleAddonToggle(addon.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{addon.name}</span>
                  <span className="text-blue-600 font-medium">${addon.pricePerDay}/day</span>
                </div>
                <p className="text-sm text-gray-600">{addon.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Insurance */}
      <div>
        <h4 className="font-medium mb-3">Insurance Coverage</h4>
        <div className="space-y-3">
          {INSURANCE_PACKAGES.map(insurance => (
            <label key={insurance.id} className="flex items-start p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="insurance"
                value={insurance.id}
                checked={bookingData.insurancePackage === insurance.id}
                onChange={(e) => handleInputChange(null, 'insurancePackage', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{insurance.name}</span>
                  <span className="text-blue-600 font-medium">${insurance.pricePerDay}/day</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insurance.description}</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {insurance.coverage.map((item, index) => (
                    <li key={index}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Mileage Package */}
      <div>
        <h4 className="font-medium mb-3">Mileage Package</h4>
        <div className="space-y-3">
          {MILEAGE_PACKAGES.map(mileage => (
            <label key={mileage.id} className="flex items-start p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="mileage"
                value={mileage.id}
                checked={bookingData.mileagePackage === mileage.id}
                onChange={(e) => handleInputChange(null, 'mileagePackage', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{mileage.name}</span>
                  <span className="text-blue-600 font-medium">
                    {mileage.extraCost ? `+$${mileage.extraCost}/day` : 'Included'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {mileage.includedKm === -1 ? 'Unlimited mileage' : `${mileage.includedKm}km included`}
                  {mileage.additionalKmCost > 0 && `, $${mileage.additionalKmCost}/km additional`}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Driver & Contact Information</h3>

      {/* Primary Driver */}
      <div>
        <h4 className="font-medium mb-3">Primary Driver *</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="driverFirstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              id="driverFirstName"
              type="text"
              value={bookingData.primaryDriver.firstName}
              onChange={(e) => handleInputChange('primaryDriver', 'firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.driverFirstName && <p className="text-red-600 text-sm mt-1">{errors.driverFirstName}</p>}
          </div>

          <div>
            <label htmlFor="driverLastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              id="driverLastName"
              type="text"
              value={bookingData.primaryDriver.lastName}
              onChange={(e) => handleInputChange('primaryDriver', 'lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.driverLastName && <p className="text-red-600 text-sm mt-1">{errors.driverLastName}</p>}
          </div>

          <div>
            <label htmlFor="driverEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="driverEmail"
              type="email"
              value={bookingData.primaryDriver.email}
              onChange={(e) => handleInputChange('primaryDriver', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.driverEmail && <p className="text-red-600 text-sm mt-1">{errors.driverEmail}</p>}
          </div>

          <div>
            <label htmlFor="driverPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              id="driverPhone"
              type="tel"
              value={bookingData.primaryDriver.phone}
              onChange={(e) => handleInputChange('primaryDriver', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.driverPhone && <p className="text-red-600 text-sm mt-1">{errors.driverPhone}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="driverAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              id="driverAddress"
              type="text"
              placeholder="Street address"
              value={bookingData.primaryDriver.address}
              onChange={(e) => handleInputChange('primaryDriver', 'address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.driverAddress && <p className="text-red-600 text-sm mt-1">{errors.driverAddress}</p>}
          </div>

          <div>
            <label htmlFor="driverPostalCode" className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code *
            </label>
            <input
              id="driverPostalCode"
              type="text"
              value={bookingData.primaryDriver.postalCode}
              onChange={(e) => handleInputChange('primaryDriver', 'postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.driverPostalCode && <p className="text-red-600 text-sm mt-1">{errors.driverPostalCode}</p>}
          </div>

          <div>
            <label htmlFor="driverCity" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              id="driverCity"
              type="text"
              value={bookingData.primaryDriver.city}
              onChange={(e) => handleInputChange('primaryDriver', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.driverCity && <p className="text-red-600 text-sm mt-1">{errors.driverCity}</p>}
          </div>

          <div>
            <label htmlFor="driverDOB" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              id="driverDOB"
              type="date"
              value={bookingData.primaryDriver.dateOfBirth}
              onChange={(e) => handleInputChange('primaryDriver', 'dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.driverDOB && <p className="text-red-600 text-sm mt-1">{errors.driverDOB}</p>}
            {errors.driverAge && <p className="text-red-600 text-sm mt-1">{errors.driverAge}</p>}
          </div>

          <div>
            <label htmlFor="licenseCountry" className="block text-sm font-medium text-gray-700 mb-2">
              License Country *
            </label>
            <select
              id="licenseCountry"
              value={bookingData.primaryDriver.licenseCountry}
              onChange={(e) => handleInputChange('primaryDriver', 'licenseCountry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
              License Number *
            </label>
            <input
              id="licenseNumber"
              type="text"
              value={bookingData.primaryDriver.licenseNumber}
              onChange={(e) => handleInputChange('primaryDriver', 'licenseNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.licenseNumber && <p className="text-red-600 text-sm mt-1">{errors.licenseNumber}</p>}
          </div>

          <div>
            <label htmlFor="licenseIssueDate" className="block text-sm font-medium text-gray-700 mb-2">
              License Issue Date *
            </label>
            <input
              id="licenseIssueDate"
              type="date"
              value={bookingData.primaryDriver.issueDate}
              onChange={(e) => handleInputChange('primaryDriver', 'issueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.licenseIssueDate && <p className="text-red-600 text-sm mt-1">{errors.licenseIssueDate}</p>}
          </div>

          <div>
            <label htmlFor="licenseExpiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              License Expiry Date *
            </label>
            <input
              id="licenseExpiryDate"
              type="date"
              value={bookingData.primaryDriver.expiryDate}
              onChange={(e) => handleInputChange('primaryDriver', 'expiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.licenseExpiryDate && <p className="text-red-600 text-sm mt-1">{errors.licenseExpiryDate}</p>}
            {errors.licenseExpiry && <p className="text-red-600 text-sm mt-1">{errors.licenseExpiry}</p>}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h4 className="font-medium mb-3">Emergency Contact *</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="emergencyName"
              type="text"
              value={bookingData.emergencyContact.name}
              onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.emergencyName && <p className="text-red-600 text-sm mt-1">{errors.emergencyName}</p>}
          </div>

          <div>
            <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700 mb-2">
              Relationship
            </label>
            <select
              id="emergencyRelationship"
              value={bookingData.emergencyContact.relationship}
              onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="child">Child</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              id="emergencyPhone"
              type="tel"
              value={bookingData.emergencyContact.phone}
              onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.emergencyPhone && <p className="text-red-600 text-sm mt-1">{errors.emergencyPhone}</p>}
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests or Notes
        </label>
        <textarea
          id="specialRequests"
          rows={3}
          value={bookingData.specialRequests}
          onChange={(e) => handleInputChange(null, 'specialRequests', e.target.value)}
          placeholder="Any special requests, dietary requirements, or other notes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Digital Signature */}
      <div>
        <SignatureCanvas
          onSignatureChange={(signatureData) => handleInputChange(null, 'signature', signatureData)}
          width={400}
          height={150}
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment</h3>
        <p className="text-gray-600">
          Complete your booking by providing payment information
        </p>
      </div>

      {errors.payment && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.payment}</p>
            </div>
          </div>
        </div>
      )}

      <PaymentForm
        amount={calculateTotalPrice()}
        currency="USD"
        onPaymentSubmit={processPayment}
        loading={paymentLoading}
        customerData={{
          name: `${bookingData.primaryDriver.firstName} ${bookingData.primaryDriver.lastName}`,
          email: bookingData.primaryDriver.email,
          phone: bookingData.primaryDriver.phone
        }}
      />

      {paymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Payment processed successfully! Creating your booking...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep6 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600">
          Your camper van reservation has been successfully created.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h4>
        <ul className="text-left text-blue-800 space-y-2">
          <li>✓ Confirmation email sent to your inbox</li>
          <li>✓ Payment processed successfully</li>
          <li>✓ Prepare required documents (driver&apos;s license, etc.)</li>
          <li>✓ Review pickup location and time</li>
          <li>✓ Contact us if you have any questions</li>
        </ul>
      </div>

      <div className="flex space-x-4 justify-center">
        <Button onClick={() => window.location.href = '/bookings'}>
          View My Bookings
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Back to Home
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepIndicator()}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}

            {/* Navigation buttons */}
            {currentStep < 5 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={submitBooking}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                )}
              </div>
            )}

            {/* Payment step navigation */}
            {currentStep === 5 && !paymentSuccess && !bookingComplete && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={paymentLoading}
                >
                  Previous
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Price sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <PriceBreakdown
              van={van}
              startDate={bookingData.selectedDates.start}
              endDate={bookingData.selectedDates.end}
              addons={bookingData.addons}
              insurance={bookingData.insurancePackage}
              mileagePackage={bookingData.mileagePackage}
              guestCount={bookingData.guestCount}
            />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
}
