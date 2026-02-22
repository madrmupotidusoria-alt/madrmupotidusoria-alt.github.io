-- SCANORA User Data Management Schema
-- Complete system for registered and logged-in users

-- ========================================
-- CORE USER PROFILES
-- ========================================

-- Extended User Profiles (extends auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    is_verified BOOLEAN DEFAULT false,
    verification_token TEXT,
    reset_token TEXT,
    reset_token_expires TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences and Settings
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    search_notifications BOOLEAN DEFAULT true,
    security_alerts BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    auto_save_searches BOOLEAN DEFAULT true,
    public_profile BOOLEAN DEFAULT false,
    show_email_public BOOLEAN DEFAULT false,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Security Settings
CREATE TABLE user_security (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    backup_codes TEXT[],
    last_password_change TIMESTAMP WITH TIME ZONE,
    password_strength_score INTEGER CHECK (password_strength_score >= 0 AND password_strength_score <= 100),
    session_timeout_minutes INTEGER DEFAULT 1440, -- 24 hours
    require_2fa_for_login BOOLEAN DEFAULT false,
    ip_whitelist TEXT[],
    device_trust_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- USER ACTIVITY AND HISTORY
-- ========================================

-- User Login History
CREATE TABLE user_login_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    location TEXT,
    login_method TEXT CHECK (login_method IN ('email', 'google', 'github', 'sso')),
    success BOOLEAN DEFAULT true,
    failure_reason TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Search History
CREATE TABLE user_search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    search_query TEXT NOT NULL,
    search_types TEXT[], -- Array of search types used
    filters_used JSONB, -- Store filters as JSON
    results_count INTEGER,
    response_time INTEGER, -- Response time in milliseconds
    ip_address INET,
    user_agent TEXT,
    saved BOOLEAN DEFAULT false, -- Whether user saved this search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Saved Searches
CREATE TABLE user_saved_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    search_query TEXT NOT NULL,
    search_types TEXT[],
    filters JSONB,
    is_public BOOLEAN DEFAULT false,
    search_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- USER SUBSCRIPTIONS AND BILLING
-- ========================================

-- User Subscriptions
CREATE TABLE user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL CHECK (plan_name IN ('free', 'basic', 'premium', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'trial', 'cancelled', 'expired', 'suspended')),
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime')),
    search_credits INTEGER DEFAULT 10,
    api_calls_per_month INTEGER DEFAULT 100,
    features TEXT[], -- Array of enabled features
    max_concurrent_searches INTEGER DEFAULT 1,
    data_retention_days INTEGER DEFAULT 30,
    started_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    payment_method_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE user_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    usage_type TEXT NOT NULL CHECK (usage_type IN ('search', 'api_call', 'export', 'report')),
    usage_count INTEGER DEFAULT 1,
    credits_consumed INTEGER DEFAULT 1,
    metadata JSONB, -- Additional usage metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- USER API MANAGEMENT
-- ========================================

-- User API Keys
CREATE TABLE user_api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL, -- Hashed API key
    key_prefix TEXT, -- First few characters for identification
    permissions TEXT[], -- Array of permissions
    rate_limit_per_hour INTEGER DEFAULT 1000,
    allowed_ips TEXT[],
    allowed_domains TEXT[],
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Usage Logs
CREATE TABLE api_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id UUID REFERENCES user_api_keys(id),
    user_id UUID REFERENCES user_profiles(id),
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_size INTEGER,
    response_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- USER NOTIFICATIONS
-- ========================================

-- User Notifications
CREATE TABLE user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('system', 'security', 'billing', 'search', 'feature', 'marketing')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional notification data
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    action_url TEXT,
    action_text TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Preferences (detailed)
CREATE TABLE notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    in_app_enabled BOOLEAN DEFAULT true,
    frequency TEXT DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly', 'never')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, notification_type)
);

-- ========================================
-- USER ANALYTICS AND REPORTS
-- ========================================

-- User Analytics Summary
CREATE TABLE user_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_searches INTEGER DEFAULT 0,
    unique_search_terms INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    credits_used INTEGER DEFAULT 0,
    avg_response_time INTEGER,
    top_search_types TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- User Generated Reports
CREATE TABLE user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    report_name TEXT NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('search_summary', 'usage_stats', 'security_audit', 'export')),
    parameters JSONB,
    file_path TEXT,
    file_size INTEGER,
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- USER SESSIONS AND DEVICES
-- ========================================

-- Active User Sessions
CREATE TABLE user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    device_id TEXT,
    device_name TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    ip_address INET,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trusted Devices
