"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, ExternalLink } from "lucide-react"

interface Subdomain {
  id: string
  name: string
  domain: string
  documentRoot: string
  created: string
  status: "active" | "pending" | "disabled"
}

const mockSubdomains: Subdomain[] = [
  {
    id: "1",
    name: "api",
    domain: "limitless.com",
    documentRoot: "/public_html/api",
    created: "2024-01-10",
    status: "active",
  },
  {
    id: "2",
    name: "blog",
    domain: "limitless.com",
    documentRoot: "/public_html/blog",
    created: "2024-01-12",
    status: "active",
  },
  {
    id: "3",
    name: "staging",
    domain: "limitless.com",
    documentRoot: "/public_html/staging",
    created: "2024-01-08",
    status: "disabled",
  },
  {
    id: "4",
    name: "dev",
    domain: "limitlessinfotech.com",
    documentRoot: "/public_html/dev",
    created: "2024-01-05",
    status: "active",
  },
]

export default function SubdomainManager() {
  const [subdomains, setSubdomains] = useState<Subdomain[]>(mockSubdomains)
  const [newSubdomainForm, setNewSubdomainForm] = useState({
    name: "",
    domain: "limitless.com",
    documentRoot: "/public_html/",
  })

  const createSubdomain = () => {
    if (newSubdomainForm.name.trim()) {
      const newSubdomain: Subdomain = {
        id: Date.now().toString(),
        name: newSubdomainForm.name,
        domain: newSubdomainForm.domain,
        documentRoot: newSubdomainForm.documentRoot,
        created: new Date().toISOString().split("T")[0],
        status: "active",
      }
      setSubdomains([...subdomains, newSubdomain])
      setNewSubdomainForm({ name: "", domain: "limitless.com", documentRoot: "/public_html/" })
    }
  }

  const deleteSubdomain = (id: string) => {
    setSubdomains(subdomains.filter((subdomain) => subdomain.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent-green/20 text-accent-green"
      case "pending":
        return "bg-accent-orange/20 text-accent-orange"
      case "disabled":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Subdomain Manager Header */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <ExternalLink className="w-5 h-5 text-primary" />
            <span>Subdomain Manager</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Create Subdomain */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="text-foreground">Create New Subdomain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Subdomain name (e.g., blog)"
              value={newSubdomainForm.name}
              onChange={(e) => setNewSubdomainForm((prev) => ({ ...prev, name: e.target.value }))}
              className="input-field"
            />
            <select
              value={newSubdomainForm.domain}
              onChange={(e) => setNewSubdomainForm((prev) => ({ ...prev, domain: e.target.value }))}
              className="input-field"
            >
              <option value="limitless.com">limitless.com</option>
              <option value="limitlessinfotech.com">limitlessinfotech.com</option>
              <option value="limitless.dev">limitless.dev</option>
            </select>
            <Input
              placeholder="Document root (e.g., /public_html/blog)"
              value={newSubdomainForm.documentRoot}
              onChange={(e) => setNewSubdomainForm((prev) => ({ ...prev, documentRoot: e.target.value }))}
              className="input-field"
            />
            <Button onClick={createSubdomain} className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Create Subdomain
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subdomains List */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="text-foreground">Existing Subdomains</CardTitle>
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
                  <th className="p-4 font-medium table-header">Status</th>
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
                      <Badge className={getStatusColor(subdomain.status)}>{subdomain.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSubdomain(subdomain.id)}
                          className="hover:bg-destructive/10 text-destructive"
                        >
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

      {/* Subdomain Statistics */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="text-foreground">Subdomain Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-blue">{subdomains.length}</div>
              <div className="text-muted-foreground">Total Subdomains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-green">
                {subdomains.filter((s) => s.status === "active").length}
              </div>
              <div className="text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {subdomains.filter((s) => s.status === "disabled").length}
              </div>
              <div className="text-muted-foreground">Disabled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
