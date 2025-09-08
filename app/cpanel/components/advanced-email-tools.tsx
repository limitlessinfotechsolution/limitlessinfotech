"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Filter, Reply, Forward, Plus, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface EmailFilter {
  id: string
  name: string
  condition: string
  action: string
  status: "active" | "inactive"
}

interface AutoResponder {
  id: string
  email: string
  subject: string
  body: string
  status: "active" | "inactive"
}

const mockEmailFilters: EmailFilter[] = [
  {
    id: "filter_1",
    name: "Spam Blocker",
    condition: "Subject contains 'promo' OR 'discount'",
    action: "Move to Spam",
    status: "active",
  },
  {
    id: "filter_2",
    name: "Client Priority",
    condition: "From 'client@important.com'",
    action: "Mark as Important",
    status: "active",
  },
  {
    id: "filter_3",
    name: "Newsletter Archive",
    condition: "From 'newsletter@example.com'",
    action: "Move to Archive",
    status: "inactive",
  },
]

const mockAutoResponders: AutoResponder[] = [
  {
    id: "ar_1",
    email: "support@limitless.com",
    subject: "Thank you for your inquiry!",
    body: "We have received your message and will get back to you within 24 hours.",
    status: "active",
  },
  {
    id: "ar_2",
    email: "sales@limitless.com",
    subject: "Out of Office",
    body: "I am currently out of office and will respond to your email upon my return.",
    status: "inactive",
  },
]

