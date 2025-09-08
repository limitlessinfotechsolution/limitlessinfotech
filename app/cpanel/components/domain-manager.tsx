"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Plus, Trash2, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Domain {
  id: string
  name: string
  type: "Primary" | "Addon" | "Subdomain"
  status: "Active" | "Pending" | "Expired"
  expiry: string
}

interface Subdomain {
  id: string
  name: string
  domain: string
  documentRoot: string
  created: string
}

interface DNSRecord {
  id: string
  type: "A" | "CNAME" | "MX" | "TXT" | "NS"
  name: string
  value: string
  ttl: number
}

const mockDomains: Domain[] = [
  {
    id: "1",
    name: "limitless.com",
    type: "Primary",
    status: "Active",
    expiry: "2025-01-15",
  },
  {
    id: "2",
    name: "limitlessinfotech.com",
    type: "Addon",
    status: "Pending",
    expiry: "2024-12-20",
  },
  {
    id: "3",
    name: "limitless.dev",
    type: "Subdomain",
    status: "Expired",
    expiry: "2025-03-10",
  },
]

const mockSubdomains: Subdomain[] = [
  {
    id: "1",
    name: "api",
    domain: "limitless.com",
    documentRoot: "/public_html/api",
    created: "2024-01-10",
  },
  {
    id: "2",
    name: "blog",
    domain: "limitless.com",
    documentRoot: "/public_html/blog",
    created: "2024-01-12",
  },
  {
    id: "3",
    name: "staging",
    domain: "limitless.com",
    documentRoot: "/public_html/staging",
    created: "2024-01-08",
  },
]

const mockDNSRecords: DNSRecord[] = [
  {
    id: "1",
    type: "A",
    name: "@",
    value: "192.168.1.100",
    ttl: 3600,
  },
  {
    id: "2",
    type: "CNAME",
    name: "www",
    value: "limitless.com",
    ttl: 3600,
  },
  {
    id: "3",
    type: "MX",
    name: "@",
    value: "mail.limitless.com",
    ttl: 3600,
  },
  {
    id: "4",
    type: "TXT",
    name: "@",
    value: "v=spf1 include:_spf.google.com ~all",
    ttl: 3600,
  },
]

