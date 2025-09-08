"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Send,
  Eye,
  GitBranch,
  Shield,
  ArrowRight,
  Zap,
  Star,
  Flag,
  Loader2,
} from "lucide-react"
import { DatabaseService, type ApprovalRequest, type ApprovalComment } from "@/lib/database"
import { supabase } from "@/lib/database" // Import supabase client
import { cn } from "@/lib/utils"

// Mock data for users to display names (ideally fetched from DB)
const mockUsers = [
  { id: "EMP001", name: "John Doe", avatar: "👨‍💻" },
  { id: "EMP002", name: "Sarah Smith", avatar: "👩‍🎨" },
  { id: "EMP003", name: "Mike Johnson", avatar: "👨‍💼" },
  { id: "CLIENT001", name: "Client A", avatar: "🏢" },
]

function getUserName(userId: string) {
  return mockUsers.find((u) => u.id === userId)?.name || "Unknown User"
}

export default function ApprovalWorkflow() {
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)
  const [requests, setRequests] = useState<ApprovalRequest[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentType, setCommentType] = useState<"comment" | "approval" | "rejection" | "change-request">("comment")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchApprovalRequests = useCallback(async () => {
    setLoading(true)
    try {
      const data = await DatabaseService.getApprovalRequests()
      setRequests(data || [])
      if (!selectedRequest && data && data.length > 0) {
        setSelectedRequest(data[0]) // Select the first request by default
      } else if (selectedRequest) {
        // If a request was already selected, update its details
        const updatedSelected = data?.find((req) => req.id === selectedRequest.id)
        if (updatedSelected) {
          setSelectedRequest(updatedSelected)
        } else if (data && data.length > 0) {
          setSelectedRequest(data[0]) // Fallback to first if selected was deleted
        } else {
          setSelectedRequest(null)
        }
      }
    } catch (error) {
      console.error("Error fetching approval requests:", error)
      toast({
        title: "Error",
        description: "Failed to load approval requests.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [selectedRequest, toast])

  useEffect(() => {
    fetchApprovalRequests()

    const approvalChannel = supabase
      .channel("public:approval_requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "approval_requests" }, (payload) => {
        const changedRequest = payload.new as ApprovalRequest
        setRequests((prevRequests) => {
          const existingIndex = prevRequests.findIndex((req) => req.id === changedRequest.id)
          if (existingIndex > -1) {
            // Update existing request
            return prevRequests.map((req, i) => (i === existingIndex ? changedRequest : req))
          } else {
            // Add new request
            return [changedRequest, ...prevRequests]
          }
        })
        // Update selected request if it's the one that changed
        if (selectedRequest && selectedRequest.id === changedRequest.id) {
          setSelectedRequest(changedRequest)
        }
        toast({
          title: "Approval Update!",
          description: `Approval request "${changedRequest.title}" was ${payload.eventType}.`,
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(approvalChannel)
    }
  }, [fetchApprovalRequests, selectedRequest, toast])

  const addComment = async () => {
    if (!newComment.trim() || !selectedRequest) return

    const comment: Partial<ApprovalComment> = {
      author_id: "EMP003", // Replace with actual current user ID
      content: newComment,
      timestamp: new Date().toISOString(),
      type: commentType,
    }

    try {
      // Optimistic update
      const tempCommentId = Date.now().toString()
      const optimisticComment = { ...comment, id: tempCommentId, author_id: "EMP003" } as ApprovalComment // Assuming EMP003 is current user for demo
      const updatedComments = [...selectedRequest.comments, optimisticComment]
      setSelectedRequest({ ...selectedRequest, comments: updatedComments })

      const updatedRequest = await DatabaseService.updateApprovalRequest(selectedRequest.id, {
        comments: updatedComments,
      })

      if (updatedRequest) {
        // Realtime will handle the actual state update, so no need to set here
        setNewComment("")
        toast({
          title: "Comment Added",
          description: "Your comment has been added to the approval request",
        })
      } else {
        // Revert optimistic update if failed
        setSelectedRequest({ ...selectedRequest, comments: selectedRequest.comments })
        toast({
          title: "Error",
          description: "Failed to add comment.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      // Revert optimistic update if failed
      setSelectedRequest({ ...selectedRequest, comments: selectedRequest.comments })
      toast({
        title: "Error",
        description: "Network error adding comment.",
        variant: "destructive",
      })
    }
  }

  const updateApprovalStep = async (stepId: string, status: "approved" | "rejected", comments?: string) => {
    if (!selectedRequest) return

    const updatedSteps = selectedRequest.approval_steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            status,
            completed_at: new Date().toISOString(),
            comments: comments || step.comments,
          }
        : step,
    )

    // Check if all required steps are completed
    const allRequiredCompleted = updatedSteps
      .filter((step) => step.required)
      .every((step) => step.status === "approved" || step.status === "rejected")

    const hasRejectedStep = updatedSteps.some((step) => step.status === "rejected" && step.required)

    let newStatus = selectedRequest.status
    if (allRequiredCompleted) {
      newStatus = hasRejectedStep ? "rejected" : "approved"
    } else if (status === "approved" || status === "rejected") {
      newStatus = "in-review" // If a step is acted upon, it's in review
    }

    try {
      // Optimistic update
      setSelectedRequest({ ...selectedRequest, approval_steps: updatedSteps, status: newStatus })

      const updatedRequest = await DatabaseService.updateApprovalRequest(selectedRequest.id, {
        approval_steps: updatedSteps,
        status: newStatus,
      })

      if (updatedRequest) {
        // Realtime will handle the actual state update, so no need to set here
        toast({
          title: status === "approved" ? "Step Approved" : "Step Rejected",
          description: `Approval step has been ${status}`,
        })
      } else {
        // Revert optimistic update if failed
        setSelectedRequest(selectedRequest) // Revert to original state
        toast({
          title: "Error",
          description: `Failed to ${status} step.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating approval step:", error)
      // Revert optimistic update if failed
      setSelectedRequest(selectedRequest) // Revert to original state
      toast({
        title: "Error",
        description: "Network error updating approval step.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-accent-green/20 text-accent-green"
      case "rejected":
        return "bg-destructive/20 text-destructive"
      case "in-review":
        return "bg-primary/20 text-primary"
      case "changes-requested":
        return "bg-accent-orange/20 text-accent-orange"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive/20 text-destructive"
      case "high":
        return "bg-accent-orange/20 text-accent-orange"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300"
      case "low":
        return "bg-accent-green/20 text-accent-green"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "design":
        return <FileText className="w-4 h-4 text-accent-purple" />
      case "code":
        return <GitBranch className="w-4 h-4 text-accent-blue" />
      case "deployment":
        return <Zap className="w-4 h-4 text-accent-cyan" />
      case "hotfix":
        return <Shield className="w-4 h-4 text-destructive" />
      case "feature":
        return <Star className="w-4 h-4 text-yellow-400" />
      default:
        return <Flag className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-accent-green" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-destructive" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />
      case "skipped":
        return <ArrowRight className="w-5 h-5 text-muted-foreground" />
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority
    return matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <Card className="custom-card p-6 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Loading Approvals...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Approval Workflow Header */}
      <Card className="custom-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span>Approval Workflow</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all" className="bg-dark-blue-800">
                  All Status
                </option>
                <option value="pending" className="bg-dark-blue-800">
                  Pending
                </option>
                <option value="in-review" className="bg-dark-blue-800">
                  In Review
                </option>
                <option value="approved" className="bg-dark-blue-800">
                  Approved
                </option>
                <option value="rejected" className="bg-dark-blue-800">
                  Rejected
                </option>
                <option value="changes-requested" className="bg-dark-blue-800">
                  Changes Requested
                </option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all" className="bg-dark-blue-800">
                  All Priority
                </option>
                <option value="critical" className="bg-dark-blue-800">
                  Critical
                </option>
                <option value="high" className="bg-dark-blue-800">
                  High
                </option>
                <option value="medium" className="bg-dark-blue-800">
                  Medium
                </option>
                <option value="low" className="bg-dark-blue-800">
                  Low
                </option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {requests.filter((r) => r.status === "pending" || r.status === "in-review").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Approval</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-green">
                {requests.filter((r) => r.status === "approved").length}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {requests.filter((r) => r.status === "rejected").length}
              </div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-orange">
                {requests.filter((r) => r.status === "changes-requested").length}
              </div>
              <div className="text-sm text-muted-foreground">Changes Requested</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Approval Requests List */}
        <div className="lg:col-span-4">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Approval Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredRequests.length === 0 ? (
                <p className="text-muted-foreground text-center">No approval requests found.</p>
              ) : (
                filteredRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRequest(request)}
                    className={cn(
                      "p-4 rounded-lg cursor-pointer border transition-all",
                      selectedRequest?.id === request.id
                        ? "bg-primary/20 border-primary/30"
                        : "bg-muted/10 border-border hover:bg-muted/20",
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getTypeIcon(request.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm text-foreground">{request.title}</h3>
                          {request.client_visible && (
                            <Badge className="bg-accent-purple/20 text-accent-purple text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Client
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{request.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                getStatusColor(request.status),
                              )}
                              size="sm"
                            >
                              {request.status}
                            </Badge>
                            <Badge
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                getPriorityColor(request.priority),
                              )}
                              size="sm"
                            >
                              {request.priority}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {request.approval_steps.filter((s) => s.status === "approved").length}/
                            {request.approval_steps.filter((s) => s.required).length}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>by {getUserName(request.requested_by)}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(request.requested_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Approval Details */}
        <div className="lg:col-span-8">
          {!selectedRequest ? (
            <Card className="custom-card p-6 flex items-center justify-center min-h-[300px]">
              <p className="text-muted-foreground text-center">Select an approval request to view details.</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Request Details */}
              <Card className="custom-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2 text-foreground">
                        {getTypeIcon(selectedRequest.type)}
                        <span>{selectedRequest.title}</span>
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">{selectedRequest.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          getStatusColor(selectedRequest.status),
                        )}
                      >
                        {selectedRequest.status}
                      </Badge>
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          getPriorityColor(selectedRequest.priority),
                        )}
                      >
                        {selectedRequest.priority}
                      </Badge>
                      {selectedRequest.client_visible && (
                        <Badge className="bg-accent-purple/20 text-accent-purple">
                          <Eye className="w-3 h-3 mr-1" />
                          Client Visible
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3 text-foreground">Request Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Requested by:</span>
                          <span className="text-foreground">{getUserName(selectedRequest.requested_by)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Project ID:</span>
                          <span className="text-foreground">{selectedRequest.project_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className="text-foreground">
                            {new Date(selectedRequest.due_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="capitalize text-foreground">{selectedRequest.type}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3 text-foreground">Assigned To</h3>
                      <ul className="space-y-1 text-sm">
                        {selectedRequest.assigned_to.map((userId, index) => (
                          <li key={index} className="flex items-center space-x-2 text-foreground">
                            <User className="w-3 h-3 text-primary" />
                            <span>{getUserName(userId)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {selectedRequest.files && selectedRequest.files.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3 text-foreground">Attached Files</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.files.map((file) => (
                          <Badge key={file} className="bg-primary/20 text-primary">
                            <FileText className="w-3 h-3 mr-1" />
                            {file}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedRequest.changes && selectedRequest.changes.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3 text-foreground">Changes</h3>
                      <ul className="space-y-1 text-sm">
                        {selectedRequest.changes.map((change, index) => (
                          <li key={index} className="flex items-center space-x-2 text-foreground">
                            <CheckCircle className="w-3 h-3 text-accent-green" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Approval Steps */}
              <Card className="custom-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Approval Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedRequest.approval_steps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-4 rounded-lg bg-muted/10 border border-border"
                      >
                        <div className="flex-shrink-0">{getStepStatusIcon(step.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-foreground">
                              Step {step.step_number}: {step.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {step.required && (
                                <Badge className="bg-destructive/20 text-destructive text-xs">Required</Badge>
                              )}
                              <Badge
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-xs font-medium",
                                  getStatusColor(step.status),
                                )}
                              >
                                {step.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Assigned to: {getUserName(step.assigned_to)}
                            </span>
                            {step.completed_at && (
                              <span className="text-xs text-muted-foreground">
                                Completed: {new Date(step.completed_at).toLocaleString()}
                              </span>
                            )}
                          </div>
                          {step.comments && (
                            <div className="mt-2 p-2 bg-muted/20 rounded text-sm text-muted-foreground">
                              {step.comments}
                            </div>
                          )}
                          {step.status === "pending" && (
                            <div className="mt-3 flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => updateApprovalStep(step.id, "approved")}
                                className="bg-accent-green/20 hover:bg-accent-green/30 border border-accent-green/30 text-accent-green"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateApprovalStep(step.id, "rejected")}
                                className="bg-destructive/20 hover:bg-destructive/30 border border-destructive/30 text-destructive"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="custom-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Comments & Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {selectedRequest.comments.length === 0 ? (
                      <p className="text-muted-foreground text-center">No comments yet.</p>
                    ) : (
                      selectedRequest.comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-muted/10 border border-border"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm text-foreground">
                                {getUserName(comment.author_id)}
                              </span>
                              <Badge
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-xs font-medium",
                                  comment.type === "approval"
                                    ? "bg-accent-green/20 text-accent-green"
                                    : comment.type === "rejection"
                                      ? "bg-destructive/20 text-destructive"
                                      : comment.type === "change-request"
                                        ? "bg-accent-orange/20 text-accent-orange"
                                        : "bg-primary/20 text-primary",
                                )}
                                size="sm"
                              >
                                {comment.type}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <select
                        value={commentType}
                        onChange={(e) => setCommentType(e.target.value as "comment" | "approval" | "rejection" | "change-request")}
                        className="input-field text-sm"
                      >
                        <option value="comment" className="bg-dark-blue-800">
                          💬 Comment
                        </option>
                        <option value="approval" className="bg-dark-blue-800">
                          ✅ Approval
                        </option>
                        <option value="rejection" className="bg-dark-blue-800">
                          ❌ Rejection
                        </option>
                        <option value="change-request" className="bg-dark-blue-800">
                          🔄 Change Request
                        </option>
                      </select>
                    </div>
                    <Textarea
                      placeholder="Add your comment or feedback..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="textarea-field"
                      rows={3}
                    />
                    <Button onClick={addComment} disabled={!newComment.trim()} className="btn-gradient">
                      <Send className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
