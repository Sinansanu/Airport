"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { addFlight, type AddFlightPayload } from "@/lib/api"

export function AddFlightForm({ onAfterSubmit }: { onAfterSubmit?: () => void }) {
  const [form, setForm] = useState<AddFlightPayload>({
    flight_no: "",
    destination: "",
    time_str: "",
    is_emergency: false,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setLoading(true)
    try {
      await addFlight(form)
      setMessage("Flight added successfully.")
      setForm({ flight_no: "", destination: "", time_str: "", is_emergency: false })
      onAfterSubmit?.()
    } catch (err: any) {
      setError(err.message || "Failed to add flight")
    } finally {
      setLoading(false)
    }
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
            <Input
              id="flight_no"
              placeholder="e.g., AI-203"
              value={form.flight_no}
              onChange={(e) => setForm((f) => ({ ...f, flight_no: e.target.value.toUpperCase() }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., JFK"
              value={form.destination}
              onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value.toUpperCase() }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time_str">Departure Time</Label>
            <Input
              id="time_str"
              type="time"
              value={form.time_str}
              onChange={(e) => setForm((f) => ({ ...f, time_str: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <Label htmlFor="emergency">Emergency</Label>
              <p className="text-sm text-muted-foreground">Prioritize this flight.</p>
            </div>
            <Switch
              id="emergency"
              checked={form.is_emergency}
              onCheckedChange={(v) => setForm((f) => ({ ...f, is_emergency: !!v }))}
            />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
            {loading ? "Adding..." : "Add Flight"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
