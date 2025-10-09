/**
 * CamperShare - Fahrzeugdaten-Service (camperVehicleDataService.js)
 * 
 * Zentrale Datenbank für alle verfügbaren Wohnmobile der Plattform.
 * Enthält detaillierte Spezifikationen, Preise und Verfügbarkeiten.
 * 
 * Datenstruktur pro Fahrzeug:
 * - Grunddaten (Name, Kategorie, Hersteller)
 * - Technische Spezifikationen (Motor, Verbrauch, Gewicht)
 * - Ausstattung und Features
 * - Preise und Verfügbarkeit
 * - Standorte und GPS-Koordinaten
 * - Bewertungen und Badge-System
 * - Bilder und Medien
 * 
 * Kategorien:
 * - Kompakt: VW California, Ford Nugget (2-4 Personen)
 * - Standard: Dethleffs, Hobby (4-6 Personen)
 * - Premium: Concorde, Morelo (6+ Personen)
 * - Luxus: Concorde Charisma, Morelo Palace
 * 
 * Zusatzservices:
 * - Versicherungspakete (Basis bis Premium)
 * - Kilometerpakete (500km bis Unlimited)
 * - Extras (GPS, Fahrräder, Campingausrüstung)
 * - Abholstandorte deutschlandweit
 * 
 * Performance-Optimierungen:
 * - Lazy Loading für Bilder
 * - Caching von Suchergebnissen
 * - Filterbare Datenstrukturen
 */

