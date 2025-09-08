import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "./database"
import bcrypt from "bcryptjs"

const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: unknown) {
        if (!credentials || typeof credentials !== 'object' || !('email' in credentials) || !('password' in credentials)) {
          return null
        }

        const creds = credentials as { email: string; password: string }

        const user = await getUserByEmail(creds.email);

        if (!user) {
          return null
        }

        const isPasswordCorrect = await bcrypt.compare(
          creds.password,
          user.passwordHash
        );

        if (isPasswordCorrect) {
          return { id: user.id, name: user.email, email: user.email, role: user.role };
        }

        return null
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,

  trustHost: true,

  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }: { token: unknown, user: unknown }) {
      if (user && typeof user === 'object' && 'id' in user && 'role' in user) {
        const u = user as { id: string; role: string }
        const t = token as { sub?: string; role?: string }
        t.sub = u.id
        t.role = u.role
      }
      return token
    },
    async session({ session, token }: { session: unknown, token: unknown }) {
      if (session && typeof session === 'object' && 'user' in session && token && typeof token === 'object' && 'sub' in token && 'role' in token) {
        const s = session as { user: { id?: string; role?: string } }
        const t = token as { sub: string; role: string }
        s.user.id = t.sub
        s.user.role = t.role as 'admin' | 'employee' | 'client'
      }
      return session
    },
  },
}

export default authConfig
