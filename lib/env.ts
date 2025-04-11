export function validateEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`
      Missing Supabase configuration:
      - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "Set" : "Not set"}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? "Set" : "Not set"}
    `);
  }

  if (supabaseUrl.includes("/auth/v1")) {
    throw new Error(`
      Invalid Supabase URL format detected.
      Remove '/auth/v1' from your URL.
      Current: ${supabaseUrl}
      Should be: https://[project-ref].supabase.co
    `);
  }

  return {
    supabaseUrl,
    supabaseKey,
  };
}
