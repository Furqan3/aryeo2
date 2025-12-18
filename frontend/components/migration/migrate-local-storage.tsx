"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function MigrateLocalStorage() {
  const router = useRouter()
  const { toast } = useToast()
  const [hasLocalData, setHasLocalData] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if there's data in localStorage
    const savedState = localStorage.getItem("aryeo-app-state")
    const propertyInfo = sessionStorage.getItem("propertyInfo")

    if (savedState || propertyInfo) {
      // Check if user has already dismissed this notification
      const dismissed = localStorage.getItem("migration-dismissed")
      if (!dismissed) {
        setHasLocalData(true)
      }
    }
  }, [])

  const handleMigrate = async () => {
    setMigrating(true)

    try {
      // Get data from localStorage
      const savedState = localStorage.getItem("aryeo-app-state")
      const propertyInfo = sessionStorage.getItem("propertyInfo")

      if (!savedState) {
        throw new Error("No data to migrate")
      }

      const state = JSON.parse(savedState)
      const property = propertyInfo ? JSON.parse(propertyInfo) : state.propertyInfo

      // Create project in database
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Migrated Project - ${new Date().toLocaleDateString()}`,
          propertyInfo: property,
          aryeoListingId: state.sessionId,
          images: state.images || [],
          canvasData: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save project")
      }

      const { project } = await response.json()

      // Clear localStorage
      localStorage.removeItem("aryeo-app-state")
      sessionStorage.removeItem("propertyInfo")

      toast({
        title: "Success!",
        description: "Your project has been saved to your account.",
      })

      // Navigate to the saved project
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error("Migration error:", error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setMigrating(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem("migration-dismissed", "true")
    setDismissed(true)
    setHasLocalData(false)
  }

  if (!hasLocalData || dismissed) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="p-4 shadow-lg border-primary/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Unsaved Project Found</h3>
            <p className="text-sm text-muted-foreground mb-3">
              We found an unsaved project from your previous session. Would you like to save it to your account?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleMigrate}
                disabled={migrating}
                className="flex-1"
              >
                {migrating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save to Account"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                disabled={migrating}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
