"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  MessageSquare,
  Send,
  Paperclip,
  ImageIcon,
  File,
  Phone,
  Video,
  MoreHorizontal,
  CheckCheck,
  Clock,
  Smile,
  Loader2,
} from "lucide-react"
import { supabase } from "@/lib/database" // Import Supabase client

interface ChatMessage {
  id: string
  room_id: string // Corresponds to Supabase table column
  sender_id: string // Corresponds to Supabase table column
  sender_name?: string // Derived from sender_id
  sender_avatar?: string // Derived from sender_id
  content: string
  timestamp: string // ISO string from DB
  type: "text" | "file" | "image" | "system"
  file_url?: string // Corresponds to Supabase table column
  file_name?: string // Corresponds to Supabase table column
  file_size?: string // Corresponds to Supabase table column
  status: "sending" | "sent" | "delivered" | "read" // Client-side status
}

interface ChatRoom {
  id: string
  name: string
  type: "direct" | "group" | "project"
  participants: string[] // User IDs
  lastMessage?: ChatMessage
  unreadCount: number
  isOnline: boolean
  avatar?: string
}

interface ChatUser {
  id: string
  name: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  lastSeen: string
}

// Mock data for users and rooms (these would ideally come from your DB)
const mockUsers: ChatUser[] = [
  {
    id: "EMP001",
    name: "John Doe",
    avatar: "👨‍💻",
    status: "online",
    lastSeen: "Now",
  },
  {
    id: "EMP002",
    name: "Sarah Smith",
    avatar: "👩‍🎨",
    status: "busy",
    lastSeen: "5 minutes ago",
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    avatar: "👨‍💼",
    status: "online",
    lastSeen: "2 minutes ago",
  },
  {
    id: "CLIENT001",
    name: "TechCorp Client",
    avatar: "🏢",
    status: "online",
    lastSeen: "1 minute ago",
  },
  // Add more mock users as needed, matching your actual user IDs
]

const mockChatRooms: ChatRoom[] = [
  {
    id: "room1",
    name: "Development Team",
    type: "group",
    participants: ["EMP001", "EMP002", "EMP003"],
    unreadCount: 3,
    isOnline: true,
    avatar: "👥",
  },
  {
    id: "room2",
    name: "TechCorp Project",
    type: "project",
    participants: ["EMP001", "EMP002", "EMP003", "CLIENT001"],
    unreadCount: 1,
    isOnline: true,
    avatar: "🚀",
  },
  {
    id: "room3",
    name: "Sarah Smith",
    type: "direct",
    participants: ["EMP001", "EMP002"],
    unreadCount: 0,
    isOnline: true,
    avatar: "👩‍🎨",
  },
]

interface RealTimeChatProps {
  currentUserId: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export default function RealTimeChat({ currentUserId, isMinimized = false, onToggleMinimize }: RealTimeChatProps) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(mockChatRooms[0])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([]) // Still mock for now
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [loadingMessages, setLoadingMessages] = useState(false)

  const getUserDetails = useCallback((userId: string) => {
    // In a real app, you'd fetch this from your 'users' table or a global state
    return (
      mockUsers.find((u) => u.id === userId) || {
        id: userId,
        name: "Unknown",
        avatar: "👤",
        status: "offline",
        lastSeen: "",
      }
    )
  }, [])

