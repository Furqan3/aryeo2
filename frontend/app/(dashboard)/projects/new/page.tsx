"use client"

import { useState } from "react"
import { StepOne } from "@/components/step-one"
import { SimplePosterEditor } from "@/components/simple-poster-editor"
import { StepThree } from "@/components/step-three"
import { CheckCircle2 } from "lucide-react"

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [selectedHero, setSelectedHero] = useState<string | null>(null)
  const [selectedDetails, setSelectedDetails] = useState<string[]>([])
  const [propertyInfo, setPropertyInfo] = useState<any>(null)

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
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
        <div className="min-h-[500px]">
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
            />
          )}
        </div>
      </div>
    </div>
  )
}
