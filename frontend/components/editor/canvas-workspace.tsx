"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CanvasWorkspaceProps {
  canvasSize: { width: number; height: number }
  zoom: number
  loading: boolean
  showGrid?: boolean
  onCanvasReady: (canvas: any) => void
}

export interface CanvasWorkspaceRef {
  getCanvas: () => any
}

export const CanvasWorkspace = forwardRef<CanvasWorkspaceRef, CanvasWorkspaceProps>(
  ({ canvasSize, zoom, loading, showGrid = false, onCanvasReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const fabricCanvasRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
      getCanvas: () => fabricCanvasRef.current,
    }))

    // Initialize Fabric.js canvas
    useEffect(() => {
      if (!canvasRef.current) return

      const fabricLib = (window as any).fabric
      if (!fabricLib) return

      // Don't recreate if already exists and is valid
      if (fabricCanvasRef.current && fabricCanvasRef.current.getElement()) {
        return
      }

      console.log("Creating new Fabric canvas")
      fabricCanvasRef.current = new fabricLib.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        selection: true,
      })

      onCanvasReady(fabricCanvasRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div
        ref={containerRef}
        className={cn("flex-1 flex items-center justify-center relative overflow-auto", "canvas-workspace")}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
              <p className="text-sm font-medium">Loading editor...</p>
              <p className="text-xs text-muted-foreground mt-1">Preparing your canvas</p>
            </div>
          </div>
        )}

        <div className="relative">
          {/* Canvas shadow and border */}
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              boxShadow: "0 4px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            <canvas ref={canvasRef} />
          </div>

          {/* Grid overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none rounded-sm"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                backgroundSize: "20px 20px",
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
              }}
            />
          )}
        </div>

        {/* Canvas size indicator */}
        <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-card/80 backdrop-blur-sm border border-border text-xs text-muted-foreground">
          {canvasSize.width} × {canvasSize.height} px
        </div>
      </div>
    )
  },
)

CanvasWorkspace.displayName = "CanvasWorkspace"