// Haupt-Fahrzeugdatenbank mit 19+ konfigurierten Wohnmobilen
export const CAMPER_VANS = [
  {
    id: 'vw-california-ocean',
    name: 'VW California Ocean',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    
    // Preisgestaltung
    pricePerDay: 89,
    
    // Kapazitäten
    beds: 4,                    // Schlafplätze
    seats: 4,                   // Sitzplätze während Fahrt
    
    // Fahrzeug-Spezifikationen
    requiredLicense: 'B',       // Führerscheinklasse
    fuelConsumption: 7.5,       // Liter/100km
    enginePower: 150,           // PS
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    
    // Abmessungen und Gewichte
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2300,          // kg
    maxTotalWeight: 3080,       // kg zulässiges Gesamtgewicht
    
    // Anhängerkupplung
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,       // kg
    
    // Ausstattungsmerkmale
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze'],
    
    // Verfügbarkeitszeiträume
    availability: [
      { startDate: '2025-03-15', endDate: '2025-03-22' },
      { startDate: '2025-04-01', endDate: '2025-04-15' }
    ],
    
    // Marketing-Daten
    description: 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen mit Aufstelldach und Miniküche.',
    rating: 4.5,                // Kundenbewertung (1-5)
    category: 'Kompakt',
    badge: 'Beliebt',          // Marketing-Badge
    
    // Standorte
    pickupLocations: ['Berlin', 'Hamburg', 'München'],
    location: 'Berlin (PLZ 10115)',
    latitude: 52.5200,         // GPS für Karten-Integration
    longitude: 13.4050,
    
    // Klassifizierung
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2022,
    
    // Detaillierte technische Daten
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,     // Liter
      waterTankCapacity: 30,    // Liter
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 89,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 80
    }
  },
  {
    id: 'knaus-boxdrive',
    name: 'Knaus BoxDrive',
    imageUrl: '/images/campers/knaus-boxdrive.jpg',
    images: ['/images/campers/knaus-boxdrive-1.jpg', '/images/campers/knaus-boxdrive-2.jpg'],
    pricePerDay: 99,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.60 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Küche', 'Bad mit Dusche', 'Dinette', 'Fahrradträger'],
    availability: [
      { startDate: '2025-05-01', endDate: '2025-05-10' }
    ],
    description: 'Kompakter Kastenwagen von Knaus mit durchdachtem Grundriss und allem Komfort für 4 Personen.',
    rating: 4.3,
    category: 'Standard',
    badge: 'Neu',
    pickupLocations: ['Hamburg', 'München'],
    location: 'Hamburg (PLZ 20095)',
    latitude: 53.5511,
    longitude: 9.9937,
    type: 'Kastenwagen',
    manufacturer: 'Knaus',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 90,
      wasteWaterCapacity: 70,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 99,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.22,
      cleaningFee: 75
    }
  },
  {
    id: 'hymer-b-mc-t580',
    name: 'Hymer B-MC T580',
    imageUrl: '/images/campers/hymer-b-mc-t580.jpg',
    images: ['/images/campers/hymer-b-mc-t580-1.jpg', '/images/campers/hymer-b-mc-t580-2.jpg'],
    pricePerDay: 149,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 9.5,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 7.09, width: 2.30, height: 2.88 },
    emptyWeight: 3200,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Teilintegriert', 'Hubbett', 'L-Küche', 'Bad mit separater Dusche', 'Dinette', 'Garage'],
    availability: [],
    description: 'Luxuriöses teilintegriertes Wohnmobil von Hymer mit innovativem Hubbett und geräumigem Innenraum.',
    rating: 4.7,
    category: 'Premium',
    badge: 'Premium',
    pickupLocations: ['München', 'Frankfurt'],
    location: 'München (PLZ 80331)',
    latitude: 48.1351,
    longitude: 11.5820,
    type: 'Teilintegriert',
    manufacturer: 'Hymer',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 75,
      waterTankCapacity: 120,
      wasteWaterCapacity: 100,
      electricalSystem: '12V/230V mit Solaranlage',
      heating: 'Truma Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 149,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.20
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 30 },
        { daysBeforePickup: 7, feePercentage: 60 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 2000,
      mileageIncluded: 150,
      additionalMileageCost: 0.28,
      cleaningFee: 120
    }
  },
  {
    id: 'weinsberg-caraone-480qdk',
    name: 'Weinsberg CaraOne 480 QDK',
    imageUrl: '/images/campers/weinsberg-caraone.jpg',
    images: ['/images/campers/weinsberg-caraone-1.jpg', '/images/campers/weinsberg-caraone-2.jpg'],
    pricePerDay: 79,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.8,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.65 },
    emptyWeight: 2900,
    maxTotalWeight: 3500,
    hasTrailerHitch: false,
    features: ['Kastenwagen', 'Querbett', 'Kompakte Küche', 'Bad', 'Sitzgruppe'],
    availability: [
      { startDate: '2025-04-10', endDate: '2025-04-20' },
      { startDate: '2025-06-15', endDate: '2025-06-25' }
    ],
    description: 'Preisgünstiger Kastenwagen von Weinsberg mit Querbett - ideal für preisbewusste Camper.',
    rating: 4.1,
    category: 'Budget',
    badge: 'Preis-Hit',
    pickupLocations: ['Berlin', 'Köln'],
    location: 'Berlin (PLZ 12049)',
    latitude: 52.4797,
    longitude: 13.4456,
    type: 'Kastenwagen',
    manufacturer: 'Weinsberg',
    year: 2021,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 80,
      wasteWaterCapacity: 65,
      electricalSystem: '12V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 79,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 15 },
        { daysBeforePickup: 7, feePercentage: 30 },
        { daysBeforePickup: 1, feePercentage: 60 }
      ],
      securityDepositAmount: 1000,
      mileageIncluded: 150,
      additionalMileageCost: 0.20,
      cleaningFee: 60
    }
  },
  {
    id: 'adria-twin-supreme-640slx',
    name: 'Adria Twin Supreme 640 SLX',
    imageUrl: '/images/campers/adria-twin-supreme.jpg',
    images: ['/images/campers/adria-twin-supreme-1.jpg', '/images/campers/adria-twin-supreme-2.jpg'],
    pricePerDay: 109,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.9,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.36, width: 2.05, height: 2.78 },
    emptyWeight: 3100,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1300,
    features: ['Kastenwagen', 'Längsbetten', 'Große Küche', 'Bad mit Dusche', 'Solaranlage', 'Fahrradträger'],
    availability: [
      { startDate: '2025-07-01', endDate: '2025-07-15' }
    ],
    description: 'Hochwertiger Kastenwagen von Adria mit Längsbetten und umfangreicher Ausstattung.',
    rating: 4.4,
    category: 'Standard',
    badge: 'Bestseller',
    pickupLocations: ['Frankfurt', 'Stuttgart'],
    location: 'Frankfurt (PLZ 60311)',
    latitude: 50.1109,
    longitude: 8.6821,
    type: 'Kastenwagen',
    manufacturer: 'Adria',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 110,
      wasteWaterCapacity: 90,
      electricalSystem: '12V/230V mit Solaranlage',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 109,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.16
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 85
    }
  },
  {
    id: 'laika-kosmo-campervan-3012',
    name: 'Laika Kosmo Campervan 3.0',
    imageUrl: '/images/campers/laika-kosmo.jpg',
    images: ['/images/campers/laika-kosmo-1.jpg', '/images/campers/laika-kosmo-2.jpg'],
    pricePerDay: 119,
    beds: 2,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.1,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.54 },
    emptyWeight: 2750,
    maxTotalWeight: 3500,
    hasTrailerHitch: false,
    features: ['Van', 'Designer-Interieur', 'Premium-Küche', 'Bad mit Dusche', 'Smart-Home System'],
    availability: [
      { startDate: '2025-08-01', endDate: '2025-08-10' }
    ],
    description: 'Luxuriöser Designer-Van von Laika mit innovativem Smart-Home System und Premium-Ausstattung.',
    rating: 4.8,
    category: 'Luxus',
    badge: 'Luxus',
    pickupLocations: ['München'],
    location: 'München (PLZ 80331)',
    latitude: 48.1351,
    longitude: 11.5820,
    type: 'Van',
    manufacturer: 'Laika',
    year: 2024,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 75,
      waterTankCapacity: 100,
      wasteWaterCapacity: 85,
      electricalSystem: '12V/230V/Lithium',
      heating: 'Webasto Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 119,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.30,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 30 },
        { daysBeforePickup: 7, feePercentage: 60 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 2000,
      mileageIncluded: 180,
      additionalMileageCost: 0.30,
      cleaningFee: 100
    }
  },
  {
    id: 'concorde-liner-plus-996l',
    name: 'Concorde Liner Plus 996L',
    imageUrl: '/images/campers/concorde-liner.jpg',
    images: ['/images/campers/concorde-liner-1.jpg', '/images/campers/concorde-liner-2.jpg'],
    pricePerDay: 199,
    beds: 4,
    seats: 6,
    requiredLicense: 'B',
    fuelConsumption: 11.2,
    enginePower: 177,
    driveType: 'diesel',
    emissionClass: 'Euro 6d',
    dimensions: { length: 8.69, width: 2.35, height: 3.20 },
    emptyWeight: 4200,
    maxTotalWeight: 4500,
    hasTrailerHitch: true,
    maxTrailerLoad: 2000,
    features: ['Integriertes Wohnmobil', 'Panorama-Lounge', 'Premium-Küche', 'Luxus-Bad', 'Multimedia-Center', 'Garage'],
    availability: [],
    description: 'Luxuriöses integriertes Wohnmobil von Concorde mit Panorama-Lounge und erstklassiger Ausstattung.',
    rating: 4.9,
    category: 'Luxus Plus',
    badge: 'Luxus Plus',
    pickupLocations: ['Frankfurt'],
    location: 'Frankfurt (PLZ 60311)',
    type: 'Integriertes Wohnmobil',
    manufacturer: 'Concorde',
    year: 2024,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 100,
      waterTankCapacity: 180,
      wasteWaterCapacity: 150,
      electricalSystem: '12V/24V/230V/Lithium',
      heating: 'Alde Warmwasser-Heizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 199,
      lowSeasonMultiplier: 0.80,
      highSeasonMultiplier: 1.40,
      weeklyDiscount: 0.15,
      monthlyDiscount: 0.25
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 60, feePercentage: 0 },
        { daysBeforePickup: 30, feePercentage: 40 },
        { daysBeforePickup: 14, feePercentage: 70 },
        { daysBeforePickup: 3, feePercentage: 100 }
      ],
      securityDepositAmount: 3500,
      mileageIncluded: 200,
      additionalMileageCost: 0.40,
      cleaningFee: 180
    }
  },
  {
    id: 'malibu-van-charming-gt-600-db',
    name: 'Malibu Van Charming GT 600 DB',
    imageUrl: '/images/campers/malibu-van-charming.jpg',
    images: ['/images/campers/malibu-van-charming-1.jpg', '/images/campers/malibu-van-charming-2.jpg'],
    pricePerDay: 95,
    beds: 2,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.4,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.79 },
    emptyWeight: 2950,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Doppelbett', 'Kompakte Küche', 'Bad', 'Dinette', 'Heckgarage'],
    availability: [
      { startDate: '2025-03-01', endDate: '2025-03-10' }
    ],
    description: 'Komfortabler Kastenwagen von Malibu mit Doppelbett und durchdachtem Grundriss für Paare.',
    rating: 4.2,
    category: 'Standard',
    badge: 'Paar-Tipp',
    pickupLocations: ['Köln', 'Düsseldorf'],
    location: 'Köln (PLZ 50667)',
    latitude: 50.9375,
    longitude: 6.9603,
    type: 'Kastenwagen',
    manufacturer: 'Malibu',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 95,
      wasteWaterCapacity: 75,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 95,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1300,
      mileageIncluded: 150,
      additionalMileageCost: 0.23,
      cleaningFee: 75
    }
  },
  {
    id: 'dethleffs-pulse-t7051',
    name: 'Dethleffs Pulse T 7051',
    imageUrl: '/images/campers/dethleffs-pulse.jpg',
    images: ['/images/campers/dethleffs-pulse-1.jpg', '/images/campers/dethleffs-pulse-2.jpg'],
    pricePerDay: 169,
    beds: 7,
    seats: 6,
    requiredLicense: 'C1',
    fuelConsumption: 13.2,
    enginePower: 177,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 7.39, width: 2.34, height: 3.40 },
    emptyWeight: 3800,
    maxTotalWeight: 4500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Alkoven', 'Alkoven-Doppelbett', 'Vollküche', 'Separates Bad', 'Etagenbetten', 'Dinette', 'Fahrradträger', 'Markise'],
    availability: [
      { startDate: '2025-06-01', endDate: '2025-06-10' }
    ],
    description: 'Geräumiges Alkoven-Wohnmobil von Dethleffs - ideal für Großfamilien mit bis zu 7 Schlafplätzen.',
    rating: 4.6,
    category: 'Familie',
    badge: 'Familie',
    pickupLocations: ['Berlin'],
    location: 'Berlin (PLZ 10115)',
    type: 'Alkoven',
    manufacturer: 'Dethleffs',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 90,
      waterTankCapacity: 130,
      wasteWaterCapacity: 110,
      electricalSystem: '12V/230V mit Solaranlage',
      heating: 'Truma Combi Heizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 169,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.30,
      weeklyDiscount: 0.15,
      monthlyDiscount: 0.25
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 60, feePercentage: 0 },
        { daysBeforePickup: 30, feePercentage: 30 },
        { daysBeforePickup: 14, feePercentage: 60 },
        { daysBeforePickup: 3, feePercentage: 100 }
      ],
      securityDepositAmount: 2500,
      mileageIncluded: 150,
      additionalMileageCost: 0.35,
      cleaningFee: 150
    }
  },
  {
    id: 'mercedes-marco-polo',
    name: 'Mercedes Marco Polo',
    imageUrl: '/images/campers/mercedes-marco-polo.jpg',
    images: ['/images/campers/mercedes-marco-polo-1.jpg', '/images/campers/mercedes-marco-polo-2.jpg'],
    pricePerDay: 129,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.8,
    enginePower: 190,
    driveType: 'diesel',
    emissionClass: 'Euro 6d',
    dimensions: { length: 5.14, width: 1.93, height: 2.89 },
    emptyWeight: 2650,
    maxTotalWeight: 3200,
    hasTrailerHitch: false,
    features: ['Van', 'Aufstelldach', 'Luxus-Küche', 'Premium-Interieur', 'Klimaautomatik', '230V-Anschluss', 'Multimedia-System'],
    availability: [],
    description: 'Luxuriöser Mercedes Marco Polo - Premium-Van für anspruchsvolle Reisende.',
    rating: 4.7,
    category: 'Luxus',
    badge: 'Luxus',
    pickupLocations: ['Frankfurt'],
    location: 'Frankfurt (PLZ 60311)',
    type: 'Van',
    manufacturer: 'Mercedes-Benz',
    year: 2024,
    specifications: {
      transmission: 'Automatik 9G-Tronic',
      fuelTankCapacity: 70,
      waterTankCapacity: 38,
      wasteWaterCapacity: 30,
      electricalSystem: '12V/230V',
      heating: 'Webasto Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 129,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1800,
      mileageIncluded: 180,
      additionalMileageCost: 0.28,
      cleaningFee: 100
    }
  },
  {
    id: 'fiat-ducato-maxi',
    name: 'Fiat Ducato Maxi',
    imageUrl: '/images/campers/fiat-ducato-maxi.jpg',
    images: ['/images/campers/fiat-ducato-maxi-1.jpg', '/images/campers/fiat-ducato-maxi-2.jpg'],
    pricePerDay: 119,
    beds: 5,
    seats: 5,
    requiredLicense: 'B',
    fuelConsumption: 8.5,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.36, width: 2.05, height: 2.78 },
    emptyWeight: 3200,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Kastenwagen', 'Kastenwagen-Ausbau', 'Heckbett', 'Dinette', 'Küche L-Form', 'Bad mit Dusche', 'Fahrradträger'],
    availability: [
      { startDate: '2025-05-15', endDate: '2025-05-22' }
    ],
    description: 'Praktischer Fiat Ducato Maxi - unser Bestseller mit optimalem Preis-Leistungs-Verhältnis.',
    rating: 4.4,
    category: 'Bestseller',
    badge: 'Bestseller',
    pickupLocations: ['Köln'],
    location: 'Köln (PLZ 50667)',
    type: 'Kastenwagen',
    manufacturer: 'Fiat',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 100,
      wasteWaterCapacity: 80,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi Heizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 119,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.20
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 90
    }
  },
  {
    id: 'buerstner-lyseo-td690',
    name: 'Bürstner Lyseo TD 690',
    imageUrl: '/images/campers/buerstner-lyseo.jpg',
    images: ['/images/campers/buerstner-lyseo-1.jpg', '/images/campers/buerstner-lyseo-2.jpg'],
    pricePerDay: 139,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 9.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.99, width: 2.33, height: 2.89 },
    emptyWeight: 3350,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1300,
    features: ['Teilintegriert', 'Hubbett', 'Panorama-Dachfenster', 'Eco-Package', 'LED-Beleuchtung', 'Solaranlage'],
    availability: [],
    description: 'Umweltfreundlicher Bürstner Lyseo mit Eco-Package und nachhaltigen Materialien.',
    rating: 4.5,
    category: 'Eco',
    badge: 'Eco',
    pickupLocations: ['Stuttgart'],
    location: 'Stuttgart (PLZ 70173)',
    latitude: 48.7758,
    longitude: 9.1829,
    type: 'Teilintegriert',
    manufacturer: 'Bürstner',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 110,
      wasteWaterCapacity: 95,
      electricalSystem: '12V/230V mit 160W Solar',
      heating: 'Truma Combi Eco',
      airConditioning: false
    },
    pricing: {
      basePrice: 139,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.22
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1600,
      mileageIncluded: 160,
      additionalMileageCost: 0.26,
      cleaningFee: 95
    }
  },
  {
    id: 'carthago-c-tourer-i144le',
    name: 'Carthago C-Tourer I 144 LE',
    imageUrl: '/images/campers/carthago-c-tourer.jpg',
    images: ['/images/campers/carthago-c-tourer-1.jpg', '/images/campers/carthago-c-tourer-2.jpg'],
    pricePerDay: 189,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 10.5,
    enginePower: 160,
    driveType: 'diesel',
    emissionClass: 'Euro 6d',
    dimensions: { length: 7.41, width: 2.27, height: 2.95 },
    emptyWeight: 3500,
    maxTotalWeight: 4200,
    hasTrailerHitch: true,
    maxTrailerLoad: 2000,
    features: ['Integriert', 'Luxus-Interieur', 'Premium-Bad', 'Hochwertige Küche', 'Multimedia-Center', 'Automatik-Sat-Anlage', 'Fußbodenheizung'],
    availability: [],
    description: 'Carthago C-Tourer - Luxus pur mit erstklassiger Verarbeitung und Premium-Ausstattung.',
    rating: 4.8,
    category: 'Luxus Plus',
    badge: 'Luxus Plus',
    pickupLocations: ['Düsseldorf'],
    location: 'Düsseldorf (PLZ 40210)',
    latitude: 51.2277,
    longitude: 6.7735,
    type: 'Integriertes Wohnmobil',
    manufacturer: 'Carthago',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 90,
      waterTankCapacity: 140,
      wasteWaterCapacity: 120,
      electricalSystem: '12V/230V/Lithium mit 300W Solar',
      heating: 'Alde Warmwasser-Heizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 189,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.35,
      weeklyDiscount: 0.15,
      monthlyDiscount: 0.28
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 60, feePercentage: 0 },
        { daysBeforePickup: 30, feePercentage: 30 },
        { daysBeforePickup: 14, feePercentage: 60 },
        { daysBeforePickup: 3, feePercentage: 100 }
      ],
      securityDepositAmount: 3000,
      mileageIncluded: 200,
      additionalMileageCost: 0.35,
      cleaningFee: 150
    }
  },
  {
    id: 'hobby-optima-ontour-v65-gf',
    name: 'Hobby Optima OnTour V65 GF',
    imageUrl: '/images/campers/hobby-optima.jpg',
    images: ['/images/campers/hobby-optima-1.jpg', '/images/campers/hobby-optima-2.jpg'],
    pricePerDay: 89,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.6,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.36, width: 2.05, height: 2.64 },
    emptyWeight: 2850,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Grundriss-Flexibilität', 'Kompakte Küche', 'Bad', 'Dinette', 'Heckbett'],
    availability: [
      { startDate: '2025-04-15', endDate: '2025-04-25' }
    ],
    description: 'Flexibler Kastenwagen von Hobby mit variablem Grundriss - ideal für unterschiedliche Reiseansprüche.',
    rating: 4.2,
    category: 'Standard',
    badge: 'Flexibel',
    pickupLocations: ['Hamburg', 'Berlin'],
    location: 'Hamburg (PLZ 20095)',
    type: 'Kastenwagen',
    manufacturer: 'Hobby',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 85,
      wasteWaterCapacity: 70,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 89,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.22,
      cleaningFee: 70
    }
  },
  {
    id: 'ford-nugget-plus',
    name: 'Ford Nugget Plus',
    imageUrl: '/images/campers/ford-nugget-plus.jpg',
    images: ['/images/campers/ford-nugget-plus-1.jpg', '/images/campers/ford-nugget-plus-2.jpg'],
    pricePerDay: 105,
    beds: 4,
    seats: 7,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 170,
    driveType: 'diesel',
    emissionClass: 'Euro 6d',
    dimensions: { length: 5.34, width: 2.04, height: 1.98 },
    emptyWeight: 2450,
    maxTotalWeight: 3200,
    hasTrailerHitch: true,
    maxTrailerLoad: 1400,
    features: ['Van', 'Aufstelldach', 'Küche', 'Bad', 'Dinette', '7 Sitzplätze', 'Allradantrieb optional'],
    availability: [
      { startDate: '2025-09-01', endDate: '2025-09-15' }
    ],
    description: 'Vielseitiger Ford Nugget Plus mit 7 Sitzplätzen - perfekt für große Familien und Gruppen.',
    rating: 4.6,
    category: 'Familie',
    badge: 'Familie',
    pickupLocations: ['München', 'Stuttgart'],
    location: 'München (PLZ 80331)',
    type: 'Van',
    manufacturer: 'Ford',
    year: 2024,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 80,
      waterTankCapacity: 42,
      wasteWaterCapacity: 38,
      electricalSystem: '12V/230V',
      heating: 'Webasto Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 105,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1600,
      mileageIncluded: 160,
      additionalMileageCost: 0.26,
      cleaningFee: 85
    }
  },
  {
    id: 'poessl-roadcruiser-b',
    name: 'Pössl Roadcruiser B',
    imageUrl: '/images/campers/poessl-roadcruiser.jpg',
    images: ['/images/campers/poessl-roadcruiser-1.jpg', '/images/campers/poessl-roadcruiser-2.jpg'],
    pricePerDay: 115,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.7,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.75 },
    emptyWeight: 3000,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1300,
    features: ['Kastenwagen', 'Hubbett', 'Große Küche', 'Separates Bad', 'Garage', 'Multimedia'],
    availability: [
      { startDate: '2025-10-01', endDate: '2025-10-12' }
    ],
    description: 'Innovativer Pössl Roadcruiser mit Hubbett-System - maximaler Komfort auf kompaktem Raum.',
    rating: 4.5,
    category: 'Standard',
    badge: 'Innovation',
    pickupLocations: ['Frankfurt', 'Köln'],
    location: 'Frankfurt (PLZ 60311)',
    type: 'Kastenwagen',
    manufacturer: 'Pössl',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 105,
      wasteWaterCapacity: 88,
      electricalSystem: '12V/230V mit Solaranlage',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 115,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.20
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 90
    }
  },
  {
    id: 'roller-team-zefiro-685',
    name: 'Roller Team Zefiro 685',
    imageUrl: '/images/campers/roller-team-zefiro.jpg',
    images: ['/images/campers/roller-team-zefiro-1.jpg', '/images/campers/roller-team-zefiro-2.jpg'],
    pricePerDay: 129,
    beds: 5,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 9.8,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.99, width: 2.31, height: 2.85 },
    emptyWeight: 3400,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Teilintegriert', 'Festbett', 'Etagenbett', 'L-Küche', 'Bad', 'Garage', 'Solaranlage'],
    availability: [
      { startDate: '2025-11-01', endDate: '2025-11-10' }
    ],
    description: 'Familienfreundlicher Roller Team Zefiro mit Etagenbett - perfekt für Familien mit Kindern.',
    rating: 4.4,
    category: 'Familie',
    badge: 'Familie',
    pickupLocations: ['Stuttgart', 'München'],
    location: 'Stuttgart (PLZ 70173)',
    type: 'Teilintegriert',
    manufacturer: 'Roller Team',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 120,
      wasteWaterCapacity: 100,
      electricalSystem: '12V/230V mit 100W Solar',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 129,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.22,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.20
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1700,
      mileageIncluded: 150,
      additionalMileageCost: 0.27,
      cleaningFee: 95
    }
  },
  {
    id: 'carado-banff-540',
    name: 'Carado Banff 540',
    imageUrl: '/images/campers/carado-banff.jpg',
    images: ['/images/campers/carado-banff-1.jpg', '/images/campers/carado-banff-2.jpg'],
    pricePerDay: 85,
    beds: 2,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.3,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.53 },
    emptyWeight: 2700,
    maxTotalWeight: 3500,
    hasTrailerHitch: false,
    features: ['Van', 'Kompakt-Design', 'Längsküche', 'Bad', 'Dinette', 'Panorama-Dachfenster'],
    availability: [
      { startDate: '2025-12-01', endDate: '2025-12-15' }
    ],
    description: 'Kompakter Carado Banff - ideal für Paare, die Wert auf einfache Handhabung und Effizienz legen.',
    rating: 4.3,
    category: 'Kompakt',
    badge: 'Kompakt',
    pickupLocations: ['Berlin', 'Hamburg'],
    location: 'Berlin (PLZ 10115)',
    type: 'Van',
    manufacturer: 'Carado',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 80,
      wasteWaterCapacity: 65,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 85,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 15 },
        { daysBeforePickup: 7, feePercentage: 30 },
        { daysBeforePickup: 1, feePercentage: 60 }
      ],
      securityDepositAmount: 1100,
      mileageIncluded: 150,
      additionalMileageCost: 0.21,
      cleaningFee: 65
    }
  },
  
  // === FLOTTENERWEITERUNG - Zusätzliche Fahrzeuge für alle Standorte ===
  
  // VW California Ocean Varianten
  {
    id: 'vw-california-ocean-hb-01',
    name: 'VW California Ocean (Hamburg)',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    pricePerDay: 89,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.5,
    enginePower: 150,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2300,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze'],
    availability: [
      { startDate: '2025-03-20', endDate: '2025-03-28' },
      { startDate: '2025-04-05', endDate: '2025-04-20' }
    ],
    description: 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen mit Aufstelldach und Miniküche.',
    rating: 4.4,
    category: 'Kompakt',
    badge: 'Beliebt',
    pickupLocations: ['Hamburg'],
    location: 'Hamburg (PLZ 20457)',
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2023,
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 89,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 80
    }
  },
  {
    id: 'vw-california-ocean-hd-01',
    name: 'VW California Ocean (Heidelberg)',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    pricePerDay: 87,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.5,
    enginePower: 150,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2300,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze'],
    availability: [
      { startDate: '2025-03-18', endDate: '2025-03-25' },
      { startDate: '2025-04-10', endDate: '2025-04-25' }
    ],
    description: 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen mit Aufstelldach und Miniküche.',
    rating: 4.6,
    category: 'Kompakt',
    badge: 'Beliebt',
    pickupLocations: ['Heidelberg'],
    location: 'Heidelberg (PLZ 69115)',
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2022,
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 87,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 80
    }
  },
  {
    id: 'vw-california-ocean-ka-01',
    name: 'VW California Ocean (Karlsruhe)',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    pricePerDay: 88,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.5,
    enginePower: 150,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2300,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze'],
    availability: [
      { startDate: '2025-03-12', endDate: '2025-03-20' },
      { startDate: '2025-04-02', endDate: '2025-04-18' }
    ],
    description: 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen mit Aufstelldach und Miniküche.',
    rating: 4.5,
    category: 'Kompakt',
    badge: 'Beliebt',
    pickupLocations: ['Karlsruhe'],
    location: 'Karlsruhe (PLZ 76137)',
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2023,
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 88,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 80
    }
  },
  {
    id: 'vw-california-ocean-ma-01',
    name: 'VW California Ocean (Mannheim)',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    pricePerDay: 86,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.5,
    enginePower: 150,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2300,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze'],
    availability: [
      { startDate: '2025-03-25', endDate: '2025-04-02' },
      { startDate: '2025-04-15', endDate: '2025-04-30' }
    ],
    description: 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen mit Aufstelldach und Miniküche.',
    rating: 4.3,
    category: 'Kompakt',
    badge: 'Beliebt',
    pickupLocations: ['Mannheim'],
    location: 'Mannheim (PLZ 68161)',
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2021,
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 86,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 80
    }
  },
  
  // Knaus BoxDrive Varianten
  {
    id: 'knaus-boxdrive-fr-01',
    name: 'Knaus BoxDrive (Frankfurt)',
    imageUrl: '/images/campers/knaus-boxdrive.jpg',
    images: ['/images/campers/knaus-boxdrive-1.jpg', '/images/campers/knaus-boxdrive-2.jpg'],
    pricePerDay: 97,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.60 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Küche', 'Bad mit Dusche', 'Dinette', 'Fahrradträger'],
    availability: [
      { startDate: '2025-05-05', endDate: '2025-05-15' }
    ],
    description: 'Kompakter Kastenwagen von Knaus mit durchdachtem Grundriss und allem Komfort für 4 Personen.',
    rating: 4.4,
    category: 'Standard',
    badge: 'Neu',
    pickupLocations: ['Frankfurt'],
    location: 'Frankfurt (PLZ 60549)',
    type: 'Kastenwagen',
    manufacturer: 'Knaus',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 90,
      wasteWaterCapacity: 70,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 97,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.22,
      cleaningFee: 75
    }
  },
  {
    id: 'knaus-boxdrive-ko-01',
    name: 'Knaus BoxDrive (Köln)',
    imageUrl: '/images/campers/knaus-boxdrive.jpg',
    images: ['/images/campers/knaus-boxdrive-1.jpg', '/images/campers/knaus-boxdrive-2.jpg'],
    pricePerDay: 98,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.60 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Küche', 'Bad mit Dusche', 'Dinette', 'Fahrradträger'],
    availability: [
      { startDate: '2025-05-08', endDate: '2025-05-18' }
    ],
    description: 'Kompakter Kastenwagen von Knaus mit durchdachtem Grundriss und allem Komfort für 4 Personen.',
    rating: 4.2,
    category: 'Standard',
    badge: 'Neu',
    pickupLocations: ['Köln'],
    location: 'Köln (PLZ 50679)',
    type: 'Kastenwagen',
    manufacturer: 'Knaus',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 90,
      wasteWaterCapacity: 70,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 98,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.22,
      cleaningFee: 75
    }
  },
  {
    id: 'knaus-boxdrive-st-01',
    name: 'Knaus BoxDrive (Stuttgart)',
    imageUrl: '/images/campers/knaus-boxdrive.jpg',
    images: ['/images/campers/knaus-boxdrive-1.jpg', '/images/campers/knaus-boxdrive-2.jpg'],
    pricePerDay: 99,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.60 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Küche', 'Bad mit Dusche', 'Dinette', 'Fahrradträger'],
    availability: [
      { startDate: '2025-05-02', endDate: '2025-05-12' }
    ],
    description: 'Kompakter Kastenwagen von Knaus mit durchdachtem Grundriss und allem Komfort für 4 Personen.',
    rating: 4.3,
    category: 'Standard',
    badge: 'Neu',
    pickupLocations: ['Stuttgart'],
    location: 'Stuttgart (PLZ 70173)',
    type: 'Kastenwagen',
    manufacturer: 'Knaus',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 90,
      wasteWaterCapacity: 70,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 99,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.22,
      cleaningFee: 75
    }
  },
  {
    id: 'knaus-boxdrive-du-01',
    name: 'Knaus BoxDrive (Düsseldorf)',
    imageUrl: '/images/campers/knaus-boxdrive.jpg',
    images: ['/images/campers/knaus-boxdrive-1.jpg', '/images/campers/knaus-boxdrive-2.jpg'],
    pricePerDay: 96,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.60 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Küche', 'Bad mit Dusche', 'Dinette', 'Fahrradträger'],
    availability: [
      { startDate: '2025-05-10', endDate: '2025-05-20' }
    ],
    description: 'Kompakter Kastenwagen von Knaus mit durchdachtem Grundriss und allem Komfort für 4 Personen.',
    rating: 4.1,
    category: 'Standard',
    badge: 'Neu',
    pickupLocations: ['Düsseldorf'],
    location: 'Düsseldorf (PLZ 40213)',
    type: 'Kastenwagen',
    manufacturer: 'Knaus',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 90,
      wasteWaterCapacity: 70,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 96,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.22,
      cleaningFee: 75
    }
  },
  
  // Weitere VW California Varianten für alle Standorte
  {
    id: 'vw-california-coast-be-01',
    name: 'VW California Coast (Berlin)',
    imageUrl: '/images/campers/vw-california-coast.jpg',
    images: ['/images/campers/vw-california-coast-1.jpg', '/images/campers/vw-california-coast-2.jpg'],
    pricePerDay: 79,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.8,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2280,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Kochbereich', 'Kühlbox', 'Aufbewahrungsschränke', 'Ausziehbares Bett'],
    availability: [
      { startDate: '2025-03-08', endDate: '2025-03-16' },
      { startDate: '2025-04-20', endDate: '2025-05-05' }
    ],
    description: 'VW California Coast - die günstigere Alternative mit allem Wesentlichen für 4 Personen.',
    rating: 4.2,
    category: 'Kompakt',
    badge: 'Preis-Tipp',
    pickupLocations: ['Berlin'],
    location: 'Berlin (PLZ 10115)',
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2021,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V',
      heating: 'Standheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 79,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 45 },
        { daysBeforePickup: 1, feePercentage: 90 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.23,
      cleaningFee: 75
    }
  },
  {
    id: 'vw-california-coast-hb-01',
    name: 'VW California Coast (Hamburg)',
    imageUrl: '/images/campers/vw-california-coast.jpg',
    images: ['/images/campers/vw-california-coast-1.jpg', '/images/campers/vw-california-coast-2.jpg'],
    pricePerDay: 81,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.8,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2280,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Kochbereich', 'Kühlbox', 'Aufbewahrungsschränke', 'Ausziehbares Bett'],
    availability: [
      { startDate: '2025-03-10', endDate: '2025-03-18' },
      { startDate: '2025-04-22', endDate: '2025-05-07' }
    ],
    description: 'VW California Coast - die günstigere Alternative mit allem Wesentlichen für 4 Personen.',
    rating: 4.3,
    category: 'Kompakt',
    badge: 'Preis-Tipp',
    pickupLocations: ['Hamburg'],
    location: 'Hamburg (PLZ 20457)',
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V',
      heating: 'Standheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 81,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 45 },
        { daysBeforePickup: 1, feePercentage: 90 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.23,
      cleaningFee: 75
    }
  },
  {
    id: 'ford-transit-custom-nugget-mu-01',
    name: 'Ford Transit Custom Nugget (München)',
    imageUrl: '/images/campers/ford-nugget.jpg',
    images: ['/images/campers/ford-nugget-1.jpg', '/images/campers/ford-nugget-2.jpg'],
    pricePerDay: 92,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.1,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.34, width: 1.99, height: 1.99 },
    emptyWeight: 2450,
    maxTotalWeight: 3200,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Doppelbett', 'Dinette', 'Westfalia-Ausbau'],
    availability: [
      { startDate: '2025-03-22', endDate: '2025-03-30' },
      { startDate: '2025-04-12', endDate: '2025-04-27' }
    ],
    description: 'Ford Transit Custom Nugget mit Westfalia-Ausbau - kompakt und durchdacht für 4 Personen.',
    rating: 4.4,
    category: 'Kompakt',
    badge: 'Beliebt',
    pickupLocations: ['München'],
    location: 'München (PLZ 80335)',
    type: 'Van',
    manufacturer: 'Ford/Westfalia',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 70,
      waterTankCapacity: 42,
      wasteWaterCapacity: 36,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 92,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.09,
      monthlyDiscount: 0.14
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 22 },
        { daysBeforePickup: 7, feePercentage: 48 },
        { daysBeforePickup: 1, feePercentage: 95 }
      ],
      securityDepositAmount: 1400,
      mileageIncluded: 150,
      additionalMileageCost: 0.24,
      cleaningFee: 78
    }
  },
  {
    id: 'ford-transit-custom-nugget-fr-01',
    name: 'Ford Transit Custom Nugget (Frankfurt)',
    imageUrl: '/images/campers/ford-nugget.jpg',
    images: ['/images/campers/ford-nugget-1.jpg', '/images/campers/ford-nugget-2.jpg'],
    pricePerDay: 94,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.1,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.34, width: 1.99, height: 1.99 },
    emptyWeight: 2450,
    maxTotalWeight: 3200,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Doppelbett', 'Dinette', 'Westfalia-Ausbau'],
    availability: [
      { startDate: '2025-03-24', endDate: '2025-04-01' },
      { startDate: '2025-04-14', endDate: '2025-04-29' }
    ],
    description: 'Ford Transit Custom Nugget mit Westfalia-Ausbau - kompakt und durchdacht für 4 Personen.',
    rating: 4.5,
    category: 'Kompakt',
    badge: 'Beliebt',
    pickupLocations: ['Frankfurt'],
    location: 'Frankfurt (PLZ 60549)',
    type: 'Van',
    manufacturer: 'Ford/Westfalia',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 70,
      waterTankCapacity: 42,
      wasteWaterCapacity: 36,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 94,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.09,
      monthlyDiscount: 0.14
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 22 },
        { daysBeforePickup: 7, feePercentage: 48 },
        { daysBeforePickup: 1, feePercentage: 95 }
      ],
      securityDepositAmount: 1400,
      mileageIncluded: 150,
      additionalMileageCost: 0.24,
      cleaningFee: 78
    }
  },
  {
    id: 'mercedes-marco-polo-ko-01',
    name: 'Mercedes Marco Polo (Köln)',
    imageUrl: '/images/campers/mercedes-marco-polo.jpg',
    images: ['/images/campers/mercedes-marco-polo-1.jpg', '/images/campers/mercedes-marco-polo-2.jpg'],
    pricePerDay: 105,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.9,
    enginePower: 163,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.14, width: 1.93, height: 1.98 },
    emptyWeight: 2500,
    maxTotalWeight: 3200,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Küche', 'Kühlschrank', 'Doppelbett', 'Dinette', 'Premium-Ausstattung'],
    availability: [
      { startDate: '2025-03-28', endDate: '2025-04-05' },
      { startDate: '2025-04-18', endDate: '2025-05-03' }
    ],
    description: 'Mercedes Marco Polo - Premium-Campingvan mit luxuriöser Ausstattung und hohem Komfort.',
    rating: 4.6,
    category: 'Premium',
    badge: 'Premium',
    pickupLocations: ['Köln'],
    location: 'Köln (PLZ 50679)',
    type: 'Van',
    manufacturer: 'Mercedes-Benz',
    year: 2023,
    specifications: {
      transmission: 'Automatik 9G-Tronic',
      fuelTankCapacity: 70,
      waterTankCapacity: 40,
      wasteWaterCapacity: 35,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 105,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1800,
      mileageIncluded: 150,
      additionalMileageCost: 0.28,
      cleaningFee: 85
    }
  },
  {
    id: 'mercedes-marco-polo-st-01',
    name: 'Mercedes Marco Polo (Stuttgart)',
    imageUrl: '/images/campers/mercedes-marco-polo.jpg',
    images: ['/images/campers/mercedes-marco-polo-1.jpg', '/images/campers/mercedes-marco-polo-2.jpg'],
    pricePerDay: 107,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.9,
    enginePower: 163,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.14, width: 1.93, height: 1.98 },
    emptyWeight: 2500,
    maxTotalWeight: 3200,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Küche', 'Kühlschrank', 'Doppelbett', 'Dinette', 'Premium-Ausstattung'],
    availability: [
      { startDate: '2025-03-30', endDate: '2025-04-07' },
      { startDate: '2025-04-20', endDate: '2025-05-05' }
    ],
    description: 'Mercedes Marco Polo - Premium-Campingvan mit luxuriöser Ausstattung und hohem Komfort.',
    rating: 4.7,
    category: 'Premium',
    badge: 'Premium',
    pickupLocations: ['Stuttgart'],
    location: 'Stuttgart (PLZ 70173)',
    type: 'Van',
    manufacturer: 'Mercedes-Benz',
    year: 2024,
    specifications: {
      transmission: 'Automatik 9G-Tronic',
      fuelTankCapacity: 70,
      waterTankCapacity: 40,
      wasteWaterCapacity: 35,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 107,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1800,
      mileageIncluded: 150,
      additionalMileageCost: 0.28,
      cleaningFee: 85
    }
  },
  
  // Weitere Familien-Wohnmobile
  {
    id: 'fiat-ducato-weinsberg-be-01',
    name: 'Fiat Ducato Weinsberg (Berlin)',
    imageUrl: '/images/campers/fiat-ducato-weinsberg.jpg',
    images: ['/images/campers/fiat-ducato-weinsberg-1.jpg', '/images/campers/fiat-ducato-weinsberg-2.jpg'],
    pricePerDay: 115,
    beds: 6,
    seats: 6,
    requiredLicense: 'B',
    fuelConsumption: 9.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.99, width: 2.30, height: 2.85 },
    emptyWeight: 3200,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1300,
    features: ['Alkoven', 'Große Küche', 'Bad mit Dusche', 'Dinette', 'Viel Stauraum', 'Familientauglich'],
    availability: [
      { startDate: '2025-04-05', endDate: '2025-04-15' },
      { startDate: '2025-05-01', endDate: '2025-05-20' }
    ],
    description: 'Geräumiges Familien-Wohnmobil auf Fiat Ducato Basis mit Alkoven für bis zu 6 Personen.',
    rating: 4.3,
    category: 'Familie',
    badge: 'Familientipp',
    pickupLocations: ['Berlin'],
    location: 'Berlin (PLZ 10115)',
    type: 'Alkoven',
    manufacturer: 'Weinsberg/Fiat',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 90,
      waterTankCapacity: 130,
      wasteWaterCapacity: 110,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 115,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.22,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 30 },
        { daysBeforePickup: 7, feePercentage: 60 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 2000,
      mileageIncluded: 150,
      additionalMileageCost: 0.30,
      cleaningFee: 95
    }
  },
  {
    id: 'fiat-ducato-weinsberg-hb-01',
    name: 'Fiat Ducato Weinsberg (Hamburg)',
    imageUrl: '/images/campers/fiat-ducato-weinsberg.jpg',
    images: ['/images/campers/fiat-ducato-weinsberg-1.jpg', '/images/campers/fiat-ducato-weinsberg-2.jpg'],
    pricePerDay: 117,
    beds: 6,
    seats: 6,
    requiredLicense: 'B',
    fuelConsumption: 9.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.99, width: 2.30, height: 2.85 },
    emptyWeight: 3200,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1300,
    features: ['Alkoven', 'Große Küche', 'Bad mit Dusche', 'Dinette', 'Viel Stauraum', 'Familientauglich'],
    availability: [
      { startDate: '2025-04-07', endDate: '2025-04-17' },
      { startDate: '2025-05-03', endDate: '2025-05-22' }
    ],
    description: 'Geräumiges Familien-Wohnmobil auf Fiat Ducato Basis mit Alkoven für bis zu 6 Personen.',
    rating: 4.4,
    category: 'Familie',
    badge: 'Familientipp',
    pickupLocations: ['Hamburg'],
    location: 'Hamburg (PLZ 20457)',
    type: 'Alkoven',
    manufacturer: 'Weinsberg/Fiat',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 90,
      waterTankCapacity: 130,
      wasteWaterCapacity: 110,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 117,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.22,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 30 },
        { daysBeforePickup: 7, feePercentage: 60 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 2000,
      mileageIncluded: 150,
      additionalMileageCost: 0.30,
      cleaningFee: 95
    }
  },
  {
    id: 'poessl-roadcar-hd-01',
    name: 'Pössl Roadcar R (Heidelberg)',
    imageUrl: '/images/campers/poessl-roadcar.jpg',
    images: ['/images/campers/poessl-roadcar-1.jpg', '/images/campers/poessl-roadcar-2.jpg'],
    pricePerDay: 102,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.5,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.75 },
    emptyWeight: 2900,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Längsbett', 'Kompakte Küche', 'Bad mit Dusche', 'Garage'],
    availability: [
      { startDate: '2025-04-10', endDate: '2025-04-20' },
      { startDate: '2025-05-05', endDate: '2025-05-25' }
    ],
    description: 'Pössl Roadcar R - kompakter Kastenwagen mit durchdachtem Layout für 4 Personen.',
    rating: 4.2,
    category: 'Standard',
    badge: 'Neu',
    pickupLocations: ['Heidelberg'],
    location: 'Heidelberg (PLZ 69115)',
    type: 'Kastenwagen',
    manufacturer: 'Pössl',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 110,
      wasteWaterCapacity: 95,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 102,
      lowSeasonMultiplier: 0.89,
      highSeasonMultiplier: 1.19,
      weeklyDiscount: 0.09,
      monthlyDiscount: 0.13
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 95 }
      ],
      securityDepositAmount: 1600,
      mileageIncluded: 150,
      additionalMileageCost: 0.26,
      cleaningFee: 82
    }
  },
  
  // Finale Flottenerweiterung - weitere Varianten für alle Standorte
  {
    id: 'adria-twin-supreme-640slx-be-02',
    name: 'Adria Twin Supreme 640SLX (Berlin #2)',
    imageUrl: '/images/campers/adria-twin-supreme-640slx/front.jpg',
    images: ['/images/campers/adria-twin-supreme-640slx/interior.jpg', '/images/campers/adria-twin-supreme-640slx/kitchen.jpg'],
    pricePerDay: 95,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.3,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.40, width: 2.30, height: 2.84 },
    emptyWeight: 2950,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Längsbett', 'Kompakte Küche', 'Bad mit Dusche', 'Garage', 'Smart-Home'],
    availability: [
      { startDate: '2025-03-15', endDate: '2025-03-25' },
      { startDate: '2025-04-08', endDate: '2025-04-22' }
    ],
    description: 'Adria Twin Supreme mit elegantem Design und modernster Ausstattung.',
    rating: 4.4,
    category: 'Standard',
    badge: 'Beliebt',
    pickupLocations: ['Berlin'],
    location: 'Berlin (PLZ 10115)',
    type: 'Kastenwagen',
    manufacturer: 'Adria',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 110,
      wasteWaterCapacity: 95,
      electricalSystem: '12V/230V mit Solaranlage',
      heating: 'Truma Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 95,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.09,
      monthlyDiscount: 0.14
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 95 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 80
    }
  },
  {
    id: 'buerstner-lyseo-td690-hb-02',
    name: 'Bürstner Lyseo TD690 (Hamburg #2)',
    imageUrl: '/images/campers/buerstner-lyseo-td690/front.jpg',
    images: ['/images/campers/buerstner-lyseo-td690/interior.jpg', '/images/campers/buerstner-lyseo-td690/bedroom.jpg'],
    pricePerDay: 118,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 9.1,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.90, width: 2.30, height: 2.85 },
    emptyWeight: 3150,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1400,
    features: ['Teilintegriert', 'Querbett', 'L-Küche', 'Separates Bad', 'Garage', 'Panoramafenster'],
    availability: [
      { startDate: '2025-04-03', endDate: '2025-04-13' },
      { startDate: '2025-05-08', endDate: '2025-05-28' }
    ],
    description: 'Bürstner Lyseo TD690 - Premium teilintegriertes Wohnmobil mit durchdachtem Grundriss.',
    rating: 4.6,
    category: 'Premium',
    badge: 'Premium',
    pickupLocations: ['Hamburg'],
    location: 'Hamburg (PLZ 20457)',
    type: 'Teilintegriert',
    manufacturer: 'Bürstner',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 90,
      waterTankCapacity: 140,
      wasteWaterCapacity: 120,
      electricalSystem: '12V/230V mit Lithium',
      heating: 'Truma Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 118,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 30 },
        { daysBeforePickup: 7, feePercentage: 60 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 2200,
      mileageIncluded: 150,
      additionalMileageCost: 0.32,
      cleaningFee: 100
    }
  },
  {
    id: 'carado-banff-540-mu-02',
    name: 'Carado Banff 540 (München #2)',
    imageUrl: '/images/campers/carado-banff-540/front.jpg',
    images: ['/images/campers/carado-banff-540/interior.jpg', '/images/campers/carado-banff-540/kitchen.jpg'],
    pricePerDay: 103,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.7,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.64 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Kompakte Küche', 'Bad mit Cassette-WC', 'Fahrradträger'],
    availability: [
      { startDate: '2025-04-01', endDate: '2025-04-11' },
      { startDate: '2025-05-01', endDate: '2025-05-21' }
    ],
    description: 'Carado Banff 540 - solider Kastenwagen für Outdoor-Enthusiasten.',
    rating: 4.2,
    category: 'Standard',
    badge: 'Outdoor',
    pickupLocations: ['München'],
    location: 'München (PLZ 80335)',
    type: 'Kastenwagen',
    manufacturer: 'Carado',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 100,
      wasteWaterCapacity: 90,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 103,
      lowSeasonMultiplier: 0.87,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 90 }
      ],
      securityDepositAmount: 1600,
      mileageIncluded: 150,
      additionalMileageCost: 0.26,
      cleaningFee: 85
    }
  },
  {
    id: 'vw-california-ocean-fr-02',
    name: 'VW California Ocean (Frankfurt #2)',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    pricePerDay: 91,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.5,
    enginePower: 150,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2300,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze'],
    availability: [
      { startDate: '2025-03-18', endDate: '2025-03-28' },
      { startDate: '2025-04-06', endDate: '2025-04-20' }
    ],
    description: 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen mit Aufstelldach und Miniküche.',
    rating: 4.6,
    category: 'Kompakt',
    badge: 'Beliebt',
    pickupLocations: ['Frankfurt'],
    location: 'Frankfurt (PLZ 60549)',
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2023,
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 91,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 80
    }
  },
  {
    id: 'knaus-boxdrive-hd-02',
    name: 'Knaus BoxDrive (Heidelberg #2)',
    imageUrl: '/images/campers/knaus-boxdrive.jpg',
    images: ['/images/campers/knaus-boxdrive-1.jpg', '/images/campers/knaus-boxdrive-2.jpg'],
    pricePerDay: 101,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.60 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Küche', 'Bad mit Dusche', 'Dinette', 'Fahrradträger'],
    availability: [
      { startDate: '2025-05-03', endDate: '2025-05-13' }
    ],
    description: 'Kompakter Kastenwagen von Knaus mit durchdachtem Grundriss und allem Komfort für 4 Personen.',
    rating: 4.4,
    category: 'Standard',
    badge: 'Neu',
    pickupLocations: ['Heidelberg'],
    location: 'Heidelberg (PLZ 69115)',
    type: 'Kastenwagen',
    manufacturer: 'Knaus',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 75,
      waterTankCapacity: 90,
      wasteWaterCapacity: 70,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 101,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 80 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.22,
      cleaningFee: 75
    }
  },
  {
    id: 'mercedes-marco-polo-ka-02',
    name: 'Mercedes Marco Polo (Karlsruhe #2)',
    imageUrl: '/images/campers/mercedes-marco-polo.jpg',
    images: ['/images/campers/mercedes-marco-polo-1.jpg', '/images/campers/mercedes-marco-polo-2.jpg'],
    pricePerDay: 108,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.9,
    enginePower: 163,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.14, width: 1.93, height: 1.98 },
    emptyWeight: 2500,
    maxTotalWeight: 3200,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Küche', 'Kühlschrank', 'Doppelbett', 'Dinette', 'Premium-Ausstattung'],
    availability: [
      { startDate: '2025-04-02', endDate: '2025-04-12' },
      { startDate: '2025-05-05', endDate: '2025-05-25' }
    ],
    description: 'Mercedes Marco Polo - Premium-Campingvan mit luxuriöser Ausstattung und hohem Komfort.',
    rating: 4.8,
    category: 'Premium',
    badge: 'Premium',
    pickupLocations: ['Karlsruhe'],
    location: 'Karlsruhe (PLZ 76137)',
    type: 'Van',
    manufacturer: 'Mercedes-Benz',
    year: 2024,
    specifications: {
      transmission: 'Automatik 9G-Tronic',
      fuelTankCapacity: 70,
      waterTankCapacity: 40,
      wasteWaterCapacity: 35,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 108,
      lowSeasonMultiplier: 0.90,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1800,
      mileageIncluded: 150,
      additionalMileageCost: 0.28,
      cleaningFee: 85
    }
  },
  {
    id: 'ford-transit-custom-nugget-ma-02',
    name: 'Ford Transit Custom Nugget (Mannheim #2)',
    imageUrl: '/images/campers/ford-nugget.jpg',
    images: ['/images/campers/ford-nugget-1.jpg', '/images/campers/ford-nugget-2.jpg'],
    pricePerDay: 96,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.1,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.34, width: 1.99, height: 1.99 },
    emptyWeight: 2450,
    maxTotalWeight: 3200,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Doppelbett', 'Dinette', 'Westfalia-Ausbau'],
    availability: [
      { startDate: '2025-04-04', endDate: '2025-04-14' },
      { startDate: '2025-05-02', endDate: '2025-05-22' }
    ],
    description: 'Ford Transit Custom Nugget mit Westfalia-Ausbau - kompakt und durchdacht für 4 Personen.',
    rating: 4.3,
    category: 'Kompakt',
    badge: 'Beliebt',
    pickupLocations: ['Mannheim'],
    location: 'Mannheim (PLZ 68161)',
    type: 'Van',
    manufacturer: 'Ford/Westfalia',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 70,
      waterTankCapacity: 42,
      wasteWaterCapacity: 36,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 96,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.09,
      monthlyDiscount: 0.14
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 22 },
        { daysBeforePickup: 7, feePercentage: 48 },
        { daysBeforePickup: 1, feePercentage: 95 }
      ],
      securityDepositAmount: 1400,
      mileageIncluded: 150,
      additionalMileageCost: 0.24,
      cleaningFee: 78
    }
  },
  {
    id: 'vw-california-coast-du-02',
    name: 'VW California Coast (Düsseldorf #2)',
    imageUrl: '/images/campers/vw-california-coast.jpg',
    images: ['/images/campers/vw-california-coast-1.jpg', '/images/campers/vw-california-coast-2.jpg'],
    pricePerDay: 82,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.8,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2280,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Kochbereich', 'Kühlbox', 'Aufbewahrungsschränke', 'Ausziehbares Bett'],
    availability: [
      { startDate: '2025-03-12', endDate: '2025-03-22' },
      { startDate: '2025-04-25', endDate: '2025-05-10' }
    ],
    description: 'VW California Coast - die günstigere Alternative mit allem Wesentlichen für 4 Personen.',
    rating: 4.1,
    category: 'Kompakt',
    badge: 'Preis-Tipp',
    pickupLocations: ['Düsseldorf'],
    location: 'Düsseldorf (PLZ 40213)',
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2021,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V',
      heating: 'Standheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 82,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 45 },
        { daysBeforePickup: 1, feePercentage: 90 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 150,
      additionalMileageCost: 0.23,
      cleaningFee: 75
    }
  },
  
  // Zusätzliche Varianten für komplette Abdeckung aller Standorte
  {
    id: 'poessl-roadcamp-be-03',
    name: 'Pössl RoadCamp R (Berlin #3)',
    imageUrl: '/images/campers/poessl-roadcamp.jpg',
    images: ['/images/campers/poessl-roadcamp-1.jpg', '/images/campers/poessl-roadcamp-2.jpg'],
    pricePerDay: 85,
    beds: 2,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.9,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.52 },
    emptyWeight: 2650,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1000,
    features: ['Kastenwagen', 'Querbett', 'Miniküche', 'Kompaktbad', 'Garage', 'Einsteigerfreundlich'],
    availability: [
      { startDate: '2025-03-08', endDate: '2025-03-18' },
      { startDate: '2025-04-28', endDate: '2025-05-12' }
    ],
    description: 'Pössl RoadCamp R - der ideale Einstieg in die Welt der Kastenwagen für 2 Personen.',
    rating: 4.0,
    category: 'Kompakt',
    badge: 'Einsteiger',
    pickupLocations: ['Berlin'],
    location: 'Berlin (PLZ 10115)',
    type: 'Kastenwagen',
    manufacturer: 'Pössl',
    year: 2021,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 80,
      wasteWaterCapacity: 70,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 85,
      lowSeasonMultiplier: 0.82,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.11,
      monthlyDiscount: 0.16
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 20 },
        { daysBeforePickup: 7, feePercentage: 40 },
        { daysBeforePickup: 1, feePercentage: 85 }
      ],
      securityDepositAmount: 1300,
      mileageIncluded: 150,
      additionalMileageCost: 0.22,
      cleaningFee: 70
    }
  },
  {
    id: 'laika-kosmo-campervan-hb-03',
    name: 'Laika Kosmo Campervan (Hamburg #3)',
    imageUrl: '/images/campers/laika-kosmo.jpg',
    images: ['/images/campers/laika-kosmo-1.jpg', '/images/campers/laika-kosmo-2.jpg'],
    pricePerDay: 125,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.9,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.65 },
    emptyWeight: 3050,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1300,
    features: ['Kastenwagen', 'Hubbett', 'Vollküche', 'Großes Bad', 'Garage', 'Premium-Design'],
    availability: [
      { startDate: '2025-04-08', endDate: '2025-04-18' },
      { startDate: '2025-05-15', endDate: '2025-06-05' }
    ],
    description: 'Laika Kosmo Campervan - italienisches Premium-Design mit innovativen Lösungen.',
    rating: 4.7,
    category: 'Premium',
    badge: 'Premium',
    pickupLocations: ['Hamburg'],
    location: 'Hamburg (PLZ 20457)',
    type: 'Kastenwagen',
    manufacturer: 'Laika',
    year: 2024,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 75,
      waterTankCapacity: 120,
      wasteWaterCapacity: 100,
      electricalSystem: '12V/230V mit Lithium',
      heating: 'Truma Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 125,
      lowSeasonMultiplier: 0.92,
      highSeasonMultiplier: 1.28,
      weeklyDiscount: 0.07,
      monthlyDiscount: 0.10
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 30 },
        { daysBeforePickup: 7, feePercentage: 65 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 2500,
      mileageIncluded: 150,
      additionalMileageCost: 0.35,
      cleaningFee: 110
    }
  },
  {
    id: 'carthago-chic-e-line-i51-mu-03',
    name: 'Carthago Chic E-Line I51 (München #3)',
    imageUrl: '/images/campers/carthago-chic-e-line-i51/front.jpg',
    images: ['/images/campers/carthago-chic-e-line-i51/interior.jpg', '/images/campers/carthago-chic-e-line-i51/bedroom.jpg'],
    pricePerDay: 165,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 9.8,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 7.48, width: 2.30, height: 2.95 },
    emptyWeight: 3400,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1600,
    features: ['Vollintegriert', 'Hubbett', 'Luxusküche', 'Großes Bad', 'Panorama-Lounge', 'Carthago-Qualität'],
    availability: [
      { startDate: '2025-04-20', endDate: '2025-05-05' },
      { startDate: '2025-06-01', endDate: '2025-06-20' }
    ],
    description: 'Carthago Chic E-Line I51 - Vollintegriertes Luxus-Wohnmobil der Spitzenklasse.',
    rating: 4.9,
    category: 'Luxus',
    badge: 'Luxus',
    pickupLocations: ['München'],
    location: 'München (PLZ 80335)',
    type: 'Vollintegriert',
    manufacturer: 'Carthago',
    year: 2024,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 90,
      waterTankCapacity: 180,
      wasteWaterCapacity: 150,
      electricalSystem: '12V/230V mit Lithium-Solaranlage',
      heating: 'Alde Warmwasser-Heizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 165,
      lowSeasonMultiplier: 0.95,
      highSeasonMultiplier: 1.35,
      weeklyDiscount: 0.05,
      monthlyDiscount: 0.08
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 35 },
        { daysBeforePickup: 7, feePercentage: 70 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 3500,
      mileageIncluded: 150,
      additionalMileageCost: 0.40,
      cleaningFee: 150
    }
  },
  {
    id: 'dethleffs-pulse-t7051-fr-03',
    name: 'Dethleffs Pulse T7051 (Frankfurt #3)',
    imageUrl: '/images/campers/dethleffs-pulse-t7051/front.jpg',
    images: ['/images/campers/dethleffs-pulse-t7051/interior.jpg', '/images/campers/dethleffs-pulse-t7051/kitchen.jpg'],
    pricePerDay: 142,
    beds: 5,
    seats: 5,
    requiredLicense: 'B',
    fuelConsumption: 9.3,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 7.05, width: 2.30, height: 2.89 },
    emptyWeight: 3300,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Teilintegriert', 'Einzelbetten', 'L-Küche', 'Separates Bad', 'Hubbett', 'Familienfreundlich'],
    availability: [
      { startDate: '2025-04-12', endDate: '2025-04-25' },
      { startDate: '2025-05-18', endDate: '2025-06-08' }
    ],
    description: 'Dethleffs Pulse T7051 - geräumiges Familien-Wohnmobil mit Einzelbetten und Hubbett.',
    rating: 4.5,
    category: 'Familie',
    badge: 'Familientipp',
    pickupLocations: ['Frankfurt'],
    location: 'Frankfurt (PLZ 60549)',
    type: 'Teilintegriert',
    manufacturer: 'Dethleffs',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 90,
      waterTankCapacity: 150,
      wasteWaterCapacity: 130,
      electricalSystem: '12V/230V mit Solaranlage',
      heating: 'Truma Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 142,
      lowSeasonMultiplier: 0.88,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 30 },
        { daysBeforePickup: 7, feePercentage: 60 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 2800,
      mileageIncluded: 150,
      additionalMileageCost: 0.35,
      cleaningFee: 120
    }
  },
  {
    id: 'concorde-liner-plus-996l-ko-03',
    name: 'Concorde Liner Plus 996L (Köln #3)',
    imageUrl: '/images/campers/concorde-liner-plus-996l/front.jpg',
    images: ['/images/campers/concorde-liner-plus-996l/interior.jpg', '/images/campers/concorde-liner-plus-996l/bedroom.jpg'],
    pricePerDay: 178,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 10.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 8.95, width: 2.30, height: 3.15 },
    emptyWeight: 3450,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1600,
    features: ['Vollintegriert', 'Doppelbett', 'Vollküche', 'Luxusbad', 'Garage', 'Premium-Ausstattung'],
    availability: [
      { startDate: '2025-05-10', endDate: '2025-05-25' },
      { startDate: '2025-06-15', endDate: '2025-07-05' }
    ],
    description: 'Concorde Liner Plus 996L - Luxus-Vollintegriertes mit außergewöhnlichem Komfort.',
    rating: 4.8,
    category: 'Luxus',
    badge: 'Luxus',
    pickupLocations: ['Köln'],
    location: 'Köln (PLZ 50679)',
    type: 'Vollintegriert',
    manufacturer: 'Concorde',
    year: 2024,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 90,
      waterTankCapacity: 200,
      wasteWaterCapacity: 180,
      electricalSystem: '12V/230V mit Lithium-Solar',
      heating: 'Alde Warmwasser-Heizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 178,
      lowSeasonMultiplier: 0.95,
      highSeasonMultiplier: 1.40,
      weeklyDiscount: 0.05,
      monthlyDiscount: 0.08
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 40 },
        { daysBeforePickup: 7, feePercentage: 75 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 4000,
      mileageIncluded: 150,
      additionalMileageCost: 0.45,
      cleaningFee: 180
    }
  },
  {
    id: 'hobby-optima-t70hfl-st-03',
    name: 'Hobby Optima T70HFL (Stuttgart #3)',
    imageUrl: '/images/campers/hobby-optima.jpg',
    images: ['/images/campers/hobby-optima-1.jpg', '/images/campers/hobby-optima-2.jpg'],
    pricePerDay: 128,
    beds: 4,
    seats: 5,
    requiredLicense: 'B',
    fuelConsumption: 9.1,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.99, width: 2.30, height: 2.89 },
    emptyWeight: 3250,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1400,
    features: ['Teilintegriert', 'Hubbett', 'L-Küche', 'Großes Bad', 'Dinette', 'Hobby-Qualität'],
    availability: [
      { startDate: '2025-04-15', endDate: '2025-04-28' },
      { startDate: '2025-05-20', endDate: '2025-06-10' }
    ],
    description: 'Hobby Optima T70HFL - bewährtes teilintegriertes Wohnmobil mit Hubbett und großzügigem Raum.',
    rating: 4.4,
    category: 'Standard',
    badge: 'Bewährt',
    pickupLocations: ['Stuttgart'],
    location: 'Stuttgart (PLZ 70173)',
    type: 'Teilintegriert',
    manufacturer: 'Hobby',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 90,
      waterTankCapacity: 140,
      wasteWaterCapacity: 120,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 128,
      lowSeasonMultiplier: 0.87,
      highSeasonMultiplier: 1.22,
      weeklyDiscount: 0.09,
      monthlyDiscount: 0.13
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 28 },
        { daysBeforePickup: 7, feePercentage: 55 },
        { daysBeforePickup: 1, feePercentage: 95 }
      ],
      securityDepositAmount: 2300,
      mileageIncluded: 150,
      additionalMileageCost: 0.32,
      cleaningFee: 105
    }
  },
  {
    id: 'rapido-v43-du-03',
    name: 'Rapido V43 (Düsseldorf #3)',
    imageUrl: '/images/campers/rapido-v43.jpg',
    images: ['/images/campers/rapido-v43-1.jpg', '/images/campers/rapido-v43-2.jpg'],
    pricePerDay: 89,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.0,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.54 },
    emptyWeight: 2700,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1100,
    features: ['Kastenwagen', 'Hubbett', 'Miniküche', 'Kompaktbad', 'Garage', 'Französisches Design'],
    availability: [
      { startDate: '2025-03-25', endDate: '2025-04-05' },
      { startDate: '2025-05-12', endDate: '2025-06-02' }
    ],
    description: 'Rapido V43 - französischer Kastenwagen mit charmantem Design und cleveren Lösungen.',
    rating: 4.2,
    category: 'Kompakt',
    badge: 'Design-Tipp',
    pickupLocations: ['Düsseldorf'],
    location: 'Düsseldorf (PLZ 40213)',
    type: 'Kastenwagen',
    manufacturer: 'Rapido',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 95,
      wasteWaterCapacity: 85,
      electricalSystem: '12V/230V',
      heating: 'Truma Combi',
      airConditioning: false
    },
    pricing: {
      basePrice: 89,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.17,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 22 },
        { daysBeforePickup: 7, feePercentage: 45 },
        { daysBeforePickup: 1, feePercentage: 88 }
      ],
      securityDepositAmount: 1400,
      mileageIncluded: 150,
      additionalMileageCost: 0.24,
      cleaningFee: 75
    }
  },
  // Variationen der beliebten Modelle mit verschiedenen Standorten
  {
    id: 'vw-california-ocean-hamburg',
    name: 'VW California Ocean (Hamburg)',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    pricePerDay: 92,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.5,
    enginePower: 150,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2300,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze', 'LED-Beleuchtung'],
    availability: [
      { startDate: '2025-03-20', endDate: '2025-03-30' },
      { startDate: '2025-05-01', endDate: '2025-05-15' }
    ],
    description: 'VW California Ocean in Hamburg - perfekt für Nordsee-Touren mit erweiteter LED-Ausstattung.',
    rating: 4.6,
    category: 'Kompakt',
    badge: 'Verfügbar',
    pickupLocations: ['Hamburg', 'Bremen'],
    location: 'Hamburg (PLZ 20457)',
    latitude: 53.5438,
    longitude: 9.9731,
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2023,
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 92,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 150,
      additionalMileageCost: 0.25,
      cleaningFee: 80
    }
  },
  {
    id: 'vw-california-ocean-cologne',
    name: 'VW California Ocean (Köln)',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    pricePerDay: 86,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.5,
    enginePower: 150,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2300,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Miniküche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze', 'Solaranlage'],
    availability: [
      { startDate: '2025-04-05', endDate: '2025-04-20' },
      { startDate: '2025-06-01', endDate: '2025-06-14' }
    ],
    description: 'VW California Ocean in Köln mit Solaranlage - ideal für autarkes Camping in Rheinland.',
    rating: 4.4,
    category: 'Kompakt',
    badge: 'Eco',
    pickupLocations: ['Köln', 'Düsseldorf', 'Bonn'],
    location: 'Köln (PLZ 50667)',
    latitude: 50.9375,
    longitude: 6.9603,
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2022,
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V + Solar',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 86,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 200,
      additionalMileageCost: 0.22,
      cleaningFee: 75
    }
  },
  {
    id: 'knaus-boxdrive-munich',
    name: 'Knaus BoxDrive (München)',
    imageUrl: '/images/campers/knaus-boxdrive.jpg',
    images: ['/images/campers/knaus-boxdrive-1.jpg', '/images/campers/knaus-boxdrive-2.jpg'],
    pricePerDay: 102,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.60 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Küche', 'Bad mit Dusche', 'Dinette', 'Fahrradträger', 'Markise'],
    availability: [
      { startDate: '2025-05-15', endDate: '2025-05-25' },
      { startDate: '2025-07-01', endDate: '2025-07-14' }
    ],
    description: 'Knaus BoxDrive in München mit Markise - perfekt für Alpen-Abenteuer.',
    rating: 4.5,
    category: 'Standard',
    badge: 'Alpen-Ready',
    pickupLocations: ['München', 'Augsburg'],
    location: 'München (PLZ 80331)',
    latitude: 48.1351,
    longitude: 11.5820,
    type: 'Kastenwagen',
    manufacturer: 'Knaus',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 95,
      wasteWaterCapacity: 85,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 102,
      lowSeasonMultiplier: 0.80,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.08,
      monthlyDiscount: 0.12
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1800,
      mileageIncluded: 150,
      additionalMileageCost: 0.28,
      cleaningFee: 90
    }
  },
  {
    id: 'knaus-boxdrive-berlin',
    name: 'Knaus BoxDrive (Berlin)',
    imageUrl: '/images/campers/knaus-boxdrive.jpg',
    images: ['/images/campers/knaus-boxdrive-1.jpg', '/images/campers/knaus-boxdrive-2.jpg'],
    pricePerDay: 96,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.60 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbett', 'Küche', 'Bad mit Dusche', 'Dinette', 'Fahrradträger', 'City-Paket'],
    availability: [
      { startDate: '2025-04-12', endDate: '2025-04-26' },
      { startDate: '2025-06-15', endDate: '2025-06-30' }
    ],
    description: 'Knaus BoxDrive in Berlin mit City-Paket - kompakt für Stadttouren und Ausflüge.',
    rating: 4.2,
    category: 'Standard',
    badge: 'City-Paket',
    pickupLocations: ['Berlin', 'Potsdam'],
    location: 'Berlin (PLZ 10178)',
    latitude: 52.5200,
    longitude: 13.4050,
    type: 'Kastenwagen',
    manufacturer: 'Knaus',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 95,
      wasteWaterCapacity: 85,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 96,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1600,
      mileageIncluded: 180,
      additionalMileageCost: 0.26,
      cleaningFee: 85
    }
  },
  {
    id: 'hymer-b-mc-t580-frankfurt',
    name: 'Hymer B-MC T580 (Frankfurt)',
    imageUrl: '/images/campers/hymer-b-mc-t580.jpg',
    images: ['/images/campers/hymer-b-mc-t580-1.jpg', '/images/campers/hymer-b-mc-t580-2.jpg'],
    pricePerDay: 135,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 9.5,
    enginePower: 177,
    driveType: 'diesel',
    emissionClass: 'Euro 6d',
    dimensions: { length: 7.42, width: 2.32, height: 2.89 },
    emptyWeight: 3200,
    maxTotalWeight: 4250,
    hasTrailerHitch: true,
    maxTrailerLoad: 1800,
    features: ['Alkoven', 'Große Küche', 'Separates Bad', 'Dinette', 'Heckbetten', 'Klimaanlage', 'Premium-Ausstattung'],
    availability: [
      { startDate: '2025-05-20', endDate: '2025-06-05' },
      { startDate: '2025-08-01', endDate: '2025-08-15' }
    ],
    description: 'Hymer B-MC T580 in Frankfurt mit Premium-Ausstattung - luxuriöses Reisen für 4 Personen.',
    rating: 4.7,
    category: 'Premium',
    badge: 'Premium',
    pickupLocations: ['Frankfurt', 'Wiesbaden', 'Mainz'],
    location: 'Frankfurt (PLZ 60311)',
    latitude: 50.1109,
    longitude: 8.6821,
    type: 'Alkoven',
    manufacturer: 'Hymer',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 90,
      waterTankCapacity: 140,
      wasteWaterCapacity: 110,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 135,
      lowSeasonMultiplier: 0.75,
      highSeasonMultiplier: 1.30,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.20
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 2500,
      mileageIncluded: 150,
      additionalMileageCost: 0.35,
      cleaningFee: 120
    }
  },
  {
    id: 'adria-twin-640-sgx-stuttgart',
    name: 'Adria Twin 640 SGX (Stuttgart)',
    imageUrl: '/images/campers/adria-twin-640-sgx.jpg',
    images: ['/images/campers/adria-twin-640-sgx-1.jpg', '/images/campers/adria-twin-640-sgx-2.jpg'],
    pricePerDay: 88,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.8,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.36, width: 2.05, height: 2.64 },
    emptyWeight: 2750,
    maxTotalWeight: 3500,
    hasTrailerHitch: false,
    maxTrailerLoad: 0,
    features: ['Kastenwagen', 'Längseinbau', 'Kompakte Küche', 'Bad', 'Dinette', 'Französisches Bett', 'Sport-Paket'],
    availability: [
      { startDate: '2025-04-18', endDate: '2025-05-02' },
      { startDate: '2025-07-10', endDate: '2025-07-24' }
    ],
    description: 'Adria Twin 640 SGX in Stuttgart mit Sport-Paket - agiler Begleiter für aktive Reisende.',
    rating: 4.4,
    category: 'Standard',
    badge: 'Sport',
    pickupLocations: ['Stuttgart', 'Heilbronn'],
    location: 'Stuttgart (PLZ 70173)',
    latitude: 48.7758,
    longitude: 9.1829,
    type: 'Kastenwagen',
    manufacturer: 'Adria',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 110,
      wasteWaterCapacity: 95,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 88,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 200,
      additionalMileageCost: 0.24,
      cleaningFee: 80
    }
  },
  {
    id: 'weinsberg-carabus-601mq-hannover',
    name: 'Weinsberg CaraBus 601MQ (Hannover)',
    imageUrl: '/images/campers/weinsberg-carabus-601mq.jpg',
    images: ['/images/campers/weinsberg-carabus-601mq-1.jpg', '/images/campers/weinsberg-carabus-601mq-2.jpg'],
    pricePerDay: 78,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.5,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.55 },
    emptyWeight: 2650,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1000,
    features: ['Teilintegriert', 'Hubbett', 'L-Küche', 'Bad mit Dusche', 'Sitzgruppe', 'Heckgarage', 'Familienfreundlich'],
    availability: [
      { startDate: '2025-05-05', endDate: '2025-05-18' },
      { startDate: '2025-06-20', endDate: '2025-07-05' }
    ],
    description: 'Weinsberg CaraBus 601MQ in Hannover - familienfreundlich mit großzügigem Platzangebot.',
    rating: 4.3,
    category: 'Familie',
    badge: 'Familienfreundlich',
    pickupLocations: ['Hannover', 'Braunschweig'],
    location: 'Hannover (PLZ 30159)',
    latitude: 52.3759,
    longitude: 9.7320,
    type: 'Teilintegriert',
    manufacturer: 'Weinsberg',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 90,
      waterTankCapacity: 130,
      wasteWaterCapacity: 100,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 78,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1400,
      mileageIncluded: 180,
      additionalMileageCost: 0.22,
      cleaningFee: 75
    }
  },
  {
    id: 'burstner-lyseo-time-a700-leipzig',
    name: 'Bürstner Lyseo Time A700 (Leipzig)',
    imageUrl: '/images/campers/burstner-lyseo-time-a700.jpg',
    images: ['/images/campers/burstner-lyseo-time-a700-1.jpg', '/images/campers/burstner-lyseo-time-a700-2.jpg'],
    pricePerDay: 148,
    beds: 6,
    seats: 6,
    requiredLicense: 'B',
    fuelConsumption: 10.2,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 7.34, width: 2.32, height: 2.94 },
    emptyWeight: 3300,
    maxTotalWeight: 4400,
    hasTrailerHitch: true,
    maxTrailerLoad: 2000,
    features: ['Alkoven', 'Panorama-Fenster', 'Große Küche', 'Separates Bad', 'Dinette', 'Heckbetten', 'Luxus-Ausstattung'],
    availability: [
      { startDate: '2025-06-01', endDate: '2025-06-16' },
      { startDate: '2025-08-15', endDate: '2025-08-30' }
    ],
    description: 'Bürstner Lyseo Time A700 in Leipzig - luxuriöser Familientraum mit Panorama-Fenstern.',
    rating: 4.8,
    category: 'Luxus',
    badge: 'Luxus',
    pickupLocations: ['Leipzig', 'Dresden'],
    location: 'Leipzig (PLZ 04109)',
    latitude: 51.3397,
    longitude: 12.3731,
    type: 'Alkoven',
    manufacturer: 'Bürstner',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 90,
      waterTankCapacity: 150,
      wasteWaterCapacity: 140,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung Combi',
      airConditioning: true
    },
    pricing: {
      basePrice: 148,
      lowSeasonMultiplier: 0.70,
      highSeasonMultiplier: 1.35,
      weeklyDiscount: 0.15,
      monthlyDiscount: 0.25
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 3000,
      mileageIncluded: 150,
      additionalMileageCost: 0.40,
      cleaningFee: 150
    }
  },
  {
    id: 'poessl-roadcar-r540-nuremberg',
    name: 'Pössl Roadcar R540 (Nürnberg)',
    imageUrl: '/images/campers/poessl-roadcar-r540.jpg',
    images: ['/images/campers/poessl-roadcar-r540-1.jpg', '/images/campers/poessl-roadcar-r540-2.jpg'],
    pricePerDay: 75,
    beds: 2,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.2,
    enginePower: 130,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.41, width: 2.05, height: 2.64 },
    emptyWeight: 2580,
    maxTotalWeight: 3500,
    hasTrailerHitch: false,
    maxTrailerLoad: 0,
    features: ['Kastenwagen', 'Hecküküche', 'Kompakt-Bad', 'Sitzgruppe', 'Heckbett', 'Kompakt-Design', 'Effizienz-Paket'],
    availability: [
      { startDate: '2025-04-25', endDate: '2025-05-08' },
      { startDate: '2025-07-01', endDate: '2025-07-15' }
    ],
    description: 'Pössl Roadcar R540 in Nürnberg mit Effizienz-Paket - kompakt und sparsim im Verbrauch.',
    rating: 4.1,
    category: 'Kompakt',
    badge: 'Sparsam',
    pickupLocations: ['Nürnberg', 'Bamberg'],
    location: 'Nürnberg (PLZ 90402)',
    latitude: 49.4521,
    longitude: 11.0767,
    type: 'Kastenwagen',
    manufacturer: 'Pössl',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 100,
      wasteWaterCapacity: 90,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 75,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.15,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1200,
      mileageIncluded: 200,
      additionalMileageCost: 0.20,
      cleaningFee: 70
    }
  },
  {
    id: 'carado-vlow-600-bremen',
    name: 'Carado VLOW 600 (Bremen)',
    imageUrl: '/images/campers/carado-vlow-600.jpg',
    images: ['/images/campers/carado-vlow-600-1.jpg', '/images/campers/carado-vlow-600-2.jpg'],
    pricePerDay: 82,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.0,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.55 },
    emptyWeight: 2750,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Teilintegriert', 'Queensbett', 'U-Küche', 'Bad mit Dusche', 'Dinette', 'Heckgarage', 'Maritim-Paket'],
    availability: [
      { startDate: '2025-05-12', endDate: '2025-05-26' },
      { startDate: '2025-07-18', endDate: '2025-08-02' }
    ],
    description: 'Carado VLOW 600 in Bremen mit Maritim-Paket - perfekt für Nordsee-Abenteuer.',
    rating: 4.2,
    category: 'Standard',
    badge: 'Nordsee',
    pickupLocations: ['Bremen', 'Oldenburg'],
    location: 'Bremen (PLZ 28195)',
    latitude: 53.0793,
    longitude: 8.8017,
    type: 'Teilintegriert',
    manufacturer: 'Carado',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 90,
      waterTankCapacity: 120,
      wasteWaterCapacity: 110,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 82,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.16
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 180,
      additionalMileageCost: 0.24,
      cleaningFee: 80
    }
  },
  {
    id: 'dethleffs-globebus-t1-essen',
    name: 'Dethleffs Globebus T1 (Essen)',
    imageUrl: '/images/campers/dethleffs-globebus-t1.jpg',
    images: ['/images/campers/dethleffs-globebus-t1-1.jpg', '/images/campers/dethleffs-globebus-t1-2.jpg'],
    pricePerDay: 85,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.1,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.64 },
    emptyWeight: 2750,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Queensbett', 'L-Küche', 'Bad mit Dusche', 'Dinette', 'Heckgarage', 'Ruhr-Paket'],
    availability: [
      { startDate: '2025-04-08', endDate: '2025-04-22' },
      { startDate: '2025-06-05', endDate: '2025-06-19' }
    ],
    description: 'Dethleffs Globebus T1 in Essen mit Ruhr-Paket - ideal für Industriekultur-Touren.',
    rating: 4.3,
    category: 'Standard',
    badge: 'Kultur',
    pickupLocations: ['Essen', 'Dortmund', 'Duisburg'],
    location: 'Essen (PLZ 45127)',
    latitude: 51.4556,
    longitude: 7.0116,
    type: 'Kastenwagen',
    manufacturer: 'Dethleffs',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 110,
      wasteWaterCapacity: 100,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 85,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.20,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 160,
      additionalMileageCost: 0.24,
      cleaningFee: 80
    }
  },
  {
    id: 'ford-nugget-plus-kiel',
    name: 'Ford Nugget Plus (Kiel)',
    imageUrl: '/images/campers/ford-nugget-plus.jpg',
    images: ['/images/campers/ford-nugget-plus-1.jpg', '/images/campers/ford-nugget-plus-2.jpg'],
    pricePerDay: 92,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.8,
    enginePower: 185,
    driveType: 'diesel',
    emissionClass: 'Euro 6d',
    dimensions: { length: 5.34, width: 2.06, height: 1.97 },
    emptyWeight: 2450,
    maxTotalWeight: 3100,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Kompakt-Küche', 'Nassraum', 'Dinette', 'Aufstellbett', 'Swivel-Sitze', 'Ostsee-Paket'],
    availability: [
      { startDate: '2025-05-08', endDate: '2025-05-22' },
      { startDate: '2025-07-05', endDate: '2025-07-20' }
    ],
    description: 'Ford Nugget Plus in Kiel mit Ostsee-Paket - perfekt für maritime Abenteuer.',
    rating: 4.5,
    category: 'Kompakt',
    badge: 'Ostsee',
    pickupLocations: ['Kiel', 'Lübeck'],
    location: 'Kiel (PLZ 24103)',
    latitude: 54.3233,
    longitude: 10.1228,
    type: 'Van',
    manufacturer: 'Ford',
    year: 2023,
    specifications: {
      transmission: 'Automatik',
      fuelTankCapacity: 80,
      waterTankCapacity: 42,
      wasteWaterCapacity: 36,
      electricalSystem: '12V/230V',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 92,
      lowSeasonMultiplier: 0.80,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1600,
      mileageIncluded: 170,
      additionalMileageCost: 0.26,
      cleaningFee: 85
    }
  },
  {
    id: 'challenger-mageo-378-freiburg',
    name: 'Challenger Mageo 378 (Freiburg)',
    imageUrl: '/images/campers/challenger-mageo-378.jpg',
    images: ['/images/campers/challenger-mageo-378-1.jpg', '/images/campers/challenger-mageo-378-2.jpg'],
    pricePerDay: 95,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.5,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 5.99, width: 2.05, height: 2.64 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1300,
    features: ['Teilintegriert', 'Französisches Bett', 'L-Küche', 'Bad mit Dusche', 'Dinette', 'Heckgarage', 'Schwarzwald-Paket'],
    availability: [
      { startDate: '2025-04-15', endDate: '2025-04-30' },
      { startDate: '2025-06-12', endDate: '2025-06-27' }
    ],
    description: 'Challenger Mageo 378 in Freiburg mit Schwarzwald-Paket - Natur pur erleben.',
    rating: 4.4,
    category: 'Standard',
    badge: 'Natur',
    pickupLocations: ['Freiburg', 'Baden-Baden'],
    location: 'Freiburg (PLZ 79098)',
    latitude: 47.9990,
    longitude: 7.8421,
    type: 'Teilintegriert',
    manufacturer: 'Challenger',
    year: 2023,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 90,
      waterTankCapacity: 120,
      wasteWaterCapacity: 110,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 95,
      lowSeasonMultiplier: 0.82,
      highSeasonMultiplier: 1.22,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1700,
      mileageIncluded: 160,
      additionalMileageCost: 0.26,
      cleaningFee: 85
    }
  },
  {
    id: 'vw-california-ocean-premium-rostock',
    name: 'VW California Ocean Premium (Rostock)',
    imageUrl: '/images/campers/vw-california-ocean.jpg',
    images: ['/images/campers/vw-california-ocean-1.jpg', '/images/campers/vw-california-ocean-2.jpg'],
    pricePerDay: 98,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 7.5,
    enginePower: 177,
    driveType: 'diesel',
    emissionClass: 'Euro 6d',
    dimensions: { length: 4.90, width: 1.93, height: 1.99 },
    emptyWeight: 2350,
    maxTotalWeight: 3080,
    hasTrailerHitch: true,
    maxTrailerLoad: 1500,
    features: ['Aufstelldach', 'Premium-Küche', 'Kühlschrank', 'Aufbewahrungsschränke', 'Ausziehbares Bett', 'Swivel-Sitze', 'Premium-Ausstattung', 'Mecklenburg-Paket'],
    availability: [
      { startDate: '2025-05-18', endDate: '2025-06-01' },
      { startDate: '2025-07-25', endDate: '2025-08-08' }
    ],
    description: 'VW California Ocean Premium in Rostock mit Mecklenburg-Paket - Seenplatte entdecken.',
    rating: 4.7,
    category: 'Premium',
    badge: 'Premium',
    pickupLocations: ['Rostock', 'Schwerin'],
    location: 'Rostock (PLZ 18055)',
    latitude: 54.0887,
    longitude: 12.1516,
    type: 'Van',
    manufacturer: 'Volkswagen',
    year: 2023,
    specifications: {
      transmission: 'Automatik DSG',
      fuelTankCapacity: 70,
      waterTankCapacity: 30,
      wasteWaterCapacity: 25,
      electricalSystem: '12V/230V + Solar',
      heating: 'Standheizung',
      airConditioning: true
    },
    pricing: {
      basePrice: 98,
      lowSeasonMultiplier: 0.80,
      highSeasonMultiplier: 1.25,
      weeklyDiscount: 0.12,
      monthlyDiscount: 0.18
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1800,
      mileageIncluded: 180,
      additionalMileageCost: 0.28,
      cleaningFee: 90
    }
  },
  {
    id: 'sunlight-cliff-640-magdeburg',
    name: 'Sunlight Cliff 640 (Magdeburg)',
    imageUrl: '/images/campers/sunlight-cliff-640.jpg',
    images: ['/images/campers/sunlight-cliff-640-1.jpg', '/images/campers/sunlight-cliff-640-2.jpg'],
    pricePerDay: 88,
    beds: 4,
    seats: 4,
    requiredLicense: 'B',
    fuelConsumption: 8.3,
    enginePower: 140,
    driveType: 'diesel',
    emissionClass: 'Euro 6',
    dimensions: { length: 6.36, width: 2.05, height: 2.74 },
    emptyWeight: 2800,
    maxTotalWeight: 3500,
    hasTrailerHitch: true,
    maxTrailerLoad: 1200,
    features: ['Kastenwagen', 'Heckbetten', 'Kompakte Küche', 'Bad mit Dusche', 'Dinette', 'Garage', 'Sachsen-Anhalt-Paket'],
    availability: [
      { startDate: '2025-04-20', endDate: '2025-05-05' },
      { startDate: '2025-06-28', endDate: '2025-07-12' }
    ],
    description: 'Sunlight Cliff 640 in Magdeburg mit Sachsen-Anhalt-Paket - Entdeckertour durch Mitteldeutschland.',
    rating: 4.2,
    category: 'Standard',
    badge: 'Entdecker',
    pickupLocations: ['Magdeburg', 'Halle'],
    location: 'Magdeburg (PLZ 39104)',
    latitude: 52.1205,
    longitude: 11.6276,
    type: 'Kastenwagen',
    manufacturer: 'Sunlight',
    year: 2022,
    specifications: {
      transmission: 'Schaltgetriebe',
      fuelTankCapacity: 75,
      waterTankCapacity: 100,
      wasteWaterCapacity: 90,
      electricalSystem: '12V/230V',
      heating: 'Gasheizung',
      airConditioning: false
    },
    pricing: {
      basePrice: 88,
      lowSeasonMultiplier: 0.85,
      highSeasonMultiplier: 1.18,
      weeklyDiscount: 0.10,
      monthlyDiscount: 0.15
    },
    policies: {
      cancellationFees: [
        { daysBeforePickup: 30, feePercentage: 0 },
        { daysBeforePickup: 14, feePercentage: 25 },
        { daysBeforePickup: 7, feePercentage: 50 },
        { daysBeforePickup: 1, feePercentage: 100 }
      ],
      securityDepositAmount: 1500,
      mileageIncluded: 170,
      additionalMileageCost: 0.24,
      cleaningFee: 80
    }
  }
];

