import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface CdnSetting {
  id: string
  domain: string
  status: "active" | "inactive" | "deploying"
  cacheLevel: "standard" | "aggressive" | "bypass"
  sslEnabled: boolean
  lastPurged: string | null
  origin: string
  created: string
}

interface CDNStats {
  timestamp: string
  requests: number
  bandwidth: number // in MB
  cacheHit: number // percentage
  latency: number // in ms
}

interface EdgeLocation {
  id: string
  city: string
  country: string
  region: string
  status: "online" | "offline" | "maintenance"
  latency: number
  requests: number
}

// Mock data for CDN settings
const mockCdnSettings: CdnSetting[] = [
  {
    id: "cdn_1",
    domain: "limitlessinfotech.com",
    status: "active",
    cacheLevel: "standard",
    sslEnabled: true,
    lastPurged: "2024-07-10T10:00:00Z",
    origin: "192.168.1.100",
    created: "2024-01-01T00:00:00Z",
  },
  {
    id: "cdn_2",
    domain: "blog.limitlessinfotech.com",
    status: "inactive",
    cacheLevel: "bypass",
    sslEnabled: false,
    lastPurged: null,
    origin: "192.168.1.101",
    created: "2024-03-01T00:00:00Z",
  },
  {
    id: "cdn_3",
    domain: "assets.limitlessinfotech.com",
    status: "deploying",
    cacheLevel: "aggressive",
    sslEnabled: true,
    lastPurged: null,
    origin: "192.168.1.102",
    created: "2024-07-11T09:00:00Z",
  },
]

const mockCDNStats: CDNStats[] = [
  { timestamp: "00:00", requests: 12500, bandwidth: 450, cacheHit: 94, latency: 45 },
  { timestamp: "04:00", requests: 8200, bandwidth: 320, cacheHit: 92, latency: 48 },
  { timestamp: "08:00", requests: 18900, bandwidth: 680, cacheHit: 95, latency: 42 },
  { timestamp: "12:00", requests: 25400, bandwidth: 920, cacheHit: 96, latency: 38 },
  { timestamp: "16:00", requests: 22100, bandwidth: 810, cacheHit: 94, latency: 41 },
  { timestamp: "20:00", requests: 19800, bandwidth: 720, cacheHit: 93, latency: 44 },
]

const mockEdgeLocations: EdgeLocation[] = [
  {
    id: "loc_1",
    city: "New York",
    country: "USA",
    region: "North America",
    status: "online",
    latency: 12,
    requests: 450000,
  },
  { id: "loc_2", city: "London", country: "UK", region: "Europe", status: "online", latency: 8, requests: 380000 },
  { id: "loc_3", city: "Tokyo", country: "Japan", region: "Asia", status: "online", latency: 15, requests: 320000 },
  {
    id: "loc_4",
    city: "Sydney",
    country: "Australia",
    region: "Oceania",
    status: "online",
    latency: 22,
    requests: 180000,
  },
  { id: "loc_5", city: "Mumbai", country: "India", region: "Asia", status: "maintenance", latency: 35, requests: 0 },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "stats") {
      return NextResponse.json({
        success: true,
        stats: mockCDNStats,
        totalRequests: mockCDNStats.reduce((sum, s) => sum + s.requests, 0),
        totalBandwidth: mockCDNStats.reduce((sum, s) => sum + s.bandwidth, 0),
        avgCacheHit: (mockCDNStats.reduce((sum, s) => sum + s.cacheHit, 0) / mockCDNStats.length).toFixed(1),
      })
    }

    if (type === "edge_locations") {
      return NextResponse.json({
        success: true,
        locations: mockEdgeLocations,
        total: mockEdgeLocations.length,
      })
    }

    return NextResponse.json({
      success: true,
      settings: mockCdnSettings,
      total: mockCdnSettings.length,
    })
  } catch (error) {
    console.error("Get CDN data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { action, id, domain, origin, cacheLevel, sslEnabled } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "add_domain") {
      if (!domain || !origin) {
        return NextResponse.json({ error: "Domain and origin are required" }, { status: 400 })
      }
      if (mockCdnSettings.find((s) => s.domain === domain)) {
        return NextResponse.json({ error: "Domain already configured for CDN" }, { status: 409 })
      }

      const newSetting: CdnSetting = {
        id: `cdn_${Date.now()}`,
        domain,
        origin,
        status: "deploying",
        cacheLevel: "standard",
        sslEnabled: false,
        lastPurged: null,
        created: new Date().toISOString(),
      }
      mockCdnSettings.unshift(newSetting)

      // Simulate deployment
      setTimeout(() => {
        const settingIndex = mockCdnSettings.findIndex((s) => s.id === newSetting.id)
        if (settingIndex !== -1) {
          mockCdnSettings[settingIndex].status = "active"
        }
      }, 5000) // 5 seconds deployment

      return NextResponse.json(
        {
          success: true,
          setting: newSetting,
          message: "Domain added to CDN. Deployment initiated.",
        },
        { status: 201 },
      )
    }

    if (action === "update_setting") {
      if (!id) {
        return NextResponse.json({ error: "Setting ID is required" }, { status: 400 })
      }
      const settingIndex = mockCdnSettings.findIndex((s) => s.id === id)
      if (settingIndex === -1) {
        return NextResponse.json({ error: "CDN setting not found" }, { status: 404 })
      }

      if (cacheLevel) mockCdnSettings[settingIndex].cacheLevel = cacheLevel
      if (typeof sslEnabled === "boolean") mockCdnSettings[settingIndex].sslEnabled = sslEnabled
      if (status) mockCdnSettings[settingIndex].status = status

      return NextResponse.json({
        success: true,
        setting: mockCdnSettings[settingIndex],
        message: "CDN setting updated.",
      })
    }

    if (action === "purge_cache") {
      if (!id) {
        return NextResponse.json({ error: "Setting ID is required" }, { status: 400 })
      }
      const settingIndex = mockCdnSettings.findIndex((s) => s.id === id)
      if (settingIndex === -1) {
        return NextResponse.json({ error: "CDN setting not found" }, { status: 404 })
      }

      mockCdnSettings[settingIndex].lastPurged = new Date().toISOString()
      return NextResponse.json({ success: true, message: "CDN cache purged successfully." })
    }

    if (action === "delete_domain") {
      if (!id) {
        return NextResponse.json({ error: "Setting ID is required" }, { status: 400 })
      }
      const initialLength = mockCdnSettings.length
      const settingIndex = mockCdnSettings.findIndex((s) => s.id === id)

      if (settingIndex === -1) {
        return NextResponse.json({ error: "CDN setting not found" }, { status: 404 })
      }

      mockCdnSettings.splice(settingIndex, 1)

      return NextResponse.json({ success: true, message: "CDN domain removed successfully." })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("CDN API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
