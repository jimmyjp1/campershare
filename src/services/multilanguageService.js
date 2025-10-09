/**
 * CamperShare - Mehrsprachigkeitsservice (multilanguageService.js)
 * 
 * Dieser Service ermöglicht die Internationalisierung der gesamten Anwendung.
 * Er unterstützt derzeit Deutsch und Englisch mit automatischem Fallback.
 * 
 * Kernfunktionen:
 * - Sprachenwechsel (DE ↔ EN)
 * - Übersetzungsschlüssel-System (t('key.subkey'))
 * - Automatisches Speichern der Sprachpräferenz
 * - Währungsformatierung nach Sprachregion
 * - React Context für globale Verfügbarkeit
 * 
 * Verwendung:
 * const { t, currentLanguage, changeLanguage } = useLanguage()
 * const text = t('home.heroTitle')
 */

import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Unterstützte Sprachen der Anwendung
 * Jede Sprache hat Code, Namen, Flagge und Währungseinstellungen
 */
export const SUPPORTED_LANGUAGES = {
  'de': {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€'
  },
  'en': {
    code: 'en', 
    name: 'English',
    flag: '🇺🇸',
    currency: 'EUR',
    currencySymbol: '€'
  }
}

/**
 * Haupt-Übersetzungsdaten
 * Strukturiert nach Sprachen (de/en) und dann nach Sektionen
 * Verwendung: t('nav.home') → 'Startseite' (DE) oder 'Home' (EN)
 */