CREATE TABLE user_trusted_devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    device_id TEXT UNIQUE NOT NULL,
    device_name TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    trusted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- User profile indexes
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_is_verified ON user_profiles(is_verified);
CREATE INDEX idx_user_profiles_last_login ON user_profiles(last_login);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- User security indexes
CREATE INDEX idx_user_security_user_id ON user_security(user_id);
CREATE INDEX idx_user_security_2fa_enabled ON user_security(two_factor_enabled);

-- Activity indexes
CREATE INDEX idx_login_history_user_id ON user_login_history(user_id);
CREATE INDEX idx_login_history_created ON user_login_history(created_at);
CREATE INDEX idx_search_history_user_id ON user_search_history(user_id);
CREATE INDEX idx_search_history_created ON user_search_history(created_at);
CREATE INDEX idx_saved_searches_user_id ON user_saved_searches(user_id);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_usage_user_id ON user_usage(user_id);
CREATE INDEX idx_usage_created ON user_usage(created_at);

-- API indexes
CREATE INDEX idx_api_keys_user_id ON user_api_keys(user_id);
CREATE INDEX idx_api_keys_is_active ON user_api_keys(is_active);
CREATE INDEX idx_api_usage_logs_created ON api_usage_logs(created_at);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_notifications_is_read ON user_notifications(is_read);
CREATE INDEX idx_notifications_created ON user_notifications(created_at);

-- Analytics indexes
CREATE INDEX idx_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_analytics_date ON user_analytics(date);

