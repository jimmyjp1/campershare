// Update user profile API endpoint
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://campershare_user:campershare_pass@postgres:5432/campershare',
  ssl: false,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

module.exports = async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    let userId;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { firstName, lastName, email, phone, dateOfBirth } = req.body;

    // Update user profile
    const updateQuery = `
      UPDATE users 
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        date_of_birth = COALESCE($5, date_of_birth),
        updated_at = NOW()
      WHERE id = $6
      RETURNING id, email, first_name, last_name, phone, date_of_birth, role, created_at, updated_at
    `;

    const result = await pool.query(updateQuery, [
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth || null,
      userId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = result.rows[0];

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
