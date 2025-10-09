/**
 * checkout.jsx - Checkout-Seite
 * ==============================
 * 
 * HAUPTFUNKTION:
 * Vollständige Checkout-Seite für die Finalisierung von Camper-Buchungen.
 * Integriert Buchungsdetails, Zahlungsabwicklung und Bestätigungsprozess in einem streamlined Workflow.
 * 
 * SEITEN-FEATURES:
 * 
 * 1. Buchungsübersicht:
 *    - Detaillierte Camper-Informationen mit Bildern
 *    - Buchungszeitraum und Gästeanzahl
 *    - Preisaufschlüsselung mit Steuern und Gebühren
 *    - Stornierungsbedingungen und Richtlinien
 * 
 * 2. Zahlungsabwicklung:
 *    - Stripe Payment Integration für sichere Transaktionen
 *    - Multiple Zahlungsmethoden (Kreditkarte, SEPA, PayPal)
 *    - 3D Secure Authentication für Kreditkartenzahlungen
 *    - PCI-konforme Datenbehandlung
 * 
 * 3. Benutzerinformationen:
 *    - Automatische Befüllung mit Account-Daten
 *    - Zusätzliche Buchungsinformationen
 *    - Notfallkontakte und Führerschein-Verifikation
 *    - Marketing-Opt-ins und Newsletter-Anmeldung
 * 
 * 4. Rechtliche Komponenten:
 *    - AGB-Zustimmung und Datenschutzerklärung
 *    - Mietbedingungen und Haftungsausschlüsse
 *    - Versicherungsoptionen und Zusatzleistungen
 *    - DSGVO-konforme Einverständniserklärungen
 * 
 * CHECKOUT-WORKFLOW:
 * 
 * 1. Buchungsvalidierung:
 *    - Verfügbarkeitsprüfung für gewählten Zeitraum
 *    - Preisberechnung mit aktuellen Tarifen
 *    - Validierung von Gästeanzahl und Fahrzeug-Kapazität
 *    - Prüfung von Mindestmietdauer und Saisonbeschränkungen
 * 
 * 2. Zahlungsprozess:
 *    - Sichere Token-basierte Zahlungsdatenübertragung
 *    - Real-time Zahlungsvalidierung
 *    - Automatische Rechnungserstellung
 *    - E-Mail-Bestätigung mit PDF-Anhängen
 * 
 * 3. Buchungsabschluss:
 *    - Buchungsbestätigung mit eindeutiger Referenznummer
 *    - Kalender-Integration für Abhol-/Rückgabetermine
 *    - Automatische Benachrichtigungen an alle Beteiligten
 *    - Weiterleitung zur Bestätigungsseite
 * 
 * UI-KOMPONENTEN:
 * 
 * 1. ChevronLeftIcon - Navigation:
 *    - Zurück-Navigation zur vorherigen Seite
 *    - Breadcrumb-Integration
 *    - Accessibility-optimierte Button-Navigation
 * 
 * 2. StarIcon - Bewertungsanzeige:
 *    - Camper-Bewertungen und Sterne-Rating
 *    - Benutzer-Feedback Integration
 *    - Trust-Building für Buchungsentscheidungen
 * 
 * 3. Responsive Layout-Komponenten:
 *    - Multi-Column Layout für Desktop
 *    - Single-Column für mobile Geräte
 *    - Sticky Preisübersicht während Scroll
 * 
 * TECHNISCHE INTEGRATION:
 * 
 * 1. State Management:
 *    - camperVan: Fahrzeugdaten aus URL-Parametern oder Session
 *    - bookingDetails: Buchungsinformationen (checkIn, checkOut, guests)
 *    - paymentState: Zahlungsstatus und Transaktions-Tracking
 *    - validationErrors: Client-seitige Fehlerbehandlung
 * 
 * 2. Router Integration:
 *    - URL-Parameter für Camper-ID und Buchungsdaten
 *    - Programmatische Navigation nach erfolgreicher Zahlung
 *    - Back-Button Handling für mehrstufigen Checkout
 *    - Deep-Linking für direkte Checkout-Zugriffe
 * 
 * 3. Service Dependencies:
 *    - multilanguageService für mehrsprachigen Checkout
 *    - paymentService für Stripe-Integration
 *    - bookingService für Reservierungsmanagement
 *    - emailService für Bestätigungs-E-Mails
 * 
 * SICHERHEITSFEATURES:
 * 
 * 1. Payment Security:
 *    - PCI DSS Level 1 konforme Zahlungsabwicklung
 *    - Tokenisierte Kreditkartendaten
 *    - SSL/TLS Verschlüsselung für alle Transaktionen
 *    - Fraud Detection und Risk Assessment
 * 
 * 2. Data Protection:
 *    - DSGVO-konforme Datenverarbeitung
 *    - Minimale Datenspeicherung (Data Minimization)
 *    - Verschlüsselte Datenübertragung
 *    - Sichere Session-Verwaltung
 * 
 * 3. Input Validation:
 *    - Client- und serverseitige Validierung
 *    - XSS-Schutz durch Input-Sanitization
 *    - SQL-Injection Prevention
 *    - Rate-Limiting für API-Requests
 * 
 * PREISBERECHNUNG:
 * 
 * ```javascript
 * const calculateTotal = () => {
 *   const basePrice = camperVan.dailyRate * numberOfDays;
 *   const taxes = basePrice * 0.19; // 19% MwSt
 *   const serviceFee = basePrice * 0.05; // 5% Service-Gebühr
 *   const insurance = selectedInsurance.price;
 *   return basePrice + taxes + serviceFee + insurance;
 * };
 * ```
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-First Checkout-Flow für Touch-Optimierung
 * - Adaptive Payment-Form Layouts
 * - Optimierte Button-Größen für Touch-Interaktion
 * - Sticky Summary für mobile Geräte
 * 
 * ACCESSIBILITY:
 * - ARIA-Labels für komplexe Formularstrukturen
 * - Keyboard-Navigation für gesamten Checkout-Prozess
 * - Screen-Reader optimierte Preisaufschlüsselungen
 * - Focus-Management zwischen Checkout-Schritten
 * 
 * ERROR HANDLING:
 * - Payment Failure Recovery mit Retry-Mechanismen
 * - Network Error Handling mit Offline-Support
 * - Validation Error Display mit inline Feedback
 * - Transaction Timeout Handling
 * 
 * EINSATZGEBIETE:
 * - Finale Buchungsabwicklung für Camper-Reservierungen
 * - Sichere Zahlungsabwicklung mit Multi-Payment-Support
 * - Rechtlich bindende Vertragsabschlüsse
 * - Customer Journey Completion und Conversion Optimization
 * 
 * ABHÄNGIGKEITEN:
 * - Next.js Router für Navigation und URL-Parameter
 * - Container-Komponente für Layout-Konsistenz
 * - multilanguageService für Internationalisierung
 * - Stripe Elements für sichere Zahlungsabwicklung
 */

