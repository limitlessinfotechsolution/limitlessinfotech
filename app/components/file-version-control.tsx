"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Download, Upload, UndoIcon as Rollback, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileVersion {
  id: string
  version: string
  timestamp: string
  author: string
  changes: string
  size: string
  downloadLink: string
}

const mockFileVersions: FileVersion[] = [
  {
    id: "v1",
    version: "1.0",
    timestamp: "2024-07-10T14:30:00Z",
    author: "John Doe",
    changes: "Initial commit of homepage layout.",
    size: "120 KB",
    downloadLink: "/api/files/versions/v1",
  },
  {
    id: "v2",
    version: "1.1",
    timestamp: "2024-07-10T16:00:00Z",
    author: "Jane Smith",
    changes: "Added contact form section.",
    size: "135 KB",
    downloadLink: "/api/files/versions/v2",
  },
  {
    id: "v3",
    version: "1.2",
    timestamp: "2024-07-11T09:15:00Z",
    author: "John Doe",
    changes: "Updated hero section text and image.",
    size: "140 KB",
    downloadLink: "/api/files/versions/v3",
  },
  {
    id: "v4",
    version: "1.3",
    timestamp: "2024-07-11T11:00:00Z",
    author: "Alex Martinez",
    changes: "Fixed responsive issues on mobile devices.",
    size: "138 KB",
    downloadLink: "/api/files/versions/v4",
  },
]

interface FileVersionControlProps {
  filePath: string
}

export function FileVersionControl({ filePath }: FileVersionControlProps) {
  const [versions, setVersions] = useState<FileVersion[]>(mockFileVersions)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchFileVersions = async () => {
    setIsLoading(true)
    try {
      // In a real application, this would fetch versions for the given filePath
      // const response = await fetch(`/api/files/versions?path=${encodeURIComponent(filePath)}`);
      // const data = await response.json();
      // if (data.success) {
      //   setVersions(data.versions);
      // } else {
      //   throw new Error(data.error || "Failed to fetch file versions.");
      // }
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      setVersions(mockFileVersions) // Using mock data
      toast({ title: "Success!", description: "File versions refreshed." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load file versions.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRollback = async (versionId: string) => {
    if (
      !confirm(
        `Are you sure you want to rollback to version ${versionId}? This action will overwrite the current file.`,
      )
    ) {
      return
    }
    setIsLoading(true)
    try {
      // Simulate API call to rollback
      // const response = await fetch(`/api/files/rollback`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ filePath, versionId }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   toast({ title: "Success!", description: `Rolled back to version ${versionId}.` });
      //   fetchFileVersions(); // Refresh versions after rollback
      // } else {
      //   throw new Error(data.error || "Failed to rollback file.");
      // }
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      toast({ title: "Success!", description: `Rolled back to version ${versionId}.` })
      fetchFileVersions() // Refresh versions after rollback
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred during rollback.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadNewVersion = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      // Simulate file upload for a new version
      // In a real app, this would upload the file and create a new version entry
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate upload time
      const newVersion: FileVersion = {
        id: `v${versions.length + 1}`,
        version: `1.${versions.length + 1}`,
        timestamp: new Date().toISOString(),
        author: "Current User", // Replace with actual user
        changes: `Uploaded new version: ${file.name}`,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        downloadLink: `/api/files/versions/v${versions.length + 1}`,
      }
      setVersions((prev) => [newVersion, ...prev])
      toast({ title: "Success!", description: "New version uploaded." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload new version.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="custom-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary" />
            <span>File Version Control</span>
          </span>
          <Button onClick={fetchFileVersions} disabled={isLoading} className="btn-outline-primary">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
            <span className="sr-only">Refresh Versions</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
          <p className="text-muted-foreground font-mono text-sm">
            Current File: <span className="text-foreground font-medium">{filePath}</span>
          </p>
          <div className="flex space-x-2">
            <Button asChild className="btn-gradient">
              <label htmlFor="upload-new-version" className="cursor-pointer flex items-center">
                <Upload className="w-4 h-4 mr-2" /> Upload New Version
                <input
                  id="upload-new-version"
                  type="file"
                  className="sr-only"
                  onChange={handleUploadNewVersion}
                  disabled={isLoading}
                />
              </label>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              <tr className="text-left">
                <th className="p-4 font-medium table-header">Version</th>
                <th className="p-4 font-medium table-header">Timestamp</th>
                <th className="p-4 font-medium table-header">Author</th>
                <th className="p-4 font-medium table-header">Changes</th>
                <th className="p-4 font-medium table-header">Size</th>
                <th className="p-4 font-medium table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {versions.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No versions found for this file.
                  </td>
                </tr>
              ) : (
                versions.map((version, index) => (
                  <tr
                    key={version.id}
                    className="table-row animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4 font-medium text-foreground">{version.version}</td>
                    <td className="p-4 text-muted-foreground">{new Date(version.timestamp).toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">{version.author}</td>
                    <td className="p-4 text-muted-foreground">{version.changes}</td>
                    <td className="p-4 text-muted-foreground">{version.size}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild className="btn-outline-primary bg-transparent">
                          <a href={version.downloadLink} download>
                            <Download className="w-4 h-4" />
                            <span className="sr-only">Download</span>
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRollback(version.id)}
                          disabled={isLoading}
                          className="btn-outline-primary"
                        >
                          <Rollback className="w-4 h-4" />
                          <span className="sr-only">Rollback</span>
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
  )
}
