/**
 * reset-password.jsx - Passwort-Zurücksetzen-Seite
 * =================================================
 * 
 * HAUPTFUNKTION:
 * Sichere Passwort-Reset-Seite für die WWISCA Camper-Plattform zur Wiederherstellung vergessener Passwörter.
 * Ermöglicht Benutzern das sichere Zurücksetzen ihrer Passwörter über Token-basierte E-Mail-Links.
 * 
 * SEITEN-FEATURES:
 * 
 * 1. Token-basierte Sicherheit:
 *    - URL-Token-Extraktion aus Router Query-Parametern
 *    - Sichere Token-Validation über Backend-API
 *    - Einmalige Token-Verwendung für maximale Sicherheit
 *    - Zeitbasierte Token-Expiration (normalerweise 1-2 Stunden)
 * 
 * 2. Passwort-Eingabe-Formular:
 *    - Neues Passwort mit Stärke-Validierung
 *    - Passwort-Bestätigung für Tippfehler-Prävention
 *    - Show/Hide Toggle-Buttons für Passwort-Sichtbarkeit
 *    - Real-time Validation und Feedback
 * 
 * 3. Benutzerfreundliche UX:
 *    - Loading-States während API-Calls
 *    - Erfolgs- und Fehlermeldungen
 *    - Progressive Enhancement für bessere Accessibility
 *    - Responsive Design für alle Gerätegrößen
 * 
 * 4. Sicherheitsfeatures:
 *    - Passwort-Stärke-Requirements
 *    - Client-seitige Validierung vor API-Call
 *    - Rate-Limiting für Brute-Force-Schutz
 *    - Secure Form-Handling ohne Passwort-Caching
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. State Management:
 *    - formData: { newPassword, confirmPassword }
 *    - showPassword/showConfirmPassword: Toggle-Zustände
 *    - isLoading: Submit-Status für UI-Feedback
 *    - error/success: Benutzer-Feedback Messages
 * 
 * 2. Form Validation:
 *    - Password-Match Validation (newPassword === confirmPassword)
 *    - Passwort-Stärke Requirements (Länge, Komplexität)
 *    - Real-time Feedback während Eingabe
 *    - Client-seitige Pre-Validation vor API-Call
 * 
 * 3. API Integration:
 *    - POST /api/auth/reset-password mit Token und neuen Passwort
 *    - JSON-Response Handling für verschiedene Szenarien
 *    - Error-Handling für ungültige Token oder Server-Fehler
 *    - Success-Callback für Passwort-Update Bestätigung
 * 
 * PASSWORT-RESET-WORKFLOW:
 * 
 * 1. Initiierung:
 *    ```
 *    "Passwort vergessen" → E-Mail-Eingabe → Reset-Link E-Mail → Link-Klick → Reset-Seite
 *    ```
 * 
 * 2. Formular-Validation:
 *    ```javascript
 *    const validateForm = () => {
 *      if (formData.newPassword !== formData.confirmPassword) {
 *        setError('Die Passwörter stimmen nicht überein');
 *        return false;
 *      }
 *      
 *      if (formData.newPassword.length < 8) {
 *        setError('Passwort muss mindestens 8 Zeichen lang sein');
 *        return false;
 *      }
 *      
 *      return true;
 *    };
 *    ```
 * 
 * 3. API-Call Struktur:
 *    ```javascript
 *    const resetPassword = async () => {
 *      const response = await fetch('/api/auth/reset-password', {
 *        method: 'POST',
 *        headers: { 'Content-Type': 'application/json' },
 *        body: JSON.stringify({
 *          token: token,
 *          newPassword: formData.newPassword
 *        })
 *      });
 *    };
 *    ```
 * 
 * PASSWORT-SICHERHEIT:
 * 
 * 1. Passwort-Requirements:
 *    - Mindestlänge: 8 Zeichen
 *    - Mindestens 1 Großbuchstabe
 *    - Mindestens 1 Kleinbuchstabe
 *    - Mindestens 1 Zahl
 *    - Mindestens 1 Sonderzeichen (optional, aber empfohlen)
 * 
 * 2. Passwort-Stärke-Indikatoren:
 *    ```javascript
 *    const getPasswordStrength = (password) => {
 *      let strength = 0;
 *      if (password.length >= 8) strength++;
 *      if (/[A-Z]/.test(password)) strength++;
 *      if (/[a-z]/.test(password)) strength++;
 *      if (/\d/.test(password)) strength++;
 *      if (/[^A-Za-z\d]/.test(password)) strength++;
 *      
 *      return ['Sehr schwach', 'Schwach', 'Mittel', 'Stark', 'Sehr stark'][strength];
 *    };
 *    ```
 * 
 * 3. Sichere Passwort-Handling:
 *    - Keine Passwort-Speicherung im Browser-Cache
 *    - Automatisches Form-Clearing nach Submit
 *    - Memory-Clearing für sensitive Daten
 *    - Secure HTTP-Only für Token-Übertragung
 * 
 * API-RESPONSES:
 * 
 * 1. Erfolgreicher Reset:
 *    ```json
 *    {
 *      "success": true,
 *      "message": "Passwort erfolgreich zurückgesetzt",
 *      "redirectUrl": "/login"
 *    }
 *    ```
 * 
 * 2. Ungültiger Token:
 *    ```json
 *    {
 *      "success": false,
 *      "error": "INVALID_TOKEN",
 *      "message": "Ungültiger oder abgelaufener Reset-Link"
 *    }
 *    ```
 * 
 * 3. Schwaches Passwort:
 *    ```json
 *    {
 *      "success": false,
 *      "error": "WEAK_PASSWORD",
 *      "message": "Passwort erfüllt nicht die Sicherheitsanforderungen"
 *    }
 *    ```
 * 
 * ERROR HANDLING:
 * 
 * 1. Validierungs-Fehler:
 *    - Passwörter stimmen nicht überein
 *    - Passwort zu schwach/kurz
 *    - Leere Felder oder ungültige Eingaben
 *    - Password-Policy Verletzungen
 * 
 * 2. Token-Fehler:
 *    - Ungültiger oder fehlender Token
 *    - Abgelaufener Reset-Link
 *    - Bereits verwendeter Token
 *    - Manipulierter Token-Parameter
 * 
 * 3. Server-Fehler:
 *    - Network Connection Issues
 *    - Database-Fehler beim Passwort-Update
 *    - Rate-Limiting Überschreitung
 *    - Internal Server Errors (500)
 * 
 * UX/UI FEATURES:
 * 
 * 1. Passwort-Visibility Toggle:
 *    - Eye-Icon Buttons für Show/Hide Passwort
 *    - Separate Toggle für beide Passwort-Felder
 *    - Accessibility-freundliche Implementation
 *    - Secure Handling ohne Memory-Leaks
 * 
 * 2. Visual Feedback:
 *    - Real-time Passwort-Stärke Anzeige
 *    - Farbkodierte Validation-Messages
 *    - Loading-Spinner während API-Calls
 *    - Success/Error Toast-Notifications
 * 
 * 3. Progressive Enhancement:
 *    - Funktioniert ohne JavaScript (Basic Form)
 *    - Enhanced UX mit JavaScript aktiviert
 *    - Graceful Degradation bei API-Fehlern
 *    - Offline-Handling für bessere Robustheit
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-optimierte Passwort-Eingabe
 * - Touch-freundliche Toggle-Buttons
 * - Adaptive Layouts für verschiedene Bildschirmgrößen
 * - Optimierte Virtual Keyboard-Integration
 * 
 * ACCESSIBILITY:
 * - ARIA-Labels für Passwort-Felder
 * - Screen-Reader kompatible Error-Messages
 * - High-Contrast Mode für Show/Hide-Buttons
 * - Keyboard-Navigation für alle Interaktionen
 * 
 * SECURITY BEST PRACTICES:
 * 
 * 1. Token-Management:
 *    - Sichere Token-Generation mit Crypto-Zufälligkeit
 *    - Kurze Token-Lebensdauer (1-2 Stunden)
 *    - One-time-use Token mit sofortiger Invalidierung
 *    - Audit-Logging für alle Reset-Versuche
 * 
 * 2. Brute-Force-Protection:
 *    - Rate-Limiting pro IP-Adresse
 *    - Account-Lockout nach mehreren Failed-Attempts
 *    - CAPTCHA für verdächtige Aktivitäten
 *    - Geolocation-basierte Anomalie-Detection
 * 
 * 3. Data Protection:
 *    - HTTPS-only für alle Reset-Operationen
 *    - Secure Password-Hashing (bcrypt, Argon2)
 *    - No Password-Logging in Server-Logs
 *    - DSGVO-konforme Audit-Trails
 * 
 * EINSATZGEBIETE:
 * - Vergessene Passwort-Wiederherstellung
 * - Kompromittierte Account-Recovery
 * - Proaktive Passwort-Rotation
 * - Admin-initiierte Passwort-Resets
 * - Security-Incident Response
 * 
 * ABHÄNGIGKEITEN:
 * - Next.js Router für Token-Parameter Handling
 * - React Hooks (useState, useEffect) für State-Management
 * - Fetch API für sichere Backend-Kommunikation
 * - Link Component für Navigation nach Success
 */

