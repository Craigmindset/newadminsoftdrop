"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function BvnVerificationPage() {
  const router = useRouter()
  const [bvn, setBvn] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would verify the BVN with an API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/signup/carrier/kyc/face")
    }, 1500)
  }

  const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 11 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
    setBvn(value)
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-0 max-w-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Carrier Verification</h2>
        <p className="text-muted-foreground">Step 2 of 4: BVN Verification</p>
        <Progress value={50} className="mt-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>BVN Verification</CardTitle>
          <CardDescription>
            Please provide your Bank Verification Number (BVN) for identity verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center p-4 rounded-lg bg-primary/10">
            <ShieldCheck className="h-6 w-6 mr-3 text-primary" />
            <div className="text-sm">
              <p className="font-medium">Your data is secure</p>
              <p className="text-muted-foreground">
                We only use your BVN to verify your identity and do not store it permanently.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
              <Input
                id="bvn"
                type="text"
                inputMode="numeric"
                placeholder="Enter your 11-digit BVN"
                value={bvn}
                onChange={handleBvnChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Your BVN is an 11-digit number that uniquely identifies you in the Nigerian banking system.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={bvn.length !== 11 || isLoading}>
              {isLoading ? (
                "Verifying..."
              ) : (
                <>
                  Verify BVN <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
