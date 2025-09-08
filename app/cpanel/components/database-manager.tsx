"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DatabaseItem {
  id: string
  name: string
  user: string
  size: string
  created: string
}

export default function DatabaseManager() {
  const [databases, setDatabases] = useState<DatabaseItem[]>([])
  const [newDbName, setNewDbName] = useState("")
  const [newDbUser, setNewDbUser] = useState("")
  const [newDbPassword, setNewDbPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchDatabases = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/databases")
      const data = await response.json()
      if (data.success) {
        setDatabases(data.databases)
      } else {
        throw new Error(data.error || "Failed to fetch databases.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load databases.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDatabases()
  }, [])

  const handleCreateDatabase = async () => {
    if (!newDbName.trim() || !newDbUser.trim() || !newDbPassword.trim()) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/databases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", name: newDbName, user: newDbUser, password: newDbPassword }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Database created successfully." })
        setDatabases((prev) => [...prev, data.database])
        setNewDbName("")
        setNewDbUser("")
        setNewDbPassword("")
      } else {
        throw new Error(data.error || "Failed to create database.")
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

  const handleDeleteDatabase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this database? This action cannot be undone.")) {
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/databases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Database deleted successfully." })
        setDatabases((prev) => prev.filter((db) => db.id !== id))
      } else {
        throw new Error(data.error || "Failed to delete database.")
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

  return (
    <div className="space-y-6">
      {/* Create New Database */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Plus className="w-5 h-5 text-primary" />
            <span>Create New Database</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="dbName" className="block text-sm font-medium text-muted-foreground mb-2">
              Database Name
            </label>
            <Input
              id="dbName"
              placeholder="e.g., my_website_db"
              value={newDbName}
              onChange={(e) => setNewDbName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="dbUser" className="block text-sm font-medium text-muted-foreground mb-2">
              Database User
            </label>
            <Input
              id="dbUser"
              placeholder="e.g., db_user"
              value={newDbUser}
              onChange={(e) => setNewDbUser(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="dbPassword" className="block text-sm font-medium text-muted-foreground mb-2">
              Password
            </label>
            <Input
              id="dbPassword"
              type="password"
              placeholder="Strong password"
              value={newDbPassword}
              onChange={(e) => setNewDbPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <Button onClick={handleCreateDatabase} disabled={isLoading} className="btn-gradient">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Create Database
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Databases */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <span className="w-5 h-5 text-primary">DB</span>
            <span>Existing Databases</span>
            <Button onClick={fetchDatabases} disabled={isLoading} className="btn-outline-primary">
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
                  <th className="p-4 font-medium table-header">Name</th>
                  <th className="p-4 font-medium table-header">User</th>
                  <th className="p-4 font-medium table-header">Size</th>
                  <th className="p-4 font-medium table-header">Created</th>
                  <th className="p-4 font-medium table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {databases.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No databases found.
                    </td>
                  </tr>
                ) : (
                  databases.map((db, index) => (
                    <tr
                      key={db.id}
                      className="table-row animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-4 font-medium text-foreground">{db.name}</td>
                      <td className="p-4 text-muted-foreground">{db.user}</td>
                      <td className="p-4 text-muted-foreground">{db.size}</td>
                      <td className="p-4 text-muted-foreground">{db.created}</td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDatabase(db.id)}
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

      {/* phpMyAdmin / Database Tools (Placeholder) */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <span className="w-5 h-5 text-primary">DB</span>
            <span>phpMyAdmin / Database Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Access advanced database management tools like phpMyAdmin. (Feature coming soon)
          </p>
          <Button className="btn-outline-primary mt-4" disabled>
            <span className="w-4 h-4 mr-2">DB</span> Launch phpMyAdmin
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
