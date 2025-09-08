import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalVisitors: 15420,
    pageViews: 45680,
    bounceRate: 32.5,
    avgSessionDuration: "3m 45s",
    topPages: [
      { path: "/", views: 12500, percentage: 27.4 },
      { path: "/services", views: 8900, percentage: 19.5 },
      { path: "/about", views: 6700, percentage: 14.7 },
      { path: "/contact", views: 5200, percentage: 11.4 },
      { path: "/projects", views: 4100, percentage: 9.0 },
    ],
    trafficSources: [
      { source: "Direct", visitors: 6200, percentage: 40.2 },
      { source: "Google Search", visitors: 4800, percentage: 31.1 },
      { source: "Social Media", visitors: 2100, percentage: 13.6 },
      { source: "Referrals", visitors: 1500, percentage: 9.7 },
      { source: "Email", visitors: 820, percentage: 5.3 },
    ],
  },
  realTime: {
    activeUsers: 23,
    currentPageViews: 45,
    topActivePages: [
      { path: "/", users: 8 },
      { path: "/services", users: 6 },
      { path: "/contact", users: 4 },
      { path: "/about", users: 3 },
      { path: "/projects", users: 2 },
    ],
  },
  performance: {
    avgLoadTime: 1.2,
    serverResponseTime: 180,
    errorRate: 0.02,
    uptime: 99.9,
    bandwidthUsage: {
      current: 2.4,
      limit: 100,
      unit: "GB",
    },
  },
  geographic: [
    { country: "United States", visitors: 8500, percentage: 55.1 },
    { country: "Canada", visitors: 2100, percentage: 13.6 },
    { country: "United Kingdom", visitors: 1800, percentage: 11.7 },
    { country: "Australia", visitors: 1200, percentage: 7.8 },
    { country: "Germany", visitors: 900, percentage: 5.8 },
    { country: "Others", visitors: 920, percentage: 6.0 },
  ],
  devices: [
    { type: "Desktop", visitors: 8900, percentage: 57.7 },
    { type: "Mobile", visitors: 5200, percentage: 33.7 },
    { type: "Tablet", visitors: 1320, percentage: 8.6 },
  ],
  browsers: [
    { name: "Chrome", visitors: 9800, percentage: 63.6 },
    { name: "Safari", visitors: 2800, percentage: 18.2 },
    { name: "Firefox", visitors: 1500, percentage: 9.7 },
    { name: "Edge", visitors: 900, percentage: 5.8 },
    { name: "Others", visitors: 420, percentage: 2.7 },
  ],
}

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
    const type = searchParams.get("type") || "overview"
    const period = searchParams.get("period") || "7d"

    // In a real application, you would fetch actual analytics data
    // based on the type and period parameters

    let data
    switch (type) {
      case "realtime":
        data = mockAnalytics.realTime
        break
      case "performance":
        data = mockAnalytics.performance
        break
      case "geographic":
        data = mockAnalytics.geographic
        break
      case "devices":
        data = mockAnalytics.devices
        break
      case "browsers":
        data = mockAnalytics.browsers
        break
      default:
        data = mockAnalytics.overview
    }

    return NextResponse.json({
      success: true,
      data,
      period,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
