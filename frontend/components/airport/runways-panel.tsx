"use client"
import { assignRunway } from "@/lib/api"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const flightsKey = "/flights/list_scheduled_flights"

export function RunwaysPanel() {
  async function onAssign() {
    await assignRunway()
    await mutate(flightsKey)
  }
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-pretty">Runway Allocation</CardTitle>
        <CardDescription>Allocate runways to scheduled flights.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-muted-foreground">
          Click the button below to request runway allocation from the backend. You can also find the same button in the
          Flights tab.
        </p>
        <div>
          <Button onClick={onAssign} className="bg-primary text-primary-foreground">
            Assign Runways
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
