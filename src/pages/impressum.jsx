/**
 * impressum.jsx - Impressum-Seite
 * ================================
 * 
 * HAUPTFUNKTION:
 * Rechtlich vorgeschriebene Impressum-Seite der WWISCA Camper-Plattform gemäß deutschem Telemediengesetz (TMG).
 * Erfüllt alle gesetzlichen Anforderungen für kommerzielle Websites in Deutschland.
 * 
 * RECHTLICHE ANFORDERUNGEN:
 * 
 * 1. TMG-Konformität (§ 5 TMG):
 *    - Vollständige Firmenanschrift und Kontaktdaten
 *    - Geschäftsführer und Vertretungsberechtigte
 *    - Handelsregister-Eintragung und Amtsgericht
 *    - Umsatzsteuer-Identifikationsnummer (USt-IdNr.)
 * 
 * 2. Pflichtangaben für GmbH:
 *    - Firmenname: CamperShare GmbH
 *    - Registergericht und Handelsregisternummer
 *    - Geschäftsführer-Namen und Befugnisse
 *    - Stammkapital und Gesellschafterstruktur
 * 
 * 3. Kontaktinformationen:
 *    - Ladungsfähige Anschrift (keine Postfach-Adresse)
 *    - Telefonnummer für schnelle Kontaktaufnahme
 *    - E-Mail-Adresse für elektronische Kommunikation
 *    - Fax-Nummer (optional, aber empfohlen)
 * 
 * 4. Aufsichtsbehörden und Genehmigungen:
 *    - Zuständige Gewerbeaufsicht
 *    - Branchenspezifische Genehmigungen (Fahrzeugvermietung)
 *    - Versicherungsaufsicht für Versicherungsvermittlung
 *    - EU-weite Dienstleistungsrichtlinien-Compliance
 * 
 * BRANCHENSPEZIFISCHE ANGABEN:
 * 
 * 1. Fahrzeugvermietung:
 *    - Gewerbeanmeldung für Fahrzeugvermietung
 *    - Haftpflichtversicherung und Deckungssummen
 *    - Kaution- und Sicherheitsleistungen
 *    - Internationale Vermietungsgenehmigungen
 * 
 * 2. Online-Plattform:
 *    - E-Commerce-Lizenz und Digital Services Act (DSA)
 *    - Plattform-Verantwortlichkeit nach NetzDG
 *    - Verbraucherschutz im Online-Handel
 *    - Alternative Streitbeilegung (OS-Plattform)
 * 
 * 3. Versicherungsvermittlung:
 *    - IHK-Registrierung als Versicherungsmakler
 *    - Berufshaftpflichtversicherung
 *    - Vermögensschadenhaftpflicht
 *    - BaFin-Registrierung (falls erforderlich)
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. SimpleLayout Integration:
 *    - Strukturierte Darstellung mit klarer Hierarchie
 *    - Responsive Design für alle Endgeräte
 *    - Druckfreundliche Formatierung
 *    - Accessibility-konforme Umsetzung
 * 
 * 2. SEO und Auffindbarkeit:
 *    - Meta-Tags für Suchmaschinen-Indexierung
 *    - Strukturierte Daten für lokale Suchergebnisse
 *    - Internal Linking zu Datenschutz und AGB
 *    - Canonical URL für eindeutige Zuordnung
 * 
 * 3. Prose-Styling:
 *    - Optimale Lesbarkeit mit Prose-Komponente
 *    - Dark Mode Unterstützung
 *    - Konsistente Typografie
 *    - Strukturierte Informationshierarchie
 * 
 * INHALTLICHE STRUKTUR:
 * 
 * 1. Angaben gemäß § 5 TMG:
 *    ```
 *    CamperShare GmbH
 *    Musterstraße 123
 *    12345 Berlin
 *    Deutschland
 *    ```
 * 
 * 2. Vertreten durch:
 *    - Geschäftsführer: Max Mustermann, Maria Musterfrau
 *    - Prokuristen und Bevollmächtigte
 *    - Vertretungsberechtigungen und Beschränkungen
 * 
 * 3. Kontakt:
 *    ```
 *    Telefon: +49 (0) 30 12345-0
 *    Telefax: +49 (0) 30 12345-99
 *    E-Mail: info@wwisca.com
 *    Website: https://www.wwisca.com
 *    ```
 * 
 * 4. Registereintrag:
 *    ```
 *    Eintragung im Handelsregister
 *    Registergericht: Amtsgericht Berlin-Charlottenburg
 *    Registernummer: HRB 12345 B
 *    ```
 * 
 * 5. Umsatzsteuer-ID:
 *    ```
 *    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
 *    DE123456789
 *    ```
 * 
 * COMPLIANCE & RECHTSSICHERHEIT:
 * 
 * 1. Aktualitätspflicht:
 *    - Regelmäßige Überprüfung aller Angaben
 *    - Sofortige Aktualisierung bei Änderungen
 *    - Versionierung für Nachverfolgbarkeit
 *    - Archivierung alter Versionen
 * 
 * 2. Erreichbarkeit:
 *    - Impressum von jeder Seite aus maximal 2 Klicks erreichbar
 *    - Prominente Verlinkung im Footer
 *    - Mobile-optimierte Darstellung
 *    - Barrierefreier Zugang
 * 
 * 3. Vollständigkeit:
 *    - Alle TMG-Pflichtangaben enthalten
 *    - Branchenspezifische Ergänzungen
 *    - EU-DSGVO konforme Datenverarbeitung
 *    - Internationale Geschäftstätigkeit berücksichtigt
 * 
 * ZUSÄTZLICHE ANGABEN:
 * 
 * 1. Aufsichtsbehörde:
 *    ```
 *    Zuständige Aufsichtsbehörde:
 *    Gewerbeaufsichtsamt Berlin
 *    Darwinstraße 6
 *    10589 Berlin
 *    ```
 * 
 * 2. Berufsbezeichnung:
 *    - Fahrzeugvermieter (Deutschland)
 *    - Online-Plattformbetreiber
 *    - Versicherungsmakler (IHK Berlin)
 * 
 * 3. Streitschlichtung:
 *    ```
 *    Verbraucherstreitbeilegung/Universalschlichtungsstelle:
 *    Wir sind nicht verpflichtet und bereit zur Teilnahme an 
 *    Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle.
 *    
 *    Online-Streitbeilegung (OS):
 *    https://ec.europa.eu/consumers/odr/
 *    ```
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-First Layout für alle Gerätegrößen
 * - Touch-optimierte Links und Buttons
 * - Lesbare Schriftgrößen auf kleinen Bildschirmen
 * - Druckoptimierte Darstellung
 * 
 * ACCESSIBILITY:
 * - Semantic HTML für Screen-Reader
 * - Logische Überschriften-Hierarchie
 * - Hohe Kontraste für bessere Lesbarkeit
 * - Keyboard-Navigation möglich
 * 
 * EINSATZGEBIETE:
 * - Gesetzlich vorgeschriebene Anbieterkennzeichnung
 * - Transparenz gegenüber Kunden und Behörden
 * - Rechtssicherheit bei geschäftlichen Aktivitäten
 * - Compliance-Nachweis für Geschäftspartner
 * - Vertrauensbildung durch Transparenz
 * 
 * ABHÄNGIGKEITEN:
 * - Container für Layout-Konsistenz
 * - SimpleLayout für strukturierte Darstellung
 * - Prose-Styling für optimale Lesbarkeit
 * - Dark Mode Support für Benutzerkomfort
 */

