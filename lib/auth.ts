import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

/* ------------------------------------------------------------------ */
/*  JWT-based AuthService for API routes */
/* ------------------------------------------------------------------ */

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "change-me")

export interface JwtPayload {
  sub: string // user id
  role: "admin" | "employee" | "client"
  email: string
}

const payloadSchema: z.ZodSchema<JwtPayload> = z.object({
  sub: z.string(),
  role: z.enum(["admin", "employee", "client"]),
  email: z.string().email(),
})

export class AuthService {
  /** Issue a signed JWT valid for `expiresIn` seconds (default 7 days). */
  static async sign(payload: JwtPayload, expiresIn = 60 * 60 * 24 * 7): Promise<string> {
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + expiresIn

    return await new SignJWT({ ...payload, iat, exp })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setJti(nanoid())
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(JWT_SECRET)
  }

  /** Generate token - alias for sign method for backward compatibility */
  static async generateToken(user: { id: string; email: string; role: string }): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as "admin" | "employee" | "client"
    }
    return await this.sign(payload)
  }

  /** Verify token & return payload or `null` if invalid/expired. */
  static async verifyToken(token?: string | null): Promise<JwtPayload | null> {
    if (!token) return null
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payloadSchema.parse(payload)
    } catch {
      return null
    }
  }

  /** Demo login helper – replace with real DB lookup. */
  static async login(email: string, password: string) {
    if (email !== "admin@example.com" || password !== "secret") return null
    const user: JwtPayload = { sub: "1", role: "admin", email }
    const token = await this.sign(user)
    return { user, token }
  }
}
