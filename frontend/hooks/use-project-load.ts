import { useState, useEffect } from 'react'

interface Project {
  id: string
  name: string
  propertyInfo: any
  aryeoListingId: string | null
  images: string[]
  canvasData: any
  createdAt: Date
  updatedAt: Date
  lastEditedAt: Date
}

interface UseProjectLoadResult {
  project: Project | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProjectLoad(projectId?: string): UseProjectLoadResult {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = async () => {
    if (!projectId) {
      setProject(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${projectId}`)

      if (!response.ok) {
        throw new Error(`Failed to load project: ${response.status}`)
      }

      const data = await response.json()
      setProject(data.project)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load project'
      setError(errorMessage)
      console.error('Error loading project:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [projectId])

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  }
}
