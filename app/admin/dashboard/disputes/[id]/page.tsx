"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  ImageIcon,
  MessageSquare,
  Send,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock dispute data - in a real app, you would fetch this based on the ID
const mockDispute = {
  id: "DSP-1001",
  transactionId: "TRX-12345",
  date: "2023-09-15T14:30:00",
  status: "pending",
  priority: "high",
  type: "delivery-issue",
  reason: "Item not delivered",
  description:
    "The carrier marked the item as delivered, but I never received it. I was waiting at the delivery address the whole day and no one came. I need this package urgently for my business.",
  amount: 2500,
  sender: {
    id: "SND-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 812 345 6789",
    avatar: null,
  },
  carrier: {
    id: "CAR-001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+234 803 987 6543",
    avatar: null,
  },
  receiver: {
    id: "RCV-001",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+234 705 123 4567",
    avatar: null,
  },
  hasEvidence: true,
  evidence: [
    {
      type: "image",
      url: "/placeholder.svg?height=300&width=400&text=Evidence+Photo",
      description: 'Screenshot of delivery status showing "delivered"',
    },
    {
      type: "document",
      url: "/placeholder.svg?height=300&width=400&text=Evidence+Document",
      description: "Chat conversation with the carrier",
    },
  ],
  transaction: {
    date: "2023-09-15T10:30:00",
    amount: 2500,
    commission: 375,
    itemType: "document",
    itemDescription: "Important business documents",
    pickupLocation: "123 Main Street, Ikeja, Lagos",
    dropLocation: "456 Park Avenue, Victoria Island, Lagos",
    status: "completed",
    paymentMethod: "wallet",
  },
  timeline: [
    {
      date: "2023-09-15T14:30:00",
      action: "Dispute Created",
      user: "John Doe (Sender)",
      description: "Dispute was created by the sender",
    },
    {
      date: "2023-09-15T14:35:00",
      action: "Evidence Uploaded",
      user: "John Doe (Sender)",
      description: "Sender uploaded evidence",
    },
    {
      date: "2023-09-15T15:20:00",
      action: "Carrier Notified",
      user: "System",
      description: "Carrier was notified about the dispute",
    },
    {
      date: "2023-09-16T09:15:00",
      action: "Carrier Response",
      user: "Sarah Johnson (Carrier)",
      description: "I delivered the package to the security guard at the gate as no one answered the door.",
    },
  ],
  messages: [
    {
      id: 1,
      date: "2023-09-15T14:30:00",
      sender: "John Doe",
      role: "sender",
      message:
        "I never received my package but the carrier marked it as delivered. I was home all day and no one came.",
    },
    {
      id: 2,
      date: "2023-09-16T09:15:00",
      sender: "Sarah Johnson",
      role: "carrier",
      message: "I delivered the package to the security guard at the gate as no one answered the door when I arrived.",
    },
    {
      id: 3,
      date: "2023-09-16T10:30:00",
      sender: "Admin User",
      role: "admin",
      message:
        "Thank you for the information. We are investigating this issue. @John, could you please check with your security guard if they received any package?",
    },
    {
      id: 4,
      date: "2023-09-16T11:45:00",
      sender: "John Doe",
      role: "sender",
      message:
        "I checked with the security and they don't have any package for me. They also confirmed that no delivery person came yesterday.",
    },
  ],
  assignedTo: "Admin User",
  lastUpdated: "2023-09-16T11:45:00",
}

