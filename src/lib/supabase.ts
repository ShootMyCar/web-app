import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = "https://pcouvfuckbwgccynghdt.supabase.co";
export const SUPABASE_KEY = "sb_secret_aXnIEBiXcw74E0pvOddEjQ_tEEZlzcB";

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_KEY || '').trim();

// Ensure clean URL without /rest/v1 or trailing slashes
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
export const supabaseAnonKey = rawKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('DEIN_PROJEKT')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

