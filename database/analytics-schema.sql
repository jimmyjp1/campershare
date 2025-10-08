-- Analytics Schema für CamperShare Dashboard
-- Erstellt Tabellen und Views für erweiterte Statistiken

-- 1. Analytics Events Tabelle für Tracking
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    user_id UUID REFERENCES users(id),
    camper_van_id UUID REFERENCES camper_vans(id),
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Revenue Tracking
CREATE TABLE IF NOT EXISTS revenue_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) UNIQUE,
    gross_revenue DECIMAL(10,2) NOT NULL,
    net_revenue DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    revenue_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Camper Performance Metrics
CREATE TABLE IF NOT EXISTS camper_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camper_van_id UUID REFERENCES camper_vans(id),
    metric_date DATE NOT NULL,
    views_count INTEGER DEFAULT 0,
    bookings_count INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    occupancy_rate DECIMAL(5,2) DEFAULT 0, -- Prozent
    average_rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(camper_van_id, metric_date)
);

-- 4. Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_date ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_camper ON analytics_events(camper_van_id, created_at);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(revenue_date);
CREATE INDEX IF NOT EXISTS idx_camper_analytics_date ON camper_analytics(camper_van_id, metric_date);

-- 5. Views für Dashboard Queries

-- Tagesstatistiken
CREATE OR REPLACE VIEW daily_stats AS
SELECT 
    DATE(created_at) as stat_date,
    COUNT(*) as total_bookings,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_booking_value,
    COUNT(DISTINCT user_id) as unique_customers
FROM bookings 
WHERE status IN ('confirmed', 'completed')
GROUP BY DATE(created_at)
ORDER BY stat_date DESC;

-- Monatsstatistiken
CREATE OR REPLACE VIEW monthly_stats AS
SELECT 
    DATE_TRUNC('month', created_at) as stat_month,
    COUNT(*) as total_bookings,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_booking_value,
    COUNT(DISTINCT user_id) as unique_customers,
    COUNT(DISTINCT camper_van_id) as campers_booked
FROM bookings 
WHERE status IN ('confirmed', 'completed')
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY stat_month DESC;

-- Top Performing Campers
CREATE OR REPLACE VIEW top_campers AS
SELECT 
    cv.id,
    cv.name,
    cv.location,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_revenue,
    AVG(b.total_amount) as avg_booking_value,
    ROUND(
        (COUNT(b.id)::DECIMAL / 
         GREATEST(1, DATE_PART('day', CURRENT_DATE - cv.created_at))) * 30, 2
    ) as bookings_per_month
FROM camper_vans cv
LEFT JOIN bookings b ON cv.id = b.camper_van_id AND b.status IN ('confirmed', 'completed')
WHERE cv.is_active = true
GROUP BY cv.id, cv.name, cv.location, cv.created_at
ORDER BY total_revenue DESC NULLS LAST;

-- Kundensegmentierung
CREATE OR REPLACE VIEW customer_segments AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_spent,
    AVG(b.total_amount) as avg_booking_value,
    MAX(b.created_at) as last_booking_date,
    CASE 
        WHEN COUNT(b.id) >= 5 THEN 'VIP'
        WHEN COUNT(b.id) >= 3 THEN 'Loyal'
        WHEN COUNT(b.id) >= 2 THEN 'Repeat'
        ELSE 'New'
    END as customer_segment
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id AND b.status IN ('confirmed', 'completed')
GROUP BY u.id, u.first_name, u.last_name, u.email
ORDER BY total_spent DESC NULLS LAST;

-- Occupancy Rate per Camper
CREATE OR REPLACE VIEW camper_occupancy AS
SELECT 
    cv.id,
    cv.name,
    cv.location,
    COUNT(b.id) as bookings_count,
    COALESCE(SUM(b.total_days), 0) as total_booked_days,
    ROUND(
        (COALESCE(SUM(b.total_days), 0)::DECIMAL / 
         GREATEST(1, DATE_PART('day', CURRENT_DATE - cv.created_at))) * 100, 2
    ) as occupancy_rate_percent
FROM camper_vans cv
LEFT JOIN bookings b ON cv.id = b.camper_van_id 
    AND b.status IN ('confirmed', 'completed')
    AND b.start_date >= CURRENT_DATE - INTERVAL '365 days'
WHERE cv.is_active = true
GROUP BY cv.id, cv.name, cv.location, cv.created_at
ORDER BY occupancy_rate_percent DESC;

-- Revenue Trends (letzten 12 Monate)
CREATE OR REPLACE VIEW revenue_trends AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as bookings,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_booking_value
FROM bookings 
WHERE status IN ('confirmed', 'completed')
    AND created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Funktionen für Analytics

-- Funktion: Event tracken
CREATE OR REPLACE FUNCTION track_analytics_event(
    p_event_type VARCHAR(50),
    p_event_data JSONB DEFAULT '{}',
    p_user_id UUID DEFAULT NULL,
    p_camper_van_id UUID DEFAULT NULL,
    p_session_id VARCHAR(100) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO analytics_events (
        event_type, event_data, user_id, camper_van_id, 
        session_id, ip_address, user_agent
    ) VALUES (
        p_event_type, p_event_data, p_user_id, p_camper_van_id,
        p_session_id, p_ip_address, p_user_agent
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Funktion: Revenue Entry erstellen
CREATE OR REPLACE FUNCTION create_revenue_entry(
    p_booking_id UUID
) RETURNS VOID AS $$
DECLARE
    booking_rec RECORD;
    commission_rate DECIMAL := 0.15; -- 15% Commission
    tax_rate DECIMAL := 0.19; -- 19% VAT
BEGIN
    SELECT * INTO booking_rec FROM bookings WHERE id = p_booking_id;
    
    IF booking_rec.id IS NOT NULL THEN
        INSERT INTO revenue_analytics (
            booking_id,
            gross_revenue,
            net_revenue,
            commission,
            taxes,
            revenue_date
        ) VALUES (
            p_booking_id,
            booking_rec.total_amount,
            booking_rec.total_amount * (1 - commission_rate - tax_rate),
            booking_rec.total_amount * commission_rate,
            booking_rec.total_amount * tax_rate,
            booking_rec.start_date
        ) ON CONFLICT (booking_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Automatisch Revenue Entry bei neuer Buchung
CREATE OR REPLACE FUNCTION auto_create_revenue_entry() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        PERFORM create_revenue_entry(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_revenue_entry
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_revenue_entry();

-- Beispiel-Events für Testing
INSERT INTO analytics_events (event_type, event_data, session_id) VALUES
('page_view', '{"page": "/campers", "duration": 45}', 'session_123'),
('search', '{"query": "VW Bus", "filters": {"location": "Munich"}}', 'session_123'),
('camper_view', '{"camper_id": "abc123", "duration": 120}', 'session_456');

COMMIT;
