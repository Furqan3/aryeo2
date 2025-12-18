"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { NumericInput } from "@/components/ui/numeric-input"
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Palette,
  Move,
  RotateCw,
  Layers,
  Crop,
  Minus,
} from "lucide-react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { ImageCropper } from "@/components/ui/image-cropper"

// Debounce utility for slider updates
function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])
}

interface PropertiesPanelProps {
  activeObject: any
  onUpdate: (property: string, value: any) => void
  onDelete: () => void
  onReplaceImage?: (newImageUrl: string) => void
}

// Color presets
const colorPresets = [
  "#000000",
  "#FFFFFF",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
  "#D4AF37",
]

// Gradient presets
const gradientPresets = [
  { name: "Black to White", colors: ["#000000", "#FFFFFF"] },
  { name: "Blue Sky", colors: ["#0ea5e9", "#38bdf8", "#7dd3fc"] },
  { name: "Sunset", colors: ["#fb923c", "#f97316", "#ea580c"] },
  { name: "Ocean", colors: ["#0284c7", "#06b6d4", "#22d3ee"] },
  { name: "Forest", colors: ["#065f46", "#059669", "#10b981"] },
  { name: "Purple Dream", colors: ["#7c3aed", "#a78bfa", "#c4b5fd"] },
  { name: "Gold", colors: ["#d97706", "#f59e0b", "#fbbf24"] },
  { name: "Pink Sunset", colors: ["#db2777", "#ec4899", "#f472b6"] },
]

// Anchor point options
const anchorPoints = [
  { value: "left top", label: "Top Left" },
  { value: "center top", label: "Top Center" },
  { value: "right top", label: "Top Right" },
  { value: "left center", label: "Center Left" },
  { value: "center center", label: "Center" },
  { value: "right center", label: "Center Right" },
  { value: "left bottom", label: "Bottom Left" },
  { value: "center bottom", label: "Bottom Center" },
  { value: "right bottom", label: "Bottom Right" },
]

