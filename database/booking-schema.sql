-- Booking system tables for CamperShare

-- Update users table if not already correct
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    role VARCHAR(20) DEFAULT 'customer',
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campers table (if not exists)
CREATE TABLE IF NOT EXISTS campers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    price_per_day DECIMAL(10,2) NOT NULL,
    passengers INTEGER,
    beds INTEGER,
    images JSONB,
    features JSONB,
    location VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    owner_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    camper_id INTEGER NOT NULL REFERENCES campers(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    service_fee DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    billing_address TEXT,
    billing_postal_code VARCHAR(20),
    billing_city VARCHAR(100),
    cancellation_policy TEXT,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data
INSERT INTO campers (name, category, description, price_per_day, passengers, beds, images, features, location, owner_id) 
VALUES 
('Carthago C-Tourer I 144 LE', 'Premium Wohnmobil', 'Luxuriöses Wohnmobil für unvergessliche Reisen', 149.00, 4, 2, 
 '["images/caravans/carthago-c-tourer-i144le/hauptbild.jpg"]',
 '["Klimaanlage", "Heizung", "Küche", "Bad", "TV", "WLAN"]',
 'Berlin', 1)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_camper_id ON bookings(camper_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
