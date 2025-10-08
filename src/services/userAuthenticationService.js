// Modern authentication service with full German/English i18n support

export const USER_ROLES = {
  GUEST: 'guest',
  CUSTOMER: 'customer', 
  PROVIDER: 'provider',
  ADMIN: 'admin'
};

// Demo users for development
const DEMO_USERS = [
  {
    id: 1,
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    password: 'password123',
    role: USER_ROLES.CUSTOMER,
    verified: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    firstName: 'Anna',
    lastName: 'Schmidt',
    email: 'anna@provider.com',
    password: 'provider123',
    role: USER_ROLES.PROVIDER,
    verified: true,
    companyName: 'Schmidt Campers',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 3,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@campervan.com',
    password: 'admin123',
    role: USER_ROLES.ADMIN,
    verified: true,
    createdAt: new Date('2024-01-01')
  }
];

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = null;
    this.loadUserFromStorage();
  }

  // Load user from localStorage on init
  loadUserFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const userData = localStorage.getItem('campervan_user');
      const token = localStorage.getItem('campervan_token');
      
      if (userData && token) {
        this.currentUser = JSON.parse(userData);
        this.token = token;
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.logout();
    }
  }

  // Save user to localStorage
  saveUserToStorage(user, token) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('campervan_user', JSON.stringify(user));
      localStorage.setItem('campervan_token', token);
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Remove user from localStorage
  removeUserFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('campervan_user');
      localStorage.removeItem('campervan_token');
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  }

  // Generate JWT-like token (demo purposes)
  generateToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = btoa(`${header}.${payload}.secret`);
    
    return `${header}.${payload}.${signature}`;
  }

  // Validate password strength
  validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  }

  // Hash password (demo - in production use bcrypt)
  hashPassword(password) {
    // Simple hash for demo purposes
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Anmeldung fehlgeschlagen');
      }

      if (data.success && data.user && data.token) {
        // Set current user and token
        this.currentUser = data.user;
        this.token = data.token;
        
        // Save to localStorage
        this.saveUserToStorage(data.user, data.token);
        
        return data.user;
      } else {
        throw new Error('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  }

  // Register new user
  async register(userData) {
    try {
      const { firstName, lastName, email, password } = userData;
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen');
      }

      if (data.success && data.user && data.token) {
        // Set current user and token
        this.currentUser = data.user;
        this.token = data.token;
        
        // Save to localStorage
        this.saveUserToStorage(data.user, data.token);
        
        return data.user;
      } else {
        throw new Error('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data
      this.currentUser = null;
      this.token = null;
      this.removeUserFromStorage();
      
      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser && !!this.token;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole(USER_ROLES.ADMIN);
  }

  // Check if user is provider
  isProvider() {
    return this.hasRole(USER_ROLES.PROVIDER);
  }

  // Check if user is customer
  isCustomer() {
    return this.hasRole(USER_ROLES.CUSTOMER);
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      if (!this.currentUser || !this.token) {
        throw new Error('Sie müssen angemeldet sein');
      }

      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Profil-Update fehlgeschlagen');
      }

      if (data.success && data.user) {
        // Update current user
        this.currentUser = data.user;
        
        // Save to localStorage
        this.saveUserToStorage(data.user, this.token);
        
        return data.user;
      } else {
        throw new Error('Profil-Update fehlgeschlagen');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Profil-Update fehlgeschlagen');
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!this.currentUser) {
            reject(new Error('Sie müssen angemeldet sein'));
            return;
          }
          
          // Find user in demo array
          const user = DEMO_USERS.find(u => u.id === this.currentUser.id);
          if (!user || user.password !== currentPassword) {
            reject(new Error('Aktuelles Passwort ist falsch'));
            return;
          }
          
          // Validate new password
          const passwordErrors = this.validatePassword(newPassword);
          if (passwordErrors.length > 0) {
            reject(new Error(passwordErrors[0]));
            return;
          }
          
          // Update password
          user.password = this.hashPassword(newPassword);
          
          resolve({ success: true });
        } catch (error) {
          reject(new Error('Passwort ändern fehlgeschlagen'));
        }
      }, 1000);
    });
  }

  // Request password reset
  async requestPasswordReset(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = DEMO_USERS.find(u => u.email === email);
          if (!user) {
            // Don't reveal if email exists or not for security
            resolve({ success: true, message: 'Wenn diese E-Mail-Adresse registriert ist, erhalten Sie eine Passwort-Reset-E-Mail.' });
            return;
          }
          
          // In a real app, send email here
          console.log(`Password reset requested for ${email}`);
          
          resolve({ 
            success: true, 
            message: 'Passwort-Reset-E-Mail wurde gesendet.' 
          });
        } catch (error) {
          reject(new Error('Fehler beim Senden der Passwort-Reset-E-Mail'));
        }
      }, 1000);
    });
  }
}

// Create singleton instance
const authService = new AuthService();

export { authService };
export default authService;
