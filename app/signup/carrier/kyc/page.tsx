"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function CarrierKycPage() {
  const router = useRouter()
  const [frontIdImage, setFrontIdImage] = useState<File | null>(null)
  const [backIdImage, setBackIdImage] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)

  const handleFrontIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFrontIdImage(file)
      setFrontPreview(URL.createObjectURL(file))
    }
  }

  const handleBackIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBackIdImage(file)
      setBackPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would upload the ID images to your server here
    router.push("/signup/carrier/kyc/bvn")
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-0 max-w-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Carrier Verification</h2>
        <p className="text-muted-foreground">Step 1 of 4: ID Verification</p>
        <Progress value={25} className="mt-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload ID Document</CardTitle>
          <CardDescription>
            Please upload a valid government-issued ID (National ID, Driver's License, or Passport)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="front-id" className="block text-sm font-medium mb-2">
                  Front of ID
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => document.getElementById("front-id")?.click()}
                >
                  {frontPreview ? (
                    <div className="relative aspect-video">
                      <img
                        src={frontPreview || "/placeholder.svg"}
                        alt="Front of ID"
                        className="rounded-lg object-cover max-h-40 mx-auto"
                      />
                    </div>
                  ) : (
                    <div className="py-4 flex flex-col items-center">
                      <CreditCard className="h-10 w-10 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF (max. 5MB)</p>
                    </div>
                  )}
                  <input
                    id="front-id"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFrontIdChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="back-id" className="block text-sm font-medium mb-2">
                  Back of ID
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => document.getElementById("back-id")?.click()}
                >
                  {backPreview ? (
                    <div className="relative aspect-video">
                      <img
                        src={backPreview || "/placeholder.svg"}
                        alt="Back of ID"
                        className="rounded-lg object-cover max-h-40 mx-auto"
                      />
                    </div>
                  ) : (
                    <div className="py-4 flex flex-col items-center">
                      <CreditCard className="h-10 w-10 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF (max. 5MB)</p>
                    </div>
                  )}
                  <input
                    id="back-id"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleBackIdChange}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!frontIdImage || !backIdImage}>
              Submit ID <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
