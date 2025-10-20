"use client"
import useSWR from "swr"
import { AddFlightForm } from "./add-flight-form"
import { CancelFlightForm } from "./cancel-flight-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { assignRunway, getFlights, type FlightsResponse } from "@/lib/api"

export function FlightsPanel() {
  const key = "/flights/list_scheduled_flights"
  const { data, error, isLoading, mutate } = useSWR<FlightsResponse>(key, getFlights)

  async function onAssign() {
    await assignRunway()
    await mutate()
  }

  const rows = data?.data ?? []

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <AddFlightForm onAfterSubmit={() => mutate()} />
        <CancelFlightForm onAfterSubmit={() => mutate()} />
      </div>

      <Card className="bg-card text-card-foreground">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-pretty">Scheduled Flights</CardTitle>
          <Button onClick={onAssign} className="bg-primary text-primary-foreground">
            Assign Runways
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading flights...</p>}
          {error && <p className="text-destructive">Failed to load flights.</p>}
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="text-left px-3 py-2">Flight No</th>
                    <th className="text-left px-3 py-2">Destination</th>
                    <th className="text-left px-3 py-2">Departure</th>
                    <th className="text-left px-3 py-2">Emergency</th>
                    <th className="text-left px-3 py-2">Runway</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                        No flights yet.
                      </td>
                    </tr>
                  )}
                  {rows.map((f) => (
                    <tr key={f.flight_number}>
                      <td className="px-3 py-2">{f.flight_number}</td>
                      <td className="px-3 py-2">{f.destination}</td>
                      <td className="px-3 py-2">{new Date(f.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-3 py-2">{f.is_emergency ? "Yes" : "No"}</td>
                      <td className="px-3 py-2">{f.assigned_runway_no ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
