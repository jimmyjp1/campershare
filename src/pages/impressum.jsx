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
