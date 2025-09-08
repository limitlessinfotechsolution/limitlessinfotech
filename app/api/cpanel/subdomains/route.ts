import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface Subdomain {
  id: string
  name: string
  parentDomain: string
  fullDomain: string
  documentRoot: string
  created: string
  status: "active" | "pending" | "disabled"
}

// Mock data for subdomains
const mockSubdomains: Subdomain[] = [
  {
    id: "sub_1",
    name: "blog",
    parentDomain: "limitlessinfotech.com",
    fullDomain: "blog.limitlessinfotech.com",
    documentRoot: "/public_html/blog",
    created: "2023-01-01T10:00:00Z",
    status: "active",
  },
  {
    id: "sub_2",
    name: "dev",
    parentDomain: "limitlessinfotech.com",
    fullDomain: "dev.limitlessinfotech.com",
    documentRoot: "/public_html/dev",
    created: "2023-03-15T14:30:00Z",
    status: "active",
  },
  {
    id: "sub_3",
    name: "staging",
    parentDomain: "limitlessinfotech.com",
    fullDomain: "staging.limitlessinfotech.com",
    documentRoot: "/public_html/staging",
    created: "2023-06-20T09:00:00Z",
    status: "disabled",
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
    const parentDomainFilter = searchParams.get("parentDomain")
    const statusFilter = searchParams.get("status")

    let filteredSubdomains = mockSubdomains

    if (parentDomainFilter) {
      filteredSubdomains = filteredSubdomains.filter((sub) => sub.parentDomain === parentDomainFilter)
    }
    if (statusFilter) {
      filteredSubdomains = filteredSubdomains.filter((sub) => sub.status === statusFilter)
    }

    return NextResponse.json({
      success: true,
      subdomains: filteredSubdomains,
      total: filteredSubdomains.length,
    })
  } catch (error) {
    console.error("Get subdomains error:", error)
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
    const { action, id, name, parentDomain, documentRoot, status } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "create") {
      if (!name || !parentDomain || !documentRoot) {
        return NextResponse.json({ error: "Name, parent domain, and document root are required" }, { status: 400 })
      }

      const fullDomain = `${name}.${parentDomain}`
      // Check if subdomain already exists
      if (mockSubdomains.find((sub) => sub.fullDomain === fullDomain)) {
        return NextResponse.json({ error: "Subdomain already exists" }, { status: 409 })
      }

      const newSubdomain: Subdomain = {
        id: `sub_${Date.now()}`,
        name,
        parentDomain,
        fullDomain,
        documentRoot,
        created: new Date().toISOString(),
        status: status || "active",
      }
      mockSubdomains.unshift(newSubdomain)

      return NextResponse.json(
        {
          success: true,
          subdomain: newSubdomain,
          message: "Subdomain created successfully.",
        },
        { status: 201 },
      )
    }

    if (action === "update_status") {
      if (!id || !status) {
        return NextResponse.json({ error: "Subdomain ID and status are required" }, { status: 400 })
      }
      if (!["active", "disabled"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }

      const subIndex = mockSubdomains.findIndex((sub) => sub.id === id)
      if (subIndex === -1) {
        return NextResponse.json({ error: "Subdomain not found" }, { status: 404 })
      }

      mockSubdomains[subIndex].status = status
      return NextResponse.json({ success: true, message: `Subdomain status updated to ${status}.` })
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "Subdomain ID is required" }, { status: 400 })
      }

      const initialLength = mockSubdomains.length
      const subIndex = mockSubdomains.findIndex((sub) => sub.id === id)

      if (subIndex === -1) {
        return NextResponse.json({ error: "Subdomain not found" }, { status: 404 })
      }

      mockSubdomains.splice(subIndex, 1)

      return NextResponse.json({ success: true, message: "Subdomain deleted successfully." })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Subdomain API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
