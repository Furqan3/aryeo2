"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface StepThreeProps {
  initialData?: any
  onComplete: (propertyInfo: any) => void
  onBack: () => void
}

export function StepThree({ initialData, onComplete, onBack }: StepThreeProps) {
  const [formData, setFormData] = useState({
    price: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    property_type: "Single Family Home",
    year_built: "",
    lot_size: "",
  })

  const [isPreFilled, setIsPreFilled] = useState(false)

  // Pre-fill form with initial data if available
  useEffect(() => {
    if (initialData) {
      setFormData({
        price: initialData.price || "",
        bedrooms: initialData.bedrooms || "",
        bathrooms: initialData.bathrooms || "",
        square_feet: initialData.square_feet || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        zip_code: initialData.zip_code || "",
        property_type: initialData.property_type || "Single Family Home",
        year_built: initialData.year_built || "",
        lot_size: initialData.lot_size || "",
      })
      setIsPreFilled(true)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <Card className="p-8 border-border bg-card">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-balance">Property Details</h2>
        <p className="text-muted-foreground text-pretty">
          {isPreFilled
            ? "Review and edit the property information below"
            : "Enter the property information to generate your social media post"}
        </p>
        {isPreFilled && (
          <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg mt-4">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-primary">Form Pre-filled</p>
              <p className="text-sm text-primary/90">
                We've automatically filled in the property details. You can edit any field below.
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price *
            </Label>
            <Input
              id="price"
              name="price"
              placeholder="$500,000"
              value={formData.price}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="bedrooms" className="text-sm font-medium">
              Bedrooms *
            </Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min="0"
              placeholder="3"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <Label htmlFor="bathrooms" className="text-sm font-medium">
              Bathrooms *
            </Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              step="1"
              min="0"
              placeholder="0"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          {/* Square Feet */}
          <div className="space-y-2">
            <Label htmlFor="square_feet" className="text-sm font-medium">
              Square Feet *
            </Label>
            <Input
              id="square_feet"
              name="square_feet"
              type="number"
              min="100"
              placeholder="2500"
              value={formData.square_feet}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Street Address *
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              City *
            </Label>
            <Input
              id="city"
              name="city"
              placeholder="Los Angeles"
              value={formData.city}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">
              State *
            </Label>
            <Input
              id="state"
              name="state"
              placeholder="CA"
              maxLength={2}
              value={formData.state}
              onChange={handleChange}
              required
              className="h-11 uppercase"
            />
          </div>

          {/* Zip Code */}
          <div className="space-y-2">
            <Label htmlFor="zip_code" className="text-sm font-medium">
              Zip Code *
            </Label>
            <Input
              id="zip_code"
              name="zip_code"
              placeholder="90210"
              value={formData.zip_code}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="property_type" className="text-sm font-medium">
              Property Type
            </Label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Single Family Home</option>
              <option>Condo</option>
              <option>Townhouse</option>
              <option>Multi-Family</option>
              <option>Land</option>
              <option>Commercial</option>
            </select>
          </div>

          {/* Year Built */}
          <div className="space-y-2">
            <Label htmlFor="year_built" className="text-sm font-medium">
              Year Built
            </Label>
            <Input
              id="year_built"
              name="year_built"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              placeholder="2020"
              value={formData.year_built}
              onChange={handleChange}
              className="h-11"
            />
          </div>

          {/* Lot Size */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="lot_size" className="text-sm font-medium">
              Lot Size
            </Label>
            <Input
              id="lot_size"
              name="lot_size"
              placeholder="0.25 acres"
              value={formData.lot_size}
              onChange={handleChange}
              className="h-11"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} size="lg" className="flex-1 h-12 bg-transparent">
            Back
          </Button>
          <Button type="submit" size="lg" className="flex-1 h-12">
            Continue to Design
          </Button>
        </div>
      </form>
    </Card>
  )
}
