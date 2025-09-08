"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Calendar,
  Bell,
  FileText,
  CheckSquare,
  MessageSquare,
  Share2,
  Clock,
  User,
  ArrowLeft,
  Plus,
  Search,
  Download,
  Upload,
  TrendingUp,
  AlertCircle,
  Eye,
  Edit,
  Send,
  Paperclip,
  Shield,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import RealTimeChat from "@/app/components/real-time-chat"
import ProjectTimeline from "@/app/components/project-timeline"
import ApprovalWorkflow from "@/app/components/approval-workflow"
import { useRouter } from "next/navigation"
import { supabase, DatabaseService, type Task, type Notification } from "@/lib/database" // Import Supabase client and types

interface Employee {
  id: string
  employee_code: string
  name: string
  email: string
  department: string
  role: string
  avatar: string // Assuming avatar is a string path or emoji
  status: "online" | "offline" | "busy"
  last_seen: string
}

interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  attendees: string[]
  organizer: string
  location: string
  type: "meeting" | "call" | "presentation" | "review"
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
}

interface EmployeeSession {
  id: string
  employee_code: string
  name: string
  email: string
  department: string
  role: string
  avatar: string
}

// Mock data for employees (these would ideally come from your DB)
const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    employee_code: "LIS001",
    name: "John Doe",
    email: "john@limitless.com",
    department: "Development",
    role: "Senior Developer",
    avatar: "👨‍💻",
    status: "online",
    last_seen: "Now",
  },
  {
    id: "EMP002",
    employee_code: "LIS002",
    name: "Sarah Smith",
    email: "sarah@limitless.com",
    department: "Design",
    role: "UI/UX Designer",
    avatar: "👩‍🎨",
    status: "busy",
    last_seen: "5 minutes ago",
  },
  {
    id: "EMP003",
    employee_code: "LIS003",
    name: "Mike Johnson",
    email: "mike@limitless.com",
    department: "Project Management",
    role: "Project Manager",
    avatar: "👨‍💼",
    status: "online",
    last_seen: "2 minutes ago",
  },
]

