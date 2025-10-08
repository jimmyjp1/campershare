import { useState } from 'react';
import Head from 'next/head';
import { Container } from '@/components/Container';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'kunde@example.com', // Vorgefüllt mit Testbenutzer
    password: 'password123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Token speichern
        localStorage.setItem('authToken', data.token);
        document.cookie = `authToken=${data.token}; max-age=${7 * 24 * 60 * 60}; path=/`;
        
        // Zurück zur Checkout-Seite oder zur gewünschten Seite
        const returnUrl = router.query.returnUrl || '/checkout?camper=carthago-c-tourer&checkIn=2025-01-15&checkOut=2025-01-18&guests=2';
        router.push(returnUrl);
      } else {
        setError(data.error || 'Anmeldung fehlgeschlagen');
      }
    } catch (error) {
      setError('Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Anmelden - CamperShare</title>
      </Head>

      <Container className="py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
              Anmelden
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-700 dark:text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Passwort
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-zinc-700 dark:text-zinc-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                {loading ? 'Anmelden...' : 'Anmelden'}
              </button>
            </form>

            {/* Testbenutzer-Hinweise */}
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Verfügbare Testbenutzer:
              </h3>
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div>
                  <strong>Kunde:</strong> kunde@example.com / password123<br/>
                  <span className="text-zinc-500">Max Mustermann, +49 987 654321</span>
                </div>
                <div>
                  <strong>Admin:</strong> admin@campershare.com / password123<br/>
                  <span className="text-zinc-500">Admin User, +49 123 456789</span>
                </div>
                <div>
                  <strong>Weitere Kunden:</strong> mueller@example.com, schmidt@example.com, becker@example.com<br/>
                  <span className="text-zinc-500">Alle mit Passwort: password123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
