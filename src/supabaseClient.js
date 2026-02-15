import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your actual Supabase credentials
// Go to: Supabase Dashboard → Settings → API
const supabaseUrl = 'https://wdbjtvxkatfyosarsrrv.supabase.co' // Your project URL
const supabaseKey = 'sb_publishable_i2050anXy9VyKvBs0_GpTg_J52BP_72' // Your anon key

export const supabase = createClient(supabaseUrl, supabaseKey)
