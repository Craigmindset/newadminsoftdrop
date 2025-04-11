import { createClient } from "@supabase/supabase-js";

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Supabase environment variables not configured properly.
    Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file
    Example:
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  `);
}

// Verify URL format
if (!supabaseUrl.startsWith("https://") || supabaseUrl.includes("/auth/v1")) {
  throw new Error(`
    Invalid Supabase URL format.
    URL should be in format: https://[project-ref].supabase.co
    Remove any /auth/v1 suffix
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type SenderProfile = {
  id?: string;
  user_id: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
  full_name?: string;
  email?: string;
  address?: string;
};
