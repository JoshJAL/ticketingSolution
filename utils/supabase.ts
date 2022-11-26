import { createClient } from '@supabase/supabase-js';

// it'll never be null, but let's make it happy without non-null assertions
export default createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_CLIENT_ANON_KEY!);
