"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Scan, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface SecuritySetting {
  id: string
  name: string
  description: string
  enabled: boolean
  status: "active" | "inactive" | "scanning" | "updating"
}

interface FirewallRule {
  id: string
  type: "allow" | "deny"
  protocol: "TCP" | "UDP" | "ICMP" | "Any"
  port: string
  source: string
  destination: string
  status: "active" | "inactive"
}

const mockSecuritySettings: SecuritySetting[] = [
  {
    id: "sec_1",
    name: "Two-Factor Authentication (2FA)",
    description: "Adds an extra layer of security for logins.",
    enabled: true,
    status: "active",
  },
  {
    id: "sec_2",
    name: "Brute Force Protection",
    description: "Blocks repeated failed login attempts.",
    enabled: true,
    status: "active",
  },
  {
    id: "sec_3",
    name: "SSL/TLS Enforcement",
    description: "Forces all connections to use HTTPS.",
    enabled: true,
    status: "active",
  },
  {
    id: "sec_4",
    name: "Malware Scanner",
    description: "Scans your website files for malicious code.",
    enabled: false,
    status: "inactive",
  },
  {
    id: "sec_5",
    name: "IP Blocker",
    description: "Block access from specific IP addresses.",
    enabled: true,
    status: "active",
  },
]

const mockFirewallRules: FirewallRule[] = [
  {
    id: "fw_1",
    type: "allow",
    protocol: "TCP",
    port: "80,443",
    source: "Any",
    destination: "Any",
    status: "active",
  },
  {
    id: "fw_2",
    type: "deny",
    protocol: "TCP",
    port: "22",
    source: "1.2.3.4",
    destination: "Any",
    status: "active",
  },
  {
    id: "fw_3",
    type: "allow",
    protocol: "UDP",
    port: "53",
    source: "Any",
    destination: "Any",
    status: "inactive",
  },
]

