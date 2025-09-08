"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Globe, Users, HardDrive, Zap } from "lucide-react"

interface TrafficData {
  timestamp: string
  visits: number
  pageviews: number
  bandwidth: number
}

interface VisitorData {
  country: string
  visits: number
  color: string
}

interface TopPage {
  path: string
  pageviews: number
}

interface TopReferrer {
  domain: string
  visits: number
}

const mockTrafficData: TrafficData[] = [
  { timestamp: "00:00", visits: 1200, pageviews: 3500, bandwidth: 120 },
  { timestamp: "04:00", visits: 800, pageviews: 2200, bandwidth: 90 },
  { timestamp: "08:00", visits: 2500, pageviews: 7000, bandwidth: 250 },
  { timestamp: "12:00", visits: 3800, pageviews: 10500, bandwidth: 380 },
  { timestamp: "16:00", visits: 3200, pageviews: 9000, bandwidth: 320 },
  { timestamp: "20:00", visits: 2800, pageviews: 7800, bandwidth: 280 },
]

const mockVisitorData: VisitorData[] = [
  { country: "USA", visits: 4500, color: "hsl(var(--accent-blue))" },
  { country: "Canada", visits: 1200, color: "hsl(var(--accent-green))" },
  { country: "UK", visits: 800, color: "hsl(var(--accent-orange))" },
  { country: "Germany", visits: 600, color: "hsl(var(--accent-purple))" },
  { country: "Australia", visits: 400, color: "hsl(var(--accent-cyan))" },
  { country: "Other", visits: 1500, color: "hsl(var(--muted-foreground))" },
]

const mockTopPages: TopPage[] = [
  { path: "/", pageviews: 15000 },
  { path: "/services", pageviews: 8000 },
  { path: "/projects", pageviews: 6500 },
  { path: "/contact", pageviews: 4200 },
  { path: "/about", pageviews: 3100 },
]

const mockTopReferrers: TopReferrer[] = [
  { domain: "google.com", visits: 7200 },
  { domain: "bing.com", visits: 1500 },
  { domain: "facebook.com", visits: 800 },
  { domain: "linkedin.com", visits: 600 },
  { domain: "direct", visits: 2500 },
]

export default function Statistics() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>(mockTrafficData)
  const [visitorData, setVisitorData] = useState<VisitorData[]>(mockVisitorData)
  const [topPages, setTopPages] = useState<TopPage[]>(mockTopPages)
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>(mockTopReferrers)

  const totalVisits = trafficData.reduce((sum, data) => sum + data.visits, 0)
  const totalPageviews = trafficData.reduce((sum, data) => sum + data.pageviews, 0)
  const totalBandwidth = trafficData.reduce((sum, data) => sum + data.bandwidth, 0)

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="custom-card">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-accent-blue mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-accent-blue">{totalVisits.toLocaleString()}</h3>
            <p className="text-muted-foreground text-sm">Total Visits</p>
          </CardContent>
        </Card>

        <Card className="custom-card">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-accent-green mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-accent-green">{totalPageviews.toLocaleString()}</h3>
            <p className="text-muted-foreground text-sm">Total Pageviews</p>
          </CardContent>
        </Card>

        <Card className="custom-card">
          <CardContent className="p-6 text-center">
            <HardDrive className="w-8 h-8 text-accent-orange mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-accent-orange">{totalBandwidth.toLocaleString()} MB</h3>
            <p className="text-muted-foreground text-sm">Bandwidth Used</p>
          </CardContent>
        </Card>

        <Card className="custom-card">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-accent-purple mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-accent-purple">2.5 min</h3>
            <p className="text-muted-foreground text-sm">Avg. Session Duration</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-card border-border rounded-lg p-1 mb-6">
          <TabsTrigger
            value="traffic"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Traffic
          </TabsTrigger>
          <TabsTrigger
            value="visitors"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Visitors
          </TabsTrigger>
          <TabsTrigger
            value="pages"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Top Pages
          </TabsTrigger>
          <TabsTrigger
            value="referrers"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Referrers
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="text-foreground">Website Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData}>
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
                      dataKey="visits"
                      stroke="hsl(var(--accent-blue))"
                      strokeWidth={2}
                      name="Visits"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="text-foreground">Pageviews & Bandwidth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trafficData}>
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
                    <Area
                      type="monotone"
                      dataKey="pageviews"
                      stroke="hsl(var(--accent-green))"
                      fill="hsl(var(--accent-green))"
                      fillOpacity={0.3}
                      name="Pageviews"
                    />
                    <Area
                      type="monotone"
                      dataKey="bandwidth"
                      stroke="hsl(var(--accent-orange))"
                      fill="hsl(var(--accent-orange))"
                      fillOpacity={0.3}
                      name="Bandwidth (MB)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Visitors by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={visitorData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="visits"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {visitorData.map((entry, index) => (
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {visitorData.map((entry) => (
                    <div key={entry.country} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-muted-foreground">{entry.country}</span>
                      <span className="font-medium text-foreground">{entry.visits.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Pages by Pageviews</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Page Path</th>
                      <th className="p-4 font-medium table-header">Pageviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((page, index) => (
                      <tr
                        key={index}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{page.path}</td>
                        <td className="p-4 text-muted-foreground">{page.pageviews.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Referrers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Domain</th>
                      <th className="p-4 font-medium table-header">Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topReferrers.map((referrer, index) => (
                      <tr
                        key={index}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{referrer.domain}</td>
                        <td className="p-4 text-muted-foreground">{referrer.visits.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Analytics Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Data Retention</h3>
                  <p className="text-sm text-muted-foreground">How long to keep analytics data</p>
                </div>
                <Input defaultValue="365" className="w-24 input-field" placeholder="Days" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Exclude IP Addresses</h3>
                  <p className="text-sm text-muted-foreground">Exclude internal traffic from statistics</p>
                </div>
                <Input placeholder="Comma separated IPs" className="w-64 input-field" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Email Reports</h3>
                  <p className="text-sm text-muted-foreground">Receive weekly or monthly traffic reports</p>
                </div>
                <Button className="btn-gradient">Enabled</Button>
              </div>

              <div className="pt-6 border-t border-border/50">
                <Button className="btn-gradient">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
