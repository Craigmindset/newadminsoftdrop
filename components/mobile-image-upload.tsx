"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, X, Loader2, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { processImageForUpload, isMobileDevice } from "@/lib/mobile-image-utils"
import { getInitials } from "@/lib/image-utils"
import { useToast } from "@/components/ui/use-toast"

interface MobileImageUploadProps {
  initialImage?: string | null
  userName?: string
  onImageSelect: (file: File | Blob) => void
  onImageRemove: () => void
  isUploading?: boolean
  uploadError?: string | null
}

export default function MobileImageUpload({
  initialImage,
  userName,
  onImageSelect,
  onImageRemove,
  isUploading = false,
  uploadError = null,
}: MobileImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null)
  const [processingImage, setProcessingImage] = useState(false)
  const [processingDetails, setProcessingDetails] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const isMobile = isMobileDevice()

  // Update preview when initialImage changes
  useEffect(() => {
    setImagePreview(initialImage || null)
  }, [initialImage])

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      try {
        // Show processing state for large images
        if (file.size > 1024 * 1024) {
          setProcessingImage(true)
          toast({
            title: "Processing image",
            description: "Large image detected. Optimizing for upload...",
          })
        }

        // Process image for upload (compress, convert format if needed)
        const result = await processImageForUpload(file)

        // Create preview
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview)
        }
        const preview = URL.createObjectURL(result.processedFile)
        setImagePreview(preview)

        // Pass the processed file to parent
        onImageSelect(result.processedFile)

        // Store processing details
        if (result.wasProcessed) {
          setProcessingDetails(result.processingDetails || [])

          // Show toast for significant size reduction
          if (result.originalSize > result.processedSize * 1.5) {
            toast({
              title: "Image optimized",
              description: `Reduced from ${Math.round(result.originalSize / 1024)}KB to ${Math.round(result.processedSize / 1024)}KB`,
              variant: "default",
            })
          }
        } else {
          setProcessingDetails([])
        }
      } catch (error) {
        console.error("Error processing image:", error)
        toast({
          title: "Image processing failed",
          description: error instanceof Error ? error.message : "Failed to process image",
          variant: "destructive",
        })

        // Fall back to original file if processing fails
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview)
        }
        const preview = URL.createObjectURL(file)
        setImagePreview(preview)
        onImageSelect(file)
      } finally {
        setProcessingImage(false)
      }
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setProcessingDetails([])
    onImageRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative cursor-pointer group" onClick={handleImageClick}>
        <Avatar className="h-32 w-32 border-2 border-muted">
          <AvatarImage src={imagePreview || ""} alt={userName || "Profile"} />
          <AvatarFallback className="text-4xl">{getInitials(userName)}</AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {processingImage ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : isUploading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </div>

        {imagePreview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        capture={isMobile ? "environment" : undefined}
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleImageClick}
        disabled={isUploading || processingImage}
        className="gap-2"
      >
        {processingImage ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : imagePreview ? (
          <>
            <Camera className="h-4 w-4" />
            Change Picture
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Picture
          </>
        )}
      </Button>

      {uploadError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {processingDetails.length > 0 && (
        <div className="w-full">
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="text-xs p-0 h-auto">
            {showDetails ? "Hide" : "Show"} processing details
          </Button>

          {showDetails && (
            <div className="text-xs text-muted-foreground mt-1 space-y-1">
              {processingDetails.map((detail, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        {isMobile ? (
          <>
            Tap to take a photo or select from your gallery.
            <br />
            Large images will be automatically optimized.
          </>
        ) : (
          <>
            Recommended: Square image, at least 300x300 pixels.
            <br />
            Maximum file size: 5MB.
          </>
        )}
      </p>
    </div>
  )
}