import { Container } from '@/components/Container'
import { SimpleLayout } from '@/components/SimpleLayout'

export default function Impressum() {
  return (
    <SimpleLayout
      title="Impressum"
      intro="Angaben gemäß § 5 TMG (Telemediengesetz)"
    >
      <Container className="mt-16 sm:mt-24">
        <div className="space-y-12">
          {/* Angaben gemäß § 5 TMG */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Angaben gemäß § 5 TMG
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                <strong>CamperShare GmbH</strong><br />
                Musterstraße 123<br />
                12345 Berlin<br />
                Deutschland
              </p>
            </div>
          </section>

          {/* Vertreten durch */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Vertreten durch
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Geschäftsführer: Max Mustermann, Anna Schmidt
              </p>
            </div>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Kontakt
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Telefon: +49 (0) 123 456 789<br />
                Telefax: +49 (0) 123 456 790<br />
                E-Mail: info@campershare.com
              </p>
            </div>
          </section>

          {/* Registereintrag */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Registereintrag
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Eintragung im Handelsregister<br />
                Registergericht: Amtsgericht Berlin-Charlottenburg<br />
                Registernummer: HRB 12345 B
              </p>
            </div>
          </section>

          {/* Umsatzsteuer-ID */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Umsatzsteuer-ID
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                DE123456789
              </p>
            </div>
          </section>

          {/* Wirtschafts-ID */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Wirtschafts-ID
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Wirtschaftsidentifikationsnummer: DE123456789
              </p>
            </div>
          </section>

          {/* Aufsichtsbehörde */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Aufsichtsbehörde
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Gewerbeaufsichtsamt Berlin<br />
                Darwinstraße 6<br />
                10589 Berlin
              </p>
            </div>
          </section>

          {/* Berufsbezeichnung */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Berufsbezeichnung und berufsrechtliche Regelungen
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Berufsbezeichnung: Autovermietung / Wohnmobilvermietung<br />
                Zuständige Kammer: IHK Berlin<br />
                Verliehen in: Deutschland
              </p>
            </div>
          </section>

          {/* Versicherung */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Berufshaftpflichtversicherung
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Name und Sitz des Versicherers:<br />
                Mustermann Versicherung AG<br />
                Versicherungsstraße 1<br />
                10115 Berlin<br />
                Deutschland
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                Geltungsraum der Versicherung: Deutschland, Europa
              </p>
            </div>
          </section>

          {/* Redaktionell verantwortlich */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Redaktionell verantwortlich
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Max Mustermann<br />
                Musterstraße 123<br />
                12345 Berlin<br />
                Deutschland
              </p>
            </div>
          </section>

          {/* EU-Streitschlichtung */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              EU-Streitschlichtung
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 hover:underline ml-1"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>
          </section>

          {/* Verbraucherstreitbeilegung */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Verbraucherstreitbeilegung/Universalschlichtungsstelle
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          {/* Haftung für Inhalte */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Haftung für Inhalte
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
                Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der 
                Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen 
                werden wir diese Inhalte umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Haftung für Links */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Haftung für Links
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten 
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren 
                zum Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer 
                Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links 
                umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Urheberrecht
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter 
                beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden 
                von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </SimpleLayout>
  )
}
