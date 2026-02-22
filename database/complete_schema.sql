-- Complete SCANORA Database Schema for Supabase
-- Includes Login/Register functionality and breach lookup system

-- ========================================
-- USER AUTHENTICATION TABLES
-- ========================================

-- User Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium')),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
    search_credits INTEGER DEFAULT 10,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Settings table
CREATE TABLE user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    search_history_enabled BOOLEAN DEFAULT true,
    auto_save_searches BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Search History
CREATE TABLE user_search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    search_query TEXT NOT NULL,
    search_types TEXT[], -- Array of search types used
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- BREACH DATA TABLES
-- ========================================

-- Breaches table
CREATE TABLE breaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    records_count INTEGER,
    data_types TEXT[], -- Array of data types
    domains TEXT[], -- Array of affected domains
    description TEXT,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    verified BOOLEAN DEFAULT false,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Records table (individual breach records)
CREATE TABLE breach_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT,
    username TEXT,
    full_name TEXT,
    password_hash TEXT,
    password_strength TEXT CHECK (password_strength IN ('weak', 'medium', 'strong')),
    ip_address INET,
    phone TEXT,
    country TEXT,
    breach_id UUID REFERENCES breaches(id), -- Single breach reference (not array)
    risk_score TEXT CHECK (risk_score IN ('low', 'medium', 'high', 'critical')),
    last_seen DATE,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for many-to-many relationship between breach_records and breaches
CREATE TABLE breach_record_breaches (
    record_id UUID REFERENCES breach_records(id) ON DELETE CASCADE,
    breach_id UUID REFERENCES breaches(id) ON DELETE CASCADE,
    PRIMARY KEY (record_id, breach_id)
);

-- Search logs for analytics
CREATE TABLE search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id), -- Can be null for anonymous (future use)
    search_query TEXT NOT NULL,
    search_types TEXT[], -- Array of search types used
    results_count INTEGER,
    ip_address INET,
    user_agent TEXT,
    response_time INTEGER, -- Response time in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- API USAGE AND RATE LIMITING
-- ========================================

-- API Keys table for premium users
CREATE TABLE api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    key_hash TEXT UNIQUE NOT NULL, -- Hashed API key
    name TEXT NOT NULL, -- User-friendly name for the key
    permissions TEXT[], -- Array of permissions
    rate_limit INTEGER DEFAULT 1000, -- Requests per hour
    last_used TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Usage Logs
CREATE TABLE api_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id UUID REFERENCES api_keys(id),
    user_id UUID REFERENCES profiles(id),
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SUBSCRIPTIONS AND BILLING
-- ========================================

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    price DECIMAL(10,2),
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly')),
    search_credits INTEGER,
    api_rate_limit INTEGER,
    features TEXT[], -- Array of enabled features
    started_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- User-related indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_search_history_user_id ON user_search_history(user_id);
CREATE INDEX idx_user_search_history_created ON user_search_history(created_at);

-- Breach data indexes
CREATE INDEX idx_breach_records_email ON breach_records(email);
CREATE INDEX idx_breach_records_username ON breach_records(username);
CREATE INDEX idx_breach_records_ip ON breach_records(ip_address);
CREATE INDEX idx_breach_records_phone ON breach_records(phone);
CREATE INDEX idx_breach_records_risk_score ON breach_records(risk_score);
CREATE INDEX idx_breach_records_breach_id ON breach_records(breach_id);
CREATE INDEX idx_breaches_severity ON breaches(severity);
CREATE INDEX idx_breaches_date ON breaches(date);

-- Junction table indexes
CREATE INDEX idx_breach_record_breaches_record_id ON breach_record_breaches(record_id);
CREATE INDEX idx_breach_record_breaches_breach_id ON breach_record_breaches(breach_id);

