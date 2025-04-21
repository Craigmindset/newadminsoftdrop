import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const timestamp = new Date().toISOString()
  const results: any = {
    timestamp,
    environment: process.env.VERCEL_ENV || "development",
    tests: {},
  }

  // Test 1: Check environment variables
  try {
    results.tests.environmentVariables = {
      status: "running",
      details: {},
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    results.tests.environmentVariables.details.supabaseUrl = {
      exists: !!supabaseUrl,
      value: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : null,
    }

    results.tests.environmentVariables.details.supabaseAnonKey = {
      exists: !!supabaseAnonKey,
      value: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 5)}...` : null,
    }

    results.tests.environmentVariables.details.supabaseServiceKey = {
      exists: !!supabaseServiceKey,
      value: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 5)}...` : null,
    }

    results.tests.environmentVariables.status = "completed"
    results.tests.environmentVariables.success = !!supabaseUrl && !!supabaseAnonKey && !!supabaseServiceKey
  } catch (error) {
    results.tests.environmentVariables.status = "error"
    results.tests.environmentVariables.error = error instanceof Error ? error.message : String(error)
  }

  // Test 2: Create Supabase client with anon key
  try {
    results.tests.anonClient = {
      status: "running",
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase URL or anon key")
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    results.tests.anonClient.status = "completed"
    results.tests.anonClient.success = true
  } catch (error) {
    results.tests.anonClient.status = "error"
    results.tests.anonClient.error = error instanceof Error ? error.message : String(error)
    results.tests.anonClient.success = false
  }

  // Test 3: Create Supabase client with service role key
  try {
    results.tests.serviceClient = {
      status: "running",
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase URL or service role key")
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    results.tests.serviceClient.status = "completed"
    results.tests.serviceClient.success = true
  } catch (error) {
    results.tests.serviceClient.status = "error"
    results.tests.serviceClient.error = error instanceof Error ? error.message : String(error)
    results.tests.serviceClient.success = false
  }

  // Test 4: Test database connection
  try {
    results.tests.databaseConnection = {
      status: "running",
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase URL or service role key")
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    // Try to query the database
    const { data, error } = await supabase.from("sender_profiles").select("count(*)", { count: "exact", head: true })

    if (error) throw error

    results.tests.databaseConnection.status = "completed"
    results.tests.databaseConnection.success = true
    results.tests.databaseConnection.details = { count: data }
  } catch (error) {
    results.tests.databaseConnection.status = "error"
    results.tests.databaseConnection.error = error instanceof Error ? error.message : String(error)
    results.tests.databaseConnection.success = false
  }

  // Calculate overall status
  const allTests = Object.values(results.tests) as any[]
  results.overallSuccess = allTests.every((test) => test.success === true)

  return NextResponse.json(results)
}
