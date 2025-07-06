"use server"

import { authenticateUser, createSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export interface LoginResult {
  success: boolean
  error?: string
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      }
    }

    // Authenticate user
    const user = await authenticateUser(email, password)

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    // Create session
    await createSession(user.id, user.is_admin)

    return { success: true }
  } catch (error) {
    console.error("Login action error:", error)
    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    }
  }
}

export async function loginAndRedirect(formData: FormData) {
  const result = await loginAction(formData)

  if (result.success) {
    redirect("/")
  }

  return result
}
