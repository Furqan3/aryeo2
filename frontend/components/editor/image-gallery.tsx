"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ImageIcon, Search, Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  onSelectImage: (image: string) => void
  mode?: "add" | "replace"
}

export function ImageGallery({ images, onSelectImage, mode = "add" }: ImageGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredImages = images.filter((_, index) =>
    `Image ${index + 1}`.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          <ImageIcon className="w-6 h-6 text-zinc-500" />
        </div>
        <p className="text-sm font-medium text-white mb-1">No images available</p>
        <p className="text-xs text-zinc-500">Upload images to get started</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-white">Photos</h3>
        {mode === "replace" && (
          <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">Replace Mode</span>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2">
          {filteredImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all group",
                selectedImage === image
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-zinc-700 hover:border-zinc-500",
              )}
              onClick={() => {
                setSelectedImage(image)
                onSelectImage(image)
              }}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity",
                  selectedImage === image ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                )}
              >
                {selectedImage === image ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
