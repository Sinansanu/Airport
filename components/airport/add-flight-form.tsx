"use client"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AddFlightForm() {
  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Form submission logic would be handled by parent or external system
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-pretty">Add Flight</CardTitle>
        <CardDescription>Add a new flight to the schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="flight_no">Flight Number</Label>
            <Input id="flight_no" placeholder="e.g., AI-203" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" placeholder="e.g., JFK" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time_str">Departure Time</Label>
            <Input id="time_str" type="time" required />
          </div>
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <Label htmlFor="emergency">Emergency</Label>
              <p className="text-sm text-muted-foreground">Prioritize this flight.</p>
            </div>
            <Switch id="emergency" />
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground">
            Add Flight
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
