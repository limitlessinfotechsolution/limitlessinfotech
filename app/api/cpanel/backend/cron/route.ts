import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface CronJob {
  id: string
  command: string
  schedule: string
  status: "active" | "inactive" | "running" | "failed"
  lastRun: string | null
  nextRun: string | null
  output: string | null
}

// Mock data for cron jobs
const mockCronJobs: CronJob[] = [
  {
    id: "cron_1",
    command: "/usr/bin/php /home/user/public_html/cron.php",
    schedule: "*/5 * * * * (Every 5 minutes)",
    status: "active",
    lastRun: "2024-07-11T10:00:00Z",
    nextRun: "2024-07-11T10:05:00Z",
    output: "Cron job executed successfully.",
  },
  {
    id: "cron_2",
    command: "/usr/bin/python /home/user/scripts/backup.py",
    schedule: "0 3 * * * (Daily at 03:00 AM)",
    status: "active",
    lastRun: "2024-07-11T03:00:00Z",
    nextRun: "2024-07-12T03:00:00Z",
    output: "Backup script completed with 1.2GB data.",
  },
  {
    id: "cron_3",
    command: "wget -q -O /dev/null https://yourdomain.com/api/heartbeat",
    schedule: "0 * * * * (Every hour)",
    status: "inactive",
    lastRun: "2024-07-10T23:00:00Z",
    nextRun: null,
    output: "Cron job manually disabled.",
  },
  {
    id: "cron_4",
    command: "/usr/bin/node /home/user/app/cleanup.js",
    schedule: "0 0 * * 0 (Weekly on Sunday)",
    status: "failed",
    lastRun: "2024-07-07T00:00:00Z",
    nextRun: "2024-07-14T00:00:00Z",
    output: "Error: Disk full. Cleanup failed.",
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

    let filteredJobs = mockCronJobs

    if (statusFilter) {
      filteredJobs = filteredJobs.filter((job) => job.status === statusFilter)
    }

    return NextResponse.json({
      success: true,
      cronJobs: filteredJobs,
      total: filteredJobs.length,
    })
  } catch (error) {
    console.error("Get cron jobs error:", error)
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
    const { action, id, command, schedule, status } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "create") {
      if (!command || !schedule) {
        return NextResponse.json({ error: "Command and schedule are required" }, { status: 400 })
      }

      const newJob: CronJob = {
        id: `cron_${Date.now()}`,
        command,
        schedule,
        status: status || "active",
        lastRun: null,
        nextRun: "Calculating...", // In real app, calculate based on schedule
        output: null,
      }
      mockCronJobs.unshift(newJob)

      return NextResponse.json(
        {
          success: true,
          cronJob: newJob,
          message: "Cron job created successfully.",
        },
        { status: 201 },
      )
    }

    if (action === "update_status") {
      if (!id || !status) {
        return NextResponse.json({ error: "Cron job ID and status are required" }, { status: 400 })
      }
      if (!["active", "inactive"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }

      const jobIndex = mockCronJobs.findIndex((job) => job.id === id)
      if (jobIndex === -1) {
        return NextResponse.json({ error: "Cron job not found" }, { status: 404 })
      }

      mockCronJobs[jobIndex].status = status
      mockCronJobs[jobIndex].output = `Cron job manually ${status === "active" ? "enabled" : "disabled"}.`
      mockCronJobs[jobIndex].nextRun = status === "active" ? "Calculating..." : null

      return NextResponse.json({ success: true, message: `Cron job status updated to ${status}.` })
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "Cron job ID is required" }, { status: 400 })
      }

      const initialLength = mockCronJobs.length
      const jobIndex = mockCronJobs.findIndex((job) => job.id === id)

      if (jobIndex === -1) {
        return NextResponse.json({ error: "Cron job not found" }, { status: 404 })
      }

      mockCronJobs.splice(jobIndex, 1)

      return NextResponse.json({ success: true, message: "Cron job deleted successfully." })
    }

    if (action === "run_now") {
      if (!id) {
        return NextResponse.json({ error: "Cron job ID is required" }, { status: 400 })
      }

      const jobIndex = mockCronJobs.findIndex((job) => job.id === id)
      if (jobIndex === -1) {
        return NextResponse.json({ error: "Cron job not found" }, { status: 404 })
      }

      mockCronJobs[jobIndex].status = "running"
      mockCronJobs[jobIndex].output = "Executing..."
      mockCronJobs[jobIndex].lastRun = new Date().toISOString()

      // Simulate execution
      setTimeout(() => {
        const updatedIndex = mockCronJobs.findIndex((j) => j.id === id)
        if (updatedIndex !== -1) {
          mockCronJobs[updatedIndex].status = "active" // Or 'completed'
          mockCronJobs[updatedIndex].output = "Execution completed successfully."
        }
      }, 2000) // Simulate 2-second run

      return NextResponse.json({ success: true, message: "Cron job execution initiated." })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Cron job API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
