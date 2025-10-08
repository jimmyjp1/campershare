// Email verification API endpoint
// /pages/api/auth/verify-email.js

const { verifyEmailToken, sendWelcomeEmail } = require('../../../lib/automaticEmailSender');
const { getUserById } = require('../../../services/serverAuthenticationService');
const { query } = require('../../../lib/databaseConnection');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'Verification token is required' 
      });
    }

    // Verify the token
    const result = await verifyEmailToken(token);

    if (!result.success) {
      return res.status(400).json({
        error: result.error === 'Invalid or expired token' 
          ? 'Der Bestätigungslink ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen an.'
          : 'E-Mail-Bestätigung fehlgeschlagen'
      });
    }

    // Get user data
    const user = await getUserById(result.userId);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail the verification if welcome email fails
    }

    res.status(200).json({
      success: true,
      message: 'E-Mail erfolgreich bestätigt! Ihr Konto ist jetzt aktiviert.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      error: 'E-Mail-Bestätigung fehlgeschlagen. Bitte versuchen Sie es erneut.' 
    });
  }
};