export default function EmployeePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeSession | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [tasks, setTasks] = useState<Task[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([]) // Still mock for now
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees) // Using mock for now, but could fetch from DB
  const [showNotifications, setShowNotifications] = useState(false)
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    dueDate: "",
    tags: "",
  })
  const { toast } = useToast()
  const [showChat, setShowChat] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserData = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const { user } = await res.json()
        setCurrentEmployee({
          id: user.id,
          employee_code: user.employee_code,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
          avatar: user.avatar || "👨‍💼", // Default avatar if not provided
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

  const fetchEmployees = useCallback(
    async (token: string) => {
      try {
        const res = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setEmployees(
            data.map((user: any) => ({
              id: user.id,
              employee_code: user.employee_code,
              name: user.name,
              email: user.email,
              department: user.department,
              role: user.role,
              avatar: user.avatar || "👤", // Default avatar
              status: "online", // Mock status for now
              last_seen: "Now", // Mock last seen
            })),
          )
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch employee list.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
        toast({
          title: "Error",
          description: "Network error fetching employees.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const fetchTasks = useCallback(
    async (token: string) => {
      try {
        const data = await DatabaseService.getTasksByAssignedTo(currentEmployee?.id || "")
        setTasks(data || [])
      } catch (error) {
        console.error("Error fetching tasks:", error)
        toast({
          title: "Error",
          description: "Failed to fetch tasks.",
          variant: "destructive",
        })
      }
    },
    [currentEmployee?.id, toast],
  )

  const fetchNotifications = useCallback(async () => {
    if (!currentEmployee?.id) return
    try {
      const data = await DatabaseService.getNotificationsByUserId(currentEmployee.id)
      setNotifications(data || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to load notifications.",
        variant: "destructive",
      })
    }
  }, [currentEmployee?.id, toast])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  useEffect(() => {
    if (isAuthenticated && currentEmployee) {
      // Fetch token from cookie for subsequent API calls
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]
      if (token) {
        fetchEmployees(token)
        fetchTasks(token)
        fetchNotifications()
      }
      // Mock meetings for now
      setMeetings([
        {
          id: "MEET001",
          title: "Daily Standup",
          description: "Daily team sync to discuss progress and blockers",
          date: "2024-01-16",
          time: "09:00",
          duration: "30 minutes",
          attendees: ["EMP001", "EMP002", "EMP003"],
          organizer: "EMP003",
          location: "Conference Room A",
          type: "meeting",
          status: "scheduled",
        },
        {
          id: "MEET002",
          title: "Client Presentation",
          description: "Present project progress to TechCorp Solutions",
          date: "2024-01-17",
          time: "14:00",
          duration: "1 hour",
          attendees: ["EMP001", "EMP002", "EMP003"],
          organizer: "EMP003",
          location: "Virtual - Zoom",
          type: "presentation",
          status: "scheduled",
        },
      ])

      // Supabase Realtime for Tasks
      const taskChannel = supabase
        .channel("public:tasks")
        .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
          const changedTask = payload.new as Task
          setTasks((prevTasks) => {
            const existingIndex = prevTasks.findIndex((t) => t.id === changedTask.id)
            if (existingIndex > -1) {
              // Update existing task
              return prevTasks.map((t, i) => (i === existingIndex ? changedTask : t))
            } else {
              // Add new task
              return [changedTask, ...prevTasks]
            }
          })
          toast({
            title: "Task Update!",
            description: `Task "${changedTask.title}" was ${payload.eventType}.`,
          })
        })
        .subscribe()

      // Supabase Realtime for Notifications
      const notificationChannel = supabase
        .channel(`user_notifications:${currentEmployee.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${currentEmployee.id}` },
          (payload) => {
            const changedNotification = payload.new as Notification
            setNotifications((prevNotifications) => {
              const existingIndex = prevNotifications.findIndex((n) => n.id === changedNotification.id)
              if (existingIndex > -1) {
                // Update existing notification
                return prevNotifications.map((n, i) => (i === existingIndex ? changedNotification : n))
              } else {
                // Add new notification
                return [changedNotification, ...prevNotifications]
              }
            })
            if (payload.eventType === "INSERT") {
              toast({
                title: "New Notification!",
                description: changedNotification.message,
              })
            }
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(taskChannel)
        supabase.removeChannel(notificationChannel)
      }
    }
  }, [isAuthenticated, currentEmployee, fetchEmployees, fetchTasks, fetchNotifications, toast])

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
        setCurrentEmployee({
          id: user.id,
          employee_code: user.employee_code,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
          avatar: user.avatar || "👨‍💼",
        })
        setIsAuthenticated(true)
        toast({
          title: "Welcome back!",
          description: "Successfully logged into employee dashboard",
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
        setCurrentEmployee(null)
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        })
        router.push("/")
      } else {
        toast({
          title: "Logout Failed",
          description: "Could not log out. Please try again.",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Network error during logout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createTask = async () => {
    if (!newTaskForm.title.trim() || !newTaskForm.assignedTo.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

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

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTaskForm.title,
          description: newTaskForm.description,
          assignedTo: [newTaskForm.assignedTo],
          priority: newTaskForm.priority,
          dueDate: newTaskForm.dueDate,
          tags: newTaskForm.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (res.ok) {
        // Task will be added via Realtime subscription, no need to manually update state here
        setNewTaskForm({
          title: "",
          description: "",
          assignedTo: "",
          priority: "medium",
          dueDate: "",
          tags: "",
        })
        toast({
          title: "Task Created",
          description: "New task has been assigned successfully",
        })

        // Optionally, create a notification for the assigned user
        await DatabaseService.createNotification({
          user_id: newTaskForm.assignedTo,
          type: "task",
          title: "New Task Assigned",
          message: `You have been assigned to task: "${newTaskForm.title}"`,
          action_url: "/employee?tab=tasks",
          read: false,
          timestamp: new Date().toISOString(),
        })
      } else {
        const { error } = await res.json()
        toast({
          title: "Error",
          description: error || "Failed to create task.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Network error creating task.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      // Optimistic update
      setNotifications(notifications.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))

      const updated = await DatabaseService.updateNotification(notificationId, { read: true })
      if (!updated) {
        // Revert if update failed
        setNotifications(
          notifications.map((notif) => (notif.id === notificationId ? { ...notif, read: false } : notif)),
        )
        toast({
          title: "Error",
          description: "Failed to mark notification as read.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // Revert if network error
      setNotifications(notifications.map((notif) => (notif.id === notificationId ? { ...notif, read: false } : notif)))
      toast({
        title: "Error",
        description: "Network error marking notification as read.",
        variant: "destructive",
      })
    }
  }

  const unreadNotifications = notifications.filter((notif) => !notif.read)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-300"
      case "high":
        return "bg-orange-500/20 text-orange-300"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300"
      case "low":
        return "bg-green-500/20 text-green-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300"
      case "in-progress":
        return "bg-blue-500/20 text-blue-300"
      case "review":
        return "bg-purple-500/20 text-purple-300"
      case "pending":
        return "bg-gray-500/20 text-gray-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "busy":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case "offline":
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
        <p className="ml-3 text-lg">Loading Employee Portal...</p>
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
                  <h1 className="text-xl font-bold">EMPLOYEE PORTAL</h1>
                  <p className="text-xs text-blue-300">Team Collaboration Hub</p>
                </div>
              </div>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Employee Login</span>
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
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                  Access Employee Portal
                </Button>
              </form>
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: admin@example.com
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
              <h1 className="text-2xl font-bold">Employee Portal</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                variant="ghost"
                size="sm"
                className="relative hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50"
                  >
                    <div className="p-4 border-b border-white/10">
                      <h3 className="font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 ${
                            !notification.read ? "bg-blue-500/10" : ""
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {notification.type === "task" && <CheckSquare className="w-4 h-4 text-blue-400" />}
                              {notification.type === "meeting" && <Calendar className="w-4 h-4 text-green-400" />}
                              {notification.type === "message" && <MessageSquare className="w-4 h-4 text-purple-400" />}
                              {notification.type === "system" && <AlertCircle className="w-4 h-4 text-orange-400" />}
                              {notification.type === "approval" && <Shield className="w-4 h-4 text-yellow-400" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-medium">{currentEmployee?.name}</div>
                <div className="text-sm text-gray-400">{currentEmployee?.role}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                {currentEmployee?.avatar}
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <User className="w-3 h-3 mr-1" />
                {currentEmployee?.employee_code}
              </Badge>
            </div>

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8 bg-white/5 border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-500/20">
              <CheckSquare className="w-4 h-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-500/20">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="approvals" className="data-[state=active]:bg-blue-500/20">
              <Shield className="w-4 h-4 mr-2" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-500/20">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-blue-500/20">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-blue-500/20">
              <FileText className="w-4 h-4 mr-2" />
              Files
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-blue-500/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckSquare className="w-8 h-8 text-blue-400" />
                    <Badge className="bg-blue-500/20 text-blue-300">
                      {tasks.filter((task) => task.assigned_to.includes(currentEmployee?.id || "")).length}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">
                    {tasks.filter((task) => task.assigned_to.includes(currentEmployee?.id || "")).length}
                  </h3>
                  <p className="text-gray-400 text-sm">My Tasks</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="w-8 h-8 text-green-400" />
                    <Badge className="bg-green-500/20 text-green-300">{meetings.length}</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{meetings.length}</h3>
                  <p className="text-gray-400 text-sm">Meetings Today</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-400" />
                    <Badge className="bg-purple-500/20 text-purple-300">{unreadNotifications.length}</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{unreadNotifications.length}</h3>
                  <p className="text-gray-400 text-sm">Unread Messages</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-orange-400" />
                    <Badge className="bg-orange-500/20 text-orange-300">
                      {employees.filter((emp) => emp.status === "online").length}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">
                    {employees.filter((emp) => emp.status === "online").length}
                  </h3>
                  <p className="text-gray-400 text-sm">Team Online</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Recent Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks
                      .filter((task) => task.assigned_to.includes(currentEmployee?.id || ""))
                      .slice(0, 3)
                      .map((task) => (
                        <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                          <CheckSquare className="w-5 h-5 text-blue-400 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meetings.slice(0, 3).map((meeting) => (
                      <div key={meeting.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                        <Calendar className="w-5 h-5 text-green-400 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium">{meeting.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{meeting.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{meeting.date}</span>
                            <span>{meeting.time}</span>
                            <span>{meeting.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            {/* Create Task */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>Create New Task</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <Input
                    placeholder="Task title"
                    value={newTaskForm.title}
                    onChange={(e) => setNewTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                  <Input
                    placeholder="Description"
                    value={newTaskForm.description}
                    onChange={(e) => setNewTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                  <select
                    value={newTaskForm.assignedTo}
                    onChange={(e) => setNewTaskForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:border-blue-500/50 focus:outline-none text-white"
                  >
                    <option value="" className="bg-slate-800">
                      Assign to...
                    </option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id} className="bg-slate-800">
                        {emp.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm((prev) => ({ ...prev, priority: e.target.value as any }))}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:border-blue-500/50 focus:outline-none text-white"
                  >
                    <option value="low" className="bg-slate-800">
                      Low Priority
                    </option>
                    <option value="medium" className="bg-slate-800">
                      Medium Priority
                    </option>
                    <option value="high" className="bg-slate-800">
                      High Priority
                    </option>
                    <option value="urgent" className="bg-slate-800">
                      Urgent
                    </option>
                  </select>
                  <Input
                    type="date"
                    value={newTaskForm.dueDate}
                    onChange={(e) => setNewTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                  <Button
                    onClick={createTask}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Task</th>
                        <th className="p-4 font-medium">Assigned To</th>
                        <th className="p-4 font-medium">Priority</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Due Date</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, index) => (
                        <motion.tr
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="p-4">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-400">{task.description}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {task.tags.map((tag) => (
                                  <Badge key={tag} className="bg-gray-500/20 text-gray-300 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {task.assigned_to.map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                return emp ? (
                                  <div key={empId} className="flex items-center space-x-1">
                                    <span className="text-lg">{emp.avatar}</span>
                                    <span className="text-sm">{emp.name}</span>
                                  </div>
                                ) : null
                              })}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          </td>
                          <td className="p-4 text-gray-400">{new Date(task.due_date).toLocaleDateString()}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="hover:bg-white/10">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-white/10">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-white/10">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <ProjectTimeline />
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <ApprovalWorkflow />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>Calendar & Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Upcoming Meetings</h3>
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{meeting.title}</h4>
                          <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{meeting.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{meeting.date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{meeting.time}</span>
                            </span>
                            <span>{meeting.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-white/10">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-white/10">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Attendees:</span>
                            <div className="flex items-center space-x-1">
                              {meeting.attendees.slice(0, 3).map((attendeeId) => {
                                const attendee = employees.find((emp) => emp.id === attendeeId)
                                return attendee ? (
                                  <span key={attendeeId} className="text-sm">
                                    {attendee.avatar}
                                  </span>
                                ) : null
                              })}
                              {meeting.attendees.length > 3 && (
                                <span className="text-xs text-gray-500">+{meeting.attendees.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Calendar View</h3>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 35 }, (_, i) => {
                          const day = i - 6 + 1
                          const isToday = day === 16
                          const hasMeeting = day === 16 || day === 17
                          return (
                            <div
                              key={i}
                              className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                                day > 0 && day <= 31
                                  ? isToday
                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                    : hasMeeting
                                      ? "bg-green-500/10 text-green-300 hover:bg-green-500/20"
                                      : "hover:bg-white/10"
                                  : "text-gray-600"
                              }`}
                            >
                              {day > 0 && day <= 31 ? day : ""}
                              {hasMeeting && day > 0 && day <= 31 && (
                                <div className="w-1 h-1 bg-green-500 rounded-full absolute mt-4" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                          {employee.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{employee.name}</h3>
                          <p className="text-sm text-gray-400">{employee.role}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(employee.status)}
                          <span className="text-xs text-gray-500 capitalize">{employee.status}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Department:</span>
                          <span>{employee.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Employee Code:</span>
                          <Badge className="bg-blue-500/20 text-blue-300">{employee.employee_code}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Seen:</span>
                          <span className="text-xs">{employee.last_seen}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" variant="ghost" className="flex-1 hover:bg-white/10">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Shared Files</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                    <Button size="sm" variant="ghost" className="hover:bg-white/10">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Project Requirements.pdf",
                      size: "2.4 MB",
                      type: "PDF",
                      sharedBy: "Mike Johnson",
                      date: "2024-01-15",
                    },
                    {
                      name: "Design Mockups.fig",
                      size: "15.7 MB",
                      type: "Figma",
                      sharedBy: "Sarah Smith",
                      date: "2024-01-14",
                    },
                    {
                      name: "API Documentation.md",
                      size: "156 KB",
                      type: "Markdown",
                      sharedBy: "John Doe",
                      date: "2024-01-13",
                    },
                  ].map((file, index) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{file.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{file.size}</span>
                            <span>Shared by {file.sharedBy}</span>
                            <span>{file.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>Team Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-white/5">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
                      👩‍🎨
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">Sarah Smith</h4>
                        <span className="text-xs text-gray-500">2 minutes ago</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Hey team! I've uploaded the latest design mockups. Please review and let me know your thoughts.
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-white/5">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                      👨‍💻
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">John Doe</h4>
                        <span className="text-xs text-gray-500">15 minutes ago</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Authentication module is complete. Ready for testing phase.
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                        {currentEmployee?.avatar}
                      </div>
                      <div className="flex-1 flex items-center space-x-2">
                        <Input placeholder="Type your message..." className="bg-white/5 border-white/10 flex-1" />
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Real-time Chat */}
        <RealTimeChat
          currentUserId={currentEmployee?.id || ""}
          isMinimized={!showChat}
          onToggleMinimize={() => setShowChat(!showChat)}
        />
      </div>
    </div>
  )
}
