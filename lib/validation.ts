/* -------------------------------------------------------------------------- */
/* Validation helpers                                                         */
/* -------------------------------------------------------------------------- */

export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedEmail.length === 0) {
    return { valid: false, error: "Email cannot be empty" };
  }

  if (trimmedEmail.length > 255) {
    return { valid: false, error: "Email is too long" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
}

export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return {
      valid: false,
      error: "Password must be at least 6 characters long",
    };
  }

  if (password.length > 128) {
    return { valid: false, error: "Password is too long" };
  }

  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one letter and one number",
    };
  }

  return { valid: true };
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Name is required" };
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return { valid: false, error: "Name cannot be empty" };
  }

  if (trimmedName.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long" };
  }

  if (trimmedName.length > 100) {
    return { valid: false, error: "Name is too long" };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return {
      valid: false,
      error: "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { valid: true };
}
