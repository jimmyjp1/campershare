// Bookings API endpoint
const { authenticateUser } = require('../../../services/serverAuthenticationService');
const { query } = require('../../../lib/databaseConnection');
const { v4: uuidv4 } = require('uuid');

// Get user bookings
async function getBookings(req, res) {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let queryText = `
      SELECT 
        b.*,
        cv.name as camper_name,
        cv.slug as camper_slug,
        cv.images as camper_images
      FROM bookings b
      JOIN camper_vans cv ON b.camper_van_id = cv.id
      WHERE b.user_id = $1
    `;
    
    const queryParams = [req.user.id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      queryText += ` AND b.status = $${paramCount}`;
      queryParams.push(status);
    }

    queryText += ` ORDER BY b.created_at DESC`;
    
    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount += 2;
    queryText += ` LIMIT $${paramCount - 1} OFFSET $${paramCount}`;
    queryParams.push(parseInt(limit), offset);

    const result = await query(queryText, queryParams);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create new booking
async function createBooking(req, res) {
  try {
    const {
      camperVanId,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      addons = [],
      insurancePackage,
      driverInfo,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!camperVanId || !startDate || !endDate || !pickupLocation || !returnLocation) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Check if camper exists and is available
    const camperResult = await query(
      'SELECT * FROM camper_vans WHERE id = $1 AND is_active = true',
      [camperVanId]
    );

    if (camperResult.rows.length === 0) {
      return res.status(404).json({ error: 'Camper not found' });
    }

    const camper = camperResult.rows[0];

    // Check for date conflicts
    const conflictResult = await query(
      `SELECT id FROM bookings 
       WHERE camper_van_id = $1 
       AND status IN ('confirmed', 'pending')
       AND (
         (start_date <= $2 AND end_date >= $2) OR
         (start_date <= $3 AND end_date >= $3) OR
         (start_date >= $2 AND end_date <= $3)
       )`,
      [camperVanId, startDate, endDate]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ error: 'Camper not available for selected dates' });
    }

    // Calculate pricing
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const basePrice = camper.price_per_day * totalDays;
    let addonPrice = 0;
    let insurancePrice = 0;

    // Calculate addon prices (simplified)
    if (addons.length > 0) {
      addonPrice = addons.length * 15; // €15 per addon per day
    }

    // Calculate insurance price
    if (insurancePackage === 'basic') {
      insurancePrice = totalDays * 8;
    } else if (insurancePackage === 'premium') {
      insurancePrice = totalDays * 15;
    }

    const totalAmount = basePrice + addonPrice + insurancePrice;

    // Generate booking number
    const bookingNumber = `CS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Create booking
    const bookingResult = await query(
      `INSERT INTO bookings (
        booking_number, user_id, camper_van_id, start_date, end_date,
        pickup_location, return_location, total_days, base_price,
        addon_price, insurance_price, total_amount, addons,
        insurance_package, driver_info, special_requests
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        bookingNumber, req.user.id, camperVanId, startDate, endDate,
        pickupLocation, returnLocation, totalDays, basePrice,
        addonPrice, insurancePrice, totalAmount, JSON.stringify(addons),
        insurancePackage, JSON.stringify(driverInfo), specialRequests
      ]
    );

    const booking = bookingResult.rows[0];

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = authenticateUser(async function handler(req, res) {
  if (req.method === 'GET') {
    return getBookings(req, res);
  } else if (req.method === 'POST') {
    return createBooking(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
});
