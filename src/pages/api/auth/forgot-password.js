// Password reset API endpoint
// /pages/api/auth/forgot-password.js

const { getUserByEmail } = require('../../../services/serverAuthenticationService');
const { 
  generatePasswordResetToken, 
  sendPasswordResetEmail 
} = require('../../../lib/automaticEmailSender');

export default async function handler(req, res) {
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

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' 
      });
    }

    // Get user
    const user = await getUserByEmail(email.toLowerCase().trim());
    
    // Security: Always return success to prevent email enumeration
    // Don't reveal if email exists or not
    const successMessage = 'Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet.';

    if (!user) {
      // Return success even if user doesn't exist (security)
      return res.status(200).json({
        success: true,
        message: successMessage
      });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(400).json({
        error: 'Ihr Konto ist noch nicht verifiziert. Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.'
      });
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken();
    await storePasswordResetToken(user.id, resetToken);

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user, resetToken);
    
    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return res.status(500).json({ 
        error: 'E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später erneut.' 
      });
    }

    res.status(200).json({
      success: true,
      message: successMessage
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ 
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' 
    });
  }
};
