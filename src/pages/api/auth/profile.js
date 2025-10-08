import { verifyAuthToken } from '../../../services/serverAuthenticationService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '') ||
                 req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: 'Nicht angemeldet' });
    }

    const userData = await verifyAuthToken(token);
    
    if (!userData) {
      return res.status(401).json({ error: 'Ungültiger Token' });
    }

    // Gib nur die benötigten Daten zurück (keine sensiblen Informationen)
    res.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      // Zusätzliche Felder falls verfügbar
      address: userData.address || '',
      postalCode: userData.postal_code || '',
      city: userData.city || '',
      dateOfBirth: userData.date_of_birth || '',
      driversLicense: userData.drivers_license || ''
    });

  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
}
