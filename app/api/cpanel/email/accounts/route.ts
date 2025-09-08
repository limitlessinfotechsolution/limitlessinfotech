import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

// Mock data for email accounts
const mockEmailAccounts = [
  {
    id: "email_1",
    address: "info@limitlessinfotech.com",
    storageUsed: "100 MB",
    storageLimit: "1 GB",
    created: "2023-01-01T10:00:00Z",
    status: "active",
    lastLogin: "2024-07-10T14:30:00Z",
  },
  {
    id: "email_2",
    address: "support@limitlessinfotech.com",
    storageUsed: "50 MB",
    storageLimit: "500 MB",
    created: "2023-03-10T11:00:00Z",
    status: "active",
    lastLogin: "2024-07-11T09:00:00Z",
  },
  {
    id: "email_3",
    address: "sales@limitlessinfotech.com",
    storageUsed: "200 MB",
    storageLimit: "2 GB",
    created: "2023-06-05T15:00:00Z",
    status: "active",
    lastLogin: "2024-07-09T16:00:00Z",
  },
  {
    id: "email_4",
    address: "webmaster@limitlessinfotech.com",
    storageUsed: "10 MB",
    storageLimit: "100 MB",
    created: "2024-01-20T08:00:00Z",
    status: "suspended",
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
    const statusFilter = searchParams.get("status")

    let filteredAccounts = mockEmailAccounts

    if (statusFilter) {
      filteredAccounts = filteredAccounts.filter((account) => account.status === statusFilter)
    }

    return NextResponse.json({
      success: true,
      accounts: filteredAccounts,
      total: filteredAccounts.length,
      totalStorageUsed: "360 MB",
      totalStorageLimit: "3.6 GB",
    })
  } catch (error) {
    console.error("Get email accounts error:", error)
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
    const { action, address, password, id, newPassword, storageLimit } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "create") {
      if (!address || !password) {
        return NextResponse.json({ error: "Email address and password are required" }, { status: 400 })
      }
      if (!address.includes("@") || !address.includes(".")) {
        return NextResponse.json({ error: "Invalid email address format" }, { status: 400 })
      }
      if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
      }

      // Check if email already exists
      if (mockEmailAccounts.find((acc) => acc.address === address)) {
        return NextResponse.json({ error: "Email account already exists" }, { status: 409 })
      }

      const newAccount = {
        id: `email_${Date.now()}`,
        address,
        storageUsed: "0 MB",
        storageLimit: storageLimit || "1 GB",
        created: new Date().toISOString(),
        status: "active",
        lastLogin: null,
      }
      mockEmailAccounts.unshift(newAccount) // Add to the beginning

      return NextResponse.json(
        {
          success: true,
          account: newAccount,
          message: "Email account created successfully.",
        },
        { status: 201 },
      )
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "Account ID is required" }, { status: 400 })
      }

      const initialLength = mockEmailAccounts.length
      const accountIndex = mockEmailAccounts.findIndex((acc) => acc.id === id)

      if (accountIndex === -1) {
        return NextResponse.json({ error: "Email account not found" }, { status: 404 })
      }

      mockEmailAccounts.splice(accountIndex, 1)

      return NextResponse.json({ success: true, message: "Email account deleted successfully." })
    }

    if (action === "change_password") {
      if (!id || !newPassword) {
        return NextResponse.json({ error: "Account ID and new password are required" }, { status: 400 })
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 })
      }

      const account = mockEmailAccounts.find((acc) => acc.id === id)
      if (!account) {
        return NextResponse.json({ success: false, error: "Email account not found" }, { status: 404 })
      }

      // In a real app, you'd hash and update the password in the database
      return NextResponse.json({ success: true, message: `Password for ${account.address} changed successfully.` })
    }

    if (action === "update_storage") {
      if (!id || !storageLimit) {
        return NextResponse.json({ error: "Account ID and new storage limit are required" }, { status: 400 })
      }
      const accountIndex = mockEmailAccounts.findIndex((acc) => acc.id === id)
      if (accountIndex === -1) {
        return NextResponse.json({ success: false, error: "Email account not found" }, { status: 404 })
      }
      mockEmailAccounts[accountIndex].storageLimit = storageLimit
      return NextResponse.json({
        success: true,
        message: `Storage limit for ${mockEmailAccounts[accountIndex].address} updated.`,
      })
    }

    if (action === "toggle_status") {
      if (!id) {
        return NextResponse.json({ error: "Account ID is required" }, { status: 400 })
      }
      const accountIndex = mockEmailAccounts.findIndex((acc) => acc.id === id)
      if (accountIndex === -1) {
        return NextResponse.json({ success: false, error: "Email account not found" }, { status: 404 })
      }
      mockEmailAccounts[accountIndex].status =
        mockEmailAccounts[accountIndex].status === "active" ? "suspended" : "active"
      return NextResponse.json({
        success: true,
        message: `Email account ${mockEmailAccounts[accountIndex].address} status toggled.`,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Email account API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
