-- Vollständige Sample-Daten für CamperShare - ALLE Modelle
-- Diese Datei ersetzt sowohl 02-sample-data.sql als auch extended-sample-data.sql

-- Benutzer (Admins, Kunden und Vermieter)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, city, country) VALUES
-- Admins
('550e8400-e29b-41d4-a716-446655440001', 'admin@campershare.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Admin', 'User', '+49 123 456789', 'admin', 'Berlin', 'Germany'),

-- Vermieter (Provider)
('550e8400-e29b-41d4-a716-446655440003', 'vermieter@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Anna', 'Schmidt', '+49 111 222333', 'provider', 'München', 'Germany'),
('550e8400-e29b-41d4-a716-446655440010', 'wagner@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Michael', 'Wagner', '+49 177 11223344', 'provider', 'Hamburg', 'Germany'),
('550e8400-e29b-41d4-a716-446655440011', 'fischer@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Andreas', 'Fischer', '+49 179 55443322', 'provider', 'Köln', 'Germany'),
('550e8400-e29b-41d4-a716-446655440012', 'weber@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Claudia', 'Weber', '+49 160 98765432', 'provider', 'Frankfurt', 'Germany'),
('550e8400-e29b-41d4-a716-446655440013', 'hoffmann@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Stefan', 'Hoffmann', '+49 171 24681357', 'provider', 'Stuttgart', 'Germany'),

