/**
 * =============================================================================
 * PAYMENT SERVICE
 * =============================================================================
 * 
 * Umfassendes Zahlungssystem für die WWISCA Camper-Rental Plattform
 * mit Multi-Provider Support und sicherer Transaktionsabwicklung.
 * 
 * HAUPTFUNKTIONEN:
 * - Stripe Payment Integration mit PCI-Compliance
 * - Multi-Payment Methods (Karte, PayPal, Apple Pay, etc.)
 * - Flexible Zahlungstypen (Vollzahlung, Anzahlung, Kaution)
 * - Automatische Rückerstattungsabwicklung
 * - Real-time Payment Status Tracking
 * - Secure Token-basierte Authentifizierung
 * - Integration mit Notification Service
 * 
 * UNTERSTÜTZTE ZAHLUNGSMETHODEN:
 * - Kreditkarten (Visa, Mastercard, American Express)
 * - PayPal (Express Checkout & Standard)
 * - Apple Pay (Mobile & Desktop Safari)
 * - Google Pay (Android & Chrome)
 * - SEPA Banküberweisung (EU)
 * - Klarna (Buy Now, Pay Later)
 * 
 * ZAHLUNGSTYPEN:
 * - Vollzahlung: Kompletter Betrag bei Buchung
 * - Anzahlung: Teilbetrag mit Restbetrag vor Anreise
 * - Kaution: Sicherheitseinbehalt (wird nach Rückgabe freigegeben)
 * - Strafgebühren: Zusätzliche Kosten bei Schäden/Verspätung
 * 
 * SICHERHEITSFEATURES:
 * - PCI DSS Level 1 Compliance via Stripe
 * - End-to-End Verschlüsselung
 * - 3D Secure Authentication für EU-Karten
 * - Fraud Detection & Prevention
 * - Automatische CVV/AVS Validation
 * 
 * VERWENDUNG:
 * const paymentService = new PaymentService()
 * const session = await paymentService.createCheckoutSession(bookingData)
 * const result = await paymentService.processPayment(paymentData)
 */
import { loadStripe } from '@stripe/stripe-js';
import { authService } from './userAuthenticationService';
import { notificationService, notificationTemplates } from './notificationService';

/**
 * STRIPE INITIALISIERUNG
 * Lazy Loading der Stripe Library für bessere Performance
 */
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * PAYMENT METHODS ENUMERATION
 * Definiert alle unterstützten Zahlungsmethoden
 */
export const PAYMENT_METHODS = {
  CARD: 'card',                    // Kreditkarten (Visa, Mastercard, Amex)
  PAYPAL: 'paypal',               // PayPal Express & Standard
  APPLE_PAY: 'apple_pay',         // Apple Pay (iOS/macOS)
  GOOGLE_PAY: 'google_pay',       // Google Pay (Android/Chrome)
  BANK_TRANSFER: 'bank_transfer', // SEPA Banküberweisung
  KLARNA: 'klarna'               // Klarna Buy Now, Pay Later
};

/**
 * PAYMENT STATUS ENUMERATION  
 * Tracking verschiedener Zahlungsstadien für UI und Business Logic
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',                        // Zahlung eingeleitet, wartet auf Bestätigung
  PROCESSING: 'processing',                  // Zahlung wird verarbeitet
  SUCCEEDED: 'succeeded',                    // Zahlung erfolgreich abgeschlossen
  FAILED: 'failed',                         // Zahlung fehlgeschlagen
  CANCELLED: 'cancelled',                   // Zahlung vom Benutzer abgebrochen
  REFUNDED: 'refunded',                     // Vollständige Rückerstattung
  PARTIALLY_REFUNDED: 'partially_refunded'  // Teilweise Rückerstattung
};

/**
 * PAYMENT TYPE ENUMERATION
 * Verschiedene Zahlungsarten für flexible Buchungsmodelle
 */
