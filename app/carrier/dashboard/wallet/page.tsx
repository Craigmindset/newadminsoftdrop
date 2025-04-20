"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Landmark } from "lucide-react"

export default function CarrierWalletPage() {
  const [amount, setAmount] = useState("")

  const handleFundWallet = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would integrate with a payment gateway here
    alert(`Processing payment of ₦${amount}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">Manage your wallet and fund your account.</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your current balance and recent transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 md:p-6">
              <div className="text-sm font-medium text-muted-foreground">Available Balance</div>
              <div className="text-2xl md:text-3xl font-bold">₦12,500.00</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Recent Transactions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm md:text-base font-medium">Wallet Funding</p>
                    <p className="text-xs text-muted-foreground">Mar 3, 2025</p>
                  </div>
                  <p className="text-sm md:text-base font-medium text-green-600">+₦5,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Escrow Transfer</p>
                    <p className="text-xs text-muted-foreground">Mar 2, 2025</p>
                  </div>
                  <p className="font-medium text-green-600">+₦3,500</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bank Withdrawal</p>
                    <p className="text-xs text-muted-foreground">Feb 28, 2025</p>
                  </div>
                  <p className="font-medium text-red-600">-₦2,000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fund Wallet</CardTitle>
            <CardDescription>Add money to your wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="card">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">Card Payment</TabsTrigger>
                <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="space-y-4 pt-4">
                <form onSubmit={handleFundWallet} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="flex">
                      <Button variant="outline" type="button" className="rounded-r-none px-3" disabled>
                        <CreditCard className="h-4 w-4" />
                      </Button>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" className="rounded-l-none" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Fund Wallet
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="bank" className="space-y-4 pt-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    <h3 className="font-medium">Bank Transfer Details</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bank Name:</span>
                      <span className="font-medium">First Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Number:</span>
                      <span className="font-medium">1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Name:</span>
                      <span className="font-medium">SoftDrop Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reference:</span>
                      <span className="font-medium">CA-12345</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Please use the reference code when making the transfer. Your wallet will be credited once payment is
                    confirmed.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
