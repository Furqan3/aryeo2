"use client"

import * as React from "react"
import { Input, type InputProps } from "@/components/ui/input"

interface NumericInputProps extends Omit<InputProps, "onChange" | "value"> {
  value: number
  onChange: (value: number) => void
  step?: number
  shiftStep?: number
}

export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onChange, step = 1, shiftStep = 10, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      let newValue = value

      if (e.key === "ArrowUp") {
        e.preventDefault()
        newValue = value + (e.shiftKey ? shiftStep : step)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        newValue = value - (e.shiftKey ? shiftStep : step)
      }

      if (newValue !== value) {
        onChange(newValue)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = parseFloat(e.target.value)
      if (!isNaN(numValue)) {
        onChange(numValue)
      }
    }

    return (
      <Input
        ref={ref}
        type="number"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  },
)

NumericInput.displayName = "NumericInput"
