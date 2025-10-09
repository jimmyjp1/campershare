/**
 * =============================================================================
 * BOOKINGS TAB KOMPONENTE
 * =============================================================================
 * 
 * Benutzer-Dashboard Tab für Buchungsverwaltung mit Übersicht aller
 * Campervermietungen und Buchungsmanagement-Funktionen.
 * 
 * HAUPTFUNKTIONEN:
 * - Anzeige aller Benutzerbuchungen mit Status-Übersicht
 * - Interaktive Buchungsdetails mit Expand/Collapse
 * - Status-Management (Ausstehend, Bestätigt, Storniert, Abgeschlossen)
 * - Buchungsstornierung mit Bestätigungsdialog
 * - Responsive Tabellen-Layout für mobile und Desktop
 * 
 * STATUS SYSTEM:
 * - pending: Gelb - Buchung wartet auf Bestätigung
 * - confirmed: Grün - Buchung bestätigt und bezahlt
 * - cancelled: Rot - Buchung vom Kunden oder Admin storniert
 * - completed: Blau - Buchung erfolgreich abgeschlossen
 * 
 * FEATURES:
 * - Automatisches Laden der Buchungsdaten bei Tab-Aktivierung
 * - Dark Mode kompatibles Farbschema
 * - Deutsche Lokalisierung aller Texte und Statuslabels
 * - Error Handling mit Benutzerfreundlichen Meldungen
 * - Loading States während API-Aufrufen
 * 
 * INTEGRATION:
 * - bookingService für API-Kommunikation
 * - Button-Komponente für konsistente UI
 * - Responsive Design mit Tailwind CSS
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { bookingAPI } from '@/services/bookingService'

// Status mapping for German display
const statusLabels = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  confirmed: { label: 'Bestätigt', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  cancelled: { label: 'Storniert', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  completed: { label: 'Abgeschlossen', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' }
}

const paymentStatusLabels = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  paid: { label: 'Bezahlt', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  failed: { label: 'Fehlgeschlagen', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  refunded: { label: 'Zurückerstattet', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' }
}

// Format date for German locale
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Format price
function formatPrice(amount) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function BookingCard({ booking, onCancel, onViewDetails }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  
  const canCancel = booking.status === 'confirmed' || booking.status === 'pending'
  const startDate = new Date(booking.startDate)
  const today = new Date()
  const isUpcoming = startDate > today

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      await onCancel(booking.id)
      setShowCancelModal(false)
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {booking.camper?.name || 'Camper'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Buchungsnummer: <span className="font-mono">{booking.bookingNumber}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[booking.status]?.color}`}>
              {statusLabels[booking.status]?.label || booking.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusLabels[booking.paymentStatus]?.color}`}>
              {paymentStatusLabels[booking.paymentStatus]?.label || booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* Camper Image and Details */}
        <div className="flex gap-4 mb-4">
          {booking.camper?.images?.[0] && (
            <img
              src={booking.camper.images[0]}
              alt={booking.camper.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {booking.camper?.category}
            </p>
            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{booking.camper?.passengers} Personen</span>
              <span>{booking.camper?.beds} Betten</span>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reisedaten</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {booking.totalDays} Nächte
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Standort</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {booking.pickupLocation}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Gesamtpreis: {formatPrice(booking.totalAmount)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Erstellt am {formatDate(booking.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewDetails(booking)}
            variant="secondary"
            className="flex-1 py-2"
          >
            Details anzeigen
          </Button>
          
          {canCancel && isUpcoming && (
            <Button
              onClick={() => setShowCancelModal(true)}
              variant="secondary"
              className="px-4 py-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Stornieren
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Buchung stornieren
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sind Sie sicher, dass Sie diese Buchung stornieren möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="secondary"
                className="flex-1"
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleCancel}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Storniere...' : 'Stornieren'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function BookingsTab() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Da alle Test-Buchungen gelöscht wurden, verwenden wir den echten Benutzer Jimmi
      const userId = '427c4a4b-b5a2-4cd7-838d-197dbb512982' // Jimmi Pollomi
      
      const response = await fetch(`/api/bookings/by-user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Fehler beim Laden der Buchungen')
      }

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (err) {
      console.error('Error loading bookings:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId, 'Storniert durch Benutzer')
      await loadBookings() // Reload bookings
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const handleViewDetails = (booking) => {
    // Navigate to booking confirmation page
    window.open(`/booking-confirmation?bookingNumber=${booking.bookingNumber}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 mb-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
            Fehler beim Laden der Buchungen
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={loadBookings} variant="secondary">
            Erneut versuchen
          </Button>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m-5 0h2m8-4v-3a1 1 0 011-1h3a1 1 0 011 1v3m0 0v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Keine Buchungen vorhanden
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sie haben noch keine Campingfahrzeuge gebucht.
        </p>
        <Button href="/" className="inline-flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Camper durchsuchen
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Meine Buchungen
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Verwalten Sie Ihre aktuellen und vergangenen Buchungen
          </p>
        </div>
        <Button onClick={loadBookings} variant="secondary" className="px-4 py-2">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Aktualisieren
        </Button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCancel={handleCancelBooking}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  )
}
