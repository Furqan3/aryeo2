"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Type,
  Square,
  ImageIcon,
  Circle,
  GripVertical,
  MoreHorizontal,
  Trash2,
  Copy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface Layer {
  id: string
  type: string
  name?: string
  visible?: boolean
  locked?: boolean
}

interface LayersPanelProps {
  layers: Layer[]
  onSelectLayer: (index: number) => void
  onToggleVisibility: (index: number) => void
  onToggleLock?: (index: number) => void
  onMoveLayer: (index: number, direction: "up" | "down") => void
  onReorderLayers: (newLayers: Layer[]) => void
  onDuplicateLayer?: (index: number) => void
  onDeleteLayer?: (index: number) => void
}

export function LayersPanel({
  layers,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
  onReorderLayers,
  onDuplicateLayer,
  onDeleteLayer,
}: LayersPanelProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedIdx(null)
    setDropTargetIdx(null)
    setIsDraggingOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (draggedIdx === null) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const midpointY = rect.top + rect.height / 2
    const mouseY = e.clientY

    const newDropIdx = mouseY < midpointY ? idx : idx + 1
    setDropTargetIdx(newDropIdx)
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedIdx === null || dropTargetIdx === null) return

    const newLayers = [...layers]
    const [moved] = newLayers.splice(draggedIdx, 1)

    let insertIdx = dropTargetIdx
    if (dropTargetIdx > draggedIdx) insertIdx -= 1

    newLayers.splice(insertIdx, 0, moved)
    onReorderLayers(newLayers)

    setDraggedIdx(null)
    setDropTargetIdx(null)
    setIsDraggingOver(false)
  }

  const startRename = (idx: number, currentName: string) => {
    setEditingIdx(idx)
    setEditValue(currentName ?? "")
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const finishRename = () => {
    if (editingIdx === null) return
    const trimmed = editValue.trim()
    if (trimmed) {
      const newLayers = [...layers]
      newLayers[editingIdx] = { ...newLayers[editingIdx], name: trimmed }
      onReorderLayers(newLayers)
    }
    setEditingIdx(null)
    setEditValue("")
  }

  const getLayerIcon = (type: string) => {
    switch (type) {
      case "textbox":
      case "text":
        return <Type className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "rect":
        return <Square className="w-4 h-4" />
      case "circle":
        return <Circle className="w-4 h-4" />
      default:
        return <Square className="w-4 h-4" />
    }
  }

  const getLayerName = (layer: Layer, index: number) => {
    if (layer.name) return layer.name
    const typeName = layer.type.charAt(0).toUpperCase() + layer.type.slice(1)
    return `${typeName} ${layers.length - index}`
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Layers</h3>
        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">{layers.length}</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="relative p-2" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          {isDraggingOver &&
            dropTargetIdx !== null &&
            [...Array(layers.length + 1)].map(
              (_, i) =>
                i === dropTargetIdx && (
                  <div
                    key={`drop-${i}`}
                    className="absolute left-2 right-2 h-0.5 bg-primary z-10 pointer-events-none rounded-full"
                    style={{
                      top:
                        i === 0
                          ? 8
                          : i === layers.length
                            ? "calc(100% - 8px)"
                            : `calc(${(i * 100) / layers.length}% + 4px)`,
                    }}
                  />
                ),
            )}

          <div className="space-y-1">
            {layers.map((layer, idx) => {
              const isDragging = draggedIdx === idx
              const isSelected = selectedIdx === idx

              return (
                <div
                  key={layer.id ?? idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnd={handleDragEnd}
                  onDragEnter={(e) => handleDragEnter(e, idx)}
                  className={cn(
                    "relative flex items-center gap-2 p-2 rounded-md transition-all cursor-move select-none group",
                    isDragging && "opacity-40 scale-95",
                    isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-accent border border-transparent",
                  )}
                  onClick={() => {
                    setSelectedIdx(idx)
                    onSelectLayer(idx)
                  }}
                >
                  <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className={cn(
                      "w-8 h-8 rounded flex items-center justify-center flex-shrink-0",
                      isSelected ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {getLayerIcon(layer.type)}
                  </div>

                  <div className="flex-1 min-w-0" onDoubleClick={() => startRename(idx, layer.name ?? "")}>
                    {editingIdx === idx ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={finishRename}
                        onKeyDown={(e) => e.key === "Enter" && finishRename()}
                        className="w-full bg-transparent outline-none border-b border-primary px-1 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm truncate block">{getLayerName(layer, idx)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleVisibility(idx)
                      }}
                    >
                      {layer.visible !== false ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startRename(idx, layer.name ?? "")}>Rename</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicateLayer?.(idx)}>
                          <Copy className="w-3 h-3 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onMoveLayer(idx, "up")} disabled={idx === 0}>
                          <ArrowUp className="w-3 h-3 mr-2" />
                          Move Up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onMoveLayer(idx, "down")} disabled={idx === layers.length - 1}>
                          <ArrowDown className="w-3 h-3 mr-2" />
                          Move Down
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onDeleteLayer?.(idx)}>
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>

          {layers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                <Square className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No layers yet</p>
              <p className="text-xs text-muted-foreground">Add elements to see them here</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
