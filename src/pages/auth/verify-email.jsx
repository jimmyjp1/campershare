// Email verification page
// /pages/auth/verify-email.jsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setUserEmail(data.user?.email || '');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth?message=verification-success');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'E-Mail-Bestätigung fehlgeschlagen');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  const resendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Eine neue Bestätigungs-E-Mail wurde versendet. Bitte prüfen Sie Ihr Postfach.');
      } else {
        setMessage(data.error || 'Fehler beim Versenden der E-Mail');
      }
    } catch (error) {
      setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            )}
            {status === 'success' && (
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'loading' && 'E-Mail wird bestätigt...'}
            {status === 'success' && '🎉 E-Mail bestätigt!'}
            {status === 'error' && '❌ Bestätigung fehlgeschlagen'}
          </h1>
        </div>

        {/* Content */}
        <div className="text-center">
          {status === 'loading' && (
            <div>
              <p className="text-gray-600 mb-4">
                Ihre E-Mail-Adresse wird gerade bestätigt. Bitte warten Sie einen Moment...
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <p className="text-emerald-800 text-sm">
                  <strong>Willkommen bei CamperShare!</strong><br/>
                  Ihr Konto ist jetzt vollständig aktiviert. Sie werden automatisch zur Anmeldung weitergeleitet.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Weiterleitung in 3 Sekunden...
              </div>
            </div>
          )}

          {status === 'error' && (
            <div>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm mb-2">
                  <strong>Mögliche Ursachen:</strong>
                </p>
                <ul className="text-red-700 text-sm text-left space-y-1">
                  <li>• Der Link ist abgelaufen (24 Stunden Gültigkeit)</li>
                  <li>• Der Link wurde bereits verwendet</li>
                  <li>• Der Link ist beschädigt</li>
                </ul>
              </div>

              <div className="space-y-3">
                {userEmail && (
                  <button
                    onClick={resendVerification}
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    📧 Neue Bestätigungs-E-Mail senden
                  </button>
                )}
                
                <Link href="/auth">
                  <a className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    ← Zurück zur Anmeldung
                  </a>
                </Link>
                
                <Link href="/contact">
                  <a className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Probleme? Kontaktieren Sie unseren Support
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link href="/">
            <a className="text-2xl font-bold text-emerald-600 hover:text-emerald-700">
              🚐 CamperShare
            </a>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            Ihr Partner für unvergessliche Camping-Abenteuer
          </p>
        </div>
      </div>
    </div>
  );
}
