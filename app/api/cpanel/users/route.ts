import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface CPanelUser {
  id: string
  username: string
  email: string
  role: "admin" | "user" | "reseller"
  status: "active" | "suspended"
  diskUsage: string
  bandwidthUsage: string
  created: string
  lastLogin: string | null
}

// Mock data for cPanel users
const mockCPanelUsers: CPanelUser[] = [
  {
    id: "cp_user_1",
    username: "mainuser",
    email: "main@limitlessinfotech.com",
    role: "admin",
    status: "active",
    diskUsage: "1.5 GB / 10 GB",
    bandwidthUsage: "50 GB / 100 GB",
    created: "2023-01-01T10:00:00Z",
    lastLogin: "2024-07-11T09:30:00Z",
  },
  {
    id: "cp_user_2",
    username: "clientportal",
    email: "client@limitlessinfotech.com",
    role: "user",
    status: "active",
    diskUsage: "500 MB / 5 GB",
    bandwidthUsage: "10 GB / 50 GB",
    created: "2023-05-10T14:00:00Z",
    lastLogin: "2024-07-10T18:00:00Z",
  },
  {
    id: "cp_user_3",
    username: "reseller1",
    email: "reseller1@example.com",
    role: "reseller",
    status: "suspended",
    diskUsage: "0 MB / 20 GB",
    bandwidthUsage: "0 GB / 200 GB",
    created: "2023-08-20T09:00:00Z",
    lastLogin: null,
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
    const roleFilter = searchParams.get("role")
    const statusFilter = searchParams.get("status")

    let filteredUsers = mockCPanelUsers

    if (roleFilter) {
      filteredUsers = filteredUsers.filter((u) => u.role === roleFilter)
    }
    if (statusFilter) {
      filteredUsers = filteredUsers.filter((u) => u.status === statusFilter)
    }

    return NextResponse.json({
      success: true,
      users: filteredUsers,
      total: filteredUsers.length,
    })
  } catch (error) {
    console.error("Get cPanel users error:", error)
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
    const { action, id, username, email, password, role, status, diskLimit, bandwidthLimit } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "create") {
      if (!username || !email || !password || !role) {
        return NextResponse.json({ error: "Username, email, password, and role are required" }, { status: 400 })
      }
      if (mockCPanelUsers.find((u) => u.username === username || u.email === email)) {
        return NextResponse.json({ error: "User with this username or email already exists" }, { status: 409 })
      }

      const newUser: CPanelUser = {
        id: `cp_user_${Date.now()}`,
        username,
        email,
        role,
        status: "active",
        diskUsage: `0 MB / ${diskLimit || "1 GB"}`,
        bandwidthUsage: `0 GB / ${bandwidthLimit || "10 GB"}`,
        created: new Date().toISOString(),
        lastLogin: null,
      }
      mockCPanelUsers.unshift(newUser)

      return NextResponse.json(
        {
          success: true,
          user: newUser,
          message: "cPanel user created successfully.",
        },
        { status: 201 },
      )
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 })
      }
      const userIndex = mockCPanelUsers.findIndex((u) => u.id === id)
      if (userIndex === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      if (status) mockCPanelUsers[userIndex].status = status
      if (role) mockCPanelUsers[userIndex].role = role
      // In a real app, you'd handle password changes separately and securely
      if (diskLimit) mockCPanelUsers[userIndex].diskUsage = `0 MB / ${diskLimit}`
      if (bandwidthLimit) mockCPanelUsers[userIndex].bandwidthUsage = `0 GB / ${bandwidthLimit}`

      return NextResponse.json({
        success: true,
        user: mockCPanelUsers[userIndex],
        message: "cPanel user updated successfully.",
      })
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 })
      }
      const initialLength = mockCPanelUsers.length
      const userIndex = mockCPanelUsers.findIndex((u) => u.id === id)

      if (userIndex === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      mockCPanelUsers.splice(userIndex, 1)

      return NextResponse.json({ success: true, message: "cPanel user deleted successfully." })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("cPanel user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
