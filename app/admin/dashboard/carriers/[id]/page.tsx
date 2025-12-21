"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  User,
  CheckCircle2,
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
const getCarrierDetails = (id: string) => {
  const carrierNumber = parseInt(id.split("-")[1]) || 1;
  return {
    id,
    username: `carrier${carrierNumber}`,
    fullName: `Carrier User ${carrierNumber}`,
    phoneNumber: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    email: `carrier${carrierNumber}@example.com`,
    role: "Carrier",
    joined: new Date(
      2023 + Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toLocaleDateString(),
    isSender: Math.random() > 0.5,
    isVerified: Math.random() > 0.3,
    transactions: Math.floor(Math.random() * 100),
    gender: Math.random() > 0.5 ? "Male" : "Female",
    state: ["Lagos", "Abuja", "Kano", "Rivers", "Oyo"][
      Math.floor(Math.random() * 5)
    ],
    address: "123 Main Street, Victoria Island",
    dateOfBirth: "1990-05-15",
    accountStatus: "Active",
    totalEarned: `₦${(Math.random() * 1000000).toFixed(2)}`,
    lastActive: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    verificationStatus: Math.random() > 0.3 ? "Verified" : "Pending",
    vehicleType: ["Car", "Motorcycle", "Truck", "Van"][
      Math.floor(Math.random() * 4)
    ],
    licenseNumber: `LIC-${Math.floor(Math.random() * 1000000)}`,
  };
};

export default function CarrierDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const carrier = getCarrierDetails(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Carrier Details</h1>
          <p className="text-gray-500">
            Complete information about this carrier
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
                <CardTitle className="text-2xl">{carrier.fullName}</CardTitle>
                <Badge
                  variant={
                    carrier.accountStatus === "Active" ? "default" : "secondary"
                  }
                >
                  {carrier.accountStatus}
                </Badge>
              </div>
              <CardDescription className="text-base">
                @{carrier.username}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">{carrier.role}</Badge>
                {carrier.isSender && (
                  <Badge variant="secondary">Also Sender</Badge>
                )}
                <Badge
                  variant={
                    carrier.verificationStatus === "Verified"
                      ? "default"
                      : "outline"
                  }
                >
                  {carrier.isVerified ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : null}
                  {carrier.verificationStatus}
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
              <p className="text-base">{carrier.fullName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="text-base">@{carrier.username}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-base">{carrier.gender}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-base">{carrier.dateOfBirth}</p>
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
                <p className="text-base">{carrier.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Phone Number
                </p>
                <p className="text-base">{carrier.phoneNumber}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base">{carrier.address}</p>
                <p className="text-sm text-gray-500">{carrier.state} State</p>
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
              <p className="text-base">{carrier.joined}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Last Active</p>
              <p className="text-base">{carrier.lastActive}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Account Status
              </p>
              <Badge
                variant={
                  carrier.accountStatus === "Active" ? "default" : "secondary"
                }
              >
                {carrier.accountStatus}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Verification Status
              </p>
              <Badge
                variant={
                  carrier.verificationStatus === "Verified"
                    ? "default"
                    : "outline"
                }
              >
                {carrier.verificationStatus}
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
              <p className="text-2xl font-bold">{carrier.transactions}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Amount Earned
              </p>
              <p className="text-2xl font-bold">{carrier.totalEarned}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Also Registered as Sender
              </p>
              <Badge variant={carrier.isSender ? "default" : "outline"}>
                {carrier.isSender ? "Yes" : "No"}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
              <p className="text-base">{carrier.vehicleType}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Details */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                License Number
              </p>
              <p className="text-base">{carrier.licenseNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
              <p className="text-base">{carrier.vehicleType}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <Button variant="outline">Edit Information</Button>
          <Button variant="outline">View Transactions</Button>
          <Button variant="outline">Send Notification</Button>
          <Button variant="outline">
            {carrier.isVerified ? "Revoke Verification" : "Verify Carrier"}
          </Button>
          <Button variant="destructive">Suspend Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
