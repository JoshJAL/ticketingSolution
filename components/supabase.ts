import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_ANON_KEY

export default createClient(supabaseAnonKey as string, supabaseUrl as string)