import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "./database"
import bcrypt from "bcryptjs"
import { User } from "./database"

const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await getUserByEmail(credentials.email as string);

        if (!user) {
          return null
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
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
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.sub = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as 'admin' | 'employee' | 'client'
      }
      return session
    },
  },
}

export default authConfig