-- Session indexes
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_is_active ON user_sessions(is_active);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_trusted_devices_user_id ON user_trusted_devices(user_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all user tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trusted_devices ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES
-- ========================================

-- User Profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User Preferences policies
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- User Security policies
CREATE POLICY "Users can manage own security" ON user_security
    FOR ALL USING (auth.uid() = user_id);

-- Activity policies
CREATE POLICY "Users can manage own login history" ON user_login_history
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own search history" ON user_search_history
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved searches" ON user_saved_searches
    FOR ALL USING (auth.uid() = user_id);

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Usage policies
CREATE POLICY "Users can manage own usage" ON user_usage
    FOR ALL USING (auth.uid() = user_id);

-- API policies
CREATE POLICY "Users can manage own API keys" ON user_api_keys
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own API usage" ON api_usage_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Notification policies
CREATE POLICY "Users can manage own notifications" ON user_notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notification preferences" ON notification_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON user_analytics
    FOR ALL USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can manage own reports" ON user_reports
    FOR ALL USING (auth.uid() = user_id);

-- Session policies
CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own trusted devices" ON user_trusted_devices
    FOR ALL USING (auth.uid() = user_id);

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
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_security_updated_at BEFORE UPDATE ON user_security
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_saved_searches_updated_at BEFORE UPDATE ON user_saved_searches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON user_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_reports_updated_at BEFORE UPDATE ON user_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_api_keys_updated_at BEFORE UPDATE ON user_api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (id, username, email)
    VALUES (new.id, new.raw_user_meta_data->>'username', new.email);
    
    -- Create user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (new.id);
    
    -- Create user security settings
    INSERT INTO public.user_security (user_id)
    VALUES (new.id);
    
    -- Create free subscription
    INSERT INTO public.user_subscriptions (user_id, plan_name, status, search_credits, api_calls_per_month, features, started_at)
    VALUES (new.id, 'free', 'active', 10, 100, ARRAY['basic_search'], NOW());
    
    -- Create default notification preferences
    INSERT INTO public.notification_preferences (user_id, notification_type)
    VALUES 
        (new.id, 'system'),
        (new.id, 'security'),
        (new.id, 'billing'),
        (new.id, 'search');
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log login attempts
CREATE OR REPLACE FUNCTION public.log_user_login(
    user_uuid UUID,
    login_ip INET,
    user_agent_text TEXT,
    login_success BOOLEAN,
    failure_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Update login count and last login
    IF login_success THEN
        UPDATE public.user_profiles 
        SET 
            login_count = login_count + 1,
            last_login = NOW(),
            failed_login_attempts = 0,
            locked_until = NULL
        WHERE id = user_uuid;
    ELSE
        UPDATE public.user_profiles 
        SET 
            failed_login_attempts = failed_login_attempts + 1
        WHERE id = user_uuid;
        
        -- Lock account after 5 failed attempts
        IF (SELECT failed_login_attempts FROM public.user_profiles WHERE id = user_uuid) >= 5 THEN
            UPDATE public.user_profiles 
            SET locked_until = NOW() + INTERVAL '30 minutes'
            WHERE id = user_uuid;
        END IF;
    END IF;
    
    -- Log the login attempt
    INSERT INTO public.user_login_history (
        user_id, 
        login_time, 
        ip_address, 
        user_agent, 
        success, 
        failure_reason
    )
    VALUES (
        user_uuid, 
        NOW(), 
        login_ip, 
        user_agent_text, 
        login_success, 
        failure_reason
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct search credits
CREATE OR REPLACE FUNCTION public.deduct_search_credit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
    subscription_status TEXT;
BEGIN
    -- Get current subscription and credits
    SELECT 
        up.search_credits,
        us.status
    INTO current_credits, subscription_status
    FROM user_profiles up
    JOIN user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
    WHERE up.id = user_uuid;
    
    -- Check if user has active subscription and credits
    IF subscription_status IS NULL OR current_credits IS NULL OR current_credits <= 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct one credit
    UPDATE user_profiles
    SET search_credits = search_credits - 1
    WHERE id = user_uuid;
    
    -- Log usage
    INSERT INTO user_usage (user_id, usage_type, credits_consumed)
    VALUES (user_uuid, 'search', 1);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Complete user profile view
CREATE VIEW user_complete_profile AS
SELECT 
    up.id,
    up.username,
    up.email,
    up.full_name,
    up.avatar_url,
    up.bio,
    up.website,
    up.location,
    up.is_verified,
    up.last_login,
    up.login_count,
    up.created_at,
    up.theme,
    up.email_notifications,
    up.two_factor_enabled,
    us.plan_name as subscription_plan,
    us.status as subscription_status,
    us.search_credits,
    us.ends_at as subscription_ends_at,
    COALESCE(usage_stats.total_searches, 0) as total_searches,
    COALESCE(usage_stats.credits_used, 0) as total_credits_used
FROM user_profiles up
LEFT JOIN user_preferences pref ON up.id = pref.user_id
LEFT JOIN user_security sec ON up.id = sec.user_id
LEFT JOIN user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) FILTER (WHERE usage_type = 'search') as total_searches,
        SUM(credits_consumed) as credits_used
    FROM user_usage
    GROUP BY user_id
) usage_stats ON up.id = usage_stats.user_id;

-- User dashboard statistics
CREATE VIEW user_dashboard_stats AS
SELECT 
    up.id as user_id,
    up.username,
    up.last_login,
    COALESCE(today_searches.count, 0) as searches_today,
    COALESCE(week_searches.count, 0) as searches_this_week,
    COALESCE(month_searches.count, 0) as searches_this_month,
    up.search_credits,
    us.plan_name,
    us.ends_at,
    COALESCE(unread_notifications.count, 0) as unread_notifications,
    COALESCE(active_sessions.count, 0) as active_sessions
FROM user_profiles up
LEFT JOIN user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM user_search_history
    WHERE DATE(created_at) = CURRENT_DATE
    GROUP BY user_id
) today_searches ON up.id = today_searches.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM user_search_history
    WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY user_id
) week_searches ON up.id = week_searches.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM user_search_history
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY user_id
) month_searches ON up.id = month_searches.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM user_notifications
    WHERE is_read = false
    GROUP BY user_id
) unread_notifications ON up.id = unread_notifications.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM user_sessions
    WHERE is_active = true AND expires_at > NOW()
    GROUP BY user_id
) active_sessions ON up.id = active_sessions.user_id;

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Sample user preferences
INSERT INTO user_preferences (user_id, theme, email_notifications, auto_save_searches)
SELECT 
    id as user_id,
    'dark' as theme,
    true as email_notifications,
    true as auto_save_searches
FROM auth.users
LIMIT 1;

-- Sample search history
INSERT INTO user_search_history (user_id, search_query, search_types, results_count)
SELECT 
    id as user_id,
    'test@example.com' as search_query,
    ARRAY['email'] as search_types,
    5 as results_count
FROM auth.users
LIMIT 1;

-- ========================================
-- SECURITY AND PERFORMANCE NOTES
-- ========================================

-- 1. Always use parameterized queries in your application
-- 2. Implement proper rate limiting at application level
-- 3. Use environment variables for sensitive configuration
-- 4. Regularly review and update RLS policies
-- 5. Monitor user activity for suspicious patterns
-- 6. Implement proper session management
-- 7. Use secure password hashing (bcrypt/argon2)
-- 8. Implement proper 2FA for enhanced security
-- 9. Consider implementing audit logging for compliance
-- 10. Monitor database performance and optimize slow queries
