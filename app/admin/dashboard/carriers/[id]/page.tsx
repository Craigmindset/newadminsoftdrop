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
  Download,
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

export default function CarrierDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [carrier, setCarrier] = useState<any>(null);
  const [totals, setTotals] = useState({ totalDeliveries: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCarrier() {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/admin/carriers/${id}`);
      if (!response.ok) {
        if (!active) {
          return;
        }
        setError("Unable to load carrier details");
        setLoading(false);
        return;
      }

      const payload = await response.json();
      if (!active) {
        return;
      }

      setCarrier(payload.data || null);
      setTotals({
        totalDeliveries: Number(payload?.totals?.totalDeliveries || 0),
        totalEarned: Number(payload?.totals?.totalEarned || 0),
      });
      setLoading(false);
    }

    loadCarrier();

    return () => {
      active = false;
    };
  }, [id]);

  const verificationInfo = useMemo(() => {
    const checks = [
      Boolean(carrier?.nin_pass),
      Boolean(carrier?.admin_check),
      Boolean(carrier?.facial_verify),
      Boolean(carrier?.otp_pass),
      Boolean(carrier?.nuban_check),
    ];
    const total = checks.length;
    const passed = checks.filter(Boolean).length;
    const percent = total > 0 ? Math.round((passed / total) * 100) : 0;
    const verified = total > 0 && passed === total;
    return {
      verified,
      percent,
      label: verified ? "Verified" : `Pending (${percent}%)`,
    };
  }, [carrier]);

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

  const handleToggleSuspend = async () => {
    if (!carrier?.id) {
      return;
    }

    const nextValue = !Boolean(carrier.admin_check);
    setSavingStatus(true);

    const response = await fetch(`/api/admin/carriers/${carrier.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ admin_check: nextValue }),
    });

    if (response.ok) {
      setCarrier((prev: any) => ({ ...prev, admin_check: nextValue }));
    } else {
      setError("Unable to update account status");
    }

    setSavingStatus(false);
  };

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
              <AvatarImage
                src={carrier?.profile_image || ""}
                alt={
                  `${carrier?.first_name || ""} ${
                    carrier?.last_name || ""
                  }`.trim() || "Carrier"
                }
              />
              <AvatarFallback className="bg-gray-200">
                <User className="h-10 w-10 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">
                  {carrier
                    ? `${carrier.first_name || ""} ${
                        carrier.last_name || ""
                      }`.trim() || "-"
                    : "-"}
                </CardTitle>
                <Badge variant={carrier?.is_online ? "default" : "secondary"}>
                  {carrier?.is_online ? "Online" : "Offline"}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {carrier?.email || "-"}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">{carrier?.role || "Carrier"}</Badge>
                <Badge
                  variant={verificationInfo.verified ? "default" : "outline"}
                >
                  {verificationInfo.label}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading && (
        <div className="text-sm text-gray-500">Loading carrier details...</div>
      )}
      {!loading && error && <div className="text-sm text-red-600">{error}</div>}

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
              <p className="text-base">
                {carrier
                  ? `${carrier.first_name || ""} ${
                      carrier.last_name || ""
                    }`.trim() || "-"
                  : "-"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Carrier ID</p>
              <p className="text-base">{formatValue(carrier?.id)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="text-base">{formatValue(carrier?.user_id)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-base">{formatGender(carrier?.gender)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-base">{formatValue(carrier?.birth_date)}</p>
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
                <p className="text-base">{formatValue(carrier?.email)}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Phone Number
                </p>
                <p className="text-base">
                  {formatValue(carrier?.phone_number)}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base">{formatValue(carrier?.address)}</p>
                <p className="text-sm text-gray-500">
                  {formatValue(carrier?.state)} State
                </p>
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
              <p className="text-base">{formatDate(carrier?.created_at)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Updated At</p>
              <p className="text-base">{formatDate(carrier?.updated_at)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Wallet Account
              </p>
              <p className="text-base">
                {formatValue(carrier?.wallet_account)}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Wallet Balance
              </p>
              <p className="text-base">
                {formatValue(carrier?.wallet_balance)}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Verification Status
              </p>
              <Badge
                variant={verificationInfo.verified ? "default" : "outline"}
              >
                {verificationInfo.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Delivery
              </p>
              <p className="text-2xl font-bold">
                {totals.totalDeliveries.toLocaleString()}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Amount Earned
              </p>
              <p className="text-2xl font-bold">
                ₦{totals.totalEarned.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carriage Verification Details */}
      <Card>
        <CardHeader>
          <CardTitle>Carriage Verification Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Carriage Type</p>
              <p className="text-base">{formatValue(carrier?.carriage_type)}</p>
            </div>

            {(carrier?.carriage_type === "bike" ||
              carrier?.carriage_type === "walker") && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Guarantor Name
                  </p>
                  <p className="text-base">
                    {formatValue(carrier?.carriage_guarantor_name)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="text-base">
                    {formatValue(carrier?.carriage_guarantor_contact)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-base">{formatValue(carrier?.address)}</p>
                </div>
              </>
            )}

            {(carrier?.carriage_type === "motor-cycle" ||
              carrier?.carriage_type === "car" ||
              carrier?.carriage_type === "truck") && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Carriage Reg
                  </p>
                  <p className="text-base">
                    {formatValue(carrier?.carriage_reg)}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <a
                    href={carrier?.carriage_doc_proof || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Carriage Doc
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={carrier?.carriage_type_image || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Carriage Image
                  </a>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <Button variant="outline">Edit Information</Button>
          <Button variant="outline">View Transactions</Button>
          <Button variant="outline">Send Notification</Button>
          <Button variant="outline">Verify Carrier</Button>
          <Button
            variant={carrier?.admin_check === false ? "outline" : "destructive"}
            onClick={handleToggleSuspend}
            disabled={savingStatus}
            className={
              carrier?.admin_check === false
                ? "bg-green-800 text-white hover:bg-green-900"
                : undefined
            }
          >
            {savingStatus
              ? "Updating..."
              : carrier?.admin_check === false
                ? "Unsuspend Account"
                : "Suspend Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
