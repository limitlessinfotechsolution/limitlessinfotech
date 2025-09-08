"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShieldCheck,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SSLCertificate {
  id: string
  domain: string
  issuer: string
  validFrom: string
  validTo: string
  status: "valid" | "expiring" | "expired" | "pending"
  autoRenew: boolean
  type: "DV" | "OV" | "EV"
}

const mockSSLCertificates: SSLCertificate[] = [
  {
    id: "1",
    domain: "limitless.com",
    issuer: "Let's Encrypt",
    validFrom: "2024-01-01",
    validTo: "2024-04-01",
    status: "valid",
    autoRenew: true,
    type: "DV",
  },
  {
    id: "2",
    domain: "api.limitless.com",
    issuer: "Let's Encrypt",
    validFrom: "2024-01-01",
    validTo: "2024-02-15",
    status: "expiring",
    autoRenew: true,
    type: "DV",
  },
  {
    id: "3",
    domain: "old.limitless.com",
    issuer: "Let's Encrypt",
    validFrom: "2023-10-01",
    validTo: "2024-01-01",
    status: "expired",
    autoRenew: false,
    type: "DV",
  },
  {
    id: "4",
    domain: "secure.limitless.com",
    issuer: "DigiCert",
    validFrom: "2023-06-01",
    validTo: "2025-06-01",
    status: "valid",
    autoRenew: false,
    type: "OV",
  },
]

export default function SSLCertificateManager() {
  const [certificates, setCertificates] = useState<SSLCertificate[]>(mockSSLCertificates)
  const [newCertForm, setNewCertForm] = useState({
    domain: "",
    csr: "",
    privateKey: "",
    certificate: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-accent-green/20 text-accent-green"
      case "expiring":
      case "pending":
        return "bg-accent-orange/20 text-accent-orange"
      case "expired":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-4 h-4 text-accent-green" />
      case "expiring":
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-accent-orange" />
      case "expired":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return <ShieldCheck className="w-4 h-4 text-muted-foreground" />
    }
  }

  const installCertificate = () => {
    if (newCertForm.domain && newCertForm.certificate && newCertForm.privateKey) {
      const newCert: SSLCertificate = {
        id: Date.now().toString(),
        domain: newCertForm.domain,
        issuer: "Custom Upload",
        validFrom: new Date().toISOString().split("T")[0],
        validTo: "N/A", // In a real app, this would be parsed from the cert
        status: "valid",
        autoRenew: false,
        type: "DV", // Assuming DV for manual upload
      }
      setCertificates([...certificates, newCert])
      setNewCertForm({ domain: "", csr: "", privateKey: "", certificate: "" })
    }
  }

  return (
    <div className="space-y-6">
      {/* SSL Manager Header */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>SSL Certificate Manager</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="certificates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 bg-card border-border rounded-lg p-1 mb-6">
          <TabsTrigger
            value="certificates"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Certificates
          </TabsTrigger>
          <TabsTrigger
            value="install"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Install SSL
          </TabsTrigger>
          <TabsTrigger
            value="csr"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Generate CSR
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Installed SSL Certificates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Domain</th>
                      <th className="p-4 font-medium table-header">Issuer</th>
                      <th className="p-4 font-medium table-header">Type</th>
                      <th className="p-4 font-medium table-header">Valid From</th>
                      <th className="p-4 font-medium table-header">Valid To</th>
                      <th className="p-4 font-medium table-header">Status</th>
                      <th className="p-4 font-medium table-header">Auto Renew</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert, index) => (
                      <tr
                        key={cert.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{cert.domain}</td>
                        <td className="p-4 text-muted-foreground">{cert.issuer}</td>
                        <td className="p-4">
                          <Badge className="bg-accent-blue/20 text-accent-blue">{cert.type}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{cert.validFrom}</td>
                        <td className="p-4 text-muted-foreground">{cert.validTo}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(cert.status)}
                            <Badge className={getStatusColor(cert.status)}>{cert.status}</Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={cn(
                              cert.autoRenew
                                ? "bg-accent-green/20 text-accent-green"
                                : "bg-destructive/20 text-destructive",
                            )}
                          >
                            {cert.autoRenew ? "Enabled" : "Disabled"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-destructive/10 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Install SSL Certificate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Domain</label>
                <Input
                  placeholder="example.com"
                  value={newCertForm.domain}
                  onChange={(e) => setNewCertForm((prev) => ({ ...prev, domain: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Certificate (CRT)</label>
                <Textarea
                  placeholder="Paste your certificate here..."
                  value={newCertForm.certificate}
                  onChange={(e) => setNewCertForm((prev) => ({ ...prev, certificate: e.target.value }))}
                  className="input-field min-h-[150px] font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Private Key (KEY)</label>
                <Textarea
                  placeholder="Paste your private key here..."
                  value={newCertForm.privateKey}
                  onChange={(e) => setNewCertForm((prev) => ({ ...prev, privateKey: e.target.value }))}
                  className="input-field min-h-[150px] font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Certificate Authority Bundle (CABUNDLE) - Optional
                </label>
                <Textarea
                  placeholder="Paste your CA bundle here (if provided by issuer)..."
                  className="input-field min-h-[100px] font-mono"
                />
              </div>
              <Button onClick={installCertificate} className="btn-gradient">
                <Upload className="w-4 h-4 mr-2" />
                Install Certificate
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csr" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Generate CSR (Certificate Signing Request)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Domain</label>
                <Input placeholder="example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Country (2-letter code)</label>
                <Input placeholder="US" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">State/Province</label>
                <Input placeholder="California" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">City</label>
                <Input placeholder="San Francisco" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Organization</label>
                <Input placeholder="Limitless Infotech Solutions" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Organization Unit (Optional)
                </label>
                <Input placeholder="IT Department" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                <Input placeholder="admin@limitless.com" className="input-field" />
              </div>
              <Button className="btn-gradient">
                <Key className="w-4 h-4 mr-2" />
                Generate CSR & Key
              </Button>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Generated CSR</label>
                  <Textarea
                    readOnly
                    className="input-field min-h-[150px] font-mono"
                    value="-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Generated Private Key</label>
                  <Textarea
                    readOnly
                    className="input-field min-h-[150px] font-mono"
                    value="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">SSL Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Auto SSL Renewal</h3>
                  <p className="text-sm text-muted-foreground">Automatically renew certificates before expiration</p>
                </div>
                <Button className="btn-gradient">Enabled</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Force HTTPS Redirect</h3>
                  <p className="text-sm text-muted-foreground">Redirect all HTTP traffic to HTTPS</p>
                </div>
                <Button className="btn-gradient">Enabled</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">HSTS (HTTP Strict Transport Security)</h3>
                  <p className="text-sm text-muted-foreground">Ensure browsers only connect via HTTPS</p>
                </div>
                <Button className="btn-gradient">Enabled</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">OCSP Stapling</h3>
                  <p className="text-sm text-muted-foreground">Improve SSL handshake performance and privacy</p>
                </div>
                <Button className="btn-gradient">Enabled</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
