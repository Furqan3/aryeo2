import { useState, useCallback } from 'react'

export const useLayers = () => {
  const [layers, setLayers] = useState<any[]>([])

  const updateLayers = useCallback((fabricCanvas: any) => {
    if (!fabricCanvas) return
    const objects = fabricCanvas.getObjects()
    setLayers([...objects].reverse())
  }, [])

  const selectLayer = useCallback((canvas: any, index: number, onSelect?: (obj: any) => void) => {
    if (!canvas) return
    const objects = canvas.getObjects()
    const reversedIndex = objects.length - 1 - index
    const obj = objects[reversedIndex]
    canvas.setActiveObject(obj)
    canvas.renderAll()
    onSelect?.(obj)
  }, [])

  const toggleLayerVisibility = useCallback((canvas: any, index: number) => {
    if (!canvas) return
    const objects = canvas.getObjects()
    const reversedIndex = objects.length - 1 - index
    const obj = objects[reversedIndex]
    obj.set('visible', !obj.visible)
    canvas.renderAll()
  }, [])

  const moveLayer = useCallback((canvas: any, index: number, direction: 'up' | 'down') => {
    if (!canvas) return
    const objects = canvas.getObjects()
    const reversedIndex = objects.length - 1 - index
    const obj = objects[reversedIndex]

    if (direction === 'up') {
      canvas.bringForward(obj)
    } else if (direction === 'down') {
      canvas.sendBackwards(obj)
    }

    canvas.renderAll()
  }, [])

  const reorderLayers = useCallback((canvas: any, newLayers: any[]) => {
    if (!canvas) return
    const newObjects = [...newLayers].reverse()
    canvas._objects = newObjects
    setLayers(newLayers)
    canvas.renderAll()
  }, [])

  return {
    layers,
    updateLayers,
    selectLayer,
    toggleLayerVisibility,
    moveLayer,
    reorderLayers,
  }
}
