"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutTemplate,
  Type,
  ImageIcon,
  Shapes,
  Upload,
  Square,
  Circle,
  Triangle,
  Minus,
  Star,
  Hexagon,
  ArrowRight,
} from "lucide-react"

interface EditorSidebarProps {
  onAddText: () => void
  onAddShape: (shape: string) => void
  onOpenTemplates: () => void
  onUploadImage: () => void
  onStartDrawing?: () => void
  onStartErasing?: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

const tools = [
  { id: "templates", icon: LayoutTemplate, label: "Templates" },
  { id: "elements", icon: Shapes, label: "Elements" },
  { id: "text", icon: Type, label: "Text" },
  { id: "uploads", icon: Upload, label: "Upload" },
]

const shapes = [
  { id: "rect", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "triangle", icon: Triangle, label: "Triangle" },
  { id: "line", icon: Minus, label: "Line" },
  { id: "star", icon: Star, label: "Star" },
  { id: "polygon", icon: Hexagon, label: "Hexagon" },
  { id: "arrow", icon: ArrowRight, label: "Arrow" },
]

const textStyles = [
  { id: "heading", label: "Add a heading", fontSize: 64, fontWeight: "bold" },
  { id: "subheading", label: "Add a subheading", fontSize: 44, fontWeight: "semibold" },
  { id: "body", label: "Add body text", fontSize: 24, fontWeight: "normal" },
]

export function EditorSidebar({
  onAddText,
  onAddShape,
  onOpenTemplates,
  onUploadImage,
  activeTab,
  onTabChange,
}: EditorSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const renderPanelContent = () => {
    switch (activeTab) {
      case "templates":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Templates</h3>
            <div className="space-y-2">
              <button
                onClick={onOpenTemplates}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all text-left group"
              >
                <span className="block font-medium text-sm text-white">Real Estate Classic</span>
                <span className="block text-xs text-zinc-400 mt-1">Hero image with property details</span>
              </button>
              <button
                onClick={onOpenTemplates}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all text-left group"
              >
                <span className="block font-medium text-sm text-white">Minimal Modern</span>
                <span className="block text-xs text-zinc-400 mt-1">Split layout with info card</span>
              </button>
              <button
                onClick={onOpenTemplates}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all text-left group"
              >
                <span className="block font-medium text-sm text-white">Bold Luxury</span>
                <span className="block text-xs text-zinc-400 mt-1">Magazine style overlay</span>
              </button>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onOpenTemplates}>
              Browse All Templates
            </Button>
          </div>
        )

      case "elements":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Shapes</h3>
            <div className="grid grid-cols-4 gap-2">
              {shapes.map((shape) => (
                <TooltipProvider key={shape.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onAddShape(shape.id)}
                        className="aspect-square rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all flex items-center justify-center group"
                      >
                        <shape.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{shape.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <div className="pt-4 border-t border-zinc-700">
              <h3 className="font-semibold text-sm text-white mb-3">Lines & Arrows</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddShape("line")}
                  className="h-12 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all flex items-center justify-center"
                >
                  <Minus className="w-8 h-4 text-zinc-400" />
                </button>
                <button
                  onClick={() => onAddShape("arrow")}
                  className="h-12 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-4 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        )

      case "text":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Text Styles</h3>
            <div className="space-y-2">
              {textStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={onAddText}
                  className="w-full p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all text-left group"
                >
                  <span
                    className={cn(
                      "block text-white group-hover:text-white transition-colors",
                      style.fontWeight === "bold" && "font-bold text-lg",
                      style.fontWeight === "semibold" && "font-semibold text-base",
                      style.fontWeight === "normal" && "font-normal text-sm",
                    )}
                  >
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )

      case "uploads":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Upload Files</h3>
            <button
              onClick={onUploadImage}
              className="w-full aspect-video rounded-lg border-2 border-dashed border-zinc-600 hover:border-blue-500 hover:bg-zinc-800/30 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <Upload className="w-8 h-8 text-zinc-500 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">Click to upload</span>
              <span className="text-xs text-zinc-500">or drag and drop</span>
            </button>
            <p className="text-xs text-zinc-500 text-center">Supports: JPG, PNG, SVG, GIF</p>
          </div>
        )

     

      
      default:
        return null
    }
  }

  return (
    <div className="flex h-full">
      {/* Icon toolbar - Darker background */}
      <div className="w-14 bg-[#1a1a1a] border-r border-zinc-800 flex flex-col items-center py-2 gap-1">
        {tools.map((tool) => (
          <TooltipProvider key={tool.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    onTabChange(tool.id)
                    setIsExpanded(true)
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    activeTab === tool.id
                      ? "bg-blue-600 text-white"
                      : "text-zinc-500 hover:bg-zinc-800 hover:text-white",
                  )}
                >
                  <tool.icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-zinc-800 border-zinc-700 text-white">
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Expandable panel */}
      <div
        className={cn(
          "bg-[#252525] border-r border-zinc-800 transition-all duration-200 overflow-hidden",
          isExpanded ? "w-60" : "w-0",
        )}
      >
        <ScrollArea className="h-full">
          <div className="p-4">{renderPanelContent()}</div>
        </ScrollArea>
      </div>
    </div>
  )
}
