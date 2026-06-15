import { createClient } from "@supabase/supabase-js";

// Public Supabase connection. These are browser-safe values (the anon key is
// designed to be shipped to the client; row access is governed by the database
// policies). They can be overridden at build time with environment variables.
const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://cyjahjsebsdogmzaojvh.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "sb_publishable_rXxw9FURHDHz-zfsYCcLTg_EIpoZnvS";

// When a URL/key is present we create a client; otherwise the app gracefully
// falls back to localStorage-only behaviour.
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      })
    : null;

export const isSupabaseConfigured = () => Boolean(supabase);
