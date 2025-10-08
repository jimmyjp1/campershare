import { query } from '../../../lib/databaseConnection';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get all users with basic information
    const result = await query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        phone,
        role,
        email_verified,
        language,
        country,
        created_at,
        updated_at,
        (SELECT COUNT(*) FROM bookings WHERE user_id = users.id) as booking_count,
        (SELECT SUM(total_amount) FROM bookings WHERE user_id = users.id AND status = 'completed') as total_spent
      FROM users 
      ORDER BY created_at DESC
    `);

    // Get summary statistics
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_this_month,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
        COUNT(*) FILTER (WHERE email_verified = true) as verified_count,
        COUNT(*) FILTER (WHERE EXISTS (
          SELECT 1 FROM bookings WHERE user_id = users.id AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        )) as active_users
      FROM users
    `);

    const users = result.rows.map(user => ({
      ...user,
      total_spent: user.total_spent || 0,
      booking_count: parseInt(user.booking_count) || 0
    }));

    const stats = statsResult.rows[0];

    res.status(200).json({
      users,
      stats: {
        total: parseInt(stats.total_users),
        newThisMonth: parseInt(stats.new_this_month),
        adminCount: parseInt(stats.admin_count),
        verifiedCount: parseInt(stats.verified_count),
        activeUsers: parseInt(stats.active_users)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
