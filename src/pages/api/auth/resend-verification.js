// Resend verification email API endpoint
// /pages/api/auth/resend-verification.js

const { getUserByEmail } = require('../../../services/serverAuthenticationService');
const { 
  generateVerificationToken, 
  storeVerificationToken, 
  sendVerificationEmail 
} = require('../../../lib/automaticEmailSender');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'E-Mail-Adresse ist erforderlich' 
      });
    }

    // Get user
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(404).json({ 
        error: 'Kein Konto mit dieser E-Mail-Adresse gefunden' 
      });
    }

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({ 
        error: 'Diese E-Mail-Adresse ist bereits bestätigt' 
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    await storeVerificationToken(user.id, verificationToken);

    // Send verification email
    const emailResult = await sendVerificationEmail(user, verificationToken);
    
    if (!emailResult.success) {
      console.error('Failed to resend verification email:', emailResult.error);
      return res.status(500).json({ 
        error: 'E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später erneut.' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Eine neue Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet. Bitte prüfen Sie auch Ihren Spam-Ordner.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' 
    });
  }
};
