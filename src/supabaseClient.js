import { createClient } from '@supabase/supabase-js'

// Replace these with the actual URL and Key from your dashboard
const supabaseUrl = 'https://bpbbljmzgnjiusavpgdg.supabase.co'
const supabaseAnonKey = 'sb_publishable_YxNCAWQYsqTDlheTuzP6SA_5yffyH_S'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