export default function DisputeDetailPage({ params }: { params: { id: string } } & Record<string, any>) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [resolution, setResolution] = useState<string>("")
  const [resolutionNote, setResolutionNote] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isResolving, setIsResolving] = useState(false)
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState<(typeof mockDispute.evidence)[0] | null>(null)

  // In a real app, you would fetch the dispute data based on the ID
  const dispute = mockDispute

  const handleResolveDispute = () => {
    // In a real app, you would submit this to your API
    console.log("Resolving dispute:", {
      id: dispute.id,
      resolution,
      note: resolutionNote,
    })

    // Close the dialog and show success message
    setIsResolving(false)

    // Navigate back to disputes list
    // router.push('/admin/dashboard/disputes')

    // For demo purposes, just close the dialog
    setIsResolving(false)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // In a real app, you would send this to your API
    console.log("Sending message:", newMessage)

    // Clear the input
    setNewMessage("")
  }

  const handleViewEvidence = (evidence: (typeof mockDispute.evidence)[0]) => {
    setSelectedEvidence(evidence)
    setShowEvidenceDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dispute {dispute.id}</h1>
          <p className="text-gray-500">
            {new Date(dispute.date).toLocaleString()} • Transaction {dispute.transactionId}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              dispute.status === "resolved"
                ? "bg-green-100 text-green-800"
                : dispute.status === "in-review"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
            }
          >
            {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
          </Badge>

          <Badge
            variant="outline"
            className={
              dispute.priority === "high"
                ? "bg-red-100 text-red-800"
                : dispute.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
            }
          >
            {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)} Priority
          </Badge>

          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm capitalize">{dispute.type.replace("-", " ")}</span>
        </div>

        <div className="flex gap-2">
          {dispute.status !== "resolved" && (
            <Button onClick={() => setIsResolving(true)} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Resolve Dispute
            </Button>
          )}

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Details
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="transaction">Transaction Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Dispute Details</CardTitle>
                <CardDescription>Information about the dispute case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Reason for Dispute</h3>
                  <p className="text-sm">{dispute.reason}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm">{dispute.description}</p>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Dispute Type</h3>
                    <p className="text-sm capitalize">{dispute.type.replace("-", " ")}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Amount in Dispute</h3>
                    <p className="text-sm font-medium">₦{dispute.amount.toLocaleString()}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Date Filed</h3>
                    <p className="text-sm">{new Date(dispute.date).toLocaleString()}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                    <p className="text-sm">{new Date(dispute.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Dispute Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

                    <div className="space-y-6">
                      {dispute.timeline.map((event, index) => (
                        <div key={index} className="relative pl-8">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-500">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{event.action}</span>
                              <span className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {event.user}: {event.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Involved Parties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            dispute.sender.avatar ||
                            `/placeholder.svg?height=40&width=40&text=${dispute.sender.name.charAt(0) || "/placeholder.svg"}`
                          }
                        />
                        <AvatarFallback>{dispute.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{dispute.sender.name}</p>
                        <p className="text-xs text-gray-500">Sender</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            dispute.carrier.avatar ||
                            `/placeholder.svg?height=40&width=40&text=${dispute.carrier.name.charAt(0) || "/placeholder.svg"}`
                          }
                        />
                        <AvatarFallback>{dispute.carrier.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{dispute.carrier.name}</p>
                        <p className="text-xs text-gray-500">Carrier</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            dispute.receiver.avatar ||
                            `/placeholder.svg?height=40&width=40&text=${dispute.receiver.name.charAt(0) || "/placeholder.svg"}`
                          }
                        />
                        <AvatarFallback>{dispute.receiver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{dispute.receiver.name}</p>
                        <p className="text-xs text-gray-500">Receiver</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-xs text-gray-500">Sender Phone:</span>
                        <span className="text-xs">{dispute.sender.phone}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-xs text-gray-500">Sender Email:</span>
                        <span className="text-xs">{dispute.sender.email}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-xs text-gray-500">Carrier Phone:</span>
                        <span className="text-xs">{dispute.carrier.phone}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-xs text-gray-500">Receiver Phone:</span>
                        <span className="text-xs">{dispute.receiver.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Case Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="assigned-to">Assigned To</Label>
                    <Select defaultValue={dispute.assignedTo || ""}>
                      <SelectTrigger id="assigned-to" className="mt-1">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin User">Admin User</SelectItem>
                        <SelectItem value="Support Team">Support Team</SelectItem>
                        <SelectItem value="Finance Department">Finance Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue={dispute.priority}>
                      <SelectTrigger id="priority" className="mt-1">
                        <SelectValue placeholder="Set priority..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Contact Parties
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>Messages between all parties involved in the dispute</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                {dispute.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "admin"
                        ? "justify-center"
                        : message.role === "sender"
                          ? "justify-start"
                          : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex flex-col max-w-[80%] ${
                        message.role === "admin"
                          ? "bg-gray-100 rounded-lg px-4 py-2 w-full"
                          : message.role === "sender"
                            ? "bg-blue-100 rounded-tr-lg rounded-br-lg rounded-bl-lg px-4 py-2"
                            : "bg-green-100 rounded-tl-lg rounded-bl-lg rounded-br-lg px-4 py-2"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium ${
                            message.role === "admin"
                              ? "text-gray-700"
                              : message.role === "sender"
                                ? "text-blue-700"
                                : "text-green-700"
                          }`}
                        >
                          {message.sender} ({message.role.charAt(0).toUpperCase() + message.role.slice(1)})
                        </span>
                        <span className="text-xs text-gray-500">{new Date(message.date).toLocaleString()}</span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder="Type your message here..."
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidence Submitted</CardTitle>
              <CardDescription>Files and documents submitted as evidence</CardDescription>
            </CardHeader>
            <CardContent>
              {dispute.evidence.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dispute.evidence.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-video relative bg-gray-100">
                        {item.type === "image" ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img
                              src={item.url || "/placeholder.svg"}
                              alt={item.description}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FileText className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium mb-1">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Evidence
                        </p>
                        <p className="text-xs text-gray-500 mb-3">{item.description}</p>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewEvidence(item)}>
                          {item.type === "image" ? (
                            <>
                              <ImageIcon className="h-3.5 w-3.5 mr-1" />
                              View Image
                            </>
                          ) : (
                            <>
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              View Document
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <p className="text-gray-500">No evidence has been submitted for this dispute.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transaction" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Information about the transaction in dispute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-1">Transaction ID</h3>
                  <p className="text-sm">{dispute.transactionId}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Transaction Date</h3>
                  <p className="text-sm">{new Date(dispute.transaction.date).toLocaleString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Amount</h3>
                  <p className="text-sm font-medium">₦{dispute.transaction.amount.toLocaleString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Platform Commission</h3>
                  <p className="text-sm">₦{dispute.transaction.commission.toLocaleString()} (15%)</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Payment Method</h3>
                  <p className="text-sm capitalize">{dispute.transaction.paymentMethod}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Transaction Status</h3>
                  <Badge
                    variant="outline"
                    className={
                      dispute.transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : dispute.transaction.status === "in-transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {dispute.transaction.status.charAt(0).toUpperCase() + dispute.transaction.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-1">Item Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">Item Type:</p>
                    <p className="text-sm capitalize">{dispute.transaction.itemType}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Description:</p>
                    <p className="text-sm">{dispute.transaction.itemDescription}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-1">Delivery Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">Pickup Location:</p>
                    <p className="text-sm">{dispute.transaction.pickupLocation}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Drop Location:</p>
                    <p className="text-sm">{dispute.transaction.dropLocation}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  View Full Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resolve Dispute Dialog */}
      <Dialog open={isResolving} onOpenChange={setIsResolving}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>Choose a resolution for this dispute case.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger id="resolution">
                  <SelectValue placeholder="Select resolution..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">Refund to Sender</SelectItem>
                  <SelectItem value="partial-refund">Partial Refund</SelectItem>
                  <SelectItem value="redeliver">Request Redelivery</SelectItem>
                  <SelectItem value="compensate-carrier">Compensate Carrier</SelectItem>
                  <SelectItem value="deny">Deny Claim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution-note">Resolution Note</Label>
              <Textarea
                id="resolution-note"
                placeholder="Provide details about your decision..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolving(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveDispute} disabled={!resolution || !resolutionNote} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evidence Viewer Dialog */}
      <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Evidence Viewer</DialogTitle>
            <DialogDescription>{selectedEvidence?.description}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
              {selectedEvidence?.type === "image" ? (
                <img
                  src={selectedEvidence.url || "/placeholder.svg"}
                  alt={selectedEvidence.description}
                  className="max-h-[500px] max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <FileText className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Document Preview</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEvidenceDialog(false)}>
              Close
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