-- Search and analytics indexes
CREATE INDEX idx_search_logs_created ON search_logs(created_at);
CREATE INDEX idx_search_logs_user_id ON search_logs(user_id);
CREATE INDEX idx_api_usage_logs_created ON api_usage_logs(created_at);
CREATE INDEX idx_api_usage_logs_api_key_id ON api_usage_logs(api_key_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_record_breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES
-- ========================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User Settings policies
CREATE POLICY "Users can manage own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- User Search History policies
CREATE POLICY "Users can manage own search history" ON user_search_history
    FOR ALL USING (auth.uid() = user_id);

-- Breaches policies (public read access)
CREATE POLICY "Public read access for breaches" ON breaches
    FOR SELECT USING (true);

-- Breach Records policies (public read access for authenticated users)
CREATE POLICY "Authenticated users can read breach records" ON breach_records
    FOR SELECT USING (auth.role() = 'authenticated');

-- Junction table policies (public read access for authenticated users)
CREATE POLICY "Authenticated users can read breach relationships" ON breach_record_breaches
    FOR SELECT USING (auth.role() = 'authenticated');

-- Search Logs policies
CREATE POLICY "Users can insert own search logs" ON search_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own search logs" ON search_logs
    FOR SELECT USING (auth.uid() = user_id);

-- API Keys policies
CREATE POLICY "Users can manage own API keys" ON api_keys
    FOR ALL USING (auth.uid() = user_id);

-- API Usage Logs policies
CREATE POLICY "Users can view own API usage logs" ON api_usage_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- ========================================
-- TRIGGERS AND FUNCTIONS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breach_records_updated_at BEFORE UPDATE ON breach_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breaches_updated_at BEFORE UPDATE ON breaches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (new.id, new.raw_user_meta_data->>'username', new.email);
    
    INSERT INTO public.user_settings (user_id)
    VALUES (new.id);
    
    -- Give free tier subscription
    INSERT INTO public.subscriptions (user_id, tier, status, search_credits, api_rate_limit, features, started_at)
    VALUES (new.id, 'free', 'active', 10, 100, ARRAY['basic_search'], NOW());
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to deduct search credits
CREATE OR REPLACE FUNCTION public.deduct_search_credit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    -- Get current credits
    SELECT search_credits INTO current_credits
    FROM profiles
    WHERE id = user_uuid;
    
    -- Check if user has credits
    IF current_credits <= 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct one credit
    UPDATE profiles
    SET search_credits = search_credits - 1
    WHERE id = user_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Sample breach data
INSERT INTO breaches (name, date, records_count, data_types, domains, description, severity, verified)
VALUES 
    ('Example Breach 2023', '2023-01-15', 1000000, ARRAY['email', 'password'], ARRAY['example.com'], 'A sample breach for testing', 'high', true),
    ('Test Data Leak', '2023-06-20', 500000, ARRAY['username', 'email'], ARRAY['test.org'], 'Another test breach', 'medium', true);

-- Sample breach records
INSERT INTO breach_records (email, username, password_hash, ip_address, breach_id, risk_score)
VALUES 
    ('test@example.com', 'testuser', 'hashed_password_1', '192.168.1.1', (SELECT id FROM breaches WHERE name = 'Example Breach 2023'), 'medium'),
    ('user@test.org', 'sampleuser', 'hashed_password_2', '10.0.0.1', (SELECT id FROM breaches WHERE name = 'Test Data Leak'), 'low');

-- Insert junction table relationships (if a record belongs to multiple breaches)
INSERT INTO breach_record_breaches (record_id, breach_id)
SELECT 
    br.id as record_id,
    b.id as breach_id
FROM breach_records br
CROSS JOIN breaches b
WHERE br.email IN ('test@example.com', 'user@test.org');

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- User profile with subscription info
CREATE VIEW user_profile_complete AS
SELECT 
    p.id,
    p.username,
    p.email,
    p.full_name,
    p.avatar_url,
    p.role,
    p.subscription_tier,
    p.search_credits,
    p.last_login,
    p.created_at,
    s.tier as current_subscription_tier,
    s.status as subscription_status,
    s.search_credits as subscription_credits,
    s.ends_at as subscription_ends_at
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id AND s.status = 'active';

-- Recent search history for users
CREATE VIEW recent_user_searches AS
SELECT 
    h.user_id,
    h.search_query,
    h.search_types,
    h.results_count,
    h.created_at,
    p.username
FROM user_search_history h
JOIN profiles p ON h.user_id = p.id
ORDER BY h.created_at DESC;

-- ========================================
-- SECURITY NOTES
-- ========================================

-- 1. Always use parameterized queries in your application
-- 2. Implement proper rate limiting at the application level
-- 3. Use environment variables for sensitive configuration
-- 4. Regularly review and update RLS policies
-- 5. Monitor API usage and implement alerts for suspicious activity
-- 6. Consider implementing additional audit logging for compliance

-- ========================================
-- PERFORMANCE OPTIMIZATION NOTES
-- ========================================

-- 1. Consider partitioning large tables by date
-- 2. Implement proper connection pooling
-- 3. Use database backups and point-in-time recovery
-- 4. Monitor query performance and optimize slow queries
-- 5. Consider read replicas for heavy read operations
