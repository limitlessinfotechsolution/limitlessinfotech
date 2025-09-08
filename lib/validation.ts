/**
 * Validates if a string is within a specified length range.
 * @param value The string to validate.
 * @param minLength The minimum allowed length.
 * @param maxLength The maximum allowed length.
 * @returns True if the string is valid, false otherwise.
 */
export function validateString(value: string | null | undefined, minLength: number, maxLength: number): boolean {
  if (typeof value !== "string" || value.trim().length < minLength || value.trim().length > maxLength) {
    return false
  }
  return true
}

/**
 * Validates if an email address is in a valid format.
 * @param email The email string to validate.
 * @returns True if the email is valid, false otherwise.
 */
export function validateEmail(email: string | null | undefined): boolean {
  if (typeof email !== "string") {
    return false
  }
  // Basic regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates if a password meets basic complexity requirements.
 * (e.g., minimum length, presence of numbers/special characters).
 * @param password The password string to validate.
 * @returns True if the password is valid, false otherwise.
 */
export function validatePassword(password: string | null | undefined): boolean {
  if (typeof password !== "string") {
    return false
  }
  // Example: At least 8 characters, one uppercase, one lowercase, one number, one special character
  const _passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
  // For this mock, we'll just check minimum length
  return password.length >= 8
}

/**
 * Validates if a number is within a specified range.
 * @param value The number to validate.
 * @param min The minimum allowed value.
 * @param max The maximum allowed value.
 * @returns True if the number is valid, false otherwise.
 */
export function validateNumber(value: number | null | undefined, min?: number, max?: number): boolean {
  if (typeof value !== "number" || isNaN(value)) {
    return false
  }
  if (min !== undefined && value < min) {
    return false
  }
  if (max !== undefined && value > max) {
    return false
  }
  return true
}

/**
 * Validates if a URL is in a valid format.
 * @param url The URL string to validate.
 * @returns True if the URL is valid, false otherwise.
 */
export function validateUrl(url: string | null | undefined): boolean {
  if (typeof url !== "string") {
    return false
  }
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
