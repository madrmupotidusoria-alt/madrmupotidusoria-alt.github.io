import { createClient } from '@supabase/supabase-js'

// Use environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://i2050anxy9vykvbs0_gptg_j52bp_72.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImkyMDUwYW5YeTlWeUt2QnMwX0dwVGdfSjUyQlBfNzIiLCJpYXQiOjE3MzY4NzU4MDksImV4cCI6MjA1MjQ1MTgwOX0.w3kFjKJhQjJ9ZQYxVhJQJhQjJ9ZQYxVhJQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
