"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { sql } from "./database";
import { validateEmail, validatePassword, validateName } from "./validation";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface DBUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  profile_data?: Record<string, any>;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "INSECURE_DEV_SECRET_change_me_in_production"
);
const SESSION_COOKIE = "support_space_session";
const WEEK = 60 * 60 * 24 * 7; // seconds

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                           */
/* -------------------------------------------------------------------------- */

async function getCookieStore() {
  try {
    return await cookies();
  } catch {
    // `cookies()` throws on the client – we only call it on the server
    return null;
  }
}

const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Password processing failed");
  }
};

const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
};

const signJWT = async (payload: Record<string, any>): Promise<string> => {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${WEEK}s`)
      .setIssuedAt()
      .setNotBefore(0)
      .sign(JWT_SECRET);
  } catch (error) {
    console.error("JWT signing error:", error);
    throw new Error("Token generation failed");
  }
};

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Create a new user account
 */
export async function createUser(
  email: string,
  password: string,
  name: string,
  isAdmin = false
): Promise<DBUser> {
  // Validate inputs
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new Error(emailValidation.error);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.error);
  }

  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    throw new Error(nameValidation.error);
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  try {
    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${trimmedEmail}
    `;

    if (existing.length > 0) {
      throw new Error("An account with this email already exists");
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, name, is_admin, is_active, created_at, updated_at)
      VALUES (${trimmedEmail}, ${passwordHash}, ${trimmedName}, ${isAdmin}, true, NOW(), NOW())
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error("Failed to create user account");
    }

    return result[0] as DBUser;
  } catch (error: any) {
    console.error("User creation error:", error);

    // Handle specific database errors
    if (
      error.message?.includes("duplicate key") ||
      error.message?.includes("already exists")
    ) {
      throw new Error("An account with this email already exists");
    }

    if (
      error.message?.includes("validation") ||
      error.message?.includes("constraint")
    ) {
      throw new Error("Invalid user data provided");
    }

    // Re-throw validation errors as-is
    if (
      error.message?.includes("Email") ||
      error.message?.includes("Password") ||
      error.message?.includes("Name")
    ) {
      throw error;
    }

    throw new Error("Failed to create account. Please try again.");
  }
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<DBUser | null> {
  if (!email || !password) {
    return null;
  }

  const trimmedEmail = email.trim().toLowerCase();

  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE email = ${trimmedEmail} AND is_active = true
    `;

    if (result.length === 0) {
      return null;
    }

    const user = result[0] as DBUser;
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await sql`
      UPDATE users 
      SET last_login = NOW(), updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

/**
 * Create a new session for the user
 */
export async function createSession(
  userId: number,
  isAdmin: boolean
): Promise<string> {
  try {
    const token = await signJWT({ uid: userId, adm: isAdmin });
    const expiresAt = new Date(Date.now() + WEEK * 1000);

    // Clean up old sessions for this user (optional, for security)
    await sql`
      DELETE FROM user_sessions 
      WHERE user_id = ${userId} AND expires_at < NOW()
    `;

    // Create new session
    await sql`
      INSERT INTO user_sessions (user_id, session_token, expires_at, created_at)
      VALUES (${userId}, ${token}, ${expiresAt}, NOW())
    `;

    // Set cookie
    const cookieStore = await getCookieStore();
    if (cookieStore) {
      cookieStore.set({
        name: SESSION_COOKIE,
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: WEEK,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return token;
  } catch (error) {
    console.error("Session creation error:", error);
    throw new Error("Failed to create session");
  }
}

/**
 * Validate session token and return user info
 */
export async function getSessionUser(
  token: string | undefined
): Promise<AuthUser | null> {
  if (!token) return null;

  try {
    // 1) Verify JWT signature and expiry
    let payload: { uid: number; adm: boolean };
    try {
      const verified = await jwtVerify<{ uid: number; adm: boolean }>(
        token,
        JWT_SECRET
      );
      payload = verified.payload;
    } catch (jwtError) {
      // Token is invalid or expired
      return null;
    }

    // 2) Check if session exists in database and user is active
    const result = await sql`
      SELECT u.id, u.email, u.name, u.is_admin
      FROM user_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.session_token = ${token}
        AND s.expires_at > NOW()
        AND u.is_active = true
    `;

    if (result.length === 0) {
      return null;
    }

    const row = result[0] as {
      id: number;
      email: string;
      name: string;
      is_admin: boolean;
    };

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      isAdmin: row.is_admin,
    };
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

/**
 * Get current user from server context
 */
export async function getServerUser(): Promise<AuthUser | null> {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return null;

  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return getSessionUser(token);
}

/**
 * Universal helper for getting current user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined") {
    return getServerUser();
  }

  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;
    return (await res.json()) as AuthUser;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

/**
 * Logout user and clean up session
 */
export async function logout(): Promise<void> {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return;

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      // Remove session from database
      await sql`DELETE FROM user_sessions WHERE session_token = ${token}`;
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }

  // Clear cookie
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Require admin access (throws if not admin)
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!user.isAdmin) {
    throw new Error("Admin access required");
  }
  return user;
}

/**
 * Clean up expired sessions (utility function)
 */
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await sql`DELETE FROM user_sessions WHERE expires_at < NOW()`;
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
  }
}
