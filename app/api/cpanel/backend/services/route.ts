import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface Service {
  id: string
  name: string
  status: "running" | "stopped" | "restarting" | "failed"
  description: string
  uptime: string | null
  cpuUsage: string | null
  memoryUsage: string | null
}

// Mock data for server services
const mockServices: Service[] = [
  {
    id: "svc_1",
    name: "Apache Web Server",
    status: "running",
    description: "Handles HTTP/HTTPS requests for your websites.",
    uptime: "15 days",
    cpuUsage: "5%",
    memoryUsage: "120 MB",
  },
  {
    id: "svc_2",
    name: "MySQL Database",
    status: "running",
    description: "Manages all your website databases.",
    uptime: "15 days",
    cpuUsage: "8%",
    memoryUsage: "250 MB",
  },
  {
    id: "svc_3",
    name: "Email Server (Postfix)",
    status: "running",
    description: "Handles incoming and outgoing emails for your domains.",
    uptime: "15 days",
    cpuUsage: "3%",
    memoryUsage: "80 MB",
  },
  {
    id: "svc_4",
    name: "Redis Cache",
    status: "stopped",
    description: "In-memory data structure store, used for caching.",
    uptime: null,
    cpuUsage: null,
    memoryUsage: null,
  },
  {
    id: "svc_5",
    name: "FTP Server (Pure-FTPd)",
    status: "running",
    description: "Allows file transfers to and from your hosting account.",
    uptime: "15 days",
    cpuUsage: "1%",
    memoryUsage: "30 MB",
  },
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
    const statusFilter = searchParams.get("status")

    let filteredServices = mockServices

    if (statusFilter) {
      filteredServices = filteredServices.filter((svc) => svc.status === statusFilter)
    }

    return NextResponse.json({
      success: true,
      services: filteredServices,
      total: filteredServices.length,
    })
  } catch (error) {
    console.error("Get services error:", error)
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
    const { action, id } = body

    if (!action || !id) {
      return NextResponse.json({ error: "Action and service ID are required" }, { status: 400 })
    }

    const serviceIndex = mockServices.findIndex((svc) => svc.id === id)
    if (serviceIndex === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = mockServices[serviceIndex]

    if (action === "start") {
      if (service.status === "running") {
        return NextResponse.json({ error: "Service is already running" }, { status: 400 })
      }
      service.status = "running"
      service.uptime = "Just started"
      service.cpuUsage = "0%"
      service.memoryUsage = "0 MB"
      return NextResponse.json({ success: true, message: `${service.name} started successfully.` })
    }

    if (action === "stop") {
      if (service.status === "stopped") {
        return NextResponse.json({ error: "Service is already stopped" }, { status: 400 })
      }
      service.status = "stopped"
      service.uptime = null
      service.cpuUsage = null
      service.memoryUsage = null
      return NextResponse.json({ success: true, message: `${service.name} stopped successfully.` })
    }

    if (action === "restart") {
      service.status = "restarting"
      service.uptime = null
      service.cpuUsage = null
      service.memoryUsage = null
      // Simulate restart delay
      setTimeout(() => {
        const updatedService = mockServices.find((s) => s.id === id)
        if (updatedService) {
          updatedService.status = "running"
          updatedService.uptime = "Just restarted"
          updatedService.cpuUsage = "2%"
          updatedService.memoryUsage = "50 MB"
        }
      }, 3000) // Simulate 3-second restart
      return NextResponse.json({ success: true, message: `${service.name} restart initiated.` })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Service management error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
