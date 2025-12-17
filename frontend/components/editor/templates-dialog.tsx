"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, LayoutTemplate, Check } from "lucide-react"
import { useState } from "react"

interface TemplatesDialogProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
}

const categories = ["All", "Real Estate", "Social Media", "Marketing", "Minimal"]

export function TemplatesDialog({ open, onClose, onSelectTemplate }: TemplatesDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: "real-estate-classic",
      name: "Real Estate Classic",
      description: "Hero image with property details and gallery grid. Perfect for property listings.",
      category: "Real Estate",
      features: ["Hero image", "Property info", "Gallery grid"],
    },
    {
      id: "minimal-modern",
      name: "Minimal Modern",
      description: "Clean split layout with large image and elegant info card. Great for modern properties.",
      category: "Minimal",
      features: ["Split layout", "Info card", "Clean typography"],
    },
    {
      id: "bold-luxury",
      name: "Bold Luxury",
      description: "Magazine style design with overlay and dramatic styling. Ideal for luxury listings.",
      category: "Real Estate",
      features: ["Magazine style", "Overlay effects", "Bold typography"],
    },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0 gap-0 bg-[#1f1f1f] border-zinc-700">
        <DialogHeader className="p-4 pb-3 border-b border-zinc-700">
          <DialogTitle className="flex items-center gap-2 text-white">
            <LayoutTemplate className="w-5 h-5 text-blue-500" />
            Choose a Template
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b border-zinc-700 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                size="sm"
                className={
                  selectedCategory === category
                    ? "rounded-full whitespace-nowrap bg-blue-600 hover:bg-blue-700"
                    : "rounded-full whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedTemplate === template.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-zinc-400 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature) => (
                        <span key={feature} className="px-2 py-1 rounded text-xs bg-zinc-700 text-zinc-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ml-3">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <LayoutTemplate className="w-6 h-6 text-zinc-500" />
              </div>
              <p className="text-sm font-medium text-white mb-1">No templates found</p>
              <p className="text-xs text-zinc-500">Try adjusting your search or filters</p>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-zinc-700 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-zinc-700">
            Cancel
          </Button>
          <Button
            onClick={handleApplyTemplate}
            disabled={!selectedTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            Apply Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