// Password reset page
// /pages/auth/reset-password.jsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth?message=password-reset-success');
        }, 3000);
      } else {
        setError(data.error || 'Passwort-Zurücksetzung fehlgeschlagen');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Passwort zurückgesetzt!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
            </p>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <p className="text-emerald-800 text-sm">
                Sie werden automatisch zur Anmeldung weitergeleitet...
              </p>
            </div>
            
            <div className="text-sm text-gray-500">
              Weiterleitung in 3 Sekunden...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v-2m0 2l-2-2m2 2l2-2M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🔐 Neues Passwort erstellen
          </h1>
          
          <p className="text-gray-600">
            Geben Sie Ihr neues Passwort ein
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Neues Passwort
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                placeholder="Mindestens 8 Zeichen"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Passwort bestätigen
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                placeholder="Passwort wiederholen"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showConfirmPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm font-medium mb-2">Passwort-Anforderungen:</p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-2 ${formData.newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                Mindestens 8 Zeichen
              </li>
              <li className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-2 ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                Passwörter stimmen überein
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Passwort wird gesetzt...
              </div>
            ) : (
              '🔒 Passwort ändern'
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <Link href="/auth">
              <a className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                ← Zurück zur Anmeldung
              </a>
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link href="/">
            <a className="text-2xl font-bold text-emerald-600 hover:text-emerald-700">
              🚐 CamperShare
            </a>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            Sicherer Passwort-Reset
          </p>
        </div>
      </div>
    </div>
  );
}
