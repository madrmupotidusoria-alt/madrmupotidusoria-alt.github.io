import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://sb_publishable_i2050anXy9VyKvBs0_GpTg_J52BP_72.supabase.co'
const supabaseKey = 'sb_publishable_i2050anXy9VyKvBs0_GpTg_J52BP_72'

export const supabase = createClient(supabaseUrl, supabaseKey)
