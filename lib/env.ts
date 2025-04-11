function cleanSupabaseUrl(url: string): string {
  // Remove variable name prefix if present
  let cleanUrl = url
    .replace(/^NEXT_PUBLIC_SUPABASE_URL=/, "")
    .trim()
    .replace(/\/auth\/v1$/, "")
    .replace(/\/$/, "");

  // Ensure https protocol
  if (!cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl.replace(/^https?:\/\//, "")}`;
  }

  return cleanUrl;
}

export function validateEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !rawKey) {
    throw new Error(`
      Missing Supabase configuration:
      - NEXT_PUBLIC_SUPABASE_URL: ${rawUrl ? "Set" : "Not set"}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${rawKey ? "Set" : "Not set"}
    `);
  }

  const supabaseUrl = cleanSupabaseUrl(rawUrl);
  const supabaseKey = rawKey
    .replace(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=/, "")
    .trim();

  if (!/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(supabaseUrl)) {
    throw new Error(`
      Invalid Supabase URL format after cleaning.
      Original: ${rawUrl}
      Cleaned: ${supabaseUrl}
      Expected format: https://[project-ref].supabase.co
    `);
  }

  return {
    supabaseUrl,
    supabaseKey,
  };
}

// Runtime check (development only)
if (process.env.NODE_ENV === "development") {
  try {
    const { supabaseUrl } = validateEnv();
    console.log("Validated Supabase URL:", supabaseUrl);
  } catch (error) {
    console.error(
      "Environment Configuration Error:",
      error instanceof Error ? error.message : error
    );
  }
}
