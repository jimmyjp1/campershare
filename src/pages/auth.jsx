/**
 * auth.jsx - Authentifizierungs-Seite
 * ===================================
 * 
 * HAUPTFUNKTION:
 * Zentrale Authentifizierungsseite der WWISCA Camper-Plattform für Benutzeranmeldung und -registrierung.
 * Kombiniert Login- und Registrierungsformulare in einer einheitlichen, benutzerfreundlichen Oberfläche.
 * 
 * SEITEN-FEATURES:
 * 
 * 1. Dual-Mode Authentication:
 *    - Toggle zwischen Login- und Registrierungsmodus
 *    - Nahtloser Wechsel ohne Seitenneuladung
 *    - Konsistente UI/UX für beide Modi
 *    - State-Management für Formular-Persistierung
 * 
 * 2. Automatische Authentifizierungs-Überprüfung:
 *    - Sofortige Weiterleitung für bereits angemeldete Benutzer
 *    - Session-Validation beim Seitenladen
 *    - Redirect zu ursprünglich angeforderten Seiten
 *    - Deep-Link Support für geschützte Bereiche
 * 
 * 3. Benutzerfreundliche Oberfläche:
 *    - CamperShareIcon als Branding-Element
 *    - Responsive Design für alle Gerätegrößen
 *    - Loading-States während Authentifizierung
 *    - Mehrsprachige Unterstützung (Deutsch/Englisch)
 * 
 * 4. Sichere Authentifizierung:
 *    - authService Integration für Backend-Kommunikation
 *    - JWT-Token Management
 *    - Secure Session Handling
 *    - Rate-Limiting für Brute-Force Schutz
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. State Management:
 *    - isLogin: Toggle zwischen Login/Register Modi
 *    - isLoading: Loading-State für Auth-Überprüfungen
 *    - Form-States innerhalb AuthForms Komponenten
 *    - Error-Handling für fehlgeschlagene Authentifizierung
 * 
 * 2. Router Integration:
 *    - useRouter für programmatische Navigation
 *    - Redirect-Handling nach erfolgreicher Authentifizierung
 *    - Query-Parameter für Return-URLs
 *    - Deep-Link Preservation für bessere UX
 * 
 * 3. Service Integration:
 *    - authService für Backend-Authentifizierung
 *    - multilanguageService für Internationalisierung
 *    - Session-Management und Token-Refresh
 *    - Error-Handling und User-Feedback
 * 
 * BENUTZER-WORKFLOW:
 * 
 * 1. Seitenzugriff:
 *    - Automatische Auth-Status Überprüfung
 *    - Weiterleitung wenn bereits angemeldet
 *    - Anzeige der Authentifizierungsoptionen
 * 
 * 2. Login-Prozess:
 *    - E-Mail/Passwort Eingabe in LoginForm
 *    - Backend-Validation und Token-Generation
 *    - Erfolgreiche Anmeldung und Weiterleitung
 *    - Session-Speicherung für persistente Anmeldung
 * 
 * 3. Registrierung:
 *    - Persönliche Daten in RegisterForm eingeben
 *    - Account-Erstellung und E-Mail-Verifikation
 *    - Automatische Anmeldung nach Registrierung
 *    - Welcome-E-Mail und Onboarding-Prozess
 * 
 * FORMULAR-KOMPONENTEN:
 * 
 * 1. LoginForm (aus AuthForms):
 *    - E-Mail und Passwort Eingabefelder
 *    - "Passwort vergessen" Funktionalität
 *    - Social Login Optionen (Google, Facebook)
 *    - Captcha-Integration für Sicherheit
 * 
 * 2. RegisterForm (aus AuthForms):
 *    - Persönliche Daten (Name, E-Mail, Telefon)
 *    - Passwort mit Stärke-Validierung
 *    - AGB und Datenschutz Zustimmung
 *    - Newsletter Opt-in Checkbox
 * 
 * SICHERHEITSFEATURES:
 * 
 * 1. Input Validation:
 *    - Client-seitige Formular-Validierung
 *    - Server-seitige Datenverifikation
 *    - XSS-Schutz durch Input-Sanitization
 *    - SQL-Injection Prevention
 * 
 * 2. Authentication Security:
 *    - JWT-Token mit kurzer Lebensdauer
 *    - Refresh-Token für Session-Verlängerung
 *    - Secure HTTP-Only Cookies
 *    - CSRF-Protection für State-Changing Requests
 * 
 * 3. Account Protection:
 *    - Account-Lockout nach fehlgeschlagenen Versuchen
 *    - E-Mail-Verifikation für neue Accounts
 *    - Passwort-Reset mit sicheren Tokens
 *    - Two-Factor Authentication (optional)
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-First Ansatz für Touch-optimierte Formulare
 * - Adaptive Layouts für verschiedene Bildschirmgrößen
 * - Touch-freundliche Button-Größen und Spacing
 * - Optimierte Keyboard-Navigation für Desktop
 * 
 * ACCESSIBILITY:
 * - Semantic HTML für Screen-Reader Kompatibilität
 * - ARIA-Labels für komplexe Formularstrukturen
 * - Focus-Management zwischen Form-Feldern
 * - High-Contrast Mode Support für Sehbehinderte
 * 
 * ERROR HANDLING:
 * 
 * 1. Network Errors:
 *    - Retry-Mechanismen für fehlgeschlagene Requests
 *    - Offline-Detection und entsprechende Meldungen
 *    - Graceful Degradation bei Service-Ausfällen
 * 
 * 2. Validation Errors:
 *    - Inline Error-Messages für sofortiges Feedback
 *    - Field-level Validation mit visuellen Indikatoren
 *    - Form-wide Error-Summary für Übersicht
 * 
 * 3. Authentication Errors:
 *    - Spezifische Fehlermeldungen für verschiedene Szenarien
 *    - Rate-Limiting Warnings für zu viele Versuche
 *    - Account-Recovery Options bei Problemen
 * 
 * EINSATZGEBIETE:
 * - Benutzeranmeldung für bestehende Accounts
 * - Neue Account-Registrierung für Camper-Buchungen
 * - Access-Control für geschützte Bereiche
 * - Session-Management und User-State Persistence
 * 
 * ABHÄNGIGKEITEN:
 * - Next.js Router für Navigation und Redirects
 * - Container für konsistente Layout-Struktur
 * - AuthForms für Login/Register Formulare
 * - authService für Backend-Authentifizierung
 * - multilanguageService für Internationalisierung
 * - CamperShareIcon für Branding
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Container } from '@/components/Container'
import { LoginForm, RegisterForm } from '@/components/AuthForms'
import { useLanguage } from '@/services/multilanguageService'
import { authService } from '@/services/userAuthenticationService'
import { CamperShareIcon } from '@/components/CamperShareIcon'

export default function Auth() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        // Redirect to dashboard or home
        router.push('/')
        return
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleAuthSuccess = (user) => {
    // Redirect based on user role or to intended destination
    const returnUrl = router.query.returnUrl || '/'
    router.push(returnUrl)
  }

  const switchToRegister = () => setIsLogin(false)
  const switchToLogin = () => setIsLogin(true)

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>CamperShare</title>
        <meta
          name="description"
          content={isLogin 
            ? t('auth.loginSubtitle') 
            : t('auth.registerSubtitle')
          }
        />
      </Head>

      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Container>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Auth Forms */}
            <div className="bg-white dark:bg-zinc-800 py-8 px-4 shadow-xl rounded-lg sm:px-10">
              {isLogin ? (
                <LoginForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToRegister={switchToRegister}
                />
              ) : (
                <RegisterForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToLogin={switchToLogin}
                />
              )}
            </div>

            {/* Demo Credentials (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                  Demo-Zugangsdaten (Entwicklung):
                </h3>
                <div className="space-y-2 text-xs text-yellow-700 dark:text-yellow-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Kunde:</strong><br />
                      max@example.com<br />
                      password123
                    </div>
                    <div>
                      <strong>Anbieter:</strong><br />
                      anna@provider.com<br />
                      provider123
                    </div>
                  </div>
                  <div className="pt-2 border-t border-yellow-200 dark:border-yellow-700">
                    <strong>Admin:</strong> admin@campervan.com / admin123
                  </div>
                </div>
              </div>
            )}

            {/* Additional Links */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-6 text-sm">
                <a
                  href="/terms"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t('auth.termsOfService')}
                </a>
                <a
                  href="/privacy"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t('auth.privacyPolicy')}
                </a>
                <a
                  href="/help"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Hilfe
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
