import { NextRequest, NextResponse } from "next/server"

// Mock data for demonstration
const mockDatabases = [
  {
    id: "db_1",
    name: "limitless_main",
    size: "2.4 GB",
    tables: 45,
    engine: "InnoDB",
    collation: "utf8mb4_unicode_ci",
    created: "2024-01-01",
    lastBackup: "2024-07-10",
  },
  {
    id: "db_2",
    name: "limitless_logs",
    size: "890 MB",
    tables: 12,
    engine: "InnoDB",
    collation: "utf8mb4_unicode_ci",
    created: "2024-01-05",
    lastBackup: "2024-07-09",
  },
]

const mockUsers = [
  {
    id: "user_1",
    username: "limitless_user",
    host: "localhost",
    privileges: ["SELECT", "INSERT", "UPDATE"],
    databases: ["limitless_main"],
    created: "2024-01-01",
    lastLogin: "2024-07-10T10:30:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "list_databases") {
      return NextResponse.json({
        success: true,
        databases: mockDatabases,
      })
    }

    if (action === "list_users") {
      return NextResponse.json({
        success: true,
        users: mockUsers,
      })
    }

    return NextResponse.json({
      success: true,
      databases: mockDatabases,
      users: mockUsers,
    })
  } catch (error) {
    console.error("Database API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password, privileges, databases } = body

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
        lastLogin: "Never",
      }

      mockUsers.push(newUser)

      return NextResponse.json(
        {
          success: true,
          user: newUser,
          message: "Database user created successfully",
        },
        { status: 201 }
      )
    }

    if (action === "create_database") {
      const { name } = body

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
        engine: "InnoDB",
        collation: "utf8mb4_unicode_ci",
        created: new Date().toISOString().split("T")[0],
        lastBackup: "Never",
      }

      mockDatabases.push(newDatabase)

      return NextResponse.json(
        {
          success: true,
          database: newDatabase,
          message: "Database created successfully",
        },
        { status: 201 }
      )
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Database API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const id = searchParams.get("id")

    if (action === "delete_user" && id) {
      const userIndex = mockUsers.findIndex((u) => u.id === id)
      if (userIndex === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const deletedUser = mockUsers.splice(userIndex, 1)[0]
      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
        user: deletedUser,
      })
    }

    if (action === "delete_database" && id) {
      const dbIndex = mockDatabases.findIndex((db) => db.id === id)
      if (dbIndex === -1) {
        return NextResponse.json({ error: "Database not found" }, { status: 404 })
      }

      const deletedDatabase = mockDatabases.splice(dbIndex, 1)[0]
      return NextResponse.json({
        success: true,
        message: "Database deleted successfully",
        database: deletedDatabase,
      })
    }

    return NextResponse.json({ error: "Invalid action or missing ID" }, { status: 400 })
  } catch (error) {
    console.error("Database API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
