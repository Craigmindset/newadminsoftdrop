"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Lock, ShieldCheck } from "lucide-react";
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [transactionPin, setTransactionPin] = useState("");

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
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Create a new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter new password"
              />
            </div>
            <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
              <Lock className="h-4 w-4" />
              Update password
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
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
                <Input
                  id="transaction-pin"
                  type="password"
                  value={transactionPin}
                  onChange={(event) => setTransactionPin(event.target.value)}
                  placeholder="****"
                  maxLength={4}
                />
              </div>
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                <ShieldCheck className="h-4 w-4" />
                Save pin
              </Button>
            </CardContent>
          </Card>

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
                value={theme || "system"}
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