export default function AdvancedEmailTools() {
  const [emailFilters, setEmailFilters] = useState<EmailFilter[]>(mockEmailFilters)
  const [autoResponders, setAutoResponders] = useState<AutoResponder[]>(mockAutoResponders)
  const [newFilter, setNewFilter] = useState({ name: "", condition: "", action: "", status: "active" })
  const [newAutoResponder, setNewAutoResponder] = useState({
    email: "",
    subject: "",
    body: "",
    status: "active",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewFilter((prev) => ({ ...prev, [id]: value }))
  }

  const handleAutoResponderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewAutoResponder((prev) => ({ ...prev, [id]: value }))
  }

  const handleFilterSelectChange = (value: string, field: "status" | "action") => {
    setNewFilter((prev) => ({
      ...prev,
      [field]: field === "status" ? (value as EmailFilter["status"]) : value
    }))
  }



  const addEmailFilter = async () => {
    if (!newFilter.name || !newFilter.condition || !newFilter.action) {
      toast({ title: "Error", description: "All filter fields are required.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      // Simulate API call
      const response = await fetch("/api/cpanel/email/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", ...newFilter }),
      })
      const data = await response.json()
      if (data.success) {
        setEmailFilters((prev) => [...prev, { ...newFilter, id: `filter_${Date.now()}` }])
        setNewFilter({ name: "", condition: "", action: "", status: "active" })
        toast({ title: "Success!", description: "Email filter added." })
      } else {
        throw new Error(data.error || "Failed to add filter.")
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

  const toggleFilterStatus = async (id: string, currentStatus: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      const response = await fetch("/api/cpanel/email/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", id, status: newStatus }),
      })
      const data = await response.json()
      if (data.success) {
        setEmailFilters((prev) =>
          prev.map((filter) => (filter.id === id ? { ...filter, status: newStatus as "active" | "inactive" } : filter)),
        )
        toast({ title: "Success!", description: `Filter status changed to ${newStatus}.` })
      } else {
        throw new Error(data.error || "Failed to update filter status.")
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

  const deleteEmailFilter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this filter?")) return
    setIsLoading(true)
    try {
      // Simulate API call
      const response = await fetch("/api/cpanel/email/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        setEmailFilters((prev) => prev.filter((filter) => filter.id !== id))
        toast({ title: "Success!", description: "Email filter deleted." })
      } else {
        throw new Error(data.error || "Failed to delete filter.")
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

  const addAutoResponder = async () => {
    if (!newAutoResponder.email || !newAutoResponder.subject || !newAutoResponder.body) {
      toast({ title: "Error", description: "All auto-responder fields are required.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      // Simulate API call
      const response = await fetch("/api/cpanel/email/autoresponders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", ...newAutoResponder }),
      })
      const data = await response.json()
      if (data.success) {
        setAutoResponders((prev) => [...prev, { ...newAutoResponder, id: `ar_${Date.now()}` }])
        setNewAutoResponder({ email: "", subject: "", body: "", status: "active" })
        toast({ title: "Success!", description: "Auto-responder added." })
      } else {
        throw new Error(data.error || "Failed to add auto-responder.")
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

  const toggleAutoResponderStatus = async (id: string, currentStatus: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      const response = await fetch("/api/cpanel/email/autoresponders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", id, status: newStatus }),
      })
      const data = await response.json()
      if (data.success) {
        setAutoResponders((prev) =>
          prev.map((ar) => (ar.id === id ? { ...ar, status: newStatus as "active" | "inactive" } : ar)),
        )
        toast({ title: "Success!", description: `Auto-responder status changed to ${newStatus}.` })
      } else {
        throw new Error(data.error || "Failed to update auto-responder status.")
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

  const deleteAutoResponder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this auto-responder?")) return
    setIsLoading(true)
    try {
      // Simulate API call
      const response = await fetch("/api/cpanel/email/autoresponders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        setAutoResponders((prev) => prev.filter((ar) => ar.id !== id))
        toast({ title: "Success!", description: "Auto-responder deleted." })
      } else {
        throw new Error(data.error || "Failed to delete auto-responder.")
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
      {/* Email Filters */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Filter className="w-5 h-5 text-primary" />
            <span>Email Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Plus className="w-5 h-5 text-accent-blue" />
              <span>Add New Filter</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                  Filter Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Spam Blocker"
                  value={newFilter.name}
                  onChange={handleFilterChange}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-muted-foreground mb-2">
                  Condition (e.g., Subject contains 'spam')
                </label>
                <Input
                  id="condition"
                  placeholder="e.g., From 'bad-sender.com'"
                  value={newFilter.condition}
                  onChange={handleFilterChange}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label htmlFor="action" className="block text-sm font-medium text-muted-foreground mb-2">
                Action
              </label>
              <Select value={newFilter.action} onValueChange={(value) => handleFilterSelectChange(value, "action")}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Move to Spam" className="hover:bg-muted/50">
                    Move to Spam
                  </SelectItem>
                  <SelectItem value="Delete" className="hover:bg-muted/50">
                    Delete
                  </SelectItem>
                  <SelectItem value="Mark as Read" className="hover:bg-muted/50">
                    Mark as Read
                  </SelectItem>
                  <SelectItem value="Mark as Important" className="hover:bg-muted/50">
                    Mark as Important
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addEmailFilter} disabled={isLoading} className="btn-gradient">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Add Filter
                </>
              )}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr className="text-left">
                  <th className="p-4 font-medium table-header">Name</th>
                  <th className="p-4 font-medium table-header">Condition</th>
                  <th className="p-4 font-medium table-header">Action</th>
                  <th className="p-4 font-medium table-header">Status</th>
                  <th className="p-4 font-medium table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emailFilters.map((filter, index) => (
                  <tr
                    key={filter.id}
                    className="table-row animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4 font-medium text-foreground">{filter.name}</td>
                    <td className="p-4 text-muted-foreground">{filter.condition}</td>
                    <td className="p-4 text-muted-foreground">{filter.action}</td>
                    <td className="p-4">
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          filter.status === "active"
                            ? "bg-accent-green/20 text-accent-green"
                            : "bg-muted/20 text-muted-foreground",
                        )}
                      >
                        {filter.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFilterStatus(filter.id, filter.status)}
                          className={cn(
                            "btn-outline-primary",
                            filter.status === "active" ? "text-destructive border-destructive/50" : "",
                          )}
                        >
                          {filter.status === "active" ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span className="sr-only">Toggle Status</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteEmailFilter(filter.id)}
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

      {/* Auto Responders */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Reply className="w-5 h-5 text-primary" />
            <span>Auto Responders</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Plus className="w-5 h-5 text-accent-blue" />
              <span>Add New Auto Responder</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="arEmail" className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Account
                </label>
                <Input
                  id="arEmail"
                  placeholder="e.g., support@yourdomain.com"
                  value={newAutoResponder.email}
                  onChange={handleAutoResponderChange}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="arSubject" className="block text-sm font-medium text-muted-foreground mb-2">
                  Subject
                </label>
                <Input
                  id="arSubject"
                  placeholder="e.g., Thank you for your message!"
                  value={newAutoResponder.subject}
                  onChange={handleAutoResponderChange}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label htmlFor="arBody" className="block text-sm font-medium text-muted-foreground mb-2">
                Body
              </label>
              <Textarea
                id="arBody"
                placeholder="Your auto-response message..."
                rows={5}
                value={newAutoResponder.body}
                onChange={handleAutoResponderChange}
                className="input-field"
              />
            </div>
            <Button onClick={addAutoResponder} disabled={isLoading} className="btn-gradient">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Add Auto Responder
                </>
              )}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr className="text-left">
                  <th className="p-4 font-medium table-header">Email</th>
                  <th className="p-4 font-medium table-header">Subject</th>
                  <th className="p-4 font-medium table-header">Status</th>
                  <th className="p-4 font-medium table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {autoResponders.map((responder, index) => (
                  <tr
                    key={responder.id}
                    className="table-row animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4 font-medium text-foreground">{responder.email}</td>
                    <td className="p-4 text-muted-foreground">{responder.subject}</td>
                    <td className="p-4">
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          responder.status === "active"
                            ? "bg-accent-green/20 text-accent-green"
                            : "bg-muted/20 text-muted-foreground",
                        )}
                      >
                        {responder.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAutoResponderStatus(responder.id, responder.status)}
                          className={cn(
                            "btn-outline-primary",
                            responder.status === "active" ? "text-destructive border-destructive/50" : "",
                          )}
                        >
                          {responder.status === "active" ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span className="sr-only">Toggle Status</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteAutoResponder(responder.id)}
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

      {/* Email Forwarders (Placeholder) */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Forward className="w-5 h-5 text-primary" />
            <span>Email Forwarders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage email forwarders to redirect incoming emails to other addresses. (Feature coming soon)
          </p>
          <Button className="btn-outline-primary mt-4" disabled>
            <Plus className="w-4 h-4 mr-2" /> Add Forwarder
          </Button>
        </CardContent>
      </Card>

      {/* Mailing Lists (Placeholder) */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Mail className="w-5 h-5 text-primary" />
            <span>Mailing Lists</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create and manage mailing lists for group communication. (Feature coming soon)
          </p>
          <Button className="btn-outline-primary mt-4" disabled>
            <Plus className="w-4 h-4 mr-2" /> Create Mailing List
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
