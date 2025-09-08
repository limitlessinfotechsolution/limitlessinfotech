import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

// Mock database data
const mockDatabases = [
  {
    id: "db_1",
    name: "limitless_main",
    size: "156.7 MB",
    tables: 24,
    created: "2024-01-15T10:00:00Z",
    lastBackup: "2024-07-10T02:00:00Z",
    status: "active",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  },
  {
    id: "db_2",
    name: "limitless_analytics",
    size: "89.3 MB",
    tables: 12,
    created: "2024-02-20T14:30:00Z",
    lastBackup: "2024-07-10T02:00:00Z",
    status: "active",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  },
  {
    id: "db_3",
    name: "limitless_test",
    size: "12.1 MB",
    tables: 8,
    created: "2024-06-01T09:15:00Z",
    lastBackup: "2024-07-09T18:00:00Z",
    status: "active",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  },
]

const mockUsers = [
  {
    id: "user_1",
    username: "limitless_admin",
    host: "localhost",
    privileges: ["ALL PRIVILEGES"],
    databases: ["limitless_main", "limitless_analytics", "limitless_test"],
    created: "2024-01-15T10:00:00Z",
    lastLogin: "2024-07-10T14:30:00Z",
  },
  {
    id: "user_2",
    username: "limitless_readonly",
    host: "localhost",
    privileges: ["SELECT"],
    databases: ["limitless_main", "limitless_analytics"],
    created: "2024-03-10T16:20:00Z",
    lastLogin: "2024-07-09T11:45:00Z",
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
    const type = searchParams.get("type") || "databases"

    if (type === "users") {
      return NextResponse.json({
        success: true,
        users: mockUsers,
        total: mockUsers.length,
      })
    }

    return NextResponse.json({
      success: true,
      databases: mockDatabases,
      total: mockDatabases.length,
      totalSize: "258.1 MB",
      maxDatabases: 50,
    })
  } catch (error) {
    console.error("Get databases error:", error)
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
    const { action, name, username, password, privileges, databases } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "create_database") {
      if (!name) {
        return NextResponse.json({ error: "Database name is required" }, { status: 400 })
      }

      // Check if database already exists
      if (mockDatabases.find((db) => db.name === name)) {
        return NextResponse.json({ error: "Database already exists" }, { status: 409 })
      }

      const newDatabase = {
        id: `db_${Date.now()}`,
        name,
        size: "0 MB",
        tables: 0,
        created: new Date().toISOString(),
        lastBackup: null,
        status: "active",
        charset: "utf8mb4",
        collation: "utf8mb4_unicode_ci",
      }

      mockDatabases.push(newDatabase)

      return NextResponse.json(
        {
          success: true,
          database: newDatabase,
          message: "Database created successfully",
        },
        { status: 201 },
      )
    }

    if (action === "create_user") {
      if (!username || !password) {
        return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
      }

      // Check if user already exists
      if (mockUsers.find((u) => u.username === username)) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 })
      }

      const newUser = {
        id: `user_${Date.now()}`,
        username,
        host: "localhost",
        privileges: privileges || ["SELECT"],
        databases: databases || [],
        created: new Date().toISOString(),
        lastLogin: null,
      }

      mockUsers.push(newUser)

      return NextResponse.json(
        {
          success: true,
          user: newUser,
          message: "Database user created successfully",
        },
        { status: 201 },
      )
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Database operation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get("id")

    if (!type || !id) {
      return NextResponse.json({ error: "Type and ID are required" }, { status: 400 })
    }

    if (type === "database") {
      const dbIndex = mockDatabases.findIndex((db) => db.id === id)
      if (dbIndex === -1) {
        return NextResponse.json({ error: "Database not found" }, { status: 404 })
      }

      mockDatabases.splice(dbIndex, 1)
      return NextResponse.json({
        success: true,
        message: "Database deleted successfully",
      })
    }

    if (type === "user") {
      const userIndex = mockUsers.findIndex((u) => u.id === id)
      if (userIndex === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      mockUsers.splice(userIndex, 1)
      return NextResponse.json({
        success: true,
        message: "Database user deleted successfully",
      })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Delete database/user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
