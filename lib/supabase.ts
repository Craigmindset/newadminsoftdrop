import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function resolveSupabaseKey() {
  if (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return {
      key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      source: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    };
  }
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      source: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    };
  }
  if (process.env.SUPABASE_PUBLISHABLE_KEY) {
    return {
      key: process.env.SUPABASE_PUBLISHABLE_KEY,
      source: "SUPABASE_PUBLISHABLE_KEY",
    };
  }
  if (process.env.SUPABASE_ANON_KEY) {
    return { key: process.env.SUPABASE_ANON_KEY, source: "SUPABASE_ANON_KEY" };
  }
  return { key: "", source: "none" };
}

// Get environment variables
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
  process.env.SUPABASE_PROJECT_URL ||
  "";

const resolvedKey = resolveSupabaseKey();
const supabaseAnonKey = resolvedKey.key;

// Log environment variables for debugging (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set");
  console.log("Supabase Key Source:", resolvedKey.source);
  console.log(
    "Supabase Key Prefix:",
    supabaseAnonKey.slice(0, 12) || "Not set",
  );
  console.log("Supabase Key Length:", supabaseAnonKey.length || 0);
}

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

// Defer creation until env is present to avoid build-time crashes.
export const supabase: SupabaseClient =
  createSupabaseClient() ??
  (new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and a public Supabase key.",
        );
      },
    },
  ) as SupabaseClient);

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

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

export type AdminRole =
  | "super_admin"
  | "manager"
  | "support"
  | "finance"
  | "marketing";

export type AdminProfile = {
  id: string;
  email: string;
  role: AdminRole;
  first_name?: string | null;
  last_name?: string | null;
  is_active?: boolean;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
};
