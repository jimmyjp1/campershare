import { Container } from '@/components/Container'
import { SimpleLayout } from '@/components/SimpleLayout'

export default function Terms() {
  return (
    <SimpleLayout
      title="Allgemeine Geschäftsbedingungen"
      intro="Rechtliche Bestimmungen für die Nutzung unserer Dienstleistungen und Wohnmobilvermietung"
    >
      <Container className="mt-16 sm:mt-24">
        <div className="space-y-12">
          {/* Geltungsbereich */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              1. Geltungsbereich und Vertragspartner
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen 
                der CamperShare GmbH, Musterstraße 123, 12345 Berlin (nachfolgend "CamperShare" 
                oder "wir") und dem Kunden (nachfolgend "Mieter" oder "Sie") über die Vermietung 
                von Wohnmobilen und Campingfahrzeugen sowie die Erbringung damit verbundener 
                Dienstleistungen.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen 
                des Mieters werden nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird 
                ausdrücklich schriftlich zugestimmt.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400">
                Diese AGB gelten auch für alle künftigen Geschäftsbeziehungen, auch wenn sie 
                nicht nochmals ausdrücklich vereinbart werden.
              </p>
            </div>
          </section>

          {/* Vertragsschluss */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              2. Vertragsschluss und Buchung
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                2.1 Buchungsvorgang
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Die Buchung erfolgt über unsere Website, telefonisch oder schriftlich. Mit der 
                Buchung gibt der Mieter ein verbindliches Angebot zum Abschluss eines 
                Mietvertrages ab. CamperShare kann dieses Angebot binnen 7 Tagen annehmen.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                2.2 Buchungsbestätigung
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Der Mietvertrag kommt durch die Buchungsbestätigung von CamperShare zustande. 
                Diese erfolgt schriftlich (auch per E-Mail). In der Buchungsbestätigung sind 
                das gemietete Fahrzeug, der Mietpreis, die Mietdauer und weitere wichtige 
                Vertragsbedingungen aufgeführt.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                2.3 Voraussetzungen für die Anmietung
              </h3>
              <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Mindestalter: 25 Jahre (bei Fahrzeugen über 3,5t: 25 Jahre)</li>
                <li>Gültiger Führerschein (mindestens 2 Jahre im Besitz)</li>
                <li>Gültiger Personalausweis oder Reisepass</li>
                <li>Kreditkarte des Hauptmieters für die Kaution</li>
                <li>Nachweis der beruflichen Tätigkeit oder Einkommensnachweise</li>
              </ul>
            </div>
          </section>

          {/* Mietpreis und Zahlung */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              3. Mietpreis und Zahlungsbedingungen
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                3.1 Mietpreis
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Der Mietpreis richtet sich nach der aktuellen Preisliste und umfasst die 
                Fahrzeugmiete für den vereinbarten Zeitraum. Zusätzliche Leistungen wie 
                Zusatzausstattung, Versicherungen oder Serviceleistungen werden gesondert berechnet.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                3.2 Zahlung
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Bei Buchung ist eine Anzahlung in Höhe von 30% des Mietpreises fällig. 
                Der Restbetrag ist spätestens 30 Tage vor Mietbeginn zu zahlen. Bei Buchungen 
                weniger als 30 Tage vor Mietbeginn ist der Gesamtbetrag sofort fällig.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                3.3 Kaution
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Bei Fahrzeugübergabe ist eine Kaution zu hinterlegen:
              </p>
              <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Kompaktfahrzeuge: 1.500 €</li>
                <li>Mittelklasse-Wohnmobile: 2.500 €</li>
                <li>Premium-Wohnmobile: 5.000 €</li>
              </ul>
              
              <p className="text-zinc-600 dark:text-zinc-400">
                Die Kaution wird per Kreditkartenauthorisierung blockiert und nach ordnungsgemäßer 
                Rückgabe des Fahrzeugs binnen 14 Tagen freigegeben.
              </p>
            </div>
          </section>

          {/* Fahrzeugübergabe und -rückgabe */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              4. Fahrzeugübergabe und -rückgabe
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                4.1 Übergabe
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Die Fahrzeugübergabe erfolgt zu den vereinbarten Zeiten an unserem Standort. 
                Der Mieter ist verpflichtet, das Fahrzeug vor der Übernahme auf äußerlich 
                erkennbare Mängel zu überprüfen. Beanstandungen sind im Übergabeprotokoll 
                zu vermerken.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                4.2 Rückgabe
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Das Fahrzeug ist zum vereinbarten Termin in ordnungsgemäßem Zustand zurückzugeben. 
                Die Rückgabe erfolgt zu den Geschäftszeiten an unserem Standort. Das Fahrzeug 
                muss in gereinigtem Zustand (innen und außen) und mit vollem Tank zurückgegeben werden.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                4.3 Verspätete Rückgabe
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Bei verspäteter Rückgabe wird für jeden angefangenen Tag der doppelte Tagestarif 
                berechnet. Dies gilt als Vertragsstrafe, weitergehende Schadensersatzansprüche 
                bleiben vorbehalten.
              </p>
            </div>
          </section>

          {/* Nutzung des Fahrzeugs */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              5. Nutzung des Fahrzeugs und Pflichten des Mieters
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                5.1 Bestimmungsgemäße Nutzung
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Das Fahrzeug darf nur zu den vereinbarten Zwecken und nur von Personen geführt 
                werden, die im Mietvertrag als Fahrer eingetragen und berechtigt sind.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                5.2 Verbotene Nutzung
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Folgende Nutzungen sind untersagt:
              </p>
              <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Teilnahme an Motorsportveranstaltungen</li>
                <li>Gewerbliche Güterbeförderung</li>
                <li>Fahrten in nicht EU-Länder ohne Genehmigung</li>
                <li>Überlassung an Dritte ohne schriftliche Zustimmung</li>
                <li>Nutzung unter Alkohol-, Drogen- oder Medikamenteneinfluss</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                5.3 Sorgfaltspflichten
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Der Mieter hat das Fahrzeug pfleglich zu behandeln, regelmäßige Kontrollen 
                (Öl, Wasser, Reifen) durchzuführen und bei Problemen unverzüglich CamperShare 
                zu benachrichtigen.
              </p>
            </div>
          </section>

          {/* Versicherung und Haftung */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              6. Versicherung und Haftung
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                6.1 Versicherungsschutz
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Alle Fahrzeuge sind haftpflicht- und vollkaskoversichert. Die Selbstbeteiligung 
                beträgt je nach Fahrzeugkategorie zwischen 1.000 € und 2.500 €. Gegen Aufpreis 
                kann die Selbstbeteiligung reduziert werden.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                6.2 Haftungsausschluss
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                CamperShare haftet nicht für:
              </p>
              <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Schäden durch unsachgemäße Bedienung</li>
                <li>Diebstahl von persönlichen Gegenständen</li>
                <li>Schäden durch höhere Gewalt</li>
                <li>Folgeschäden durch Fahrzeugausfälle</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                6.3 Schadensfall
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Bei Unfällen oder Schäden ist umgehend die Polizei zu benachrichtigen und 
                CamperShare zu informieren. Der Mieter ist zur Mitwirkung bei der Schadenregulierung 
                verpflichtet.
              </p>
            </div>
          </section>

          {/* Stornierung */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              7. Stornierung und Rücktritt
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                7.1 Stornierung durch den Mieter
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Der Mieter kann den Vertrag jederzeit vor Mietbeginn stornieren. 
                Es gelten folgende Stornogebühren:
              </p>
              <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Bis 60 Tage vor Mietbeginn: kostenfrei</li>
                <li>59-30 Tage vor Mietbeginn: 25% des Mietpreises</li>
                <li>29-14 Tage vor Mietbeginn: 50% des Mietpreises</li>
                <li>13-7 Tage vor Mietbeginn: 75% des Mietpreises</li>
                <li>Weniger als 7 Tage vor Mietbeginn: 100% des Mietpreises</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                7.2 Stornierung durch CamperShare
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                CamperShare kann den Vertrag bei wichtigem Grund stornieren, insbesondere bei 
                Fahrzeugdefekt, höherer Gewalt oder wenn der Mieter die Voraussetzungen für 
                die Anmietung nicht erfüllt.
              </p>
            </div>
          </section>

          {/* Datenschutz */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              8. Datenschutz
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                CamperShare erhebt und verarbeitet personenbezogene Daten des Mieters zur 
                Vertragserfüllung und -abwicklung. Weitere Informationen zum Datenschutz 
                finden Sie in unserer Datenschutzerklärung.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400">
                Der Mieter willigt ein, dass seine Daten für die Zwecke der Vertragsdurchführung, 
                Schadenabwicklung und berechtigte Geschäftsinteressen verarbeitet werden.
              </p>
            </div>
          </section>

          {/* Schlussbestimmungen */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              9. Schlussbestimmungen
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                9.1 Gerichtsstand und anwendbares Recht
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Für alle Streitigkeiten aus diesem Vertragsverhältnis ist Berlin Gerichtsstand. 
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                9.2 Salvatorische Klausel
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt 
                dies die Wirksamkeit der übrigen Bestimmungen nicht. Die unwirksame Bestimmung 
                ist durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck der 
                unwirksamen Bestimmung am nächsten kommt.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                9.3 Änderungen der AGB
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                CamperShare behält sich vor, diese AGB zu ändern. Änderungen werden dem Mieter 
                mindestens 30 Tage vor Inkrafttreten schriftlich mitgeteilt. Widerspricht der 
                Mieter nicht innerhalb von 30 Tagen, gelten die Änderungen als genehmigt.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                9.4 Verbraucherschlichtung
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                CamperShare nimmt nicht an einem Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teil und ist hierzu auch nicht verpflichtet.
              </p>
            </div>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              10. Kontakt
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Bei Fragen zu diesen AGB oder unserem Service erreichen Sie uns unter:
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                <strong>CamperShare GmbH</strong><br />
                Musterstraße 123<br />
                12345 Berlin<br />
                Deutschland
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400">
                Telefon: +49 (0) 123 456 789<br />
                E-Mail: info@campershare.com<br />
                Website: www.campershare.com
              </p>
            </div>
          </section>

          {/* Letzte Aktualisierung */}
          <section>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Stand der AGB:</strong> {new Date().toLocaleDateString('de-DE')}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                Diese Allgemeinen Geschäftsbedingungen sind ab dem oben genannten Datum gültig 
                und ersetzen alle vorherigen Versionen.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </SimpleLayout>
  )
}
