"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Server,
  RefreshCw,
  Loader2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ServerMetric {
  label: string
  value: string | number
  unit?: string
  icon: React.ElementType
  colorClass: string
  progressValue?: number
  status?: "ok" | "warning" | "critical"
}

export default function AdvancedServerMonitor() {
  const [metrics, setMetrics] = useState<ServerMetric[]>([
    {
      label: "CPU Usage",
      value: 0,
      unit: "%",
      icon: Cpu,
      colorClass: "text-accent-blue",
      progressValue: 0,
      status: "ok",
    },
    {
      label: "Memory Usage",
      value: 0,
      unit: "%",
      icon: MemoryStick,
      colorClass: "text-accent-green",
      progressValue: 0,
      status: "ok",
    },
    {
      label: "Disk Usage",
      value: 0,
      unit: "%",
      icon: HardDrive,
      colorClass: "text-accent-orange",
      progressValue: 0,
      status: "ok",
    },
    {
      label: "Network I/O",
      value: "0 MB/s",
      icon: Network,
      colorClass: "text-accent-purple",
      status: "ok",
    },
    {
      label: "Active Connections",
      value: 0,
      icon: Activity,
      colorClass: "text-accent-cyan",
      status: "ok",
    },
    {
      label: "Server Uptime",
      value: "Loading...",
      icon: Clock,
      colorClass: "text-primary",
      status: "ok",
    },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchServerMetrics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/analytics?period=24h") // Reusing analytics API for mock data
      const data = await response.json()

      if (data.success && data.data) {
        const { cpu, memory, disk, bandwidth } = data.data
        setMetrics([
          {
            label: "CPU Usage",
            value: cpu.current,
            unit: "%",
            icon: Cpu,
            colorClass: "text-accent-blue",
            progressValue: cpu.current,
            status: cpu.current > 80 ? "critical" : cpu.current > 60 ? "warning" : "ok",
          },
          {
            label: "Memory Usage",
            value: memory.current,
            unit: "%",
            icon: MemoryStick,
            colorClass: "text-accent-green",
            progressValue: memory.current,
            status: memory.current > 90 ? "critical" : memory.current > 70 ? "warning" : "ok",
          },
          {
            label: "Disk Usage",
            value: disk.used,
            unit: "%",
            icon: HardDrive,
            colorClass: "text-accent-orange",
            progressValue: (disk.used / disk.total) * 100,
            status:
              (disk.used / disk.total) * 100 > 90 ? "critical" : (disk.used / disk.total) * 100 > 70 ? "warning" : "ok",
          },
          {
            label: "Network I/O",
            value: `${(bandwidth.used / 1024).toFixed(2)} GB/s`, // Mocking as GB/s for display
            icon: Network,
            colorClass: "text-accent-purple",
            status: "ok", // No specific status logic for network in mock
          },
          {
            label: "Active Connections",
            value: Math.floor(Math.random() * (200 - 50 + 1)) + 50, // Random mock value
            icon: Activity,
            colorClass: "text-accent-cyan",
            status: "ok",
          },
          {
            label: "Server Uptime",
            value: "15 days, 7 hours", // Static mock uptime
            icon: Clock,
            colorClass: "text-primary",
            status: "ok",
          },
        ])
        toast({ title: "Success!", description: "Server metrics updated." })
      } else {
        throw new Error(data.error || "Failed to fetch server metrics.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch server metrics.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServerMetrics()
    const interval = setInterval(fetchServerMetrics, 15000) // Refresh every 15 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusBadgeClass = (status: "ok" | "warning" | "critical") => {
    switch (status) {
      case "ok":
        return "bg-accent-green/20 text-accent-green border-accent-green/30"
      case "warning":
        return "bg-accent-orange/20 text-accent-orange border-accent-orange/30"
      case "critical":
        return "bg-destructive/20 text-destructive border-destructive/30"
      default:
        return "bg-muted/20 text-muted-foreground border-border"
    }
  }

  const getProgressBarClass = (status: "ok" | "warning" | "critical") => {
    switch (status) {
      case "ok":
        return "bg-accent-green"
      case "warning":
        return "bg-accent-orange"
      case "critical":
        return "bg-destructive"
      default:
        return "bg-primary"
    }
  }

  return (
    <Card className="custom-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-primary" />
            <span>Advanced Server Monitor</span>
          </span>
          <Button onClick={fetchServerMetrics} disabled={isLoading} className="btn-outline-primary">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span className="sr-only">Refresh Metrics</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="p-6 bg-muted/20 rounded-lg border border-border animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={cn("w-8 h-8", metric.colorClass)} />
                {metric.status && (
                  <Badge className={getStatusBadgeClass(metric.status)}>
                    {metric.status === "ok" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {metric.status === "warning" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {metric.status === "critical" && <XCircle className="w-3 h-3 mr-1" />}
                    {metric.status.toUpperCase()}
                  </Badge>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-1 text-foreground">
                {typeof metric.value === "number" ? metric.value.toFixed(0) : metric.value}
                {metric.unit}
              </h3>
              <p className="text-muted-foreground text-sm">{metric.label}</p>
              {metric.progressValue !== undefined && (
                <Progress
                  value={metric.progressValue}
                  className="h-2 mt-2"
                  indicatorClassName={getProgressBarClass(metric.status || "ok")}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="custom-card">
          <CardHeader>
            <CardTitle className="text-foreground">Server Logs (Last 100 lines)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-gray-300 font-mono text-sm p-4 rounded-lg h-64 overflow-auto">
              <pre>
                {`[2024-07-11 10:00:01] INFO: Web server started on port 80.
[2024-07-11 10:00:05] DEBUG: Database connection established.
[2024-07-11 10:00:10] INFO: User 'admin' logged in from 192.168.1.10.
[2024-07-11 10:00:15] WARN: High CPU usage detected (85%).
[2024-07-11 10:00:20] INFO: New file uploaded: /public_html/images/logo.png.
[2024-07-11 10:00:25] ERROR: Failed database query: SELECT * FROM users WHERE id = 'invalid'.
[2024-07-11 10:00:30] INFO: Email sent to 'user@example.com'.
[2024-07-11 10:00:35] DEBUG: Cache cleared successfully.
[2024-07-11 10:00:40] INFO: Scheduled backup initiated.
[2024-07-11 10:00:45] WARN: Disk space low (92% used).
[2024-07-11 10:00:50] INFO: User 'guest' logged out.
[2024-07-11 10:00:55] INFO: System health check passed.
[2024-07-11 10:01:00] INFO: Server load average: 0.5, 0.6, 0.7.
[2024-07-11 10:01:05] DEBUG: API endpoint /api/users accessed.
[2024-07-11 10:01:10] INFO: New domain 'testdomain.com' added.
[2024-07-11 10:01:15] WARN: Memory usage approaching limit (95%).
[2024-07-11 10:01:20] INFO: SSL certificate renewed for 'example.com'.
[2024-07-11 10:01:25] ERROR: Network connectivity issue detected.
[2024-07-11 10:01:30] INFO: User 'dev' updated permissions for 'project_alpha'.
[2024-07-11 10:01:35] DEBUG: Cron job 'cleanup_temp_files' executed.
[2024-07-11 10:01:40] INFO: Server restarted successfully.
[2024-07-11 10:01:45] WARN: Unusual login attempt from unknown IP.
[2024-07-11 10:01:50] INFO: New database 'dev_db' created.
[2024-07-11 10:01:55] DEBUG: Frontend asset served from CDN.
[2024-07-11 10:02:00] INFO: System is running smoothly.
`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