// Add-ons for booking system
export const ADDONS = [
  { id: 'bike-rack', name: 'Bike Rack (2 bikes)', pricePerDay: 15, description: 'Secure bike transport for 2 bicycles' },
  { id: 'camping-chairs', name: 'Camping Furniture Set', pricePerDay: 25, description: 'Table and 4 chairs for outdoor dining' },
  { id: 'bbq-grill', name: 'Portable BBQ Grill', pricePerDay: 20, description: 'Gas grill with utensils and cleaning kit' },
  { id: 'kayak-rack', name: 'Kayak Rack', pricePerDay: 30, description: 'Transport up to 2 kayaks safely' },
  { id: 'awning', name: 'Side Awning', pricePerDay: 35, description: 'Extra shade and outdoor living space' },
  { id: 'generator', name: 'Portable Generator', pricePerDay: 40, description: '2000W generator for off-grid power' }
];

// Insurance packages
export const INSURANCE_PACKAGES = [
  { 
    id: 'basic', 
    name: 'Basic Coverage', 
    pricePerDay: 12, 
    description: 'Standard insurance coverage with €1000 deductible',
    coverage: ['Third party liability', 'Theft protection', 'Fire damage']
  },
  { 
    id: 'premium', 
    name: 'Premium Coverage', 
    pricePerDay: 25, 
    description: 'Comprehensive coverage with €500 deductible and roadside assistance',
    coverage: ['All basic coverage', '24/7 roadside assistance', 'Windscreen coverage', 'Interior damage']
  },
  { 
    id: 'ultimate', 
    name: 'Ultimate Coverage', 
    pricePerDay: 40, 
    description: 'Full coverage with zero deductible and premium services',
    coverage: ['All premium coverage', 'Zero deductible', 'Personal belongings', 'Trip interruption coverage']
  }
];

