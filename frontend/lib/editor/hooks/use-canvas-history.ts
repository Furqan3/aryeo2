"use client"

import { useState, useCallback, useRef } from "react"
import { CUSTOM_PROPERTIES } from "../constants"

export const useCanvasHistory = () => {
  const [history, setHistory] = useState<string[]>([])
  const [historyStep, setHistoryStep] = useState(-1)
  const historyRef = useRef<string[]>([])
  const historyStepRef = useRef(-1)
  const isLoadingRef = useRef(false)

  const saveToHistory = useCallback((fabricCanvas: any) => {
    if (!fabricCanvas || isLoadingRef.current) return

    try {
      const json = JSON.stringify(fabricCanvas.toJSON(CUSTOM_PROPERTIES))

      // Avoid duplicate states
      if (historyRef.current[historyStepRef.current] === json) {
        return
      }

      const newStep = historyStepRef.current + 1
      const newHistory = [...historyRef.current.slice(0, newStep), json]

      historyRef.current = newHistory
      historyStepRef.current = newStep

      setHistory(newHistory)
      setHistoryStep(newStep)
    } catch (error) {
      console.error("Error saving to history:", error)
    }
  }, [])

  const undo = useCallback((canvas: any, onComplete?: () => void) => {
    if (historyStepRef.current <= 0 || !canvas) return

    const newStep = historyStepRef.current - 1
    const stateToLoad = historyRef.current[newStep]

    if (!stateToLoad) return

    isLoadingRef.current = true

    try {
      const jsonData = JSON.parse(stateToLoad)
      canvas.loadFromJSON(jsonData, () => {
        canvas.renderAll()
        historyStepRef.current = newStep
        setHistoryStep(newStep)
        isLoadingRef.current = false
        onComplete?.()
      })
    } catch (error) {
      console.error("Error during undo:", error)
      isLoadingRef.current = false
    }
  }, [])

  const redo = useCallback((canvas: any, onComplete?: () => void) => {
    if (historyStepRef.current >= historyRef.current.length - 1 || !canvas) return

    const newStep = historyStepRef.current + 1
    const stateToLoad = historyRef.current[newStep]

    if (!stateToLoad) return

    isLoadingRef.current = true

    try {
      const jsonData = JSON.parse(stateToLoad)
      canvas.loadFromJSON(jsonData, () => {
        canvas.renderAll()
        historyStepRef.current = newStep
        setHistoryStep(newStep)
        isLoadingRef.current = false
        onComplete?.()
      })
    } catch (error) {
      console.error("Error during redo:", error)
      isLoadingRef.current = false
    }
  }, [])

  const canUndo = historyStep > 0
  const canRedo = historyStep < history.length - 1

  return {
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    historyStep,
  }
}
