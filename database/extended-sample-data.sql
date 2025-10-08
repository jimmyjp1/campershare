-- Erweiterte Sample-Daten für CamperShare
-- Zusätzliche realistische Testdaten

-- Mehr Benutzer hinzufügen
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, city, country) VALUES
('mueller@example.com', '$2a$12$eB1QbajlR78QiPx7ji4AUuZ.nAGw4igOR8dpd59cyE6I89JA0byQy', 'Thomas', 'Müller', '+49 176 12345678', 'customer', 'München', 'Germany'),
('schmidt@example.com', '$2a$12$eB1QbajlR78QiPx7ji4AUuZ.nAGw4igOR8dpd59cyE6I89JA0byQy', 'Sarah', 'Schmidt', '+49 175 87654321', 'customer', 'Berlin', 'Germany'),
('wagner@example.com', '$2a$12$eB1QbajlR78QiPx7ji4AUuZ.nAGw4igOR8dpd59cyE6I89JA0byQy', 'Michael', 'Wagner', '+49 177 11223344', 'provider', 'Hamburg', 'Germany'),
('becker@example.com', '$2a$12$eB1QbajlR78QiPx7ji4AUuZ.nAGw4igOR8dpd59cyE6I89JA0byQy', 'Lisa', 'Becker', '+49 178 99887766', 'customer', 'Stuttgart', 'Germany'),
('fischer@example.com', '$2a$12$eB1QbajlR78QiPx7ji4AUuZ.nAGw4igOR8dpd59cyE6I89JA0byQy', 'Andreas', 'Fischer', '+49 179 55443322', 'provider', 'Köln', 'Germany');

-- Zusätzliche Wohnmobile aus Ihrer Datenstruktur
INSERT INTO camper_vans (slug, name, description, type, price_per_day, beds, location, drive_type, year, brand, model, features, rating, review_count, owner_id) VALUES
('carthago-chic-e-line-i51', 'Carthago Chic E-Line I 51', 'Luxuriöses Reisemobil mit erstklassiger Ausstattung und modernem Design. Perfekt für anspruchsvolle Reisende.', 'Premium', 175.00, 4, 'Dresden', 'Diesel', 2024, 'Carthago', 'Chic E-Line I 51', '["Küche", "Bad/WC", "Dusche", "Heizung", "Klimaanlage", "Solar", "TV", "Markise", "Sat-Anlage", "Navigation", "Rückfahrkamera"]', 4.8, 12, (SELECT id FROM users WHERE email = 'wagner@example.com')),

('weinsberg-carabus-600-mq', 'Weinsberg CaraBus 600 MQ', 'Kompakter und wendiger Kastenwagen für spontane Abenteuer und Wochenendtrips.', 'Compact', 92.00, 2, 'Nürnberg', 'Diesel', 2023, 'Weinsberg', 'CaraBus 600 MQ', '["Küche", "Bad/WC", "Heizung", "Solar", "Markise", "Navigation"]', 4.5, 8, (SELECT id FROM users WHERE email = 'fischer@example.com')),

('hobby-vantana-de-luxe-k65-et', 'Hobby Vantana De Luxe K65 ET', 'Familienfreundliches Wohnmobil mit großzügigem Platzangebot und komfortabler Ausstattung.', 'Family', 135.00, 6, 'Hannover', 'Diesel', 2024, 'Hobby', 'Vantana De Luxe K65 ET', '["Küche", "Bad/WC", "Dusche", "Heizung", "TV", "Markise", "Sat-Anlage", "Kindersitz", "Garage"]', 4.7, 15, (SELECT id FROM users WHERE email = 'wagner@example.com')),

('buerstner-lyseo-time-a700', 'Bürstner Lyseo Time A 700', 'Geräumiges Alkoven-Wohnmobil für die ganze Familie mit viel Stauraum.', 'Family', 125.00, 6, 'Leipzig', 'Diesel', 2023, 'Bürstner', 'Lyseo Time A 700', '["Küche", "Bad/WC", "Dusche", "Heizung", "TV", "Markise", "Garage", "Kindersitz", "Fahrräder"]', 4.4, 9, (SELECT id FROM users WHERE email = 'fischer@example.com')),

('malibu-van-charming-gt-600-db', 'Malibu Van Charming GT 600 DB', 'Eleganter Kastenwagen mit durchdachtem Grundriss und hochwertiger Ausstattung.', 'Premium', 142.00, 2, 'Düsseldorf', 'Diesel', 2024, 'Malibu', 'Van Charming GT 600 DB', '["Küche", "Bad/WC", "Dusche", "Heizung", "Solar", "Markise", "Navigation", "Automatik"]', 4.9, 21, (SELECT id FROM users WHERE email = 'wagner@example.com'));

