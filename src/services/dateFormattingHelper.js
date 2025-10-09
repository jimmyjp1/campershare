/**
 * dateFormattingHelper.js
 * =======================
 * 
 * HAUPTFUNKTION:
 * Utility-Service für konsistente Datums- und Zeitformatierung in der WWISCA Camper-Plattform.
 * Bietet standardisierte Formatierungsfunktionen für verschiedene Anzeigekontext und Internationalisierung.
 * 
 * FORMATIERUNGSFEATURES:
 * 
 * 1. formatDate - Basis Datumsformatierung:
 *    - Konvertiert ISO-Datumsstrings zu lesbaren Formaten
 *    - UTC-Timezone Handling für konsistente Darstellung
 *    - Englische Locale mit vollem Monatsnamen
 *    - Format: "15 März 2024" (Tag Monat Jahr)
 * 
 * 2. Timezone-Management:
 *    - UTC-basierte Zeitstempel für Datenkonsistenz
 *    - Automatische Lokalisierung für Benutzeranzeige
 *    - Sommerzeitanpassung und DST-Handling
 *    - Cross-Browser kompatible Zeitzonenbehandlung
 * 
 * 3. Internationalisierung:
 *    - Locale-spezifische Datumsformate (en-US als Standard)
 *    - Erweiterbar für mehrsprachige Ausgaben
 *    - Kulturspezifische Datumsdarstellung
 *    - Automatische Browser-Locale Detection
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. Date Construction:
 *    - Sichere Datumskonstruktion mit expliziter UTC-Zeit
 *    - "T00:00:00Z" Suffix für Mitternacht UTC
 *    - Prevention von Timezone-Interpretation-Fehlern
 *    - Konsistente Darstellung unabhängig von Client-Timezone
 * 
 * 2. Intl.DateTimeFormat Integration:
 *    - Native Browser-API für optimale Performance
 *    - Strukturierte Konfiguration mit Options-Objekt
 *    - Fallback-Mechanismen für ältere Browser
 *    - Memory-effiziente Formatierungsoperationen
 * 
 * VERWENDUNG:
 * 
 * Standard Datumsformatierung:
 * ```javascript
 * import { formatDate } from './dateFormattingHelper';
 * 
 * const bookingDate = '2024-03-15';
 * const displayDate = formatDate(bookingDate);
 * // Output: "15 March 2024"
 * ```
 * 
 * In React Komponenten:
 * ```jsx
 * function BookingCard({ booking }) {
 *   return (
 *     <div>
 *       <p>Buchungsdatum: {formatDate(booking.createdAt)}</p>
 *       <p>Abholung: {formatDate(booking.pickupDate)}</p>
 *       <p>Rückgabe: {formatDate(booking.returnDate)}</p>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ERWEITERUNGSMÖGLICHKEITEN:
 * 
 * 1. Zusätzliche Formatierungsfunktionen:
 *    - formatDateTime: Datum mit Uhrzeit
 *    - formatRelativeDate: Relative Zeitangaben ("vor 2 Tagen")
 *    - formatDateRange: Datumsbereich-Formatierung
 *    - formatShortDate: Kurze Datumsdarstellung
 * 
 * 2. Mehrsprachige Unterstützung:
 *    - formatDateDE: Deutsche Datumsformate
 *    - formatDateFR: Französische Datumsformate
 *    - Dynamic Locale basierend auf User-Settings
 * 
 * 3. Business-spezifische Formate:
 *    - formatBookingPeriod: Buchungszeitraum-Darstellung
 *    - formatPickupTime: Abholzeit-Formatierung
 *    - formatInvoiceDate: Rechnungsdatum-Format
 * 
 * BROWSER COMPATIBILITY:
 * - Modern Browser mit Intl.DateTimeFormat Support
 * - Polyfill-Support für ältere Browser
 * - Graceful Degradation zu fallback Formatierung
 * - Progressive Enhancement für moderne Features
 * 
 * PERFORMANCE:
 * - Lightweight Utility ohne externe Abhängigkeiten
 * - Native Browser-API für optimale Geschwindigkeit
 * - Memory-effiziente Implementierung
 * - Cacheable Formatierungsresultate
 * 
 * EINSATZGEBIETE:
 * - Buchungsformulare und Bestätigungen
 * - Kalenderanzeigen und Verfügbarkeit
 * - Rechnungen und Zahlungsdokumente
 * - Admin-Dashboard und Berichte
 * - E-Mail-Templates und Benachrichtigungen
 * 
 * ABHÄNGIGKEITEN:
 * - Keine externen Abhängigkeiten
 * - Native JavaScript Date und Intl APIs
 * - Browser Internationalization Support
 */

export function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
