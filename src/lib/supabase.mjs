// src/lib/supabase.mjs — Public Supabase client factory.
// This client only exposes public RLS-readable data.
// Auth persistence is disabled because this client runs during build-time only.

import { createClient } from '@supabase/supabase-js';

/**
 * Create a public Supabase client for build-time reads.
 * @param {{supabaseUrl: string, supabasePublishableKey: string}} env
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createPublicClient(env) {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error('Public client requires both SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY');
  }

  return createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
