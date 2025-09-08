import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

// Mock domain data
const mockDomains = [
  {
    id: "domain_1",
    name: "limitless.com",
    type: "primary",
    status: "active",
    created: "2024-01-15T10:00:00Z",
    expires: "2025-01-15T10:00:00Z",
    autoRenew: true,
    ssl: {
      enabled: true,
      issuer: "Let's Encrypt",
      expires: "2024-10-15T10:00:00Z",
      autoRenew: true,
    },
    dns: [
      { type: "A", name: "@", value: "192.168.1.100", ttl: 3600 },
      { type: "A", name: "www", value: "192.168.1.100", ttl: 3600 },
      { type: "MX", name: "@", value: "mail.limitless.com", priority: 10, ttl: 3600 },
      { type: "CNAME", name: "mail", value: "limitless.com", ttl: 3600 },
      { type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all", ttl: 3600 },
    ],
  },
  {
    id: "domain_2",
    name: "api.limitless.com",
    type: "subdomain",
    status: "active",
    created: "2024-02-20T14:30:00Z",
    expires: null,
    autoRenew: false,
    ssl: {
      enabled: true,
      issuer: "Let's Encrypt",
      expires: "2024-11-20T14:30:00Z",
      autoRenew: true,
    },
    dns: [
      { type: "A", name: "@", value: "192.168.1.101", ttl: 3600 },
      { type: "CNAME", name: "www", value: "api.limitless.com", ttl: 3600 },
    ],
  },
  {
    id: "domain_3",
    name: "dev.limitless.com",
    type: "subdomain",
    status: "active",
    created: "2024-03-10T09:15:00Z",
    expires: null,
    autoRenew: false,
    ssl: {
      enabled: false,
      issuer: null,
      expires: null,
      autoRenew: false,
    },
    dns: [{ type: "A", name: "@", value: "192.168.1.102", ttl: 3600 }],
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
    const domainId = searchParams.get("domainId")

    // Get DNS records for a specific domain
    if (domainId) {
      const domain = mockDomains.find((d) => d.id === domainId)
      if (!domain) {
        return NextResponse.json({ error: "Domain not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        domain: domain.name,
        dns: domain.dns,
      })
    }

    let filteredDomains = mockDomains

    if (type) {
      filteredDomains = filteredDomains.filter((domain) => domain.type === type)
    }

    return NextResponse.json({
      success: true,
      domains: filteredDomains,
      total: filteredDomains.length,
    })
  } catch (error) {
    console.error("Get domains error:", error)
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
    const { action, name, type, dnsRecords, sslEnabled } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "add_domain") {
      if (!name || !type) {
        return NextResponse.json({ error: "Domain name and type are required" }, { status: 400 })
      }

      // Check if domain already exists
      if (mockDomains.find((d) => d.name === name)) {
        return NextResponse.json({ error: "Domain already exists" }, { status: 409 })
      }

      const newDomain = {
        id: `domain_${Date.now()}`,
        name,
        type,
        status: "active",
        created: new Date().toISOString(),
        expires: type === "primary" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
        autoRenew: type === "primary",
        ssl: {
          enabled: sslEnabled || false,
          issuer: sslEnabled ? "Let's Encrypt" : null,
          expires: sslEnabled ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : null,
          autoRenew: sslEnabled || false,
        },
        dns: dnsRecords || [{ type: "A", name: "@", value: "192.168.1.100", ttl: 3600 }],
      }

      mockDomains.push(newDomain)

      return NextResponse.json(
        {
          success: true,
          domain: newDomain,
          message: "Domain added successfully",
        },
        { status: 201 },
      )
    }

    if (action === "update_dns") {
      const { domainId, dns } = body

      if (!domainId || !dns) {
        return NextResponse.json({ error: "Domain ID and DNS records are required" }, { status: 400 })
      }

      const domainIndex = mockDomains.findIndex((d) => d.id === domainId)
      if (domainIndex === -1) {
        return NextResponse.json({ error: "Domain not found" }, { status: 404 })
      }

      mockDomains[domainIndex].dns = dns

      return NextResponse.json({
        success: true,
        domain: mockDomains[domainIndex],
        message: "DNS records updated successfully",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Domain operation error:", error)
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
      return NextResponse.json({ error: "Domain ID is required" }, { status: 400 })
    }

    const domainIndex = mockDomains.findIndex((domain) => domain.id === id)

    if (domainIndex === -1) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }

    // Prevent deletion of primary domain
    if (mockDomains[domainIndex].type === "primary") {
      return NextResponse.json({ error: "Cannot delete primary domain" }, { status: 400 })
    }

    mockDomains.splice(domainIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Domain deleted successfully",
    })
  } catch (error) {
    console.error("Delete domain error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
