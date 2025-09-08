"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Inbox, Archive, Trash2, Plus, Star, Reply, Forward, Search, ArrowLeft, Lock, Unlock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Email {
  id: string
  sender: string
  subject: string
  body: string
  timestamp: string
  read: boolean
  starred: boolean
  folder: "inbox" | "sent" | "drafts" | "starred" | "trash"
}

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "support@example.com",
    subject: "Your recent inquiry",
    body: "Thank you for contacting our support team. We have received your inquiry and will get back to you shortly.",
    timestamp: "2024-01-15 14:30",
    read: false,
    starred: false,
    folder: "inbox",
  },
  {
    id: "2",
    sender: "newsletter@techupdates.com",
    subject: "Weekly Tech News Digest",
    body: "Here's your weekly dose of the latest in technology and innovation...",
    timestamp: "2024-01-15 10:00",
    read: true,
    starred: false,
    folder: "inbox",
  },
  {
    id: "3",
    sender: "me@limitless.com",
    subject: "Project Proposal - Limitless CRM",
    body: "Dear Client, attached is the detailed project proposal for the Limitless CRM...",
    timestamp: "2024-01-14 16:00",
    read: true,
    starred: true,
    folder: "sent",
  },
  {
    id: "4",
    sender: "client@business.com",
    subject: "Meeting Reminder",
    body: "Just a friendly reminder about our meeting tomorrow at 10 AM EST.",
    timestamp: "2024-01-14 09:00",
    read: false,
    starred: false,
    folder: "inbox",
  },
  {
    id: "5",
    sender: "me@limitless.com",
    subject: "Draft: Follow-up on new feature",
    body: "Hi team, I'm drafting a follow-up email regarding the new feature implementation...",
    timestamp: "2024-01-13 11:30",
    read: false,
    starred: false,
    folder: "drafts",
  },
  {
    id: "6",
    sender: "spam@badmail.com",
    subject: "URGENT: Your account is suspended!",
    body: "Click here to verify your account immediately or it will be deleted.",
    timestamp: "2024-01-13 08:00",
    read: false,
    starred: false,
    folder: "trash",
  },
]

