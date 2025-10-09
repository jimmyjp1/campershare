/**
 * =============================================================================
 * NOTIFICATION SERVICE
 * =============================================================================
 * 
 * Umfassendes Benachrichtigungssystem für Real-Time Updates und 
 * Benutzer-Kommunikation in der WWISCA Camper-Rental Plattform.
 * 
 * HAUPTFUNKTIONEN:
 * - Real-Time Benachrichtigungen via Server-Sent Events (SSE)
 * - Multi-Type Notification System (Buchungen, Zahlungen, Erinnerungen)
 * - Priority-basierte Benachrichtigungs-Kategorisierung  
 * - Lokale Notification-Persistierung und Caching
 * - Unread Counter Management mit Badge-Updates
 * - Auto-Reconnection bei Verbindungsverlusten
 * - Browser Notification API Integration
 * 
 * NOTIFICATION TYPES:
 * - Booking: Bestätigungen, Updates, Stornierungen
 * - Payment: Erfolg/Fehler Benachrichtigungen
 * - Reminders: Abholung/Rückgabe Erinnerungen
 * - Reviews: Bewertungsanfragen nach Buchungen
 * - Messages: Direkte Nachrichten zwischen Nutzern
 * - System: Updates und Wartungshinweise
 * - Promotions: Marketing und Angebote
 * 
 * PRIORITY LEVELS:
 * - LOW: Promotions, allgemeine Updates
 * - MEDIUM: Review-Requests, Standard-Nachrichten
 * - HIGH: Buchungsbestätigungen, Zahlungsbestätigungen
 * - URGENT: Zahlungsfehler, kritische System-Updates
 * 
 * VERWENDUNG:
 * const notificationService = new NotificationService()
 * notificationService.initialize(userId)
 * notificationService.subscribe((notification) => handleNotification(notification))
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { authService } from './userAuthenticationService';

/**
 * NOTIFICATION TYPES ENUMERATION
 * Definiert alle verfügbaren Benachrichtigungstypen für Type-Safety
 */
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: 'booking_confirmed',     // Buchungsbestätigung
  BOOKING_UPDATED: 'booking_updated',         // Buchungsänderung
  BOOKING_CANCELLED: 'booking_cancelled',     // Buchungsstornierung
  PAYMENT_SUCCESSFUL: 'payment_successful',   // Erfolgreiche Zahlung
  PAYMENT_FAILED: 'payment_failed',          // Fehlgeschlagene Zahlung
  REMINDER_PICKUP: 'reminder_pickup',         // Abholungs-Erinnerung
  REMINDER_RETURN: 'reminder_return',         // Rückgabe-Erinnerung
  REVIEW_REQUEST: 'review_request',           // Bewertungsanfrage
  MESSAGE_RECEIVED: 'message_received',       // Neue Nachricht
  SYSTEM_UPDATE: 'system_update',            // System-Update
  PROMOTION: 'promotion'                     // Werbe-Angebot
};

/**
 * PRIORITY LEVELS ENUMERATION
 * Definiert Wichtigkeitsstufen für Notification-Priorisierung
 */
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',        // Niedrige Priorität - Promotions, optionale Updates
  MEDIUM: 'medium',  // Mittlere Priorität - Standard Nachrichten, Reviews
  HIGH: 'high',      // Hohe Priorität - Buchungen, Zahlungsbestätigungen
  URGENT: 'urgent'   // Dringende Priorität - Fehler, kritische Updates
};

/**
 * NOTIFICATION SERVICE KLASSE
 * Zentrale Verwaltung aller Benachrichtigungsfunktionen mit Real-Time Updates
 */
class NotificationService {
  constructor() {
    this.eventSource = null              // SSE-Verbindung für Real-Time Updates
    this.subscribers = new Set()         // Subscriber für Notification-Events
    this.reconnectInterval = null        // Interval für automatische Wiederverbindung
    this.reconnectAttempts = 0          // Zähler für Reconnection-Versuche
    this.maxReconnectAttempts = 5       // Maximum Reconnection-Versuche
    this.isConnected = false            // Verbindungsstatus
    this.notifications = []             // Lokaler Notification-Cache
    this.unreadCount = 0               // Anzahl ungelesener Benachrichtigungen
  }

