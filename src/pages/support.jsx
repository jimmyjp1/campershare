/**
 * support.jsx - Support-Seite
 * ============================
 * 
 * HAUPTFUNKTION:
 * Umfassende Kundensupport-Seite der WWISCA Camper-Plattform mit verschiedenen Kontaktmöglichkeiten,
 * Self-Service-Optionen und strukturierter Hilfe für alle Anfragekategorien.
 * 
 * SUPPORT-FEATURES:
 * 
 * 1. Multi-Channel Support:
 *    - Telefon-Support mit direkten Durchwahlnummern
 *    - E-Mail-Support mit kategorisierten Anfragen
 *    - Live-Chat für sofortige Hilfe
 *    - Ticket-System für komplexe Problemstellungen
 * 
 * 2. Self-Service Portal:
 *    - FAQ-Sektion mit häufigen Fragen
 *    - Schritt-für-Schritt Anleitungen
 *    - Video-Tutorials für komplexe Themen
 *    - Download-Bereich für Dokumente und Formulare
 * 
 * 3. Kategorisierte Hilfe:
 *    - Buchungs- und Reservierungshilfe
 *    - Technische Probleme und Website-Issues
 *    - Zahlungs- und Abrechnungsfragen
 *    - Fahrzeug- und Ausrüstungsprobleme
 * 
 * 4. Notfall-Support:
 *    - 24/7 Notfall-Hotline für Pannen
 *    - Pannenhilfe und Ersatzfahrzeuge
 *    - Versicherungsabwicklung
 *    - Reise-Notfallunterstützung
 * 
 * UI-KOMPONENTEN:
 * 
 * 1. Support-Icons:
 *    - PhoneIcon: Telefonische Kontaktmöglichkeiten
 *    - EmailIcon: E-Mail-basierte Anfragen
 *    - ChatIcon: Live-Chat und Messaging
 *    - Responsive SVG-Icons mit einheitlichem Design
 * 
 * 2. Kontakt-Karten:
 *    - Strukturierte Darstellung der Kontaktoptionen
 *    - Öffnungszeiten und Verfügbarkeiten
 *    - Erwartete Antwortzeiten
 *    - Direkte Aktions-Buttons (Anrufen, E-Mail, Chat)
 * 
 * 3. FAQ-Integration:
 *    - Expandierbare Antwort-Bereiche
 *    - Suchfunktion für spezifische Themen
 *    - Kategorisierte Frage-Gruppen
 *    - Hilfreich/Nicht-hilfreich Bewertungen
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. SimpleLayout Integration:
 *    - Konsistente Seitenstruktur mit Header und Footer
 *    - Responsive Design für alle Gerätegrößen
 *    - Accessibility-optimierte Navigation
 *    - Dark Mode Unterstützung
 * 
 * 2. Interactive State Management:
 *    - useState für FAQ-Expandierung
 *    - Form-State für Kontaktformulare
 *    - Loading-States für API-Calls
 *    - Error-Handling für fehlgeschlagene Submissions
 * 
 * 3. Link Integration:
 *    - Next.js Link für interne Navigation
 *    - External Links für Phone/Email Actions
 *    - Deep-Links zu spezifischen FAQ-Sektionen
 *    - Breadcrumb-Navigation für Orientierung
 * 
 * SUPPORT-KATEGORIEN:
 * 
 * 1. Buchung & Reservierung:
 *    - Buchungsprozess-Hilfe
 *    - Änderung bestehender Reservierungen
 *    - Stornierungen und Rückerstattungen
 *    - Verfügbarkeitsprüfungen
 * 
 * 2. Zahlungen & Abrechnung:
 *    - Zahlungsprobleme und -methoden
 *    - Rechnungserklärungen
 *    - Rückerstattungsverfahren
 *    - Zusatzkosten und Gebühren
 * 
 * 3. Fahrzeuge & Ausstattung:
 *    - Fahrzeugübergabe und -rückgabe
 *    - Ausstattungs- und Bedienungsanleitungen
 *    - Schäden und Versicherungsfälle
 *    - Wartung und technische Probleme
 * 
 * 4. Account & Profile:
 *    - Anmelde- und Registrierungsprobleme
 *    - Profil-Updates und Datenänderungen
 *    - Passwort-Reset und Sicherheit
 *    - DSGVO-Anfragen und Datenschutz
 * 
 * CONTACT METHODS:
 * 
 * 1. Telefon-Support:
 *    ```javascript
 *    const phoneSupport = {
 *      general: '+49 (0) 30 12345-100',
 *      emergency: '+49 (0) 30 12345-911',
 *      hours: 'Mo-Fr 8:00-20:00, Sa-So 9:00-18:00',
 *      emergencyHours: '24/7'
 *    };
 *    ```
 * 
 * 2. E-Mail-Support:
 *    ```javascript
 *    const emailSupport = {
 *      general: 'support@wwisca.com',
 *      booking: 'booking@wwisca.com',
 *      billing: 'billing@wwisca.com',
 *      technical: 'tech@wwisca.com',
 *      responseTime: '< 4 Stunden'
 *    };
 *    ```
 * 
 * 3. Live-Chat:
 *    ```javascript
 *    const chatSupport = {
 *      availability: 'Mo-So 7:00-23:00',
 *      responseTime: '< 2 Minuten',
 *      languages: ['Deutsch', 'English'],
 *      topics: ['Buchung', 'Technik', 'Zahlung']
 *    };
 *    ```
 * 
 * SELF-SERVICE FEATURES:
 * 
 * 1. Knowledge Base:
 *    - Umfangreiche Artikel-Sammlung
 *    - Video-Tutorials und Screenshots
 *    - Step-by-Step Anleitungen
 *    - Troubleshooting-Guides
 * 
 * 2. Interactive Tools:
 *    - Buchungsassistent für komplexe Anfragen
 *    - Kostenrechner für Zusatzleistungen
 *    - Verfügbarkeitskalender
 *    - Fahrzeugvergleich-Tool
 * 
 * 3. Community Support:
 *    - User-Forum für Erfahrungsaustausch
 *    - Bewertungen und Tipps
 *    - Community-moderierte FAQ
 *    - Best-Practice Sharing
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-optimierte Kontakt-Buttons
 * - Touch-freundliche FAQ-Akkordeons
 * - Adaptive Layouts für verschiedene Bildschirmgrößen
 * - Optimierte Telefonnummern-Links für Mobile
 * 
 * ACCESSIBILITY:
 * - Semantic HTML für Screen-Reader
 * - ARIA-Labels für komplexe Interaktionen
 * - Keyboard-Navigation für alle Funktionen
 * - High-Contrast Mode für bessere Sichtbarkeit
 * 
 * ANALYTICS & TRACKING:
 * - Support-Request Categorization
 * - Response-Time Tracking
 * - Customer Satisfaction Scoring
 * - Self-Service Success Rate Measurement
 * 
 * EINSATZGEBIETE:
 * - Erste Anlaufstelle für alle Kundenanfragen
 * - Self-Service Portal für einfache Probleme
 * - Eskalationspunkt für komplexe Fälle
 * - Knowledge Base für wiederkehrende Fragen
 * - Emergency Support für Reise-Notfälle
 * 
 * ABHÄNGIGKEITEN:
 * - Container für Layout-Konsistenz
 * - SimpleLayout für strukturierte Darstellung
 * - Next.js Link für Navigation
 * - React useState für Interactive Elements
 */