// Mileage packages
export const MILEAGE_PACKAGES = [
  { id: 'standard', name: 'Standard Package', includedKm: 150, additionalKmCost: 0.25 },
  { id: 'extended', name: 'Extended Package', includedKm: 300, additionalKmCost: 0.20, extraCost: 25 },
  { id: 'unlimited', name: 'Unlimited Package', includedKm: -1, additionalKmCost: 0, extraCost: 75 }
];

// Pickup locations with detailed information
export const PICKUP_LOCATIONS = [
  {
    id: 'berlin',
    name: 'Berlin Zentrum',
    city: 'Berlin',
    address: 'Potsdamer Platz 1, 10117 Berlin',
    coordinates: { lat: 52.5096, lng: 13.3762 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: '10:00 - 14:00'
    },
    contact: {
      phone: '+49 30 12345678',
      email: 'berlin@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe', 'Parkplatz']
  },
  {
    id: 'hamburg',
    name: 'Hamburg HafenCity',
    city: 'Hamburg',
    address: 'Am Sandtorkai 1, 20457 Hamburg',
    coordinates: { lat: 53.5448, lng: 9.9959 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: '10:00 - 14:00'
    },
    contact: {
      phone: '+49 40 87654321',
      email: 'hamburg@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe', 'Parkplatz']
  },
  {
    id: 'muenchen',
    name: 'München Hauptbahnhof',
    city: 'München',
    address: 'Bayerstraße 10a, 80335 München',
    coordinates: { lat: 48.1404, lng: 11.5581 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: '10:00 - 14:00'
    },
    contact: {
      phone: '+49 89 11223344',
      email: 'muenchen@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe', 'Parkplatz']
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    address: 'Hugo-Eckener-Ring 1, 60549 Frankfurt am Main',
    coordinates: { lat: 50.0379, lng: 8.5622 },
    openingHours: {
      weekdays: '06:00 - 22:00',
      saturday: '08:00 - 20:00',
      sunday: '09:00 - 18:00'
    },
    contact: {
      phone: '+49 69 55667788',
      email: 'frankfurt@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe', 'Shuttle-Service']
  },
  {
    id: 'koeln',
    name: 'Köln Deutz',
    city: 'Köln',
    address: 'Deutz-Mülheimer-Straße 51, 50679 Köln',
    coordinates: { lat: 50.9394, lng: 6.9819 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: 'Geschlossen'
    },
    contact: {
      phone: '+49 221 99887766',
      email: 'koeln@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe']
  },
  {
    id: 'stuttgart',
    name: 'Stuttgart Mitte',
    city: 'Stuttgart',
    address: 'Königstraße 28, 70173 Stuttgart',
    coordinates: { lat: 48.7784, lng: 9.1800 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: '10:00 - 14:00'
    },
    contact: {
      phone: '+49 711 44556677',
      email: 'stuttgart@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe', 'Parkplatz']
  },
  {
    id: 'duesseldorf',
    name: 'Düsseldorf Altstadt',
    city: 'Düsseldorf',
    address: 'Heinrich-Heine-Allee 36, 40213 Düsseldorf',
    coordinates: { lat: 51.2217, lng: 6.7762 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: 'Geschlossen'
    },
    contact: {
      phone: '+49 211 33445566',
      email: 'duesseldorf@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe']
  },
  {
    id: 'heidelberg',
    name: 'Heidelberg Hauptbahnhof',
    city: 'Heidelberg',
    address: 'Willy-Brandt-Platz 5, 69115 Heidelberg',
    coordinates: { lat: 49.4032, lng: 8.6756 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: '10:00 - 14:00'
    },
    contact: {
      phone: '+49 6221 123456',
      email: 'heidelberg@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe', 'Parkplatz']
  },
  {
    id: 'karlsruhe',
    name: 'Karlsruhe Hauptbahnhof',
    city: 'Karlsruhe',
    address: 'Bahnhofplatz 1, 76137 Karlsruhe',
    coordinates: { lat: 49.0069, lng: 8.4037 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: '10:00 - 14:00'
    },
    contact: {
      phone: '+49 721 987654',
      email: 'karlsruhe@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe', 'Parkplatz']
  },
  {
    id: 'mannheim',
    name: 'Mannheim Hauptbahnhof',
    city: 'Mannheim',
    address: 'Willy-Brandt-Platz 17, 68161 Mannheim',
    coordinates: { lat: 49.4791, lng: 8.4696 },
    openingHours: {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: '10:00 - 14:00'
    },
    contact: {
      phone: '+49 621 112233',
      email: 'mannheim@campershare.de'
    },
    services: ['Fahrzeugübergabe', 'Einweisung', 'Zubehör-Ausgabe', 'Parkplatz']
  }
];

// Helper functions for data access
export const getCamperVans = () => CAMPER_VANS;

export const getCamperVanById = (id) => {
  return CAMPER_VANS.find(van => van.id === id);
};

export const getCamperVansByCategory = (category) => {
  return CAMPER_VANS.filter(van => van.category === category);
};

export const getCamperVansByPriceRange = (minPrice, maxPrice) => {
  return CAMPER_VANS.filter(van => van.pricePerDay >= minPrice && van.pricePerDay <= maxPrice);
};

export const searchCamperVans = (query) => {
  const searchTerm = query.toLowerCase();
  return CAMPER_VANS.filter(van => 
    van.name.toLowerCase().includes(searchTerm) ||
    van.description.toLowerCase().includes(searchTerm) ||
    van.features.some(feature => feature.toLowerCase().includes(searchTerm))
  );
};

export default CAMPER_VANS;
