"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Check, RotateCw } from "lucide-react"

interface CropRegion {
  x: number
  y: number
  width: number
  height: number
}

interface ImageCropperProps {
  imageUrl: string
  onCropComplete: (croppedImageUrl: string) => void
  onCancel: () => void
  aspectRatio?: number // optional: 1 for square, 16/9 for landscape, etc.
}

type HandlePosition = 
  | "top-left" 
  | "top-right" 
  | "bottom-left" 
  | "bottom-right" 
  | "top" 
  | "bottom" 
  | "left" 
  | "right"
  | "move"

export function ImageCropper({ imageUrl, onCropComplete, onCancel, aspectRatio }: ImageCropperProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [cropRegion, setCropRegion] = useState<CropRegion>({ x: 50, y: 50, width: 400, height: 300 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragHandle, setDragHandle] = useState<HandlePosition | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialCrop, setInitialCrop] = useState<CropRegion>({ x: 50, y: 50, width: 400, height: 300 })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      // Set initial crop to center of image
      const initialWidth = Math.min(img.width * 0.8, 600)
      const initialHeight = aspectRatio ? initialWidth / aspectRatio : Math.min(img.height * 0.8, 450)
      const initialX = (img.width - initialWidth) / 2
      const initialY = (img.height - initialHeight) / 2
      setCropRegion({ x: initialX, y: initialY, width: initialWidth, height: initialHeight })
    }
    img.src = imageUrl
  }, [imageUrl, aspectRatio])

  // Draw canvas with image and crop overlay
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match image
    canvas.width = image.width
    canvas.height = image.height

    // Draw image
    ctx.drawImage(image, 0, 0)

    // Draw dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Clear crop region
    ctx.clearRect(cropRegion.x, cropRegion.y, cropRegion.width, cropRegion.height)
    ctx.drawImage(
      image,
      cropRegion.x,
      cropRegion.y,
      cropRegion.width,
      cropRegion.height,
      cropRegion.x,
      cropRegion.y,
      cropRegion.width,
      cropRegion.height
    )

    // Draw crop border
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.strokeRect(cropRegion.x, cropRegion.y, cropRegion.width, cropRegion.height)

    // Draw grid (rule of thirds)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    ctx.lineWidth = 1
    
    // Vertical lines
    ctx.beginPath()
    ctx.moveTo(cropRegion.x + cropRegion.width / 3, cropRegion.y)
    ctx.lineTo(cropRegion.x + cropRegion.width / 3, cropRegion.y + cropRegion.height)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(cropRegion.x + (cropRegion.width * 2) / 3, cropRegion.y)
    ctx.lineTo(cropRegion.x + (cropRegion.width * 2) / 3, cropRegion.y + cropRegion.height)
    ctx.stroke()

    // Horizontal lines
    ctx.beginPath()
    ctx.moveTo(cropRegion.x, cropRegion.y + cropRegion.height / 3)
    ctx.lineTo(cropRegion.x + cropRegion.width, cropRegion.y + cropRegion.height / 3)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(cropRegion.x, cropRegion.y + (cropRegion.height * 2) / 3)
    ctx.lineTo(cropRegion.x + cropRegion.width, cropRegion.y + (cropRegion.height * 2) / 3)
    ctx.stroke()

    // Draw corner handles
    const handleSize = 12
    const handles = [
      { x: cropRegion.x, y: cropRegion.y }, // top-left
      { x: cropRegion.x + cropRegion.width, y: cropRegion.y }, // top-right
      { x: cropRegion.x, y: cropRegion.y + cropRegion.height }, // bottom-left
      { x: cropRegion.x + cropRegion.width, y: cropRegion.y + cropRegion.height }, // bottom-right
    ]

    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2

    handles.forEach((handle) => {
      ctx.beginPath()
      ctx.arc(handle.x, handle.y, handleSize / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })

    // Draw edge handles (middle of each side)
    const edgeHandles = [
      { x: cropRegion.x + cropRegion.width / 2, y: cropRegion.y }, // top
      { x: cropRegion.x + cropRegion.width / 2, y: cropRegion.y + cropRegion.height }, // bottom
      { x: cropRegion.x, y: cropRegion.y + cropRegion.height / 2 }, // left
      { x: cropRegion.x + cropRegion.width, y: cropRegion.y + cropRegion.height / 2 }, // right
    ]

    edgeHandles.forEach((handle) => {
      ctx.beginPath()
      ctx.arc(handle.x, handle.y, handleSize / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })
  }, [image, cropRegion])

  // Get cursor position relative to canvas
  const getCursorPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  // Detect which handle is being grabbed
  const getHandleAtPosition = (x: number, y: number): HandlePosition | null => {
    const threshold = 15

    // Check corners
    if (Math.abs(x - cropRegion.x) < threshold && Math.abs(y - cropRegion.y) < threshold) {
      return "top-left"
    }
    if (Math.abs(x - (cropRegion.x + cropRegion.width)) < threshold && Math.abs(y - cropRegion.y) < threshold) {
      return "top-right"
    }
    if (Math.abs(x - cropRegion.x) < threshold && Math.abs(y - (cropRegion.y + cropRegion.height)) < threshold) {
      return "bottom-left"
    }
    if (
      Math.abs(x - (cropRegion.x + cropRegion.width)) < threshold &&
      Math.abs(y - (cropRegion.y + cropRegion.height)) < threshold
    ) {
      return "bottom-right"
    }

    // Check edges
    if (Math.abs(x - (cropRegion.x + cropRegion.width / 2)) < threshold && Math.abs(y - cropRegion.y) < threshold) {
      return "top"
    }
    if (
      Math.abs(x - (cropRegion.x + cropRegion.width / 2)) < threshold &&
      Math.abs(y - (cropRegion.y + cropRegion.height)) < threshold
    ) {
      return "bottom"
    }
    if (Math.abs(x - cropRegion.x) < threshold && Math.abs(y - (cropRegion.y + cropRegion.height / 2)) < threshold) {
      return "left"
    }
    if (
      Math.abs(x - (cropRegion.x + cropRegion.width)) < threshold &&
      Math.abs(y - (cropRegion.y + cropRegion.height / 2)) < threshold
    ) {
      return "right"
    }

    // Check if inside crop region (for moving)
    if (
      x >= cropRegion.x &&
      x <= cropRegion.x + cropRegion.width &&
      y >= cropRegion.y &&
      y <= cropRegion.y + cropRegion.height
    ) {
      return "move"
    }

    return null
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCursorPosition(e)
    const handle = getHandleAtPosition(pos.x, pos.y)

    if (handle) {
      setIsDragging(true)
      setDragHandle(handle)
      setDragStart(pos)
      setInitialCrop({ ...cropRegion })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragHandle || !image) return

    const pos = getCursorPosition(e)
    const dx = pos.x - dragStart.x
    const dy = pos.y - dragStart.y

    let newCrop = { ...cropRegion }

    switch (dragHandle) {
      case "top-left":
        newCrop.x = Math.max(0, Math.min(initialCrop.x + dx, initialCrop.x + initialCrop.width - 50))
        newCrop.y = Math.max(0, Math.min(initialCrop.y + dy, initialCrop.y + initialCrop.height - 50))
        newCrop.width = initialCrop.width - (newCrop.x - initialCrop.x)
        newCrop.height = initialCrop.height - (newCrop.y - initialCrop.y)
        break
      case "top-right":
        newCrop.y = Math.max(0, Math.min(initialCrop.y + dy, initialCrop.y + initialCrop.height - 50))
        newCrop.width = Math.max(50, Math.min(initialCrop.width + dx, image.width - initialCrop.x))
        newCrop.height = initialCrop.height - (newCrop.y - initialCrop.y)
        break
      case "bottom-left":
        newCrop.x = Math.max(0, Math.min(initialCrop.x + dx, initialCrop.x + initialCrop.width - 50))
        newCrop.width = initialCrop.width - (newCrop.x - initialCrop.x)
        newCrop.height = Math.max(50, Math.min(initialCrop.height + dy, image.height - initialCrop.y))
        break
      case "bottom-right":
        newCrop.width = Math.max(50, Math.min(initialCrop.width + dx, image.width - initialCrop.x))
        newCrop.height = Math.max(50, Math.min(initialCrop.height + dy, image.height - initialCrop.y))
        break
      case "top":
        newCrop.y = Math.max(0, Math.min(initialCrop.y + dy, initialCrop.y + initialCrop.height - 50))
        newCrop.height = initialCrop.height - (newCrop.y - initialCrop.y)
        break
      case "bottom":
        newCrop.height = Math.max(50, Math.min(initialCrop.height + dy, image.height - initialCrop.y))
        break
      case "left":
        newCrop.x = Math.max(0, Math.min(initialCrop.x + dx, initialCrop.x + initialCrop.width - 50))
        newCrop.width = initialCrop.width - (newCrop.x - initialCrop.x)
        break
      case "right":
        newCrop.width = Math.max(50, Math.min(initialCrop.width + dx, image.width - initialCrop.x))
        break
      case "move":
        newCrop.x = Math.max(0, Math.min(initialCrop.x + dx, image.width - initialCrop.width))
        newCrop.y = Math.max(0, Math.min(initialCrop.y + dy, image.height - initialCrop.height))
        break
    }

    // Apply aspect ratio constraint if provided
    if (aspectRatio && dragHandle !== "move") {
      if (dragHandle.includes("right") || dragHandle === "left") {
        newCrop.height = newCrop.width / aspectRatio
      } else if (dragHandle.includes("top") || dragHandle.includes("bottom")) {
        newCrop.width = newCrop.height * aspectRatio
      }

      // Ensure crop doesn't exceed image bounds
      if (newCrop.x + newCrop.width > image.width) {
        newCrop.width = image.width - newCrop.x
        newCrop.height = newCrop.width / aspectRatio
      }
      if (newCrop.y + newCrop.height > image.height) {
        newCrop.height = image.height - newCrop.y
        newCrop.width = newCrop.height * aspectRatio
      }
    }

    setCropRegion(newCrop)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragHandle(null)
  }

  // Update cursor based on handle position
  const handleMouseMoveForCursor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return

    const pos = getCursorPosition(e)
    const handle = getHandleAtPosition(pos.x, pos.y)

    const canvas = canvasRef.current
    if (!canvas) return

    switch (handle) {
      case "top-left":
      case "bottom-right":
        canvas.style.cursor = "nwse-resize"
        break
      case "top-right":
      case "bottom-left":
        canvas.style.cursor = "nesw-resize"
        break
      case "top":
      case "bottom":
        canvas.style.cursor = "ns-resize"
        break
      case "left":
      case "right":
        canvas.style.cursor = "ew-resize"
        break
      case "move":
        canvas.style.cursor = "move"
        break
      default:
        canvas.style.cursor = "default"
    }
  }

  // Handle crop confirmation
  const handleCropConfirm = useCallback(() => {
    if (!image || !canvasRef.current) return

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement("canvas")
    const ctx = cropCanvas.getContext("2d")
    if (!ctx) return

    cropCanvas.width = cropRegion.width
    cropCanvas.height = cropRegion.height

    ctx.drawImage(
      image,
      cropRegion.x,
      cropRegion.y,
      cropRegion.width,
      cropRegion.height,
      0,
      0,
      cropRegion.width,
      cropRegion.height
    )

    cropCanvas.toBlob((blob) => {
      if (blob) {
        const croppedUrl = URL.createObjectURL(blob)
        onCropComplete(croppedUrl)
      }
    }, "image/png")
  }, [image, cropRegion, onCropComplete])

  // Handle clicking outside the crop region
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCursorPosition(e)
    const handle = getHandleAtPosition(pos.x, pos.y)

    // If clicked outside crop region, confirm crop
    if (!handle) {
      handleCropConfirm()
    }
  }

  // Handle Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCropConfirm()
      } else if (e.key === "Escape") {
        onCancel()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleCropConfirm, onCancel])

  // Handle manual input changes
  const handleInputChange = (field: keyof CropRegion, value: string) => {
    const numValue = parseInt(value) || 0
    setCropRegion((prev) => {
      const newCrop = { ...prev, [field]: numValue }
      
      // Ensure values are within bounds
      if (image) {
        newCrop.x = Math.max(0, Math.min(newCrop.x, image.width - newCrop.width))
        newCrop.y = Math.max(0, Math.min(newCrop.y, image.height - newCrop.height))
        newCrop.width = Math.max(50, Math.min(newCrop.width, image.width - newCrop.x))
        newCrop.height = Math.max(50, Math.min(newCrop.height, image.height - newCrop.y))
      }
      
      return newCrop
    })
  }

  const resetCrop = () => {
    if (!image) return
    const initialWidth = Math.min(image.width * 0.8, 600)
    const initialHeight = aspectRatio ? initialWidth / aspectRatio : Math.min(image.height * 0.8, 450)
    const initialX = (image.width - initialWidth) / 2
    const initialY = (image.height - initialHeight) / 2
    setCropRegion({ x: initialX, y: initialY, width: initialWidth, height: initialHeight })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" ref={containerRef}>
      <div className="w-full h-full flex flex-col gap-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Crop Image</h2>
            <p className="text-sm text-gray-400 mt-1">
              Drag handles to adjust • Click outside or press Enter to confirm • Press Esc to cancel
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetCrop}>
              <RotateCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleCropConfirm}>
              <Check className="w-4 h-4 mr-2" />
              Confirm
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center overflow-auto">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full border border-gray-700 rounded"
            onMouseDown={handleMouseDown}
            onMouseMove={(e) => {
              handleMouseMove(e)
              handleMouseMoveForCursor(e)
            }}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
          />
        </div>

        {/* Crop Values Editor */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="crop-x" className="text-white text-xs mb-1 block">
                X Position
              </Label>
              <Input
                id="crop-x"
                type="number"
                value={Math.round(cropRegion.x)}
                onChange={(e) => handleInputChange("x", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="crop-y" className="text-white text-xs mb-1 block">
                Y Position
              </Label>
              <Input
                id="crop-y"
                type="number"
                value={Math.round(cropRegion.y)}
                onChange={(e) => handleInputChange("y", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="crop-width" className="text-white text-xs mb-1 block">
                Width
              </Label>
              <Input
                id="crop-width"
                type="number"
                value={Math.round(cropRegion.width)}
                onChange={(e) => handleInputChange("width", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="crop-height" className="text-white text-xs mb-1 block">
                Height
              </Label>
              <Input
                id="crop-height"
                type="number"
                value={Math.round(cropRegion.height)}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
