-- Pickup Locations Table Schema and Data
-- Separate table to manage all CamperShare pickup locations

-- Create pickup_locations table if it doesn't exist
CREATE TABLE IF NOT EXISTS pickup_locations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    coordinates JSONB NOT NULL,
    opening_hours JSONB NOT NULL,
    contact JSONB NOT NULL,
    services JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updated_at
CREATE TRIGGER update_pickup_locations_updated_at 
BEFORE UPDATE ON pickup_locations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Clear existing data and insert all 10 pickup locations
DELETE FROM pickup_locations;

INSERT INTO pickup_locations (id, name, city, address, coordinates, opening_hours, contact, services) VALUES
('berlin', 'Berlin Zentrum', 'Berlin', 'Potsdamer Platz 1, 10117 Berlin', '{"lat": 52.5096, "lng": 13.3762}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "10:00 - 14:00"}', '{"phone": "+49 30 12345678", "email": "berlin@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe", "Parkplatz"]'),
('hamburg', 'Hamburg HafenCity', 'Hamburg', 'Am Sandtorkai 1, 20457 Hamburg', '{"lat": 53.5448, "lng": 9.9959}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "10:00 - 14:00"}', '{"phone": "+49 40 87654321", "email": "hamburg@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe", "Parkplatz"]'),
('muenchen', 'München Hauptbahnhof', 'München', 'Bayerstraße 10a, 80335 München', '{"lat": 48.1404, "lng": 11.5581}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "10:00 - 14:00"}', '{"phone": "+49 89 11223344", "email": "muenchen@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe", "Parkplatz"]'),
('frankfurt', 'Frankfurt Airport', 'Frankfurt', 'Hugo-Eckener-Ring 1, 60549 Frankfurt am Main', '{"lat": 50.0379, "lng": 8.5622}', '{"weekdays": "06:00 - 22:00", "saturday": "08:00 - 20:00", "sunday": "09:00 - 18:00"}', '{"phone": "+49 69 55667788", "email": "frankfurt@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe", "Shuttle-Service"]'),
('koeln', 'Köln Deutz', 'Köln', 'Deutz-Mülheimer-Straße 51, 50679 Köln', '{"lat": 50.9394, "lng": 6.9819}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "Geschlossen"}', '{"phone": "+49 221 99887766", "email": "koeln@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe"]'),
('stuttgart', 'Stuttgart Mitte', 'Stuttgart', 'Königstraße 28, 70173 Stuttgart', '{"lat": 48.7784, "lng": 9.1800}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "10:00 - 14:00"}', '{"phone": "+49 711 44556677", "email": "stuttgart@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe", "Parkplatz"]'),
('duesseldorf', 'Düsseldorf Altstadt', 'Düsseldorf', 'Heinrich-Heine-Allee 36, 40213 Düsseldorf', '{"lat": 51.2217, "lng": 6.7762}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "Geschlossen"}', '{"phone": "+49 211 33445566", "email": "duesseldorf@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe"]'),
('heidelberg', 'Heidelberg Hauptbahnhof', 'Heidelberg', 'Willy-Brandt-Platz 5, 69115 Heidelberg', '{"lat": 49.4032, "lng": 8.6756}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "10:00 - 14:00"}', '{"phone": "+49 6221 123456", "email": "heidelberg@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe", "Parkplatz"]'),
('karlsruhe', 'Karlsruhe Hauptbahnhof', 'Karlsruhe', 'Bahnhofplatz 1, 76137 Karlsruhe', '{"lat": 49.0069, "lng": 8.4037}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "10:00 - 14:00"}', '{"phone": "+49 721 987654", "email": "karlsruhe@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe", "Parkplatz"]'),
('mannheim', 'Mannheim Hauptbahnhof', 'Mannheim', 'Willy-Brandt-Platz 17, 68161 Mannheim', '{"lat": 49.4791, "lng": 8.4696}', '{"weekdays": "08:00 - 18:00", "saturday": "09:00 - 16:00", "sunday": "10:00 - 14:00"}', '{"phone": "+49 621 112233", "email": "mannheim@campershare.de"}', '["Fahrzeugübergabe", "Einweisung", "Zubehör-Ausgabe", "Parkplatz"]');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pickup_locations_city ON pickup_locations(city);
CREATE INDEX IF NOT EXISTS idx_pickup_locations_coordinates ON pickup_locations USING GIN (coordinates);

-- Verification query
SELECT 
    id, 
    name, 
    city, 
    coordinates->'lat' as latitude,
    coordinates->'lng' as longitude
FROM pickup_locations 
ORDER BY city;
