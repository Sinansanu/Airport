"use client"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CancelFlightForm() {
  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Form submission logic would be handled by parent or external system
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-pretty">Cancel Flight</CardTitle>
        <CardDescription>Cancel a scheduled flight by number.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cancel_flight_no">Flight Number</Label>
            <Input id="cancel_flight_no" placeholder="e.g., AI-203" required />
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground">
            Cancel Flight
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
