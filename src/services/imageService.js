// Image Service Configuration
// Handles both local and cloud image sources

export class ImageService {
  constructor() {
    this.useCloudinary = process.env.NODE_ENV === 'production'
    this.cloudinaryBaseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL
    this.localImagePath = '/images/caravans'
  }

  getCamperImage(slug, imageType = 'main') {
    if (this.useCloudinary && this.cloudinaryBaseUrl) {
      // Production: Use Cloudinary with automatic optimization
      return `${this.cloudinaryBaseUrl}/c_fill,w_800,h_600,q_auto,f_auto/campers/${slug}-${imageType}.jpg`
    }
    
    // Development: Use local images
    return `${this.localImagePath}/${slug}/${imageType}.jpg`
  }

  getCamperImageGallery(slug) {
    const imageTypes = ['main', 'interior-1', 'interior-2', 'exterior-1']
    return imageTypes.map(type => this.getCamperImage(slug, type))
  }

  // Fallback for missing images
  getFallbackImage(type = 'main') {
    return `/images/placeholders/camper-${type}-placeholder.jpg`
  }
}

export const imageService = new ImageService()

// Usage examples:
// imageService.getCamperImage('vw-california-ocean', 'main')
// imageService.getCamperImageGallery('mercedes-marco-polo')
