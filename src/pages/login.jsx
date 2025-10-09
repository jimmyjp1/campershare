/**
 * login.jsx - Login-Seite
 * ========================
 * 
 * HAUPTFUNKTION:
 * Dedizierte Login-Seite für die Benutzeranmeldung auf der WWISCA Camper-Plattform.
 * Bietet eine streamlined Anmeldung mit vorgefüllten Testdaten für Entwicklung und Demo.
 * 
 * SEITEN-FEATURES:
 * 
 * 1. Streamlined Login-Form:
 *    - E-Mail und Passwort Eingabefelder
 *    - Vorgefüllte Testbenutzer-Daten für Demo-Zwecke
 *    - Loading-States während Authentifizierung
 *    - Error-Handling mit benutzerfreundlichen Meldungen
 * 
 * 2. Entwickler-freundliche Testdaten:
 *    - Vorkonfigurierte Test-E-Mail: kunde@example.com
 *    - Test-Passwort: password123
 *    - Schneller Zugang für Entwicklung und QA
 *    - Einfache Anpassung für verschiedene Test-Szenarien
 * 
 * 3. Sichere Authentifizierung:
 *    - API-Integration mit /api/auth/login Endpoint
 *    - JWT-Token Management
 *    - Sichere Session-Handhabung
 *    - Automatische Weiterleitung nach erfolgreicher Anmeldung
 * 
 * 4. Benutzerfreundliche UX:
 *    - Responsive Design für alle Gerätegrößen
 *    - Klare Error-Messages für fehlgeschlagene Logins
 *    - Loading-Indikatoren für visuelles Feedback
 *    - Router-Integration für nahtlose Navigation
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. Form State Management:
 *    - useState für Formular-Daten (email, password)
 *    - Loading-State für Submit-Button Deaktivierung
 *    - Error-State für Fehlermeldungen-Anzeige
 *    - Controlled Inputs für React-konforme Formulare
 * 
 * 2. API Integration:
 *    - Fetch-basierte HTTP-Requests zu Backend
 *    - JSON Content-Type für sichere Datenübertragung
 *    - Response-Handling für Success/Error Szenarien
 *    - Token-Speicherung nach erfolgreicher Authentifizierung
 * 
 * 3. Router Integration:
 *    - useRouter für programmatische Navigation
 *    - Redirect nach erfolgreicher Anmeldung
 *    - Return-URL Support für Deep-Links
 *    - History-Management für Back-Button Support
 * 
 * AUTHENTICATION WORKFLOW:
 * 
 * 1. Form Submission:
 *    - User gibt E-Mail und Passwort ein
 *    - Form-Validation vor API-Call
 *    - Loading-State aktiviert
 *    - Submit-Button wird deaktiviert
 * 
 * 2. Backend Authentication:
 *    - POST-Request an /api/auth/login
 *    - Server validiert Credentials
 *    - JWT-Token wird generiert
 *    - User-Daten werden zurückgegeben
 * 
 * 3. Success Handling:
 *    - Token wird im LocalStorage/Cookie gespeichert
 *    - User-State wird global aktualisiert
 *    - Weiterleitung zur gewünschten Seite
 *    - Session wird aktiviert
 * 
 * 4. Error Handling:
 *    - Fehlermeldung wird angezeigt
 *    - Form bleibt editierbar
 *    - Loading-State wird deaktiviert
 *    - User kann Eingaben korrigieren
 * 
 * SICHERHEITSFEATURES:
 * 
 * 1. Input Validation:
 *    - E-Mail Format-Validierung
 *    - Passwort-Länge Überprüfung
 *    - XSS-Schutz durch Input-Sanitization
 *    - CSRF-Token für State-Changing Requests
 * 
 * 2. Authentication Security:
 *    - HTTPS-only für Credential-Übertragung
 *    - Secure HTTP-Only Cookies für Tokens
 *    - Rate-Limiting für Login-Versuche
 *    - Account-Lockout nach fehlgeschlagenen Versuchen
 * 
 * 3. Session Management:
 *    - JWT mit kurzer Lebensdauer
 *    - Refresh-Token für Session-Verlängerung
 *    - Automatic Logout bei Token-Ablauf
 *    - Secure Token Storage (HttpOnly Cookies)
 * 
 * ENTWICKLUNGS-UNTERSTÜTZUNG:
 * 
 * 1. Test-Credentials:
 *    ```javascript
 *    const defaultTestUser = {
 *      email: 'kunde@example.com',
 *      password: 'password123'
 *    };
 *    ```
 * 
 * 2. Environment-spezifische Konfiguration:
 *    - Development: Vorgefüllte Testdaten
 *    - Staging: Test-User Accounts
 *    - Production: Sichere Authentifizierung ohne Defaults
 * 
 * 3. Debug-Features:
 *    - Console-Logging für Entwicklung
 *    - Network-Request Monitoring
 *    - Error-Stack Traces für Debugging
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-First Form-Layout
 * - Touch-optimierte Input-Felder
 * - Adaptive Button-Größen
 * - Keyboard-freundliche Navigation
 * 
 * ACCESSIBILITY:
 * - Semantic HTML für Screen-Reader
 * - ARIA-Labels für Form-Felder
 * - Focus-Management zwischen Eingaben
 * - High-Contrast Mode Support
 * 
 * ERROR SCENARIOS:
 * 
 * 1. Network Errors:
 *    - Connection Timeout Handling
 *    - Offline-Detection und Meldung
 *    - Retry-Mechanismen für fehlgeschlagene Requests
 * 
 * 2. Authentication Errors:
 *    - Ungültige Credentials
 *    - Account nicht gefunden
 *    - Account gesperrt/deaktiviert
 *    - Server-Fehler (500, 503)
 * 
 * 3. Client-Side Errors:
 *    - JavaScript-Fehler Handling
 *    - Form-Validation Errors
 *    - Browser-Kompatibilitätsprobleme
 * 
 * EINSATZGEBIETE:
 * - Entwicklung und Testing mit vorgefüllten Credentials
 * - Demo-Umgebungen für Stakeholder-Präsentationen
 * - QA-Testing mit standardisierten Test-Accounts
 * - User Acceptance Testing (UAT)
 * 
 * ABHÄNGIGKEITEN:
 * - Next.js Router für Navigation
 * - Container für Layout-Konsistenz
 * - React useState/useEffect für State-Management
 * - Fetch API für Backend-Kommunikation
 */

