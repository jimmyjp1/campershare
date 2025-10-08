// Reset password API endpoint
// /pages/api/auth/reset-password.js

const { hashPassword } = require('../../../services/serverAuthenticationService');
const { query } = require('../../../lib/databaseConnection');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: 'Token und neues Passwort sind erforderlich' 
      });
    }

    // Password validation
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: 'Das Passwort muss mindestens 8 Zeichen lang sein' 
      });
    }

    // Verify token and get user
    const tokenResult = await query(
      `SELECT user_id FROM password_reset_tokens 
       WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Der Link zum Zurücksetzen ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen an.'
      });
    }

    const userId = tokenResult.rows[0].user_id;

    // Hash new password
    const hashedPassword = hashPassword(newPassword);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    );

    // Delete the reset token (one-time use)
    await query(
      'DELETE FROM password_reset_tokens WHERE token = $1',
      [token]
    );

    // Optionally: Invalidate all existing sessions for this user
    await query(
      'DELETE FROM sessions WHERE user_id = $1',
      [userId]
    );

    res.status(200).json({
      success: true,
      message: 'Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      error: 'Passwort-Zurücksetzung fehlgeschlagen. Bitte versuchen Sie es erneut.' 
    });
  }
};
