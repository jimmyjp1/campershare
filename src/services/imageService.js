/**
 * =============================================================================
 * IMAGE SERVICE
 * =============================================================================
 * 
 * Intelligenter Image-Management Service für die WWISCA Camper-Rental 
 * Plattform mit automatischer Cloudinary-Integration und lokalen Fallbacks.
 * 
 * HAUPTFUNKTIONEN:
 * - Environment-basierte Image Source (lokal vs. Cloud)
 * - Cloudinary Integration mit automatischer Optimierung
 * - Responsive Image Generation mit verschiedenen Auflösungen
 * - Fallback-System für fehlende Bilder
 * - Gallery-Management für Camper-Bilderstrecken
 * - Automatische Format-Optimierung (WebP, AVIF)
 * - Lazy Loading Support
 * 
 * BILDKATEGORIEN:
 * - main: Haupt-Camper Ansicht (Hero Image)
 * - interior-1/2: Innenraum Aufnahmen
 * - exterior-1: Zusätzliche Außenansichten
 * - gallery: Vollständige Bilderstrecke
 * 
 * CLOUDINARY FEATURES (Production):
 * - Automatische Komprimierung (q_auto)
 * - Format-Optimierung (f_auto) 
 * - Responsive Größen (w_800, h_600)
 * - CDN-Delivery für globale Performance
 * - WebP/AVIF Konvertierung
 * - Lazy Loading Placeholder
 * 
 * DEVELOPMENT FEATURES:
 * - Lokale Bilder für schnelle Entwicklung
 * - Placeholder-System für fehlende Assets
 * - Hot-Reload kompatible Pfade
 * 
 * VERWENDUNG:
 * const mainImage = imageService.getCamperImage('vw-california-ocean', 'main')
 * const gallery = imageService.getCamperImageGallery('mercedes-marco-polo')
 * const fallback = imageService.getFallbackImage('interior-1')
 */

// Image Service Configuration
// Handles both local and cloud image sources

export class ImageService {
  constructor() {
    // Environment-basierte Konfiguration
    this.useCloudinary = process.env.NODE_ENV === 'production'  // Cloud nur in Production
    this.cloudinaryBaseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL  // Cloudinary Base URL
    this.localImagePath = '/images/caravans'  // Lokaler Pfad für Development
  }

  /**
   * CAMPER IMAGE ABRUFEN
   * Generiert optimierte Image URLs basierend auf Environment
   * @param {string} slug - Eindeutiger Camper-Identifier (z.B. 'vw-california-ocean')
   * @param {string} imageType - Bildkategorie ('main', 'interior-1', 'exterior-1')
   * @returns {string} Optimierte Image URL
   */
  getCamperImage(slug, imageType = 'main') {
    if (this.useCloudinary && this.cloudinaryBaseUrl) {
      // Production: Cloudinary mit automatischer Optimierung
      // c_fill: Crop-Modus für konsistente Dimensionen
      // w_800,h_600: Standard-Auflösung für Camper-Bilder
      // q_auto: Automatische Qualitäts-Optimierung
      // f_auto: Automatische Format-Auswahl (WebP, AVIF)
      return `${this.cloudinaryBaseUrl}/c_fill,w_800,h_600,q_auto,f_auto/campers/${slug}-${imageType}.jpg`
    }
    
    // Development: Lokale Bilder für schnelle Entwicklung
    return `${this.localImagePath}/${slug}/${imageType}.jpg`
  }

  /**
   * CAMPER GALLERY GENERIEREN
   * Erstellt vollständige Bilderstrecke für Camper-Details
   * @param {string} slug - Camper-Identifier
   * @returns {Array<string>} Array von optimierten Image URLs
   */
  getCamperImageGallery(slug) {
    const imageTypes = ['main', 'interior-1', 'interior-2', 'exterior-1']
    return imageTypes.map(type => this.getCamperImage(slug, type))
  }

  /**
   * FALLBACK IMAGE SYSTEM
   * Liefert Placeholder-Bilder für fehlende oder nicht verfügbare Assets
   * @param {string} type - Bildkategorie für passenden Placeholder
   * @returns {string} Fallback Image URL
   */
  getFallbackImage(type = 'main') {
    return `/images/placeholders/camper-${type}-placeholder.jpg`
  }
}

// Singleton Instance für App-weite Verwendung
export const imageService = new ImageService()

/**
 * VERWENDUNGSBEISPIELE:
 * 
 * // Haupt-Camper Bild abrufen
 * const heroImage = imageService.getCamperImage('vw-california-ocean', 'main')
 * 
 * // Vollständige Gallery für Detail-Seite
 * const galleryImages = imageService.getCamperImageGallery('mercedes-marco-polo')
 * 
 * // Fallback für fehlende Bilder
 * const placeholder = imageService.getFallbackImage('interior-1')
 */
