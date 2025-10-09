// Get all campers API endpoint with filtering and search
const { Pool } = require('pg');
const { generateCamperImages } = require('../../../services/camperImageService');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://campershare_user:campershare_pass@postgres:5432/campershare',
  ssl: false,
});

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      search,
      type,
      minPrice,
      maxPrice,
      beds,
      location,
      features,
      sortBy = 'name',
      page = 1,
      limit = 50  // Increased default limit
    } = req.query;

    let queryText = `
      SELECT 
        id, slug, name, description, type, price_per_day, beds, location, 
        drive_type, year, brand, model, features, rating, review_count, 
        images, pickup_locations, is_active, created_at
      FROM camper_vans 
      WHERE is_active = true
    `;
    
    const queryParams = [];
    let paramCount = 0;

    // Search filter
    if (search) {
      paramCount++;
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR location ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Type filter
    if (type && type !== 'all') {
      paramCount++;
      queryText += ` AND type = $${paramCount}`;
      queryParams.push(type);
    }

    // Price filters
    if (minPrice) {
      paramCount++;
      queryText += ` AND price_per_day >= $${paramCount}`;
      queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      queryText += ` AND price_per_day <= $${paramCount}`;
      queryParams.push(parseFloat(maxPrice));
    }

    // Beds filter
    if (beds) {
      paramCount++;
      queryText += ` AND beds >= $${paramCount}`;
      queryParams.push(parseInt(beds));
    }

    // Location filter
    if (location) {
      paramCount++;
      queryText += ` AND location ILIKE $${paramCount}`;
      queryParams.push(`%${location}%`);
    }

    // Features filter
    if (features) {
      const featuresArray = Array.isArray(features) ? features : [features];
      for (const feature of featuresArray) {
        paramCount++;
        queryText += ` AND features @> $${paramCount}`;
        queryParams.push(JSON.stringify([feature]));
      }
    }

    // Sorting
    const validSortFields = ['name', 'price_per_day', 'rating', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    queryText += ` ORDER BY ${sortField} DESC`;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount += 2;
    queryText += ` LIMIT $${paramCount - 1} OFFSET $${paramCount}`;
    queryParams.push(parseInt(limit), offset);

    // Execute query
    const result = await pool.query(queryText, queryParams);

    // Transform data to ensure consistent field naming and add dynamic images
    const transformedData = result.rows.map(camper => {
      // Generate dynamic image paths based on folder structure
      const imageData = generateCamperImages(camper.slug);
      
      return {
        ...camper,
        ...imageData, // Add imageUrl and images from the image service
        pricePerDay: parseFloat(camper.price_per_day || 0),
        pricePerNight: parseFloat(camper.price_per_day || 0), // Same as pricePerDay for campers
        // Keep the original field for backward compatibility
        price_per_day: camper.price_per_day
      }
    });

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM camper_vans 
      WHERE is_active = true
    `;
    const countParams = [];
    let countParamCount = 0;

    // Apply same filters for count
    if (search) {
      countParamCount++;
      countQuery += ` AND (name ILIKE $${countParamCount} OR description ILIKE $${countParamCount} OR location ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (type && type !== 'all') {
      countParamCount++;
      countQuery += ` AND type = $${countParamCount}`;
      countParams.push(type);
    }

    if (minPrice) {
      countParamCount++;
      countQuery += ` AND price_per_day >= $${countParamCount}`;
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      countParamCount++;
      countQuery += ` AND price_per_day <= $${countParamCount}`;
      countParams.push(parseFloat(maxPrice));
    }

    if (beds) {
      countParamCount++;
      countQuery += ` AND beds >= $${countParamCount}`;
      countParams.push(parseInt(beds));
    }

    if (location) {
      countParamCount++;
      countQuery += ` AND location ILIKE $${countParamCount}`;
      countParams.push(`%${location}%`);
    }

    if (features) {
      const featuresArray = Array.isArray(features) ? features : [features];
      for (const feature of featuresArray) {
        countParamCount++;
        countQuery += ` AND features @> $${countParamCount}`;
        countParams.push(JSON.stringify([feature]));
      }
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.status(200).json({
      success: true,
      data: transformedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get campers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
