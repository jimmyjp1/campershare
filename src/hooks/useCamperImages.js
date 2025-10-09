/**
 * =============================================================================
 * CAMPER IMAGE HOOK (React Client-Version)
 * =============================================================================
 * 
 * React Hook für die Verwendung des Camper Image Service in Komponenten
 */

import { useState, useEffect } from 'react'

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
 * Formatiert einen Camper-Slug zu einem lesbaren Namen
 */
function formatCamperName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
 * React Hook für Camper-Bilder
 */
export function useCamperImages(camperSlug) {
  const [images, setImages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (camperSlug) {
      try {
        const imageData = generateCamperImagesClient(camperSlug)
        setImages(imageData)
        setError(null)
      } catch (err) {
        console.error('Fehler beim Laden der Camper-Bilder:', err)
        setError(err)
        // Fallback zu Default-Bildern
        setImages({
          imageUrl: DEFAULT_IMAGES[0],
          images: DEFAULT_IMAGES.map((url, index) => ({
            url,
            alt: `${formatCamperName(camperSlug)} - Bild ${index + 1}`,
            type: 'default'
          }))
        })
      } finally {
        setIsLoading(false)
      }
    }
  }, [camperSlug])
  
  return { images, isLoading, error }
}

export { generateImageAlt, formatCamperName }
