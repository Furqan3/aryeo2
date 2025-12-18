"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Move,
  Layers,
  Minus,
  Copy,
  Square,
  Type,
  ImageIcon,
  Filter,
  Sun,
  Plus,
  X,
  Droplet,
  Crop,
  Blend,
  Grid3X3,
} from "lucide-react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { ImageCropper } from "@/components/ui/image-cropper"

interface PropertiesPanelProps {
  activeObject: any
  onUpdate: (property: string, value: any) => void
  onDelete: () => void
  onDuplicate?: () => void
  onReplaceImage?: (newImageUrl: string) => void
  onBringToFront?: () => void
  onSendToBack?: () => void
  onBringForward?: () => void
  onSendBackward?: () => void
}

// Color presets
const colorPresets = [
  "#000000",
  "#FFFFFF",
  "#6B7280",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F43F5E",
  "#84CC16",
  "#06B6D4",
  "#A855F7",
  "#F59E0B",
  "#10B981",
  "#6366F1",
]

// Gradient presets
const gradientPresets = [
  { name: "Sunset", colors: ["#FF6B6B", "#FFD93D"], angle: 45 },
  { name: "Ocean", colors: ["#0284C7", "#22D3EE"], angle: 135 },
  { name: "Purple", colors: ["#7C3AED", "#C4B5FD"], angle: 90 },
  { name: "Fire", colors: ["#FF0844", "#FFD93D"], angle: 180 },
  { name: "Forest", colors: ["#065F46", "#10B981"], angle: 0 },
  { name: "Night", colors: ["#0F172A", "#334155"], angle: 45 },
  { name: "Cherry", colors: ["#FDA4AF", "#F0ABFC"], angle: 90 },
  { name: "Gold", colors: ["#D97706", "#FBBF24"], angle: 135 },
]

// Font families
const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Courier New",
  "Comic Sans MS",
  "Impact",
  "Trebuchet MS",
  "Palatino",
]

// Font weights
const fontWeights = [
  { value: "100", label: "Thin" },
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "900", label: "Black" },
]

// Blend modes - Added proper labels for display
const blendModes = [
  { value: "source-over", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "darken", label: "Darken" },
  { value: "lighten", label: "Lighten" },
  { value: "color-dodge", label: "Color Dodge" },
  { value: "color-burn", label: "Color Burn" },
  { value: "hard-light", label: "Hard Light" },
  { value: "soft-light", label: "Soft Light" },
  { value: "difference", label: "Difference" },
  { value: "exclusion", label: "Exclusion" },
]

