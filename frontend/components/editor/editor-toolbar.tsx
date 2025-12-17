"use client"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3x3,
  Copy,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignStartVertical,
  AlignEndVertical,
  Group,
  Ungroup,
  MoveUp,
  MoveDown,
  ArrowUpToLine,
  ArrowDownToLine,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EditorToolbarProps {
  zoom: number
  showGrid: boolean
  hasSelection: boolean
  canGroup: boolean
  isGrouped: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onZoomChange: (zoom: number) => void
  onToggleGrid: () => void
  onDuplicate: () => void
  onDelete: () => void
  onAlign: (direction: string) => void
  onGroup: () => void
  onUngroup: () => void
  onBringForward: () => void
  onSendBackward: () => void
  onBringToFront: () => void
  onSendToBack: () => void
  onFlipHorizontal?: () => void
  onFlipVertical?: () => void
}

export function EditorToolbar({
  zoom,
  showGrid,
  hasSelection,
  canGroup,
  isGrouped,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomChange,
  onToggleGrid,
  onDuplicate,
  onDelete,
  onAlign,
  onGroup,
  onUngroup,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onFlipHorizontal,
  onFlipVertical,
}: EditorToolbarProps) {
  return (
    <div className="h-10 bg-[#1f1f1f] border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
      {/* Left - Selection actions */}
      <div className="flex items-center gap-1">
        {hasSelection ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
                    onClick={onDuplicate}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">Duplicate</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-zinc-700"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-700" />

            {/* Flip buttons */}
            {onFlipHorizontal && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
                      onClick={onFlipHorizontal}
                    >
                      <FlipHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">Flip Horizontal</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {onFlipVertical && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
                      onClick={onFlipVertical}
                    >
                      <FlipVertical className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">Flip Vertical</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-700" />

            {/* Alignment */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700"
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                  Align
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#252525] border-zinc-700">
                <DropdownMenuLabel className="text-zinc-400">Horizontal</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onAlign("left")} className="text-zinc-200 focus:bg-zinc-700">
                  <AlignLeft className="h-4 w-4 mr-2" /> Left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAlign("center-h")} className="text-zinc-200 focus:bg-zinc-700">
                  <AlignHorizontalJustifyCenter className="h-4 w-4 mr-2" /> Center
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAlign("right")} className="text-zinc-200 focus:bg-zinc-700">
                  <AlignRight className="h-4 w-4 mr-2" /> Right
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuLabel className="text-zinc-400">Vertical</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onAlign("top")} className="text-zinc-200 focus:bg-zinc-700">
                  <AlignStartVertical className="h-4 w-4 mr-2" /> Top
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAlign("center-v")} className="text-zinc-200 focus:bg-zinc-700">
                  <AlignVerticalJustifyCenter className="h-4 w-4 mr-2" /> Middle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAlign("bottom")} className="text-zinc-200 focus:bg-zinc-700">
                  <AlignEndVertical className="h-4 w-4 mr-2" /> Bottom
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Layer order */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700"
                >
                  <MoveUp className="h-3.5 w-3.5" />
                  Position
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#252525] border-zinc-700">
                <DropdownMenuItem onClick={onBringToFront} className="text-zinc-200 focus:bg-zinc-700">
                  <ArrowUpToLine className="h-4 w-4 mr-2" /> Bring to Front
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onBringForward} className="text-zinc-200 focus:bg-zinc-700">
                  <MoveUp className="h-4 w-4 mr-2" /> Bring Forward
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSendBackward} className="text-zinc-200 focus:bg-zinc-700">
                  <MoveDown className="h-4 w-4 mr-2" /> Send Backward
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSendToBack} className="text-zinc-200 focus:bg-zinc-700">
                  <ArrowDownToLine className="h-4 w-4 mr-2" /> Send to Back
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-700" />

            {/* Group/Ungroup */}
            {isGrouped ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700"
                onClick={onUngroup}
              >
                <Ungroup className="h-3.5 w-3.5" /> Ungroup
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700"
                onClick={onGroup}
                disabled={!canGroup}
              >
                <Group className="h-3.5 w-3.5" /> Group
              </Button>
            )}
          </>
        ) : (
          <span className="text-xs text-zinc-500">Select an element to edit</span>
        )}
      </div>

      {/* Right - View controls */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 w-7 p-0",
                  showGrid ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-700",
                )}
                onClick={onToggleGrid}
              >
                <Grid3x3 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">Toggle Grid</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-4 bg-zinc-700" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
            onClick={onZoomOut}
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>

          <div className="w-20 flex items-center px-1">
            <Slider
              value={[zoom * 100]}
              min={10}
              max={200}
              step={10}
              onValueChange={([value]) => onZoomChange(value / 100)}
              className="w-full"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
            onClick={onZoomIn}
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs min-w-[40px] text-zinc-400 hover:text-white hover:bg-zinc-700"
            onClick={onZoomReset}
          >
            {Math.round(zoom * 100)}%
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
                  onClick={onZoomReset}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">Fit to Screen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
