-- SCANORA - Setup Missing Tables Only
-- This script only creates tables that don't already exist

-- ========================================
-- CHECK AND CREATE MISSING TABLES
-- ========================================

-- Core User Profiles (only if not exists)
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- User Preferences (only if not exists)
CREATE TABLE IF NOT EXISTS user_preferences (
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

-- User Security (only if not exists)
CREATE TABLE IF NOT EXISTS user_security (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    backup_codes TEXT[],
    last_password_change TIMESTAMP WITH TIME ZONE,
    password_strength_score INTEGER CHECK (password_strength_score >= 0 AND password_strength_score <= 100),
    session_timeout_minutes INTEGER DEFAULT 1440,
    require_2fa_for_login BOOLEAN DEFAULT false,
    ip_whitelist TEXT[],
    device_trust_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Login History (only if not exists)
CREATE TABLE IF NOT EXISTS user_login_history (
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

-- User Search History (only if not exists)
CREATE TABLE IF NOT EXISTS user_search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    search_query TEXT NOT NULL,
    search_types TEXT[],
    filters_used JSONB,
    results_count INTEGER,
    response_time INTEGER,
    ip_address INET,
    user_agent TEXT,
    saved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Saved Searches (only if not exists)
CREATE TABLE IF NOT EXISTS user_saved_searches (
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

-- User Subscriptions (only if not exists)
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL CHECK (plan_name IN ('free', 'basic', 'premium', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'trial', 'cancelled', 'expired', 'suspended')),
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime')),
    search_credits INTEGER DEFAULT 10,
    api_calls_per_month INTEGER DEFAULT 100,
    features TEXT[],
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

-- User Usage (only if not exists)
CREATE TABLE IF NOT EXISTS user_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    usage_type TEXT NOT NULL CHECK (usage_type IN ('search', 'api_call', 'export', 'report')),
    usage_count INTEGER DEFAULT 1,
    credits_consumed INTEGER DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User API Keys (only if not exists)
CREATE TABLE IF NOT EXISTS user_api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    key_prefix TEXT,
    permissions TEXT[],
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

-- User Notifications (only if not exists)
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('system', 'security', 'billing', 'search', 'feature', 'marketing')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    action_url TEXT,
    action_text TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Preferences (only if not exists)
CREATE TABLE IF NOT EXISTS notification_preferences (
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

-- User Analytics (only if not exists)
CREATE TABLE IF NOT EXISTS user_analytics (
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

-- User Reports (only if not exists)
CREATE TABLE IF NOT EXISTS user_reports (
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

-- Trusted Devices (only if not exists)
CREATE TABLE IF NOT EXISTS user_trusted_devices (
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

-- API Usage Logs (only if not exists)
CREATE TABLE IF NOT EXISTS api_usage_logs (
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
-- CREATE INDEXES (only if not exists)
-- ========================================

-- User profile indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_verified ON user_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON user_profiles(last_login);

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- User security indexes
CREATE INDEX IF NOT EXISTS idx_user_security_user_id ON user_security(user_id);
CREATE INDEX IF NOT EXISTS idx_user_security_2fa_enabled ON user_security(two_factor_enabled);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON user_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created ON user_login_history(created_at);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON user_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created ON user_search_history(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON user_saved_searches(user_id);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_created ON user_usage(created_at);

-- API indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON user_api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created ON api_usage_logs(created_at);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON user_notifications(created_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON user_analytics(date);

-- Trusted devices indexes
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_id ON user_trusted_devices(user_id);

-- ========================================
-- ENABLE RLS (only if not already enabled)
-- ========================================

-- Enable RLS on new tables (skip if already enabled)
DO $$
BEGIN
    -- Enable RLS only if not already enabled
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_profiles' AND rowsecurity = false) THEN
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_preferences' AND rowsecurity = false) THEN
        ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_security' AND rowsecurity = false) THEN
        ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_login_history' AND rowsecurity = false) THEN
        ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_search_history' AND rowsecurity = false) THEN
        ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_saved_searches' AND rowsecurity = false) THEN
        ALTER TABLE user_saved_searches ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_subscriptions' AND rowsecurity = false) THEN
        ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_usage' AND rowsecurity = false) THEN
        ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_api_keys' AND rowsecurity = false) THEN
        ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_notifications' AND rowsecurity = false) THEN
        ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'notification_preferences' AND rowsecurity = false) THEN
        ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_analytics' AND rowsecurity = false) THEN
        ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_reports' AND rowsecurity = false) THEN
        ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_trusted_devices' AND rowsecurity = false) THEN
        ALTER TABLE user_trusted_devices ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'api_usage_logs' AND rowsecurity = false) THEN
        ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ========================================
-- CREATE RLS POLICIES (only if not exists)
-- ========================================

-- User Profiles policies
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User Preferences policies
CREATE POLICY IF NOT EXISTS "Users can manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- User Security policies
CREATE POLICY IF NOT EXISTS "Users can manage own security" ON user_security
    FOR ALL USING (auth.uid() = user_id);

-- Activity policies
CREATE POLICY IF NOT EXISTS "Users can manage own login history" ON user_login_history
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage own search history" ON user_search_history
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage own saved searches" ON user_saved_searches
    FOR ALL USING (auth.uid() = user_id);

-- Subscription policies
CREATE POLICY IF NOT EXISTS "Users can view own subscriptions" ON user_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Usage policies
CREATE POLICY IF NOT EXISTS "Users can manage own usage" ON user_usage
    FOR ALL USING (auth.uid() = user_id);

-- API policies
CREATE POLICY IF NOT EXISTS "Users can manage own API keys" ON user_api_keys
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own API usage" ON api_usage_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Notification policies
CREATE POLICY IF NOT EXISTS "Users can manage own notifications" ON user_notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage own notification preferences" ON notification_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY IF NOT EXISTS "Users can view own analytics" ON user_analytics
    FOR ALL USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY IF NOT EXISTS "Users can manage own reports" ON user_reports
    FOR ALL USING (auth.uid() = user_id);

-- Trusted Devices policies
CREATE POLICY IF NOT EXISTS "Users can manage own trusted devices" ON user_trusted_devices
    FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- CREATE FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for new tables
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_security_updated_at ON user_security;
CREATE TRIGGER update_user_security_updated_at BEFORE UPDATE ON user_security
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_saved_searches_updated_at ON user_saved_searches;
CREATE TRIGGER update_user_saved_searches_updated_at BEFORE UPDATE ON user_saved_searches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_analytics_updated_at ON user_analytics;
CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON user_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_reports_updated_at ON user_reports;
CREATE TRIGGER update_user_reports_updated_at BEFORE UPDATE ON user_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_api_keys_updated_at ON user_api_keys;
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

-- This script safely creates only the missing user management tables
-- All existing tables (like user_sessions) are left untouched
-- Run this script in your Supabase SQL Editor
