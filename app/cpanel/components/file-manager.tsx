"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Folder, FileText, Upload, Plus, Trash2, RefreshCw, Loader2, ArrowLeft } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  path: string
  size: string
  type: "file" | "directory"
  lastModified: string
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState("/")
  const [newFolderName, setNewFolderName] = useState("")
  const [newFileName, setNewFileName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchFiles = async (path: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/cpanel/files?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      if (data.success) {
        setFiles(data.files)
        setCurrentPath(data.currentPath)
      } else {
        throw new Error(data.error || "Failed to fetch files.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load files.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles("/")
  }, [])

  const handleNavigate = (path: string) => {
    fetchFiles(path)
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: "Error", description: "Folder name is required.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", name: newFolderName, path: currentPath, type: "directory" }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Folder created successfully." })
        setNewFolderName("")
        fetchFiles(currentPath) // Refresh current directory
      } else {
        throw new Error(data.error || "Failed to create folder.")
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

  const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      toast({ title: "Error", description: "File name is required.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", name: newFileName, path: currentPath, type: "file" }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "File created successfully." })
        setNewFileName("")
        fetchFiles(currentPath) // Refresh current directory
      } else {
        throw new Error(data.error || "Failed to create file.")
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

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({ title: "Error", description: "No file selected for upload.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("path", currentPath)

      const response = await fetch("/api/cpanel/files", {
        method: "POST",
        body: formData, // No Content-Type header needed for FormData
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "File uploaded successfully." })
        setSelectedFile(null)
        fetchFiles(currentPath) // Refresh current directory
      } else {
        throw new Error(data.error || "Failed to upload file.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred during upload.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Item deleted successfully." })
        fetchFiles(currentPath) // Refresh current directory
      } else {
        throw new Error(data.error || "Failed to delete item.")
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
      {/* Current Path & Navigation */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Folder className="w-5 h-5 text-primary" />
            <span>File Manager</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            {currentPath !== "/" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleNavigate(currentPath.substring(0, currentPath.lastIndexOf("/")) || "/")}
                className="hover:bg-muted/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Go Up</span>
              </Button>
            )}
            <span className="font-mono text-sm text-foreground">{currentPath}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => fetchFiles(currentPath)} disabled={isLoading} className="btn-outline-primary">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="sr-only">Refresh</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="New folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="input-field w-48"
              />
              <Button onClick={handleCreateFolder} disabled={isLoading} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" /> Folder
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="New file name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="input-field w-48"
              />
              <Button onClick={handleCreateFile} disabled={isLoading} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" /> File
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="input-field w-48 file:text-primary"
              />
              <Button onClick={handleFileUpload} disabled={isLoading || !selectedFile} className="btn-gradient">
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="text-foreground">Contents of {currentPath}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr className="text-left">
                  <th className="p-4 font-medium table-header">Name</th>
                  <th className="p-4 font-medium table-header">Type</th>
                  <th className="p-4 font-medium table-header">Size</th>
                  <th className="p-4 font-medium table-header">Last Modified</th>
                  <th className="p-4 font-medium table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      This directory is empty.
                    </td>
                  </tr>
                ) : (
                  files.map((item, index) => (
                    <tr
                      key={item.id}
                      className="table-row animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-4">
                        <Button
                          variant="link"
                          onClick={() => item.type === "directory" && handleNavigate(item.path)}
                          className={cn(
                            "p-0 h-auto text-primary hover:text-primary/80 flex items-center space-x-2",
                            item.type === "file" && "cursor-default hover:no-underline",
                          )}
                        >
                          {item.type === "directory" ? (
                            <Folder className="w-5 h-5 text-accent-blue" />
                          ) : (
                            <FileText className="w-5 h-5 text-accent-green" />
                          )}
                          <span className="font-medium">{item.name}</span>
                        </Button>
                      </td>
                      <td className="p-4 text-muted-foreground capitalize">{item.type}</td>
                      <td className="p-4 text-muted-foreground">{item.size}</td>
                      <td className="p-4 text-muted-foreground">
                        {item.lastModified ? new Date(item.lastModified).toLocaleString() : "N/A"}
                      </td>
                      <td className="p-4">
                        {item.name !== ".." && ( // Prevent deleting ".."
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFile(item.id)}
                            disabled={isLoading}
                            className="btn-outline-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
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
