"use server"

import { logout } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function logoutAction() {
  try {
    await logout()
  } catch (error) {
    console.error("Logout error:", error)
  }

  redirect("/")
}
