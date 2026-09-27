import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = "https://pcouvfuckbwgccynghdt.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb3V2ZnVja2J3Z2NjeW5naGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTA3MzgsImV4cCI6MjEwNTY2NjczOH0.hctqpNrU1p2gH1mIgfk18cehaHFYI5gZin0t9dalNXA";

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : (process.env || {});
const rawUrl = (env.VITE_SUPABASE_URL || SUPABASE_URL || '').trim();
const rawKey = (env.VITE_SUPABASE_ANON_KEY || SUPABASE_KEY || '').trim();

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

