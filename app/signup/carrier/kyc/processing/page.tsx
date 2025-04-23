"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProcessingPage() {
  const router = useRouter()
  const [secondsLeft, setSecondsLeft] = useState(60) // 1 minutes
  const [isVerified, setIsVerified] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsVerified(true)
      return
    }

    const timer = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [secondsLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleContinue = () => {
    router.push("/carrier/dashboard")
  }

  return (
    <div className="container flex min-h-screen items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          {isVerified ? (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Congratulations!</CardTitle>
              <CardDescription>Your carrier account has been verified successfully.</CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl font-bold">Processing Your Information</CardTitle>
              <CardDescription>Please wait while we verify your details.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 text-center">
          {isVerified ? (
            <div className="space-y-4">
              <p>
                You are now a verified carrier on SoftDrop You can start accepting delivery requests and earning money.
              </p>

              <div className="rounded-lg bg-primary/10 p-4">
                <p className="font-medium">Next Steps:</p>
                <ul className="text-sm text-left list-disc pl-5 mt-2">
                  <li>Complete your profile</li>
                  <li>Set your availability</li>
                  <li>Start accepting delivery requests</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <div className="text-3xl font-bold">{formatTime(secondsLeft)}</div>
              </div>

              <p className="text-muted-foreground">
                We're reviewing your information to ensure it complies with our requirements. This usually takes around
                2 minutes.
              </p>

              <div className="rounded-lg bg-primary/10 p-4 text-left">
                <p className="font-medium mb-2">What we're checking:</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Verifying your ID documents</li>
                  <li>Confirming your BVN information</li>
                  <li>Processing your facial verification</li>
                  {secondsLeft < 60 && <li>Validating vehicle details</li>}
                  {secondsLeft < 30 && <li>Final account approval</li>}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isVerified && (
            <Button onClick={handleContinue} className="w-full">
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
