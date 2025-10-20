"use client"
import { useState } from "react"
import type React from "react"

import { addRoute } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RoutesPanel() {
  const [src, setSrc] = useState("")
  const [dest, setDest] = useState("")
  const [distance, setDistance] = useState<number | "">("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setLoading(true)
    try {
      await addRoute({
        src: src.trim(),
        dest: dest.trim(),
        distance: Number(distance),
      })
      setMessage("Route added successfully.")
      setSrc("")
      setDest("")
      setDistance("")
    } catch (err: any) {
      setError(err.message || "Failed to add route")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-pretty">Add Route</CardTitle>
        <CardDescription>Define a new route between airports.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="src">Source</Label>
              <Input id="src" placeholder="e.g., DEL" value={src} onChange={(e) => setSrc(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dest">Destination</Label>
              <Input
                id="dest"
                placeholder="e.g., BOM"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2 md:max-w-xs">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              min={0}
              placeholder="e.g., 1400"
              value={distance}
              onChange={(e) => setDistance(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
            {loading ? "Adding..." : "Add Route"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
