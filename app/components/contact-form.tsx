"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: data.message,
          variant: "default",
        })
        setFormData({ name: "", email: "", subject: "", message: "" }) // Clear form
      } else {
        throw new Error(data.error || "Failed to send message.")
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
          Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-2">
          Subject
        </label>
        <Input
          id="subject"
          type="text"
          placeholder="Subject of your message"
          value={formData.subject}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Your message here..."
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <Button type="submit" className="btn-gradient w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
