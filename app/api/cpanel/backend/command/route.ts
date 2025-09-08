import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)

    if (!user || user.role !== "admin") {
      // Only allow admins to run commands
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { command } = body

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    // Simulate command execution
    let output = ""
    switch (command.toLowerCase().trim()) {
      case "ls -la":
        output = `drwxr-xr-x  5 user  group   160 Jul 11 10:00 .
drwxr-xr-x 20 root  root    640 Jul 11 09:00 ..
drwxr-xr-x  3 user  group    96 Jul 10 14:00 public_html
drwxr-xr-x  2 user  group    64 Jul 11 08:00 logs
-rw-r--r--  1 user  group  1024 Jul 01 12:00 .bashrc`
        break
      case "df -h":
        output = `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        98G   45G   48G  48% /
tmpfs           3.9G     0  3.9G   0% /dev/shm`
        break
      case "free -h":
        output = `              total        used        free      shared  buff/cache   available
Mem:          7.8G        2.5G        3.0G        100M        2.3G        5.0G
Swap:         2.0G          0B        2.0G`
        break
      case "uptime":
        output = ` 10:30:00 up 15 days,  7 hours, 3 users,  load average: 0.15, 0.20, 0.25`
        break
      case "help":
        output = `Available commands: ls -la, df -h, free -h, uptime, help`
        break
      default:
        output = `Command not found: ${command}`
    }

    return NextResponse.json({ success: true, output })
  } catch (error) {
    console.error("Backend command execution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
