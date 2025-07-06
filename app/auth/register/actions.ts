"use server";

import { createUser, createSession } from "@/lib/auth";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "@/lib/validation";

export interface RegisterResult {
  success: boolean;
  error?: string;
}

export async function registerAction(
  formData: FormData
): Promise<RegisterResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return {
        success: false,
        error: nameValidation.error,
      };
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return {
        success: false,
        error: emailValidation.error,
      };
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.error,
      };
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    // Create user
    const user = await createUser(email, password, name, false);

    // Create session
    await createSession(user.id, user.is_admin);

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);

    // Return specific error messages
    if (error.message?.includes("already exists")) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    return {
      success: false,
      error: error.message || "Registration failed. Please try again.",
    };
  }
}
