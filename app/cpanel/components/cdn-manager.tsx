"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Globe,
  Zap,
  BarChart3,
  Settings,
  RefreshCw,
  Plus,
  Trash2,
  MapPin,
  Clock,
  TrendingUp,
  Gauge,
  Cloud,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface CDNZone {
  id: string
  domain: string
  status: "active" | "pending" | "disabled"
  origin: string
  cacheHitRatio: number
  bandwidth: string
  requests: number
  created: string
}

interface CDNStats {
  timestamp: string
  requests: number
  bandwidth: number
  cacheHit: number
  latency: number
}

interface EdgeLocation {
  id: string
  city: string
  country: string
  region: string
  status: "online" | "offline" | "maintenance"
  latency: number
  requests: number
}

interface CdnSetting {
  id: string
  domain: string
  status: "active" | "inactive" | "deploying"
  cacheLevel: "standard" | "aggressive" | "bypass"
  sslEnabled: boolean
  lastPurged: string
}

const mockZones: CDNZone[] = [
  {
    id: "1",
    domain: "limitless.com",
    status: "active",
    origin: "203.0.113.1",
    cacheHitRatio: 94.5,
    bandwidth: "2.4 TB",
    requests: 1250000,
    created: "2024-01-01",
  },
  {
    id: "2",
    domain: "api.limitless.com",
    status: "active",
    origin: "203.0.113.2",
    cacheHitRatio: 87.2,
    bandwidth: "890 GB",
    requests: 850000,
    created: "2024-01-05",
  },
  {
    id: "3",
    domain: "cdn.limitless.com",
    status: "active",
    origin: "203.0.113.3",
    cacheHitRatio: 96.8,
    bandwidth: "5.1 TB",
    requests: 2100000,
    created: "2024-01-03",
  },
]

const mockStats: CDNStats[] = [
  { timestamp: "00:00", requests: 12500, bandwidth: 450, cacheHit: 94, latency: 45 },
  { timestamp: "04:00", requests: 8200, bandwidth: 320, cacheHit: 92, latency: 48 },
  { timestamp: "08:00", requests: 18900, bandwidth: 680, cacheHit: 95, latency: 42 },
  { timestamp: "12:00", requests: 25400, bandwidth: 920, cacheHit: 96, latency: 38 },
  { timestamp: "16:00", requests: 22100, bandwidth: 810, cacheHit: 94, latency: 41 },
  { timestamp: "20:00", requests: 19800, bandwidth: 720, cacheHit: 93, latency: 44 },
]

const mockEdgeLocations: EdgeLocation[] = [
  {
    id: "1",
    city: "New York",
    country: "USA",
    region: "North America",
    status: "online",
    latency: 12,
    requests: 450000,
  },
  { id: "2", city: "London", country: "UK", region: "Europe", status: "online", latency: 8, requests: 380000 },
  { id: "3", city: "Tokyo", country: "Japan", region: "Asia", status: "online", latency: 15, requests: 320000 },
  { id: "4", city: "Sydney", country: "Australia", region: "Oceania", status: "online", latency: 22, requests: 180000 },
  {
    id: "5",
    city: "São Paulo",
    country: "Brazil",
    region: "South America",
    status: "online",
    latency: 28,
    requests: 150000,
  },
  { id: "6", city: "Mumbai", country: "India", region: "Asia", status: "maintenance", latency: 35, requests: 0 },
  { id: "7", city: "Frankfurt", country: "Germany", region: "Europe", status: "online", latency: 6, requests: 420000 },
  { id: "8", city: "Singapore", country: "Singapore", region: "Asia", status: "online", latency: 18, requests: 280000 },
]

const cacheTypeData = [
  { name: "Static Assets", value: 65, color: "hsl(var(--accent-blue))" },
  { name: "API Responses", value: 20, color: "hsl(var(--accent-green))" },
  { name: "Images", value: 10, color: "hsl(var(--accent-orange))" },
  { name: "Other", value: 5, color: "hsl(var(--accent-purple))" },
]

