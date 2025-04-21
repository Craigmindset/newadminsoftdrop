import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the request body
    const formData = await request.formData()

    // Extract file information
    const file = formData.get("file") as File | null
    const userAgent = request.headers.get("user-agent") || "Unknown"
    const contentType = request.headers.get("content-type") || "Unknown"

    // Prepare diagnostic information
    const diagnostics = {
      timestamp: new Date().toISOString(),
      userAgent,
      contentType,
      file: file
        ? {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: new Date(file.lastModified).toISOString(),
          }
        : null,
      headers: Object.fromEntries(request.headers.entries()),
      environment: process.env.NODE_ENV || "unknown",
      formDataKeys: Array.from(formData.keys()),
    }

    console.log("Upload diagnostics:", JSON.stringify(diagnostics, null, 2))

    return NextResponse.json({
      success: true,
      diagnostics,
    })
  } catch (error) {
    console.error("Error in upload diagnostics:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
