// Authentication middleware and utilities
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query, redis } = require('./databaseConnection');

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-here';
const JWT_EXPIRES_IN = '7d';

// Hash password
function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

// Compare password
function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

// Generate JWT token
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Get user by email
async function getUserByEmail(email) {
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Get user by ID
async function getUserById(id) {
  try {
    const result = await query(
      'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Create user
async function createUser(userData) {
  const { email, password, firstName, lastName, phone = null, role = 'customer' } = userData;
  
  try {
    const hashedPassword = hashPassword(password);
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, first_name, last_name, phone, role, created_at`,
      [email, hashedPassword, firstName, lastName, phone, role]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Create session
async function createSession(userId, token) {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );
    
    // Also store in Redis for faster access
    await redis.set(`session:${token}`, JSON.stringify({ userId, expiresAt }), { EX: 7 * 24 * 60 * 60 });
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

// Delete session
async function deleteSession(token) {
  try {
    await query('DELETE FROM sessions WHERE token = $1', [token]);
    await redis.del(`session:${token}`);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}

// Get session
async function getSession(token) {
  try {
    // Try Redis first
    const redisSession = await redis.get(`session:${token}`);
    if (redisSession) {
      const session = JSON.parse(redisSession);
      if (new Date(session.expiresAt) > new Date()) {
        return session;
      }
    }
    
    // Fallback to database
    const result = await query(
      'SELECT user_id, expires_at FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    
    if (result.rows[0]) {
      const session = {
        userId: result.rows[0].user_id,
        expiresAt: result.rows[0].expires_at
      };
      // Update Redis
      await redis.set(`session:${token}`, JSON.stringify(session), { EX: 7 * 24 * 60 * 60 });
      return session;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Authentication middleware
function authenticateUser(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                   req.cookies?.token;
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const session = await getSession(token);
      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      const user = await getUserById(session.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      req.session = session;
      
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };
}

// Admin middleware
function requireAdmin(handler) {
  return authenticateUser(async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    return handler(req, res);
  });
}

// Verify auth token and return user data
async function verifyAuthToken(token) {
  try {
    const session = await getSession(token);
    if (!session) {
      return null;
    }

    const user = await getUserById(session.userId);
    return user;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  getUserByEmail,
  getUserById,
  createUser,
  createSession,
  deleteSession,
  getSession,
  verifyAuthToken,
  authenticateUser,
  requireAdmin
};