export default function DomainManager() {
  const [domains, setDomains] = useState<Domain[]>(mockDomains)
  const [subdomains, setSubdomains] = useState<Subdomain[]>(mockSubdomains)
  const [dnsRecords, setDNSRecords] = useState<DNSRecord[]>(mockDNSRecords)
  const [activeTab, setActiveTab] = useState<"domains" | "subdomains" | "dns">("domains")
  const [newSubdomainForm, setNewSubdomainForm] = useState({
    name: "",
    domain: "limitless.com",
    documentRoot: "/public_html/",
  })
  const [newDomainName, setNewDomainName] = useState("")
  const [newDomainType, setNewDomainType] = useState<Domain["type"]>("Addon")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchDomains = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/domains")
      const data = await response.json()
      if (data.success) {
        setDomains(data.domains)
      } else {
        throw new Error(data.error || "Failed to fetch domains.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load domains.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDomain = async () => {
    if (!newDomainName.trim()) {
      toast({ title: "Error", description: "Domain name is required.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", name: newDomainName, type: newDomainType }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Domain added successfully." })
        setDomains((prev) => [...prev, data.domain])
        setNewDomainName("")
      } else {
        throw new Error(data.error || "Failed to add domain.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDomain = async (id: string) => {
    if (!confirm("Are you sure you want to delete this domain? This action cannot be undone.")) {
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Domain deleted successfully." })
        setDomains((prev) => prev.filter((domain) => domain.id !== id))
      } else {
        throw new Error(data.error || "Failed to delete domain.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createSubdomain = () => {
    if (newSubdomainForm.name.trim()) {
      const newSubdomain: Subdomain = {
        id: Date.now().toString(),
        name: newSubdomainForm.name,
        domain: newSubdomainForm.domain,
        documentRoot: newSubdomainForm.documentRoot,
        created: new Date().toISOString().split("T")[0],
      }
      setSubdomains([...subdomains, newSubdomain])
      setNewSubdomainForm({ name: "", domain: "limitless.com", documentRoot: "/public_html/" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-accent-green/20 text-accent-green font-mono">Active</Badge>
      case "Pending":
        return <Badge className="bg-accent-blue/20 text-accent-blue font-mono">Pending</Badge>
      case "Expired":
        return <Badge className="bg-destructive/20 text-destructive font-mono">Expired</Badge>
      default:
        return <Badge className="bg-muted/20 text-muted-foreground font-mono">Unknown</Badge>
    }
  }

  useEffect(() => {
    fetchDomains()
  }, [])

  return (
    <div className="space-y-6">
      {/* Domain Manager Header */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Globe className="w-5 h-5 text-primary" />
            <span>Domain Manager</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setActiveTab("domains")}
              className={cn(activeTab === "domains" ? "btn-gradient" : "btn-outline-primary")}
            >
              <Globe className="w-4 h-4 mr-2" />
              Domains
            </Button>
            <Button
              onClick={() => setActiveTab("subdomains")}
              className={cn(activeTab === "subdomains" ? "btn-gradient" : "btn-outline-primary")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Subdomains
            </Button>
            <Button
              onClick={() => setActiveTab("dns")}
              className={cn(activeTab === "dns" ? "btn-gradient" : "btn-outline-primary")}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              DNS Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeTab === "domains" && (
        <>
          {/* Add New Domain */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Plus className="w-5 h-5 text-primary" />
                <span>Add New Domain</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="domainName" className="block text-sm font-medium text-muted-foreground mb-2">
                  Domain Name
                </label>
                <Input
                  id="domainName"
                  placeholder="e.g., yournewsite.com"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="domainType" className="block text-sm font-medium text-muted-foreground mb-2">
                  Domain Type
                </label>
                <Select value={newDomainType} onValueChange={(value) => setNewDomainType(value as Domain["type"])}>
                  <SelectTrigger id="domainType" className="input-field">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Primary" className="hover:bg-muted/50">
                      Primary
                    </SelectItem>
                    <SelectItem value="Addon" className="hover:bg-muted/50">
                      Addon
                    </SelectItem>
                    <SelectItem value="Subdomain" className="hover:bg-muted/50">
                      Subdomain
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddDomain} disabled={isLoading} className="btn-gradient">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Add Domain
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Domains */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <Globe className="w-5 h-5 text-primary" />
                <span>Existing Domains</span>
                <Button onClick={fetchDomains} disabled={isLoading} className="btn-outline-primary">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span className="sr-only">Refresh</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Domain Name</th>
                      <th className="p-4 font-medium table-header">Type</th>
                      <th className="p-4 font-medium table-header">Status</th>
                      <th className="p-4 font-medium table-header">Expiry Date</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.length === 0 && !isLoading ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                          No domains found.
                        </td>
                      </tr>
                    ) : (
                      domains.map((domain, index) => (
                        <tr
                          key={domain.id}
                          className="table-row animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="p-4 font-medium text-foreground">{domain.name}</td>
                          <td className="p-4 text-muted-foreground">{domain.type}</td>
                          <td className="p-4">{getStatusIcon(domain.status)}</td>
                          <td className="p-4 text-muted-foreground">{domain.expiry}</td>
                          <td className="p-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteDomain(domain.id)}
                              disabled={isLoading}
                              className="btn-outline-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "subdomains" && (
        <>
          {/* Create Subdomain */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Create Subdomain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Subdomain name"
                  value={newSubdomainForm.name}
                  onChange={(e) => setNewSubdomainForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                />
                <select
                  value={newSubdomainForm.domain}
                  onChange={(e) => setNewSubdomainForm((prev) => ({ ...prev, domain: e.target.value }))}
                  className="input-field"
                >
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.name} className="bg-dark-blue-800">
                      {domain.name}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Document root"
                  value={newSubdomainForm.documentRoot}
                  onChange={(e) => setNewSubdomainForm((prev) => ({ ...prev, documentRoot: e.target.value }))}
                  className="input-field"
                />
                <Button onClick={createSubdomain} className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subdomains List */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Subdomains</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Subdomain</th>
                      <th className="p-4 font-medium table-header">Full Domain</th>
                      <th className="p-4 font-medium table-header">Document Root</th>
                      <th className="p-4 font-medium table-header">Created</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subdomains.map((subdomain, index) => (
                      <tr
                        key={subdomain.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{subdomain.name}</td>
                        <td className="p-4 text-accent-blue">
                          {subdomain.name}.{subdomain.domain}
                        </td>
                        <td className="p-4 text-muted-foreground font-mono text-sm">{subdomain.documentRoot}</td>
                        <td className="p-4 text-muted-foreground">{subdomain.created}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
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
        </>
      )}

      {activeTab === "dns" && (
        <Card className="custom-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Globe className="w-5 h-5 text-primary" />
              <span>DNS Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50">
                  <tr className="text-left">
                    <th className="p-4 font-medium table-header">Type</th>
                    <th className="p-4 font-medium table-header">Name</th>
                    <th className="p-4 font-medium table-header">Value</th>
                    <th className="p-4 font-medium table-header">TTL</th>
                    <th className="p-4 font-medium table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dnsRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className="table-row animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-4">
                        <Badge className="bg-accent-blue/20 text-accent-blue font-mono">{record.type}</Badge>
                      </td>
                      <td className="p-4 font-medium text-foreground">{record.name}</td>
                      <td className="p-4 text-muted-foreground font-mono text-sm">{record.value}</td>
                      <td className="p-4 text-muted-foreground">{record.ttl}s</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                            <Plus className="w-4 h-4" />
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
      )}
    </div>
  )
}
