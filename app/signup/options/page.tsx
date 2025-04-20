"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const router = useRouter()

  const handleSenderSignup = () => {
    router.push("/signup/sender")
  }

  const handleCarrierSignup = () => {
    router.push("/signup/carrier")
  }

  return (
    <div className="bg-black text-white flex min-h-screen items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-md bg-gray-900 border border-gray-800 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">Sign up</CardTitle>
          <CardDescription className="text-gray-400">Choose your account type to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 xs:grid-cols-2">
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-800/50 border-white/20 hover:bg-gray-800 hover:border-white/40 text-white"
              onClick={handleSenderSignup}
            >
              <Package className="h-8 w-8 text-white" />
              <div className="text-center">
                <div className="font-medium">Send an Item</div>
                <div className="text-xs text-gray-400">Sign up as a sender</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-800/50 border-white/20 hover:bg-gray-800 hover:border-white/40 text-white"
              onClick={handleCarrierSignup}
            >
              <Truck className="h-8 w-8 text-white" />
              <div className="text-center">
                <div className="font-medium">Become a Carrier</div>
                <div className="text-xs text-gray-400">Start delivering items</div>
              </div>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="underline text-white hover:text-gray-300">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