-- Kunden (Customer)
('550e8400-e29b-41d4-a716-446655440002', 'kunde@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Max', 'Mustermann', '+49 987 654321', 'customer', 'Berlin', 'Germany'),
('550e8400-e29b-41d4-a716-446655440004', 'mueller@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Thomas', 'Müller', '+49 176 12345678', 'customer', 'München', 'Germany'),
('550e8400-e29b-41d4-a716-446655440005', 'schmidt@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Sarah', 'Schmidt', '+49 175 87654321', 'customer', 'Berlin', 'Germany'),
('550e8400-e29b-41d4-a716-446655440006', 'becker@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Lisa', 'Becker', '+49 178 99887766', 'customer', 'Stuttgart', 'Germany'),
('550e8400-e29b-41d4-a716-446655440007', 'meyer@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'David', 'Meyer', '+49 162 13579246', 'customer', 'Hamburg', 'Germany'),
('550e8400-e29b-41d4-a716-446655440008', 'schulz@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Julia', 'Schulz', '+49 157 86420975', 'customer', 'Köln', 'Germany'),
('550e8400-e29b-41d4-a716-446655440009', 'zimmermann@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1k9YVHw.VjvQgs6l7cQLH11.5.OVOEC', 'Robert', 'Zimmermann', '+49 174 95173648', 'customer', 'Frankfurt', 'Germany');

-- ALLE 18 Wohnmobile aus camperVanData.js
INSERT INTO camper_vans (id, slug, name, description, type, price_per_day, beds, location, drive_type, year, brand, model, features, rating, review_count, owner_id) VALUES

-- 1. VW California Ocean
('660e8400-e29b-41d4-a716-446655440001', 'vw-california-ocean', 'VW California Ocean', 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen mit Aufstelldach und Miniküche.', 'Van', 89.00, 4, 'Berlin', 'Diesel', 2022, 'Volkswagen', 'California Ocean', '["Aufstelldach", "Miniküche", "Kühlschrank", "Aufbewahrungsschränke", "Ausziehbares Bett", "Swivel-Sitze"]', 4.5, 35, '550e8400-e29b-41d4-a716-446655440003'),

-- 2. Knaus BoxDrive
('660e8400-e29b-41d4-a716-446655440002', 'knaus-boxdrive', 'Knaus BoxDrive 600 MQ', 'Kompakter Kastenwagen mit durchdachtem Grundriss. Ideal für Paare und kleine Familien. Ausgestattet mit moderner Technik und komfortabler Ausstattung.', 'Compact', 89.00, 2, 'Hamburg', 'Diesel', 2023, 'Knaus', 'BoxDrive 600 MQ', '["Küche", "Bad/WC", "Heizung", "Solar", "Markise", "Fahrräder"]', 4.7, 23, '550e8400-e29b-41d4-a716-446655440010'),

-- 3. Hymer B-MC T580
('660e8400-e29b-41d4-a716-446655440003', 'hymer-b-mc-t580', 'Hymer B-MC T580', 'Luxuriöser teilintegrierter Reisemobil mit erstklassiger Ausstattung. Perfekt für anspruchsvolle Reisende, die Komfort und Stil schätzen.', 'Premium', 149.00, 4, 'München', 'Diesel', 2023, 'Hymer', 'B-MC T580', '["Küche", "Bad/WC", "Dusche", "Heizung", "Klimaanlage", "Solar", "TV", "Markise", "Sat-Anlage", "Navigation"]', 4.9, 45, '550e8400-e29b-41d4-a716-446655440003'),

-- 4. Weinsberg CaraOne 480 QDK
('660e8400-e29b-41d4-a716-446655440004', 'weinsberg-caraone-480qdk', 'Weinsberg CaraOne 480 QDK', 'Kompakter Kastenwagen mit intelligentem Raumkonzept. Perfekt für Abenteuer zu zweit mit allem nötigen Komfort.', 'Compact', 95.00, 2, 'Köln', 'Diesel', 2022, 'Weinsberg', 'CaraOne 480 QDK', '["Küche", "Bad/WC", "Heizung", "Solar", "Fahrräder", "WiFi"]', 4.6, 18, '550e8400-e29b-41d4-a716-446655440011'),

-- 5. Adria Twin Supreme 640 SLX
('660e8400-e29b-41d4-a716-446655440005', 'adria-twin-supreme-640slx', 'Adria Twin Supreme 640 SLX', 'Vielseitiger Kastenwagen mit großzügigem Raumangebot. Ideal für längere Reisen und Outdoor-Aktivitäten.', 'Adventure', 109.00, 2, 'Frankfurt', 'Diesel', 2023, 'Adria', 'Twin Supreme 640 SLX', '["Küche", "Bad/WC", "Dusche", "Heizung", "Solar", "Markise", "Fahrräder", "Navigation"]', 4.5, 31, '550e8400-e29b-41d4-a716-446655440012'),

-- 6. Laika Kosmo Campervan 3012
('660e8400-e29b-41d4-a716-446655440006', 'laika-kosmo-campervan-3012', 'Laika Kosmo Campervan 3012', 'Italienischer Premium-Kastenwagen mit elegantem Design und hochwertiger Ausstattung für anspruchsvolle Reisende.', 'Premium', 135.00, 2, 'Stuttgart', 'Diesel', 2024, 'Laika', 'Kosmo Campervan 3012', '["Küche", "Bad/WC", "Dusche", "Heizung", "Klimaanlage", "Solar", "TV", "Markise", "Navigation"]', 4.8, 27, '550e8400-e29b-41d4-a716-446655440013'),

-- 7. Concorde Liner Plus 996 L
('660e8400-e29b-41d4-a716-446655440007', 'concorde-liner-plus-996l', 'Concorde Liner Plus 996 L', 'Luxuriöses Reisemobil der Oberklasse mit exklusiver Ausstattung und außergewöhnlichem Komfort.', 'Luxury', 195.00, 4, 'Düsseldorf', 'Diesel', 2024, 'Concorde', 'Liner Plus 996 L', '["Küche", "Bad/WC", "Dusche", "Heizung", "Klimaanlage", "Solar", "TV", "Markise", "Sat-Anlage", "Navigation", "Leder", "Premium-Sound"]', 4.9, 15, '550e8400-e29b-41d4-a716-446655440003'),

-- 8. Malibu Van Charming GT 600 DB
('660e8400-e29b-41d4-a716-446655440008', 'malibu-van-charming-gt-600-db', 'Malibu Van Charming GT 600 DB', 'Eleganter Kastenwagen mit durchdachtem Grundriss und hochwertiger Ausstattung.', 'Premium', 142.00, 2, 'Nürnberg', 'Diesel', 2024, 'Malibu', 'Van Charming GT 600 DB', '["Küche", "Bad/WC", "Dusche", "Heizung", "Solar", "Markise", "Navigation", "Automatik"]', 4.9, 21, '550e8400-e29b-41d4-a716-446655440010'),

-- 9. Dethleffs Pulse T7051
('660e8400-e29b-41d4-a716-446655440009', 'dethleffs-pulse-t7051', 'Dethleffs Pulse T7051', 'Modernes teilintegriertes Wohnmobil mit innovativer Ausstattung und familienfreundlichem Layout.', 'Family', 125.00, 4, 'Hannover', 'Diesel', 2023, 'Dethleffs', 'Pulse T7051', '["Küche", "Bad/WC", "Dusche", "Heizung", "TV", "Markise", "Garage", "Kindersitz"]', 4.6, 19, '550e8400-e29b-41d4-a716-446655440011'),

-- 10. Mercedes Marco Polo
('660e8400-e29b-41d4-a716-446655440010', 'mercedes-marco-polo', 'Mercedes Marco Polo', 'Luxuriöser Camping-Van von Mercedes mit Premium-Ausstattung und elegantem Design.', 'Premium', 135.00, 4, 'Bremen', 'Diesel', 2023, 'Mercedes', 'Marco Polo', '["Aufstelldach", "Miniküche", "Kühlschrank", "Bad/WC", "Heizung", "Navigation", "Premium-Ausstattung"]', 4.8, 33, '550e8400-e29b-41d4-a716-446655440012'),

-- 11. Fiat Ducato Maxi
('660e8400-e29b-41d4-a716-446655440011', 'fiat-ducato-maxi', 'Fiat Ducato Maxi Camper', 'Geräumiger Kastenwagen-Ausbau mit viel Platz und praktischer Ausstattung für längere Reisen.', 'Family', 95.00, 4, 'Dresden', 'Diesel', 2022, 'Fiat', 'Ducato Maxi', '["Küche", "Bad/WC", "Heizung", "Solar", "Fahrträger", "Dusche"]', 4.4, 25, '550e8400-e29b-41d4-a716-446655440013'),

-- 12. Bürstner Lyseo TD 690
('660e8400-e29b-41d4-a716-446655440012', 'buerstner-lyseo-td690', 'Bürstner Lyseo TD 690', 'Teilintegriertes Wohnmobil mit großzügigem Raumangebot und familienfreundlicher Ausstattung.', 'Family', 125.00, 6, 'Leipzig', 'Diesel', 2023, 'Bürstner', 'Lyseo TD 690', '["Küche", "Bad/WC", "Dusche", "Heizung", "TV", "Markise", "Garage", "Kindersitz", "Fahrräder"]', 4.4, 29, '550e8400-e29b-41d4-a716-446655440003'),

-- 13. Carthago C-Tourer I 144 LE
('660e8400-e29b-41d4-a716-446655440013', 'carthago-c-tourer-i144le', 'Carthago C-Tourer I 144 LE', 'Luxuriöses integriertes Wohnmobil mit erstklassiger Ausstattung und innovativer Technik.', 'Luxury', 185.00, 4, 'Wiesbaden', 'Diesel', 2024, 'Carthago', 'C-Tourer I 144 LE', '["Küche", "Bad/WC", "Dusche", "Heizung", "Klimaanlage", "Solar", "TV", "Markise", "Sat-Anlage", "Navigation", "Premium"]', 4.9, 18, '550e8400-e29b-41d4-a716-446655440010'),

-- 14. Hobby Optima OnTour V65 GF
('660e8400-e29b-41d4-a716-446655440014', 'hobby-optima-ontour-v65-gf', 'Hobby Optima OnTour V65 GF', 'Kastenwagen mit intelligentem Grundriss und praktischer Ausstattung für aktive Reisende.', 'Adventure', 105.00, 2, 'Dortmund', 'Diesel', 2023, 'Hobby', 'Optima OnTour V65 GF', '["Küche", "Bad/WC", "Heizung", "Solar", "Fahrräder", "Markise"]', 4.5, 22, '550e8400-e29b-41d4-a716-446655440011'),

-- 15. Ford Nugget Plus
('660e8400-e29b-41d4-a716-446655440015', 'ford-nugget-plus', 'Ford Nugget Plus', 'Kompakter und wendiger Kastenwagen von Ford, ideal für spontane Abenteuer und Stadtreisen.', 'Compact', 85.00, 4, 'Essen', 'Diesel', 2022, 'Ford', 'Nugget Plus', '["Aufstelldach", "Miniküche", "Kühlschrank", "Heizung", "Solar"]', 4.3, 17, '550e8400-e29b-41d4-a716-446655440012'),

-- 16. Pössl Roadcruiser B
('660e8400-e29b-41d4-a716-446655440016', 'poessl-roadcruiser-b', 'Pössl Roadcruiser B', 'Hochwertiger Kastenwagen mit innovativem Design und durchdachter Raumaufteilung.', 'Premium', 125.00, 2, 'Mannheim', 'Diesel', 2024, 'Pössl', 'Roadcruiser B', '["Küche", "Bad/WC", "Dusche", "Heizung", "Solar", "Navigation"]', 4.7, 16, '550e8400-e29b-41d4-a716-446655440013'),

-- 17. Roller Team Zefiro 685
('660e8400-e29b-41d4-a716-446655440017', 'roller-team-zefiro-685', 'Roller Team Zefiro 685', 'Italienisches teilintegriertes Wohnmobil mit elegantem Design und komfortabler Ausstattung.', 'Family', 115.00, 4, 'Augsburg', 'Diesel', 2023, 'Roller Team', 'Zefiro 685', '["Küche", "Bad/WC", "Dusche", "Heizung", "TV", "Markise", "Garage"]', 4.5, 14, '550e8400-e29b-41d4-a716-446655440003'),

-- 18. Carado Banff 540
('660e8400-e29b-41d4-a716-446655440018', 'carado-banff-540', 'Carado Banff 540', 'Kompakter Kastenwagen mit cleverer Raumnutzung und moderner Ausstattung für Paare.', 'Compact', 92.00, 2, 'Kiel', 'Diesel', 2022, 'Carado', 'Banff 540', '["Küche", "Bad/WC", "Heizung", "Solar", "Fahrräder"]', 4.4, 13, '550e8400-e29b-41d4-a716-446655440010');

-- Realistische Buchungen für verschiedene Fahrzeuge
INSERT INTO bookings (id, booking_number, user_id, camper_van_id, start_date, end_date, pickup_location, return_location, total_days, base_price, addon_price, total_amount, status, payment_status, addons, insurance_package) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'CS-2024-001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '2024-07-15', '2024-07-22', 'Berlin Hauptbahnhof', 'Berlin Hauptbahnhof', 7, 623.00, 45.00, 668.00, 'completed', 'paid', '["Fahrräder", "Navigation"]', 'basic'),
('770e8400-e29b-41d4-a716-446655440002', 'CS-2024-002', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', '2024-08-10', '2024-08-17', 'München Zentrum', 'München Zentrum', 7, 1043.00, 105.00, 1148.00, 'confirmed', 'paid', '["Navigation", "WiFi", "Premium-Ausstattung"]', 'premium'),
('770e8400-e29b-41d4-a716-446655440003', 'CS-2024-003', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440007', '2024-11-01', '2024-11-05', 'Düsseldorf Airport', 'Düsseldorf Airport', 4, 780.00, 80.00, 860.00, 'confirmed', 'paid', '["Navigation", "WiFi", "Premium-Sound"]', 'premium'),
('770e8400-e29b-41d4-a716-446655440004', 'CS-2024-004', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', '2024-10-15', '2024-10-18', 'Hamburg Hauptbahnhof', 'Hamburg Hauptbahnhof', 3, 267.00, 45.00, 312.00, 'pending', 'pending', '["Fahrräder", "Solar"]', 'basic'),
('770e8400-e29b-41d4-a716-446655440005', 'CS-2024-005', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440012', '2024-12-20', '2024-12-27', 'Leipzig Zentrum', 'Leipzig Zentrum', 7, 875.00, 105.00, 980.00, 'confirmed', 'paid', '["Kindersitz", "Winterreifen", "Garage"]', 'premium'),
('770e8400-e29b-41d4-a716-446655440006', 'CS-2024-006', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440005', '2024-09-10', '2024-09-14', 'Frankfurt Airport', 'Frankfurt Airport', 4, 436.00, 60.00, 496.00, 'completed', 'paid', '["Navigation", "Fahrräder"]', 'basic'),
('770e8400-e29b-41d4-a716-446655440007', 'CS-2024-007', '550e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440010', '2024-06-05', '2024-06-12', 'Bremen Zentrum', 'Bremen Zentrum', 7, 945.00, 90.00, 1035.00, 'completed', 'paid', '["Navigation", "Premium-Ausstattung"]', 'premium');

-- Reviews für verschiedene Fahrzeuge
INSERT INTO reviews (id, booking_id, user_id, camper_van_id, rating, title, content, is_verified, helpful_count) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 5, 'Perfekter Wochenendtrip', 'Der VW California Ocean war ideal für unseren Hamburg-Trip. Sehr sauber und gut ausgestattet! Das Aufstelldach war ein Highlight.', true, 12),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 5, 'Luxus pur!', 'Der Hymer B-MC T580 ist ein Traum! Erstklassige Ausstattung, sehr komfortabel und perfekt für anspruchsvolle Reisen.', true, 18),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440007', 5, 'Absolut beeindruckend', 'Concorde Liner Plus - das ist Luxus auf höchstem Niveau. Jedes Detail durchdacht und perfekt verarbeitet.', true, 15),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440005', 4, 'Toll für Abenteuer', 'Adria Twin Supreme ist perfekt für Outdoor-Aktivitäten. Viel Stauraum für Fahrräder und Ausrüstung.', true, 9),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440012', 4, 'Familienfreundlich', 'Bürstner Lyseo TD 690 bietet viel Platz für die ganze Familie. Kinder waren begeistert von der Ausstattung.', true, 7),
('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440010', 5, 'Mercedes-Qualität', 'Marco Polo überzeugt durch Premium-Ausstattung und Mercedes-typische Qualität. Sehr zu empfehlen!', true, 14);

-- Notifications für Benutzer
INSERT INTO notifications (id, user_id, type, title, message, is_read) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'booking_confirmed', 'Buchung bestätigt', 'Ihre Buchung CS-2024-001 wurde bestätigt. Wir freuen uns auf Ihre Reise!', true),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'booking_confirmed', 'Buchung bestätigt', 'Ihre Buchung CS-2024-002 wurde bestätigt. Der Hymer wartet auf Sie!', true),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'payment_reminder', 'Zahlungserinnerung', 'Bitte begleichen Sie den offenen Betrag für Buchung CS-2024-004.', false),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'review_request', 'Bewertung erwünscht', 'Wie war Ihre Reise mit dem Concorde Liner? Teilen Sie Ihre Erfahrungen!', false),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', 'booking_reminder', 'Reise beginnt bald', 'Ihre Reise mit dem Adria Twin beginnt in 3 Tagen. Vergessen Sie nicht Ihren Führerschein!', false);

