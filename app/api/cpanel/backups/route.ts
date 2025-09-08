import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

// Mock backup data
const mockBackups = [
  {
    id: "backup_1",
    name: "Full Site Backup - 2024-07-10",
    type: "full",
    size: "2.4 GB",
    created: "2024-07-10T02:00:00Z",
    status: "completed",
    downloadUrl: "/api/cpanel/backups/download/backup_1",
    description: "Automated daily backup including files, databases, and email accounts",
  },
  {
    id: "backup_2",
    name: "Database Backup - 2024-07-09",
    type: "database",
    size: "156 MB",
    created: "2024-07-09T14:30:00Z",
    status: "completed",
    downloadUrl: "/api/cpanel/backups/download/backup_2",
    description: "Manual database backup before system update",
  },
  {
    id: "backup_3",
    name: "Files Only Backup - 2024-07-08",
    type: "files",
    size: "1.8 GB",
    created: "2024-07-08T18:45:00Z",
    status: "completed",
    downloadUrl: "/api/cpanel/backups/download/backup_3",
    description: "Website files backup excluding databases",
  },
  {
    id: "backup_4",
    name: "Full Site Backup - 2024-07-07",
    type: "full",
    size: "2.3 GB",
    created: "2024-07-07T02:00:00Z",
    status: "completed",
    downloadUrl: "/api/cpanel/backups/download/backup_4",
    description: "Automated daily backup",
  },
  {
    id: "backup_5",
    name: "Emergency Backup - 2024-07-06",
    type: "full",
    size: "0 MB",
    created: "2024-07-06T16:20:00Z",
    status: "failed",
    downloadUrl: null,
    description: "Emergency backup failed due to insufficient storage space",
    error: "Insufficient disk space available",
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
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    let filteredBackups = mockBackups

    if (type) {
      filteredBackups = filteredBackups.filter((backup) => backup.type === type)
    }

    if (status) {
      filteredBackups = filteredBackups.filter((backup) => backup.status === status)
    }

    return NextResponse.json({
      success: true,
      backups: filteredBackups,
      total: filteredBackups.length,
      storageUsed: "8.7 GB",
      storageLimit: "50 GB",
    })
  } catch (error) {
    console.error("Get backups error:", error)
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
    const { type, description } = body

    if (!type) {
      return NextResponse.json({ error: "Backup type is required" }, { status: 400 })
    }

    if (!["full", "files", "database", "email"].includes(type)) {
      return NextResponse.json({ error: "Invalid backup type" }, { status: 400 })
    }

    // Create new backup entry
    const newBackup = {
      id: `backup_${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Backup - ${new Date().toISOString().split("T")[0]}`,
      type,
      size: "0 MB",
      created: new Date().toISOString(),
      status: "in_progress",
      downloadUrl: null,
      description: description || `Manual ${type} backup`,
      progress: 0,
    }

    mockBackups.unshift(newBackup)

    // Simulate backup process
    setTimeout(() => {
      const backupIndex = mockBackups.findIndex((b) => b.id === newBackup.id)
      if (backupIndex !== -1) {
        mockBackups[backupIndex] = {
          ...mockBackups[backupIndex],
          status: "completed",
          size: type === "full" ? "2.5 GB" : type === "database" ? "180 MB" : "1.9 GB",
          downloadUrl: `/api/cpanel/backups/download/${newBackup.id}`,
        }
      }
    }, 5000) // Simulate 5 second backup process

    return NextResponse.json(
      {
        success: true,
        backup: newBackup,
        message: "Backup started successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create backup error:", error)
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
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Backup ID is required" }, { status: 400 })
    }

    const backupIndex = mockBackups.findIndex((backup) => backup.id === id)

    if (backupIndex === -1) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 })
    }

    mockBackups.splice(backupIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Backup deleted successfully",
    })
  } catch (error) {
    console.error("Delete backup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