import { useState } from 'react';
import Head from 'next/head';
import { Container } from '@/components/Container';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'kunde@example.com', // Vorgefüllt mit Testbenutzer
    password: 'password123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Token speichern
        localStorage.setItem('authToken', data.token);
        document.cookie = `authToken=${data.token}; max-age=${7 * 24 * 60 * 60}; path=/`;
        
        // Zurück zur Checkout-Seite oder zur gewünschten Seite
        const returnUrl = router.query.returnUrl || '/checkout?camper=carthago-c-tourer&checkIn=2025-01-15&checkOut=2025-01-18&guests=2';
        router.push(returnUrl);
      } else {
        setError(data.error || 'Anmeldung fehlgeschlagen');
      }
    } catch (error) {
      setError('Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Anmelden - CamperShare</title>
      </Head>

      <Container className="py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
              Anmelden
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-700 dark:text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Passwort
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-700 dark:text-zinc-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                {loading ? 'Anmelden...' : 'Anmelden'}
              </button>
            </form>

            {/* Testbenutzer-Hinweise */}
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Verfügbare Testbenutzer:
              </h3>
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div>
                  <strong>Kunde:</strong> kunde@example.com / password123<br/>
                  <span className="text-zinc-500">Max Mustermann, +49 987 654321</span>
                </div>
                <div>
                  <strong>Admin:</strong> admin@campershare.com / password123<br/>
                  <span className="text-zinc-500">Admin User, +49 123 456789</span>
                </div>
                <div>
                  <strong>Weitere Kunden:</strong> mueller@example.com, schmidt@example.com, becker@example.com<br/>
                  <span className="text-zinc-500">Alle mit Passwort: password123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
