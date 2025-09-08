"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Key, Plus, Trash2, Copy, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ApiKey {
  id: string
  key: string
  name: string
  status: "active" | "inactive"
  permissions: string[]
  lastUsed: string
}

const mockApiKeys: ApiKey[] = [
  {
    id: "key_1",
    key: "sk-xxxxxxxxxxxxxxxxxxxx1",
    name: "Website Frontend",
    status: "active",
    permissions: ["read:users", "write:contact"],
    lastUsed: "2024-07-10T14:30:00Z",
  },
  {
    id: "key_2",
    key: "sk-xxxxxxxxxxxxxxxxxxxx2",
    name: "Mobile App Backend",
    status: "active",
    permissions: ["read:projects", "write:tasks", "delete:tasks"],
    lastUsed: "2024-07-11T09:00:00Z",
  },
  {
    id: "key_3",
    key: "sk-xxxxxxxxxxxxxxxxxxxx3",
    name: "Internal Analytics",
    status: "inactive",
    permissions: ["read:analytics"],
    lastUsed: "2024-06-01T10:00:00Z",
  },
]

export default function APIManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [newKeyName, setNewKeyName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const generateApiKey = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = "sk-"
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast({ title: "Error", description: "Please enter a name for the API key.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      // Simulate API call
      const generatedKey = generateApiKey()
      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        key: generatedKey,
        name: newKeyName.trim(),
        status: "active",
        permissions: ["default:read"], // Default permissions
        lastUsed: "Never",
      }
      // In a real app, this would be stored in a database
      setApiKeys((prev) => [...prev, newKey])
      setNewKeyName("")
      toast({ title: "Success!", description: "New API key generated and added." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate API key.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({ title: "Copied!", description: "API key copied to clipboard." })
  }

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return
    }
    setIsLoading(true)
    try {
      // Simulate API call
      // In a real app, this would delete from a database
      setApiKeys((prev) => prev.filter((key) => key.id !== id))
      toast({ title: "Success!", description: "API key deleted." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete API key.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: "active" | "inactive") => {
    setIsLoading(true)
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      // Simulate API call to update status
      setApiKeys((prev) => prev.map((key) => (key.id === id ? { ...key, status: newStatus } : key)))
      toast({ title: "Success!", description: `API key status changed to ${newStatus}.` })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update API key status.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Generate New API Key */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Plus className="w-5 h-5 text-primary" />
            <span>Generate New API Key</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="newKeyName" className="block text-sm font-medium text-muted-foreground mb-2">
              Key Name
            </label>
            <Input
              id="newKeyName"
              placeholder="e.g., My Website API Key"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="input-field"
            />
          </div>
          <Button onClick={handleGenerateKey} disabled={isLoading} className="btn-gradient">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" /> Generate Key
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing API Keys */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Key className="w-5 h-5 text-primary" />
            <span>Manage API Keys</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr className="text-left">
                  <th className="p-4 font-medium table-header">Name</th>
                  <th className="p-4 font-medium table-header">API Key</th>
                  <th className="p-4 font-medium table-header">Permissions</th>
                  <th className="p-4 font-medium table-header">Status</th>
                  <th className="p-4 font-medium table-header">Last Used</th>
                  <th className="p-4 font-medium table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey, index) => (
                  <tr
                    key={apiKey.id}
                    className="table-row animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4 font-medium text-foreground">{apiKey.name}</td>
                    <td className="p-4 font-mono text-muted-foreground flex items-center space-x-2">
                      <span>
                        {apiKey.key.substring(0, 6)}...{apiKey.key.substring(apiKey.key.length - 4)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyKey(apiKey.key)}
                        className="hover:bg-muted/10"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="sr-only">Copy Key</span>
                      </Button>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {apiKey.permissions.map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="bg-muted/20 text-muted-foreground text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          apiKey.status === "active"
                            ? "bg-accent-green/20 text-accent-green"
                            : "bg-muted/20 text-muted-foreground",
                        )}
                      >
                        {apiKey.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {apiKey.lastUsed === "Never" ? "Never" : new Date(apiKey.lastUsed).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(apiKey.id, apiKey.status)}
                          className={cn(
                            "btn-outline-primary",
                            apiKey.status === "active" ? "text-destructive border-destructive/50" : "",
                          )}
                        >
                          {apiKey.status === "active" ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span className="sr-only">Toggle Status</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="btn-outline-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
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
    </div>
  )
}
