/**
 * =============================================================================
 * CAMPER IMAGE SERVICE
 * =============================================================================
 * 
 * Utility-Service für die dynamische Generierung von Camper-Bildpfaden
 * basierend auf der neuen Ordnerstruktur in /public/images/caravans/
 * 
 * ORDNERSTRUKTUR:
 * /public/images/caravans/[camper-slug]/
 * ├── main.avif (Hauptbild)
 * ├── exterior-1.avif (Außenansicht)
 * ├── interior-1.avif (Innenansicht)
 * ├── interior-2.avif (weitere Innenansicht)
 * └── detail-1.avif (Detailaufnahme)
 * 
 * VERWENDUNG:
 * - Automatische Erkennung verfügbarer Bilder
 * - Fallback zu Default-Bildern wenn keine vorhanden
 * - Optimized Loading mit WebP/AVIF Support
 * - SEO-freundliche Alt-Tags generierung
 */

// Node.js/React compatible imports
let React, useState, useEffect, fs, path
if (typeof window === 'undefined') {
  // Server-side (Node.js)
  fs = require('fs')
  path = require('path')
} else {
  // Client-side (React)
  const reactModule = require('react')
  useState = reactModule.useState
  useEffect = reactModule.useEffect
}

/**
 * Standard-Bildnamen in der erwarteten Reihenfolge
 */
const STANDARD_IMAGE_NAMES = [
  'main.avif',
  'exterior-1.avif', 
  'interior-1.avif',
  'interior-2.avif',
  'detail-1.avif'
]

/**
 * Fallback-Bilder falls keine camper-spezifischen Bilder vorhanden sind
 */
const DEFAULT_IMAGES = [
  '/images/campers/default-camper-main.jpg',
  '/images/campers/default-camper-exterior.jpg',
  '/images/campers/default-camper-interior.jpg'
]

/**
 * Generiert die Bildpfade für einen Camper basierend auf seinem Slug
 * @param {string} camperSlug - Der URL-Slug des Campers (z.B. 'vw-california-ocean')
 * @returns {Object} Objekt mit imageUrl (Hauptbild) und images (Array aller Bilder)
 */
function generateCamperImages(camperSlug) {
  if (typeof window !== 'undefined') {
    // Client-seitig: Verwende fetch um verfügbare Bilder zu prüfen
    return generateCamperImagesClient(camperSlug)
  } else {
    // Server-seitig: Verwende File System
    return generateCamperImagesServer(camperSlug)
  }
}

/**
 * Server-seitige Bildgenerierung mit File System Access
 */
function generateCamperImagesServer(camperSlug) {
  const camperImageDir = path.join(process.cwd(), 'public', 'images', 'caravans', camperSlug)
  const images = []
  
  try {
    // Prüfe ob der Camper-Ordner existiert
    if (fs.existsSync(camperImageDir)) {
      // Lade alle verfügbaren Bilder in der Standard-Reihenfolge
      for (const imageName of STANDARD_IMAGE_NAMES) {
        const imagePath = path.join(camperImageDir, imageName)
        if (fs.existsSync(imagePath)) {
          images.push({
            url: `/images/caravans/${camperSlug}/${imageName}`,
            alt: generateImageAlt(camperSlug, imageName),
            type: getImageType(imageName)
          })
        }
      }
      
      // Falls keine Standard-Bilder gefunden, lade alle verfügbaren
      if (images.length === 0) {
        const files = fs.readdirSync(camperImageDir)
        for (const file of files) {
          if (isImageFile(file)) {
            images.push({
              url: `/images/caravans/${camperSlug}/${file}`,
              alt: generateImageAlt(camperSlug, file),
              type: getImageType(file)
            })
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Fehler beim Laden der Bilder für ${camperSlug}:`, error)
  }
  
  // Fallback zu Default-Bildern wenn keine camper-spezifischen Bilder vorhanden
  if (images.length === 0) {
    return {
      imageUrl: DEFAULT_IMAGES[0],
      images: DEFAULT_IMAGES.map((url, index) => ({
        url,
        alt: `${formatCamperName(camperSlug)} - Bild ${index + 1}`,
        type: 'default'
      }))
    }
  }
  
  return {
    imageUrl: images[0].url,
    images: images
  }
}

/**
 * Client-seitige Bildgenerierung (für Browser)
 */
function generateCamperImagesClient(camperSlug) {
  // Client-seitig generieren wir die erwarteten Pfade
  // Die tatsächliche Verfügbarkeit wird durch die Image-Komponenten geprüft
  const images = STANDARD_IMAGE_NAMES.map(imageName => ({
    url: `/images/caravans/${camperSlug}/${imageName}`,
    alt: generateImageAlt(camperSlug, imageName),
    type: getImageType(imageName)
  }))
  
  return {
    imageUrl: images[0].url,
    images: images
  }
}

/**
 * Generiert SEO-freundliche Alt-Tags basierend auf Bildname
 */
function generateImageAlt(camperSlug, imageName) {
  const camperName = formatCamperName(camperSlug)
  
  if (imageName.includes('main')) {
    return `${camperName} - Hauptansicht`
  } else if (imageName.includes('exterior')) {
    return `${camperName} - Außenansicht`
  } else if (imageName.includes('interior')) {
    return `${camperName} - Innenraum`
  } else if (imageName.includes('detail')) {
    return `${camperName} - Detailansicht`
  } else {
    return `${camperName} - Fahrzeugbild`
  }
}

/**
 * Bestimmt den Bildtyp basierend auf dem Dateinamen
 */
function getImageType(imageName) {
  if (imageName.includes('main')) return 'main'
  if (imageName.includes('exterior')) return 'exterior'
  if (imageName.includes('interior')) return 'interior'
  if (imageName.includes('detail')) return 'detail'
  return 'misc'
}

/**
 * Prüft ob eine Datei ein Bild ist
 */
function isImageFile(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

/**
 * Formatiert einen Camper-Slug zu einem lesbaren Namen
 */
function formatCamperName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Hook für React-Komponenten zum Laden von Camper-Bildern
 */
function useCamperImages(camperSlug) {
  if (typeof window === 'undefined') {
    // Server-side: Return static data
    return { images: null, isLoading: false }
  }
  
  const [images, setImages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (camperSlug) {
      const imageData = generateCamperImages(camperSlug)
      setImages(imageData)
      setIsLoading(false)
    }
  }, [camperSlug])
  
  return { images, isLoading }
}

// CommonJS exports for Node.js compatibility
module.exports = {
  generateCamperImages,
  useCamperImages,
  generateImageAlt,
  formatCamperName
}
