/**
 * =============================================================================
 * REVIEW SYSTEM KOMPONENTEN
 * =============================================================================
 * 
 * Vollständiges Bewertungssystem für Camper-Rental Plattform mit:
 * - Interaktives Stern-Rating System
 * - Review-Anzeige und -Erstellung
 * - Benutzer-Authentifizierung Integration
 * - Admin-Funktionen für Review-Management
 * - Responsive Design mit Mobile-First Ansatz
 * 
 * HAUPT KOMPONENTEN:
 * - StarRating: Interaktive Sterne-Bewertung
 * - ReviewCard: Anzeige einzelner Reviews
 * - ReviewForm: Formular für neue Reviews
 * - ReviewList: Container für Review-Listings
 * - ReviewSummary: Statistik-Übersicht
 * 
 * FEATURES:
 * - Real-time Rating Updates
 * - Conditional Rendering basierend auf Auth-Status
 * - AJAX-Integration für API-Calls
 * - Responsive Layouts mit Tailwind CSS
 * - Accessibility-optimierte Interaktionen
 * 
 * VERWENDUNG:
 * <StarRating rating={4} onRatingChange={handleRating} />
 * <ReviewCard review={reviewData} />
 * <ReviewForm camperId={123} />
 */
import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../services/userAuthenticationService';
import { ajaxService } from '../services/externalApiConnector';

/**
 * STAR RATING KOMPONENTE
 * Interaktive 5-Sterne Bewertung mit Hover-Effekten
 * 
 * @param {number} rating - Aktuelle Bewertung (0-5)
 * @param {function} onRatingChange - Callback bei Rating-Änderung
 * @param {string} size - Größe: 'sm', 'md', 'lg', 'xl'
 * @param {boolean} readonly - Nur-Lese Modus
 * @param {string} className - Zusätzliche CSS-Klassen
 */
