"use client"
import { useState } from "react"
import { Tabs } from "@/components/airport/tabs"
import { FlightsPanel } from "@/components/airport/flights-panel"
import { RunwaysPanel } from "@/components/airport/runways-panel"
import { CancellationsPanel } from "@/components/airport/cancellations-panel"
import { RoutesPanel } from "@/components/airport/routes-panel"
import { API_BASE_URL } from "@/lib/api"

export default function AirportPage() {
  const [tab, setTab] = useState<"flights" | "runways" | "cancellations" | "routes">("flights")

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Airport Management System</h1>
        <p className="text-muted-foreground mt-1">
          Backend: FastAPI at <span className="font-mono">{API_BASE_URL}</span>
        </p>
        <p className="text-muted-foreground">
          Tip: Set NEXT_PUBLIC_API_BASE_URL in Vars to point this UI at your FastAPI server.
        </p>
      </header>

      <section className="grid gap-6">
        <Tabs defaultTab="flights" onChange={setTab} />
        {tab === "flights" && <FlightsPanel />}
        {tab === "runways" && <RunwaysPanel />}
        {tab === "cancellations" && <CancellationsPanel />}
        {tab === "routes" && <RoutesPanel />}
      </section>
    </main>
  )
}
