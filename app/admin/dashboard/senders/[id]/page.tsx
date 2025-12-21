"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data - replace with actual data fetching
const getSenderDetails = (id: string) => {
  const senderNumber = parseInt(id.split("-")[1]) || 1;
  return {
    id,
    profileImage: `https://api.dicebear.com/7.x/avatars/svg?seed=${senderNumber}`,
    username: `sender${senderNumber}`,
    fullName: `Sender User ${senderNumber}`,
    phoneNumber: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    email: `sender${senderNumber}@example.com`,
    role: "Sender",
    joined: new Date(
      2023 + Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toLocaleDateString(),
    isCarrier: Math.random() > 0.5,
    transactions: Math.floor(Math.random() * 100),
    gender: Math.random() > 0.5 ? "Male" : "Female",
    state: ["Lagos", "Abuja", "Kano", "Rivers", "Oyo"][
      Math.floor(Math.random() * 5)
    ],
    address: "123 Main Street, Victoria Island",
    dateOfBirth: "1990-05-15",
    accountStatus: "Active",
    totalSpent: `₦${(Math.random() * 1000000).toFixed(2)}`,
    lastActive: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    verificationStatus: Math.random() > 0.3 ? "Verified" : "Pending",
  };
};

export default function SenderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const sender = getSenderDetails(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sender Details</h1>
          <p className="text-gray-500">
            Complete information about this sender
          </p>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gray-200">
                <User className="h-10 w-10 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{sender.fullName}</CardTitle>
                <Badge
                  variant={
                    sender.accountStatus === "Active" ? "default" : "secondary"
                  }
                >
                  {sender.accountStatus}
                </Badge>
              </div>
              <CardDescription className="text-base">
                @{sender.username}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">{sender.role}</Badge>
                {sender.isCarrier && (
                  <Badge variant="secondary">Also Carrier</Badge>
                )}
                <Badge
                  variant={
                    sender.verificationStatus === "Verified"
                      ? "default"
                      : "outline"
                  }
                >
                  {sender.verificationStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-base">{sender.fullName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="text-base">@{sender.username}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-base">{sender.gender}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-base">{sender.dateOfBirth}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Email Address
                </p>
                <p className="text-base">{sender.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Phone Number
                </p>
                <p className="text-base">{sender.phoneNumber}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base">{sender.address}</p>
                <p className="text-sm text-gray-500">{sender.state} State</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date Joined</p>
              <p className="text-base">{sender.joined}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Last Active</p>
              <p className="text-base">{sender.lastActive}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Account Status
              </p>
              <Badge
                variant={
                  sender.accountStatus === "Active" ? "default" : "secondary"
                }
              >
                {sender.accountStatus}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Verification Status
              </p>
              <Badge
                variant={
                  sender.verificationStatus === "Verified"
                    ? "default"
                    : "outline"
                }
              >
                {sender.verificationStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Transactions
              </p>
              <p className="text-2xl font-bold">{sender.transactions}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Amount Spent
              </p>
              <p className="text-2xl font-bold">{sender.totalSpent}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Also Registered as Carrier
              </p>
              <Badge variant={sender.isCarrier ? "default" : "outline"}>
                {sender.isCarrier ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <Button variant="outline">Edit Information</Button>
          <Button variant="outline">View Transactions</Button>
          <Button variant="outline">Send Notification</Button>
          <Button variant="destructive">Suspend Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
