// Get camper by slug API endpoint
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://campershare_user:campershare_pass@postgres:5432/campershare',
  ssl: false,
});

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    // Get camper details
    const camperResult = await pool.query(
      `SELECT 
        cv.*, 
        u.first_name as owner_first_name, 
        u.last_name as owner_last_name,
        u.phone as owner_phone
      FROM camper_vans cv
      LEFT JOIN users u ON cv.owner_id = u.id
      WHERE cv.slug = $1 AND cv.is_active = true`,
      [slug]
    );

    if (camperResult.rows.length === 0) {
      return res.status(404).json({ error: 'Camper not found' });
    }

    const camper = camperResult.rows[0];

    // Get recent reviews
    const reviewsResult = await pool.query(
      `SELECT 
        r.*, 
        u.first_name, 
        u.last_name,
        u.profile_image
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.camper_van_id = $1 AND r.is_verified = true
      ORDER BY r.created_at DESC
      LIMIT 10`,
      [camper.id]
    );

    // Get availability for next 6 months
    const availabilityResult = await pool.query(
      `SELECT start_date, end_date 
      FROM bookings 
      WHERE camper_van_id = $1 
      AND status IN ('confirmed', 'pending')
      AND end_date >= CURRENT_DATE
      AND start_date <= CURRENT_DATE + INTERVAL '6 months'`,
      [camper.id]
    );

    const bookedDates = availabilityResult.rows.map(booking => ({
      start: booking.start_date,
      end: booking.end_date
    }));

    // Transform camper data to ensure consistent field naming
    const transformedCamper = {
      ...camper,
      pricePerDay: parseFloat(camper.price_per_day || 0),
      pricePerNight: parseFloat(camper.price_per_day || 0), // Same as pricePerDay for campers
      // Keep the original field for backward compatibility
      price_per_day: camper.price_per_day
    };

    res.status(200).json({
      success: true,
      data: {
        ...transformedCamper,
        reviews: reviewsResult.rows,
        bookedDates
      }
    });
  } catch (error) {
    console.error('Get camper by slug error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
