import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface SSLCertificate {
  id: string
  domain: string
  issuer: string
  validFrom: string
  validTo: string
  status: "valid" | "expiring" | "expired" | "pending"
  autoRenew: boolean
  type: "DV" | "OV" | "EV"
  certificate: string | null // Mock: store actual cert content
  privateKey: string | null // Mock: store actual key content
  csr: string | null // Mock: store actual CSR content
}

// Mock data for SSL Certificates
const mockSSLCertificates: SSLCertificate[] = [
  {
    id: "cert_1",
    domain: "limitlessinfotech.com",
    issuer: "Let's Encrypt",
    validFrom: "2024-04-01T00:00:00Z",
    validTo: "2024-07-01T23:59:59Z",
    status: "expired",
    autoRenew: true,
    type: "DV",
    certificate: "-----BEGIN CERTIFICATE-----\nMOCK_CERT_1\n-----END CERTIFICATE-----",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMOCK_KEY_1\n-----END PRIVATE KEY-----",
    csr: null,
  },
  {
    id: "cert_2",
    domain: "api.limitlessinfotech.com",
    issuer: "Let's Encrypt",
    validFrom: "2024-05-15T00:00:00Z",
    validTo: "2024-08-13T23:59:59Z",
    status: "expiring", // Less than 30 days left
    autoRenew: true,
    type: "DV",
    certificate: "-----BEGIN CERTIFICATE-----\nMOCK_CERT_2\n-----END CERTIFICATE-----",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMOCK_KEY_2\n-----END PRIVATE KEY-----",
    csr: null,
  },
  {
    id: "cert_3",
    domain: "dev.limitlessinfotech.com",
    issuer: "Self-Signed",
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-01-01T23:59:59Z",
    status: "valid",
    autoRenew: false,
    type: "DV",
    certificate: "-----BEGIN CERTIFICATE-----\nMOCK_CERT_3\n-----END CERTIFICATE-----",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMOCK_KEY_3\n-----END PRIVATE KEY-----",
    csr: null,
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

    let filteredCerts = mockSSLCertificates

    if (statusFilter) {
      filteredCerts = filteredCerts.filter((cert) => cert.status === statusFilter)
    }

    return NextResponse.json({
      success: true,
      certificates: filteredCerts,
      total: filteredCerts.length,
    })
  } catch (error) {
    console.error("Get SSL certificates error:", error)
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
    const { action, id, domain, csr, privateKey, certificate, country, state, city, organization, orgUnit, email } =
      body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "install_certificate") {
      if (!domain || !certificate || !privateKey) {
        return NextResponse.json({ error: "Domain, certificate, and private key are required" }, { status: 400 })
      }

      // Check if certificate for this domain already exists
      if (mockSSLCertificates.find((cert) => cert.domain === domain)) {
        return NextResponse.json({ error: "Certificate for this domain already exists" }, { status: 409 })
      }

      const newCert: SSLCertificate = {
        id: `cert_${Date.now()}`,
        domain,
        issuer: "Custom Upload", // Or parse from cert
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Mock 1 year validity
        status: "valid",
        autoRenew: false, // Default to false for manual uploads
        type: "DV", // Default type
        certificate,
        privateKey,
        csr: null,
      }
      mockSSLCertificates.unshift(newCert)

      return NextResponse.json(
        {
          success: true,
          certificate: newCert,
          message: "SSL certificate installed successfully.",
        },
        { status: 201 },
      )
    }

    if (action === "generate_csr") {
      if (!domain || !country || !state || !city || !organization || !email) {
        return NextResponse.json({ error: "All required fields for CSR generation are missing" }, { status: 400 })
      }

      // Simulate CSR and private key generation
      const generatedCsr = `-----BEGIN CERTIFICATE REQUEST-----\nMOCK_CSR_FOR_${domain}\n-----END CERTIFICATE REQUEST-----`
      const generatedPrivateKey = `-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY_FOR_${domain}\n-----END PRIVATE KEY-----`

      return NextResponse.json({
        success: true,
        csr: generatedCsr,
        privateKey: generatedPrivateKey,
        message: "CSR and Private Key generated successfully.",
      })
    }

    if (action === "delete_certificate") {
      if (!id) {
        return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 })
      }

      const initialLength = mockSSLCertificates.length
      const certIndex = mockSSLCertificates.findIndex((cert) => cert.id === id)

      if (certIndex === -1) {
        return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
      }

      mockSSLCertificates.splice(certIndex, 1)

      return NextResponse.json({ success: true, message: "SSL certificate deleted successfully." })
    }

    if (action === "toggle_auto_renew") {
      if (!id) {
        return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 })
      }

      const certIndex = mockSSLCertificates.findIndex((cert) => cert.id === id)
      if (certIndex === -1) {
        return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
      }

      mockSSLCertificates[certIndex].autoRenew = !mockSSLCertificates[certIndex].autoRenew
      return NextResponse.json({
        success: true,
        certificate: mockSSLCertificates[certIndex],
        message: `Auto-renewal for ${mockSSLCertificates[certIndex].domain} set to ${mockSSLCertificates[certIndex].autoRenew ? "enabled" : "disabled"}.`,
      })
    }

    if (action === "renew_certificate") {
      if (!id) {
        return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 })
      }

      const certIndex = mockSSLCertificates.findIndex((cert) => cert.id === id)
      if (certIndex === -1) {
        return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
      }

      // Simulate renewal
      mockSSLCertificates[certIndex].validFrom = new Date().toISOString()
      mockSSLCertificates[certIndex].validTo = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // Renew for 90 days
      mockSSLCertificates[certIndex].status = "valid"

      return NextResponse.json({
        success: true,
        certificate: mockSSLCertificates[certIndex],
        message: `Certificate for ${mockSSLCertificates[certIndex].domain} renewed successfully.`,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("SSL API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
