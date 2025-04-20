"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Camera, ChevronRight, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function FaceVerificationPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsCameraReady(true)
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return

    setIsCapturing(true)

    const context = canvasRef.current.getContext("2d")
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight

      context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight)

      const imageDataUrl = canvasRef.current.toDataURL("image/png")
      setCapturedImage(imageDataUrl)
    }

    setIsCapturing(false)
  }

  const handleRetake = () => {
    setCapturedImage(null)
  }

  const handleVerify = () => {
    setIsVerifying(true)

    // In a real app, you would send the captured image to your server for verification
    setTimeout(() => {
      setIsVerifying(false)
      router.push("/signup/carrier/kyc/data")
    }, 2000)
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-0 max-w-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Carrier Verification</h2>
        <p className="text-muted-foreground">Step 3 of 4: Face Verification</p>
        <Progress value={75} className="mt-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Face Verification</CardTitle>
          <CardDescription>Please take a clear selfie for identity verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-hidden rounded-lg bg-black aspect-video flex items-center justify-center relative">
            {capturedImage ? (
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured face"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraReady ? "block" : "hidden"}`}
                />
                {!isCameraReady && (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 text-white animate-spin mb-2" />
                    <p className="text-white text-sm">Initializing camera...</p>
                  </div>
                )}
              </>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex flex-col gap-3">
            {capturedImage ? (
              <>
                <Button variant="outline" className="gap-2" onClick={handleRetake} disabled={isVerifying}>
                  <RefreshCw className="h-4 w-4" /> Retake Photo
                </Button>
                <Button onClick={handleVerify} disabled={isVerifying} className="gap-2">
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Face <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleCapture} disabled={isCapturing || !isCameraReady} className="gap-2">
                {isCapturing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" /> Take Photo
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p>Please ensure:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your face is clearly visible</li>
              <li>The lighting is good</li>
              <li>You're not wearing sunglasses</li>
              <li>You're looking directly at the camera</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
