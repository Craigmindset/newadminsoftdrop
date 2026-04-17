"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  CreditCard,
  ShieldCheck,
  Wallet,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export default function WalletPage() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const cacheKey = "admin:wallet:v1";

    async function loadWallet() {
      setLoading(true);

      try {
        const cachedRaw = sessionStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (active && cached) {
            setWalletBalance(
              cached.wallet_balance !== undefined
                ? Number(cached.wallet_balance)
                : null,
            );
          }
        }
      } catch (error) {
        console.error("Failed to read wallet cache", error);
      }

      try {
        const response = await fetch("/api/admin/wallet");
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!active) {
          return;
        }

        setWalletBalance(
          data.wallet_balance !== undefined ? Number(data.wallet_balance) : 0,
        );

        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
          console.error("Failed to write wallet cache", error);
        }
      } catch (error) {
        console.error("Failed to load wallet", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWallet();

    return () => {
      active = false;
    };
  }, []);

  const formattedBalance =
    walletBalance === null || Number.isNaN(walletBalance)
      ? "₦—"
      : `₦${Number(walletBalance).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Wallet
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor balance, approve transfers, and send funds to banks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full border-border text-foreground"
          >
            Download statement
          </Button>
          <Link
            href="/admin/dashboard/transactions"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition hover:bg-foreground/90"
          >
            View payouts
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden border border-amber-200/70 bg-gradient-to-br from-amber-50 via-background to-emerald-50 dark:from-amber-500/10 dark:via-background dark:to-emerald-500/10">
          <div className="pointer-events-none absolute -right-32 -top-24 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-amber-200/40 blur-2xl" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3 text-foreground">
              <div className="rounded-xl bg-amber-900/10 p-2">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Available balance
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Primary admin wallet synced with Supabase
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div>
              <p className="text-4xl font-bold text-foreground">
                {loading ? "Loading..." : formattedBalance}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-100/60 bg-background/70 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Banknote className="h-4 w-4" />
                  Total inflow
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  ₦0
                </p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
              <div className="rounded-2xl border border-amber-100/60 bg-background/70 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CreditCard className="h-4 w-4" />
                  Total outflow
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  ₦0
                </p>
                <p className="text-xs text-muted-foreground">
                  Approved transfers
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
                Add funds
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-border text-foreground"
              >
                View audit log
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Transfer to bank
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Send money out of the admin wallet with approval-ready details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Transfer amount</Label>
                <Input id="amount" placeholder="₦250,000" type="text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank">Bank name</Label>
                <Input id="bank" placeholder="Access Bank" type="text" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account number</Label>
                  <Input id="account-number" placeholder="0123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account name</Label>
                  <Input id="account-name" placeholder="SoftDrop Ops" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="narration">Narration</Label>
                <Textarea
                  id="narration"
                  placeholder="Add transfer purpose or internal reference."
                />
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Transfers require admin approval
                </div>
                <p className="mt-1 text-emerald-800">
                  Funds are released after verification. Keep narration concise.
                </p>
              </div>
              <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                Submit transfer request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