  /**
   * SERVICE INITIALISIERUNG
   * Startet die Notification-Verbindung für den angegebenen Benutzer
   * @param {string} userId - Eindeutige Benutzer-ID
   */
  initialize(userId) {
    if (!userId) {
      console.warn('Cannot initialize notifications without user ID');
      return;
    }

    this.userId = userId;
    this.connect();                     // SSE-Verbindung aufbauen
    this.loadStoredNotifications();     // Gespeicherte Notifications laden
  }

  // Connect to Server-Sent Events
  connect() {
    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
      return;
    }

    const url = `/api/notifications/stream?userId=${this.userId}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('Notification stream connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.clearReconnectInterval();
      this.notifySubscribers({ type: 'connection', status: 'connected' });
    };

    this.eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        this.handleNotification(notification);
      } catch (error) {
        console.error('Failed to parse notification:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('Notification stream error:', error);
      this.isConnected = false;
      this.notifySubscribers({ type: 'connection', status: 'error' });
      this.scheduleReconnect();
    };

    // Setup custom event listeners
    this.setupEventListeners();
  }

  // Setup custom event listeners for different notification types
  setupEventListeners() {
    Object.values(NOTIFICATION_TYPES).forEach(type => {
      this.eventSource.addEventListener(type, (event) => {
        try {
          const notification = JSON.parse(event.data);
          this.handleNotification({ ...notification, type });
        } catch (error) {
          console.error(`Failed to parse ${type} notification:`, error);
        }
      });
    });
  }

  // Handle incoming notifications
  handleNotification(notification) {
    const processedNotification = {
      id: notification.id || Date.now().toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data || {},
      priority: notification.priority || NOTIFICATION_PRIORITY.MEDIUM,
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false,
      actions: notification.actions || []
    };

    // Add to notifications array
    this.notifications.unshift(processedNotification);
    this.unreadCount++;

    // Store in localStorage
    this.storeNotifications();

    // Notify subscribers
    this.notifySubscribers({
      type: 'notification',
      notification: processedNotification
    });

    // Show browser notification if permission granted
    this.showBrowserNotification(processedNotification);

    // Play notification sound for high priority
    if (processedNotification.priority === NOTIFICATION_PRIORITY.HIGH || 
        processedNotification.priority === NOTIFICATION_PRIORITY.URGENT) {
      this.playNotificationSound();
    }
  }

  // Show browser notification
  showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === NOTIFICATION_PRIORITY.URGENT
      });

      browserNotification.onclick = () => {
        window.focus();
        this.handleNotificationClick(notification);
        browserNotification.close();
      };

      // Auto close after 5 seconds for non-urgent notifications
      if (notification.priority !== NOTIFICATION_PRIORITY.URGENT) {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  // Handle notification click
  handleNotificationClick(notification) {
    // Mark as read
    this.markAsRead(notification.id);

    // Handle different notification types
    switch (notification.type) {
      case NOTIFICATION_TYPES.BOOKING_CONFIRMED:
      case NOTIFICATION_TYPES.BOOKING_UPDATED:
        window.location.href = `/bookings/${notification.data.bookingId}`;
        break;
      case NOTIFICATION_TYPES.MESSAGE_RECEIVED:
        window.location.href = `/messages/${notification.data.conversationId}`;
        break;
      case NOTIFICATION_TYPES.REVIEW_REQUEST:
        window.location.href = `/campers/${notification.data.vanSlug}#reviews`;
        break;
      default:
        // Generic handling
        if (notification.data.url) {
          window.location.href = notification.data.url;
        }
    }
  }

  // Play notification sound
  playNotificationSound() {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Could not play notification sound:', e));
    } catch (error) {
      console.log('Notification sound not available:', error);
    }
  }

  // Schedule reconnection
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.clearReconnectInterval();
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    this.reconnectInterval = setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Clear reconnection timer
  clearReconnectInterval() {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notify all subscribers
  notifySubscribers(event) {
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in notification subscriber:', error);
      }
    });
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.storeNotifications();
      this.notifySubscribers({ type: 'read', notificationId });
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.unreadCount = 0;
    this.storeNotifications();
    this.notifySubscribers({ type: 'allRead' });
  }

  // Delete notification
  deleteNotification(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      const notification = this.notifications[index];
      if (!notification.read) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
      this.notifications.splice(index, 1);
      this.storeNotifications();
      this.notifySubscribers({ type: 'deleted', notificationId });
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.unreadCount = 0;
    this.storeNotifications();
    this.notifySubscribers({ type: 'cleared' });
  }

  // Get notifications
  getNotifications() {
    return this.notifications;
  }

  // Get unread count
  getUnreadCount() {
    return this.unreadCount;
  }

  // Store notifications in localStorage
  storeNotifications() {
    if (typeof window === 'undefined') return; // Server-side rendering
    try {
      const data = {
        notifications: this.notifications.slice(0, 50), // Keep last 50
        unreadCount: this.unreadCount
      };
      localStorage.setItem('notifications', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store notifications:', error);
    }
  }

  // Load stored notifications
  loadStoredNotifications() {
    if (typeof window === 'undefined') return; // Server-side rendering
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.notifications || [];
        this.unreadCount = data.unreadCount || 0;
      }
    } catch (error) {
      console.error('Failed to load stored notifications:', error);
    }
  }

  // Request browser notification permission
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Disconnect
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.clearReconnectInterval();
    this.isConnected = false;
    this.subscribers.clear();
  }

  // Send a test notification (for development)
  sendTestNotification() {
    const testNotification = {
      id: Date.now().toString(),
      type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working.',
      priority: NOTIFICATION_PRIORITY.MEDIUM,
      data: { test: true }
    };
    this.handleNotification(testNotification);
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// React hook for using notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize with current state
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());
    setIsConnected(notificationService.isConnected);

    // Subscribe to updates
    const unsubscribe = notificationService.subscribe((event) => {
      switch (event.type) {
        case 'connection':
          setIsConnected(event.status === 'connected');
          break;
        case 'notification':
          setNotifications([...notificationService.getNotifications()]);
          setUnreadCount(notificationService.getUnreadCount());
          break;
        case 'read':
        case 'allRead':
        case 'deleted':
        case 'cleared':
          setNotifications([...notificationService.getNotifications()]);
          setUnreadCount(notificationService.getUnreadCount());
          break;
      }
    });

    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead: notificationService.markAsRead.bind(notificationService),
    markAllAsRead: notificationService.markAllAsRead.bind(notificationService),
    deleteNotification: notificationService.deleteNotification.bind(notificationService),
    clearAll: notificationService.clearAll.bind(notificationService),
    requestPermission: notificationService.requestPermission.bind(notificationService)
  };
};

