"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { StepOne } from "@/components/step-one"
import { SimplePosterEditor } from "@/components/simple-poster-editor"
import { StepThree } from "@/components/step-three"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/dashboard/user-nav"
import { saveProjectCache, getProjectCache, clearProjectCache } from "@/lib/cache/project-cache"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [selectedHero, setSelectedHero] = useState<string | null>(null)
  const [selectedDetails, setSelectedDetails] = useState<string[]>([])
  const [propertyInfo, setPropertyInfo] = useState<any>(null)
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cached state on mount
  useEffect(() => {
    const cached = getProjectCache()
    if (cached.currentStep > 1 || cached.propertyInfo || cached.canvasData) {
      setCurrentStep(cached.currentStep)
      setSessionId(cached.sessionId)
      setImages(cached.images)
      setSelectedHero(cached.selectedHero)
      setSelectedDetails(cached.selectedDetails)
      setPropertyInfo(cached.propertyInfo)
      setProjectId(cached.projectId)
    }
    setIsLoaded(true)
  }, [])

  // Save state to cache whenever it changes
  useEffect(() => {
    if (!isLoaded) return
    saveProjectCache({
      currentStep,
      sessionId,
      images,
      selectedHero,
      selectedDetails,
      propertyInfo,
      projectId,
    })
  }, [currentStep, sessionId, images, selectedHero, selectedDetails, propertyInfo, projectId, isLoaded])

  const handleScrapeComplete = (data: { session_id: string; images: string[]; propertyInfo?: any }) => {
    setSessionId(data.session_id)
    setImages(data.images || [])
    if (data.propertyInfo) {
      setPropertyInfo(data.propertyInfo)
    }
    setCurrentStep(2)
  }

  const handlePropertySubmit = (info: any) => {
    setPropertyInfo(info)
    setCurrentStep(3)
  }

  const handlePosterComplete = (hero: string, details: string[]) => {
    setSelectedHero(hero)
    setSelectedDetails(details)
  }

  const resetFlow = () => {
    setCurrentStep(1)
    setSessionId(null)
    setImages([])
    setSelectedHero(null)
    setSelectedDetails([])
    setPropertyInfo(null)
    setProjectId(undefined)
    clearProjectCache()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-sidebar/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">RealtyPost</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
            {currentStep > 1 && (
              <Button variant="outline" size="sm" onClick={resetFlow}>
                Start Over
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            {[
              { num: 1, label: "Scrape Listing", description: "Enter listing URL" },
              { num: 2, label: "Property Details", description: "Confirm information" },
              { num: 3, label: "Create Content", description: "Design your post" },
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all border-2 ${
                      currentStep > step.num
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.num
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-secondary border-border text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                  </div>
                  <span
                    className={`text-sm font-medium mt-3 ${currentStep >= step.num ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">{step.description}</span>
                </div>
                {idx < 2 && (
                  <div
                    className={`h-0.5 w-full max-w-[100px] mx-4 transition-all rounded-full ${
                      currentStep > step.num ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div id="step-one" className="min-h-[500px]">
            {currentStep === 1 && <StepOne onComplete={handleScrapeComplete} />}
            {currentStep === 2 && sessionId && (
              <StepThree
                initialData={propertyInfo}
                onComplete={handlePropertySubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && propertyInfo && (
              <SimplePosterEditor
                images={images}
                propertyInfo={propertyInfo}
                onComplete={handlePosterComplete}
                onBack={() => setCurrentStep(2)}
                projectId={projectId}
                onProjectIdChange={setProjectId}
                onCanvasChange={(canvasData) => {
                  saveProjectCache({ canvasData })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