export function PropertiesPanel({ activeObject, onUpdate, onDelete, onReplaceImage }: PropertiesPanelProps) {
  const [isCropping, setIsCropping] = useState(false)
  const [useGradient, setUseGradient] = useState(false)
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear")
  const [gradientAngle, setGradientAngle] = useState(0)

  // Local state for slider values (for immediate visual feedback)
  const [localOpacity, setLocalOpacity] = useState((activeObject?.opacity || 1) * 100)
  const [localFontSize, setLocalFontSize] = useState(activeObject?.fontSize || 48)
  const [localStrokeWidth, setLocalStrokeWidth] = useState(activeObject?.strokeWidth || 0)
  const [localAngle, setLocalAngle] = useState(activeObject?.angle || 0)
  const [localScale, setLocalScale] = useState((activeObject?.scaleX || 1) * 100)
  const [localShadowBlur, setLocalShadowBlur] = useState(activeObject?.shadow?.blur || 0)

  // Update local state when activeObject changes
  useEffect(() => {
    if (activeObject) {
      setLocalOpacity((activeObject.opacity || 1) * 100)
      setLocalFontSize(activeObject.fontSize || 48)
      setLocalStrokeWidth(activeObject.strokeWidth || 0)
      setLocalAngle(activeObject.angle || 0)
      setLocalScale((activeObject.scaleX || 1) * 100)
      setLocalShadowBlur(activeObject.shadow?.blur || 0)
    }
  }, [activeObject])

  // Debounced update functions
  const debouncedUpdate = useDebounce(onUpdate, 50)

  // Memoize object type checks
  const objectTypes = useMemo(() => {
    if (!activeObject) return { isText: false, isImage: false, isShape: false }
    return {
      isText: activeObject.type === "textbox" || activeObject.type === "text",
      isImage: activeObject.type === "image",
      isShape: activeObject.type === "rect" || activeObject.type === "circle" || activeObject.type === "triangle",
    }
  }, [activeObject])

  const { isText, isImage, isShape } = objectTypes

  const currentAnchor = useMemo(() => {
    if (!activeObject) return "left top"
    return `${activeObject.originX || "left"} ${activeObject.originY || "top"}`
  }, [activeObject])

  const handleCropComplete = (croppedImageUrl: string) => {
    if (onReplaceImage) {
      onReplaceImage(croppedImageUrl)
    }
    setIsCropping(false)
  }

  const setAnchorPoint = useCallback(
    (value: string) => {
      const [originX, originY] = value.split(" ")
      onUpdate("originX", originX)
      onUpdate("originY", originY)
    },
    [onUpdate],
  )

  if (!activeObject) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">Select an element to edit its properties</p>
      </Card>
    )
  }

  const ColorPicker = ({
    value,
    onChange,
    label,
    allowGradient = false,
  }: {
    value: string
    onChange: (color: string) => void
    label: string
    allowGradient?: boolean
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        {allowGradient && (
          <Button
            variant={useGradient ? "default" : "outline"}
            size="sm"
            onClick={() => setUseGradient(!useGradient)}
            className="h-6 text-xs px-2"
          >
            {useGradient ? "Solid" : "Gradient"}
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-14 p-1 cursor-pointer"
        />
        <Input
          type="text"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 flex-1 text-xs font-mono"
          placeholder="#000000"
        />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {colorPresets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className="w-7 h-7 rounded border-2 border-border hover:border-primary transition-colors"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )

  return (
    <>
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h3 className="font-semibold">Properties</h3>
            <p className="text-xs text-muted-foreground capitalize mt-0.5 flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              {isText ? "Text Layer" : isImage ? "Image Layer" : isShape ? `${activeObject.type} Shape` : "Object"}
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={onDelete} className="gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>

        <Separator />

        <Accordion type="multiple" defaultValue={["position", "transform"]} className="w-full">
          {/* Position & Size */}
          <AccordionItem value="position">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Position & Size</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">X Position</Label>
                    <NumericInput
                      value={Math.round(activeObject.left || 0)}
                      onChange={(value) => onUpdate("left", value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Y Position</Label>
                    <NumericInput
                      value={Math.round(activeObject.top || 0)}
                      onChange={(value) => onUpdate("top", value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground">Opacity</Label>
                    <div className="flex items-center gap-1">
                      <NumericInput
                        value={Math.round(localOpacity)}
                        onChange={(value) => {
                          setLocalOpacity(value)
                          onUpdate("opacity", value / 100)
                        }}
                        min={0}
                        max={100}
                        className="h-7 w-16 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[localOpacity]}
                    onValueChange={([v]) => {
                      setLocalOpacity(v)
                      debouncedUpdate("opacity", v / 100)
                    }}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Text Properties */}
          {isText && (
            <AccordionItem value="text">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Text Style</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Text Content</Label>
                    <Input
                      value={activeObject.text || ""}
                      onChange={(e) => onUpdate("text", e.target.value)}
                      placeholder="Enter text..."
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Font Family</Label>
                    <Select
                      value={activeObject.fontFamily || "Arial"}
                      onValueChange={(v) => onUpdate("fontFamily", v)}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">Font Size</Label>
                      <div className="flex items-center gap-1">
                        <NumericInput
                          value={localFontSize}
                          onChange={(value) => {
                            setLocalFontSize(value)
                            onUpdate("fontSize", value)
                          }}
                          min={8}
                          max={200}
                          className="h-7 w-16 text-xs"
                        />
                        <span className="text-xs text-muted-foreground">px</span>
                      </div>
                    </div>
                    <Slider
                      value={[localFontSize]}
                      onValueChange={([v]) => {
                        setLocalFontSize(v)
                        debouncedUpdate("fontSize", v)
                      }}
                      min={8}
                      max={200}
                      step={1}
                    />
                  </div>

                  <ColorPicker
                    value={activeObject.fill || "#000000"}
                    onChange={(color) => onUpdate("fill", color)}
                    label="Text Color"
                  />

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Text Style</Label>
                    <div className="flex gap-1">
                      <Button
                        variant={
                          activeObject.fontWeight === "bold" || activeObject.fontWeight === 700
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        className="h-9 w-9"
                        onClick={() =>
                          onUpdate(
                            "fontWeight",
                            activeObject.fontWeight === "bold" || activeObject.fontWeight === 700 ? "normal" : "bold",
                          )
                        }
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={activeObject.fontStyle === "italic" ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() =>
                          onUpdate("fontStyle", activeObject.fontStyle === "italic" ? "normal" : "italic")
                        }
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <div className="w-px bg-border mx-1" />
                      <Button
                        variant={activeObject.textAlign === "left" ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onUpdate("textAlign", "left")}
                      >
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={activeObject.textAlign === "center" ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onUpdate("textAlign", "center")}
                      >
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={activeObject.textAlign === "right" ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onUpdate("textAlign", "right")}
                      >
                        <AlignRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Shape Properties */}
          {isShape && (
            <AccordionItem value="shape">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Shape Style</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <ColorPicker
                    value={typeof activeObject.fill === "string" ? activeObject.fill : "#000000"}
                    onChange={(color) => onUpdate("fill", color)}
                    label="Fill Color"
                    allowGradient={true}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Stroke Controls */}
          {(isShape || isText || isImage) && (
            <AccordionItem value="stroke">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Stroke</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <ColorPicker
                    value={activeObject.stroke || "#000000"}
                    onChange={(color) => onUpdate("stroke", color)}
                    label="Stroke Color"
                  />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">Stroke Width</Label>
                      <div className="flex items-center gap-1">
                        <NumericInput
                          value={activeObject.strokeWidth || 0}
                          onChange={(value) => onUpdate("strokeWidth", value)}
                          min={0}
                          max={20}
                          className="h-7 w-16 text-xs"
                        />
                        <span className="text-xs text-muted-foreground">px</span>
                      </div>
                    </div>
                    <Slider
                      value={[activeObject.strokeWidth || 0]}
                      onValueCommit={([v]) => onUpdate("strokeWidth", v)}
                      min={0}
                      max={20}
                      step={1}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Transform */}
          <AccordionItem value="transform">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Transform</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground">Rotation</Label>
                    <div className="flex items-center gap-1">
                      <NumericInput
                        value={Math.round(activeObject.angle || 0)}
                        onChange={(value) => onUpdate("angle", value)}
                        min={-180}
                        max={180}
                        className="h-7 w-16 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">°</span>
                    </div>
                  </div>
                  <Slider
                    value={[activeObject.angle || 0]}
                    onValueCommit={([v]) => onUpdate("angle", v)}
                    min={-180}
                    max={180}
                    step={1}
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Transform Origin</Label>
                  <Select value={currentAnchor} onValueChange={setAnchorPoint}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {anchorPoints.map((point) => (
                        <SelectItem key={point.value} value={point.value}>
                          {point.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground">Scale</Label>
                    <div className="flex items-center gap-1">
                      <NumericInput
                        value={Math.round((activeObject.scaleX || 1) * 100)}
                        onChange={(value) => {
                          const scale = value / 100
                          onUpdate("scaleX", scale)
                          onUpdate("scaleY", scale)
                        }}
                        min={10}
                        max={300}
                        className="h-7 w-16 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[(activeObject.scaleX || 1) * 100]}
                    onValueCommit={([v]) => {
                      const scale = v / 100
                      onUpdate("scaleX", scale)
                      onUpdate("scaleY", scale)
                    }}
                    min={10}
                    max={300}
                    step={1}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Image Crop Controls */}
          {isImage && (
            <AccordionItem value="crop">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <Crop className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Crop</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsCropping(true)}
                    className="w-full gap-2"
                  >
                    <Crop className="w-4 h-4" />
                    Crop Image
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Shadow */}
          <AccordionItem value="shadow">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Shadow</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <ColorPicker
                  value={activeObject.shadow?.color || "#000000"}
                  onChange={(color) => {
                    const shadow = activeObject.shadow || {}
                    onUpdate("shadow", {
                      ...shadow,
                      color,
                      blur: shadow.blur || 10,
                      offsetX: shadow.offsetX || 5,
                      offsetY: shadow.offsetY || 5,
                    })
                  }}
                  label="Shadow Color"
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground">Blur</Label>
                    <div className="flex items-center gap-1">
                      <NumericInput
                        value={activeObject.shadow?.blur || 0}
                        onChange={(v) => {
                          const shadow = activeObject.shadow || {}
                          onUpdate("shadow", {
                            ...shadow,
                            blur: v,
                            color: shadow.color || "#000000",
                            offsetX: shadow.offsetX || 5,
                            offsetY: shadow.offsetY || 5,
                          })
                        }}
                        min={0}
                        max={50}
                        className="h-7 w-16 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[activeObject.shadow?.blur || 0]}
                    onValueCommit={([v]) => {
                      const shadow = activeObject.shadow || {}
                      onUpdate("shadow", {
                        ...shadow,
                        blur: v,
                        color: shadow.color || "#000000",
                        offsetX: shadow.offsetX || 5,
                        offsetY: shadow.offsetY || 5,
                      })
                    }}
                    min={0}
                    max={50}
                    step={1}
                  />
                </div>

                <Button variant="outline" size="sm" onClick={() => onUpdate("shadow", null)} className="w-full">
                  Remove Shadow
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      {isCropping && activeObject?._element?.src && (
        <ImageCropper
          imageUrl={activeObject._element.src}
          onCropComplete={handleCropComplete}
          onCancel={() => setIsCropping(false)}
          aspectRatio={activeObject.width / activeObject.height}
        />
      )}
    </>
  )
}