"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus, Trash2, Key, Users, Settings, Forward, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface EmailAccount {
  id: string
  address: string
  storage: string
  created: string
}

interface EmailForwarder {
  id: string
  from: string
  to: string
  created: string
}

interface MailingList {
  id: string
  name: string
  members: number
  created: string
}

const mockEmailAccounts: EmailAccount[] = [
  {
    id: "1",
    address: "admin@limitless.com",
    storage: "1000 MB",
    created: "2024-01-10",
  },
  {
    id: "2",
    address: "support@limitless.com",
    storage: "500 MB",
    created: "2024-01-12",
  },
  {
    id: "3",
    address: "info@limitless.com",
    storage: "250 MB",
    created: "2024-01-08",
  },
]

const mockForwarders: EmailForwarder[] = [
  {
    id: "1",
    from: "sales@limitless.com",
    to: "admin@limitless.com",
    created: "2024-01-10",
  },
  {
    id: "2",
    from: "contact@limitless.com",
    to: "support@limitless.com",
    created: "2024-01-12",
  },
]

const mockMailingLists: MailingList[] = [
  {
    id: "1",
    name: "newsletter@limitless.com",
    members: 1247,
    created: "2024-01-08",
  },
  {
    id: "2",
    name: "updates@limitless.com",
    members: 89,
    created: "2024-01-10",
  },
]

export default function EmailManager() {
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>(mockEmailAccounts)
  const [forwarders, setForwarders] = useState<EmailForwarder[]>(mockForwarders)
  const [mailingLists, setMailingLists] = useState<MailingList[]>(mockMailingLists)
  const [activeTab, setActiveTab] = useState<"accounts" | "forwarders" | "lists">("accounts")
  const [newEmailAddress, setNewEmailAddress] = useState("")
  const [newEmailPassword, setNewEmailPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchEmailAccounts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/email/accounts")
      const data = await response.json()
      if (data.success) {
        setEmailAccounts(data.accounts)
      } else {
        throw new Error(data.error || "Failed to fetch email accounts.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load email accounts.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmailAccounts()
  }, [])

  const handleCreateEmailAccount = async () => {
    if (!newEmailAddress.trim() || !newEmailPassword.trim()) {
      toast({ title: "Error", description: "Email address and password are required.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/email/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", address: newEmailAddress, password: newEmailPassword }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Email account created successfully." })
        setEmailAccounts((prev) => [...prev, data.account])
        setNewEmailAddress("")
        setNewEmailPassword("")
      } else {
        throw new Error(data.error || "Failed to create email account.")
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

  const handleDeleteEmailAccount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this email account? This action cannot be undone.")) {
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/email/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: "Email account deleted successfully." })
        setEmailAccounts((prev) => prev.filter((account) => account.id !== id))
      } else {
        throw new Error(data.error || "Failed to delete email account.")
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

  const handleChangePassword = async (id: string, currentAddress: string) => {
    const newPassword = prompt(`Enter new password for ${currentAddress}:`)
    if (!newPassword) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/cpanel/email/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", id, password: newPassword }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Success!", description: `Password for ${currentAddress} changed.` })
      } else {
        throw new Error(data.error || "Failed to change password.")
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

  const createForwarder = () => {
    // Placeholder for createForwarder logic
  }

  const deleteForwarder = (id: string) => {
    // Placeholder for deleteForwarder logic
  }

  return (
    <div className="space-y-6">
      {/* Email Manager Header */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Mail className="w-5 h-5 text-primary" />
            <span>Email Manager</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setActiveTab("accounts")}
              className={cn(activeTab === "accounts" ? "btn-gradient" : "btn-outline-primary")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Accounts
            </Button>
            <Button
              onClick={() => setActiveTab("forwarders")}
              className={cn(activeTab === "forwarders" ? "btn-gradient" : "btn-outline-primary")}
            >
              <Forward className="w-4 h-4 mr-2" />
              Forwarders
            </Button>
            <Button
              onClick={() => setActiveTab("lists")}
              className={cn(activeTab === "lists" ? "btn-gradient" : "btn-outline-primary")}
            >
              <Users className="w-4 h-4 mr-2" />
              Mailing Lists
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeTab === "accounts" && (
        <>
          {/* Create Email Account */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Create Email Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Email Address"
                  value={newEmailAddress}
                  onChange={(e) => setNewEmailAddress(e.target.value)}
                  className="input-field"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newEmailPassword}
                  onChange={(e) => setNewEmailPassword(e.target.value)}
                  className="input-field"
                />
                <Button onClick={handleCreateEmailAccount} className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Accounts List */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Email Accounts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Email Address</th>
                      <th className="p-4 font-medium table-header">Storage</th>
                      <th className="p-4 font-medium table-header">Created</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailAccounts.map((account, index) => (
                      <tr
                        key={account.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{account.address}</td>
                        <td className="p-4 text-muted-foreground">{account.storage}</td>
                        <td className="p-4 text-muted-foreground">{account.created}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-muted/10"
                              onClick={() => handleChangePassword(account.id, account.address)}
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteEmailAccount(account.id)}
                              className="hover:bg-destructive/10 text-destructive"
                            >
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
        </>
      )}

      {activeTab === "forwarders" && (
        <>
          {/* Create Forwarder */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Create Email Forwarder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Placeholder for From email address input */}
                {/* Placeholder for To email address input */}
                <Button onClick={createForwarder} className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Forwarder
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Forwarders List */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Email Forwarders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">From</th>
                      <th className="p-4 font-medium table-header">To</th>
                      <th className="p-4 font-medium table-header">Created</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forwarders.map((forwarder, index) => (
                      <tr
                        key={forwarder.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{forwarder.from}</td>
                        <td className="p-4 text-muted-foreground">{forwarder.to}</td>
                        <td className="p-4 text-muted-foreground">{forwarder.created}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteForwarder(forwarder.id)}
                              className="hover:bg-destructive/10 text-destructive"
                            >
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
        </>
      )}

      {activeTab === "lists" && (
        <Card className="custom-card">
          <CardHeader>
            <CardTitle className="text-foreground">Mailing Lists</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50">
                  <tr className="text-left">
                    <th className="p-4 font-medium table-header">List Name</th>
                    <th className="p-4 font-medium table-header">Members</th>
                    <th className="p-4 font-medium table-header">Created</th>
                    <th className="p-4 font-medium table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mailingLists.map((list, index) => (
                    <tr
                      key={list.id}
                      className="table-row animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-4 font-medium text-foreground">{list.name}</td>
                      <td className="p-4">
                        <Badge className="bg-accent-blue/20 text-accent-blue">{list.members}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{list.created}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                            <Users className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                            <Settings className="w-4 h-4" />
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
      )}

      {/* Email Statistics */}
      <Card className="custom-card">
        <CardHeader>
          <CardTitle className="text-foreground">Email Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-blue">{emailAccounts.length}</div>
              <div className="text-muted-foreground">Email Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-green">{forwarders.length}</div>
              <div className="text-muted-foreground">Forwarders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-orange">{mailingLists.length}</div>
              <div className="text-muted-foreground">Mailing Lists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-purple">490 MB</div>
              <div className="text-muted-foreground">Total Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