-- Wishlist Einträge für verschiedene Fahrzeuge
INSERT INTO wishlists (user_id, camper_van_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440007'), -- VW California interessiert sich für Concorde
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440013'), -- Hymer-Kunde interessiert sich für Carthago
('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440008'), -- Concorde-Kunde interessiert sich für Malibu
('550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003'), -- Knaus-Kunde interessiert sich für Hymer
('550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440010'), -- Bürstner-Kunde interessiert sich für Marco Polo
('550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440016'), -- Adria-Kunde interessiert sich für Pössl
('550e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440006'); -- Marco Polo-Kunde interessiert sich für Laika

-- Update camper van ratings and review counts based on inserted reviews
UPDATE camper_vans SET 
    rating = COALESCE((SELECT AVG(rating::numeric) FROM reviews WHERE camper_van_id = camper_vans.id), 0),
    review_count = COALESCE((SELECT COUNT(*) FROM reviews WHERE camper_van_id = camper_vans.id), 0);

-- Setze realistische Bewertungen für Fahrzeuge ohne Reviews (basierend auf camperVanData.js)
UPDATE camper_vans SET rating = 4.7, review_count = 23 WHERE slug = 'knaus-boxdrive';
UPDATE camper_vans SET rating = 4.6, review_count = 18 WHERE slug = 'weinsberg-caraone-480qdk';
UPDATE camper_vans SET rating = 4.8, review_count = 27 WHERE slug = 'laika-kosmo-campervan-3012';
UPDATE camper_vans SET rating = 4.6, review_count = 19 WHERE slug = 'dethleffs-pulse-t7051';
UPDATE camper_vans SET rating = 4.4, review_count = 25 WHERE slug = 'fiat-ducato-maxi';
UPDATE camper_vans SET rating = 4.9, review_count = 18 WHERE slug = 'carthago-c-tourer-i144le';
UPDATE camper_vans SET rating = 4.5, review_count = 22 WHERE slug = 'hobby-optima-ontour-v65-gf';
UPDATE camper_vans SET rating = 4.3, review_count = 17 WHERE slug = 'ford-nugget-plus';
UPDATE camper_vans SET rating = 4.7, review_count = 16 WHERE slug = 'poessl-roadcruiser-b';
UPDATE camper_vans SET rating = 4.5, review_count = 14 WHERE slug = 'roller-team-zefiro-685';
UPDATE camper_vans SET rating = 4.4, review_count = 13 WHERE slug = 'carado-banff-540';
UPDATE camper_vans SET rating = 4.9, review_count = 21 WHERE slug = 'malibu-van-charming-gt-600-db';
