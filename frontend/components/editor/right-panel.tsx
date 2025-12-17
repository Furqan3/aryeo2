"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageGallery } from "@/components/editor/image-gallery"
import { PropertiesPanel } from "@/components/editor/properties-panel"
import { ImageIcon, Settings2, Layers, Eye, EyeOff, ChevronUp, ChevronDown, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RightPanelProps {
  images: string[]
  layers: any[]
  activeObject: any
  onSelectImage: (image: string) => void
  onReplaceImage: (image: string) => void
  onSelectLayer: (index: number) => void
  onToggleVisibility: (index: number) => void
  onMoveLayer: (index: number, direction: "up" | "down") => void
  onReorderLayers: (layers: any[]) => void
  onUpdateProperty: (property: string, value: any) => void
  onDeleteObject: () => void
}

export function RightPanel({
  images,
  layers,
  activeObject,
  onSelectImage,
  onReplaceImage,
  onSelectLayer,
  onToggleVisibility,
  onMoveLayer,
  onUpdateProperty,
  onDeleteObject,
}: RightPanelProps) {
  const isImageSelected = activeObject?.type === "image"

  return (
    <div className="w-80 bg-sidebar border-l border-border flex flex-col h-full">
      <Tabs defaultValue="properties" className="flex flex-col h-full">
        <div className="border-b border-border">
          <TabsList className="w-full h-12 bg-transparent rounded-none p-0 gap-0">
            <TabsTrigger
              value="properties"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger
              value="layers"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Layers className="w-4 h-4 mr-2" />
              Layers
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="properties" className="mt-0 p-4 flex-1 overflow-auto">
          {activeObject ? (
            <PropertiesPanel
              activeObject={activeObject}
              onUpdate={onUpdateProperty}
              onDelete={onDeleteObject}
              onReplaceImage={onReplaceImage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No element selected</p>
              <p className="text-xs text-muted-foreground">Click on an element to edit its properties</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="images" className="mt-0 p-4 flex-1 flex flex-col overflow-hidden">
          <ImageGallery
            images={images}
            onSelectImage={isImageSelected ? onReplaceImage : onSelectImage}
            mode={isImageSelected ? "replace" : "add"}
          />
        </TabsContent>

        <TabsContent value="layers" className="mt-0 flex-1 flex flex-col">
          <ScrollArea className="flex-1 px-4">
            <div className="py-4 space-y-2">
              {layers.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No layers yet
                </p>
              ) : (
                [...layers].reverse().map((layer, reversedIndex) => {
                  const index = layers.length - 1 - reversedIndex // original index (top = highest)
                  const isActive = activeObject === layer
                  const isVisible = layer.visible !== false

                  return (
                    <div
                      key={index}
                      className={cn(
                        "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                        isActive ? "bg-accent" : "hover:bg-accent/50"
                      )}
                      onClick={() => onSelectLayer(index)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleVisibility(index)
                        }}
                      >
                        {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>

                      <div className="flex-1 text-sm truncate">
                        {layer.name || `Layer ${index + 1}`}
                      </div>

                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === layers.length - 1}
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveLayer(index, "up")
                          }}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveLayer(index, "down")
                          }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}