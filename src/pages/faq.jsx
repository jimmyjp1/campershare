import Head from 'next/head'
import { useState } from 'react'
import { Container } from '@/components/Container'
import { useLanguage } from '@/services/multilanguageService'

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-zinc-200/50 dark:border-zinc-700/50 last:border-b-0">
      <button
        className={`group flex w-full items-center justify-between py-6 px-6 text-left transition-all duration-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 focus:outline-none focus:bg-teal-50/50 dark:focus:bg-teal-900/20 focus:ring-2 focus:ring-teal-500 focus:ring-inset ${
          isOpen ? 'bg-teal-50/30 dark:bg-teal-900/10' : ''
        }`}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <h3 className={`text-lg font-semibold pr-4 transition-colors duration-200 ${
          isOpen 
            ? 'text-teal-700 dark:text-teal-300' 
            : 'text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400'
        }`}>
          {question}
        </h3>
        <div className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 ${
          isOpen 
            ? 'bg-teal-100 dark:bg-teal-900/30 rotate-180' 
            : 'bg-zinc-100 dark:bg-zinc-700/50 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30'
        }`}>
          <ChevronDownIcon className={`h-5 w-5 transition-colors duration-200 ${
            isOpen 
              ? 'text-teal-600 dark:text-teal-400' 
              : 'text-zinc-500 dark:text-zinc-400 group-hover:text-teal-600 dark:group-hover:text-teal-400'
          }`} />
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-teal-50/50 to-blue-50/50 dark:from-teal-900/10 dark:to-blue-900/10 rounded-xl p-5 border border-teal-100/50 dark:border-teal-800/30">
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-base">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { t } = useLanguage()
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const toggleAll = () => {
    const allOpen = Object.keys(openItems).length > 0 && Object.values(openItems).every(Boolean)
    if (allOpen) {
      setOpenItems({}) // Alle schließen
    } else {
      // Alle öffnen
      const newOpenItems = {}
      faqData.forEach((_, index) => {
        newOpenItems[index] = true
      })
      setOpenItems(newOpenItems)
    }
  }

  const allOpen = Object.keys(openItems).length > 0 && Object.values(openItems).every(Boolean)

  const faqData = [
    {
      question: "Welche Führerscheinklasse benötige ich für die Wohnmobile?",
      answer: "Die meisten unserer Wohnmobile können mit einem normalen Pkw-Führerschein (Klasse B) gefahren werden. Für Fahrzeuge über 3,5 Tonnen benötigen Sie einen Führerschein der Klasse C1. In der Fahrzeugbeschreibung finden Sie immer die erforderliche Führerscheinklasse angegeben."
    },
    {
      question: "Wie funktioniert die Buchung?",
      answer: "Die Buchung ist ganz einfach: Wählen Sie Ihr Wunschfahrzeug und den gewünschten Zeitraum aus. Nach der Online-Buchung erhalten Sie eine Bestätigung per E-Mail. 24 Stunden vor der Abholung erhalten Sie alle wichtigen Informationen zur Übergabe. Bei der Abholung erfolgt eine gemeinsame Fahrzeugübergabe mit Einweisung."
    },
    {
      question: "Was ist im Mietpreis enthalten?",
      answer: "Im Mietpreis sind enthalten: Vollkaskoversicherung mit 1.000€ Selbstbehalt, unbegrenzte Kilometer, Campingausstattung (Geschirr, Bettwäsche, Handtücher), technische Einweisung, 24h Pannenhilfe und Roadside Assistance. Kraftstoff und Mautgebühren sind nicht enthalten."
    },
    {
      question: "Kann ich das Wohnmobil auch ins Ausland mieten?",
      answer: "Ja, unsere Wohnmobile dürfen in alle EU-Länder sowie Schweiz, Norwegen und Großbritannien mitgenommen werden. Für andere Länder kontaktieren Sie uns bitte vorab. Der Versicherungsschutz gilt europaweit. Bitte informieren Sie sich über die jeweiligen Einreisebestimmungen und Mautregelungen."
    },
    {
      question: "Wie erfolgt die Übergabe des Fahrzeugs?",
      answer: "Die Fahrzeugübergabe erfolgt an unserem Standort zu den vereinbarten Zeiten (Mo-Fr 9-18 Uhr, Sa 9-16 Uhr). Bei der Übergabe wird das Fahrzeug gemeinsam kontrolliert, Sie erhalten eine ausführliche Einweisung in die Technik und alle wichtigen Dokumente. Die Rückgabe erfolgt mit vollgetanktem Fahrzeug und geleerten Abwassertanks."
    },
    {
      question: "Was passiert bei einem Schaden oder Unfall?",
      answer: "Kontaktieren Sie uns umgehend unter unserer 24h-Hotline. Bei Unfällen informieren Sie zusätzlich die Polizei und dokumentieren Sie den Schaden mit Fotos. Unsere Vollkaskoversicherung deckt Schäden ab 1.000€ Selbstbehalt ab. Für kleinere Schäden stellen wir eine Pauschale in Rechnung."
    },
    {
      question: "Welche Stornierungsbedingungen gelten?",
      answer: "Kostenlose Stornierung bis 30 Tage vor Reisebeginn. Bei Stornierung 15-29 Tage vorher: 50% der Mietsumme. Bei Stornierung 7-14 Tage vorher: 80% der Mietsumme. Bei Stornierung weniger als 7 Tage vorher: 100% der Mietsumme. Wir empfehlen den Abschluss einer Reiserücktrittsversicherung."
    },
    {
      question: "Ist eine Einwegmiete möglich?",
      answer: "Ja, Einwegmieten sind gegen Aufpreis möglich. Die Gebühr richtet sich nach der Entfernung zwischen Abhol- und Rückgabestation. Bitte geben Sie bei der Buchung Ihren gewünschten Rückgabeort an. Wir prüfen die Verfügbarkeit und teilen Ihnen die zusätzlichen Kosten mit."
    },
    {
      question: "Darf ich mit dem Wohnmobil auf Campingplätze fahren?",
      answer: "Selbstverständlich! Unsere Wohnmobile sind für Campingplätze konzipiert. Alle Fahrzeuge haben entsprechende Anschlüsse für Strom, Wasser und Abwasser. Wir stellen Ihnen gerne Campingplatz-Empfehlungen zur Verfügung und können bei der Reservierung helfen."
    },
    {
      question: "Was muss ich bei der Rückgabe beachten?",
      answer: "Das Fahrzeug sollte in dem Zustand zurückgegeben werden, wie Sie es erhalten haben: vollgetankt, mit geleerten Abwasser- und Toilettentanks sowie gereinigt (innen gefegt, außen gespült). Bei starker Verschmutzung berechnen wir eine Reinigungsgebühr. Kleinere Schäden werden protokolliert."
    },
    {
      question: "Gibt es eine Altersgrenze für die Anmietung?",
      answer: "Das Mindestalter beträgt 21 Jahre mit mindestens 2 Jahren Führerscheinbesitz. Fahrer über 75 Jahre benötigen ein aktuelles ärztliches Attest über die Fahrtauglichkeit. Zusätzliche Fahrer müssen bei der Buchung angegeben und bei der Übergabe anwesend sein."
    },
    {
      question: "Welche Zusatzausstattung kann ich buchen?",
      answer: "Wir bieten verschiedene Extras: Fahrräder (15€/Tag), Kindersitze (5€/Tag), Grillausrüstung (10€/Tag), Satelliten-TV (8€/Tag), mobile Internetrouter (6€/Tag), Campingstühle und -tisch (8€/Tag). Die Extras können bei der Buchung oder bis 48h vor Abholung hinzugebucht werden."
    }
  ]

  return (
    <>
      <Head>
        <title>CamperShare</title>
        <meta
          name="description"
          content="Häufig gestellte Fragen rund um die Wohnmobilvermietung bei CamperShare. Finden Sie Antworten zu Buchung, Versicherung, Führerschein und vielem mehr."
        />
      </Head>
      
      <Container className="mt-16 sm:mt-32">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              Häufig gestellte Fragen
            </h1>
            <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400">
              Hier finden Sie Antworten auf die wichtigsten Fragen rund um Ihre Wohnmobilvermietung
            </p>
            
            {/* Toggle All Button */}
            <div className="mt-8">
              <button
                onClick={toggleAll}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors duration-200"
              >
                {allOpen ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    Alle schließen
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Alle öffnen
                  </>
                )}
              </button>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="bg-white dark:bg-zinc-800/50 rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-teal-500/5 to-blue-500/5 dark:from-teal-400/5 dark:to-blue-400/5 px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 ml-2">
                  {faqData.length} Fragen & Antworten
                </span>
              </div>
            </div>
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openItems[index]}
                onClick={() => toggleItem(index)}
              />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Weitere Fragen?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Unser Team steht Ihnen gerne zur Verfügung und beantwortet alle Ihre Fragen persönlich.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Kontakt aufnehmen
                </a>
                <a
                  href="tel:+498912345678"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold rounded-lg border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  +49 89 123 456 78
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Buchungsbedingungen
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Alle Details zu unseren Mietbedingungen und Tarifen
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Versicherungsschutz
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Umfassender Schutz für Ihre sorgenfreie Reise
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Reiseplanung
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Tipps und Empfehlungen für Ihre Wohnmobiltour
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