const translations = {
  de: {
    // Navigation
    nav: {
      home: 'Startseite',
      campers: 'Wohnmobile',
      about: 'Über uns',
      contact: 'Kontakt',
      menu: 'Menü'
    },
    
    // Homepage
    home: {
      seoTitle: 'CamperShare - Premium Wohnmobile für Ihr nächstes Abenteuer',
      seoDescription: 'Mieten Sie Premium-Wohnmobile für Ihr nächstes Abenteuer. Entdecken Sie unsere Flotte moderner, gut ausgestatteter Fahrzeuge.',
      heroTitle: 'Ihr Abenteuer wartet mit Premium Wohnmobil-Vermietung',
      heroTitleLine1: 'Ihr Abenteuer',
      heroTitleLine2: 'wartet bereits',
      searchSectionTitle: 'Finden Sie Ihr perfektes Wohnmobil',
      searchSectionSubtitle: 'Geben Sie Ihre Reisedaten ein und entdecken Sie unsere verfügbaren Fahrzeuge',
      heroDescription: 'Entdecken Sie die Freiheit der offenen Straße mit unserer Flotte moderner, voll ausgestatteter Wohnmobile. Von kompakten City-Campern bis hin zu geräumigen Familien-Wohnmobilen haben wir das perfekte Fahrzeug für Ihr nächstes Abenteuer.',
      searchCampers: 'Wohnmobile suchen',
      searching: 'Suche',
      location: 'Standort',
      anyLocation: 'Beliebiger Standort',
      checkin: 'Abholdatum',
      checkout: 'Rückgabedatum', 
      guests: 'Personen',
      guest: 'Person',
      guestsPlural: 'en',
      perNight: 'Tag',
      perDay: 'pro Tag',
      sleeps: 'Schlafplätze',
      featuredCampers: 'Beliebte Wohnmobile',
      viewAllCampers: 'Alle Wohnmobile ansehen',
      whyChooseUs: 'Warum CamperShare',
      whyChooseUsSubtitle: 'Über 15.000 zufriedene Kunden vertrauen bereits auf unseren Service. Entdecken Sie, warum CamperShare die erste Wahl für Wohnmobil-Abenteuer ist.',
      feature1: 'Vollversicherte und gewartete Fahrzeugflotte',
      feature2: '24/7 Pannenhilfe inklusive',
      feature3: 'Flexible Buchung mit kostenloser Stornierung',
      feature4: 'Komplette Camping-Ausstattung inklusive',
      feature5: 'Professionelle Reinigung zwischen Vermietungen',
      feature6: 'Deutschlandweite Abholstationen',
      feature1Desc: 'Alle Fahrzeuge sind vollversichert und werden regelmäßig gewartet',
      feature2Desc: 'Rund um die Uhr verfügbare Pannenhilfe für Ihre Sicherheit',
      feature3Desc: 'Buchen Sie flexibel und stornieren Sie kostenlos bis 48h vorher',
      feature4Desc: 'Vollständige Camping-Ausstattung inklusive - einfach einsteigen und losfahren',
      feature5Desc: 'Professionelle Reinigung und Desinfektion zwischen allen Vermietungen',
      feature6Desc: 'Über 50 Abholstationen in ganz Deutschland verfügbar',
      learnMore: 'Mehr erfahren',
      beds: 'Betten',
      viewDetails: 'Details anzeigen',
      ctaTitle: 'Bereit für Ihr nächstes Abenteuer?',
      ctaSubtitle: 'Schließen Sie sich Tausenden zufriedener Kunden an, die mit CamperShare unvergessliche Erinnerungen gemacht haben.',
      ctaButton1: 'Unsere Flotte durchsuchen',
      ctaButton2: 'Kontakt aufnehmen',
      stats: {
        customers: 'Zufriedene Kunden',
        campers: 'Wohnmobile',
        locations: 'Standorte',
        countries: 'Länder'
      }
    },
    
    // Campers page
    campers: {
      title: 'Durchsuchen Sie unsere Wohnmobil-Flotte',
      subtitle: 'Finden Sie das perfekte Wohnmobil für Ihr nächstes Abenteuer.',
      perDay: '/Tag',
      beds: 'Betten',
      viewDetails: 'Details anzeigen',
      bookNow: 'Jetzt buchen',
      showing: 'Zeige',
      of: 'von',
      results: 'Wohnmobile',
      noResults: 'Keine Wohnmobile gefunden',
      clearFilters: 'Filter löschen'
    },

    // Contact page
    contact: {
      title: 'Kontakt aufnehmen',
      subtitle: 'Wir sind hier, um bei Ihren Wohnmobil-Mietbedürfnissen zu helfen. Kontaktieren Sie uns jederzeit!',
      contactInfo: 'Kontaktinformationen',
      phone: 'Telefon',
      email: 'E-Mail',
      address: 'Adresse',
      businessHours: 'Geschäftszeiten',
      monday: 'Montag',
      tuesday: 'Dienstag',
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag',
      closed: 'Geschlossen',
      emergencyContact: 'Notfallkontakt',
      emergencyNote: '24/7 Notfall-Pannenhilfe verfügbar',
      locations: 'Standorte',
      mainOffice: 'Hauptbüro',
      branches: 'Filialen',
      form: {
        title: 'Nachricht senden',
        name: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        subject: 'Betreff',
        message: 'Nachricht',
        inquiryType: 'Art der Anfrage',
        inquiryTypes: {
          general: 'Allgemeine Anfrage',
          booking: 'Buchungsanfrage',
          support: 'Technischer Support',
          feedback: 'Feedback',
          complaint: 'Beschwerde'
        },
        placeholders: {
          name: 'Ihr vollständiger Name',
          email: 'ihre.email@beispiel.de',
          phone: '+49 123 456789',
          subject: 'Worum geht es?',
          message: 'Erzählen Sie uns, wie wir Ihnen helfen können...'
        },
        sending: 'Senden...',
        send: 'Nachricht senden',
        success: 'Nachricht erfolgreich gesendet!',
        successMessage: 'Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.',
        required: 'Dieses Feld ist erforderlich'
      }
    },

    // About page
    about: {
      title: 'Über CamperShare',
      subtitle: 'Ihre vertrauenswürdigen Partner für unvergessliche Wohnmobil-Abenteuer',
      story: {
        title: 'Unsere Geschichte',
        content: 'CamperShare wurde 2018 mit der Vision gegründet, Reiseträume wahr werden zu lassen. Was als kleine Familienunternehmung mit nur drei Wohnmobilen begann, ist heute zu einem der führenden Wohnmobil-Verleihunternehmen in Deutschland gewachsen. Unser Erfolg basiert auf unserer Leidenschaft für das Reisen und unserem Engagement, jedem Kunden ein außergewöhnliches Erlebnis zu bieten.'
      },
      values: {
        title: 'Unsere Werte',
        quality: {
          title: 'Qualität',
          description: 'Alle unsere Wohnmobile werden regelmäßig gewartet und sind mit modernen Annehmlichkeiten ausgestattet.'
        },
        service: {
          title: 'Service',
          description: '24/7 Kundensupport und Pannenhilfe für eine sorgenfreie Reiseerfahrung.'
        },
        sustainability: {
          title: 'Nachhaltigkeit',
          description: 'Wir setzen auf umweltfreundliche Praktiken und moderne, effiziente Fahrzeuge.'
        },
        adventure: {
          title: 'Abenteuer',
          description: 'Wir inspirieren Menschen dazu, neue Orte zu entdecken und unvergessliche Erinnerungen zu schaffen.'
        }
      },
      team: {
        title: 'Unser Team',
        subtitle: 'Lernen Sie das Team hinter CamperShare kennen',
        ceo: {
          name: 'Max Müller',
          role: 'Geschäftsführer & Gründer',
          description: 'Mit über 15 Jahren Erfahrung in der Reisebranche führt Max unser Team mit Leidenschaft und Vision.'
        },
        ceo2: {
          name: 'Philipp Weissgerber',
          role: 'Gründer & Geschäftsführer',
          description: 'Philipp ist einer der Gründer von CamperShare und verantwortet als Geschäftsführer die strategische Ausrichtung und das Wachstum des Unternehmens.'
        },
        ceo3: {
          name: 'Zxhim Pollomi',
          role: 'Gründer & Geschäftsführer',
          description: 'Zxhim ist Mitgründer und Geschäftsführer von CamperShare und kümmert sich um die operative Leitung und Produktentwicklung.'
        },
        sales: {
          name: 'Oskar Prophet',
          role: 'Head of Sales',
          description: 'Oskar leitet unser Vertriebsteam und sorgt dafür, dass CamperShare stetig wächst und neue Kunden für das Wohnmobil-Abenteuer begeistert werden.'
        },
        operations: {
          name: 'Damian 9 Elixier Buttergolem',
          role: 'Operations Manager',
          description: 'Damian kümmert sich um die operativen Abläufe und sorgt dafür, dass alles reibungslos funktioniert.'
        },
        tech: {
          name: 'Hai Viet Vu',
          role: 'Technical Lead',
          description: 'Hai ist unser technischer Leiter und sorgt dafür, dass alle Systeme reibungslos laufen und unsere Kunden die beste digitale Erfahrung haben.'
        },
        service: {
          name: 'Bennie Rettling',
          role: 'Customer Success Manager',
          description: 'Bennie kümmert sich um unsere Kunden und stellt sicher, dass jede Wohnmobil-Reise zu einem unvergesslichen Erlebnis wird.'
        }
      },
      stats: {
        title: 'CamperShare in Zahlen',
        customers: 'Zufriedene Kunden',
        vehicles: 'Wohnmobile in der Flotte',
        countries: 'Länder bereist',
        experience: 'Jahre Erfahrung'
      },
      cta: {
        title: 'Bereit für Ihr nächstes Abenteuer?',
        subtitle: 'Schließen Sie sich Tausenden zufriedener Kunden an, die mit CamperShare unvergessliche Erinnerungen gemacht haben.',
        button1: 'Unsere Flotte durchsuchen',
        button2: 'Kontakt aufnehmen'
      }
    },

    // Buttons und CTAs
    buttons: {
      viewDetails: 'Details ansehen',
      bookNow: 'Jetzt buchen',
      addToWishlist: 'Zur Wunschliste',
      removeFromWishlist: 'Von Wunschliste entfernen',
      compareVans: 'Wohnmobile vergleichen'
    },

    // Authentication
    auth: {
      // Login
      welcomeBack: 'Willkommen zurück',
      loginSubtitle: 'Melden Sie sich in Ihrem Konto an',
      email: 'E-Mail',
      emailPlaceholder: 'ihre.email@beispiel.de',
      password: 'Passwort',
      passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
      rememberMe: 'Angemeldet bleiben',
      forgotPassword: 'Passwort vergessen?',
      login: 'Anmelden',
      loggingIn: 'Anmeldung...',
      loginError: 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      noAccount: 'Noch kein Konto?',
      signUp: 'Registrieren',

      // Registration
      createAccount: 'Konto erstellen',
      registerSubtitle: 'Werden Sie Teil unserer Wohnmobil-Community',
      firstName: 'Vorname',
      firstNamePlaceholder: 'Max',
      lastName: 'Nachname',
      lastNamePlaceholder: 'Mustermann',
      confirmPassword: 'Passwort bestätigen',
      confirmPasswordPlaceholder: 'Passwort wiederholen',
      acceptTerms: 'Ich akzeptiere die',
      termsOfService: 'Nutzungsbedingungen',
      and: 'und',
      privacyPolicy: 'Datenschutzerklärung',
      creatingAccount: 'Konto wird erstellt...',
      registerError: 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      alreadyHaveAccount: 'Bereits ein Konto?',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      acceptTermsError: 'Sie müssen die Nutzungsbedingungen akzeptieren',

      // General
      logout: 'Abmelden',
      profile: 'Profil',
      settings: 'Einstellungen',
      myBookings: 'Meine Buchungen',
      myAccount: 'Mein Konto'
    },

    // Footer
    footer: {
      companyDescription: 'Ihr vertrauensvoller Partner für Premium-Wohnmobilvermietung und unvergessliche Abenteuer in ganz Europa.',
      navigation: 'Navigation',
      services: 'Services',
      contact: 'Kontakt',
      copyright: 'CAMPERSHARE - ALLE RECHTE VORBEHALTEN',
      home: 'Startseite',
      campers: 'Wohnmobile',
      about: 'Über uns',
      contactUs: 'Kontakt',
      faq: 'FAQ',
      booking: 'Buchung',
      insurance: 'Versicherung',
      support: 'Kundenservice',
      wishlist: 'Wunschliste',
      profile: 'Mein Konto'
    },

    // Analytics
    analytics: {
      title: 'Analytics Dashboard',
      subtitle: 'Analytics und Statistiken für CamperShare',
      dashboard: 'Dashboard',
      performance: 'Performance',
      revenue: 'Umsatz',
      bookings: 'Buchungen',
      customers: 'Kunden',
      growth: 'Wachstum',
      totalRevenue: 'Gesamtumsatz',
      totalBookings: 'Gesamtbuchungen',
      totalCustomers: 'Gesamtkunden',
      averageBookingValue: 'Durchschnittlicher Buchungswert',
      monthlyGrowth: 'Monatliches Wachstum',
      topCampers: 'Top-Performance Wohnmobile',
      recentActivity: 'Letzte Aktivitäten',
      bookingTrends: 'Buchungstrends',
      revenueTrends: 'Umsatztrends',
      customerSegments: 'Kundensegmente',
      loadingDashboard: 'Lade Dashboard...',
      refreshData: 'Daten aktualisieren',
      exportData: 'Daten exportieren',
      noData: 'Keine Daten verfügbar',
      errorLoading: 'Fehler beim Laden der Analytics-Daten',
      overview: 'Überblick über Buchungen, Umsatz und Leistung',
      loadingError: 'Fehler beim Laden der Daten',
      tryAgain: 'Erneut versuchen',
      '7days': '7 Tage',
      '30days': '30 Tage',
      '90days': '90 Tage',
      '1year': '1 Jahr',
      avgBookingValue: 'Ø Buchungswert',
      uniqueCustomers: 'Unique Kunden',
      noDataAvailable: 'Keine Daten verfügbar',
      camper: 'Camper',
      location: 'Standort',
      occupancyRate: 'Auslastung',
      topPerformingCampers: 'Top Performing Campers',
      revenueLastYear: 'Umsatz der letzten 12 Monate',
      newBookings: 'Neue Buchungen',
      noRecentActivity: 'Keine aktuellen Aktivitäten',
      booked: 'buchte',
      booking: 'Buchung',
      metaDescription: 'Analytics und Statistiken für CamperShare',
      performanceOverview: 'Übersicht über Performance, Umsätze und Trends'
    },

    // Admin
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Verwalten Sie Ihr CamperShare Business',
      overview: 'Übersicht',
      bookings: 'Buchungen',
      users: 'Benutzer',
      campers: 'Wohnmobile',
      analytics: 'Analytics',
      settings: 'Einstellungen',
      addCamper: 'Wohnmobil hinzufügen',
      editCamper: 'Wohnmobil bearbeiten',
      deleteCamper: 'Wohnmobil löschen',
      addUser: 'Benutzer hinzufügen',
      editUser: 'Benutzer bearbeiten',
      deleteUser: 'Benutzer löschen',
      viewBooking: 'Buchung anzeigen',
      editBooking: 'Buchung bearbeiten',
      cancelBooking: 'Buchung stornieren',
      confirmBooking: 'Buchung bestätigen',
      totalRevenue: 'Gesamtumsatz',
      totalBookings: 'Gesamtbuchungen',
      totalUsers: 'Gesamtbenutzer',
      totalCampers: 'Gesamt Wohnmobile',
      recentBookings: 'Letzte Buchungen',
      popularCampers: 'Beliebte Wohnmobile',
      userActivity: 'Benutzeraktivität',
      systemHealth: 'Systemzustand'
    },

    // Booking
    booking: {
      title: 'Buchen Sie Ihr Wohnmobil',
      subtitle: 'Schließen Sie Ihre Buchung in wenigen Schritten ab',
      selectDates: 'Termine wählen',
      selectCamper: 'Wohnmobil wählen',
      personalInfo: 'Persönliche Informationen',
      payment: 'Zahlung',
      confirmation: 'Bestätigung',
      pickupDate: 'Abholdatum',
      returnDate: 'Rückgabedatum',
      pickupLocation: 'Abholort',
      returnLocation: 'Rückgabeort',
      totalDays: 'Gesamttage',
      pricePerDay: 'Preis pro Tag',
      totalPrice: 'Gesamtpreis',
      extras: 'Extras',
      insurance: 'Versicherung',
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      phone: 'Telefon',
      address: 'Adresse',
      city: 'Stadt',
      postalCode: 'Postleitzahl',
      country: 'Land',
      drivingLicense: 'Führerscheinnummer',
      bookingNumber: 'Buchungsnummer',
      bookingConfirmed: 'Buchung bestätigt',
      thankYou: 'Vielen Dank für Ihre Buchung!',
      confirmationSent: 'Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet.',
      myBookings: 'Meine Buchungen',
      viewBooking: 'Buchung anzeigen',
      cancelBooking: 'Buchung stornieren',
      modifyBooking: 'Buchung ändern',
      downloadInvoice: 'Rechnung herunterladen',
      status: {
        pending: 'Ausstehend',
        confirmed: 'Bestätigt',
        cancelled: 'Storniert',
        completed: 'Abgeschlossen',
        active: 'Aktiv'
      }
    },

    // Buttons und CTAs
    buttons: {
      viewDetails: 'Details ansehen',
      bookNow: 'Jetzt buchen',
      addToWishlist: 'Zur Wunschliste',
      removeFromWishlist: 'Von Wunschliste entfernen',
      compareVans: 'Wohnmobile vergleichen'
    },

    // Common/Buttons  
    common: {
      loading: 'Laden...',
      search: 'Suchen',
      price: 'Preis',
      currency: '€',
      save: 'Speichern',
      cancel: 'Abbrechen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      confirm: 'Bestätigen',
      close: 'Schließen',
      yes: 'Ja',
      no: 'Nein',
      ok: 'OK',
      back: 'Zurück',
      next: 'Weiter'
    }
  },
  
  en: {
    // Navigation
    nav: {
      home: 'Home',
      campers: 'Camper Vans',
      about: 'About',
      contact: 'Contact',
      menu: 'Menu'
    },
    
    // Homepage
    home: {
      seoTitle: 'CamperShare - Premium Camper Vans for Your Next Adventure',
      seoDescription: 'Rent premium camper vans for your next adventure. Discover our fleet of modern, well-equipped vehicles.',
      heroTitle: 'Your Adventure Awaits with Premium Camper Van Rental',
      heroTitleLine1: 'Your Adventure',
      heroTitleLine2: 'Awaits',
      searchSectionTitle: 'Find Your Perfect Camper Van',
      searchSectionSubtitle: 'Enter your travel dates and discover our available vehicles',
      heroDescription: 'Discover the freedom of the open road with our fleet of modern, fully-equipped camper vans. From compact city cruisers to spacious family explorers, we have the perfect vehicle for your next adventure.',
      searchCampers: 'Search Camper Vans',
      searching: 'Searching',
      location: 'Location',
      anyLocation: 'Any Location',
      checkin: 'Check-in Date',
      checkout: 'Check-out Date',
      guests: 'Guests',
      guest: 'guest',
      guestsPlural: 's',
      perNight: 'day',
      perDay: 'per day',
      sleeps: 'Sleeps',
      featuredCampers: 'Featured Camper Vans',
      viewAllCampers: 'View All Camper Vans',
      whyChooseUs: 'Why Choose CamperShare',
      whyChooseUsSubtitle: 'Over 15,000 satisfied customers already trust our service. Discover why CamperShare is the first choice for camper van adventures.',
      feature1: 'Fully insured and maintained vehicle fleet',
      feature2: '24/7 roadside assistance included',
      feature3: 'Flexible booking with free cancellation',
      feature4: 'Complete camping equipment included',
      feature5: 'Professional cleaning between rentals',
      feature6: 'Nationwide pickup locations',
      feature1Desc: 'All vehicles are fully insured and regularly maintained for your safety',
      feature2Desc: '24/7 roadside assistance available for your peace of mind',
      feature3Desc: 'Book flexibly and cancel free of charge up to 48h in advance',
      feature4Desc: 'Complete camping equipment included - just get in and drive away',
      feature5Desc: 'Professional cleaning and disinfection between all rentals',
      feature6Desc: 'Over 50 pickup stations available throughout Germany',
      learnMore: 'Learn More',
      beds: 'beds',
      viewDetails: 'View Details',
      ctaTitle: 'Ready for Your Next Adventure?',
      ctaSubtitle: 'Join thousands of satisfied customers who have made unforgettable memories with CamperShare.',
      ctaButton1: 'Browse Our Fleet',
      ctaButton2: 'Get in Touch',
      stats: {
        customers: 'Satisfied Customers',
        campers: 'Camper Vans',
        locations: 'Locations',
        countries: 'Countries'
      }
    },
    
    // Campers page
    campers: {
      title: 'Browse Our Camper Van Fleet',
      subtitle: 'Find the perfect camper van for your next adventure.',
      perDay: '/day',
      beds: 'beds',
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      showing: 'Showing',
      of: 'of',
      results: 'camper vans',
      noResults: 'No camper vans found',
      clearFilters: 'Clear filters'
    },

    // Contact page
    contact: {
      title: 'Get in Touch',
      subtitle: 'We\'re here to help with your camper van rental needs. Reach out to us anytime!',
      contactInfo: 'Contact Information',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      businessHours: 'Business Hours',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      closed: 'Closed',
      emergencyContact: 'Emergency Contact',
      emergencyNote: '24/7 Emergency roadside assistance available',
      locations: 'Locations',
      mainOffice: 'Main Office',
      branches: 'Branches',
      form: {
        title: 'Send Message',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        subject: 'Subject',
        message: 'Message',
        inquiryType: 'Inquiry Type',
        inquiryTypes: {
          general: 'General Inquiry',
          booking: 'Booking Request',
          support: 'Technical Support',
          feedback: 'Feedback',
          complaint: 'Complaint'
        },
        placeholders: {
          name: 'Your full name',
          email: 'your.email@example.com',
          phone: '+49 123 456789',
          subject: 'What is this about?',
          message: 'Tell us how we can help you...'
        },
        sending: 'Sending...',
        send: 'Send Message',
        success: 'Message sent successfully!',
        successMessage: 'Thank you for your message. We will get back to you shortly.',
        required: 'This field is required'
      }
    },

    // About page
    about: {
      title: 'About CamperShare',
      subtitle: 'Your trusted partners for unforgettable camper van adventures',
      story: {
        title: 'Our Story',
        content: 'CamperShare was founded in 2018 with a vision to make travel dreams come true. What started as a small family business with just three camper vans has grown into one of Germany\'s leading camper van rental companies. Our success is built on our passion for travel and our commitment to providing every customer with an exceptional experience.'
      },
      values: {
        title: 'Our Values',
        quality: {
          title: 'Quality',
          description: 'All our camper vans are regularly maintained and equipped with modern amenities.'
        },
        service: {
          title: 'Service',
          description: '24/7 customer support and roadside assistance for a worry-free travel experience.'
        },
        sustainability: {
          title: 'Sustainability',
          description: 'We are committed to eco-friendly practices and modern, efficient vehicles.'
        },
        adventure: {
          title: 'Adventure',
          description: 'We inspire people to discover new places and create unforgettable memories.'
        }
      },
      team: {
        title: 'Our Team',
        subtitle: 'Meet the team behind CamperShare',
        ceo: {
          name: 'Max Müller',
          role: 'CEO & Founder',
          description: 'With over 15 years of experience in the travel industry, Max leads our team with passion and vision.'
        },
        ceo2: {
          name: 'Philipp Weissgerber',
          role: 'Founder & CEO',
          description: 'Philipp is one of the founders of CamperShare and is responsible as CEO for the strategic direction and growth of the company.'
        },
        ceo3: {
          name: 'Zxhim Pollomi',
          role: 'Founder & CEO',
          description: 'Zxhim is co-founder and CEO of CamperShare and takes care of operational management and product development.'
        },
        sales: {
          name: 'Oskar Prophet',
          role: 'Head of Sales',
          description: 'Oskar leads our sales team and ensures that CamperShare continues to grow and inspires new customers for the motorhome adventure.'
        },
        operations: {
          name: 'Damian 9 Elixier Buttergolem',
          role: 'Operations Manager',
          description: 'Damian takes care of operational processes and ensures that everything runs smoothly.'
        },
        tech: {
          name: 'Hai Viet Vu',
          role: 'Technical Lead',
          description: 'Hai is our technical lead and ensures that all systems run smoothly and our customers have the best digital experience.'
        },
        service: {
          name: 'Bennie Rettling',
          role: 'Customer Success Manager',
          description: 'Bennie takes care of our customers and ensures that every motorhome journey becomes an unforgettable experience.'
        }
      },
      stats: {
        title: 'CamperShare by Numbers',
        customers: 'Satisfied Customers',
        vehicles: 'Vehicles in Fleet',
        countries: 'Countries Traveled',
        experience: 'Years of Experience'
      },
      cta: {
        title: 'Ready for Your Next Adventure?',
        subtitle: 'Join thousands of satisfied customers who have made unforgettable memories with CamperShare.',
        button1: 'Browse Our Fleet',
        button2: 'Get in Touch'
      }
    },

    // Authentication
    auth: {
      // Login
      welcomeBack: 'Welcome Back',
      loginSubtitle: 'Sign in to your account',
      email: 'Email',
      emailPlaceholder: 'your.email@example.com',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      login: 'Sign In',
      loggingIn: 'Signing in...',
      loginError: 'Login failed. Please try again.',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',

      // Registration
      createAccount: 'Create Account',
      registerSubtitle: 'Join our camper van community',
      firstName: 'First Name',
      firstNamePlaceholder: 'John',
      lastName: 'Last Name',
      lastNamePlaceholder: 'Doe',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Repeat password',
      acceptTerms: 'I accept the',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      creatingAccount: 'Creating account...',
      registerError: 'Registration failed. Please try again.',
      alreadyHaveAccount: 'Already have an account?',
      passwordMismatch: 'Passwords do not match',
      acceptTermsError: 'You must accept the Terms of Service',

      // General
      logout: 'Sign Out',
      profile: 'Profile',
      settings: 'Settings',
      myBookings: 'My Bookings',
      myAccount: 'My Account'
    },

    // Footer
    footer: {
      companyDescription: 'Your trusted partner for premium camper van rentals and unforgettable adventures across Europe.',
      navigation: 'Navigation',
      services: 'Services',
      contact: 'Contact',
      copyright: 'CAMPERSHARE - ALL RIGHTS RESERVED',
      home: 'Home',
      campers: 'Camper Vans',
      about: 'About',
      contactUs: 'Contact',
      faq: 'FAQ',
      booking: 'Booking',
      insurance: 'Insurance',
      support: 'Customer Service',
      wishlist: 'Wishlist',
      profile: 'My Account'
    },

    // Analytics
    analytics: {
      title: 'Analytics Dashboard',
      subtitle: 'Analytics and statistics for CamperShare',
      dashboard: 'Dashboard',
      performance: 'Performance',
      revenue: 'Revenue',
      bookings: 'Bookings',
      customers: 'Customers',
      growth: 'Growth',
      totalRevenue: 'Total Revenue',
      totalBookings: 'Total Bookings',
      totalCustomers: 'Total Customers',
      averageBookingValue: 'Average Booking Value',
      monthlyGrowth: 'Monthly Growth',
      topCampers: 'Top Performing Camper Vans',
      recentActivity: 'Recent Activity',
      bookingTrends: 'Booking Trends',
      revenueTrends: 'Revenue Trends',
      customerSegments: 'Customer Segments',
      overview: 'Overview of bookings, revenue and performance',
      loadingDashboard: 'Loading dashboard...',
      loadingError: 'Error loading data',
      tryAgain: 'Try again',
      '7days': '7 Days',
      '30days': '30 Days', 
      '90days': '90 Days',
      '1year': '1 Year',
      avgBookingValue: 'Avg. Booking Value',
      uniqueCustomers: 'Unique Customers',
      noDataAvailable: 'No data available',
      camper: 'Camper',
      location: 'Location',
      occupancyRate: 'Occupancy Rate',
      topPerformingCampers: 'Top Performing Campers',
      revenueLastYear: 'Revenue over the last 12 months',
      newBookings: 'New Bookings',
      noRecentActivity: 'No recent activity',
      booked: 'booked',
      booking: 'Booking',
      metaDescription: 'Analytics and statistics for CamperShare',
      performanceOverview: 'Overview of performance, revenue and trends'
    },

    // Admin
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Manage your CamperShare business',
      overview: 'Overview',
      bookings: 'Bookings',
      users: 'Users',
      campers: 'Camper Vans',
      analytics: 'Analytics',
      settings: 'Settings',
      addCamper: 'Add Camper Van',
      editCamper: 'Edit Camper Van',
      deleteCamper: 'Delete Camper Van',
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      viewBooking: 'View Booking',
      editBooking: 'Edit Booking',
      cancelBooking: 'Cancel Booking',
      confirmBooking: 'Confirm Booking',
      totalRevenue: 'Total Revenue',
      totalBookings: 'Total Bookings',
      totalUsers: 'Total Users',
      totalCampers: 'Total Camper Vans',
      recentBookings: 'Recent Bookings',
      popularCampers: 'Popular Camper Vans',
      userActivity: 'User Activity',
      systemHealth: 'System Health'
    },

    // Booking
    booking: {
      title: 'Book Your Camper Van',
      subtitle: 'Complete your booking in just a few steps',
      selectDates: 'Select Dates',
      selectCamper: 'Select Camper Van',
      personalInfo: 'Personal Information',
      payment: 'Payment',
      confirmation: 'Confirmation',
      pickupDate: 'Pickup Date',
      returnDate: 'Return Date',
      pickupLocation: 'Pickup Location',
      returnLocation: 'Return Location',
      totalDays: 'Total Days',
      pricePerDay: 'Price per Day',
      totalPrice: 'Total Price',
      extras: 'Extras',
      insurance: 'Insurance',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',
      drivingLicense: 'Driving License Number',
      bookingNumber: 'Booking Number',
      bookingConfirmed: 'Booking Confirmed',
      thankYou: 'Thank you for your booking!',
      confirmationSent: 'A confirmation email has been sent to your email address.',
      myBookings: 'My Bookings',
      viewBooking: 'View Booking',
      cancelBooking: 'Cancel Booking',
      modifyBooking: 'Modify Booking',
      downloadInvoice: 'Download Invoice',
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed',
        active: 'Active'
      }
    },

    // Buttons and CTAs
    buttons: {
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      compareVans: 'Compare Vans'
    },

    // Common/Buttons
    common: {
      loading: 'Loading...',
      search: 'Search',
      price: 'Price',
      currency: '€',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      back: 'Back',
      next: 'Next'
    }
  },
  
  'de-ch': {
    nav: {
      home: 'Startsite',
      campers: 'Wohnmobil',
      about: 'Über üs',
      contact: 'Kontakt',
      menu: 'Menü'
    },
    common: {
      loading: 'Ladet...',
      currency: 'CHF',
      save: 'Speichere',
      cancel: 'Abbräche'
    }
  },
  
  fr: {
    nav: {
      home: 'Accueil',
      campers: 'Camping-cars',
      about: 'À propos',
      contact: 'Contact',
      menu: 'Menu'
    },
    common: {
      loading: 'Chargement...',
      currency: '€',
      save: 'Enregistrer',
      cancel: 'Annuler'
    }
  },
  
  'de-at': {
    nav: {
      home: 'Startseite',
      campers: 'Wohnmobile',
      about: 'Über uns',
      contact: 'Kontakt',
      menu: 'Menü'
    },
    common: {
      loading: 'Lädt...',
      currency: '€',
      save: 'Speichern',
      cancel: 'Abbrechen'
    }
  }
}

// Language Context
const LanguageContext = createContext()

// Language Provider Component
export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('de') // Standard: Deutsch
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Load saved language from localStorage only client-side
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (languageCode) => {
    if (SUPPORTED_LANGUAGES[languageCode]) {
      setCurrentLanguage(languageCode)
      if (isMounted) {
        localStorage.setItem('preferredLanguage', languageCode)
      }
    }
  }

  // Translation function
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        // Fallback to German, then English
        value = translations.de
        for (const fallbackK of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackK]
          } else {
            return key // Return key if translation not found
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const formatPrice = (price) => {
    return `€${price}`
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,  
      t,
      formatPrice,
      supportedLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use language
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
