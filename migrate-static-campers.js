#!/usr/bin/env node

const { Pool } = require('pg');
const { CAMPER_VANS } = require('./src/services/camperVehicleDataService.js');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://campershare_user:campershare_pass@localhost:5432/campershare',
  ssl: false,
});

// Function to map static data fields to database fields
function mapCamperToDatabase(camper, index) {
  // Generate unique slug for each vehicle variant
  const baseSlug = camper.id || camper.slug || camper.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const slug = `${baseSlug}-${index + 1}`;
  
  // Map category to type (database has different values)
  const typeMapping = {
    'Kompakt': 'Compact',
    'Premium': 'Premium', 
    'Familie': 'Family',
    'Abenteuer': 'Adventure',
    'Van': 'Compact',
    'Kastenwagen': 'Compact',
    'Alkoven': 'Family',
    'Teilintegriert': 'Premium',
    'Vollintegriert': 'Premium'
  };
  
  const type = typeMapping[camper.category || camper.type] || 'Compact';
  
  // Extract location - use the location field or generate from pickupLocations
  let location = camper.location;
  if (!location && camper.pickupLocations && camper.pickupLocations.length > 0) {
    location = camper.pickupLocations[0];
  }
  if (!location) {
    location = 'Deutschland'; // Fallback
  }
  
  return {
    slug: slug,
    name: camper.name,
    description: camper.description || '',
    type: type,
    price_per_day: parseFloat(camper.pricePerDay || camper.pricing?.basePrice || 89),
    beds: parseInt(camper.beds || 2),
    location: location,
    drive_type: camper.driveType || camper.specifications?.transmission || 'Diesel',
    fuel_consumption: parseFloat(camper.fuelConsumption || 7.5),
    year: parseInt(camper.year || 2022),
    brand: camper.manufacturer || camper.brand || 'Unknown',
    model: camper.model || camper.name.split(' ').slice(0, 2).join(' '),
    features: JSON.stringify(camper.features || []),
    images: JSON.stringify(camper.images || []),
    rating: parseFloat(camper.rating || 4.0),
    review_count: parseInt(camper.reviewCount || 0),
    is_active: true
  };
}

async function migrateCampers() {
  console.log(`Starting migration of ${CAMPER_VANS.length} campers...`);
  
  try {
    // Get existing slugs to avoid duplicates
    const existingResult = await pool.query('SELECT slug FROM camper_vans');
    const existingSlugs = new Set(existingResult.rows.map(row => row.slug));
    
    let imported = 0;
    let skipped = 0;
    
    for (let i = 0; i < CAMPER_VANS.length; i++) {
      const camper = CAMPER_VANS[i];
      const dbCamper = mapCamperToDatabase(camper, i);
      
      // Skip if already exists
      if (existingSlugs.has(dbCamper.slug)) {
        console.log(`Skipping ${dbCamper.name} (slug: ${dbCamper.slug}) - already exists`);
        skipped++;
        continue;
      }
      
      try {
        const insertQuery = `
          INSERT INTO camper_vans (
            slug, name, description, type, price_per_day, beds, location,
            drive_type, fuel_consumption, year, brand, model, features, 
            images, rating, review_count, is_active
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
          )
        `;
        
        await pool.query(insertQuery, [
          dbCamper.slug,
          dbCamper.name,
          dbCamper.description,
          dbCamper.type,
          dbCamper.price_per_day,
          dbCamper.beds,
          dbCamper.location,
          dbCamper.drive_type,
          dbCamper.fuel_consumption,
          dbCamper.year,
          dbCamper.brand,
          dbCamper.model,
          dbCamper.features,
          dbCamper.images,
          dbCamper.rating,
          dbCamper.review_count,
          dbCamper.is_active
        ]);
        
        console.log(`✅ Imported: ${dbCamper.name} (${dbCamper.location}) - €${dbCamper.price_per_day}/day`);
        imported++;
        
      } catch (error) {
        console.error(`❌ Error importing ${camper.name}:`, error.message);
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Imported: ${imported} campers`);
    console.log(`⏭️  Skipped: ${skipped} campers (already exist)`);
    console.log(`📋 Total processed: ${imported + skipped} campers`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

// Run migration
migrateCampers().catch(console.error);
