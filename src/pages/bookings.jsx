/**
 * =============================================================================
 * BOOKINGS ÜBERSICHTS-SEITE
 * =============================================================================
 * 
 * Dedizierte Seite für die vollständige Buchungsübersicht und -verwaltung
 * der WWISCA CamperShare Plattform.
 * 
 * HAUPTFUNKTIONEN:
 * - Vollständige Buchungshistorie des authentifizierten Benutzers
 * - Interaktive Buchungsverwaltung mit Status-Updates
 * - Buchungsdetails und Download-Optionen
 * - Stornierungsfunktionen mit Bestätigungsdialogen
 * - Responsive Design für alle Geräte
 * 
 * SICHERHEIT:
 * - Authentifizierung erforderlich für Zugriff
 * - Automatische Weiterleitung zu Login bei nicht-authentifizierten Benutzern
 * - Sichere API-Kommunikation mit Token-basierter Authentifizierung
 * 
 * BUCHUNGS-FEATURES:
 * - Status-basierte Filterung (Aktiv, Abgeschlossen, Storniert)
 * - Chronologische Sortierung der Buchungen
 * - Detailansicht einzelner Buchungen
 * - Re-Booking Funktionen für Folgebuchungen
 * - Buchungsbestätigungen und Rechnungen
 * 
 * INTEGRATION:
 * - BookingsTab Komponente für einheitliche UI
 * - authService für Benutzerauthentifizierung
 * - bookingService für API-Kommunikation
 * - SimpleLayout für konsistente Seitendarstellung
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SimpleLayout } from '@/components/SimpleLayout'
import { BookingsTab } from '@/components/BookingsTab'
import { Container } from '@/components/Container'
import { authService } from '@/services/userAuthenticationService'
import { useLanguage } from '@/services/multilanguageService'

export default function BookingsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        // Weiterleitung zu Login mit Return-URL
        router.push('/auth?redirect=/bookings')
      }
    } catch (error) {
      console.error('Authentifizierungsfehler:', error)
      router.push('/auth?redirect=/bookings')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading State während Authentifizierung
  if (isLoading) {
    return (
      <>
        <Head>
          <title>Buchungen - WWISCA CamperShare</title>
          <meta name="description" content="Verwalten Sie Ihre Campervermietungen und Buchungshistorie." />
        </Head>
        <SimpleLayout
          title="Buchungen werden geladen..."
          intro="Bitte warten Sie, während wir Ihre Buchungsdaten laden."
        >
          <Container className="mt-16 sm:mt-32">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
            </div>
          </Container>
        </SimpleLayout>
      </>
    )
  }

  // Nicht authentifiziert - wird automatisch weitergeleitet
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Head>
        <title>Meine Buchungen - WWISCA CamperShare</title>
        <meta 
          name="description" 
          content="Übersicht und Verwaltung Ihrer Campervermietungen bei WWISCA CamperShare." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <SimpleLayout
        title="Meine Buchungen"
        intro="Hier finden Sie eine vollständige Übersicht über alle Ihre Campervermietungen, von aktiven Buchungen bis hin zur kompletten Historie."
      >
        <Container className="mt-16 sm:mt-32">
          {/* Willkommensnachricht */}
          <div className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-200 dark:border-teal-700">
            <h2 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
              Willkommen zurück, {user?.firstName || 'Camper-Freund'}! 🚐
            </h2>
            <p className="text-teal-700 dark:text-teal-300">
              Verwalten Sie hier Ihre Buchungen, laden Sie Unterlagen herunter oder planen Sie Ihre nächste Reise.
            </p>
          </div>

          {/* Hauptbuchungskomponente */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Buchungsübersicht
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Status, Details und Verwaltungsoptionen für alle Ihre Buchungen.
              </p>
            </div>
            
            <div className="p-6">
              <BookingsTab />
            </div>
          </div>

          {/* Hilfreiche Links */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Neue Buchung</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Entdecken Sie unsere Camper-Flotte und buchen Sie Ihr nächstes Abenteuer.
              </p>
              <a 
                href="/campers" 
                className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
              >
                Camper entdecken →
              </a>
            </div>

            <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Support</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Benötigen Sie Hilfe bei Ihrer Buchung? Unser Team steht bereit.
              </p>
              <a 
                href="/support" 
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Hilfe erhalten →
              </a>
            </div>

            <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Profil</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Verwalten Sie Ihre persönlichen Daten und Account-Einstellungen.
              </p>
              <a 
                href="/profile" 
                className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                Profil bearbeiten →
              </a>
            </div>
          </div>
        </Container>
      </SimpleLayout>
    </>
  )
}
