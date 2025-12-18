"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Undo2, Redo2, Download, FolderOpen, ChevronLeft, FileDown, FileJson, ImageIcon, Loader2, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface EditorHeaderProps {
  projectName?: string
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onLoad: () => void
  onExport: () => void
  onExportJPG?: () => void
  onBack: () => void
  isSaving?: boolean
  lastSaved?: Date | null
}

export function EditorHeader({
  projectName = "Untitled Design",
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onExport,
  onExportJPG,
  onBack,
  isSaving,
  lastSaved,
}: EditorHeaderProps) {
  return (
    <header className="h-12 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-3 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <Separator orientation="vertical" className="h-5 bg-zinc-700" />

        <span className="font-medium text-sm text-white">{projectName}</span>

        {/* Save status indicator */}
        {(isSaving || lastSaved) && (
          <div className="flex items-center gap-1.5 ml-3 text-xs text-zinc-400">
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="h-3 w-3" />
                <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Center section - History */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Right section - Export buttons visible */}
      <div className="flex items-center gap-2">
       

        <Separator orientation="vertical" className="h-5 bg-zinc-700" />

        {/* File menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800">
              <FolderOpen className="h-4 w-4" />
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#252525] border-zinc-700 z-[100]">
            <DropdownMenuLabel className="text-zinc-400">Project</DropdownMenuLabel>
            <DropdownMenuItem onClick={onSave} className="text-zinc-200 focus:bg-zinc-700">
              <FileJson className="h-4 w-4 mr-2" />
              Save Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLoad} className="text-zinc-200 focus:bg-zinc-700">
              <FolderOpen className="h-4 w-4 mr-2" />
              Open Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export dropdown - Always visible */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#252525] border-zinc-700 z-[100]">
            <DropdownMenuLabel className="text-zinc-400">Export As</DropdownMenuLabel>
            <DropdownMenuItem onClick={onExport} className="text-zinc-200 focus:bg-zinc-700">
              <FileDown className="h-4 w-4 mr-2" />
              PNG (High Quality)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportJPG || onExport} className="text-zinc-200 focus:bg-zinc-700">
              <ImageIcon className="h-4 w-4 mr-2" />
              JPG (Compressed)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
