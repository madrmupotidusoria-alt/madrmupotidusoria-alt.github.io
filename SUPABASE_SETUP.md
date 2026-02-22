# 🗄️ Supabase Integration Guide

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a region close to your users
4. Wait for project to be created
5. Go to Settings > API to get your credentials

### 2. Get Your Credentials
- **Project URL**: `https://your-project-ref.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Update Your HTML
Replace these lines in `index.html`:
```javascript
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
```

### 4. Set Up Database
1. Go to Supabase Dashboard > SQL Editor
2. Copy-paste the schema from `database/schema.sql`
3. Click "Run" to execute

### 5. Add Sample Data (Optional)
```sql
INSERT INTO breach_records (email, username, full_name, password_hash, ip_address, risk_score, last_seen)
VALUES 
  ('admin@example.com', 'admin', 'Admin User', '5f4dcc3b5aa765d61d8327deb882cf99', '192.168.1.100', 'high', '2024-01-15'),
  ('user@test.com', 'testuser123', 'Test User', 'e99a18c428cb38d5f260853678922e038', '10.0.0.50', 'medium', '2024-01-14');
```

## 🔧 Features Implemented

### ✅ Database Schema
- `breaches` table - breach information
- `breach_records` table - individual records
- `search_logs` table - analytics
- Row Level Security (RLS) enabled
- Performance indexes

### ✅ Search Functionality
- Multi-type search (email, username, IP, etc.)
- Wildcard search support
- Case sensitive option
- Real-time search with Supabase
- Search analytics logging

### ✅ User Interface
- Professional results display
- Risk scoring (low/medium/high/critical)
- Responsive design
- Loading states
- Error handling

## 🎯 Next Steps

### 1. Production Deployment
```javascript
// Use environment variables for production
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);
```

### 2. Advanced Features
- User authentication
- Search history
- Export results
- API rate limiting
- Real-time notifications

### 3. Security
- Enable RLS policies
- Use service roles for admin functions
- Implement API key authentication
- Add request validation

## 🌐 Live Deployment

Your breach lookup platform is now ready with:
- ✅ Supabase database integration
- ✅ Real-time search capabilities
- ✅ Professional UI
- ✅ Analytics tracking
- ✅ Scalable architecture

## 📞 Support

For issues:
1. Check Supabase logs
2. Verify database schema
3. Test search functionality
4. Check browser console for errors

## 🔗 Resources

- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Database Guide](https://supabase.com/docs/guides/database)