export function PropertiesPanel({ activeObject, onUpdate, onDuplicate, onReplaceImage }: PropertiesPanelProps) {
  const [isCropping, setIsCropping] = useState(false)
  const [cropAspectRatio, setCropAspectRatio] = useState<number | undefined>(undefined)

  // Position & Size state
  const [posX, setPosX] = useState("")
  const [posY, setPosY] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [opacity, setOpacity] = useState(100)

  // Fill state
  const [fillMode, setFillMode] = useState<"solid" | "gradient">("solid")
  const [fillColor, setFillColor] = useState("#000000")
  const [fillGradientType, setFillGradientType] = useState<"linear" | "radial">("linear")
  const [fillGradientAngle, setFillGradientAngle] = useState(90)
  const [fillGradientColors, setFillGradientColors] = useState(["#000000", "#FFFFFF"])

  // Stroke state
  const [strokeEnabled, setStrokeEnabled] = useState(false)
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [strokeMode, setStrokeMode] = useState<"solid" | "gradient">("solid")
  const [strokeColor, setStrokeColor] = useState("#000000")
  const [strokeGradientType, setStrokeGradientType] = useState<"linear" | "radial">("linear")
  const [strokeGradientAngle, setStrokeGradientAngle] = useState(90)
  const [strokeGradientColors, setStrokeGradientColors] = useState(["#000000", "#FFFFFF"])

  // Shadow state
  const [shadowEnabled, setShadowEnabled] = useState(false)
  const [shadowColor, setShadowColor] = useState("#000000")
  const [shadowBlur, setShadowBlur] = useState(10)
  const [shadowOffsetX, setShadowOffsetX] = useState(5)
  const [shadowOffsetY, setShadowOffsetY] = useState(5)

  // Text state
  const [fontSize, setFontSize] = useState(48)
  const [lineHeight, setLineHeight] = useState(1.16)
  const [charSpacing, setCharSpacing] = useState(0)

  // Filter state
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(0)

  // Blend mode state
  const [blendMode, setBlendMode] = useState("source-over")

  // Sync state with activeObject
  useEffect(() => {
    if (activeObject) {
      setPosX(String(Math.round(activeObject.left || 0)))
      setPosY(String(Math.round(activeObject.top || 0)))
      setWidth(String(Math.round((activeObject.width || 0) * (activeObject.scaleX || 1))))
      setHeight(String(Math.round((activeObject.height || 0) * (activeObject.scaleY || 1))))
      setOpacity((activeObject.opacity || 1) * 100)

      // Fill
      if (typeof activeObject.fill === "string") {
        setFillColor(activeObject.fill || "#000000")
        setFillMode("solid")
      } else if (activeObject.fill?.colorStops) {
        setFillMode("gradient")
        const colors = activeObject.fill.colorStops.map((s: any) => s.color)
        if (colors.length >= 2) setFillGradientColors(colors)
      }

      // Stroke
      const sw = activeObject.strokeWidth || 0
      setStrokeEnabled(sw > 0)
      setStrokeWidth(sw > 0 ? sw : 2)
      if (typeof activeObject.stroke === "string") {
        setStrokeColor(activeObject.stroke || "#000000")
        setStrokeMode("solid")
      }

      // Shadow
      if (activeObject.shadow) {
        setShadowEnabled(true)
        setShadowColor(activeObject.shadow.color || "#000000")
        setShadowBlur(activeObject.shadow.blur || 10)
        setShadowOffsetX(activeObject.shadow.offsetX || 5)
        setShadowOffsetY(activeObject.shadow.offsetY || 5)
      } else {
        setShadowEnabled(false)
      }

      // Text
      if (activeObject.fontSize) setFontSize(activeObject.fontSize)
      if (activeObject.lineHeight) setLineHeight(activeObject.lineHeight)
      if (activeObject.charSpacing !== undefined) setCharSpacing(activeObject.charSpacing)

      // Blend mode
      setBlendMode(activeObject.globalCompositeOperation || "source-over")
    }
  }, [activeObject])

  // Object type checks
  const objectTypes = useMemo(() => {
    if (!activeObject) return { isText: false, isImage: false, isShape: false }
    return {
      isText: activeObject.type === "textbox" || activeObject.type === "text",
      isImage: activeObject.type === "image",
      isShape: activeObject.type === "rect" || activeObject.type === "circle" || activeObject.type === "triangle",
    }
  }, [activeObject])

  const { isText, isImage, isShape } = objectTypes

  // Apply fill gradient
  const applyFillGradient = useCallback(() => {
    if (!activeObject) return
    const fabricLib = (window as any).fabric
    if (!fabricLib) return

    const width = activeObject.width || 100
    const height = activeObject.height || 100

    let gradient
    if (fillGradientType === "linear") {
      const angleRad = (fillGradientAngle * Math.PI) / 180
      gradient = new fabricLib.Gradient({
        type: "linear",
        coords: {
          x1: 0,
          y1: 0,
          x2: Math.cos(angleRad) * width,
          y2: Math.sin(angleRad) * height,
        },
        colorStops: fillGradientColors.map((color, index) => ({
          offset: index / (fillGradientColors.length - 1),
          color,
        })),
      })
    } else {
      const radius = Math.max(width, height) / 2
      gradient = new fabricLib.Gradient({
        type: "radial",
        coords: {
          x1: width / 2,
          y1: height / 2,
          x2: width / 2,
          y2: height / 2,
          r1: 0,
          r2: radius,
        },
        colorStops: fillGradientColors.map((color, index) => ({
          offset: index / (fillGradientColors.length - 1),
          color,
        })),
      })
    }
    onUpdate("fill", gradient)
  }, [activeObject, fillGradientType, fillGradientAngle, fillGradientColors, onUpdate])

  // Apply stroke gradient
  const applyStrokeGradient = useCallback(() => {
    if (!activeObject) return
    const fabricLib = (window as any).fabric
    if (!fabricLib) return

    const width = activeObject.width || 100
    const height = activeObject.height || 100

    let gradient
    if (strokeGradientType === "linear") {
      const angleRad = (strokeGradientAngle * Math.PI) / 180
      gradient = new fabricLib.Gradient({
        type: "linear",
        coords: {
          x1: 0,
          y1: 0,
          x2: Math.cos(angleRad) * width,
          y2: Math.sin(angleRad) * height,
        },
        colorStops: strokeGradientColors.map((color, index) => ({
          offset: index / (strokeGradientColors.length - 1),
          color,
        })),
      })
    } else {
      const radius = Math.max(width, height) / 2
      gradient = new fabricLib.Gradient({
        type: "radial",
        coords: {
          x1: width / 2,
          y1: height / 2,
          x2: width / 2,
          y2: height / 2,
          r1: 0,
          r2: radius,
        },
        colorStops: strokeGradientColors.map((color, index) => ({
          offset: index / (strokeGradientColors.length - 1),
          color,
        })),
      })
    }
    onUpdate("stroke", gradient)
  }, [activeObject, strokeGradientType, strokeGradientAngle, strokeGradientColors, onUpdate])

  // Apply filters
  const applyFilters = useCallback(() => {
    if (!activeObject || !isImage) return
    const fabricLib = (window as any).fabric
    if (!fabricLib) return

    const filters: any[] = []
    if (brightness !== 0) {
      filters.push(new fabricLib.Image.filters.Brightness({ brightness: brightness / 100 }))
    }
    if (contrast !== 0) {
      filters.push(new fabricLib.Image.filters.Contrast({ contrast: contrast / 100 }))
    }
    if (saturation !== 0) {
      filters.push(new fabricLib.Image.filters.Saturation({ saturation: saturation / 100 }))
    }

    activeObject.filters = filters
    activeObject.applyFilters()
    activeObject.canvas?.renderAll()
  }, [activeObject, isImage, brightness, contrast, saturation])

  const handleCropComplete = useCallback(
    (croppedImageUrl: string) => {
      if (onReplaceImage) {
        onReplaceImage(croppedImageUrl)
      }
      setIsCropping(false)
      setCropAspectRatio(undefined)
    },
    [onReplaceImage],
  )

  const handleBlendModeChange = useCallback(
    (value: string) => {
      setBlendMode(value)
      onUpdate("globalCompositeOperation", value)
    },
    [onUpdate],
  )

  const currentBlendModeLabel = useMemo(() => {
    const mode = blendModes.find((m) => m.value === blendMode)
    return mode?.label || "Normal"
  }, [blendMode])

  if (!activeObject) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Layers className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">No Selection</h3>
            <p className="text-sm text-muted-foreground">Select an element to edit its properties</p>
          </div>
        </div>
      </Card>
    )
  }

  // Color Section Component
  const ColorSection = ({
    label,
    mode,
    setMode,
    solidColor,
    setSolidColor,
    gradientType,
    setGradientType,
    gradientAngle,
    setGradientAngle,
    gradientColors,
    setGradientColors,
    onApplyGradient,
    onApplySolid,
  }: {
    label: string
    mode: "solid" | "gradient"
    setMode: (m: "solid" | "gradient") => void
    solidColor: string
    setSolidColor: (c: string) => void
    gradientType: "linear" | "radial"
    setGradientType: (t: "linear" | "radial") => void
    gradientAngle: number
    setGradientAngle: (a: number) => void
    gradientColors: string[]
    setGradientColors: (c: string[]) => void
    onApplyGradient: () => void
    onApplySolid: (color: string) => void
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Tabs value={mode} onValueChange={(v) => setMode(v as "solid" | "gradient")}>
          <TabsList className="h-7 p-0.5">
            <TabsTrigger value="solid" className="h-6 px-2 text-xs">
              Solid
            </TabsTrigger>
            <TabsTrigger value="gradient" className="h-6 px-2 text-xs">
              Gradient
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {mode === "solid" ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="color"
              value={solidColor}
              onChange={(e) => {
                setSolidColor(e.target.value)
                onApplySolid(e.target.value)
              }}
              className="h-9 w-12 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={solidColor}
              onChange={(e) => {
                setSolidColor(e.target.value)
                onApplySolid(e.target.value)
              }}
              className="h-9 flex-1 text-xs font-mono"
            />
          </div>
          <div className="grid grid-cols-9 gap-1">
            {colorPresets.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSolidColor(color)
                  onApplySolid(color)
                }}
                className="aspect-square rounded border-2 hover:scale-110 transition-transform"
                style={{
                  backgroundColor: color,
                  borderColor: solidColor === color ? "hsl(var(--primary))" : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
          <div className="flex gap-2">
            <Select value={gradientType} onValueChange={(v: "linear" | "radial") => setGradientType(v)}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
            {gradientType === "linear" && (
              <div className="flex items-center gap-1 flex-1">
                <Input
                  type="number"
                  value={gradientAngle}
                  onChange={(e) => setGradientAngle(Number(e.target.value))}
                  className="h-8 text-xs"
                  min={0}
                  max={360}
                />
                <span className="text-xs text-muted-foreground">°</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Color Stops</Label>
            {gradientColors.map((color, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...gradientColors]
                    newColors[index] = e.target.value
                    setGradientColors(newColors)
                  }}
                  className="h-8 w-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...gradientColors]
                    newColors[index] = e.target.value
                    setGradientColors(newColors)
                  }}
                  className="h-8 flex-1 text-xs font-mono"
                />
                {gradientColors.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGradientColors(gradientColors.filter((_, i) => i !== index))}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
            {gradientColors.length < 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGradientColors([...gradientColors, "#888888"])}
                className="w-full h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Stop
              </Button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1">
            {gradientPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setGradientColors(preset.colors)
                  setGradientAngle(preset.angle)
                }}
                className="h-8 rounded border hover:border-primary transition-colors"
                style={{
                  background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})`,
                }}
                title={preset.name}
              />
            ))}
          </div>

          <Button onClick={onApplyGradient} className="w-full h-8 text-xs">
            Apply Gradient
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <ScrollArea className="h-[calc(100vh-2rem)]">
        <Card className="p-3 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Properties</h3>
              <Badge variant="secondary" className="text-xs">
                {isText ? (
                  <Type className="w-3 h-3 mr-1" />
                ) : isImage ? (
                  <ImageIcon className="w-3 h-3 mr-1" />
                ) : (
                  <Square className="w-3 h-3 mr-1" />
                )}
                {isText ? "Text" : isImage ? "Image" : activeObject.type}
              </Badge>
            </div>
            {onDuplicate && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicate}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>

          <Separator />

          <Accordion type="multiple" defaultValue={["position", "fill"]} className="w-full">
            {/* Position & Size */}
            <AccordionItem value="position" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-blue-500/10 flex items-center justify-center">
                    <Move className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Position & Size</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">X</Label>
                      <Input
                        type="number"
                        value={posX}
                        onChange={(e) => {
                          setPosX(e.target.value)
                          onUpdate("left", Number(e.target.value))
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Y</Label>
                      <Input
                        type="number"
                        value={posY}
                        onChange={(e) => {
                          setPosY(e.target.value)
                          onUpdate("top", Number(e.target.value))
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Width</Label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => {
                          setWidth(e.target.value)
                          const newScaleX = Number(e.target.value) / (activeObject.width || 1)
                          onUpdate("scaleX", newScaleX)
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Height</Label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => {
                          setHeight(e.target.value)
                          const newScaleY = Number(e.target.value) / (activeObject.height || 1)
                          onUpdate("scaleY", newScaleY)
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs text-muted-foreground">Opacity</Label>
                      <span className="text-xs">{Math.round(opacity)}%</span>
                    </div>
                    <Slider
                      value={[opacity]}
                      onValueChange={([v]) => {
                        setOpacity(v)
                        onUpdate("opacity", v / 100)
                      }}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Fill - for text and shapes */}
            {(isText || isShape) && (
              <AccordionItem value="fill" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-purple-500/10 flex items-center justify-center">
                      <Palette className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    <span className="text-sm font-medium">Fill</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-1">
                    <ColorSection
                      label="Fill Color"
                      mode={fillMode}
                      setMode={setFillMode}
                      solidColor={fillColor}
                      setSolidColor={setFillColor}
                      gradientType={fillGradientType}
                      setGradientType={setFillGradientType}
                      gradientAngle={fillGradientAngle}
                      setGradientAngle={setFillGradientAngle}
                      gradientColors={fillGradientColors}
                      setGradientColors={setFillGradientColors}
                      onApplyGradient={applyFillGradient}
                      onApplySolid={(color) => onUpdate("fill", color)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Stroke - for text and shapes */}
            {(isText || isShape) && (
              <AccordionItem value="stroke" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-orange-500/10 flex items-center justify-center">
                      <Minus className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                    <span className="text-sm font-medium">Stroke</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Enable Stroke</Label>
                      <Switch
                        checked={strokeEnabled}
                        onCheckedChange={(checked) => {
                          setStrokeEnabled(checked)
                          if (checked) {
                            onUpdate("strokeWidth", strokeWidth)
                            onUpdate("stroke", strokeColor)
                          } else {
                            onUpdate("strokeWidth", 0)
                            onUpdate("stroke", null)
                          }
                        }}
                      />
                    </div>

                    {strokeEnabled && (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs text-muted-foreground">Width</Label>
                            <span className="text-xs">{strokeWidth}px</span>
                          </div>
                          <Slider
                            value={[strokeWidth]}
                            onValueChange={([v]) => {
                              setStrokeWidth(v)
                              onUpdate("strokeWidth", v)
                            }}
                            min={1}
                            max={20}
                            step={1}
                          />
                        </div>

                        <ColorSection
                          label="Stroke Color"
                          mode={strokeMode}
                          setMode={setStrokeMode}
                          solidColor={strokeColor}
                          setSolidColor={setStrokeColor}
                          gradientType={strokeGradientType}
                          setGradientType={setStrokeGradientType}
                          gradientAngle={strokeGradientAngle}
                          setGradientAngle={setStrokeGradientAngle}
                          gradientColors={strokeGradientColors}
                          setGradientColors={setStrokeGradientColors}
                          onApplyGradient={applyStrokeGradient}
                          onApplySolid={(color) => onUpdate("stroke", color)}
                        />
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Text Properties */}
            {isText && (
              <AccordionItem value="text" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-green-500/10 flex items-center justify-center">
                      <Type className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <span className="text-sm font-medium">Typography</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Font</Label>
                        <Select
                          value={activeObject.fontFamily || "Arial"}
                          onValueChange={(v) => onUpdate("fontFamily", v)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontFamilies.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Weight</Label>
                        <Select
                          value={String(activeObject.fontWeight || "400")}
                          onValueChange={(v) => onUpdate("fontWeight", v)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontWeights.map((w) => (
                              <SelectItem key={w.value} value={w.value}>
                                {w.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">Font Size</Label>
                        <span className="text-xs">{fontSize}px</span>
                      </div>
                      <Slider
                        value={[fontSize]}
                        onValueChange={([v]) => {
                          setFontSize(v)
                          onUpdate("fontSize", v)
                        }}
                        min={8}
                        max={200}
                        step={1}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">Line Height</Label>
                        <span className="text-xs">{lineHeight.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[lineHeight]}
                        onValueChange={([v]) => {
                          setLineHeight(v)
                          onUpdate("lineHeight", v)
                        }}
                        min={0.5}
                        max={3}
                        step={0.1}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
                        <span className="text-xs">{charSpacing}</span>
                      </div>
                      <Slider
                        value={[charSpacing]}
                        onValueChange={([v]) => {
                          setCharSpacing(v)
                          onUpdate("charSpacing", v)
                        }}
                        min={-200}
                        max={800}
                        step={10}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Style</Label>
                      <div className="flex gap-1">
                        <Button
                          variant={
                            activeObject.fontWeight === "bold" || activeObject.fontWeight === 700
                              ? "default"
                              : "outline"
                          }
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onUpdate(
                              "fontWeight",
                              activeObject.fontWeight === "bold" || activeObject.fontWeight === 700 ? "normal" : "bold",
                            )
                          }
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant={activeObject.fontStyle === "italic" ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onUpdate("fontStyle", activeObject.fontStyle === "italic" ? "normal" : "italic")
                          }
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant={activeObject.underline ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdate("underline", !activeObject.underline)}
                        >
                          <Underline className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Alignment</Label>
                      <div className="flex gap-1">
                        <Button
                          variant={activeObject.textAlign === "left" ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdate("textAlign", "left")}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant={activeObject.textAlign === "center" ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdate("textAlign", "center")}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant={activeObject.textAlign === "right" ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdate("textAlign", "right")}
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant={activeObject.textAlign === "justify" ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdate("textAlign", "justify")}
                        >
                          <AlignJustify className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {isImage && (
              <AccordionItem value="crop" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-cyan-500/10 flex items-center justify-center">
                      <Crop className="w-3.5 h-3.5 text-cyan-500" />
                    </div>
                    <span className="text-sm font-medium">Crop & Resize</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-1">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setCropAspectRatio(undefined)
                        setIsCropping(true)
                      }}
                      className="w-full gap-2"
                    >
                      <Crop className="w-4 h-4" />
                      Crop Image
                    </Button>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Aspect Ratio Presets</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-xs bg-transparent"
                          onClick={() => {
                            setCropAspectRatio(1)
                            setIsCropping(true)
                          }}
                        >
                          <Grid3X3 className="w-3 h-3" />
                          1:1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-xs bg-transparent"
                          onClick={() => {
                            setCropAspectRatio(16 / 9)
                            setIsCropping(true)
                          }}
                        >
                          <Grid3X3 className="w-3 h-3" />
                          16:9
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-xs bg-transparent"
                          onClick={() => {
                            setCropAspectRatio(4 / 3)
                            setIsCropping(true)
                          }}
                        >
                          <Grid3X3 className="w-3 h-3" />
                          4:3
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-xs bg-transparent"
                          onClick={() => {
                            setCropAspectRatio(9 / 16)
                            setIsCropping(true)
                          }}
                        >
                          <Grid3X3 className="w-3 h-3" />
                          9:16
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Image Filters */}
            {isImage && (
              <AccordionItem value="filters" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-pink-500/10 flex items-center justify-center">
                      <Filter className="w-3.5 h-3.5 text-pink-500" />
                    </div>
                    <span className="text-sm font-medium">Filters</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Sun className="w-3 h-3" />
                          Brightness
                        </Label>
                        <span className="text-xs">{brightness}</span>
                      </div>
                      <Slider value={[brightness]} onValueChange={([v]) => setBrightness(v)} min={-100} max={100} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">Contrast</Label>
                        <span className="text-xs">{contrast}</span>
                      </div>
                      <Slider value={[contrast]} onValueChange={([v]) => setContrast(v)} min={-100} max={100} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Droplet className="w-3 h-3" />
                          Saturation
                        </Label>
                        <span className="text-xs">{saturation}</span>
                      </div>
                      <Slider value={[saturation]} onValueChange={([v]) => setSaturation(v)} min={-100} max={100} />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setBrightness(0)
                          setContrast(0)
                          setSaturation(0)
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="blend" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/10 flex items-center justify-center">
                    <Blend className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <span className="text-sm font-medium">Blend Mode</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-1">
                  <Label className="text-xs text-muted-foreground mb-2 block">Blend Mode</Label>
                  <Select value={blendMode} onValueChange={handleBlendModeChange}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue>{currentBlendModeLabel}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {blendModes.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Shadow */}
            <AccordionItem value="shadow" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-gray-500/10 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium">Shadow</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Enable Shadow</Label>
                    <Switch
                      checked={shadowEnabled}
                      onCheckedChange={(checked) => {
                        setShadowEnabled(checked)
                        if (checked) {
                          const fabricLib = (window as any).fabric
                          if (fabricLib) {
                            const shadow = new fabricLib.Shadow({
                              color: shadowColor,
                              blur: shadowBlur,
                              offsetX: shadowOffsetX,
                              offsetY: shadowOffsetY,
                            })
                            onUpdate("shadow", shadow)
                          }
                        } else {
                          onUpdate("shadow", null)
                        }
                      }}
                    />
                  </div>

                  {shadowEnabled && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={shadowColor}
                            onChange={(e) => {
                              setShadowColor(e.target.value)
                              const fabricLib = (window as any).fabric
                              if (fabricLib) {
                                const shadow = new fabricLib.Shadow({
                                  color: e.target.value,
                                  blur: shadowBlur,
                                  offsetX: shadowOffsetX,
                                  offsetY: shadowOffsetY,
                                })
                                onUpdate("shadow", shadow)
                              }
                            }}
                            className="h-8 w-12 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={shadowColor}
                            onChange={(e) => setShadowColor(e.target.value)}
                            className="h-8 flex-1 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label className="text-xs text-muted-foreground">Blur</Label>
                          <span className="text-xs">{shadowBlur}px</span>
                        </div>
                        <Slider
                          value={[shadowBlur]}
                          onValueChange={([v]) => {
                            setShadowBlur(v)
                            const fabricLib = (window as any).fabric
                            if (fabricLib) {
                              const shadow = new fabricLib.Shadow({
                                color: shadowColor,
                                blur: v,
                                offsetX: shadowOffsetX,
                                offsetY: shadowOffsetY,
                              })
                              onUpdate("shadow", shadow)
                            }
                          }}
                          min={0}
                          max={50}
                          step={1}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Offset X</Label>
                          <Input
                            type="number"
                            value={shadowOffsetX}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              setShadowOffsetX(val)
                              const fabricLib = (window as any).fabric
                              if (fabricLib) {
                                const shadow = new fabricLib.Shadow({
                                  color: shadowColor,
                                  blur: shadowBlur,
                                  offsetX: val,
                                  offsetY: shadowOffsetY,
                                })
                                onUpdate("shadow", shadow)
                              }
                            }}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Offset Y</Label>
                          <Input
                            type="number"
                            value={shadowOffsetY}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              setShadowOffsetY(val)
                              const fabricLib = (window as any).fabric
                              if (fabricLib) {
                                const shadow = new fabricLib.Shadow({
                                  color: shadowColor,
                                  blur: shadowBlur,
                                  offsetX: shadowOffsetX,
                                  offsetY: val,
                                })
                                onUpdate("shadow", shadow)
                              }
                            }}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </ScrollArea>

      {isCropping && isImage && activeObject.getSrc && (
        <ImageCropper
          imageUrl={activeObject.getSrc()}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setIsCropping(false)
            setCropAspectRatio(undefined)
          }}
          aspectRatio={cropAspectRatio}
        />
      )}
    </>
  )
}
