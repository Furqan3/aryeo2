"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getListing, extractPropertyInfo } from "@/lib/api/aryeo"
import { Loader2,  AlertCircle,  } from "lucide-react"
import { Tabs, TabsContent,  } from "@/components/ui/tabs"

interface StepOneProps {
  onComplete: (data: { session_id: string; images: string[]; propertyInfo: any }) => void
}

export function StepOne({ onComplete }: StepOneProps) {

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("scrape")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Use local data function instead of backend API
      const listingData = await getListing(url)

      // Extract property information from API data
      const propertyInfo = extractPropertyInfo(listingData.data)

      // Transform the Aryeo API data to match expected format
      const formattedData = {
        session_id: listingData.data.id,
        images: listingData.data.images.map((img: any) => img.large_url || img.original_url),
        propertyInfo: propertyInfo
      }

      onComplete(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listing data")
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <Card className="p-8 gradient-card border-border">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          
          <h2 className="text-3xl font-bold mb-3">Import Media</h2>
          <p className="text-muted-foreground text-pretty">
            Scrape images from Aryeo
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          

          <TabsContent value="scrape" className="space-y-6 ">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="url"
                  placeholder="https://moshin-real-estate-media.aryeo.com/listings/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="h-12 text-lg bg-background border-border"
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground mt-2">Must be a valid Aryeo.com listing URL</p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Error</p>
                    <p className="text-sm text-destructive/90">{error}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
                disabled={loading || !url}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Scraping Images...
                  </>
                ) : (
                  "Scrape Listing"
                )}
              </Button>
            </form>

            
          </TabsContent>

        
        </Tabs>
      </div>
    </Card>
  )
}