  const fetchMessages = useCallback(
    async (roomId: string) => {
      setLoadingMessages(true)
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("timestamp", { ascending: true })

      if (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive",
        })
        setMessages([])
      } else {
        const formattedMessages: ChatMessage[] = data.map((msg) => ({
          ...msg,
          sender_name: getUserDetails(msg.sender_id).name,
          sender_avatar: getUserDetails(msg.sender_id).avatar,
          status: "read", // Assume fetched messages are read
        }))
        setMessages(formattedMessages)
      }
      setLoadingMessages(false)
    },
    [toast, getUserDetails],
  )

  useEffect(() => {
    if (!selectedRoom) return

    fetchMessages(selectedRoom.id)

    // Set up Realtime subscription
    const channel = supabase
      .channel(`chat_room_${selectedRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${selectedRoom.id}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => [
            ...prev,
            {
              ...newMsg,
              sender_name: getUserDetails(newMsg.sender_id).name,
              sender_avatar: getUserDetails(newMsg.sender_id).avatar,
              status: "delivered", // Mark as delivered when received via Realtime
            },
          ])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedRoom, fetchMessages, getUserDetails])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !currentUserId) return

    const messageToInsert = {
      room_id: selectedRoom.id,
      sender_id: currentUserId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      file_url: null,
      file_name: null,
      file_size: null,
    }

    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: ChatMessage = {
      id: tempId,
      ...messageToInsert,
      sender_name: getUserDetails(currentUserId).name,
      sender_avatar: getUserDetails(currentUserId).avatar,
      status: "sending",
    }
    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage("")

    const { data, error } = await supabase.from("chat_messages").insert(messageToInsert).select().single()

    if (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      })
      // Revert optimistic update on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
    } else {
      // Update optimistic message with real ID and status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? {
                ...data,
                status: "sent",
                sender_name: getUserDetails(data.sender_id).name,
                sender_avatar: getUserDetails(data.sender_id).avatar,
              }
            : msg,
        ),
      )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />
      case "sent":
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-blue-400" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-green-400" />
      default:
        return null
    }
  }

  const getUserStatus = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user?.status || "offline"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-red-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isMinimized) {
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg relative"
        >
          <MessageSquare className="w-6 h-6" />
          {mockChatRooms.reduce((total, room) => total + room.unreadCount, 0) > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center p-0">
              {mockChatRooms.reduce((total, room) => total + room.unreadCount, 0)}
            </Badge>
          )}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-50"
    >
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-lg">
                {selectedRoom?.avatar}
              </div>
              {selectedRoom?.type === "direct" && (
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(
                    getUserStatus(selectedRoom.participants.find((p) => p !== currentUserId) || ""),
                  )}`}
                />
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm">{selectedRoom?.name}</h3>
              <p className="text-xs text-gray-400">
                {selectedRoom?.type === "group"
                  ? `${selectedRoom.participants.length} members`
                  : selectedRoom?.type === "project"
                    ? "Project Chat"
                    : "Direct Message"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="hover:bg-white/10">
              <Phone className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="hover:bg-white/10">
              <Video className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onToggleMinimize} className="hover:bg-white/10">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Rooms List */}
        <div className="flex-1 flex">
          <div className="w-32 border-r border-white/10 p-2 space-y-2 overflow-y-auto">
            {mockChatRooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRoom(room)}
                className={`relative p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedRoom?.id === room.id ? "bg-blue-500/20" : "hover:bg-white/10"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-sm">
                      {room.avatar}
                    </div>
                    {room.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                    )}
                  </div>
                  <span className="text-xs text-center leading-tight">{room.name.split(" ")[0]}</span>
                  {room.unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                      {room.unreadCount}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwn = message.sender_id === currentUserId
                  const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex space-x-2 max-w-[80%] ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                        {showAvatar && !isOwn && (
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                            {message.sender_avatar}
                          </div>
                        )}
                        <div className={`${showAvatar && !isOwn ? "" : "ml-8"}`}>
                          {showAvatar && !isOwn && <p className="text-xs text-gray-400 mb-1">{message.sender_name}</p>}
                          <div
                            className={`p-3 rounded-lg ${
                              isOwn
                                ? "bg-blue-500/20 text-blue-100"
                                : message.type === "system"
                                  ? "bg-gray-500/20 text-gray-300 text-center"
                                  : "bg-white/10 text-white"
                            }`}
                          >
                            {message.type === "file" ? (
                              <div className="flex items-center space-x-2">
                                <File className="w-4 h-4" />
                                <div>
                                  <p className="text-sm font-medium">{message.file_name}</p>
                                  <p className="text-xs text-gray-400">{message.file_size}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                          </div>
                          <div className={`flex items-center space-x-2 mt-1 ${isOwn ? "justify-end" : ""}`}>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isOwn && getStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}

              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xs">
                    👤
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="hover:bg-white/10">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="hover:bg-white/10">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="bg-white/5 border-white/10 flex-1"
                />
                <Button size="sm" variant="ghost" className="hover:bg-white/10">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
