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

  // Clean and validate URL
  let cleanUrl = supabaseUrl
    .replace(/\/auth\/v1$/, "") // Remove auth suffix if present
    .replace(/\/$/, ""); // Remove trailing slash

  if (!cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl.replace(/^https?:\/\//, "")}`;
  }

  // Validate final URL format
  if (!/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(cleanUrl)) {
    throw new Error(`
      Invalid Supabase URL format.
      Received: ${supabaseUrl}
      Cleaned: ${cleanUrl}
      Expected format: https://[project-ref].supabase.co
    `);
  }

  return {
    supabaseUrl: cleanUrl,
    supabaseKey,
  };
}

// Runtime check (only in development)
if (process.env.NODE_ENV === "development") {
  try {
    const { supabaseUrl } = validateEnv();
    console.log("Supabase URL validated:", supabaseUrl);
  } catch (error) {
    console.error(
      "Environment configuration error:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
