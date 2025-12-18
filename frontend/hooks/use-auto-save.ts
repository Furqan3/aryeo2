import { useCallback, useRef, useState, useEffect } from 'react'

interface UseAutoSaveOptions {
  projectId?: string
  onSave?: (data: any) => Promise<void>
  debounceMs?: number
}

interface SaveStatus {
  isSaving: boolean
  lastSaved: Date | null
  error: string | null
}

export function useAutoSave({ projectId, onSave, debounceMs = 2000 }: UseAutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>({
    isSaving: false,
    lastSaved: null,
    error: null,
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const saveQueueRef = useRef<any>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const saveNow = useCallback(async (data: any) => {
    if (!projectId || !onSave) return

    setStatus(prev => ({ ...prev, isSaving: true, error: null }))

    try {
      await onSave(data)
      setStatus({
        isSaving: false,
        lastSaved: new Date(),
        error: null,
      })
    } catch (error) {
      console.error('Auto-save failed:', error)
      setStatus(prev => ({
        ...prev,
        isSaving: false,
        error: 'Failed to save changes',
      }))
    }
  }, [projectId, onSave])

  const debouncedSave = useCallback((data: any) => {
    if (!projectId) return

    // Store the latest data
    saveQueueRef.current = data

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (saveQueueRef.current) {
        saveNow(saveQueueRef.current)
        saveQueueRef.current = null
      }
    }, debounceMs)
  }, [projectId, debounceMs, saveNow])

  return {
    saveNow,
    debouncedSave,
    ...status,
  }
}
