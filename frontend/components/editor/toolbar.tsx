"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Minus,
  Sparkles,
  Copy,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  Group,
  Ungroup,
  Star,
  Hexagon,
  Upload,
  Save,
  FolderOpen,
  Grid3x3,
  ArrowRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface ToolbarProps {
  canUndo: boolean
  canRedo: boolean
  zoom: number
  hasSelection: boolean
  canGroup: boolean
  isGrouped: boolean
  showGrid: boolean
  onUndo: () => void
  onRedo: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onDownload: () => void
  onAddText: () => void
  onAddShape: (shape: string) => void
  onOpenTemplates: () => void
  onDuplicate: () => void
  onDelete: () => void
  onAlign: (direction: string) => void
  onGroup: () => void
  onUngroup: () => void
  onUploadImage: () => void
  onSaveProject: () => void
  onLoadProject: () => void
  onToggleGrid: () => void
}

export function Toolbar({
  canUndo,
  canRedo,
  zoom,
  hasSelection,
  canGroup,
  isGrouped,
  showGrid,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onDownload,
  onAddText,
  onAddShape,
  onOpenTemplates,
  onDuplicate,
  onDelete,
  onAlign,
  onGroup,
  onUngroup,
  onUploadImage,
  onSaveProject,
  onLoadProject,
  onToggleGrid,
}: ToolbarProps) {
  return (
    <div className="h-14 border-b bg-card flex items-center justify-between px-4 gap-2">
      {/* Left Section - History & File */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo2 className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <Button variant="ghost" size="sm" onClick={onSaveProject} className="gap-2" title="Save Project">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={onLoadProject} className="gap-2" title="Load Project">
          <FolderOpen className="w-4 h-4" />
          Open
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* Add Elements */}
        <Button variant="ghost" size="sm" onClick={onAddText} className="gap-2" title="Add Text (T)">
          <Type className="w-4 h-4" />
          Text
        </Button>

        <Button variant="ghost" size="sm" onClick={onUploadImage} className="gap-2" title="Upload Image">
          <Upload className="w-4 h-4" />
          Upload
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Square className="w-4 h-4" />
              Shapes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Basic Shapes</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onAddShape("rect")}>
              <Square className="w-4 h-4 mr-2" />
              Rectangle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddShape("circle")}>
              <Circle className="w-4 h-4 mr-2" />
              Circle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddShape("triangle")}>
              <Triangle className="w-4 h-4 mr-2" />
              Triangle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Special Shapes</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onAddShape("star")}>
              <Star className="w-4 h-4 mr-2" />
              Star
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddShape("polygon")}>
              <Hexagon className="w-4 h-4 mr-2" />
              Hexagon
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddShape("arrow")}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Arrow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddShape("line")}>
              <Minus className="w-4 h-4 mr-2" />
              Line
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={onOpenTemplates} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Templates
        </Button>
      </div>

      {/* Middle Section - Object Actions */}
      {hasSelection && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDuplicate}
            title="Duplicate (Ctrl+D)"
            className="text-primary"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Delete (Del)" className="text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Alignment */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <AlignCenter className="w-4 h-4" />
                Align
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Horizontal</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onAlign("left")}>
                <AlignLeft className="w-4 h-4 mr-2" />
                Align Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAlign("center-h")}>
                <AlignHorizontalJustifyCenter className="w-4 h-4 mr-2" />
                Align Center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAlign("right")}>
                <AlignRight className="w-4 h-4 mr-2" />
                Align Right
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Vertical</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onAlign("top")}>
                <AlignLeft className="w-4 h-4 mr-2 rotate-90" />
                Align Top
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAlign("center-v")}>
                <AlignVerticalJustifyCenter className="w-4 h-4 mr-2" />
                Align Middle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAlign("bottom")}>
                <AlignRight className="w-4 h-4 mr-2 rotate-90" />
                Align Bottom
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Group/Ungroup */}
          {isGrouped ? (
            <Button variant="ghost" size="sm" onClick={onUngroup} className="gap-2" title="Ungroup (Ctrl+Shift+G)">
              <Ungroup className="w-4 h-4" />
              Ungroup
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onGroup}
              disabled={!canGroup}
              className="gap-2"
              title="Group (Ctrl+G)"
            >
              <Group className="w-4 h-4" />
              Group
            </Button>
          )}
        </div>
      )}

      {/* Right Section - View & Export */}
      <div className="flex items-center gap-2">
        <Button
          variant={showGrid ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleGrid}
          className="gap-2"
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
          {showGrid && <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">On</Badge>}
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onZoomOut} title="Zoom Out (-)">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px] text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={onZoomIn} title="Zoom In (+)">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <Button variant="default" size="sm" onClick={onDownload} className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
