-- Breach Lookup Database Schema for Supabase

-- Breaches table
CREATE TABLE breaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    records_count INTEGER,
    data_types TEXT[], -- Array of data types
    domains TEXT[], -- Array of affected domains
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Records table (individual breach records)
CREATE TABLE breach_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT,
    username TEXT,
    full_name TEXT,
    password_hash TEXT,
    ip_address INET,
    phone TEXT,
    breaches UUID[] REFERENCES breaches(id), -- Array of breach IDs
    risk_score TEXT CHECK (risk_score IN ('low', 'medium', 'high', 'critical')),
    last_seen DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search logs for analytics
CREATE TABLE search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    search_query TEXT NOT NULL,
    search_types TEXT[], -- Array of search types used
    results_count INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_breach_records_email ON breach_records(email);
CREATE INDEX idx_breach_records_username ON breach_records(username);
CREATE INDEX idx_breach_records_ip ON breach_records(ip_address);
CREATE INDEX idx_search_logs_created ON search_logs(created_at);

-- Row Level Security (RLS)
ALTER TABLE breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access for breaches" ON breaches
    FOR SELECT USING (true);

CREATE POLICY "Public read access for breach_records" ON breach_records
    FOR SELECT USING (true);

CREATE POLICY "Public insert for search logs" ON search_logs
    FOR INSERT WITH CHECK (true);
