"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Terminal,
  Play,
  StopCircle,
  RefreshCw,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Server,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface CronJob {
  id: string
  command: string
  schedule: string
  status: "active" | "inactive"
  lastRun: string
}

interface Service {
  id: string
  name: string
  status: "running" | "stopped" | "restarting"
  description: string
}

const mockCronJobs: CronJob[] = [
  {
    id: "cron_1",
    command: "/usr/bin/php /home/user/public_html/cron.php",
    schedule: "Every 5 minutes",
    status: "active",
    lastRun: "2024-07-11 10:00:00",
  },
  {
    id: "cron_2",
    command: "/usr/bin/python /home/user/scripts/backup.py",
    schedule: "Daily at 03:00 AM",
    status: "active",
    lastRun: "2024-07-11 03:00:00",
  },
  {
    id: "cron_3",
    command: "wget -q -O /dev/null https://yourdomain.com/api/heartbeat",
    schedule: "Every hour",
    status: "inactive",
    lastRun: "2024-07-10 23:00:00",
  },
]

const mockServices: Service[] = [
  { id: "svc_1", name: "Apache Web Server", status: "running", description: "Handles HTTP/HTTPS requests." },
  { id: "svc_2", name: "MySQL Database", status: "running", description: "Manages website databases." },
  {
    id: "svc_3",
    name: "Email Server (Postfix)",
    status: "running",
    description: "Handles incoming and outgoing emails.",
  },
  { id: "svc_4", name: "Redis Cache", status: "stopped", description: "In-memory data structure store." },
]

interface LogFile {
  id: string
  name: string
  path: string
  size: string
  modified: string
  lines: number
}

const mockLogFiles: LogFile[] = [
  {
    id: "1",
    name: "access.log",
    path: "/var/log/apache2/access.log",
    size: "45.2 MB",
    modified: "2024-01-15 14:30:22",
    lines: 125430,
  },
  {
    id: "2",
    name: "error.log",
    path: "/var/log/apache2/error.log",
    size: "2.1 MB",
    modified: "2024-01-15 14:25:18",
    lines: 8920,
  },
  {
    id: "3",
    name: "mysql.log",
    path: "/var/log/mysql/mysql.log",
    size: "12.8 MB",
    modified: "2024-01-15 14:28:45",
    lines: 45230,
  },
]

