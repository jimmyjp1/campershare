import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { authService } from '@/services/userAuthenticationService';

export default function BookingConfirmation() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { bookingId, bookingNumber } = router.query;
    
    if (bookingNumber) {
      fetchBookingByNumber(bookingNumber);
    } else if (bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [router.query]);

  const fetchBookingByNumber = async (bookingNumber) => {
    try {
      setLoading(true);
      setError(null);

      // Lade Buchungsdaten anhand der Buchungsnummer
      const response = await fetch(`/api/bookings/by-number/${bookingNumber}`);
      
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      } else {
        setError('Buchung nicht gefunden');
      }
    } catch (err) {
      console.error('Fehler beim Laden der Buchung:', err);
      setError('Fehler beim Laden der Buchungsdaten');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);

      // Versuche echte Buchungsdaten zu laden
      const response = await fetch(`/api/bookings/${bookingId}`);
      
      if (response.ok) {
        const bookingData = await response.json();
        setBooking(bookingData);
      } else {
        // Falls echte Daten nicht verfügbar, verwende erweiterte Mock-Daten
        console.log('Echte Buchungsdaten nicht gefunden, verwende Mock-Daten');
        
        // Hole aktuelle Benutzerdaten wenn angemeldet
        const currentUser = authService.getCurrentUser();
        
        const mockBooking = {
          id: bookingId,
          bookingNumber: `CS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: new Date().toISOString(),
          startDate: '2025-01-15',
          endDate: '2025-01-20',
          totalDays: 5,
          pricePerNight: 149,
          basePrice: 745,
          serviceFee: 89,
          taxes: 158,
          totalPrice: 992,
          cancellationPolicy: 'Kostenlose Stornierung bis 48 Stunden vor Beginn. Danach erhalten Sie eine vollständige Rückerstattung abzüglich der Servicegebühren.',
          camper: {
            name: 'Carthago C-Tourer I 144 LE',
            category: 'Premium Wohnmobil',
            passengers: 4,
            beds: 2,
            images: ['/images/campers/carthago-c-tourer-i144le/hauptbild.jpg']
          },
          customerData: {
            // Verwende echte Benutzerdaten wenn verfügbar
            firstName: currentUser?.firstName || 'Max',
            lastName: currentUser?.lastName || 'Mustermann', 
            email: currentUser?.email || 'max@test.com',
            phone: currentUser?.phone || '+49 123 456 789',
            address: currentUser?.address || 'Teststraße 123',
            postalCode: currentUser?.postalCode || '12345',
            city: currentUser?.city || 'Berlin'
          },
          pickupLocation: 'Berlin Hauptbahnhof',
          returnLocation: 'Berlin Hauptbahnhof'
        };
        
        setBooking(mockBooking);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Buchungsdaten:', err);
      setError('Buchungsdaten konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!booking) return;
    
    try {
      const response = await fetch(`/api/bookings/${booking.id}/pdf`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Buchungsbestaetigung_${booking.bookingNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('PDF Download fehlgeschlagen:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Buchungsdetails werden geladen...</p>
          <p className="mt-2 text-sm text-gray-500">Einen Moment bitte</p>
        </div>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Buchung nicht gefunden</h1>
          <p className="mt-4 text-gray-600">Die angeforderte Buchung konnte leider nicht gefunden werden.</p>
          <div className="mt-8">
            <Button href="/" variant="primary" size="lg">
              Zur Startseite zurückkehren
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Buchungsbestätigung #{booking.bookingNumber} - CamperShare</title>
        <meta name="description" content={`Buchungsbestätigung für ${booking.camper?.name}`} />
        <style jsx>{`
          @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white !important; }
          }
          .print-only { display: none; }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Container className="py-8 lg:py-16">
          <div className="max-w-5xl mx-auto">
            
            {/* Success Header - Dark Mode Ready */}
            <div className="text-center mb-12 no-print">
              <div className="relative inline-block">
                <div className="mx-auto h-24 w-24 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full flex items-center justify-center shadow-lg dark:shadow-green-500/25">
                  <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <h1 className="mt-8 text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Vielen Dank für Ihre Buchung!
              </h1>
              
              <div className="mt-6 max-w-2xl mx-auto">
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Ihre Buchung wurde erfolgreich bestätigt und ist nun reserviert.
                </p>
                <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium border dark:border-green-700">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Bestätigung gesendet an {booking.customerData?.email}</span>
                </div>
              </div>
            </div>

            {/* Main Content Card - Dark Mode Ready */}
            <div className="bg-white dark:bg-gray-800 shadow-2xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden border dark:border-gray-700">
              
              {/* Header mit Gradient - Dark Mode Ready */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 px-8 py-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                      Buchungsbestätigung
                    </h2>
                    <p className="mt-2 text-blue-100 dark:text-blue-200 text-lg">
                      Buchungsnummer: <span className="font-mono font-semibold text-white">#{booking.bookingNumber}</span>
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <div className="inline-flex items-center bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30 dark:border-white/20">
                      <div className="h-3 w-3 bg-green-400 dark:bg-green-300 rounded-full animate-pulse mr-3"></div>
                      <span className="text-white font-medium">Bestätigt & Bezahlt</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12 bg-white dark:bg-gray-800">
                
                {/* Trip Overview - Dark Mode Ready */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ihre Reise im Überblick
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 border dark:border-gray-600">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* Zeitraum - Dark Mode Ready */}
                      <div className="text-center lg:text-left">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full mb-4 lg:mb-6 shadow-lg dark:shadow-blue-500/25">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Reisezeitraum</h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-1">{formatDate(booking.startDate)}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mb-2">bis</p>
                        <p className="text-gray-600 dark:text-gray-300">{formatDate(booking.endDate)}</p>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold mt-2">{booking.totalDays} Nächte</p>
                      </div>

                      {/* Fahrzeug - Dark Mode Ready */}
                      <div className="text-center lg:text-left">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-full mb-4 lg:mb-6 shadow-lg dark:shadow-purple-500/25">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m-5 0h2m8-4v-3a1 1 0 011-1h3a1 1 0 011 1v3m0 0v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Ihr Camper</h4>
                        <p className="text-gray-900 dark:text-white font-semibold">{booking.camper?.name}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{booking.camper?.category}</p>
                        <div className="flex justify-center lg:justify-start space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{booking.camper?.passengers} Personen</span>
                          <span>•</span>
                          <span>{booking.camper?.beds} Betten</span>
                        </div>
                      </div>

                      {/* Preis - Dark Mode Ready */}
                      <div className="text-center lg:text-left">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 dark:bg-green-500 rounded-full mb-4 lg:mb-6 shadow-lg dark:shadow-green-500/25">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Gesamtpreis</h4>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatPrice(booking.totalPrice)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vollständig bezahlt</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Information Grid - Dark Mode Ready */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-12">
                  
                  {/* Left Column - Booking & Vehicle Details */}
                  <div className="space-y-8">
                    
                    {/* Buchungsdetails - Dark Mode Ready */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Buchungsdetails
                      </h3>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-4 border dark:border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Buchungsnummer</span>
                          <span className="font-mono text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full border dark:border-blue-700">
                            #{booking.bookingNumber}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border dark:border-green-700">
                            <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full mr-2"></div>
                            Bestätigt
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Buchungsdatum</span>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {new Date(booking.createdAt).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Zahlungsstatus</span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border dark:border-green-700">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Bezahlt
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fahrzeugdetails - Dark Mode Ready */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <svg className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m-5 0h2m8-4v-3a1 1 0 011-1h3a1 1 0 011 1v3m0 0v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z" />
                        </svg>
                        Fahrzeugdetails
                      </h3>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border dark:border-purple-700/30">
                        <div className="flex items-start space-x-4">
                          {booking.camper?.images?.[0] && (
                            <div className="flex-shrink-0">
                              <img
                                src={booking.camper.images[0]}
                                alt={booking.camper.name}
                                className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-white dark:border-gray-600"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{booking.camper?.name}</h4>
                            <p className="text-purple-700 dark:text-purple-300 font-medium mb-3">{booking.camper?.category}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <svg className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {booking.camper?.passengers} Personen
                              </div>
                              <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <svg className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0" />
                                </svg>
                                {booking.camper?.beds} Betten
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Customer & Location Details - Dark Mode Ready */}
                  <div className="space-y-8">
                    
                    {/* Kundendaten - Dark Mode Ready */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <svg className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Kontaktdaten
                      </h3>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 space-y-4 border dark:border-green-700/30">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Vollständiger Name</label>
                          <p className="text-gray-900 dark:text-white font-semibold">
                            {booking.customerData?.firstName} {booking.customerData?.lastName}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">E-Mail-Adresse</label>
                          <p className="text-gray-900 dark:text-gray-100 font-mono text-sm break-all">
                            {booking.customerData?.email}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Telefonnummer</label>
                          <p className="text-gray-900 dark:text-gray-100 font-mono">
                            {booking.customerData?.phone}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Rechnungsadresse</label>
                          <div className="text-gray-900 dark:text-gray-100">
                            <p>{booking.customerData?.address}</p>
                            <p>{booking.customerData?.postalCode} {booking.customerData?.city}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Standort Details - Dark Mode Ready */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <svg className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Abholung & Rückgabe
                      </h3>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 space-y-6 border dark:border-red-700/30">
                        <div>
                          <div className="flex items-center mb-3">
                            <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full mr-3"></div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Abholort</label>
                          </div>
                          <p className="text-gray-900 dark:text-white font-semibold ml-6">
                            {booking.pickupLocation}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 ml-6 mt-1">
                            {formatDate(booking.startDate)} ab 15:00 Uhr
                          </p>
                        </div>
                        
                        <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 ml-1.5 h-8"></div>
                        
                        <div>
                          <div className="flex items-center mb-3">
                            <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full mr-3"></div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Rückgabeort</label>
                          </div>
                          <p className="text-gray-900 dark:text-white font-semibold ml-6">
                            {booking.returnLocation}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 ml-6 mt-1">
                            {formatDate(booking.endDate)} bis 11:00 Uhr
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Pricing Section - Dark Mode Ready */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Detaillierte Kostenaufstellung
                  </h3>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border dark:border-yellow-700/30">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-3"></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            Mietpreis ({booking.totalDays} Nächte × {formatPrice(booking.pricePerNight)})
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(booking.basePrice)}</span>
                      </div>
                      
                      {booking.serviceFee > 0 && (
                        <div className="flex justify-between items-center py-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-gray-700 dark:text-gray-300">Servicegebühr</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(booking.serviceFee)}</span>
                        </div>
                      )}
                      
                      {booking.taxes > 0 && (
                        <div className="flex justify-between items-center py-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-3"></div>
                            <span className="text-gray-700 dark:text-gray-300">Steuern & Gebühren (MwSt. 19%)</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(booking.taxes)}</span>
                        </div>
                      )}
                      
                      <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-4 mt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-400 rounded-full mr-3"></div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Gesamtbetrag</span>
                          </div>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(booking.totalPrice)}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-right">
                          ✓ Vollständig bezahlt am {new Date(booking.createdAt).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Cancellation Policy - Dark Mode Ready */}
                {booking.cancellationPolicy && (
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <svg className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Stornierungsrichtlinien
                    </h3>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700/30 rounded-2xl p-8">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center">
                            <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Wichtige Hinweise zur Stornierung</h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {booking.cancellationPolicy}
                          </p>
                          <div className="mt-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong className="dark:text-gray-300">Hinweis:</strong> Für Stornierungen kontaktieren Sie bitte unseren Kundenservice. 
                              Stornierungen sind je nach Zeitpunkt unterschiedlich kostenpflichtig.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Action Buttons - Dark Mode Ready */}
            <div className="mt-12 no-print">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl dark:shadow-blue-900/50 dark:hover:shadow-blue-900/75 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF herunterladen
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/75 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Drucken
                </button>

                <Button 
                  href="/" 
                  variant="secondary" 
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/75 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Zur Startseite
                </Button>
              </div>
            </div>

            {/* Enhanced Contact Information - Dark Mode Ready */}
            <div className="mt-16 no-print">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Haben Sie Fragen zu Ihrer Buchung?
                </h3>
                
                <p className="text-gray-300 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Unser Kundenservice-Team steht Ihnen gerne zur Verfügung. 
                  Wir helfen Ihnen bei allen Fragen rund um Ihre Buchung und Ihre Reise.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border dark:border-gray-600/30">
                    <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white mb-2">E-Mail Support</h4>
                    <a href="mailto:support@campershare.com" className="text-blue-300 dark:text-blue-400 hover:text-blue-200 dark:hover:text-blue-300 transition-colors">
                      support@campershare.com
                    </a>
                  </div>
                  
                  <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border dark:border-gray-600/30">
                    <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Telefon Support</h4>
                    <a href="tel:+49123456789" className="text-green-300 dark:text-green-400 hover:text-green-200 dark:hover:text-green-300 transition-colors">
                      +49 123 456 789
                    </a>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Mo-Fr 9-18 Uhr</p>
                  </div>
                  
                  <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border dark:border-gray-600/30">
                    <div className="w-12 h-12 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Live Chat</h4>
                    <button className="text-purple-300 dark:text-purple-400 hover:text-purple-200 dark:hover:text-purple-300 transition-colors">
                      Chat starten
                    </button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Sofort verfügbar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Print version footer - Dark Mode Ready */}
            <div className="print-only mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                <strong className="dark:text-gray-300">CamperShare GmbH</strong> | Musterstraße 123, 12345 Berlin
              </p>
              <p>
                Telefon: +49 123 456 789 | E-Mail: support@campershare.com | Web: www.campershare.com
              </p>
              <p className="mt-2 text-xs">
                Geschäftsführer: Max Mustermann | Amtsgericht Berlin HRB 123456 | USt-IdNr: DE123456789
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