export const StarRating = ({ rating = 0, onRatingChange, size = 'md', readonly = false, className = '' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  // Responsive Größen für verschiedene Kontexte
  const sizeClasses = {
    sm: 'w-4 h-4',    // 16px - Kompakte Listen
    md: 'w-5 h-5',    // 20px - Standard Größe
    lg: 'w-6 h-6',    // 24px - Hervorgehobene Ratings
    xl: 'w-8 h-8'     // 32px - Hero/Header Bereiche
  };

  const handleStarClick = (starRating) => {
    if (readonly) return;
    setSelectedRating(starRating);
    onRatingChange?.(starRating);
  };

  const handleStarHover = (starRating) => {
    if (readonly) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hoverRating || selectedRating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
            className={`${sizeClasses[size]} ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } transition-all duration-150`}
          >
            <svg
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              className={`${filled ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-150`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

// Review Card Component
export const ReviewCard = ({ review, onLike, onReport, onReply, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      await onReply(review.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Review Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {review.user.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {review.user.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
            <div className="flex items-center space-x-2">
              <StarRating rating={review.rating} readonly size="sm" />
              <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Review Actions */}
        <div className="flex items-center space-x-2">
          {review.verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
          <button
            onClick={() => onReport(review.id)}
            className="text-gray-400 hover:text-gray-600"
            title="Report review"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Review Content */}
      <div className="space-y-3">
        <h5 className="font-medium text-gray-900">{review.title}</h5>
        <p className={`text-gray-700 ${!isExpanded && review.content.length > 300 ? 'line-clamp-3' : ''}`}>
          {review.content}
        </p>
        {review.content.length > 300 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Review Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {review.photos.slice(0, 6).map((photo, index) => (
            <img
              key={index}
              src={photo.url}
              alt={`Review photo ${index + 1}`}
              className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
              onClick={() => {/* Handle photo modal */}}
            />
          ))}
          {review.photos.length > 6 && (
            <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              +{review.photos.length - 6} more
            </div>
          )}
        </div>
      )}

      {/* Review Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(review.id)}
            className={`flex items-center space-x-1 text-sm ${
              review.liked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill={review.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{review.likes || 0}</span>
          </button>
          
          {currentUser && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reply
            </button>
          )}
        </div>
        
        <div className="text-xs text-gray-400">
          Trip: {review.tripDuration} • {review.vanModel}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && currentUser && (
        <form onSubmit={handleReplySubmit} className="mt-4 space-y-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replyText.trim() || isSubmittingReply}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmittingReply ? 'Posting...' : 'Reply'}
            </button>
          </div>
        </form>
      )}

      {/* Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="ml-8 space-y-3 border-l-2 border-gray-100 pl-4">
          {review.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-sm text-gray-900">{reply.user.name}</span>
                {reply.user.isOwner && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Owner</span>
                )}
                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Review Form Component
export const ReviewForm = ({ vanId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    photos: [],
    categories: {
      cleanliness: 0,
      comfort: 0,
      value: 0,
      communication: 0,
      location: 0
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState([]);
  const fileInputRef = useRef(null);

  const categoryLabels = {
    cleanliness: 'Cleanliness',
    comfort: 'Comfort',
    value: 'Value for Money',
    communication: 'Communication',
    location: 'Pickup Location'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryRating = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: rating }
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setPhotoPreview(prev => [...prev, ...previews].slice(0, 6)); // Max 6 photos
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 6)
    }));
  };

  const removePhoto = (photoId) => {
    setPhotoPreview(prev => {
      const removed = prev.find(p => p.id === photoId);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter(p => p.id !== photoId);
    });
    
    // Update form data photos array accordingly
    const index = photoPreview.findIndex(p => p.id === photoId);
    if (index !== -1) {
      setFormData(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0 || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.rating > 0 && formData.content.trim().length > 10;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => handleInputChange('rating', rating)}
            size="lg"
          />
        </div>

        {/* Category Ratings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rate Different Aspects
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{label}</span>
                <StarRating
                  rating={formData.categories[key]}
                  onRatingChange={(rating) => handleCategoryRating(key, rating)}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Summarize your experience..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Review Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Tell others about your experience with this camper van..."
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-1 text-sm text-gray-500">
            {formData.content.length}/500 characters (minimum 10)
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos
          </label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-2">
                <p className="text-sm text-gray-600">Click to upload photos</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB each (max 6 photos)</p>
              </div>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* Photo Previews */}
            {photoPreview.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photoPreview.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Review Summary Component
export const ReviewSummary = ({ reviews = [], overallRating = 0 }) => {
  const totalReviews = reviews.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  const categoryAverages = {
    cleanliness: 0,
    comfort: 0,
    value: 0,
    communication: 0,
    location: 0
  };

  // Calculate category averages
  if (totalReviews > 0) {
    reviews.forEach(review => {
      Object.keys(categoryAverages).forEach(category => {
        categoryAverages[category] += review.categories?.[category] || 0;
      });
    });
    
    Object.keys(categoryAverages).forEach(category => {
      categoryAverages[category] = categoryAverages[category] / totalReviews;
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <StarRating rating={Math.round(overallRating)} readonly size="sm" />
            <span className="font-semibold text-gray-900">{overallRating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-gray-500">{totalReviews} reviews</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2 mb-6">
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 w-8">{rating}★</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-8">{count}</span>
          </div>
        ))}
      </div>

      {/* Category Ratings */}
      {totalReviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categoryAverages).map(([category, average]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex items-center space-x-2">
                <StarRating rating={Math.round(average)} readonly size="sm" />
                <span className="text-sm text-gray-600">{average.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Review List Component
export const ReviewList = ({ vanId, reviews = [], currentUser, onLoadMore, hasMore, isLoading }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const handleReviewSubmit = async (reviewData) => {
    try {
      // Submit review via AJAX
      const response = await ajaxService.submitReview(vanId, reviewData);
      if (response.success) {
        setShowReviewForm(false);
        // Refresh reviews or update state
        window.location.reload(); // Simple refresh for now
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      await ajaxService.likeReview(reviewId);
      // Update review state
    } catch (error) {
      console.error('Failed to like review:', error);
    }
  };

  const handleReportReview = async (reviewId) => {
    try {
      await ajaxService.reportReview(reviewId);
      alert('Review reported. Thank you for helping us maintain quality.');
    } catch (error) {
      console.error('Failed to report review:', error);
    }
  };

  const handleReplyToReview = async (reviewId, replyText) => {
    try {
      await ajaxService.replyToReview(reviewId, replyText);
      // Update review state
    } catch (error) {
      console.error('Failed to reply to review:', error);
      throw error;
    }
  };

  // Sort and filter reviews
  const processedReviews = reviews
    .filter(review => {
      if (filterBy === 'all') return true;
      if (filterBy === 'verified') return review.verified;
      if (filterBy === 'photos') return review.photos && review.photos.length > 0;
      const rating = parseInt(filterBy);
      return review.rating === rating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Review Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Reviews</option>
            <option value="verified">Verified Only</option>
            <option value="photos">With Photos</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {currentUser && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          vanId={vanId}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews */}
      <div className="space-y-6">
        {processedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            currentUser={currentUser}
            onLike={handleLikeReview}
            onReport={handleReportReview}
            onReply={handleReplyToReview}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {processedReviews.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to share your experience with this camper van.
          </p>
        </div>
      )}
    </div>
  );
};
