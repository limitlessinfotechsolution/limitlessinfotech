"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Server,
  Shield,
  Activity,
  Settings,
  Database,
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  Eye,
  Lock,
  Unlock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SystemMetric {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  icon: React.ComponentType<{ className?: string }>
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
}

interface SecurityEvent {
  id: string
  type: "login" | "failed_login" | "permission_change" | "data_access"
  user: string
  timestamp: string
  details: string
  severity: "low" | "medium" | "high"
}

const systemMetrics: SystemMetric[] = [
  {
    label: "Total Users",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Active Sessions",
    value: "89",
    change: "+5%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Server Uptime",
    value: "99.9%",
    change: "Stable",
    trend: "stable",
    icon: Server,
  },
  {
    label: "Security Score",
    value: "98/100",
    change: "+2",
    trend: "up",
    icon: Shield,
  },
]

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@limitless.com",
    role: "Admin",
    status: "active",
    lastLogin: "2 hours ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@limitless.com",
    role: "Developer",
    status: "active",
    lastLogin: "1 day ago",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@limitless.com",
    role: "User",
    status: "inactive",
    lastLogin: "1 week ago",
  },
]

const securityEvents: SecurityEvent[] = [
  {
    id: "1",
    type: "login",
    user: "john@limitless.com",
    timestamp: "2 minutes ago",
    details: "Successful login from IP 192.168.1.100",
    severity: "low",
  },
  {
    id: "2",
    type: "failed_login",
    user: "unknown@example.com",
    timestamp: "15 minutes ago",
    details: "Failed login attempt from IP 203.0.113.1",
    severity: "medium",
  },
  {
    id: "3",
    type: "permission_change",
    user: "admin@limitless.com",
    timestamp: "1 hour ago",
    details: "User permissions updated for jane@limitless.com",
    severity: "high",
  },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [selectedTab, setSelectedTab] = useState("dashboard")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple demo authentication
    if (loginForm.username === "admin" && loginForm.password === "limitless2024") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid credentials. Use admin/limitless2024")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-blue-900 text-foreground flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <Card className="custom-card p-6">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Image src="/images/logo.png" alt="Limitless" width={48} height={48} />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">LIMITLESS ADMIN</h1>
                  <p className="text-sm text-primary">Secure Access Portal</p>
                </div>
              </div>
              <CardTitle className="flex items-center justify-center space-x-2 text-xl font-semibold">
                <Lock className="w-6 h-6 text-primary" />
                <span>Admin Login</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <Button type="submit" className="w-full btn-gradient">
                  <Unlock className="w-4 h-4 mr-2" />
                  Secure Login
                </Button>
              </form>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Username: admin
                  <br />
                  Password: limitless2024
                </p>
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-primary hover:text-primary/80 text-sm flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground">
      {/* Header */}
      <header className="border-b border-dark-blue-700 p-4 bg-dark-blue-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Image src="/images/logo.png" alt="Limitless" width={32} height={32} />
              <h1 className="text-2xl font-bold text-foreground">Limitless Admin Panel</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              System Healthy
            </Badge>
            <Button
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              size="sm"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-card border-border rounded-lg p-1 mb-6">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <Activity className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <Server className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="custom-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <metric.icon className="w-8 h-8 text-accent-blue" />
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          metric.trend === "up"
                            ? "bg-accent-green/20 text-accent-green"
                            : metric.trend === "down"
                              ? "bg-destructive/20 text-destructive"
                              : "bg-muted/20 text-muted-foreground",
                        )}
                      >
                        {metric.change}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-1 text-foreground">{metric.value}</h3>
                    <p className="text-muted-foreground text-sm">{metric.label}</p>
                  </CardContent>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="custom-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Activity className="w-5 h-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityEvents.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20 border border-border animate-fade-in-up"
                        style={{ animationDelay: `${eventIndex * 0.05}s` }}
                      >
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mt-2",
                            event.severity === "high"
                              ? "bg-destructive"
                              : event.severity === "medium"
                                ? "bg-accent-orange"
                                : "bg-accent-green",
                          )}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{event.details}</p>
                          <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="custom-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">CPU Usage</span>
                      <span className="text-sm font-medium text-foreground">23%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent-blue h-2 rounded-full" style={{ width: "23%" }} />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">Memory Usage</span>
                      <span className="text-sm font-medium text-foreground">67%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent-green h-2 rounded-full" style={{ width: "67%" }} />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">Storage Usage</span>
                      <span className="text-sm font-medium text-foreground">45%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent-orange h-2 rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <span className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>User Management</span>
                  </span>
                  <Button className="btn-gradient">Add User</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr className="text-left">
                        <th className="p-4 font-medium table-header">Email Address</th>
                        <th className="p-4 font-medium table-header">Role</th>
                        <th className="p-4 font-medium table-header">Status</th>
                        <th className="p-4 font-medium table-header">Last Login</th>
                        <th className="p-4 font-medium table-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user, index) => (
                        <tr
                          key={user.id}
                          className="table-row animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full flex items-center justify-center text-primary-foreground font-bold">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-medium text-foreground">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{user.role}</td>
                          <td className="p-4">
                            <Badge
                              className={cn(
                                user.status === "active"
                                  ? "bg-accent-green/20 text-accent-green"
                                  : "bg-muted/20 text-muted-foreground",
                              )}
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{user.lastLogin}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                                <Eye className="w-4 h-4" />
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

          <TabsContent value="security" className="space-y-6">
            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Security Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-muted/20 border border-border animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full mt-2",
                          event.severity === "high"
                            ? "bg-destructive"
                            : event.severity === "medium"
                              ? "bg-accent-orange"
                              : "bg-accent-green",
                        )}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium capitalize text-foreground">{event.type.replace("_", " ")}</h3>
                          <Badge
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              event.severity === "high"
                                ? "bg-destructive/20 text-destructive"
                                : event.severity === "medium"
                                  ? "bg-accent-orange/20 text-accent-orange"
                                  : "bg-accent-green/20 text-accent-green",
                            )}
                          >
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{event.details}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>User: {event.user}</span>
                          <span>Time: {event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="custom-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Server className="w-5 h-5 text-primary" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Web Server</span>
                    <Badge className="bg-accent-green/20 text-accent-green">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Database</span>
                    <Badge className="bg-accent-green/20 text-accent-green">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Mail Server</span>
                    <Badge className="bg-accent-green/20 text-accent-green">Running</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Backup Service</span>
                    <Badge className="bg-accent-orange/20 text-accent-orange">Scheduled</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="custom-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Database className="w-5 h-5 text-primary" />
                    <span>Database Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-foreground">Total Records</span>
                    <span className="font-medium text-foreground">1,247,892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Database Size</span>
                    <span className="font-medium text-foreground">2.3 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Last Backup</span>
                    <span className="font-medium text-foreground">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Query Performance</span>
                    <span className="font-medium text-accent-green">Excellent</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>System Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">General Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">System Name</label>
                        <Input defaultValue="Limitless Infotech System" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Admin Email</label>
                        <Input defaultValue="admin@limitless.com" className="input-field" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Security Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground">Two-Factor Authentication</span>
                        <Badge className="bg-accent-green/20 text-accent-green">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground">Session Timeout</span>
                        <span className="text-sm text-muted-foreground">30 minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground">Password Policy</span>
                        <Badge className="bg-accent-blue/20 text-accent-blue">Strong</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <Button className="btn-gradient">Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
