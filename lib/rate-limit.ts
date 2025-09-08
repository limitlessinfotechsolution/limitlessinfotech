import type { NextRequest } from "next/server"
import { LRUCache } from "lru-cache"

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

interface RateLimitOptions {
  interval: number // in milliseconds
  uniqueTokens: number // max requests per interval
}

interface RateLimiter {
  check: (token: string) => Promise<boolean>
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()

  isAllowed(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Clean up old entries
    this.cleanup(windowStart)

    const userRequests = this.requests.get(identifier)

    if (!userRequests) {
      this.requests.set(identifier, { count: 1, resetTime: now + config.windowMs })
      return true
    }

    if (now > userRequests.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + config.windowMs })
      return true
    }

    if (userRequests.count >= config.maxRequests) {
      return false
    }

    userRequests.count++
    return true
  }

  private cleanup(windowStart: number) {
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime < windowStart) {
        this.requests.delete(key)
      }
    }
  }

  getRemainingRequests(identifier: string, config: RateLimitConfig): number {
    const userRequests = this.requests.get(identifier)
    if (!userRequests || Date.now() > userRequests.resetTime) {
      return config.maxRequests
    }
    return Math.max(0, config.maxRequests - userRequests.count)
  }

  getResetTime(identifier: string): number | null {
    const userRequests = this.requests.get(identifier)
    return userRequests?.resetTime || null
  }
}

/**
 * Creates a simple in-memory rate limiter using LRU cache.
 * Useful for protecting API endpoints from abuse.
 *
 * @param options - Configuration for the rate limiter.
 * @param options.interval - The time window in milliseconds (e.g., 60 * 1000 for 1 minute).
 * @param options.uniqueTokens - The maximum number of requests allowed within the interval for a unique token (e.g., IP address).
 * @returns A rate limiter object with a `check` method.
 */
export function rateLimit(options: RateLimitOptions): RateLimiter {
  const { interval, uniqueTokens } = options

  const cache = new LRUCache<string, number[]>({
    max: 500, // Max number of unique tokens to store
    ttl: interval, // Time to live for each entry
  })

  return {
    check: async (token: string): Promise<boolean> => {
      const now = Date.now()
      let requests = cache.get(token) || []

      // Filter out requests older than the interval
      requests = requests.filter((timestamp) => timestamp > now - interval)

      if (requests.length >= uniqueTokens) {
        // Rate limit exceeded
        return true
      }

      // Add current request timestamp
      requests.push(now)
      cache.set(token, requests)

      return false
    },
  }
}

export const rateLimiter = new RateLimiter()

export function createRateLimitMiddleware(config: RateLimitConfig) {
  return (request: NextRequest, identifier?: string) => {
    const id = identifier || request.ip || "anonymous"
    return rateLimiter.isAllowed(id, config)
  }
}

// Predefined rate limit configs
export const rateLimitConfigs = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
  upload: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads per minute
}
