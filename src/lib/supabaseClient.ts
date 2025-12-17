import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check connection (optional utility)
export const checkConnection = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase credentials missing.");
        return false;
    }
    const { error } = await supabase.from('daily_metrics').select('count', { count: 'exact', head: true });
    return !error;
};
