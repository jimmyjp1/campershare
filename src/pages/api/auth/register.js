// Register API endpoint with email verification
const { createUser, getUserByEmail } = require('../../../services/serverAuthenticationService');
const { 
  sendVerificationEmail 
} = require('../../../lib/automaticEmailSender');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, firstName, lastName, phone, agreeToTerms } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Alle Pflichtfelder müssen ausgefüllt werden' 
      });
    }

    if (!agreeToTerms) {
      return res.status(400).json({ 
        error: 'Die Allgemeinen Geschäftsbedingungen müssen akzeptiert werden' 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' 
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Das Passwort muss mindestens 8 Zeichen lang sein' 
      });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      if (existingUser.email_verified) {
        return res.status(409).json({ 
          error: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits' 
        });
      } else {
        return res.status(409).json({ 
          error: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits, aber ist noch nicht verifiziert. Bitte prüfen Sie Ihr E-Mail-Postfach.',
          needsVerification: true,
          userId: existingUser.id
        });
      }
    }

    // Create user (email_verified defaults to FALSE)
    const newUser = await createUser({
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() || null,
      role: 'customer'
    });

    // Send verification email (generates token internally)
    const emailResult = await sendVerificationEmail(
      newUser.email, 
      `${newUser.first_name} ${newUser.last_name}`, 
      newUser.id
    );
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail registration if email sending fails
    }

    // Return success (without sensitive user data)
    res.status(201).json({
      success: true,
      message: 'Registrierung erfolgreich! Bitte prüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre E-Mail-Adresse.',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        emailVerified: false
      },
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ 
        error: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits' 
      });
    }

    res.status(500).json({ 
      error: 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.' 
    });
  }
};