export default function BackendTools() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>(mockCronJobs)
  const [services, setServices] = useState<Service[]>(mockServices)
  const [logFiles, setLogFiles] = useState<LogFile[]>(mockLogFiles)
  const [newCronJob, setNewCronJob] = useState({ command: "", schedule: "", status: "active" })
  const [consoleCommand, setConsoleCommand] = useState("")
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to Limitless CPanel Terminal",
    "Type 'help' for available commands",
    "",
  ])
  const [terminalInput, setTerminalInput] = useState("")
  const [newCronForm, setNewCronForm] = useState({
    name: "",
    command: "",
    schedule: "",
  })

  const handleCronJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewCronJob((prev) => ({ ...prev, [id]: value }))
  }

  const handleCronJobSelectChange = (value: string, field: "schedule" | "status") => {
    setNewCronJob((prev) => ({ ...prev, [field]: value }))
  }

  const addCronJob = async () => {
    if (!newCronJob.command || !newCronJob.schedule) {
      toast({ title: "Error", description: "Command and schedule are required.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      // Simulate API call
      const response = await fetch("/api/cpanel/backend/cron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", ...newCronJob }),
      })
      const data = await response.json()
      if (data.success) {
        setCronJobs((prev) => [...prev, { ...newCronJob, id: `cron_${Date.now()}`, lastRun: "Never" }])
        setNewCronJob({ command: "", schedule: "", status: "active" })
        toast({ title: "Success!", description: "Cron job added." })
      } else {
        throw new Error(data.error || "Failed to add cron job.")
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

  const toggleCronJobStatus = async (id: string, currentStatus: string) => {
    setIsLoading(true)
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      // Simulate API call
      const response = await fetch("/api/cpanel/backend/cron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", id, status: newStatus }),
      })
      const data = await response.json()
      if (data.success) {
        setCronJobs((prev) =>
          prev.map((job) => (job.id === id ? { ...job, status: newStatus as "active" | "inactive" } : job)),
        )
        toast({ title: "Success!", description: `Cron job status changed to ${newStatus}.` })
      } else {
        throw new Error(data.error || "Failed to update cron job status.")
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

  const deleteCronJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cron job?")) return
    setIsLoading(true)
    try {
      // Simulate API call
      const response = await fetch("/api/cpanel/backend/cron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        setCronJobs((prev) => prev.filter((job) => job.id !== id))
        toast({ title: "Success!", description: "Cron job deleted." })
      } else {
        throw new Error(data.error || "Failed to delete cron job.")
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

  const handleServiceAction = async (id: string, action: "start" | "stop" | "restart") => {
    setIsLoading(true)
    setServices((prev) =>
      prev.map((svc) => (svc.id === id ? { ...svc, status: action === "restart" ? "restarting" : svc.status } : svc)),
    )
    try {
      // Simulate API call
      const response = await fetch("/api/cpanel/backend/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      })
      const data = await response.json()
      if (data.success) {
        setServices((prev) => prev.map((svc) => (svc.id === id ? { ...svc, status: data.newStatus } : svc)))
        toast({ title: "Success!", description: `Service ${action}ed successfully.` })
      } else {
        throw new Error(data.error || `Failed to ${action} service.`)
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

  const handleConsoleCommand = async () => {
    if (!consoleCommand.trim()) return
    setIsLoading(true)
    setConsoleOutput((prev) => [...prev, `> ${consoleCommand}`]) // Add command to output
    try {
      // Simulate API call to execute command
      const response = await fetch("/api/cpanel/backend/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: consoleCommand }),
      })
      const data = await response.json()
      if (data.success) {
        setConsoleOutput((prev) => [...prev, data.output])
      } else {
        throw new Error(data.error || "Command execution failed.")
      }
    } catch (error) {
      setConsoleOutput((prev) => [...prev, `Error: ${error instanceof Error ? error.message : "Unknown error"}`])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setConsoleCommand("")
      setIsLoading(false)
    }
  }

  const executeCommand = (command: string) => {
    const newOutput = [...terminalOutput, `$ ${command}`]

    // Simulate command execution
    switch (command.toLowerCase()) {
      case "help":
        newOutput.push("Available commands:")
        newOutput.push("  ls - List files")
        newOutput.push("  ps - Show running processes")
        newOutput.push("  top - Show system resources")
        newOutput.push("  df - Show disk usage")
        newOutput.push("  free - Show memory usage")
        newOutput.push("  clear - Clear terminal")
        break
      case "ls":
        newOutput.push("public_html  logs  mail  tmp  backup")
        break
      case "ps":
        newOutput.push("PID   COMMAND")
        newOutput.push("1234  apache2")
        newOutput.push("5678  mysqld")
        newOutput.push("9012  redis-server")
        break
      case "top":
        newOutput.push("CPU: 23%  Memory: 67%  Load: 1.2")
        break
      case "df":
        newOutput.push("Filesystem     Size  Used Avail Use%")
        newOutput.push("/dev/sda1      100G   45G   55G  45%")
        break
      case "free":
        newOutput.push("              total        used        free")
        newOutput.push("Mem:           8192        5472        2720")
        break
      case "clear":
        setTerminalOutput(["Terminal cleared", ""])
        setTerminalInput("")
        return
      default:
        newOutput.push(`Command not found: ${command}`)
    }

    newOutput.push("")
    setTerminalOutput(newOutput)
    setTerminalInput("")
  }

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (terminalInput.trim()) {
      executeCommand(terminalInput.trim())
    }
  }

  const toggleService = (serviceId: string) => {
    setServices(
      services.map((service) =>
        service.id === serviceId
          ? { ...service, status: service.status === "running" ? "stopped" : "running" }
          : service,
      ),
    )
  }

  const toggleCronJob = (jobId: string) => {
    setCronJobs(cronJobs.map((job) => (job.id === jobId ? { ...job, enabled: !job.enabled } : job)))
  }

  const createCronJob = () => {
    if (newCronForm.name && newCronForm.command && newCronForm.schedule) {
      const newJob: CronJob = {
        id: Date.now().toString(),
        ...newCronForm,
        enabled: true,
        lastRun: "Never",
        nextRun: "Calculating...",
        output: "Not executed yet",
      }
      setCronJobs([...cronJobs, newJob])
      setNewCronForm({ name: "", command: "", schedule: "" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-accent-green/20 text-accent-green"
      case "stopped":
        return "bg-destructive/20 text-destructive"
      case "error":
        return "bg-accent-orange/20 text-accent-orange"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Server Console */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Terminal className="w-5 h-5 text-primary" />
            <span>Server Console</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black text-gray-300 font-mono text-sm p-4 rounded-lg h-64 overflow-auto">
            {consoleOutput.length === 0 ? (
              <p className="text-muted-foreground">Type a command and press Enter to execute.</p>
            ) : (
              consoleOutput.map((line, index) => <div key={index}>{line}</div>)
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter command (e.g., ls -la)"
              value={consoleCommand}
              onChange={(e) => setConsoleCommand(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleConsoleCommand()
                }
              }}
              className="input-field font-mono"
              disabled={isLoading}
            />
            <Button onClick={handleConsoleCommand} disabled={isLoading} className="btn-gradient">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span className="sr-only">Execute Command</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Terminal className="w-5 h-5 text-primary" />
            <span>Backend Tools & System Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          {/* Server Console */}
          {/* Cron Jobs */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <span>Cron Jobs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-accent-blue" />
                  <span>Add New Cron Job</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="command" className="block text-sm font-medium text-muted-foreground mb-2">
                      Command
                    </label>
                    <Input
                      id="command"
                      placeholder="e.g., /usr/bin/php /home/user/script.php"
                      value={newCronJob.command}
                      onChange={handleCronJobChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-muted-foreground mb-2">
                      Schedule
                    </label>
                    <Select
                      value={newCronJob.schedule}
                      onValueChange={(value) => handleCronJobSelectChange(value, "schedule")}
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Every minute" className="hover:bg-muted/50">
                          Every minute
                        </SelectItem>
                        <SelectItem value="Every 5 minutes" className="hover:bg-muted/50">
                          Every 5 minutes
                        </SelectItem>
                        <SelectItem value="Every hour" className="hover:bg-muted/50">
                          Every hour
                        </SelectItem>
                        <SelectItem value="Daily at 03:00 AM" className="hover:bg-muted/50">
                          Daily at 03:00 AM
                        </SelectItem>
                        <SelectItem value="Weekly" className="hover:bg-muted/50">
                          Weekly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addCronJob} disabled={isLoading} className="btn-gradient">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" /> Add Cron Job
                    </>
                  )}
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Command</th>
                      <th className="p-4 font-medium table-header">Schedule</th>
                      <th className="p-4 font-medium table-header">Last Run</th>
                      <th className="p-4 font-medium table-header">Status</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cronJobs.map((job, index) => (
                      <tr
                        key={job.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-mono text-muted-foreground">{job.command}</td>
                        <td className="p-4 text-muted-foreground">{job.schedule}</td>
                        <td className="p-4 text-muted-foreground">{job.lastRun}</td>
                        <td className="p-4">
                          <Badge
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              job.status === "active"
                                ? "bg-accent-green/20 text-accent-green"
                                : "bg-muted/20 text-muted-foreground",
                            )}
                          >
                            {job.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleCronJobStatus(job.id, job.status)}
                              className={cn(
                                "btn-outline-primary",
                                job.status === "active" ? "text-destructive border-destructive/50" : "",
                              )}
                            >
                              {job.status === "active" ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              <span className="sr-only">Toggle Status</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteCronJob(job.id)}
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

          {/* Server Services */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Server className="w-5 h-5 text-primary" />
                <span>Server Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Service Name</th>
                      <th className="p-4 font-medium table-header">Description</th>
                      <th className="p-4 font-medium table-header">Status</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr
                        key={service.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{service.name}</td>
                        <td className="p-4 text-muted-foreground">{service.description}</td>
                        <td className="p-4">
                          <Badge
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              service.status === "running"
                                ? "bg-accent-green/20 text-accent-green"
                                : service.status === "stopped"
                                  ? "bg-muted/20 text-muted-foreground"
                                  : "bg-accent-orange/20 text-accent-orange",
                            )}
                          >
                            {service.status.replace("-", " ")}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleServiceAction(service.id, "start")}
                              disabled={service.status === "running" || isLoading}
                              className="btn-outline-primary"
                            >
                              <Play className="w-4 h-4" />
                              <span className="sr-only">Start</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleServiceAction(service.id, "stop")}
                              disabled={service.status === "stopped" || isLoading}
                              className="btn-outline-destructive"
                            >
                              <StopCircle className="w-4 h-4" />
                              <span className="sr-only">Stop</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleServiceAction(service.id, "restart")}
                              disabled={isLoading}
                              className="btn-outline-primary"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span className="sr-only">Restart</span>
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
        </CardContent>
      </Card>
    </div>
  )
}
