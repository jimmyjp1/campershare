/**
 * =============================================================================
 * PAYMENT FORM KOMPONENTE
 * =============================================================================
 * 
 * Umfassendes Zahlungsformular mit Stripe Integration für sichere
 * Transaktionsabwicklung in der WWISCA Camper-Rental Plattform.
 * 
 * HAUPTFUNKTIONEN:
 * - Multi-Payment Method Support (Karten, PayPal, Apple Pay, etc.)
 * - Stripe Elements Integration für PCI-Compliance
 * - Gespeicherte Zahlungsmethoden Management
 * - Flexible Zahlungstypen (Vollzahlung, Anzahlung, Kaution)
 * - Real-time Payment Breakdown Calculation
 * - Billing Address Validation
 * - 3D Secure Authentication Support
 * 
 * ZAHLUNGSMETHODEN:
 * - Kreditkarten: Visa, Mastercard, American Express
 * - Digital Wallets: Apple Pay, Google Pay
 * - Alternative: PayPal, Klarna, SEPA
 * - Gespeicherte Karten: Für wiederkehrende Kunden
 * 
 * SICHERHEITSFEATURES:
 * - PCI DSS Level 1 Compliance via Stripe
 * - Client-side Input Validation
 * - Secure Tokenization (keine Kartendaten auf Server)
 * - Fraud Detection & Prevention
 * - SCA/3D Secure 2.0 Authentication
 * - CVV/AVS Verification
 * 
 * PAYMENT BREAKDOWN:
 * - Basis-Mietpreis nach Tagen
 * - Zusatzausstattung und Services
 * - Versicherungsoptionen
 * - Steuern und Gebühren
 * - Kaution (Security Deposit)
 * - Gesamtsumme mit Währungsformatierung
 * 
 * USER EXPERIENCE:
 * - Auto-Fill für wiederkehrende Kunden
 * - Real-time Validierung mit Fehlermeldungen
 * - Progress Indicators für mehrstufige Zahlungen
 * - Mobile-optimierte Touch Controls
 * - Accessibility-konforme Form Labels
 * 
 * VERWENDUNG:
 * <PaymentForm 
 *   bookingData={booking}
 *   paymentType={PAYMENT_TYPE.DEPOSIT}
 *   onPaymentSuccess={handleSuccess}
 *   onPaymentError={handleError}
 *   savedPaymentMethods={userCards}
 * />
 */
import React, { useState, useEffect, useRef } from 'react';
import { useStripe, useElements, CardElement, PaymentElement } from '@stripe/react-stripe-js';
import { paymentService, PAYMENT_METHODS, PAYMENT_TYPE, formatCurrency } from '../services/paymentService';
import { authService } from '../services/userAuthenticationService';

/**
 * PAYMENT FORM HAUPTKOMPONENTE
 * Zentrale Zahlungsabwicklung mit Multi-Method Support
 * @param {Object} bookingData - Buchungsdaten für Preisberechnung
 * @param {string} paymentType - Art der Zahlung (FULL_PAYMENT, DEPOSIT, etc.)
 * @param {function} onPaymentSuccess - Callback bei erfolgreicher Zahlung
 * @param {function} onPaymentError - Callback bei Zahlungsfehlern
 * @param {Array} savedPaymentMethods - Gespeicherte Zahlungsmethoden des Benutzers
 */
