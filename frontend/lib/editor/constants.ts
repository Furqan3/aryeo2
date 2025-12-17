// Canvas configuration
export const CANVAS_SIZE = {
  width: 1080,
  height: 1080,
} as const

// Default zoom level
export const DEFAULT_ZOOM = 0.55

// Selection colors for better visibility
export const SELECTION_COLORS = {
  border: '#2563eb',
  corner: '#2563eb',
  cornerStroke: '#ffffff',
  selectionFill: 'rgba(37, 99, 235, 0.15)',
  selectionBorder: '#2563eb',
} as const

// Selection styling
export const SELECTION_STYLE = {
  borderScaleFactor: 2.5,
  cornerSize: 12,
  cornerStyle: 'circle',
  transparentCorners: false,
  borderOpacityWhenMoving: 0.8,
  selectionLineWidth: 2,
} as const

// Fabric.js custom properties to save
export const CUSTOM_PROPERTIES = ['selectable', 'evented', 'hasControls', 'id']