// Push notification helpers
export const initializePushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });
      
      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
      
      return true;
    } catch (error) {
      console.error('Push notification setup failed:', error);
      return false;
    }
  }
  return false;
};

// Notification templates
export const notificationTemplates = {
  bookingConfirmed: (booking) => ({
    type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
    title: 'Booking Confirmed! 🎉',
    message: `Your reservation for ${booking.vanName} has been confirmed for ${booking.dates}.`,
    priority: NOTIFICATION_PRIORITY.HIGH,
    data: { bookingId: booking.id, vanSlug: booking.vanSlug }
  }),

  paymentSuccessful: (amount, booking) => ({
    type: NOTIFICATION_TYPES.PAYMENT_SUCCESSFUL,
    title: 'Payment Successful ✅',
    message: `Payment of $${amount} has been processed for your booking.`,
    priority: NOTIFICATION_PRIORITY.MEDIUM,
    data: { bookingId: booking.id, amount }
  }),

  pickupReminder: (booking) => ({
    type: NOTIFICATION_TYPES.REMINDER_PICKUP,
    title: 'Pickup Reminder 📅',
    message: `Don't forget! Your ${booking.vanName} pickup is tomorrow at ${booking.pickupTime}.`,
    priority: NOTIFICATION_PRIORITY.HIGH,
    data: { bookingId: booking.id, pickupLocation: booking.pickupLocation }
  }),

  reviewRequest: (booking) => ({
    type: NOTIFICATION_TYPES.REVIEW_REQUEST,
    title: 'How was your trip? ⭐',
    message: `We'd love to hear about your experience with ${booking.vanName}!`,
    priority: NOTIFICATION_PRIORITY.LOW,
    data: { bookingId: booking.id, vanSlug: booking.vanSlug }
  }),

  promotionalOffer: (offer) => ({
    type: NOTIFICATION_TYPES.PROMOTION,
    title: offer.title,
    message: offer.message,
    priority: NOTIFICATION_PRIORITY.LOW,
    data: { offerId: offer.id, code: offer.code }
  })
};

export default notificationService;