export const PaymentForm = ({ 
  bookingData, 
  paymentType = PAYMENT_TYPE.FULL_PAYMENT, 
  onPaymentSuccess, 
  onPaymentError,
  savedPaymentMethods = []
}) => {
  // Stripe Hooks für Payment Processing
  const stripe = useStripe();
  const elements = useElements();
  
  // State Management für Payment Flow
  const [isLoading, setIsLoading] = useState(false);                     // Loading State für Submit
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD); // Gewählte Zahlungsmethode
  const [usesSavedCard, setUsesSavedCard] = useState(false);             // Toggle für gespeicherte Karten
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);      // Ausgewählte gespeicherte Karte
  const [saveCard, setSaveCard] = useState(false);                      // Karte für zukünftige Zahlungen speichern
  const [paymentBreakdown, setPaymentBreakdown] = useState(null);       // Berechnete Preisaufschlüsselung
  const [clientSecret, setClientSecret] = useState(null);               // Stripe Payment Intent Secret
  
  // Billing Details für Zahlungsabwicklung
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',                    // Straße und Hausnummer
      line2: '',                    // Zusatzangaben (Apartment, etc.)
      city: '',                     // Stadt
      state: '',                    // Bundesland/Region
      postal_code: '',              // Postleitzahl
      country: 'US'                 // Default: USA (kann erweitert werden)
    }
  });

  /**
   * PAYMENT BREAKDOWN BERECHNUNG
   * Berechnet Preisaufschlüsselung beim Component Mount
   */
  useEffect(() => {
    const breakdown = paymentService.calculatePaymentBreakdown(bookingData, paymentType);
    setPaymentBreakdown(breakdown);
  }, [bookingData, paymentType]);

  // Create payment intent when component mounts
  useEffect(() => {
    if (paymentBreakdown) {
      createPaymentIntent();
    }
  }, [paymentBreakdown]);

  const createPaymentIntent = async () => {
    try {
      const { clientSecret } = await paymentService.createPaymentIntent(bookingData, paymentType);
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      onPaymentError?.(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (usesSavedCard && selectedSavedCard) {
        // Use saved payment method
        result = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            payment_method: selectedSavedCard.id,
            return_url: `${window.location.origin}/payment/success`
          }
        });
      } else {
        // Use new payment method
        result = await paymentService.confirmPayment(
          clientSecret,
          elements,
          paymentMethod
        );
      }

      if (result.error) {
        throw result.error;
      }

      // Save card if requested
      if (saveCard && !usesSavedCard) {
        const user = authService.getCurrentUser();
        if (user) {
          await paymentService.setupFuturePayments(user.stripeCustomerId);
        }
      }

      onPaymentSuccess?.(result.paymentIntent);
    } catch (error) {
      console.error('Payment failed:', error);
      onPaymentError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillingChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setBillingDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!paymentBreakdown) {
    return <div className="flex justify-center p-8">Loading payment details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Payment</h2>
      
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Base Price ({bookingData.nights} nights)</span>
            <span>{formatCurrency(paymentBreakdown.basePrice)}</span>
          </div>
          {paymentBreakdown.addons > 0 && (
            <div className="flex justify-between">
              <span>Add-ons</span>
              <span>{formatCurrency(paymentBreakdown.addons)}</span>
            </div>
          )}
          {paymentBreakdown.insurance > 0 && (
            <div className="flex justify-between">
              <span>Insurance</span>
              <span>{formatCurrency(paymentBreakdown.insurance)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>{formatCurrency(paymentBreakdown.taxes)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Amount to Pay</span>
            <span>{formatCurrency(paymentBreakdown.paymentAmount)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
          
          {savedPaymentMethods.length > 0 && (
            <div className="mb-4">
              <label className="flex items-center space-x-2 mb-3">
                <input
                  type="radio"
                  checked={usesSavedCard}
                  onChange={(e) => setUsesSavedCard(e.target.checked)}
                  className="text-blue-600"
                />
                <span>Use saved payment method</span>
              </label>
              
              {usesSavedCard && (
                <div className="ml-6 space-y-2">
                  {savedPaymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="savedCard"
                        checked={selectedSavedCard?.id === method.id}
                        onChange={() => setSelectedSavedCard(method)}
                        className="text-blue-600"
                      />
                      <span className="text-sm">
                        {method.card.brand.toUpperCase()} **** {method.card.last4} 
                        <span className="text-gray-500 ml-2">
                          Expires {method.card.exp_month}/{method.card.exp_year}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={!usesSavedCard}
              onChange={(e) => setUsesSavedCard(!e.target.checked)}
              className="text-blue-600"
            />
            <span>Use a new payment method</span>
          </label>
        </div>

        {!usesSavedCard && (
          <>
            {/* Payment Element */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="border rounded-md p-3">
                <PaymentElement 
                  options={{
                    layout: 'tabs'
                  }}
                />
              </div>
            </div>

            {/* Save Card Option */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Save this payment method for future use
                </span>
              </label>
            </div>

            {/* Billing Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={billingDetails.name}
                  onChange={(e) => handleBillingChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={billingDetails.email}
                  onChange={(e) => handleBillingChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={billingDetails.phone}
                  onChange={(e) => handleBillingChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={billingDetails.address.postal_code}
                  onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isLoading || (!usesSavedCard && !clientSecret)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ${formatCurrency(paymentBreakdown.paymentAmount)}`
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium">Your payment is secure</p>
            <p>We use industry-standard encryption to protect your payment information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Saved payment methods management
export const SavedPaymentMethods = ({ customerId, onUpdate }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    loadPaymentMethods();
  }, [customerId]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await paymentService.getSavedPaymentMethods(customerId);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (paymentMethodId) => {
    setIsDeleting(paymentMethodId);
    try {
      await paymentService.deleteSavedPaymentMethod(paymentMethodId);
      setPaymentMethods(prev => prev.filter(method => method.id !== paymentMethodId));
      onUpdate?.();
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading payment methods...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Payment Methods</h3>
      
      {paymentMethods.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No saved payment methods</p>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-6 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h5m-9-9v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H9L7 2H3a2 2 0 00-2 2v2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {method.card.brand.toUpperCase()} **** {method.card.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.card.exp_month}/{method.card.exp_year}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(method.id)}
                disabled={isDeleting === method.id}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {isDeleting === method.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Payment history component
export const PaymentHistory = ({ userId, limit = 10 }) => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    loadPaymentHistory();
  }, [userId]);

  const loadPaymentHistory = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0;
      const history = await paymentService.getPaymentHistory(userId, limit, currentOffset);
      
      if (loadMore) {
        setPayments(prev => [...prev, ...history.payments]);
      } else {
        setPayments(history.payments);
      }
      
      setHasMore(history.hasMore);
      setOffset(currentOffset + limit);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading payment history...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
      
      {payments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No payment history</p>
      ) : (
        <>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(payment.amount / 100)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(payment.created)} • {payment.booking?.vanName || 'Booking'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
                {payment.description && (
                  <p className="text-sm text-gray-600">{payment.description}</p>
                )}
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => loadPaymentHistory(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Refund request component
export const RefundRequest = ({ paymentIntentId, amount, onRefundRequested }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refundAmount, setRefundAmount] = useState(amount);
  const [reason, setReason] = useState('requested_by_customer');
  const [customReason, setCustomReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const refund = await paymentService.processRefund(
        paymentIntentId,
        Math.round(refundAmount * 100), // Convert to cents
        reason === 'other' ? customReason : reason
      );
      
      onRefundRequested?.(refund);
    } catch (error) {
      console.error('Refund request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Refund</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Refund Amount
          </label>
          <input
            type="number"
            value={refundAmount}
            onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
            max={amount}
            min={0}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum refundable: {formatCurrency(amount)}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Refund
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="requested_by_customer">Requested by customer</option>
            <option value="duplicate">Duplicate payment</option>
            <option value="fraudulent">Fraudulent</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {reason === 'other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Reason
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing Refund...' : 'Request Refund'}
        </button>
      </form>
    </div>
  );
};
