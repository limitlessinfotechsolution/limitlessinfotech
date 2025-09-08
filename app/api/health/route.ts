import { NextResponse } from "next/server"

export async function GET() {
  const healthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // Node.js process uptime
    memoryUsage: process.memoryUsage(),
    // In a real app, you'd check database connection, external services, etc.
    database: {
      connected: true, // Mock status
      responseTime: "10ms", // Mock response time
    },
    externalServices: {
      emailService: "active", // Mock status
      cdnService: "active", // Mock status
    },
  }

  return NextResponse.json(healthStatus, { status: 200 })
}
