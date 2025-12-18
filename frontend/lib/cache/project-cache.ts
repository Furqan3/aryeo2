/**
 * Utility for caching project state in localStorage
 * Allows users to resume work where they left off
 */

export interface CachedProjectState {
  currentStep: number
  sessionId: string | null
  images: string[]
  selectedHero: string | null
  selectedDetails: string[]
  propertyInfo: any
  canvasData: any
  projectId?: string
  lastUpdated: string
}

const CACHE_KEY = "realtypost-project-cache"

export function saveProjectCache(state: Partial<CachedProjectState>): void {
  try {
    const existing = getProjectCache()
    const updated: CachedProjectState = {
      ...existing,
      ...state,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Failed to save project cache:", error)
  }
}

export function getProjectCache(): CachedProjectState {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) {
      return getDefaultState()
    }
    return JSON.parse(cached)
  } catch (error) {
    console.error("Failed to load project cache:", error)
    return getDefaultState()
  }
}

export function clearProjectCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch (error) {
    console.error("Failed to clear project cache:", error)
  }
}

export function hasProjectCache(): boolean {
  try {
    return !!localStorage.getItem(CACHE_KEY)
  } catch (error) {
    return false
  }
}

function getDefaultState(): CachedProjectState {
  return {
    currentStep: 1,
    sessionId: null,
    images: [],
    selectedHero: null,
    selectedDetails: [],
    propertyInfo: null,
    canvasData: null,
    projectId: undefined,
    lastUpdated: new Date().toISOString(),
  }
}
