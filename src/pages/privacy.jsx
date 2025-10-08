import { Container } from '@/components/Container'
import { SimpleLayout } from '@/components/SimpleLayout'

export default function Privacy() {
  return (
    <SimpleLayout
      title="Datenschutzerklärung"
      intro="Informationen zum Datenschutz und zur Verarbeitung Ihrer personenbezogenen Daten"
    >
      <Container className="mt-16 sm:mt-24">
        <div className="space-y-12">
          {/* Allgemeine Hinweise */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              1. Datenschutz auf einen Blick
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Allgemeine Hinweise
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. 
                Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem 
                Text aufgeführten Datenschutzerklärung.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Datenerfassung auf dieser Website
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen 
                Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                <strong>Wie erfassen wir Ihre Daten?</strong><br />
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann 
                es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten 
                werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere 
                IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, 
                Betriebssystem oder Uhrzeit des Seitenaufrufs).
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                <strong>Wofür nutzen wir Ihre Daten?</strong><br />
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu 
                gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400">
                <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br />
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und 
                Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein 
                Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
              </p>
            </div>
          </section>

          {/* Hosting und Content Delivery Networks */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              2. Hosting und Content Delivery Networks (CDN)
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Externes Hosting
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die 
                personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den 
                Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, 
                Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, 
                Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, 
                handeln.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren 
                potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse 
                einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots 
                durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400">
                Unser Hoster wird Ihre Daten nur insoweit verarbeiten, wie dies zur Erfüllung 
                seiner Leistungspflichten erforderlich ist und unsere Weisungen in Bezug auf 
                diese Daten befolgen.
              </p>
            </div>
          </section>

          {/* Allgemeine Hinweise und Pflichtinformationen */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              3. Allgemeine Hinweise und Pflichtinformationen
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Datenschutz
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. 
                Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der 
                gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. 
                Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden 
                können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben 
                und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Hinweis zur verantwortlichen Stelle
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                <strong>CamperShare GmbH</strong><br />
                Musterstraße 123<br />
                12345 Berlin<br />
                Deutschland
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Telefon: +49 (0) 123 456 789<br />
                E-Mail: info@campershare.com
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder 
                gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen 
                Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Speicherdauer
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt 
                wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die 
                Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen 
                oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, 
                sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer 
                personenbezogenen Daten haben.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Widerruf Ihrer Einwilligung zur Datenverarbeitung
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung 
                möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die 
                Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf 
                unberührt.
              </p>
            </div>
          </section>

          {/* Datenerfassung auf dieser Website */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              4. Datenerfassung auf dieser Website
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Cookies
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine 
                Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder 
                vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft 
                (dauerhafte Cookies) auf Ihrem Endgerät gespeichert.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Andere Cookies 
                bleiben auf Ihrem Endgerät gespeichert bis Sie diese löschen. Diese Cookies 
                ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Server-Log-Dateien
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so 
                genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. 
                Dies sind:
              </p>
              
              <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. 
                Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. 
                Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien 
                Darstellung und der Optimierung seiner Website.
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Kontaktformular
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus 
                dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
                Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. 
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, 
                sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur 
                Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen 
                beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven 
                Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
              
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Registrierung auf dieser Website
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen zu nutzen. 
                Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen 
                Angebotes oder Dienstes, für den Sie sich registriert haben. Die bei der Registrierung 
                abgefragten Pflichtangaben müssen vollständig angegeben werden. Anderenfalls werden 
                wir die Registrierung ablehnen.
              </p>
            </div>
          </section>

          {/* Soziale Medien */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              5. Soziale Medien
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Social Media Plugins
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Diese Website nutzt Plugins von sozialen Netzwerken. Wenn Sie eine Seite aufrufen, 
                die ein solches Plugin enthält, baut Ihr Browser eine direkte Verbindung mit den 
                Servern des jeweiligen sozialen Netzwerks auf. Der Inhalt des Plugins wird vom 
                sozialen Netzwerk direkt an Ihren Browser übermittelt und von diesem in die Website 
                eingebunden.
              </p>
            </div>
          </section>

          {/* Ihre Rechte */}
          <section>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              6. Ihre Rechte
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Sie haben folgende Rechte bezüglich Ihrer bei uns gespeicherten personenbezogenen Daten:
              </p>
              
              <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 mb-4">
                <li><strong>Recht auf Auskunft:</strong> Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>
                <li><strong>Recht auf Berichtigung:</strong> Sie haben ein Recht auf Berichtigung unrichtiger oder unvollständiger Daten.</li>
                <li><strong>Recht auf Löschung:</strong> Sie können die Löschung Ihrer personenbezogenen Daten verlangen.</li>
                <li><strong>Recht auf Einschränkung:</strong> Sie können die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen.</li>
                <li><strong>Recht auf Datenübertragbarkeit:</strong> Sie können verlangen, dass wir Ihnen Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format übermitteln.</li>
                <li><strong>Widerspruchsrecht:</strong> Sie können der Verarbeitung Ihrer personenbezogenen Daten widersprechen.</li>
              </ul>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                <strong>Beschwerde bei einer Aufsichtsbehörde</strong><br />
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über unsere 
                Verarbeitung personenbezogener Daten zu beschweren.
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400">
                Für die Ausübung Ihrer Rechte wenden Sie sich bitte an:<br />
                E-Mail: datenschutz@campershare.com<br />
                Telefon: +49 (0) 123 456 789
              </p>
            </div>
          </section>

          {/* Letzte Aktualisierung */}
          <section>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Stand der Datenschutzerklärung:</strong> {new Date().toLocaleDateString('de-DE')}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den 
                aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen 
                in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die 
                neue Datenschutzerklärung.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </SimpleLayout>
  )
}
