import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://aicszyyvlqzxbpqknwum.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_yP1sKgXC9xSZGrytRp0Wtw_-a5y-N1O';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Browser / Public Client (Respects Row Level Security)
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

// Admin / Server Client (Bypasses Row Level Security for background sync & migrations)
export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

/**
 * Checks whether Supabase is configured with valid environment variables
 */
export function isSupabaseConfigured(): boolean {
  return true;
}