-- Zusätzliche Buchungen
INSERT INTO bookings (booking_number, user_id, camper_van_id, start_date, end_date, pickup_location, return_location, total_days, base_price, addon_price, total_amount, status, payment_status, addons, insurance_package) VALUES
('CS-2024-003', (SELECT id FROM users WHERE email = 'mueller@example.com'), (SELECT id FROM camper_vans WHERE slug = 'carthago-chic-e-line-i51'), '2024-11-01', '2024-11-05', 'Dresden Hauptbahnhof', 'Dresden Hauptbahnhof', 4, 700.00, 60.00, 760.00, 'confirmed', 'paid', '["Fahrräder", "Navigation", "WiFi"]', 'premium'),

('CS-2024-004', (SELECT id FROM users WHERE email = 'schmidt@example.com'), (SELECT id FROM camper_vans WHERE slug = 'weinsberg-carabus-600-mq'), '2024-10-15', '2024-10-18', 'Nürnberg Zentrum', 'Nürnberg Zentrum', 3, 276.00, 45.00, 321.00, 'pending', 'pending', '["Fahrräder", "Kindersitz"]', 'basic'),

('CS-2024-005', (SELECT id FROM users WHERE email = 'becker@example.com'), (SELECT id FROM camper_vans WHERE slug = 'hobby-vantana-de-luxe-k65-et'), '2024-12-20', '2024-12-27', 'Hannover Messe', 'Hannover Messe', 7, 945.00, 105.00, 1050.00, 'confirmed', 'paid', '["Kindersitz", "Winterreifen", "Heizung"]', 'premium'),

('CS-2024-006', (SELECT id FROM users WHERE email = 'mueller@example.com'), (SELECT id FROM camper_vans WHERE slug = 'malibu-van-charming-gt-600-db'), '2024-09-10', '2024-09-14', 'Düsseldorf Airport', 'Düsseldorf Airport', 4, 568.00, 60.00, 628.00, 'completed', 'paid', '["Navigation", "WiFi"]', 'basic');

-- Zusätzliche Reviews
INSERT INTO reviews (booking_id, user_id, camper_van_id, rating, title, content, is_verified, helpful_count) VALUES
((SELECT id FROM bookings WHERE booking_number = 'CS-2024-003'), (SELECT id FROM users WHERE email = 'mueller@example.com'), (SELECT id FROM camper_vans WHERE slug = 'carthago-chic-e-line-i51'), 5, 'Traumhaft luxuriös!', 'Ein absolut fantastisches Wohnmobil. Alles perfekt ausgestattet und sehr komfortabel. Die Fahrt war ein Traum!', true, 8),

((SELECT id FROM bookings WHERE booking_number = 'CS-2024-006'), (SELECT id FROM users WHERE email = 'mueller@example.com'), (SELECT id FROM camper_vans WHERE slug = 'malibu-van-charming-gt-600-db'), 5, 'Perfekte Wahl für Paare', 'Sehr eleganter und gut durchdachter Kastenwagen. Ideal für romantische Reisen zu zweit.', true, 12),

((SELECT id FROM bookings WHERE booking_number = 'CS-2024-005'), (SELECT id FROM users WHERE email = 'becker@example.com'), (SELECT id FROM camper_vans WHERE slug = 'hobby-vantana-de-luxe-k65-et'), 4, 'Toll für Familien', 'Viel Platz für die ganze Familie. Kinder waren begeistert. Nur die Heizung könnte etwas stärker sein.', true, 5);

-- Zusätzliche Notifications
INSERT INTO notifications (user_id, type, title, message) VALUES
((SELECT id FROM users WHERE email = 'mueller@example.com'), 'booking_confirmed', 'Buchung bestätigt', 'Ihre Buchung CS-2024-003 wurde bestätigt. Wir freuen uns auf Ihre Reise!'),
((SELECT id FROM users WHERE email = 'schmidt@example.com'), 'payment_reminder', 'Zahlungserinnerung', 'Bitte begleichen Sie den offenen Betrag für Buchung CS-2024-004.'),
((SELECT id FROM users WHERE email = 'becker@example.com'), 'review_request', 'Bewertung erwünscht', 'Wie war Ihre Reise? Teilen Sie Ihre Erfahrungen mit anderen Reisenden!');

-- Wishlist Einträge
INSERT INTO wishlists (user_id, camper_van_id) VALUES
((SELECT id FROM users WHERE email = 'schmidt@example.com'), (SELECT id FROM camper_vans WHERE slug = 'carthago-chic-e-line-i51')),
((SELECT id FROM users WHERE email = 'becker@example.com'), (SELECT id FROM camper_vans WHERE slug = 'volkswagen-california-6-1-ocean')),
((SELECT id FROM users WHERE email = 'mueller@example.com'), (SELECT id FROM camper_vans WHERE slug = 'hymer-bmci-580'));

-- Update camper van ratings based on new reviews
UPDATE camper_vans SET 
    rating = COALESCE((SELECT AVG(rating::numeric) FROM reviews WHERE camper_van_id = camper_vans.id), 0),
    review_count = COALESCE((SELECT COUNT(*) FROM reviews WHERE camper_van_id = camper_vans.id), 0);
