import NextAuth from 'next-auth'
import authConfig from './lib/auth.config'
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes'
import { createRateLimitMiddleware, rateLimitConfigs } from './lib/rate-limit'
import { NextResponse } from 'next/server'
import { withSecurityHeaders } from './lib/security'

const { auth } = NextAuth(authConfig)
const rateLimitMiddleware = createRateLimitMiddleware(rateLimitConfigs.auth)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as { role?: string } | undefined

  // Rate limit auth callback
  if (nextUrl.pathname.startsWith('/api/auth/callback')) {
    const isAllowed = rateLimitMiddleware(req)
    if (!isAllowed) {
      return withSecurityHeaders(NextResponse.json({ error: 'Too many requests' }, { status: 429 }))
    }
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  // Allow NextAuth API routes
  if (isApiAuthRoute) {
    return withSecurityHeaders(NextResponse.next())
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      const response = NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      return withSecurityHeaders(response)
    }
    return withSecurityHeaders(NextResponse.next())
  }

  // Protect non-public routes
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) callbackUrl += nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    const response = NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
    return withSecurityHeaders(response)
  }

  // Role-based protection
  if (isLoggedIn) {
    if (nextUrl.pathname.startsWith('/admin') && user?.role !== 'admin') {
      return withSecurityHeaders(NextResponse.redirect(new URL('/unauthorized', nextUrl)))
    }
    if (nextUrl.pathname.startsWith('/cpanel') && user?.role !== 'admin') {
      return withSecurityHeaders(NextResponse.redirect(new URL('/unauthorized', nextUrl)))
    }
  }

  return withSecurityHeaders(NextResponse.next())
})

export const config = {
  matcher: ['/((?!.+\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  runtime: 'nodejs', // Use Node.js runtime instead of Edge Runtime
}
