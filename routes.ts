/**
 * Shared route-helper constants so the auth middleware
 * can decide where to redirect unauthenticated users.
 */

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/"

export const publicRoutes = [
  "/", // landing page
  "/careers",
  "/api-docs",
  "/auth/login",
  "/auth/register",
]

export const authRoutes = ["/auth/login", "/auth/register"]
