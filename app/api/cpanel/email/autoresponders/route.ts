import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface AutoResponder {
  id: string
  email: string
  subject: string
  body: string
  status: "active" | "inactive"
  createdAt: string
}

// Mock data for autoresponders
const mockAutoResponders: AutoResponder[] = [
  {
    id: "ar_1",
    email: "support@limitlessinfotech.com",
    subject: "Thank you for your inquiry!",
    body: "We have received your message and will get back to you within 24 hours. Our support hours are Monday-Friday, 9 AM - 5 PM EST.",
    status: "active",
    createdAt: "2023-05-01T10:00:00Z",
  },
  {
    id: "ar_2",
    email: "sales@limitlessinfotech.com",
    subject: "Out of Office: Sales Team",
    body: "I am currently out of office and will respond to your email upon my return. For urgent matters, please contact info@limitlessinfotech.com.",
    status: "inactive",
    createdAt: "2023-07-15T14:30:00Z",
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
      autoResponders: mockAutoResponders,
      total: mockAutoResponders.length,
    })
  } catch (error) {
    console.error("Get autoresponders error:", error)
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
    const { action, id, email, subject, body: arBody, status } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "create") {
      if (!email || !subject || !arBody) {
        return NextResponse.json({ error: "Email, subject, and body are required" }, { status: 400 })
      }
      if (!email.includes("@") || !email.includes(".")) {
        return NextResponse.json({ error: "Invalid email address format" }, { status: 400 })
      }

      const newAutoResponder: AutoResponder = {
        id: `ar_${Date.now()}`,
        email,
        subject,
        body: arBody,
        status: status || "active",
        createdAt: new Date().toISOString(),
      }
      mockAutoResponders.unshift(newAutoResponder)

      return NextResponse.json(
        {
          success: true,
          autoResponder: newAutoResponder,
          message: "Auto-responder created successfully.",
        },
        { status: 201 },
      )
    }

    if (action === "update_status") {
      if (!id || !status) {
        return NextResponse.json({ error: "Auto-responder ID and status are required" }, { status: 400 })
      }
      if (!["active", "inactive"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }

      const arIndex = mockAutoResponders.findIndex((ar) => ar.id === id)
      if (arIndex === -1) {
        return NextResponse.json({ error: "Auto-responder not found" }, { status: 404 })
      }

      mockAutoResponders[arIndex].status = status
      return NextResponse.json({ success: true, message: `Auto-responder status updated to ${status}.` })
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "Auto-responder ID is required" }, { status: 400 })
      }

      const initialLength = mockAutoResponders.length
      const arIndex = mockAutoResponders.findIndex((ar) => ar.id === id)

      if (arIndex === -1) {
        return NextResponse.json({ error: "Auto-responder not found" }, { status: 404 })
      }

      mockAutoResponders.splice(arIndex, 1)

      return NextResponse.json({ success: true, message: "Auto-responder deleted successfully." })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auto-responder API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
