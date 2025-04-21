import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
function getServiceSupabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials")
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    throw error
  }
}

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    // Check if the column already exists
    const { data: columns, error: columnsError } = await supabase.rpc("get_columns", {
      table_name: "sender_profiles",
    })

    if (columnsError) {
      console.error("Error checking columns:", columnsError)
      return NextResponse.json({ error: columnsError.message }, { status: 500 })
    }

    const hasProfileImageColumn = columns.some((column: any) => column.column_name === "profile_image_url")

    if (hasProfileImageColumn) {
      return NextResponse.json({ message: "Column already exists", status: "success" })
    }

    // Add the column if it doesn't exist
    const { error } = await supabase.rpc("add_column_if_not_exists", {
      table_name: "sender_profiles",
      column_name: "profile_image_url",
      column_type: "text",
    })

    if (error) {
      console.error("Error adding column:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create the storage bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json({ error: bucketsError.message }, { status: 500 })
    }

    const profileImagesBucketExists = buckets.some((bucket: any) => bucket.name === "profile_images")

    if (!profileImagesBucketExists) {
      const { error: createBucketError } = await supabase.storage.createBucket("profile_images", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError)
        return NextResponse.json({ error: createBucketError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      message: "Migration completed successfully",
      columnAdded: !hasProfileImageColumn,
      bucketCreated: !profileImagesBucketExists,
      status: "success",
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
