import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface EmailFilter {
  id: string
  name: string
  condition: string
  action: string
  status: "active" | "inactive"
  createdAt: string
}

// Mock data for email filters
const mockEmailFilters: EmailFilter[] = [
  {
    id: "filter_1",
    name: "Spam Blocker",
    condition: "Subject contains 'promo' OR 'discount'",
    action: "Move to Spam",
    status: "active",
    createdAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "filter_2",
    name: "Client Priority",
    condition: "From 'client@important.com'",
    action: "Mark as Important",
    status: "active",
    createdAt: "2023-03-15T14:30:00Z",
  },
  {
    id: "filter_3",
    name: "Newsletter Archive",
    condition: "From 'newsletter@example.com'",
    action: "Move to Archive",
    status: "inactive",
    createdAt: "2023-06-20T09:00:00Z",
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

    return NextResponse.json({
      success: true,
      filters: mockEmailFilters,
      total: mockEmailFilters.length,
    })
  } catch (error) {
    console.error("Get email filters error:", error)
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
    const { action, id, name, condition, action: filterAction, status } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "create") {
      if (!name || !condition || !filterAction) {
        return NextResponse.json({ error: "Name, condition, and action are required" }, { status: 400 })
      }

      const newFilter: EmailFilter = {
        id: `filter_${Date.now()}`,
        name,
        condition,
        action: filterAction,
        status: status || "active",
        createdAt: new Date().toISOString(),
      }
      mockEmailFilters.unshift(newFilter)

      return NextResponse.json(
        {
          success: true,
          filter: newFilter,
          message: "Email filter created successfully.",
        },
        { status: 201 },
      )
    }

    if (action === "update_status") {
      if (!id || !status) {
        return NextResponse.json({ error: "Filter ID and status are required" }, { status: 400 })
      }
      if (!["active", "inactive"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }

      const filterIndex = mockEmailFilters.findIndex((f) => f.id === id)
      if (filterIndex === -1) {
        return NextResponse.json({ error: "Email filter not found" }, { status: 404 })
      }

      mockEmailFilters[filterIndex].status = status
      return NextResponse.json({ success: true, message: `Email filter status updated to ${status}.` })
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "Filter ID is required" }, { status: 400 })
      }

      const initialLength = mockEmailFilters.length
      const filterIndex = mockEmailFilters.findIndex((f) => f.id === id)

      if (filterIndex === -1) {
        return NextResponse.json({ error: "Email filter not found" }, { status: 404 })
      }

      mockEmailFilters.splice(filterIndex, 1)

      return NextResponse.json({ success: true, message: "Email filter deleted successfully." })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Email filter API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
