"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"

export default function EscrowPage() {
  const [amount, setAmount] = useState("")
  const [transferType, setTransferType] = useState("wallet")

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would process the withdrawal here
    alert(`Withdrawing ₦${amount} to ${transferType === "wallet" ? "wallet" : "bank account"}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Escrow Account</h1>
        <p className="text-muted-foreground">Manage your escrow funds and withdraw to your wallet or bank account.</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Escrow Balance</CardTitle>
            <CardDescription>Funds held in escrow from your deliveries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 md:p-6">
              <div className="text-sm font-medium text-muted-foreground">Available for Withdrawal</div>
              <div className="text-2xl md:text-3xl font-bold">₦5,000.00</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Recent Transactions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm md:text-base font-medium">Delivery Completed</p>
                    <p className="text-xs text-muted-foreground">Mar 5, 2025</p>
                  </div>
                  <p className="text-sm md:text-base font-medium text-green-600">+₦2,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm md:text-base font-medium">Delivery Completed</p>
                    <p className="text-xs text-muted-foreground">Mar 4, 2025</p>
                  </div>
                  <p className="text-sm md:text-base font-medium text-green-600">+₦1,500</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm md:text-base font-medium">Transfer to Wallet</p>
                    <p className="text-xs text-muted-foreground">Mar 1, 2025</p>
                  </div>
                  <p className="text-sm md:text-base font-medium text-red-600">-₦3,500</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>Transfer your escrow funds to your wallet or bank account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="escrow-amount">Amount (₦)</Label>
                <Input
                  id="escrow-amount"
                  type="number"
                  placeholder="Enter amount to withdraw"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Maximum amount: ₦5,000.00</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transfer-type">Transfer To</Label>
                <Select value={transferType} onValueChange={setTransferType}>
                  <SelectTrigger id="transfer-type">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wallet">Wallet</SelectItem>
                    <SelectItem value="bank">Bank Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {transferType === "bank" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Select defaultValue="first-bank">
                      <SelectTrigger id="bank-name">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-bank">First Bank</SelectItem>
                        <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                        <SelectItem value="zenith">Zenith Bank</SelectItem>
                        <SelectItem value="access">Access Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="Enter account number" required={transferType === "bank"} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Name</Label>
                    <Input id="account-name" placeholder="Enter account name" required={transferType === "bank"} />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full gap-2">
                Withdraw Funds <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
