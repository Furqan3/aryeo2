"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageGallery } from "@/components/editor/image-gallery"
import { PropertiesPanel } from "@/components/editor/properties-panel"
import {
  ImageIcon,
  Settings2,
  Layers,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Sortable Layer Item Component
function SortableLayerItem({
  layer,
  index,
  isActive,
  isVisible,
  onSelectLayer,
  onToggleVisibility,
}: {
  layer: any
  index: number
  isActive: boolean
  isVisible: boolean
  onSelectLayer: (index: number) => void
  onToggleVisibility: (index: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
        isActive ? "bg-accent" : "hover:bg-accent/50",
        isDragging && "z-50"
      )}
      onClick={() => onSelectLayer(index)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </Button>

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
    </div>
  )
}

interface RightPanelProps {
  images: string[]
  layers: any[]
  activeObject: any
  onSelectImage: (image: string) => void
  onReplaceImage: (image: string) => void
  onSelectLayer: (index: number) => void
  onToggleVisibility: (index: number) => void
  onReorderLayers: (newLayers: any[]) => void
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
  onReorderLayers,
  onUpdateProperty,
  onDeleteObject,
}: RightPanelProps) {
  const isImageSelected = activeObject?.type === "image"

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevents accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id)
      const newIndex = Number(over.id)

      const newLayers = arrayMove(layers, oldIndex, newIndex)
      onReorderLayers(newLayers)
    }
  }

  // Reverse layers for display (top layer at top of list)
  const displayedLayers = [...layers].reverse()
  const layerIds = displayedLayers.map((_, i) => layers.length - 1 - i) // original indices

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
                <Settings2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No element selected</p>
              <p className="text-xs text-muted-foreground">
                Click on an element to edit its properties
              </p>
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
            <div className="py-4">
              {layers.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No layers yet
                </p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={layerIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {displayedLayers.map((layer, reversedIndex) => {
                        const originalIndex = layers.length - 1 - reversedIndex
                        const isActive = activeObject === layer
                        const isVisible = layer.visible !== false

                        return (
                          <SortableLayerItem
                            key={originalIndex}
                            layer={layer}
                            index={originalIndex}
                            isActive={isActive}
                            isVisible={isVisible}
                            onSelectLayer={onSelectLayer}
                            onToggleVisibility={onToggleVisibility}
                          />
                        )
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}