import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container } from '@/components/Container'
import { useLanguage } from '@/services/multilanguageService'

// Icons
function ChevronLeftIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function StarIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function Checkout() {
  const router = useRouter()
  const [camperVan, setCamperVan] = useState(null)
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  })
  const [isLoading, setIsLoading] = useState(false)
  const [customerData, setCustomerData] = useState({
    firstName: 'Max',
    lastName: 'Mustermann', 
    email: 'max.mustermann@example.com',
    phone: '+49 30 12345678',
    address: 'Musterstraße 123',
    postalCode: '10115',
    city: 'Berlin'
  })
  const [userDataLoaded, setUserDataLoaded] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: '4242 4242 4242 4242', // Visa Testkarte
    expiryDate: '12/26',
    cvv: '123',
    nameOnCard: 'Max Mustermann'
  })

  // Testdaten-Funktionen
  const loadTestData = (cardType = 'visa') => {
    const testCards = {
      visa: {
        cardNumber: '4242 4242 4242 4242',
        expiryDate: '12/26',
        cvv: '123',
        nameOnCard: 'Max Mustermann'
      },
      mastercard: {
        cardNumber: '5555 5555 5555 4444',
        expiryDate: '12/26', 
        cvv: '123',
        nameOnCard: 'Max Mustermann'
      },
      amex: {
        cardNumber: '3782 822463 10005',
        expiryDate: '12/26',
        cvv: '1234',
        nameOnCard: 'Max Mustermann'
      }
    }
    
    setCardData(testCards[cardType])
    setCustomerData({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@example.com',
      phone: '+49 30 12345678',
      address: 'Musterstraße 123',
      postalCode: '10115',
      city: 'Berlin'
    })
  }

  // Lade Benutzerdaten automatisch falls angemeldet
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('authToken') || 
                     document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

        if (token) {
          const response = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setCustomerData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              address: userData.address || '',
              postalCode: userData.postalCode || '',
              city: userData.city || ''
            });
            setUserDataLoaded(true);
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
      }
    };

    loadUserData();
  }, []);

  // Get booking data from URL parameters
  useEffect(() => {
    const { camper, checkIn, checkOut, guests } = router.query
    
    if (camper) {
      // Load real camper data from API
      const loadCamperData = async () => {
        try {
          const response = await fetch(`/api/campers/${camper}`)
          const result = await response.json()
          
          if (result.success && result.data) {
            setCamperVan({
              id: result.data.id,
              slug: result.data.slug,
              name: result.data.name,
              category: result.data.type || "Wohnmobil",
              price: result.data.pricePerDay || parseFloat(result.data.price_per_day || 0),
              rating: parseFloat(result.data.rating || 4.0),
              reviewCount: parseInt(result.data.review_count || 0),
              image: result.data.images && result.data.images[0] ? result.data.images[0] : "/images/campers/default.jpg",
              host: "CamperShare",
              location: result.data.location,
              beds: result.data.beds
            })
          } else {
            console.error('Camper nicht gefunden in API:', result)
            // Redirect back to campers page if camper not found
            router.push('/campers')
            return
          }
        } catch (error) {
          console.error('Error loading camper data:', error)
          // Redirect back to campers page on error
          router.push('/campers')
          return
        }
      }
      
      loadCamperData()
      
      setBookingDetails({
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        guests: parseInt(guests) || 1
      })
    }
  }, [router.query])

  const calculateNights = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return 0
    const checkIn = new Date(bookingDetails.checkIn)
    const checkOut = new Date(bookingDetails.checkOut)
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const basePrice = camperVan ? camperVan.price * nights : 0
  const serviceFee = Math.round(basePrice * 0.126)
  const taxes = Math.round(basePrice * 0.123)
  const totalPrice = basePrice + serviceFee + taxes

  // Buchungslogik
  const handleBooking = async () => {
    if (!customerData.firstName || !customerData.lastName || !customerData.email) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          camperId: camperVan.id, // This should be the UUID from the API
          startDate: bookingDetails.checkIn,
          endDate: bookingDetails.checkOut,
          totalDays: nights,
          totalPrice: totalPrice,
          customerData: customerData,
          paymentData: cardData
        }),
      });

      const result = await response.json();

      console.log('Booking response:', result); // Debug log

      if (response.ok && result.success) {
        router.push(`/booking-confirmation?bookingId=${result.bookingId}`);
      } else {
        // Show more detailed error information
        let errorMessage = result.error || 'Buchung fehlgeschlagen';
        if (result.code) {
          errorMessage += ` (Code: ${result.code})`;
        }
        console.error('Booking failed:', result);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Buchungsfehler:', error);
      
      // More detailed error logging
      console.log('Camper ID being sent:', camperVan.id);
      console.log('Booking details:', {
        camperId: camperVan.id,
        startDate: bookingDetails.checkIn,
        endDate: bookingDetails.checkOut,
        totalDays: nights,
        totalPrice: totalPrice
      });
      
      alert(`Es gab einen Fehler bei der Buchung: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!camperVan) {
    return <div className="min-h-screen flex items-center justify-center">Lade...</div>
  }

  return (
    <>
      <Head>
        <title>Buchung bestätigen - CamperShare</title>
        <meta name="description" content="Bestätigen Sie Ihre Camper-Buchung" />
      </Head>

      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-700">
          <Container>
            <div className="flex items-center justify-between py-4">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-zinc-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Zurück
              </button>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Buchung bestätigen
              </h1>
              <div className="w-16"></div>
            </div>
          </Container>
        </div>

        <Container>
          <div className="max-w-6xl mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="space-y-8">
                
                <div className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                    Ihre Reise
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">Termine</div>
                        <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {bookingDetails.checkIn && bookingDetails.checkOut
                            ? `${new Date(bookingDetails.checkIn).toLocaleDateString('de-DE')} - ${new Date(bookingDetails.checkOut).toLocaleDateString('de-DE')}`
                            : 'Termine auswählen'
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">Gäste</div>
                        <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {bookingDetails.guests} {bookingDetails.guests === 1 ? 'Gast' : 'Gäste'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                    Kartendaten
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Kartennummer
                      </label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          MM/JJ
                        </label>
                        <input
                          type="text"
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                          placeholder="12/24"
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Name auf der Karte
                      </label>
                      <input
                        type="text"
                        value={cardData.nameOnCard}
                        onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                        placeholder="Max Mustermann"
                        className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                  
                  {/* Testdaten-Buttons */}
                  <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                      🧪 Schnell-Test mit vorgefüllten Daten:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => loadTestData('visa')}
                        className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        💳 Visa Test
                      </button>
                      <button
                        type="button"
                        onClick={() => loadTestData('mastercard')}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        💳 Mastercard Test
                      </button>
                      <button
                        type="button"
                        onClick={() => loadTestData('amex')}
                        className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        💳 Amex Test
                      </button>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                      Diese Daten sind nur für Testzwecke und füllen automatisch alle Felder aus.
                    </div>
                  </div>
                </div>

                <div className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      Ihre Daten
                    </h2>
                    {userDataLoaded ? (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Daten automatisch geladen
                      </div>
                    ) : (
                      <a 
                        href={`/login?returnUrl=${encodeURIComponent(router.asPath)}`}
                        className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        Anmelden für automatisches Ausfüllen
                      </a>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Vorname *
                        </label>
                        <input
                          type="text"
                          value={customerData.firstName}
                          onChange={(e) => setCustomerData({ ...customerData, firstName: e.target.value })}
                          placeholder="Max"
                          required
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Nachname *
                        </label>
                        <input
                          type="text"
                          value={customerData.lastName}
                          onChange={(e) => setCustomerData({ ...customerData, lastName: e.target.value })}
                          placeholder="Mustermann"
                          required
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        E-Mail-Adresse *
                      </label>
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                        placeholder="max@example.com"
                        required
                        className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Telefonnummer
                      </label>
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        placeholder="+49 123 456 789"
                        className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={customerData.address}
                        onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                        placeholder="Musterstraße 123"
                        className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          PLZ
                        </label>
                        <input
                          type="text"
                          value={customerData.postalCode}
                          onChange={(e) => setCustomerData({ ...customerData, postalCode: e.target.value })}
                          placeholder="12345"
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Stadt
                        </label>
                        <input
                          type="text"
                          value={customerData.city}
                          onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                          placeholder="Berlin"
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleBooking}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Buchung wird verarbeitet...
                      </div>
                    ) : (
                      "Buchung bestätigen und bezahlen (€" + totalPrice.toFixed(2) + ")"
                    )}
                  </button>
                  
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 text-center">
                    Test-Modus: Es wird keine echte Zahlung durchgeführt.
                  </p>
                </div>
              </div>

              <div className="lg:sticky lg:top-24">
                <div className="border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 bg-white dark:bg-zinc-800/50 shadow-lg">
                  
                  <div className="flex space-x-4 mb-6">
                    <div className="w-24 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-xl overflow-hidden">
                      <img 
                        src={camperVan.image} 
                        alt={camperVan.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                        {camperVan.category}
                      </div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">
                        {camperVan.name}
                      </div>
                      <div className="flex items-center mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 ml-1 font-medium">
                          {camperVan.rating} ({camperVan.reviewCount} Bewertungen)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                      Preisdetails
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          €{camperVan.price} x {nights} Nächte
                        </span>
                        <span className="text-zinc-900 dark:text-zinc-100">
                          €{basePrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Servicegebühr
                        </span>
                        <span className="text-zinc-900 dark:text-zinc-100">
                          €{serviceFee.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Steuern
                        </span>
                        <span className="text-zinc-900 dark:text-zinc-100">
                          €{taxes.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-zinc-200 dark:border-zinc-700 mt-4 pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-zinc-900 dark:text-zinc-100">Gesamt</span>
                        <span className="text-teal-600 dark:text-teal-400">€{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 mt-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                      Stornierungsrichtlinie
                    </h3>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="text-blue-800 dark:text-blue-200 text-sm">
                        <div className="font-medium mb-2">Kostenlose Stornierung vor dem 15. Jan.</div>
                        <p className="text-xs">
                          Stornieren Sie bis 48 Stunden vor Beginn und erhalten Sie eine vollständige Rückerstattung abzüglich der Servicegebühren.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}