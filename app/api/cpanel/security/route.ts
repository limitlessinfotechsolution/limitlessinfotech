import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface SecuritySetting {
  id: string
  name: string
  description: string
  enabled: boolean
  status: "active" | "inactive" | "scanning" | "updating"
}

interface FirewallRule {
  id: string
  type: "allow" | "deny"
  protocol: "TCP" | "UDP" | "ICMP" | "Any"
  port: string
  source: string
  destination: string
  status: "active" | "inactive"
}

// Mock data for security settings and firewall rules
const mockSecuritySettings: SecuritySetting[] = [
  {
    id: "sec_1",
    name: "Two-Factor Authentication (2FA)",
    description: "Adds an extra layer of security for logins.",
    enabled: true,
    status: "active",
  },
  {
    id: "sec_2",
    name: "Brute Force Protection",
    description: "Blocks repeated failed login attempts.",
    enabled: true,
    status: "active",
  },
  {
    id: "sec_3",
    name: "SSL/TLS Enforcement",
    description: "Forces all connections to use HTTPS.",
    enabled: true,
    status: "active",
  },
  {
    id: "sec_4",
    name: "Malware Scanner",
    description: "Scans your website files for malicious code.",
    enabled: false,
    status: "inactive",
  },
  {
    id: "sec_5",
    name: "IP Blocker",
    description: "Block access from specific IP addresses.",
    enabled: true,
    status: "active",
  },
]

const mockFirewallRules: FirewallRule[] = [
  {
    id: "fw_1",
    type: "allow",
    protocol: "TCP",
    port: "80,443",
    source: "Any",
    destination: "Any",
    status: "active",
  },
  {
    id: "fw_2",
    type: "deny",
    protocol: "TCP",
    port: "22",
    source: "1.2.3.4",
    destination: "Any",
    status: "active",
  },
  {
    id: "fw_3",
    type: "allow",
    protocol: "UDP",
    port: "53",
    source: "Any",
    destination: "Any",
    status: "inactive",
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

    if (type === "firewall") {
      return NextResponse.json({
        success: true,
        rules: mockFirewallRules,
        total: mockFirewallRules.length,
      })
    }

    return NextResponse.json({
      success: true,
      settings: mockSecuritySettings,
      total: mockSecuritySettings.length,
    })
  } catch (error) {
    console.error("Get security data error:", error)
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
    const { action, id, enabled, type, protocol, port, source, destination, status } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "toggle_setting") {
      if (!id) {
        return NextResponse.json({ error: "Setting ID is required" }, { status: 400 })
      }

      const settingIndex = mockSecuritySettings.findIndex((s) => s.id === id)
      if (settingIndex === -1) {
        return NextResponse.json({ error: "Security setting not found" }, { status: 404 })
      }

      mockSecuritySettings[settingIndex].enabled = !mockSecuritySettings[settingIndex].enabled
      mockSecuritySettings[settingIndex].status = mockSecuritySettings[settingIndex].enabled ? "active" : "inactive"

      // Simulate scan if it's the malware scanner
      if (id === "sec_4" && mockSecuritySettings[settingIndex].enabled) {
        mockSecuritySettings[settingIndex].status = "scanning"
        setTimeout(() => {
          const updatedIndex = mockSecuritySettings.findIndex((s) => s.id === id)
          if (updatedIndex !== -1) {
            mockSecuritySettings[updatedIndex].status = "active"
          }
        }, 5000) // Simulate scan time
      }

      return NextResponse.json({
        success: true,
        setting: mockSecuritySettings[settingIndex],
        message: "Security setting updated.",
      })
    }

    if (action === "add_firewall_rule") {
      if (!type || !protocol || !port || !source) {
        return NextResponse.json({ error: "Type, protocol, port, and source are required" }, { status: 400 })
      }

      const newRule: FirewallRule = {
        id: `fw_${Date.now()}`,
        type,
        protocol,
        port,
        source,
        destination: destination || "Any",
        status: "active",
      }
      mockFirewallRules.unshift(newRule)

      return NextResponse.json(
        {
          success: true,
          rule: newRule,
          message: "Firewall rule added successfully.",
        },
        { status: 201 },
      )
    }

    if (action === "toggle_firewall_rule_status") {
      if (!id) {
        return NextResponse.json({ error: "Rule ID is required" }, { status: 400 })
      }

      const ruleIndex = mockFirewallRules.findIndex((r) => r.id === id)
      if (ruleIndex === -1) {
        return NextResponse.json({ error: "Firewall rule not found" }, { status: 404 })
      }

      mockFirewallRules[ruleIndex].status = mockFirewallRules[ruleIndex].status === "active" ? "inactive" : "active"

      return NextResponse.json({
        success: true,
        rule: mockFirewallRules[ruleIndex],
        message: "Firewall rule status updated.",
      })
    }

    if (action === "delete_firewall_rule") {
      if (!id) {
        return NextResponse.json({ error: "Rule ID is required" }, { status: 400 })
      }

      const initialLength = mockFirewallRules.length
      const ruleIndex = mockFirewallRules.findIndex((r) => r.id === id)

      if (ruleIndex === -1) {
        return NextResponse.json({ error: "Firewall rule not found" }, { status: 404 })
      }

      mockFirewallRules.splice(ruleIndex, 1)

      return NextResponse.json({ success: true, message: "Firewall rule deleted successfully." })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Security API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