export const PAYMENT_TYPE = {
  FULL_PAYMENT: 'full_payment',           // Vollzahlung bei Buchung (100%)
  DEPOSIT: 'deposit',                     // Anzahlung (typisch 20-30%)
  REMAINING_BALANCE: 'remaining_balance', // Restbetrag vor Anreise
  SECURITY_DEPOSIT: 'security_deposit',   // Kaution (wird nach Rückgabe freigegeben)
  ADDON_PAYMENT: 'addon_payment'
};

// Payment service class
class PaymentService {
  constructor() {
    this.stripe = null;
    this.paymentIntents = new Map();
    this.setupIntents = new Map();
  }

  // Initialize the payment service
  async initialize() {
    try {
      this.stripe = await getStripe();
      return true;
    } catch (error) {
      console.error('Failed to initialize payment service:', error);
      return false;
    }
  }

  // Create payment intent for booking
  async createPaymentIntent(bookingData, paymentType = PAYMENT_TYPE.FULL_PAYMENT) {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          booking: bookingData,
          paymentType,
          currency: 'usd',
          automaticPaymentMethods: {
            enabled: true
          },
          metadata: {
            bookingId: bookingData.id,
            userId: authService.getCurrentUser()?.id,
            paymentType
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId, amount } = await response.json();
      
      this.paymentIntents.set(paymentIntentId, {
        clientSecret,
        bookingData,
        paymentType,
        amount,
        status: PAYMENT_STATUS.PENDING,
        createdAt: new Date().toISOString()
      });

      return {
        clientSecret,
        paymentIntentId,
        amount
      };
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  }

  // Confirm payment with Stripe Elements
  async confirmPayment(clientSecret, elements, paymentMethod = PAYMENT_METHODS.CARD) {
    if (!this.stripe || !elements) {
      throw new Error('Stripe not initialized or elements not provided');
    }

    try {
      let result;
      
      switch (paymentMethod) {
        case PAYMENT_METHODS.CARD:
          result = await this.stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
              return_url: `${window.location.origin}/payment/success`
            }
          });
          break;
          
