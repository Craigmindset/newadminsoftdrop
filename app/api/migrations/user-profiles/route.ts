import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // Check if tables exist
    const { data: tablesData, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .in("table_name", ["sender_profiles", "carrier_profiles"])

    if (tablesError) {
      throw new Error(`Error checking tables: ${tablesError.message}`)
    }

    const existingTables = tablesData?.map((t) => t.table_name) || []
    const missingTables = ["sender_profiles", "carrier_profiles"].filter((table) => !existingTables.includes(table))

    if (missingTables.length > 0) {
      // Read the migration SQL file
      const migrationSql = `
        -- Create sender_profiles table if it doesn't exist
        CREATE TABLE IF NOT EXISTS sender_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          full_name TEXT,
          email TEXT,
          phone_number TEXT,
          address TEXT,
          status TEXT CHECK (status IN ('active', 'inactive', 'pending', 'suspended')) DEFAULT 'pending',
          profile_image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create carrier_profiles table if it doesn't exist
        CREATE TABLE IF NOT EXISTS carrier_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          full_name TEXT,
          email TEXT,
          phone_number TEXT,
          address TEXT,
          vehicle_type TEXT,
          vehicle_registration TEXT,
          license_number TEXT,
          status TEXT CHECK (status IN ('active', 'inactive', 'pending', 'suspended')) DEFAULT 'pending',
          kyc_verified BOOLEAN DEFAULT FALSE,
          profile_image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Add indexes for better query performance
        CREATE INDEX IF NOT EXISTS idx_sender_profiles_user_id ON sender_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_carrier_profiles_user_id ON carrier_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_sender_profiles_status ON sender_profiles(status);
        CREATE INDEX IF NOT EXISTS idx_carrier_profiles_status ON carrier_profiles(status);
      `

      // Execute the migration
      const { error: migrationError } = await supabase.rpc("pgmigration", { query: migrationSql })

      if (migrationError) {
        throw new Error(`Migration error: ${migrationError.message}`)
      }

      return NextResponse.json({
        success: true,
        message: `Created missing tables: ${missingTables.join(", ")}`,
      })
    }

    return NextResponse.json({
      success: true,
      message: "All required tables already exist",
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during migration",
      },
      { status: 500 },
    )
  }
}
