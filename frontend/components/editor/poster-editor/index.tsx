"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

// Editor components
import { EditorHeader } from "@/components/editor/editor-header"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { EditorSidebar } from "@/components/editor/editor-sidebar"
import { CanvasWorkspace, type CanvasWorkspaceRef } from "@/components/editor/canvas-workspace"
import { RightPanel } from "@/components/editor/right-panel"
import { TemplatesDialog } from "@/components/editor/templates-dialog"

// Editor utilities and hooks
import {
  CANVAS_SIZE,
  DEFAULT_ZOOM,
  debounce,
  generateUniqueId,
  initializeCanvasSelection,
  createImageFrame,
  useCanvasHistory,
  useLayers,
  applyRealEstateTemplate,
  applyMinimalTemplate,
  applyBoldTemplate,
} from "@/lib/editor"

interface PosterEditorProps {
  images: string[]
  propertyInfo: any
  onComplete: (hero: string, details: string[]) => void
  onBack: () => void
}

export function PosterEditor({ images, propertyInfo, onComplete, onBack }: PosterEditorProps) {
  const canvasWorkspaceRef = useRef<CanvasWorkspaceRef>(null)
  const { toast } = useToast()
  const canvasRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [canvas, setCanvas] = useState<any>(null)
  const [fabricLoaded, setFabricLoaded] = useState(false)
  const [activeObject, setActiveObject] = useState<any>(null)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [templatesOpen, setTemplatesOpen] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")

  // Custom hooks
  const { saveToHistory, undo, redo, canUndo, canRedo } = useCanvasHistory()
  const { layers, updateLayers, selectLayer, toggleLayerVisibility, moveLayer, reorderLayers } = useLayers()

  // Load Fabric.js from CDN
  useEffect(() => {
    if ((window as any).fabric) {
      setFabricLoaded(true)
      return
    }

    const existingScript = document.querySelector('script[src*="fabric.min.js"]')
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if ((window as any).fabric) {
          setFabricLoaded(true)
          clearInterval(checkInterval)
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"
    script.async = true
    script.onload = () => setFabricLoaded(true)
    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load editor. Please refresh the page.",
        variant: "destructive",
      })
    }
    document.head.appendChild(script)

    return () => {
      script.onload = null
      script.onerror = null
    }
  }, [toast])

  const handleCanvasReady = useCallback(
    (fabricCanvas: any) => {
      if (canvasRef.current) return
      canvasRef.current = fabricCanvas

      const fabricLib = (window as any).fabric
      if (fabricLib) {
        initializeCanvasSelection(fabricLib, fabricCanvas)
      }

      fabricCanvas.on("selection:created", (e: any) => setActiveObject(e.selected[0]))
      fabricCanvas.on("selection:updated", (e: any) => setActiveObject(e.selected[0]))
      fabricCanvas.on("selection:cleared", () => setActiveObject(null))
      fabricCanvas.on("object:modified", () => saveToHistory(fabricCanvas))
      fabricCanvas.on("object:added", () => updateLayers(fabricCanvas))
      fabricCanvas.on("object:removed", () => updateLayers(fabricCanvas))

      setCanvas(fabricCanvas)
      setLoading(false)
      setTimeout(() => saveToHistory(fabricCanvas), 100)
    },
    [saveToHistory, updateLayers],
  )

  const handleUndo = useCallback(() => {
    undo(canvas, () => updateLayers(canvas))
  }, [undo, canvas, updateLayers])

  const handleRedo = useCallback(() => {
    redo(canvas, () => updateLayers(canvas))
  }, [redo, canvas, updateLayers])

  const applyTemplate = useCallback(
    async (templateId: string) => {
      if (!canvas) return
      const fabricLib = (window as any).fabric
      if (!fabricLib) return

      setTemplatesOpen(false)

      switch (templateId) {
        case "real-estate-classic":
          await applyRealEstateTemplate(canvas, fabricLib, images, propertyInfo, CANVAS_SIZE)
          break
        case "minimal-modern":
          await applyMinimalTemplate(canvas, fabricLib, images, propertyInfo, CANVAS_SIZE, saveToHistory)
          break
        case "bold-luxury":
          await applyBoldTemplate(canvas, fabricLib, images, propertyInfo, CANVAS_SIZE, saveToHistory)
          break
      }

      saveToHistory(canvas)
    },
    [canvas, images, propertyInfo, saveToHistory],
  )

  const addText = useCallback(() => {
    if (!canvas) return
    const fabricLib = (window as any).fabric

    const text = new fabricLib.Textbox("Edit this text", {
      left: 100,
      top: 100,
      fontSize: 48,
      fontFamily: "Arial",
      fill: "#000000",
      width: 300,
      id: generateUniqueId(),
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
    saveToHistory(canvas)
  }, [canvas, saveToHistory])

  const addImage = useCallback(
    (imageUrl: string) => {
      if (!canvas) return
      const fabricLib = (window as any).fabric

      createImageFrame(canvas, fabricLib, imageUrl, 100, 100, 300, 300)
      saveToHistory(canvas)
    },
    [canvas, saveToHistory],
  )

  const addShape = useCallback(
    (shapeType: string) => {
      if (!canvas) return
      const fabricLib = (window as any).fabric

      let shape
      const commonProps = { left: 100, top: 100, id: generateUniqueId() }

      if (shapeType === "rect") {
        shape = new fabricLib.Rect({ ...commonProps, width: 200, height: 200, fill: "#3b82f6" })
      } else if (shapeType === "circle") {
        shape = new fabricLib.Circle({ ...commonProps, radius: 100, fill: "#10b981" })
      } else if (shapeType === "triangle") {
        shape = new fabricLib.Triangle({ ...commonProps, width: 200, height: 200, fill: "#f59e0b" })
      } else if (shapeType === "line") {
        shape = new fabricLib.Line([100, 100, 300, 100], { ...commonProps, stroke: "#3b82f6", strokeWidth: 4 })
      } else if (shapeType === "star") {
        const points = []
        const outerRadius = 100,
          innerRadius = 50,
          numPoints = 5
        for (let i = 0; i < numPoints * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (Math.PI * i) / numPoints - Math.PI / 2
          points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius })
        }
        shape = new fabricLib.Polygon(points, { ...commonProps, fill: "#fbbf24", stroke: "#f59e0b", strokeWidth: 2 })
      } else if (shapeType === "polygon") {
        const hexPoints = []
        const hexRadius = 80
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
          hexPoints.push({ x: Math.cos(angle) * hexRadius, y: Math.sin(angle) * hexRadius })
        }
        shape = new fabricLib.Polygon(hexPoints, { ...commonProps, fill: "#8b5cf6", stroke: "#7c3aed", strokeWidth: 2 })
      } else if (shapeType === "arrow") {
        const arrowPath = "M 0 0 L 100 0 L 100 -20 L 140 20 L 100 60 L 100 40 L 0 40 Z"
        shape = new fabricLib.Path(arrowPath, { ...commonProps, fill: "#3b82f6", stroke: "#2563eb", strokeWidth: 2 })
      }

      if (shape) {
        canvas.add(shape)
        canvas.setActiveObject(shape)
        canvas.renderAll()
        saveToHistory(canvas)
      }
    },
    [canvas, saveToHistory],
  )

  const debouncedSave = useCallback(
    debounce((c: any) => saveToHistory(c), 400),
    [saveToHistory],
  )

  const updateObjectProperty = useCallback(
    (property: string, value: any) => {
      if (!activeObject || !canvas) return
      activeObject.set(property, value)
      canvas.renderAll()
      debouncedSave(canvas)
    },
    [activeObject, canvas, debouncedSave],
  )

  const replaceImage = useCallback(
    (newImageUrl: string) => {
      if (!activeObject || !canvas || activeObject.type !== "image") return
      const fabricLib = (window as any).fabric

      fabricLib.Image.fromURL(
        newImageUrl,
        (newImg: any) => {
          if (!newImg) return

          newImg.set({
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            angle: activeObject.angle,
            opacity: activeObject.opacity,
            id: activeObject.id,
          })

          canvas.remove(activeObject)
          canvas.add(newImg)
          canvas.setActiveObject(newImg)
          canvas.renderAll()
          saveToHistory(canvas)
        },
        { crossOrigin: "anonymous" },
      )
    },
    [activeObject, canvas, saveToHistory],
  )

  const deleteActiveObject = useCallback(() => {
    if (!activeObject || !canvas) return
    canvas.remove(activeObject)
    setActiveObject(null)
    canvas.renderAll()
    saveToHistory(canvas)
  }, [activeObject, canvas, saveToHistory])

  const duplicateObject = useCallback(() => {
    if (!activeObject || !canvas) return

    activeObject.clone((cloned: any) => {
      cloned.set({
        left: activeObject.left + 20,
        top: activeObject.top + 20,
        id: generateUniqueId(),
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
      saveToHistory(canvas)
    })
  }, [activeObject, canvas, saveToHistory])

  const alignObjects = useCallback(
    (direction: string) => {
      if (!activeObject || !canvas) return
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      switch (direction) {
        case "left":
          activeObject.set({ left: 0 })
          break
        case "center-h":
          activeObject.set({ left: (canvasWidth - activeObject.getScaledWidth()) / 2 })
          break
        case "right":
          activeObject.set({ left: canvasWidth - activeObject.getScaledWidth() })
          break
        case "top":
          activeObject.set({ top: 0 })
          break
        case "center-v":
          activeObject.set({ top: (canvasHeight - activeObject.getScaledHeight()) / 2 })
          break
        case "bottom":
          activeObject.set({ top: canvasHeight - activeObject.getScaledHeight() })
          break
      }

      canvas.renderAll()
      saveToHistory(canvas)
    },
    [activeObject, canvas, saveToHistory],
  )

  const groupObjects = useCallback(() => {
    if (!canvas) return
    const fabricLib = (window as any).fabric
    const selection = canvas.getActiveObjects()

    if (selection.length < 2) return

    const group = new fabricLib.Group(selection, {
      canvas: canvas,
      id: generateUniqueId(),
    })

    canvas.discardActiveObject()
    selection.forEach((obj: any) => canvas.remove(obj))
    canvas.add(group)
    canvas.setActiveObject(group)
    canvas.renderAll()
    saveToHistory(canvas)
  }, [canvas, saveToHistory])

  const ungroupObjects = useCallback(() => {
    if (!activeObject || !canvas || activeObject.type !== "group") return

    activeObject.toActiveSelection()
    canvas.discardActiveObject()
    canvas.renderAll()
    saveToHistory(canvas)
  }, [activeObject, canvas, saveToHistory])

  const flipHorizontal = useCallback(() => {
    if (!activeObject || !canvas) return
    activeObject.set("flipX", !activeObject.flipX)
    canvas.renderAll()
    saveToHistory(canvas)
  }, [activeObject, canvas, saveToHistory])

  const flipVertical = useCallback(() => {
    if (!activeObject || !canvas) return
    activeObject.set("flipY", !activeObject.flipY)
    canvas.renderAll()
    saveToHistory(canvas)
  }, [activeObject, canvas, saveToHistory])

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !canvas) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        addImage(imageUrl)
      }
      reader.readAsDataURL(file)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [canvas, addImage],
  )

  const saveProject = useCallback(() => {
    if (!canvas) return

    const json = JSON.stringify(canvas.toJSON(["selectable", "evented", "hasControls", "id"]))
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `poster-project-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Project Saved",
      description: "Your project has been downloaded.",
    })
  }, [canvas, toast])

  const loadProject = useCallback(() => {
    if (!canvas) return

    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string
          canvas.loadFromJSON(JSON.parse(json), () => {
            canvas.getObjects().forEach((obj: any) => {
              if (!obj.id) {
                obj.id = generateUniqueId()
              }
            })
            canvas.renderAll()
            saveToHistory(canvas)
            toast({
              title: "Project Loaded",
              description: "Your project has been loaded successfully.",
            })
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load project file.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [canvas, toast, saveToHistory])

  const downloadPoster = useCallback(() => {
    if (!canvas) return

    const dataURL = canvas.toDataURL({ format: "png", quality: 1, multiplier: 2 })
    const link = document.createElement("a")
    link.download = `poster-${Date.now()}.png`
    link.href = dataURL
    link.click()

    toast({ title: "Success", description: "Poster downloaded successfully!" })
  }, [canvas, toast])

  const downloadPosterJPG = useCallback(() => {
    if (!canvas) return

    const dataURL = canvas.toDataURL({ format: "jpeg", quality: 0.9, multiplier: 2 })
    const link = document.createElement("a")
    link.download = `poster-${Date.now()}.jpg`
    link.href = dataURL
    link.click()

    toast({ title: "Success", description: "Poster downloaded as JPG!" })
  }, [canvas, toast])

  // Layer order functions
  const bringForward = useCallback(() => {
    if (!activeObject || !canvas) return
    canvas.bringForward(activeObject)
    canvas.renderAll()
    saveToHistory(canvas)
    updateLayers(canvas)
  }, [activeObject, canvas, saveToHistory, updateLayers])

  const sendBackward = useCallback(() => {
    if (!activeObject || !canvas) return
    canvas.sendBackwards(activeObject)
    canvas.renderAll()
    saveToHistory(canvas)
    updateLayers(canvas)
  }, [activeObject, canvas, saveToHistory, updateLayers])

  const bringToFront = useCallback(() => {
    if (!activeObject || !canvas) return
    canvas.bringToFront(activeObject)
    canvas.renderAll()
    saveToHistory(canvas)
    updateLayers(canvas)
  }, [activeObject, canvas, saveToHistory, updateLayers])

  const sendToBack = useCallback(() => {
    if (!activeObject || !canvas) return
    canvas.sendToBack(activeObject)
    canvas.renderAll()
    saveToHistory(canvas)
    updateLayers(canvas)
  }, [activeObject, canvas, saveToHistory, updateLayers])

  if (!fabricLoaded) {
    return (
      <div className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-white">Loading editor...</p>
          <p className="text-sm text-zinc-500 mt-2">Please wait while we initialize the canvas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-[57px] left-0 right-0 bottom-0 bg-[#1a1a1a] flex flex-col z-30">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Editor Header */}
      <EditorHeader
        projectName="Real Estate Poster"
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={saveProject}
        onLoad={loadProject}
        onExport={downloadPoster}
        onExportJPG={downloadPosterJPG}
        onBack={onBack}
      />

      {/* Toolbar */}
      <EditorToolbar
        zoom={zoom}
        showGrid={showGrid}
        hasSelection={!!activeObject}
        canGroup={canvas?.getActiveObjects && canvas.getActiveObjects().length >= 2}
        isGrouped={activeObject?.type === "group"}
        onZoomIn={() => setZoom(Math.min(zoom + 0.1, 2))}
        onZoomOut={() => setZoom(Math.max(zoom - 0.1, 0.1))}
        onZoomReset={() => setZoom(DEFAULT_ZOOM)}
        onZoomChange={setZoom}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onDuplicate={duplicateObject}
        onDelete={deleteActiveObject}
        onAlign={alignObjects}
        onGroup={groupObjects}
        onUngroup={ungroupObjects}
        onBringForward={bringForward}
        onSendBackward={sendBackward}
        onBringToFront={bringToFront}
        onSendToBack={sendToBack}
        onFlipHorizontal={flipHorizontal}
        onFlipVertical={flipVertical}
      />

      {/* Main Content - takes remaining space below headers */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <EditorSidebar
          onAddText={addText}
          onAddShape={addShape}
          onOpenTemplates={() => setTemplatesOpen(true)}
          onUploadImage={handleImageUpload}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Canvas */}
        <CanvasWorkspace
          ref={canvasWorkspaceRef}
          canvasSize={CANVAS_SIZE}
          zoom={zoom}
          loading={loading}
          showGrid={showGrid}
          onCanvasReady={handleCanvasReady}
        />

        {/* Right Panel */}
        <RightPanel
          images={images}
          layers={layers}
          activeObject={activeObject}
          onSelectImage={addImage}
          onReplaceImage={replaceImage}
          onSelectLayer={(index) => selectLayer(canvas, index, setActiveObject)}
          onToggleVisibility={(index) => {
            toggleLayerVisibility(canvas, index)
            updateLayers(canvas)
          }}
          onMoveLayer={(index, direction) => {
            moveLayer(canvas, index, direction)
            updateLayers(canvas)
          }}
          onReorderLayers={(newLayers) => {
            reorderLayers(canvas, newLayers)
            updateLayers(canvas)
          }}
          onUpdateProperty={updateObjectProperty}
          onDeleteObject={deleteActiveObject}
        />
      </div>

      {/* Templates Dialog */}
      <TemplatesDialog open={templatesOpen} onClose={() => setTemplatesOpen(false)} onSelectTemplate={applyTemplate} />
    </div>
  )
}
