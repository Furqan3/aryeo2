# Editor Library

Professional poster editor utilities, hooks, and templates organized for maintainability and reusability.

## 📁 Structure

```
lib/editor/
├── constants.ts              # Canvas configuration and constants
├── canvas-helpers.ts         # Canvas utility functions
├── hooks/                    # Custom React hooks
│   ├── use-canvas-history.ts # Undo/redo functionality
│   ├── use-layers.ts         # Layer management
│   └── index.ts              # Hooks exports
├── templates/                # Poster templates
│   ├── real-estate-template.ts
│   ├── minimal-template.ts
│   ├── bold-template.ts
│   └── index.ts              # Template exports
└── index.ts                  # Main exports
```

## 🎯 Usage

### Import Everything

```typescript
import {
  // Constants
  CANVAS_SIZE,
  DEFAULT_ZOOM,
  SELECTION_COLORS,

  // Utilities
  generateUniqueId,
  debounce,
  createImageFrame,
  initializeCanvasSelection,
  bringTextToFront,

  // Hooks
  useCanvasHistory,
  useLayers,

  // Templates
  applyRealEstateTemplate,
  applyMinimalTemplate,
  applyBoldTemplate,
} from '@/lib/editor'
```

### Using Hooks

#### Canvas History (Undo/Redo)

```typescript
const { saveToHistory, undo, redo, canUndo, canRedo } = useCanvasHistory()

// Save current state
saveToHistory(canvas)

// Undo/Redo
undo(canvas, () => console.log('Undo complete'))
redo(canvas, () => console.log('Redo complete'))

// Check availability
if (canUndo) {
  // Show undo button
}
```

#### Layers Management

```typescript
const {
  layers,
  updateLayers,
  selectLayer,
  toggleLayerVisibility,
  moveLayer,
  reorderLayers
} = useLayers()

// Update layers list
updateLayers(canvas)

// Select a layer
selectLayer(canvas, 0, (obj) => setActiveObject(obj))

// Toggle visibility
toggleLayerVisibility(canvas, 0)

// Move layer up/down
moveLayer(canvas, 0, 'up')

// Reorder layers
reorderLayers(canvas, newLayersArray)
```

### Using Templates

```typescript
import { applyRealEstateTemplate } from '@/lib/editor'

await applyRealEstateTemplate(
  canvas,
  fabricLib,
  images,
  propertyInfo,
  { width: 1080, height: 1080 }
)
```

### Using Utilities

```typescript
import { createImageFrame, generateUniqueId, initializeCanvasSelection } from '@/lib/editor'

// Create an image on canvas
await createImageFrame(canvas, fabricLib, imageUrl, 0, 0, 300, 300)

// Generate unique ID
const id = generateUniqueId()

// Initialize selection styling
initializeCanvasSelection(fabricLib, canvas)
```

## 🎨 Templates

### Real Estate Template
Classic real estate poster with price badge, property details, and multiple image layout.

### Minimal Template
Modern minimal design with clean typography and subtle shadows.

### Bold Template
Eye-catching bold design with gradient overlays and vibrant colors.

## 🔧 Constants

- `CANVAS_SIZE`: Default canvas dimensions (1080x1080)
- `DEFAULT_ZOOM`: Initial zoom level (0.55)
- `SELECTION_COLORS`: Blue color scheme for selections
- `SELECTION_STYLE`: Border and corner styling
- `CUSTOM_PROPERTIES`: Fabric.js properties to persist

## 📝 Best Practices

1. **Always save to history** after canvas modifications
2. **Use hooks** for state management instead of local state
3. **Import from index** for cleaner imports
4. **Type your components** with proper TypeScript interfaces
5. **Keep templates pure** - no side effects, async/await for images

## 🚀 Migration Guide

Old code:
```typescript
// Before
import { SimplePosterEditor } from '@/components/simple-poster-editor'
```

New code:
```typescript
// After
import { PosterEditor } from '@/components/editor/poster-editor'
```

The old import still works for backward compatibility but is deprecated.