export default function WebmailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [selectedFolder, setSelectedFolder] = useState<Email["folder"]>("inbox")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [composeForm, setComposeForm] = useState({ to: "", subject: "", body: "" })
  const [isComposing, setIsComposing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple demo authentication
    if (loginForm.email === "user@limitless.com" && loginForm.password === "webmail2024") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid credentials. Use user@limitless.com/webmail2024")
    }
  }

  const filteredEmails = emails.filter(
    (email) =>
      email.folder === selectedFolder &&
      (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleEmailClick = (email: Email) => {
    setSelectedEmail({ ...email, read: true })
    setEmails(emails.map((e) => (e.id === email.id ? { ...e, read: true } : e)))
  }

  const handleCompose = () => {
    setSelectedEmail(null)
    setComposeForm({ to: "", subject: "", body: "" })
    setIsComposing(true)
  }

  const handleSendEmail = () => {
    if (composeForm.to && composeForm.subject && composeForm.body) {
      const newEmail: Email = {
        id: Date.now().toString(),
        sender: "me@limitless.com",
        subject: composeForm.subject,
        body: composeForm.body,
        timestamp: new Date().toLocaleString(),
        read: true,
        starred: false,
        folder: "sent",
      }
      setEmails([...emails, newEmail])
      setIsComposing(false)
      setComposeForm({ to: "", subject: "", body: "" })
      setSelectedFolder("sent")
    }
  }

  const handleReply = () => {
    if (selectedEmail) {
      setComposeForm({
        to: selectedEmail.sender,
        subject: `Re: ${selectedEmail.subject}`,
        body: `\n\n--- Original Message ---\nFrom: ${selectedEmail.sender}\nSubject: ${selectedEmail.subject}\nDate: ${selectedEmail.timestamp}\n\n${selectedEmail.body}`,
      })
      setIsComposing(true)
    }
  }

  const handleForward = () => {
    if (selectedEmail) {
      setComposeForm({
        to: "",
        subject: `Fwd: ${selectedEmail.subject}`,
        body: `\n\n--- Original Message ---\nFrom: ${selectedEmail.sender}\nSubject: ${selectedEmail.subject}\nDate: ${selectedEmail.timestamp}\n\n${selectedEmail.body}`,
      })
      setIsComposing(true)
    }
  }

  const toggleStar = (emailId: string) => {
    setEmails(emails.map((email) => (email.id === emailId ? { ...email, starred: !email.starred } : email)))
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail((prev) => (prev ? { ...prev, starred: !prev.starred } : null))
    }
  }

  const moveToTrash = (emailId: string) => {
    setEmails(emails.map((email) => (email.id === emailId ? { ...email, folder: "trash" } : email)))
    setSelectedEmail(null)
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
                  <h1 className="text-2xl font-bold text-foreground">LIMITLESS WEBMAIL</h1>
                  <p className="text-sm text-primary">Secure Email Access</p>
                </div>
              </div>
              <CardTitle className="flex items-center justify-center space-x-2 text-xl font-semibold">
                <Lock className="w-6 h-6 text-primary" />
                <span>Webmail Login</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <Input
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
                  Access Webmail
                </Button>
              </form>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: user@limitless.com
                  <br />
                  Password: webmail2024
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
              <h1 className="text-2xl font-bold text-foreground">Limitless Webmail</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">user@limitless.com</Badge>
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

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <Card className="custom-card h-fit">
          <CardContent className="p-4 space-y-2">
            <Button onClick={handleCompose} className="btn-gradient w-full mb-4">
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </Button>
            <Tabs
              defaultValue="inbox"
              value={selectedFolder}
              onValueChange={(value) => {
                setSelectedFolder(value as Email["folder"])
                setSelectedEmail(null)
                setIsComposing(false)
              }}
              orientation="vertical"
            >
              <TabsList className="flex flex-col items-start space-y-1 bg-transparent p-0">
                <TabsTrigger
                  value="inbox"
                  className="w-full justify-start data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  Inbox
                  <Badge className="ml-auto bg-accent-blue/20 text-accent-blue">
                    {emails.filter((e) => e.folder === "inbox" && !e.read).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="sent"
                  className="w-full justify-start data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Sent
                </TabsTrigger>
                <TabsTrigger
                  value="starred"
                  className="w-full justify-start data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Starred
                </TabsTrigger>
                <TabsTrigger
                  value="drafts"
                  className="w-full justify-start data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Drafts
                </TabsTrigger>
                <TabsTrigger
                  value="trash"
                  className="w-full justify-start data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Trash
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="space-y-6">
          {isComposing ? (
            <Card className="custom-card animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-foreground">Compose New Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">To</label>
                  <Input
                    placeholder="recipient@example.com"
                    value={composeForm.to}
                    onChange={(e) => setComposeForm((prev) => ({ ...prev, to: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
                  <Input
                    placeholder="Subject"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm((prev) => ({ ...prev, subject: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Body</label>
                  <Textarea
                    placeholder="Your message here..."
                    value={composeForm.body}
                    onChange={(e) => setComposeForm((prev) => ({ ...prev, body: e.target.value }))}
                    className="input-field min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsComposing(false)} className="btn-outline-primary">
                    Cancel
                  </Button>
                  <Button onClick={handleSendEmail} className="btn-gradient">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : selectedEmail ? (
            <Card className="custom-card animate-fade-in-up">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{selectedEmail.subject}</h2>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={handleReply} className="hover:bg-muted/10">
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleForward} className="hover:bg-muted/10">
                      <Forward className="w-4 h-4 mr-2" />
                      Forward
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStar(selectedEmail.id)}
                      className="hover:bg-muted/10"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          selectedEmail.starred ? "text-accent-orange fill-accent-orange" : "text-muted-foreground",
                        )}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveToTrash(selectedEmail.id)}
                      className="hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  From: <span className="font-medium text-foreground">{selectedEmail.sender}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  To: <span className="font-medium text-foreground">me@limitless.com</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{selectedEmail.timestamp}</div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="custom-card animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground capitalize">
                    {selectedFolder} ({filteredEmails.length})
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 input-field"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr className="text-left">
                        <th className="p-4 font-medium table-header w-8"></th>
                        <th className="p-4 font-medium table-header">Sender</th>
                        <th className="p-4 font-medium table-header">Subject</th>
                        <th className="p-4 font-medium table-header">Date</th>
                        <th className="p-4 font-medium table-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmails.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-muted-foreground">
                            No emails in this folder.
                          </td>
                        </tr>
                      ) : (
                        filteredEmails.map((email, index) => (
                          <tr
                            key={email.id}
                            onClick={() => handleEmailClick(email)}
                            className={cn(
                              "table-row cursor-pointer animate-fade-in-up",
                              !email.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/10",
                            )}
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <td className="p-4">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleStar(email.id)
                                }}
                                className="hover:bg-muted/10"
                              >
                                <Star
                                  className={cn(
                                    "w-4 h-4",
                                    email.starred ? "text-accent-orange fill-accent-orange" : "text-muted-foreground",
                                  )}
                                />
                              </Button>
                            </td>
                            <td className="p-4">
                              <span
                                className={cn("font-medium", !email.read ? "text-foreground" : "text-muted-foreground")}
                              >
                                {email.sender}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={cn(!email.read ? "font-semibold text-foreground" : "text-muted-foreground")}
                              >
                                {email.subject}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground text-sm">{email.timestamp}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleReply()
                                  }}
                                  className="hover:bg-muted/10"
                                >
                                  <Reply className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    moveToTrash(email.id)
                                  }}
                                  className="hover:bg-destructive/10 text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
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
          )}
        </div>
      </div>
    </div>
  )
}
