"use client"

import { useState, useEffect } from "react"
import { Phone, Mic, MicOff, Volume2, VolumeX, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface CallInterfaceProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: {
    name: string
    phone: string
    avatar?: string
  }
}

export function CallInterface({ open, onOpenChange, contact }: CallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<"connecting" | "ringing" | "connected" | "ended">("connecting")
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)

  // Simulate call connection
  useEffect(() => {
    if (!open) {
      setCallStatus("connecting")
      setCallDuration(0)
      return
    }

    const connectingTimeout = setTimeout(() => {
      setCallStatus("ringing")
    }, 1500)

    const ringingTimeout = setTimeout(() => {
      setCallStatus("connected")
    }, 4000)

    return () => {
      clearTimeout(connectingTimeout)
      clearTimeout(ringingTimeout)
    }
  }, [open])

  // Start timer when call is connected
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (callStatus === "connected") {
      intervalId = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [callStatus])

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleEndCall = () => {
    setCallStatus("ended")
    setTimeout(() => onOpenChange(false), 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center pt-4 pb-8">
          <div className="mb-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={contact.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <DialogTitle className="text-xl font-bold mb-1">{contact.name}</DialogTitle>
            <DialogDescription>{contact.phone}</DialogDescription>

            <div className="mt-4 text-center">
              {callStatus === "connecting" && <p className="text-amber-500">Connecting...</p>}
              {callStatus === "ringing" && <p className="text-amber-500">Ringing...</p>}
              {callStatus === "connected" && (
                <p className="text-green-500">Connected • {formatCallDuration(callDuration)}</p>
              )}
              {callStatus === "ended" && <p className="text-red-500">Call ended</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsMuted(!isMuted)}
              disabled={callStatus !== "connected"}
            >
              {isMuted ? (
                <MicOff className={`h-5 w-5 ${isMuted ? "text-red-500" : ""}`} />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant={callStatus === "ended" ? "outline" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleEndCall}
            >
              {callStatus === "ended" ? <X className="h-5 w-5" /> : <Phone className="h-5 w-5 rotate-135" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsSpeaker(!isSpeaker)}
              disabled={callStatus !== "connected"}
            >
              {isSpeaker ? (
                <VolumeX className={`h-5 w-5 ${isSpeaker ? "text-blue-500" : ""}`} />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>

          {callStatus === "connected" && (
            <div className="mt-8 w-full max-w-xs bg-muted h-10 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium">Voice quality: Excellent</span>
              </div>
              <div className="bg-primary/20 h-full animate-pulse" style={{ width: "85%" }} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