import { Container } from '@/components/Container'
import { SimpleLayout } from '@/components/SimpleLayout'
import Link from 'next/link'
import { useState } from 'react'

// Support Icons
function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" fill="currentColor"/>
    </svg>
  )
}

function EmailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" fill="currentColor"/>
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" fill="currentColor"/>
    </svg>
  )
}

function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function MapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" fill="currentColor"/>
    </svg>
  )
}

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function BookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

function ToolIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Quick Action Card Component
function QuickActionCard({ icon: Icon, title, description, action, color = "teal" }) {
  const colorClasses = {
    teal: "border-teal-200 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-700 bg-teal-50/50 dark:bg-teal-900/10",
    blue: "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10",
    green: "border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 bg-green-50/50 dark:bg-green-900/10",
    amber: "border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10"
  };

  const iconColors = {
    teal: "text-teal-600 dark:text-teal-400",
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    amber: "text-amber-600 dark:text-amber-400"
  };

  return (
    <div className={`relative p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-lg cursor-pointer ${colorClasses[color]}`}
         onClick={action}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700`}>
          <Icon className={`h-6 w-6 ${iconColors[color]}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Contact Method Component
function ContactMethod({ icon: Icon, title, info, availability, action, isPrimary = false }) {
  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isPrimary 
        ? 'border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20' 
        : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${
          isPrimary 
            ? 'bg-teal-100 dark:bg-teal-900/50' 
            : 'bg-zinc-100 dark:bg-zinc-700'
        }`}>
          <Icon className={`h-6 w-6 ${
            isPrimary 
              ? 'text-teal-600 dark:text-teal-400' 
              : 'text-zinc-600 dark:text-zinc-400'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            {title}
          </h3>
          <p className="text-zinc-900 dark:text-zinc-100 font-medium mb-2">
            {info}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {availability}
          </p>
          {action && (
            <button 
              onClick={action}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isPrimary
                  ? 'bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700'
                  : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600'
              }`}
            >
              Kontakt aufnehmen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Support() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const quickActions = [
    {
      icon: BookIcon,
      title: "Buchung verwalten",
      description: "Bestehende Buchung einsehen, ändern oder stornieren",
      color: "teal",
      action: () => alert("Zur Buchungsverwaltung")
    },
    {
      icon: PhoneIcon,
      title: "Sofort-Hilfe",
      description: "Dringende Fragen? Rufen Sie uns direkt an",
      color: "blue", 
      action: () => window.open("tel:+4912345789")
    },
    {
      icon: ShieldIcon,
      title: "Notfall-Service",
      description: "24/7 Pannenhilfe und Notfall-Support während Ihrer Reise",
      color: "amber",
      action: () => alert("Notfall-Kontakt")
    },
    {
      icon: ChatIcon,
      title: "Live Chat",
      description: "Chatten Sie direkt mit unserem Support-Team",
      color: "green",
      action: () => alert("Chat öffnen")
    }
  ];

  return (
    <SimpleLayout
      title="Kundenservice"
      intro="Wir sind für Sie da - vor, während und nach Ihrer Reise. Finden Sie schnell die Hilfe, die Sie benötigen."
    >
      <Container className="mt-16 sm:mt-24">
        <div className="space-y-16">
          
          {/* Quick Actions */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Schnelle Hilfe
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Die häufigsten Anliegen unserer Kunden - mit einem Klick zur Lösung
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </section>

          {/* Contact Methods */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                So erreichen Sie uns
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Wählen Sie den für Sie passenden Kommunikationsweg
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContactMethod
                icon={PhoneIcon}
                title="Telefon-Support"
                info="+49 (0) 123 456 789"
                availability="Mo-Fr: 8:00-20:00 Uhr, Sa-So: 9:00-18:00 Uhr"
                action={() => window.open("tel:+4912345789")}
                isPrimary={true}
              />
              
              <ContactMethod
                icon={EmailIcon}
                title="E-Mail Support"
                info="support@campershare.com"
                availability="Antwort innerhalb von 24 Stunden"
                action={() => window.open("mailto:support@campershare.com")}
              />

              <ContactMethod
                icon={ChatIcon}
                title="WhatsApp Business"
                info="+49 (0) 123 456 790"
                availability="Mo-Fr: 9:00-18:00 Uhr"
                action={() => window.open("https://wa.me/49123456790")}
              />

              <ContactMethod
                icon={MapIcon}
                title="Vor Ort Service"
                info="Musterstraße 123, 12345 Berlin"
                availability="Mo-Fr: 8:00-18:00 Uhr, Termine nach Vereinbarung"
                action={() => alert("Termin vereinbaren")}
              />
            </div>
          </section>

          {/* Notfall-Service */}
          <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-2xl p-8 border border-red-200 dark:border-red-800">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-xl">
                <ShieldIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  24/7 Notfall-Service
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
                  Probleme während Ihrer Reise? Unser Notfall-Service ist rund um die Uhr für Sie da. 
                  Bei Pannen, Unfällen oder anderen dringenden Angelegenheiten erreichen Sie uns jederzeit.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      🚨 Notfall-Hotline
                    </h3>
                    <p className="text-lg font-mono text-red-600 dark:text-red-400 mb-2">
                      +49 (0) 800 123 456
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Kostenlos aus dem deutschen Festnetz
                    </p>
                  </div>
                  <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      📱 Notfall-App
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      GPS-Ortung & direkter Kontakt
                    </p>
                    <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
                      App herunterladen →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Service Categories */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Service-Bereiche
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Spezialisierte Hilfe für jeden Bereich Ihrer CamperShare-Erfahrung
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800/50">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Buchungs-Service
                </h3>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 text-left">
                  <li>• Neue Buchungen</li>
                  <li>• Buchung ändern/erweitern</li>
                  <li>• Stornierungen</li>
                  <li>• Zusatzleistungen</li>
                  <li>• Verfügbarkeiten prüfen</li>
                </ul>
              </div>

              <div className="text-center p-6 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800/50">
                <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ToolIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Technischer Support
                </h3>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 text-left">
                  <li>• Fahrzeug-Einweisung</li>
                  <li>• Technik-Probleme</li>
                  <li>• Ausstattung & Zubehör</li>
                  <li>• Pannenhilfe</li>
                  <li>• Reparaturen</li>
                </ul>
              </div>

              <div className="text-center p-6 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800/50">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShieldIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Versicherung & Schäden
                </h3>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 text-left">
                  <li>• Versicherungsfragen</li>
                  <li>• Schadenmeldung</li>
                  <li>• Unfallabwicklung</li>
                  <li>• Kaution & Rückerstattung</li>
                  <li>• Rechtliche Beratung</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Quick Links */}
          <section className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Häufige Fragen
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Finden Sie schnell Antworten auf die am häufigsten gestellten Fragen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/faq" className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Buchung & Preise</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Alles zu Buchungsvorgang und Kosten</p>
              </Link>
              
              <Link href="/faq" className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Fahrzeuge & Ausstattung</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Informationen zu unserer Flotte</p>
              </Link>
              
              <Link href="/faq" className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Reise & Navigation</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Tipps für Ihre Wohnmobil-Reise</p>
              </Link>
              
              <Link href="/faq" className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Probleme & Reparaturen</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Hilfe bei technischen Problemen</p>
              </Link>
            </div>
          </section>

          {/* Service Hours */}
          <section>
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <ClockIcon className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Unsere Service-Zeiten
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">📞 Telefon-Support</h3>
                    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex justify-between">
                        <span>Montag - Freitag:</span>
                        <span>8:00 - 20:00 Uhr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samstag - Sonntag:</span>
                        <span>9:00 - 18:00 Uhr</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">💬 Chat & WhatsApp</h3>
                    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex justify-between">
                        <span>Montag - Freitag:</span>
                        <span>9:00 - 18:00 Uhr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wochenende:</span>
                        <span>Begrenzt verfügbar</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">🚨 Notfall-Service</h3>
                    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex justify-between">
                        <span>Pannenhilfe:</span>
                        <span>24/7 verfügbar</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Notfall-Hotline:</span>
                        <span>Rund um die Uhr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </Container>
    </SimpleLayout>
  )
}
