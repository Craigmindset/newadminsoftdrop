"use server"

import { cookies } from "next/headers"

export async function loginSender(phoneNumber: string, password: string) {
  try {
    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would validate credentials with your backend
    // For demonstration purposes, let's consider any login successful
    const userId = `user_${Math.random().toString(36).substring(2, 15)}`

    // Set a cookie to maintain the session
    cookies().set(
      "session",
      JSON.stringify({
        userId: userId,
        role: "sender",
        phoneNumber: phoneNumber,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    return { success: true, userId: userId }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
