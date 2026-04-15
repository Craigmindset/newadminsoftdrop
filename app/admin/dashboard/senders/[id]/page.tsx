"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SenderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [sender, setSender] = useState<any>(null);
  const [totals, setTotals] = useState({ totalRequests: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSender() {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/admin/senders/${id}`);
      if (!response.ok) {
        if (!active) {
          return;
        }
        setError("Unable to load sender details");
        setLoading(false);
        return;
      }

      const payload = await response.json();
      if (!active) {
        return;
      }

      setSender(payload.data || null);
      setTotals({
        totalRequests: Number(payload?.totals?.totalRequests || 0),
        totalSpent: Number(payload?.totals?.totalSpent || 0),
      });
      setLoading(false);
    }

    loadSender();

    return () => {
      active = false;
    };
  }, [id]);

  const verificationInfo = useMemo(() => {
    if (typeof sender?.is_verified === "boolean") {
      return sender.is_verified ? "Verified" : "Pending";
    }
    return sender?.verification_status || "-";
  }, [sender]);

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return String(value);
  };

  const formatDate = (value: any) => {
    if (!value) {
      return "-";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return String(value);
    }
    return parsed.toLocaleString();
  };

  const formatGender = (value: any) => {
    const normalized = String(value || "").toLowerCase();
    if (!normalized) {
      return "-";
    }
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={sender?.profile_image || ""}
                alt={`${sender?.first_name || ""} ${
                  sender?.last_name || ""
                }`.trim() || "Sender"}
              />
              <AvatarFallback className="bg-gray-200">
                <User className="h-10 w-10 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">
                  {sender
                    ? `${sender.first_name || ""} ${
                        sender.last_name || ""
                      }`.trim() || "-"
                    : "-"}
                </CardTitle>
                <Badge variant={sender?.is_active ? "default" : "secondary"}>
                  {sender?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {sender?.email || "-"}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">{sender?.role || "Sender"}</Badge>
                <Badge variant={verificationInfo === "Verified" ? "default" : "outline"}>
                  {verificationInfo}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading && (
        <div className="text-sm text-gray-500">Loading sender details...</div>
      )}
      {!loading && error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2">
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
              <p className="text-base">
                {sender
                  ? `${sender.first_name || ""} ${
                      sender.last_name || ""
                    }`.trim() || "-"
                  : "-"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Sender ID</p>
              <p className="text-base">{formatValue(sender?.id)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="text-base">{formatValue(sender?.user_id)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-base">{formatGender(sender?.gender)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-base">{formatValue(sender?.birth_date)}</p>
            </div>
          </CardContent>
        </Card>

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
                <p className="text-base">{formatValue(sender?.email)}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Phone Number
                </p>
                <p className="text-base">{formatValue(sender?.phone_number)}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base">{formatValue(sender?.address)}</p>
                <p className="text-sm text-gray-500">
                  {formatValue(sender?.state)} State
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <p className="text-base">{formatDate(sender?.created_at)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Updated At</p>
              <p className="text-base">{formatDate(sender?.updated_at)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Verification Status
              </p>
              <Badge variant={verificationInfo === "Verified" ? "default" : "outline"}>
                {verificationInfo}
              </Badge>
            </div>
          </CardContent>
        </Card>

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
                Total Requests
              </p>
              <p className="text-2xl font-bold">
                {totals.totalRequests.toLocaleString()}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Amount Spent
              </p>
              <p className="text-2xl font-bold">
                ₦{totals.totalSpent.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