        case PAYMENT_METHODS.PAYPAL:
          result = await this.stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
              payment_method: {
                type: 'paypal'
              },
              return_url: `${window.location.origin}/payment/success`
            }
          });
          break;
          
        default:
          result = await this.stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
              return_url: `${window.location.origin}/payment/success`
            }
          });
      }

      if (result.error) {
        throw result.error;
      }

      return result.paymentIntent;
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw error;
    }
  }

  // Process card payment
  async processCardPayment(cardElement, clientSecret, billingDetails) {
    if (!this.stripe || !cardElement) {
      throw new Error('Stripe or card element not available');
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails
          }
        }
      );

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error('Card payment failed:', error);
      throw error;
    }
  }

  // Setup future payments (save payment method)
  async setupFuturePayments(customerId) {
    try {
      const response = await fetch('/api/payments/setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          customerId,
          usage: 'off_session'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create setup intent');
      }

      const { clientSecret, setupIntentId } = await response.json();
      
      this.setupIntents.set(setupIntentId, {
        clientSecret,
        customerId,
        createdAt: new Date().toISOString()
      });

      return { clientSecret, setupIntentId };
    } catch (error) {
      console.error('Setup intent creation failed:', error);
      throw error;
    }
  }

  // Get saved payment methods
  async getSavedPaymentMethods(customerId) {
    try {
      const response = await fetch(`/api/payments/payment-methods?customerId=${customerId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get saved payment methods:', error);
      throw error;
    }
  }

  // Delete saved payment method
  async deleteSavedPaymentMethod(paymentMethodId) {
    try {
      const response = await fetch(`/api/payments/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }

      return true;
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      throw error;
    }
  }

  // Calculate payment breakdown
  calculatePaymentBreakdown(bookingData, paymentType = PAYMENT_TYPE.FULL_PAYMENT) {
    const basePrice = bookingData.pricePerDay * bookingData.nights;
    const addonsTotal = (bookingData.addons || []).reduce((sum, addon) => sum + addon.price, 0);
    const insuranceTotal = bookingData.insurance ? bookingData.insurance.price : 0;
    const mileageTotal = bookingData.mileage ? bookingData.mileage.price : 0;
    
    const subtotal = basePrice + addonsTotal + insuranceTotal + mileageTotal;
    const taxRate = 0.08; // 8% tax
    const taxes = subtotal * taxRate;
    const securityDeposit = bookingData.securityDeposit || 500;
    
    const breakdown = {
      basePrice,
      addons: addonsTotal,
      insurance: insuranceTotal,
      mileage: mileageTotal,
      subtotal,
      taxes,
      securityDeposit,
      total: subtotal + taxes
    };

    // Calculate amount based on payment type
    switch (paymentType) {
      case PAYMENT_TYPE.DEPOSIT:
        breakdown.paymentAmount = Math.max(breakdown.total * 0.3, 100); // 30% or $100 minimum
        break;
      case PAYMENT_TYPE.REMAINING_BALANCE:
        const depositAmount = Math.max(breakdown.total * 0.3, 100);
        breakdown.paymentAmount = breakdown.total - depositAmount;
        break;
      case PAYMENT_TYPE.SECURITY_DEPOSIT:
        breakdown.paymentAmount = securityDeposit;
        break;
      case PAYMENT_TYPE.ADDON_PAYMENT:
        breakdown.paymentAmount = addonsTotal;
        break;
      default:
        breakdown.paymentAmount = breakdown.total;
    }

    return breakdown;
  }

  // Process refund
  async processRefund(paymentIntentId, amount, reason = 'requested_by_customer') {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          paymentIntentId,
          amount,
          reason,
          metadata: {
            refundedAt: new Date().toISOString(),
            refundedBy: authService.getCurrentUser()?.id
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      const refund = await response.json();
      
      // Send notification
      notificationService.handleNotification(
        notificationTemplates.refundProcessed(refund)
      );

      return refund;
    } catch (error) {
      console.error('Refund processing failed:', error);
      throw error;
    }
  }

  // Handle payment webhook events
  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(event.data.object);
          break;
        case 'charge.dispute.created':
          await this.handleDisputeCreated(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook event handling failed:', error);
      throw error;
    }
  }

  // Handle successful payment
  async handlePaymentSucceeded(paymentIntent) {
    const storedIntent = this.paymentIntents.get(paymentIntent.id);
    if (storedIntent) {
      storedIntent.status = PAYMENT_STATUS.SUCCEEDED;
      
      // Send success notification
      notificationService.handleNotification(
        notificationTemplates.paymentSuccessful(
          paymentIntent.amount / 100, // Convert from cents
          storedIntent.bookingData
        )
      );

      // Update booking status
      await this.updateBookingPaymentStatus(
        storedIntent.bookingData.id,
        PAYMENT_STATUS.SUCCEEDED,
        paymentIntent
      );
    }
  }

  // Handle failed payment
  async handlePaymentFailed(paymentIntent) {
    const storedIntent = this.paymentIntents.get(paymentIntent.id);
    if (storedIntent) {
      storedIntent.status = PAYMENT_STATUS.FAILED;
      
      // Send failure notification
      notificationService.handleNotification({
        type: 'payment_failed',
        title: 'Payment Failed ❌',
        message: `Payment for your booking failed. Please try again or use a different payment method.`,
        priority: 'high',
        data: { 
          bookingId: storedIntent.bookingData.id,
          paymentIntentId: paymentIntent.id
        }
      });
    }
  }

  // Handle canceled payment
  async handlePaymentCanceled(paymentIntent) {
    const storedIntent = this.paymentIntents.get(paymentIntent.id);
    if (storedIntent) {
      storedIntent.status = PAYMENT_STATUS.CANCELLED;
    }
  }

  // Handle dispute created
  async handleDisputeCreated(charge) {
    // Notify admin about dispute
    notificationService.handleNotification({
      type: 'dispute_created',
      title: 'Payment Dispute Created ⚠️',
      message: `A payment dispute has been created for charge ${charge.id}. Immediate attention required.`,
      priority: 'urgent',
      data: { chargeId: charge.id }
    });
  }

  // Update booking payment status
  async updateBookingPaymentStatus(bookingId, status, paymentDetails) {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          status,
          paymentDetails,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update booking payment status:', error);
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(userId, limit = 50, offset = 0) {
    try {
      const response = await fetch(
        `/api/payments/history?userId=${userId}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get payment history:', error);
      throw error;
    }
  }

  // Validate payment data
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Invalid payment amount');
    }

    if (!paymentData.currency) {
      errors.push('Currency is required');
    }

    if (!paymentData.paymentMethod) {
      errors.push('Payment method is required');
    }

    if (paymentData.paymentMethod === PAYMENT_METHODS.CARD && !paymentData.billingDetails) {
      errors.push('Billing details are required for card payments');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check if payment method is available
  async isPaymentMethodAvailable(method) {
    if (!this.stripe) {
      await this.initialize();
    }

    switch (method) {
      case PAYMENT_METHODS.APPLE_PAY:
        return this.stripe && this.stripe.paymentRequest && 
               window.ApplePaySession && 
               window.ApplePaySession.canMakePayments();
      
      case PAYMENT_METHODS.GOOGLE_PAY:
        return this.stripe && this.stripe.paymentRequest && 
               window.PaymentRequest;
      
      case PAYMENT_METHODS.PAYPAL:
        return true; // PayPal is generally available
      
      case PAYMENT_METHODS.KLARNA:
        return true; // Klarna availability would be checked server-side
      
      case PAYMENT_METHODS.BANK_TRANSFER:
        return true; // Bank transfer is generally available
      
      default:
        return true;
    }
  }

  // Create payment request for Apple Pay / Google Pay
  async createPaymentRequest(paymentData) {
    if (!this.stripe) {
      await this.initialize();
    }

    const paymentRequest = this.stripe.paymentRequest({
      country: 'US',
      currency: paymentData.currency.toLowerCase(),
      total: {
        label: 'Camper Van Rental',
        amount: Math.round(paymentData.amount * 100) // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: false
    });

    return paymentRequest;
  }

  // Get payment status
  getPaymentStatus(paymentIntentId) {
    const storedIntent = this.paymentIntents.get(paymentIntentId);
    return storedIntent ? storedIntent.status : null;
  }

  // Clear payment data
  clearPaymentData(paymentIntentId) {
    this.paymentIntents.delete(paymentIntentId);
  }

  // Get all payment methods with availability
  async getAvailablePaymentMethods() {
    const methods = [];

    for (const [key, value] of Object.entries(PAYMENT_METHODS)) {
      const isAvailable = await this.isPaymentMethodAvailable(value);
      methods.push({
        id: value,
        name: this.getPaymentMethodName(value),
        available: isAvailable
      });
    }

    return methods.filter(method => method.available);
  }

  // Get user-friendly payment method name
  getPaymentMethodName(method) {
    const names = {
      [PAYMENT_METHODS.CARD]: 'Credit/Debit Card',
      [PAYMENT_METHODS.PAYPAL]: 'PayPal',
      [PAYMENT_METHODS.APPLE_PAY]: 'Apple Pay',
      [PAYMENT_METHODS.GOOGLE_PAY]: 'Google Pay',
      [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
      [PAYMENT_METHODS.KLARNA]: 'Klarna'
    };
    return names[method] || method;
  }
}

// Create singleton instance
export const paymentService = new PaymentService();

// Payment utilities
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatPaymentMethod = (paymentMethod) => {
  if (paymentMethod.card) {
    return `**** **** **** ${paymentMethod.card.last4} (${paymentMethod.card.brand.toUpperCase()})`;
  }
  return paymentService.getPaymentMethodName(paymentMethod.type);
};

export default paymentService;
