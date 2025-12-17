"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Trash2,
  Palette,
  Move,
  RotateCw,
  Layers,
  Crop,
  Type,
  Underline,
  Strikethrough,
  Image as ImageIcon,
  BringToFront,
  SendToBack,
  ArrowUpFromLine,
  ArrowDownToLine,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  FlipHorizontal,
  FlipVertical,
  Activity,
  Grid3X3,
  Scaling,
  X,
  Check,
} from "lucide-react"
import { useState, useCallback, useMemo, useRef, useEffect, forwardRef, ChangeEvent } from "react"

// --- Helper Components (Implemented locally to resolve import errors) ---

// 1. NumericInput Component
interface NumericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onChange, min = -Infinity, max = Infinity, step = 1, className, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(String(value))

    useEffect(() => {
      setInputValue(String(value))
    }, [value])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      setInputValue(rawValue)
    }

    const handleBlur = () => {
      let numValue = parseFloat(inputValue)

      if (isNaN(numValue)) {
        numValue = value 
      }
      
      numValue = Math.max(min, Math.min(max, numValue))
      
      if (numValue !== value) {
        onChange(numValue)
      }
      setInputValue(String(numValue))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur()
      }
    }

    return (
      <Input
        ref={ref}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`h-8 text-xs font-mono text-center ${className}`}
        {...props}
      />
    )
  }
)
NumericInput.displayName = 'NumericInput'


// 2. ImageCropper Component (Mock implementation for UI structure)
interface ImageCropperProps {
  imageUrl: string
  onCropComplete: (croppedImageUrl: string) => void
  onCancel: () => void
  aspectRatio: number
}

const ImageCropper = ({ imageUrl, onCropComplete, onCancel }: ImageCropperProps) => {
  const [mockCropState, setMockCropState] = useState(true)

  // In a real application, this would use a library like react-image-crop
  // We'll mock the output for demonstration.
  const handleMockCrop = () => {
    // In a real app, this would be the actual cropped base64/URL
    const mockCroppedUrl = imageUrl 
    onCropComplete(mockCroppedUrl)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full p-6 space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Crop Image</h3>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
          <img src={imageUrl} alt="Image to crop" className="max-h-full max-w-full object-contain" />
        </div>
        <p className="text-sm text-center text-muted-foreground">
          {/* Mock display */}
          <span className="font-medium text-red-500">
            [Cropping library is mocked. In a full app, this area would contain the interactive cropper UI.]
          </span>
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" /> Cancel</Button>
          <Button onClick={handleMockCrop} disabled={!mockCropState}><Check className="w-4 h-4 mr-2" /> Apply Crop</Button>
        </div>
      </div>
    </div>
  )
}

// --- Utilities ---

function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  useEffect(() => () => timeoutRef.current && clearTimeout(timeoutRef.current), [])
  return useCallback((...args: any[]) => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }, [callback, delay])
}

// --- Constants ---

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

