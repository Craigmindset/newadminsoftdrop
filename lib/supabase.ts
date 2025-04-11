import { createClient } from "@supabase/supabase-js";
import { validateEnv } from "./env";

// Get validated environment variables
const { supabaseUrl, supabaseKey } = validateEnv();

export const supabase = createClient(supabaseUrl, supabaseKey, {
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

// Runtime check for proper configuration
if (typeof window !== "undefined") {
  console.log("Supabase initialized with URL:", supabaseUrl);
}