const mockCdnSettings: CdnSetting[] = [
  {
    id: "cdn_1",
    domain: "limitlessinfotech.com",
    status: "active",
    cacheLevel: "standard",
    sslEnabled: true,
    lastPurged: "2024-07-10T10:00:00Z",
  },
  {
    id: "cdn_2",
    domain: "blog.limitlessinfotech.com",
    status: "inactive",
    cacheLevel: "bypass",
    sslEnabled: false,
    lastPurged: "Never",
  },
]

export default function CDNManager() {
  const [zones, setZones] = useState<CDNZone[]>(mockZones)
  const [stats, setStats] = useState<CDNStats[]>(mockStats)
  const [edgeLocations, setEdgeLocations] = useState<EdgeLocation[]>(mockEdgeLocations)
  const [newZoneForm, setNewZoneForm] = useState({ domain: "", origin: "" })
  const [cdnSettings, setCdnSettings] = useState<CdnSetting[]>(mockCdnSettings)
  const [newDomain, setNewDomain] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createZone = () => {
    if (newZoneForm.domain.trim() && newZoneForm.origin.trim()) {
      const newZone: CDNZone = {
        id: Date.now().toString(),
        domain: newZoneForm.domain,
        status: "pending",
        origin: newZoneForm.origin,
        cacheHitRatio: 0,
        bandwidth: "0 GB",
        requests: 0,
        created: new Date().toISOString().split("T")[0],
      }
      setZones([...zones, newZone])
      setNewZoneForm({ domain: "", origin: "" })
    }
  }

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast({ title: "Error", description: "Please enter a domain name.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      // Simulate API call
      const addedDomain: CdnSetting = {
        id: `cdn_${Date.now()}`,
        domain: newDomain.trim(),
        status: "deploying",
        cacheLevel: "standard",
        sslEnabled: false,
        lastPurged: "Never",
      }
      setCdnSettings((prev) => [...prev, addedDomain])
      setNewDomain("")
      toast({ title: "Success!", description: "Domain added to CDN. Deployment in progress." })

      // Simulate deployment completion
      setTimeout(() => {
        setCdnSettings((prev) =>
          prev.map((setting) => (setting.id === addedDomain.id ? { ...setting, status: "active" } : setting)),
        )
        toast({ title: "CDN Ready!", description: `${addedDomain.domain} is now active on CDN.` })
      }, 5000)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add domain to CDN.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: "active" | "inactive" | "deploying") => {
    if (currentStatus === "deploying") return // Cannot toggle while deploying
    setIsLoading(true)
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      // Simulate API call
      setCdnSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, status: newStatus } : setting)))
      toast({ title: "Success!", description: `CDN for domain status changed to ${newStatus}.` })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update CDN status.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurgeCache = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      setCdnSettings((prev) =>
        prev.map((setting) => (setting.id === id ? { ...setting, lastPurged: new Date().toISOString() } : setting)),
      )
      toast({ title: "Success!", description: "CDN cache purged successfully." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to purge CDN cache.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSetting = async (id: string, field: keyof CdnSetting, value: string | boolean) => {
    setIsLoading(true)
    try {
      // Simulate API call
      setCdnSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, [field]: value } : setting)))
      toast({ title: "Success!", description: "CDN setting updated." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update CDN setting.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "online":
        return "bg-accent-green/20 text-accent-green"
      case "pending":
        return "bg-accent-orange/20 text-accent-orange"
      case "disabled":
      case "offline":
        return "bg-destructive/20 text-destructive"
      case "maintenance":
        return "bg-accent-blue/20 text-accent-blue"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  const totalRequests = zones.reduce((sum, zone) => sum + zone.requests, 0)
  const totalBandwidth = zones.reduce((sum, zone) => sum + Number.parseFloat(zone.bandwidth.replace(/[^\d.]/g, "")), 0)
  const avgCacheHitRatio = zones.reduce((sum, zone) => sum + zone.cacheHitRatio, 0) / zones.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Globe className="w-5 h-5 text-primary" />
            <span>CDN Manager</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-card border-border rounded-lg p-1 mb-6">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="zones"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Zones
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="edge"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Edge Locations
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* CDN Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="custom-card animate-fade-in-up">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-accent-blue mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-accent-blue">{zones.length}</h3>
                <p className="text-muted-foreground text-sm">Active Zones</p>
              </CardContent>
            </div>

            <div className="custom-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 text-accent-green mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-accent-green">{(totalRequests / 1000000).toFixed(1)}M</h3>
                <p className="text-muted-foreground text-sm">Total Requests</p>
              </CardContent>
            </div>

            <div className="custom-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-accent-orange mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-accent-orange">{totalBandwidth.toFixed(1)} TB</h3>
                <p className="text-muted-foreground text-sm">Bandwidth Used</p>
              </CardContent>
            </div>

            <div className="custom-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CardContent className="p-6 text-center">
                <Gauge className="w-8 h-8 text-accent-purple mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-accent-purple">{avgCacheHitRatio.toFixed(1)}%</h3>
                <p className="text-muted-foreground text-sm">Cache Hit Ratio</p>
              </CardContent>
            </div>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="text-foreground">Request Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="hsl(var(--accent-blue))"
                      strokeWidth={2}
                      name="Requests"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="text-foreground">Cache Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cacheHit"
                      stroke="hsl(var(--accent-green))"
                      strokeWidth={2}
                      name="Cache Hit %"
                    />
                    <Line
                      type="monotone"
                      dataKey="latency"
                      stroke="hsl(var(--accent-orange))"
                      strokeWidth={2}
                      name="Latency (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cache Distribution */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Cache Distribution by Content Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cacheTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {cacheTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="space-y-6">
          {/* Create Zone */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Create CDN Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Domain (e.g., example.com)"
                  value={newZoneForm.domain}
                  onChange={(e) => setNewZoneForm((prev) => ({ ...prev, domain: e.target.value }))}
                  className="input-field"
                />
                <Input
                  placeholder="Origin server (IP or domain)"
                  value={newZoneForm.origin}
                  onChange={(e) => setNewZoneForm((prev) => ({ ...prev, origin: e.target.value }))}
                  className="input-field"
                />
                <Button onClick={createZone} className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Zone
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zones List */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">CDN Zones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Domain</th>
                      <th className="p-4 font-medium table-header">Status</th>
                      <th className="p-4 font-medium table-header">Origin</th>
                      <th className="p-4 font-medium table-header">Cache Hit Ratio</th>
                      <th className="p-4 font-medium table-header">Bandwidth</th>
                      <th className="p-4 font-medium table-header">Requests</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((zone, index) => (
                      <tr
                        key={zone.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{zone.domain}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(zone.status)}>{zone.status}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground font-mono text-sm">{zone.origin}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-accent-green h-2 rounded-full"
                                style={{ width: `${zone.cacheHitRatio}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{zone.cacheHitRatio}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{zone.bandwidth}</td>
                        <td className="p-4 text-muted-foreground">{(zone.requests / 1000).toFixed(0)}K</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-destructive/10 text-destructive">
                              <Trash2 className="w-4 h-4" />
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

        <TabsContent value="analytics" className="space-y-6">
          {/* CDN Analytics (Placeholder) */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Zap className="w-5 h-5 text-primary" />
                <span>CDN Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View detailed analytics on CDN performance, traffic, and cache hit ratio. (Feature coming soon)
              </p>
              <Button className="btn-outline-primary mt-4" disabled>
                <Zap className="w-4 h-4 mr-2" /> View Analytics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edge" className="space-y-6">
          {/* Edge Locations */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Edge Locations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Location</th>
                      <th className="p-4 font-medium table-header">Region</th>
                      <th className="p-4 font-medium table-header">Status</th>
                      <th className="p-4 font-medium table-header">Latency</th>
                      <th className="p-4 font-medium table-header">Requests</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edgeLocations.map((location, index) => (
                      <tr
                        key={location.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-accent-blue" />
                            <span className="font-medium text-foreground">
                              {location.city}, {location.country}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{location.region}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(location.status)}>{location.status}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-accent-green" />
                            <span className="text-muted-foreground">{location.latency}ms</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{(location.requests / 1000).toFixed(0)}K</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <Settings className="w-4 h-4" />
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

        <TabsContent value="settings" className="space-y-6">
          {/* Managed CDN Domains */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Cloud className="w-5 h-5 text-primary" />
                <span>Managed CDN Domains</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Domain</th>
                      <th className="p-4 font-medium table-header">Status</th>
                      <th className="p-4 font-medium table-header">Cache Level</th>
                      <th className="p-4 font-medium table-header">SSL</th>
                      <th className="p-4 font-medium table-header">Last Purged</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cdnSettings.length === 0 && !isLoading ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No domains configured for CDN.
                        </td>
                      </tr>
                    ) : (
                      cdnSettings.map((setting, index) => (
                        <tr
                          key={setting.id}
                          className="table-row animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="p-4 font-medium text-foreground">{setting.domain}</td>
                          <td className="p-4">
                            <Badge
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                setting.status === "active"
                                  ? "bg-accent-green/20 text-accent-green"
                                  : setting.status === "deploying"
                                    ? "bg-accent-blue/20 text-accent-blue"
                                    : "bg-muted/20 text-muted-foreground",
                              )}
                            >
                              {setting.status.replace("-", " ")}
                              {setting.status === "deploying" && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Select
                              value={setting.cacheLevel}
                              onValueChange={(value) => handleUpdateSetting(setting.id, "cacheLevel", value)}
                              disabled={setting.status === "deploying" || isLoading}
                            >
                              <SelectTrigger className="input-field w-[120px] h-9 text-sm">
                                <SelectValue placeholder="Cache Level" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="standard" className="hover:bg-muted/50">
                                  Standard
                                </SelectItem>
                                <SelectItem value="aggressive" className="hover:bg-muted/50">
                                  Aggressive
                                </SelectItem>
                                <SelectItem value="bypass" className="hover:bg-muted/50">
                                  Bypass
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            <Switch
                              checked={setting.sslEnabled}
                              onCheckedChange={(checked) => handleUpdateSetting(setting.id, "sslEnabled", checked)}
                              disabled={setting.status === "deploying" || isLoading}
                            />
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {setting.lastPurged === "Never" ? "Never" : new Date(setting.lastPurged).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleStatus(setting.id, setting.status)}
                                disabled={setting.status === "deploying" || isLoading}
                                className={cn(
                                  "btn-outline-primary",
                                  setting.status === "active" ? "text-destructive border-destructive/50" : "",
                                )}
                              >
                                {setting.status === "active" ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                <span className="sr-only">Toggle Status</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePurgeCache(setting.id)}
                                disabled={setting.status !== "active" || isLoading}
                                className="btn-outline-primary"
                              >
                                <RefreshCw className="w-4 h-4" />
                                <span className="sr-only">Purge Cache</span>
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

          {/* Add Domain to CDN */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Cloud className="w-5 h-5 text-primary" />
                <span>Add Domain to CDN</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="newDomain" className="block text-sm font-medium text-muted-foreground mb-2">
                  Domain Name
                </label>
                <Input
                  id="newDomain"
                  placeholder="e.g., yourwebsite.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="input-field"
                />
              </div>
              <Button onClick={handleAddDomain} disabled={isLoading} className="btn-gradient">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Add Domain
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
