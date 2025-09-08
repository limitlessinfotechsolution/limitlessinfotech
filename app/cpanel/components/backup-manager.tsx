"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Upload, Trash2, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Backup {
  id: string
  type: string
  date: string
  size: string
  status: "completed" | "in_progress" | "failed"
  downloadLink: string | null
}

export default function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [newBackupType, setNewBackupType] = useState("Full Website")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchBackups = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/backups")
      const data = await response.json()
      if (data.success) {
        setBackups(data.backups)
      } else {
        throw new Error(data.error || "Failed to fetch backups.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load backups.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const handleCreateBackup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", type: newBackupType }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Backup initiated. It may take a few moments to complete." })
        // Optimistically add the new backup to the list
        setBackups((prev) => [data.backup, ...prev])
        // Re-fetch after a delay to get updated status
        setTimeout(fetchBackups, 5000)
      } else {
        throw new Error(data.error || "Failed to initiate backup.")
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

  const handleDeleteBackup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this backup? This action cannot be undone.")) {
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Backup deleted successfully." })
        setBackups((prev) => prev.filter((backup) => backup.id !== id))
      } else {
        throw new Error(data.error || "Failed to delete backup.")
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

  const handleRestoreBackup = async (id: string) => {
    if (!confirm("Are you sure you want to restore from this backup? This will overwrite current data.")) {
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", id }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Backup restoration initiated. This may take some time." })
        // Optionally, refresh after a longer delay or show a progress indicator
      } else {
        throw new Error(data.error || "Failed to initiate restore.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred during restore.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Backup */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Upload className="w-5 h-5 text-primary" />
            <span>Create New Backup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="backupType" className="block text-sm font-medium text-muted-foreground mb-2">
              Backup Type
            </label>
            <Select value={newBackupType} onValueChange={setNewBackupType}>
              <SelectTrigger id="backupType" className="input-field">
                <SelectValue placeholder="Select backup type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Full Website" className="hover:bg-muted/50">
                  Full Website
                </SelectItem>
                <SelectItem value="Home Directory" className="hover:bg-muted/50">
                  Home Directory
                </SelectItem>
                <SelectItem value="Database Only" className="hover:bg-muted/50">
                  Database Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateBackup} disabled={isLoading} className="btn-gradient">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" /> Create Backup
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Backups */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <Download className="w-5 h-5 text-primary" />
            <span>Existing Backups</span>
            <Button onClick={fetchBackups} disabled={isLoading} className="btn-outline-primary">
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
                  <th className="p-4 font-medium table-header">Type</th>
                  <th className="p-4 font-medium table-header">Date</th>
                  <th className="p-4 font-medium table-header">Size</th>
                  <th className="p-4 font-medium table-header">Status</th>
                  <th className="p-4 font-medium table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No backups found.
                    </td>
                  </tr>
                ) : (
                  backups.map((backup, index) => (
                    <tr
                      key={backup.id}
                      className="table-row animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-4 font-medium text-foreground">{backup.type}</td>
                      <td className="p-4 text-muted-foreground">{new Date(backup.date).toLocaleString()}</td>
                      <td className="p-4 text-muted-foreground">{backup.size}</td>
                      <td className="p-4">
                        <Badge
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            backup.status === "completed"
                              ? "bg-accent-green/20 text-accent-green"
                              : backup.status === "in_progress"
                                ? "bg-accent-blue/20 text-accent-blue"
                                : "bg-destructive/20 text-destructive",
                          )}
                        >
                          {backup.status.replace("_", " ")}
                          {backup.status === "in_progress" && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            disabled={backup.status !== "completed"}
                            className="btn-outline-primary bg-transparent"
                          >
                            <a href={backup.downloadLink || "#"} download>
                              <Download className="w-4 h-4" />
                              <span className="sr-only">Download</span>
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestoreBackup(backup.id)}
                            disabled={backup.status !== "completed" || isLoading}
                            className="btn-outline-primary"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span className="sr-only">Restore</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBackup(backup.id)}
                            disabled={isLoading}
                            className="btn-outline-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
