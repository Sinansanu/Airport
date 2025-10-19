"use client"
import { AddFlightForm } from "./add-flight-form"
import { CancelFlightForm } from "./cancel-flight-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FlightsPanel() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <AddFlightForm />
        <CancelFlightForm />
      </div>

      <Card className="bg-card text-card-foreground">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-pretty">Scheduled Flights</CardTitle>
          <Button className="bg-primary text-primary-foreground">Assign Runways</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Flight No</th>
                  <th className="text-left px-3 py-2">Destination</th>
                  <th className="text-left px-3 py-2">Time</th>
                  <th className="text-left px-3 py-2">Emergency</th>
                  <th className="text-left px-3 py-2">Runway</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                    No flights yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
