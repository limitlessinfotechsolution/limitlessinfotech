"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Monitor,
  MessageSquare,
  Star,
  Send,
  Eye,
  Clock,
  User,
  ArrowLeft,
  Smartphone,
  Tablet,
  Laptop,
  ExternalLink,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import RealTimeChat from "@/app/components/real-time-chat"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/database" // Import Supabase client

interface DemoProject {
  id: string
  client_id: string
  title: string
  description: string
  status: "development" | "review" | "approved" | "revision"
  preview_url: string
  mobile_url: string
  tablet_url: string
  desktop_url: string
  last_updated: string
  version: string
  technologies: string[]
}

interface Comment {
  id: string
  project_id: string
  author_id: string
  content: string
  timestamp: string
  type: "feedback" | "approval" | "revision" | "question"
  rating?: number
  resolved: boolean
  author_name?: string // Added for display
}

interface ClientSession {
  id: string
  client_id: string
  name: string
  email: string
  company: string // Assuming company is part of user data or derived
  projects: string[] // List of project IDs associated with this client
}

export default function DemoPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [currentClient, setCurrentClient] = useState<ClientSession | null>(null)
  const [selectedProject, setSelectedProject] = useState<DemoProject | null>(null)
  const [projects, setProjects] = useState<DemoProject[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentType, setCommentType] = useState<"feedback" | "approval" | "revision" | "question">("feedback")
  const [rating, setRating] = useState(0)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const { toast } = useToast()
  const [showChat, setShowChat] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserData = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const { user } = await res.json()
        setCurrentClient({
          id: user.id,
          client_id: user.client_id,
          name: user.name,
          email: user.email,
          company: user.company || "Client Company", // Default company
          projects: [], // Will be populated by fetchProjects
        })
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.push("/") // Redirect to home/login if not authenticated
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      setIsAuthenticated(false)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchProjects = useCallback(
    async (token: string, clientId: string) => {
      try {
        const res = await fetch(`/api/projects?clientId=${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setProjects(data)
          if (data.length > 0) {
            setSelectedProject(data[0]) // Select the first project by default
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch projects.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast({
          title: "Error",
          description: "Network error fetching projects.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const fetchComments = useCallback(
    async (token: string, projectId: string) => {
      try {
        const res = await fetch(`/api/comments?projectId=${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          // Fetch author names for comments
          const commentsWithAuthors = await Promise.all(
            data.map(async (comment: Comment) => {
              const userRes = await fetch(`/api/users?userId=${comment.author_id}`, {
                // Assuming a /api/users?userId= endpoint
                headers: { Authorization: `Bearer ${token}` },
              })
              const userData = userRes.ok ? await userRes.json() : null
              return { ...comment, author_name: userData?.name || "Unknown User" }
            }),
          )
          setComments(commentsWithAuthors)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch comments.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Network error fetching comments.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  useEffect(() => {
    if (isAuthenticated && currentClient) {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]
      if (token && currentClient.client_id) {
        fetchProjects(token, currentClient.client_id)
      }
    }
  }, [isAuthenticated, currentClient, fetchProjects])

  useEffect(() => {
    if (selectedProject && isAuthenticated) {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]
      if (token) {
        fetchComments(token, selectedProject.id)

        // Supabase Realtime for Comments
        const commentChannel = supabase
          .channel(`project_comments_${selectedProject.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "comments",
              filter: `project_id=eq.${selectedProject.id}`,
            },
            async (payload) => {
              const changedComment = payload.new as Comment
              // Fetch author name for the new/updated comment
              const userRes = await fetch(`/api/users?userId=${changedComment.author_id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              const userData = userRes.ok ? await userRes.json() : null
              const commentWithAuthor = { ...changedComment, author_name: userData?.name || "Unknown User" }

              setComments((prevComments) => {
                const existingIndex = prevComments.findIndex((c) => c.id === commentWithAuthor.id)
                if (existingIndex > -1) {
                  // Update existing comment
                  return prevComments.map((c, i) => (i === existingIndex ? commentWithAuthor : c))
                } else {
                  // Add new comment (prepend to show newest first)
                  return [commentWithAuthor, ...prevComments]
                }
              })
              toast({
                title: "New Feedback!",
                description: `A new comment was added to this project.`,
              })
            },
          )
          .subscribe()

        return () => {
          supabase.removeChannel(commentChannel)
        }
      }
    }
  }, [selectedProject, isAuthenticated, fetchComments, toast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      })

      if (res.ok) {
        const { user } = await res.json()
        setCurrentClient({
          id: user.id,
          client_id: user.client_id,
          name: user.name,
          email: user.email,
          company: user.company || "Client Company",
          projects: [], // Will be populated by fetchProjects
        })
        setIsAuthenticated(true)
        toast({
          title: "Welcome!",
          description: "Successfully logged into demo portal",
        })
      } else {
        const { error } = await res.json()
        toast({
          title: "Login Failed",
          description: error || "Invalid credentials. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Network error during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })
      if (res.ok) {
        setIsAuthenticated(false)
        setCurrentClient(null)
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        })
        router.push("/")
      } else {
        toast({
          title: "Logout Failed",
          description: "Could not log out. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Network error during logout. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const addComment = async () => {
    if (!newComment.trim() || !selectedProject) return

    setLoading(true)
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]
      if (!token) {
        toast({ title: "Error", description: "Authentication token missing.", variant: "destructive" })
        return
      }

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          content: newComment,
          type: commentType,
          rating: commentType === "approval" ? rating : undefined,
        }),
      })

      if (res.ok) {
        // Comment will be added via Realtime subscription, no need to manually update state here
        setNewComment("")
        setRating(0)
        toast({
          title: "Comment Added",
          description: "Your feedback has been submitted to the development team",
        })
      } else {
        const { error } = await res.json()
        toast({
          title: "Error",
          description: error || "Failed to add comment.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Network error adding comment.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "development":
        return "bg-blue-500/20 text-blue-300"
      case "review":
        return "bg-yellow-500/20 text-yellow-300"
      case "approved":
        return "bg-green-500/20 text-green-300"
      case "revision":
        return "bg-orange-500/20 text-orange-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getCommentIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <ThumbsUp className="w-4 h-4 text-green-400" />
      case "revision":
        return <AlertCircle className="w-4 h-4 text-orange-400" />
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-blue-400" />
      case "question":
        return <AlertCircle className="w-4 h-4 text-purple-400" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />
    }
  }

  const getViewIcon = (view: string) => {
    switch (view) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />
      case "tablet":
        return <Tablet className="w-4 h-4" />
      case "desktop":
        return <Laptop className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
        <p className="ml-3 text-lg">Loading Client Demo Portal...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Image src="/images/logo.png" alt="Limitless" width={40} height={40} />
                <div>
                  <h1 className="text-xl font-bold">CLIENT DEMO PORTAL</h1>
                  <p className="text-xs text-blue-300">Project Preview & Feedback</p>
                </div>
              </div>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Monitor className="w-5 h-5" />
                <span>Client Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-white/5 border-white/10 focus:border-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="bg-white/5 border-white/10 focus:border-blue-500/50"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
                  Access Demo Portal
                </Button>
              </form>
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: client@example.com
                  <br />
                  Password: secret
                </p>
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-blue-300 hover:text-blue-200 text-sm flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const projectComments = comments.filter((comment) => comment.project_id === selectedProject?.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-blue-300 hover:text-blue-200">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Image src="/images/logo.png" alt="Limitless" width={32} height={32} />
              <h1 className="text-2xl font-bold">Demo Portal</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="font-medium">{currentClient?.name}</div>
              <div className="text-sm text-gray-400">{currentClient?.company}</div>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <User className="w-3 h-3 mr-1" />
              {currentClient?.client_id}
            </Badge>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-300 hover:bg-red-500/10"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Project Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProject(project)}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      selectedProject?.id === project.id
                        ? "bg-blue-500/20 border-blue-500/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{project.title}</h3>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{project.version}</span>
                      <span>{new Date(project.last_updated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <Badge key={tech} className="bg-gray-500/20 text-gray-300 text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 2 && (
                        <Badge className="bg-gray-500/20 text-gray-300 text-xs">
                          +{project.technologies.length - 2}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Preview Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-6">
            {selectedProject && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedProject.title}</CardTitle>
                      <p className="text-gray-400 mt-1">{selectedProject.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewMode("mobile")}
                        className={`${viewMode === "mobile" ? "bg-blue-500/20" : ""}`}
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewMode("tablet")}
                        className={`${viewMode === "tablet" ? "bg-blue-500/20" : ""}`}
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewMode("desktop")}
                        className={`${viewMode === "desktop" ? "bg-blue-500/20" : ""}`}
                      >
                        <Laptop className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="hover:bg-white/10">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center h-full p-8">
                      <div
                        className={`bg-white rounded-lg shadow-2xl overflow-hidden ${
                          viewMode === "mobile"
                            ? "w-80 h-[600px]"
                            : viewMode === "tablet"
                              ? "w-[600px] h-[450px]"
                              : "w-full h-[500px]"
                        }`}
                      >
                        <div className="bg-gray-100 p-2 flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                          </div>
                          <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                            {selectedProject.preview_url}
                          </div>
                        </div>
                        <div className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                          <div className="text-center text-gray-600">
                            <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold mb-2">{selectedProject.title}</h3>
                            <p className="text-sm">Live Preview ({viewMode})</p>
                            <div className="mt-4 space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded mx-auto" />
                              <div className="w-24 h-4 bg-gray-200 rounded mx-auto" />
                              <div className="w-28 h-4 bg-gray-200 rounded mx-auto" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Comments & Feedback */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <select
                      value={commentType}
                      onChange={(e) =>
                        setCommentType(e.target.value as "feedback" | "approval" | "revision" | "question")
                      }
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:border-blue-500/50 focus:outline-none text-white text-sm"
                    >
                      <option value="feedback" className="bg-slate-800">
                        💬 Feedback
                      </option>
                      <option value="approval" className="bg-slate-800">
                        👍 Approval
                      </option>
                      <option value="revision" className="bg-slate-800">
                        🔄 Revision
                      </option>
                      <option value="question" className="bg-slate-800">
                        ❓ Question
                      </option>
                    </select>
                  </div>

                  {commentType === "approval" && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`${star <= rating ? "text-yellow-400" : "text-gray-600"}`}
                        >
                          <Star className="w-4 h-4" fill={star <= rating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  )}

                  <Textarea
                    placeholder="Share your feedback, suggestions, or questions..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-white/5 border-white/10 resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={addComment}
                    disabled={!newComment.trim() || loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Submit Feedback
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {projectComments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCommentIcon(comment.type)}
                          <span className="text-sm font-medium">{comment.author_name || "Loading..."}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {comment.rating && (
                            <div className="flex items-center space-x-1">
                              {[...Array(comment.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" />
                              ))}
                            </div>
                          )}
                          <Badge
                            className={
                              comment.resolved ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"
                            }
                          >
                            {comment.resolved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{comment.content}</p>
                      <div className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* Real-time Chat */}
        <RealTimeChat
          currentUserId={currentClient?.id || ""}
          isMinimized={!showChat}
          onToggleMinimize={() => setShowChat(!showChat)}
        />
      </div>
    </div>
  )
}
