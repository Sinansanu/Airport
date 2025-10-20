"use client"
import useSWR from "swr"
import { getCancelled, type CancelledResponse } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CancellationsPanel() {
  const { data, error, isLoading } = useSWR<CancelledResponse>("/flights/cancelled_list", getCancelled)

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-pretty">Cancelled Flights</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Loading cancelled flights...</p>}
        {error && <p className="text-destructive">Failed to load cancellations.</p>}
        {!isLoading && !error && (
          <ul className="list-disc pl-5 space-y-1">
            {data?.cancelled_list?.length ? (
              data.cancelled_list.map((f) => <li key={f}>{f}</li>)
            ) : (
              <li className="text-muted-foreground">No cancelled flights.</li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
