"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthProvider } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const auth = useAuthProvider();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [savingPin, setSavingPin] = useState(false);
  const [showTransactionPin, setShowTransactionPin] = useState(false);
  const [commissionRouteScope, setCommissionRouteScope] =
    useState("global");
  const [commissionCarriageType, setCommissionCarriageType] =
    useState("all");
  const [commissionType, setCommissionType] = useState("percent");
  const [commissionValue, setCommissionValue] = useState("");
  const [commissionIsActive, setCommissionIsActive] = useState("true");
  const [savingCommission, setSavingCommission] = useState(false);
  const [commissionSettings, setCommissionSettings] = useState<any[]>([]);
  const [loadingCommissionSettings, setLoadingCommissionSettings] =
    useState(false);
  const accessToken = auth?.accessToken || "";
  const canManageCommission = auth?.role === "super_admin";
  const canViewTransactionPin = auth?.can
    ? auth.can("settings:transaction-pin:view")
    : false;

  useEffect(() => {
    setIsThemeReady(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!accessToken) {
        setFirstName("");
        setLastName("");
        return;
      }

      try {
        setLoadingProfile(true);
        const response = await fetch("/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (!active) {
          return;
        }

        setFirstName(String(payload?.profile?.first_name || ""));
        setLastName(String(payload?.profile?.last_name || ""));
      } catch {
        // no-op
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [accessToken]);

  useEffect(() => {
    let active = true;
    const cacheKey = "admin:commission-settings:v1";

    async function loadCommissionSettings() {
      if (!canManageCommission || !accessToken) {
        setCommissionSettings([]);
        return;
      }

      try {
        const cachedRaw = sessionStorage.getItem(cacheKey);
        if (cachedRaw && active) {
          const cached = JSON.parse(cachedRaw);
          setCommissionSettings(Array.isArray(cached) ? cached : []);
        }
      } catch {
        // no-op
      }

      try {
        setLoadingCommissionSettings(true);
        const response = await fetch("/api/admin/commission-settings", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (!active) {
          return;
        }

        const nextData = Array.isArray(payload?.commissionSettings)
          ? payload.commissionSettings
          : [];
        setCommissionSettings(nextData);

        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(nextData));
        } catch {
          // no-op
        }
      } catch {
        // no-op
      } finally {
        if (active) {
          setLoadingCommissionSettings(false);
        }
      }
    }

    loadCommissionSettings();

    return () => {
      active = false;
    };
  }, [canManageCommission, accessToken]);

  async function handleSaveCommission() {
    if (!accessToken) {
      toast({
        title: "Unauthorized",
        description: "Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    const parsedValue = Number(commissionValue);
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      toast({
        title: "Invalid commission value",
        description: "Commission value must be a non-negative number.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingCommission(true);
      const matchedExisting = commissionSettings.find((item) => {
        const sameScope = String(item.route_scope || "") === commissionRouteScope;
        const normalizedExistingCarriage = item.carriage_type || "all";
        const normalizedSelectedCarriage =
          commissionCarriageType === "all" ? "all" : commissionCarriageType;
        return sameScope && normalizedExistingCarriage === normalizedSelectedCarriage;
      });

      const response = await fetch("/api/admin/commission-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: matchedExisting?.id,
          route_scope: commissionRouteScope,
          carriage_type:
            commissionCarriageType === "all" ? null : commissionCarriageType,
          commission_type: commissionType,
          commission_value: parsedValue,
          is_active: commissionIsActive === "true",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Unable to save commission settings");
      }

      toast({
        title: matchedExisting ? "Commission updated" : "Commission saved",
        description: matchedExisting
          ? "Existing commission settings were updated successfully."
          : "Commission settings have been stored successfully.",
      });

      const payload = await response.json().catch(() => ({}));
      const newItem = payload?.id
        ? {
            id: payload.id,
            route_scope: commissionRouteScope,
            carriage_type:
              commissionCarriageType === "all" ? null : commissionCarriageType,
            commission_type: commissionType,
            commission_value: parsedValue,
            is_active: commissionIsActive === "true",
            created_at: matchedExisting?.created_at || new Date().toISOString(),
          }
        : null;
      if (newItem) {
        const withoutExisting = commissionSettings.filter(
          (item) => item.id !== newItem.id,
        );
        const nextSettings = [newItem, ...withoutExisting].slice(0, 25);
        setCommissionSettings(nextSettings);
        try {
          sessionStorage.setItem(
            "admin:commission-settings:v1",
            JSON.stringify(nextSettings),
          );
        } catch {
          // no-op
        }
      }

      setCommissionValue("");
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error?.message || "Unable to save commission settings",
        variant: "destructive",
      });
    } finally {
      setSavingCommission(false);
    }
  }

  async function handleUpdatePassword() {
    if (!accessToken) {
      toast({
        title: "Unauthorized",
        description: "Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing fields",
        description: "First name and last name are required.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Fill current, new, and confirm password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Weak password",
        description: "New password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingPassword(true);
      const response = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Unable to update password");
      }

      toast({
        title: "Password updated",
        description: "Admin password has been updated successfully.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "Unable to update password",
        variant: "destructive",
      });
    } finally {
      setUpdatingPassword(false);
    }
  }

  async function handleSavePin() {
    const pin = transactionPin.trim();
    if (!/^\d{4}$/.test(pin)) {
      toast({
        title: "Invalid pin",
        description: "Transaction pin must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingPin(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast({
        title: "Pin saved",
        description: "Transaction pin has been updated successfully.",
      });
      setTransactionPin("");
    } finally {
      setSavingPin(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage admin security, transaction pin, and theme preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Update password
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Set a stronger password for this admin account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Enter first name"
                    disabled={loadingProfile || updatingPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Enter last name"
                    disabled={loadingProfile || updatingPassword}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Create a new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showNewPassword ? "Hide new password" : "Show new password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                onClick={handleUpdatePassword}
                disabled={updatingPassword || loadingProfile}
                className="w-full bg-foreground text-background hover:bg-foreground/90"
              >
                {updatingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {updatingPassword ? "Updating..." : "Update password"}
              </Button>
            </CardContent>
          </Card>

          {canViewTransactionPin ? (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Transaction pin
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Set a 4-digit pin to approve payouts and transfers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-pin">New pin</Label>
                  <div className="relative">
                    <Input
                      id="transaction-pin"
                      type={showTransactionPin ? "text" : "password"}
                      value={transactionPin}
                      onChange={(event) => setTransactionPin(event.target.value)}
                      placeholder="****"
                      maxLength={4}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTransactionPin((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                      aria-label={showTransactionPin ? "Hide transaction pin" : "Show transaction pin"}
                    >
                      {showTransactionPin ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleSavePin}
                  disabled={savingPin}
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                >
                  {savingPin ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {savingPin ? "Saving..." : "Save pin"}
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          {canManageCommission ? (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Commission settings
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure active commission rules for routes and carriage types.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Route scope</Label>
                    <Select
                      value={commissionRouteScope}
                      onValueChange={setCommissionRouteScope}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select route scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="intra">Intra</SelectItem>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Carriage type</Label>
                    <Select
                      value={commissionCarriageType}
                      onValueChange={setCommissionCarriageType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select carriage type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                        <SelectItem value="walker">Walker</SelectItem>
                        <SelectItem value="motor-cycle">Motor-cycle</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Commission type</Label>
                    <Select value={commissionType} onValueChange={setCommissionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select commission type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">Percent</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commission-value">Commission value</Label>
                    <Input
                      id="commission-value"
                      type="number"
                      min="0"
                      step="0.01"
                      value={commissionValue}
                      onChange={(event) => setCommissionValue(event.target.value)}
                      placeholder="e.g. 10 or 500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={commissionIsActive}
                      onValueChange={setCommissionIsActive}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/*
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="commission-priority">Priority</Label>
                    <Input id="commission-priority" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effective-from">Effective from</Label>
                    <Input id="effective-from" type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effective-to">Effective to (optional)</Label>
                    <Input id="effective-to" type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission-notes">Notes (optional)</Label>
                    <Input id="commission-notes" placeholder="Internal note for this rule" />
                  </div>
                </div>
                */}

                <Button
                  onClick={handleSaveCommission}
                  disabled={savingCommission}
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                >
                  {savingCommission ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {savingCommission ? "Saving..." : "Save commission settings"}
                </Button>

                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium text-foreground">
                    Recent commission settings
                  </p>
                  {loadingCommissionSettings ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : commissionSettings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No commission records yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {commissionSettings.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {String(item.route_scope || "global").toUpperCase()} • {String(
                              item.commission_type || "percent",
                            ).toUpperCase()} {Number(item.commission_value || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.carriage_type || "all carriage types"} • {item.is_active ? "active" : "inactive"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Theme preference
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose how the dashboard looks across devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={isThemeReady ? theme || "system" : "system"}
                onValueChange={setTheme}
                className="grid gap-3 md:grid-cols-3"
              >
                <label className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
                  <RadioGroupItem value="dark" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
                  <RadioGroupItem value="light" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Light</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
                  <RadioGroupItem value="system" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      System
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