export default function SecurityCenter() {
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>(mockSecuritySettings)
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(mockFirewallRules)
  const [newFirewallRule, setNewFirewallRule] = useState({
    type: "allow" as FirewallRule["type"],
    protocol: "TCP" as FirewallRule["protocol"],
    port: "",
    source: "",
    destination: "Any",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleToggleSetting = async (id: string, currentEnabled: boolean) => {
    setIsLoading(true)
    try {
      const newEnabledStatus = !currentEnabled
      // Simulate API call
      setSecuritySettings((prev) =>
        prev.map((setting) =>
          setting.id === id
            ? {
              ...setting,
              enabled: newEnabledStatus,
              status: newEnabledStatus ? "active" : "inactive",
            }
            : setting,
        ),
      )
      toast({ title: "Success!", description: `Setting updated.` })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update setting.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleScanMalware = async () => {
    setIsLoading(true)
    setSecuritySettings((prev) =>
      prev.map((setting) => (setting.id === "sec_4" ? { ...setting, status: "scanning" } : setting)),
    )
    toast({ title: "Scanning...", description: "Malware scan initiated. This may take a few minutes." })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 5000)) // Simulate scan time
      setSecuritySettings((prev) =>
        prev.map((setting) => (setting.id === "sec_4" ? { ...setting, status: "active", enabled: true } : setting)),
      )
      toast({ title: "Scan Complete!", description: "No threats found. Your website is clean." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Malware scan failed.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFirewallRuleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewFirewallRule((prev) => ({ ...prev, [id]: value }))
  }

  const handleFirewallSelectChange = (value: string, field: "type" | "protocol") => {
    setNewFirewallRule((prev) => ({ ...prev, [field]: value as any }))
  }

  const addFirewallRule = async () => {
    if (!newFirewallRule.port || !newFirewallRule.source) {
      toast({ title: "Error", description: "Port and Source are required for firewall rule.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      // Simulate API call
      const newRule: FirewallRule = {
        id: `fw_${Date.now()}`,
        status: "active",
        ...newFirewallRule,
      }
      setFirewallRules((prev) => [...prev, newRule])
      setNewFirewallRule({ type: "allow", protocol: "TCP", port: "", source: "", destination: "Any" })
      toast({ title: "Success!", description: "Firewall rule added." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add firewall rule.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFirewallRuleStatus = async (id: string, currentStatus: string) => {
    setIsLoading(true)
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      // Simulate API call
      setFirewallRules((prev) =>
        prev.map((rule) => (rule.id === id ? { ...rule, status: newStatus as "active" | "inactive" } : rule)),
      )
      toast({ title: "Success!", description: `Firewall rule status changed to ${newStatus}.` })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update firewall rule status.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFirewallRule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this firewall rule?")) return
    setIsLoading(true)
    try {
      // Simulate API call
      setFirewallRules((prev) => prev.filter((rule) => rule.id !== id))
      toast({ title: "Success!", description: "Firewall rule deleted." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete firewall rule.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securitySettings.map((setting, index) => (
            <div
              key={setting.id}
              className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div>
                <h3 className="font-medium text-foreground">{setting.name}</h3>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {setting.id === "sec_4" && setting.status === "scanning" ? (
                  <Badge className="bg-accent-blue/20 text-accent-blue">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Scanning...
                  </Badge>
                ) : (
                  <Badge
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      setting.status === "active"
                        ? "bg-accent-green/20 text-accent-green"
                        : "bg-muted/20 text-muted-foreground",
                    )}
                  >
                    {setting.status}
                  </Badge>
                )}
                {setting.id === "sec_4" ? (
                  <Button
                    size="sm"
                    onClick={handleScanMalware}
                    disabled={isLoading || setting.status === "scanning"}
                    className="btn-outline-primary"
                  >
                    <Scan className="w-4 h-4 mr-2" /> Scan Now
                  </Button>
                ) : (
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => handleToggleSetting(setting.id, setting.enabled)}
                    disabled={isLoading}
                  />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Firewall Management */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Lock className="w-5 h-5 text-primary" />
            <span>Firewall Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Plus className="w-5 h-5 text-accent-blue" />
              <span>Add New Firewall Rule</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="ruleType" className="block text-sm font-medium text-muted-foreground mb-2">
                  Type
                </label>
                <Select
                  value={newFirewallRule.type}
                  onValueChange={(value) => handleFirewallSelectChange(value, "type")}
                >
                  <SelectTrigger id="ruleType" className="input-field">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="allow" className="hover:bg-muted/50">
                      Allow
                    </SelectItem>
                    <SelectItem value="deny" className="hover:bg-muted/50">
                      Deny
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="protocol" className="block text-sm font-medium text-muted-foreground mb-2">
                  Protocol
                </label>
                <Select
                  value={newFirewallRule.protocol}
                  onValueChange={(value) => handleFirewallSelectChange(value, "protocol")}
                >
                  <SelectTrigger id="protocol" className="input-field">
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="TCP" className="hover:bg-muted/50">
                      TCP
                    </SelectItem>
                    <SelectItem value="UDP" className="hover:bg-muted/50">
                      UDP
                    </SelectItem>
                    <SelectItem value="ICMP" className="hover:bg-muted/50">
                      ICMP
                    </SelectItem>
                    <SelectItem value="Any" className="hover:bg-muted/50">
                      Any
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="port" className="block text-sm font-medium text-muted-foreground mb-2">
                  Port(s)
                </label>
                <Input
                  id="port"
                  placeholder="e.g., 80,443 or 22"
                  value={newFirewallRule.port}
                  onChange={handleFirewallRuleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-muted-foreground mb-2">
                  Source IP/Range
                </label>
                <Input
                  id="source"
                  placeholder="e.g., Any or 192.168.1.0/24"
                  value={newFirewallRule.source}
                  onChange={handleFirewallRuleChange}
                  className="input-field"
                />
              </div>
            </div>
            <Button onClick={addFirewallRule} disabled={isLoading} className="btn-gradient">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Add Rule
                </>
              )}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr className="text-left">
                  <th className="p-4 font-medium table-header">Type</th>
                  <th className="p-4 font-medium table-header">Protocol</th>
                  <th className="p-4 font-medium table-header">Port(s)</th>
                  <th className="p-4 font-medium table-header">Source</th>
                  <th className="p-4 font-medium table-header">Destination</th>
                  <th className="p-4 font-medium table-header">Status</th>
                  <th className="p-4 font-medium table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {firewallRules.map((rule, index) => (
                  <tr
                    key={rule.id}
                    className="table-row animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4">
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium capitalize",
                          rule.type === "allow"
                            ? "bg-accent-green/20 text-accent-green"
                            : "bg-destructive/20 text-destructive",
                        )}
                      >
                        {rule.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{rule.protocol}</td>
                    <td className="p-4 text-muted-foreground">{rule.port}</td>
                    <td className="p-4 text-muted-foreground">{rule.source}</td>
                    <td className="p-4 text-muted-foreground">{rule.destination}</td>
                    <td className="p-4">
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          rule.status === "active"
                            ? "bg-accent-green/20 text-accent-green"
                            : "bg-muted/20 text-muted-foreground",
                        )}
                      >
                        {rule.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFirewallRuleStatus(rule.id, rule.status)}
                          className={cn(
                            "btn-outline-primary",
                            rule.status === "active" ? "text-destructive border-destructive/50" : "",
                          )}
                        >
                          {rule.status === "active" ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span className="sr-only">Toggle Status</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteFirewallRule(rule.id)}
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
    </div>
  )
}