const colorPresets = ["#000000", "#FFFFFF", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280", "#D4AF37"]

const gradientPresets = [
  { name: "Black White", colors: ["#000000", "#FFFFFF"] },
  { name: "Sunset", colors: ["#fb923c", "#f97316", "#ea580c"] },
  { name: "Ocean", colors: ["#0284c7", "#06b6d4", "#22d3ee"] },
  { name: "Forest", colors: ["#065f46", "#059669", "#10b981"] },
  { name: "Purple", colors: ["#7c3aed", "#a78bfa", "#c4b5fd"] },
  { name: "Gold", colors: ["#d97706", "#f59e0b", "#fbbf24"] },
]

const fontFamilies = [
  "Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana", "Impact", "Comic Sans MS", "Trebuchet MS", "Arial Black"
]

// --- Interfaces ---

interface PropertiesPanelProps {
  activeObject: any
  onUpdate: (property: string, value: any) => void
  onAction?: (action: string, value?: any) => void
  onDelete: () => void
  onReplaceImage?: (newImageUrl: string) => void
}

// --- Components ---

export function PropertiesPanel({ activeObject, onUpdate, onAction, onDelete, onReplaceImage }: PropertiesPanelProps) {
  const [isCropping, setIsCropping] = useState(false)
  
  // Appearance State
  const [useGradient, setUseGradient] = useState(false)
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear")
  const [gradientAngle, setGradientAngle] = useState(0)

  // Transform Local State
  const [localOpacity, setLocalOpacity] = useState(100)
  const [localAngle, setLocalAngle] = useState(0)
  const [localScaleX, setLocalScaleX] = useState(100)
  const [localScaleY, setLocalScaleY] = useState(100)
  const [localSkewX, setLocalSkewX] = useState(0)
  const [localSkewY, setLocalSkewY] = useState(0)
  const [localCornerRadius, setLocalCornerRadius] = useState(0)

  // Style Local State
  const [localStrokeWidth, setLocalStrokeWidth] = useState(0)
  
  // Text Local State
  const [localFontSize, setLocalFontSize] = useState(48)
  const [localLineHeight, setLocalLineHeight] = useState(1.2)
  const [localCharSpacing, setLocalCharSpacing] = useState(0)

  // Shadow Local State
  const [localShadowBlur, setLocalShadowBlur] = useState(0)
  const [localShadowOffsetX, setLocalShadowOffsetX] = useState(5)
  const [localShadowOffsetY, setLocalShadowOffsetY] = useState(5)

  // Effect Local State (Image) - Representing filter values
  // In a real application, you'd initialize these from activeObject.filters
  const [localBrightness, setLocalBrightness] = useState(0)
  const [localContrast, setLocalContrast] = useState(0)
  const [localSaturation, setLocalSaturation] = useState(0)
  const [localBlur, setLocalBlur] = useState(0)
  const [localNoise, setLocalNoise] = useState(0)

  // Sync state with activeObject
  useEffect(() => {
    if (activeObject) {
      setLocalOpacity(Math.round((activeObject.opacity ?? 1) * 100))
      setLocalAngle(Math.round(activeObject.angle || 0))
      setLocalScaleX(Math.round((activeObject.scaleX || 1) * 100))
      setLocalScaleY(Math.round((activeObject.scaleY || 1) * 100))
      setLocalSkewX(Math.round(activeObject.skewX || 0))
      setLocalSkewY(Math.round(activeObject.skewY || 0))
      setLocalCornerRadius(activeObject.rx || 0)
      
      setLocalStrokeWidth(activeObject.strokeWidth || 0)
      
      setLocalFontSize(activeObject.fontSize || 48)
      setLocalLineHeight(activeObject.lineHeight || 1.16)
      setLocalCharSpacing(activeObject.charSpacing || 0)

      setLocalShadowBlur(activeObject.shadow?.blur || 0)
      setLocalShadowOffsetX(activeObject.shadow?.offsetX || 5)
      setLocalShadowOffsetY(activeObject.shadow?.offsetY || 5)
      
      // MOCK: Reset image filter UI state for simplicity
      setLocalBrightness(0)
      setLocalContrast(0)
      setLocalSaturation(0)
      setLocalBlur(0)
      setLocalNoise(0)
    }
  }, [activeObject])

  const debouncedUpdate = useDebounce(onUpdate, 50)

  const { isText, isImage, isShape, isRect, objectType } = useMemo(() => {
    if (!activeObject) return { isText: false, isImage: false, isShape: false, isRect: false, objectType: 'Element' }
    const type = activeObject.type
    return {
      isText: ["textbox", "text", "i-text"].includes(type),
      isImage: type === "image",
      isShape: ["rect", "circle", "triangle", "polygon", "path"].includes(type),
      isRect: type === "rect",
      objectType: type.charAt(0).toUpperCase() + type.slice(1)
    }
  }, [activeObject])

  // Helpers
  const handleAction = (action: string, value?: any) => {
    if (onAction) onAction(action, value)
  }

  const updateShadow = () => {
    const hasShadow = localShadowBlur > 0 || localShadowOffsetX !== 0 || localShadowOffsetY !== 0
    const shadow = hasShadow
      ? {
          color: activeObject.shadow?.color || "#000000",
          blur: localShadowBlur,
          offsetX: localShadowOffsetX,
          offsetY: localShadowOffsetY,
        }
      : null
    onUpdate("shadow", shadow)
  }
  
  // NOTE: For filters, we pass a composite key like 'filter-brightness' to the parent
  // The parent (Canvas manager) is responsible for applying the filter logic (e.g., Fabric.js filter array).
  const updateImageFilter = (key: string, value: number) => {
    // Value is normalized to 0-100 or -100 to 100. Parent determines actual filter coefficient.
    debouncedUpdate(`filter-${key}`, value)
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    onReplaceImage?.(croppedImageUrl)
    setIsCropping(false)
  }

  // --- Render Sub-Components ---

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
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        {allowGradient && (
          <div className="flex rounded-md border border-border/50 bg-secondary/20 p-0.5">
            <button
              onClick={() => setUseGradient(false)}
              className={`text-[10px] px-2 py-0.5 rounded-sm transition-all ${!useGradient ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Solid
            </button>
            <button
              onClick={() => setUseGradient(true)}
              className={`text-[10px] px-2 py-0.5 rounded-sm transition-all ${useGradient ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Gradient
            </button>
          </div>
        )}
      </div>

      {useGradient && allowGradient ? (
        <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-border/50">
          <Select value={gradientType} onValueChange={(v: any) => setGradientType(v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear Gradient</SelectItem>
              <SelectItem value="radial">Radial Gradient</SelectItem>
            </SelectContent>
          </Select>

          {gradientType === "linear" && (
            <div className="space-y-1">
              <div className="flex justify-between">
                 <Label className="text-[10px] text-muted-foreground">Angle</Label>
                 <span className="text-[10px] text-muted-foreground">{gradientAngle}°</span>
              </div>
              <Slider
                value={[gradientAngle]}
                onValueChange={([v]) => setGradientAngle(v)}
                min={0}
                max={360}
                step={1}
                className="py-1"
              />
            </div>
          )}

          <div className="grid grid-cols-6 gap-1.5">
            {gradientPresets.map((grad) => (
              <button
                key={grad.name}
                onClick={() => onChange(`linear-gradient(${gradientAngle}deg, ${grad.colors.join(", ")})`)}
                className="aspect-square rounded-md border border-border/50 hover:scale-110 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${grad.colors.join(", ")})`,
                }}
                title={grad.name}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
           <div className="flex gap-2">
            <div className="relative">
              <Input
                type="color"
                value={value || "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 p-0 border-0 rounded-md overflow-hidden cursor-pointer"
              />
            </div>
            <Input
              type="text"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 flex-1 text-xs font-mono uppercase"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {colorPresets.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className="w-5 h-5 rounded-full border border-border/50 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )

  if (!activeObject) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-4">
        <div className="p-4 rounded-full bg-secondary/50">
           <Scaling className="w-8 h-8 opacity-50" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">No Selection</p>
          <p className="text-sm">Click on an element to edit properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background border-l border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          {isText ? <Type className="w-4 h-4 text-primary" /> : 
           isImage ? <ImageIcon className="w-4 h-4 text-primary" /> : 
           <Grid3X3 className="w-4 h-4 text-primary" />}
          <span className="font-semibold text-sm">{objectType}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-6">
          
          {/* Quick Actions */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Arrange</Label>
            <div className="flex gap-2">
              <div className="flex rounded-md border border-border/50 bg-secondary/20 p-1 flex-1 justify-between">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm" onClick={() => handleAction("bringToFront")} title="Bring to Front">
                  <BringToFront className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm" onClick={() => handleAction("bringForward")} title="Bring Forward">
                  <ArrowUpFromLine className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm" onClick={() => handleAction("sendBackward")} title="Send Backward">
                  <ArrowDownToLine className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm" onClick={() => handleAction("sendToBack")} title="Send to Back">
                  <SendToBack className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex rounded-md border border-border/50 bg-secondary/20 p-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm" onClick={() => handleAction("centerH")} title="Center Horizontally">
                  <AlignHorizontalSpaceAround className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm" onClick={() => handleAction("centerV")} title="Center Vertically">
                  <AlignVerticalSpaceAround className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["transform", "appearance"]} className="w-full space-y-4">
            
            {/* Transform */}
            <AccordionItem value="transform" className="border-border/50">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Move className="w-4 h-4 text-muted-foreground" />
                  Transform
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Position X</Label>
                      <NumericInput value={Math.round(activeObject.left || 0)} onChange={(v) => onUpdate("left", v)} className="h-8" />
                   </div>
                   <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Position Y</Label>
                      <NumericInput value={Math.round(activeObject.top || 0)} onChange={(v) => onUpdate("top", v)} className="h-8" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Scale W (%)</Label>
                      <NumericInput 
                        value={localScaleX} 
                        onChange={(v) => { setLocalScaleX(v); debouncedUpdate("scaleX", v/100) }} 
                        className="h-8" 
                      />
                   </div>
                   <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Scale H (%)</Label>
                      <NumericInput 
                        value={localScaleY} 
                        onChange={(v) => { setLocalScaleY(v); debouncedUpdate("scaleY", v/100) }} 
                        className="h-8" 
                      />
                   </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-[10px] text-muted-foreground">Rotation</Label>
                    <span className="text-[10px] text-muted-foreground">{localAngle}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider value={[localAngle]} onValueChange={([v]) => { setLocalAngle(v); debouncedUpdate("angle", v) }} min={0} max={360} className="flex-1" />
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setLocalAngle(0); onUpdate("angle", 0) }}><RotateCw className="w-3 h-3" /></Button>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full border-none">
                   <AccordionItem value="advanced-transform" className="border-none">
                      <AccordionTrigger className="py-0 text-xs text-muted-foreground hover:no-underline justify-start gap-1">
                         More Transform Options
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Skew X</Label>
                              <Slider value={[localSkewX]} onValueChange={([v]) => { setLocalSkewX(v); debouncedUpdate("skewX", v) }} min={-80} max={80} />
                           </div>
                           <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Skew Y</Label>
                              <Slider value={[localSkewY]} onValueChange={([v]) => { setLocalSkewY(v); debouncedUpdate("skewY", v) }} min={-80} max={80} />
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" onClick={() => onUpdate("flipX", !activeObject.flipX)} className="flex-1 h-8 text-xs">
                              <FlipHorizontal className="w-3 h-3 mr-2" /> Flip H
                           </Button>
                           <Button variant="outline" size="sm" onClick={() => onUpdate("flipY", !activeObject.flipY)} className="flex-1 h-8 text-xs">
                              <FlipVertical className="w-3 h-3 mr-2" /> Flip V
                           </Button>
                        </div>
                      </AccordionContent>
                   </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            {/* Appearance */}
            <AccordionItem value="appearance" className="border-border/50">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  Appearance
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-5 pt-2">
                
                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground">Opacity</Label>
                   <div className="flex items-center gap-3">
                      <Slider
                         value={[localOpacity]}
                         onValueChange={([v]) => { setLocalOpacity(v); debouncedUpdate("opacity", v / 100) }}
                         min={0}
                         max={100}
                         className="flex-1"
                      />
                      <span className="text-xs font-mono w-8 text-right">{Math.round(localOpacity)}%</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground">Blend Mode</Label>
                   <Select value={activeObject.globalCompositeOperation || "source-over"} onValueChange={(v) => onUpdate("globalCompositeOperation", v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                         {blendModes.map(mode => <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>)}
                      </SelectContent>
                   </Select>
                </div>

                <Separator />

                {(isShape || isText) && (
                  <ColorPicker
                    value={typeof activeObject.fill === "string" ? activeObject.fill : "#000000"}
                    onChange={(color) => onUpdate("fill", color)}
                    label="Fill"
                    allowGradient={isShape}
                  />
                )}

                {(isShape || isText || isImage) && (
                  <div className="space-y-3">
                     <ColorPicker
                        value={activeObject.stroke || "#000000"}
                        onChange={(color) => onUpdate("stroke", color)}
                        label="Border"
                     />
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <Label className="text-[10px] text-muted-foreground">Width</Label>
                           <div className="flex items-center gap-2">
                              <Slider
                                 value={[localStrokeWidth]}
                                 onValueChange={([v]) => { setLocalStrokeWidth(v); debouncedUpdate("strokeWidth", v) }}
                                 min={0}
                                 max={50}
                              />
                              <span className="text-[10px] w-4">{localStrokeWidth}</span>
                           </div>
                        </div>
                        <div className="space-y-1">
                           <Label className="text-[10px] text-muted-foreground">Style</Label>
                           <Select 
                              value={activeObject.strokeDashArray ? "dashed" : "solid"} 
                              onValueChange={(v) => onUpdate("strokeDashArray", v === "dashed" ? [10, 5] : null)}
                           >
                              <SelectTrigger className="h-6 text-[10px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="solid">Solid</SelectItem>
                                 <SelectItem value="dashed">Dashed</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                     
                     {!isText && (
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Cap</Label>
                              <Select value={activeObject.strokeLineCap || "butt"} onValueChange={(v) => onUpdate("strokeLineCap", v)}>
                                 <SelectTrigger className="h-6 text-[10px]"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="butt">Butt</SelectItem>
                                    <SelectItem value="round">Round</SelectItem>
                                    <SelectItem value="square">Square</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Join</Label>
                              <Select value={activeObject.strokeLineJoin || "miter"} onValueChange={(v) => onUpdate("strokeLineJoin", v)}>
                                 <SelectTrigger className="h-6 text-[10px]"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="miter">Miter</SelectItem>
                                    <SelectItem value="round">Round</SelectItem>
                                    <SelectItem value="bevel">Bevel</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     )}
                  </div>
                )}

                {isRect && (
                   <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Corner Radius</Label>
                      <Slider
                         value={[localCornerRadius]}
                         onValueChange={([v]) => { setLocalCornerRadius(v); onUpdate("rx", v); onUpdate("ry", v) }}
                         min={0}
                         max={100}
                      />
                   </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Typography */}
            {isText && (
              <AccordionItem value="text" className="border-border/50">
                <AccordionTrigger className="hover:no-underline py-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Type className="w-4 h-4 text-muted-foreground" />
                    Typography
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                     <Select value={activeObject.fontFamily || "Arial"} onValueChange={(v) => onUpdate("fontFamily", v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                           {fontFamilies.map(f => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}
                        </SelectContent>
                     </Select>
                     <textarea
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={activeObject.text || ""}
                        onChange={(e) => onUpdate("text", e.target.value)}
                        placeholder="Type something..."
                     />
                  </div>

                  <div className="flex gap-2">
                     <div className="flex-1">
                        <Label className="text-[10px] text-muted-foreground">Size</Label>
                        <NumericInput value={localFontSize} onChange={(v) => { setLocalFontSize(v); debouncedUpdate("fontSize", v) }} min={1} />
                     </div>
                     <div className="flex-1">
                        <Label className="text-[10px] text-muted-foreground">Line Height</Label>
                        <NumericInput 
                           value={localLineHeight} 
                           onChange={(v) => { setLocalLineHeight(v); debouncedUpdate("lineHeight", v) }} 
                           step={0.1} 
                           min={0.5} 
                        />
                     </div>
                  </div>

                   <div className="space-y-1">
                     <Label className="text-[10px] text-muted-foreground">Letter Spacing</Label>
                     <Slider 
                        value={[localCharSpacing]} 
                        onValueChange={([v]) => { setLocalCharSpacing(v); debouncedUpdate("charSpacing", v) }} 
                        min={-50} 
                        max={300} 
                     />
                   </div>

                  <ToggleGroup type="multiple" className="justify-between border rounded-md p-1">
                     <ToggleGroupItem value="bold" size="sm" className="h-7 w-7" aria-label="Bold" onClick={() => onUpdate("fontWeight", activeObject.fontWeight === "bold" ? "normal" : "bold")} data-state={activeObject.fontWeight === "bold" ? "on" : "off"}>
                        <Bold className="h-3 w-3" />
                     </ToggleGroupItem>
                     <ToggleGroupItem value="italic" size="sm" className="h-7 w-7" aria-label="Italic" onClick={() => onUpdate("fontStyle", activeObject.fontStyle === "italic" ? "normal" : "italic")} data-state={activeObject.fontStyle === "italic" ? "on" : "off"}>
                        <Italic className="h-3 w-3" />
                     </ToggleGroupItem>
                     <ToggleGroupItem value="underline" size="sm" className="h-7 w-7" aria-label="Underline" onClick={() => onUpdate("underline", !activeObject.underline)} data-state={activeObject.underline ? "on" : "off"}>
                        <Underline className="h-3 w-3" />
                     </ToggleGroupItem>
                     <ToggleGroupItem value="linethrough" size="sm" className="h-7 w-7" aria-label="Strike" onClick={() => onUpdate("linethrough", !activeObject.linethrough)} data-state={activeObject.linethrough ? "on" : "off"}>
                        <Strikethrough className="h-3 w-3" />
                     </ToggleGroupItem>
                  </ToggleGroup>

                  <ToggleGroup type="single" value={activeObject.textAlign} onValueChange={(v) => v && onUpdate("textAlign", v)} className="justify-between border rounded-md p-1">
                     <ToggleGroupItem value="left" size="sm" className="h-7 w-7 flex-1"><AlignLeft className="h-3 w-3" /></ToggleGroupItem>
                     <ToggleGroupItem value="center" size="sm" className="h-7 w-7 flex-1"><AlignCenter className="h-3 w-3" /></ToggleGroupItem>
                     <ToggleGroupItem value="right" size="sm" className="h-7 w-7 flex-1"><AlignRight className="h-3 w-3" /></ToggleGroupItem>
                     <ToggleGroupItem value="justify" size="sm" className="h-7 w-7 flex-1"><AlignJustify className="h-3 w-3" /></ToggleGroupItem>
                  </ToggleGroup>

                  <ColorPicker value={activeObject.backgroundColor || ""} onChange={(c) => onUpdate("backgroundColor", c)} label="Text Background" />
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Image Effects */}
            {isImage && (
               <AccordionItem value="effects" className="border-border/50">
                  <AccordionTrigger className="hover:no-underline py-2">
                     <div className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        Effects & Filters
                     </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                     <div className="space-y-3">
                        {[{ l: "Brightness", s: setLocalBrightness, v: localBrightness, k: "brightness", min: -100, max: 100 }, 
                          { l: "Contrast", s: setLocalContrast, v: localContrast, k: "contrast", min: -100, max: 100 }, 
                          { l: "Saturation", s: setLocalSaturation, v: localSaturation, k: "saturation", min: -100, max: 100 },
                          { l: "Blur", s: setLocalBlur, v: localBlur, k: "blur", min: 0, max: 100 },
                          { l: "Noise", s: setLocalNoise, v: localNoise, k: "noise", min: 0, max: 100 }
                        ].map((filter) => (
                           <div key={filter.k} className="space-y-1">
                              <div className="flex justify-between">
                                 <Label className="text-[10px] text-muted-foreground">{filter.l}</Label>
                                 <span className="text-[10px] font-mono text-muted-foreground">{Math.round(filter.v)}</span>
                              </div>
                              <Slider 
                                 value={[filter.v]} 
                                 onValueChange={([val]) => { filter.s(val); updateImageFilter(filter.k, val) }}
                                 min={filter.min} 
                                 max={filter.max} 
                                 step={1}
                              />
                           </div>
                        ))}
                     </div>
                  </AccordionContent>
               </AccordionItem>
            )}

            {/* Shadow */}
            <AccordionItem value="shadow" className="border-border/50">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  Shadow
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                   <div className="flex-1">
                      <ColorPicker
                         value={activeObject.shadow?.color || "#000000"}
                         onChange={(color) => { onUpdate("shadow.color", color); setTimeout(updateShadow, 0) }}
                         label="Color"
                      />
                   </div>
                   <div className="pt-6">
                      <Button variant="outline" size="sm" onClick={() => onUpdate("shadow", null)} className="h-8 text-xs">Clear</Button>
                   </div>
                </div>

                <div className="space-y-1">
                   <Label className="text-[10px] text-muted-foreground">Blur</Label>
                   <Slider value={[localShadowBlur]} onValueChange={([v]) => { setLocalShadowBlur(v); updateShadow() }} min={0} max={50} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Offset X</Label>
                      <Slider value={[localShadowOffsetX]} onValueChange={([v]) => { setLocalShadowOffsetX(v); updateShadow() }} min={-50} max={50} />
                   </div>
                   <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Offset Y</Label>
                      <Slider value={[localShadowOffsetY]} onValueChange={([v]) => { setLocalShadowOffsetY(v); updateShadow() }} min={-50} max={50} />
                   </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Crop */}
            {isImage && (
               <AccordionItem value="crop" className="border-border/50">
                  <AccordionTrigger className="hover:no-underline py-2">
                     <div className="flex items-center gap-2 text-sm font-medium">
                        <Crop className="w-4 h-4 text-muted-foreground" />
                        Crop
                     </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                     <Button variant="secondary" onClick={() => setIsCropping(true)} className="w-full">
                        <Crop className="w-4 h-4 mr-2" /> Crop Image
                     </Button>
                  </AccordionContent>
               </AccordionItem>
            )}

          </Accordion>
        </div>
      </div>

      {isCropping && activeObject?._element?.src && (
        <ImageCropper
          imageUrl={activeObject._element.src}
          onCropComplete={handleCropComplete}
          onCancel={() => setIsCropping(false)}
          aspectRatio={activeObject.width / activeObject.height}
        />
      )}
    </div>
  )
}