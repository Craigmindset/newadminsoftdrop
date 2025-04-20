"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MessageInterfaceProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: {
    name: string
    avatar?: string
  }
}

// Mock message data
const initialMessages = [
  {
    id: 1,
    content: "Hello, I'm on my way to pick up your package.",
    sender: "carrier",
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 2,
    content: "Great! How long will it take?",
    sender: "user",
    timestamp: new Date(Date.now() - 24 * 60000).toISOString(),
  },
  {
    id: 3,
    content: "I should be there in about 15 minutes.",
    sender: "carrier",
    timestamp: new Date(Date.now() - 23 * 60000).toISOString(),
  },
  {
    id: 4,
    content: "I'm at the entrance of your building now.",
    sender: "carrier",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
  },
]

export function MessageInterface({ open, onOpenChange, contact }: MessageInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus on input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: newMessage.trim(),
        sender: "user",
        timestamp: new Date().toISOString(),
      },
    ])
    setNewMessage("")

    // Simulate carrier response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "Thanks for your message. I'll be with you shortly.",
          sender: "carrier",
          timestamp: new Date().toISOString(),
        },
      ])
    }, 3000)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[80vh] max-h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={contact.avatar || "/placeholder.svg"} />
              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <DialogTitle>{contact.name}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col max-w-[75%]">
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-1">{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-end gap-2"
          >
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0">
              <Smile className="h-5 w-5" />
              <span className="sr-only">Add emoji</span>
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0">
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0">
              <Image className="h-5 w-5" />
              <span className="sr-only">Attach image</span>
            </Button>
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="pr-12 py-6"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-primary"
                disabled={!newMessage.trim()}
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
