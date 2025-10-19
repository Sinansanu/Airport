"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { AirportProvider, useAirport } from "@/lib/client-airport-store"

function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-4 py-6">{children}</div>
}

type Flight = {
  flightNumber: string
  destination: string
  departureTime: string
  emergency: boolean
  createdAt: number
}

function NavbarTabs({
  active,
  onChange,
}: {
  active: string
  onChange: (tab: string) => void
}) {
  const tabs = ["Flights", "Runways", "Routes", "Cancellations"]
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <h1 className="text-lg font-semibold text-primary">Airport Management</h1>
        <nav className="flex gap-2">
          {tabs.map((t) => (
            <Button key={t} variant={active === t ? "default" : "secondary"} onClick={() => onChange(t)}>
              {t}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}

function FlightsTab() {
  const {
    state: { flights },
    actions,
  } = useAirport()

  const [form, setForm] = useState({
    flightNumber: "",
    destination: "",
    departureTime: "",
    emergency: false,
  })
  const [msg, setMsg] = useState<string>("")

  async function addFlight(e: React.FormEvent) {
    e.preventDefault()
    setMsg("")
    const res = actions.addFlight(form)
    if (res.ok) {
      setMsg(res.message)
      setForm({ flightNumber: "", destination: "", departureTime: "", emergency: false })
    } else {
      setMsg(res.error)
    }
  }

  async function cancelFlight(flightNumber: string) {
    setMsg("")
    const res = actions.cancelFlight(flightNumber)
    setMsg(res.ok ? res.message : res.error)
  }

  return (
    <SectionContainer>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Add Flight</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addFlight} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fn">Flight Number</Label>
                <Input
                  id="fn"
                  value={form.flightNumber}
                  onChange={(e) => setForm((f) => ({ ...f, flightNumber: e.target.value.toUpperCase() }))}
                  placeholder="e.g., AI302"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dest">Destination</Label>
                <Input
                  id="dest"
                  value={form.destination}
                  onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                  placeholder="e.g., New Delhi"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dt">Departure Time</Label>
                <Input
                  id="dt"
                  type="datetime-local"
                  value={form.departureTime}
                  onChange={(e) => setForm((f) => ({ ...f, departureTime: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="emg"
                  type="checkbox"
                  checked={form.emergency}
                  onChange={(e) => setForm((f) => ({ ...f, emergency: e.target.checked }))}
                />
                <Label htmlFor="emg">Emergency</Label>
              </div>
              <Button type="submit">Add Flight</Button>
            </form>
            {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Scheduled Flights (Takeoff Order)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flight</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(flights ?? []).map((f: Flight) => (
                    <TableRow key={f.flightNumber}>
                      <TableCell className="font-medium">{f.flightNumber}</TableCell>
                      <TableCell>{f.destination}</TableCell>
                      <TableCell>{new Date(f.departureTime).toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-xs",
                            f.emergency
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          {f.emergency ? "Emergency" : "Normal"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" onClick={() => cancelFlight(f.flightNumber)}>
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!flights || flights.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No flights scheduled.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}

function RunwaysTab() {
  const {
    state: { runways },
    actions,
  } = useAirport()
  const [msg, setMsg] = useState("")

  async function assign() {
    setMsg("")
    const res = actions.assignNext()
    setMsg(res.ok ? res.message : res.error)
  }

  async function release(id: number) {
    setMsg("")
    const res = actions.releaseRunway(id)
    setMsg(res.ok ? res.message : res.error)
  }

  return (
    <SectionContainer>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Runway Allocation</h2>
        <Button onClick={assign}>Assign Next Flight</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {(runways ?? []).map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle>Runway {r.id}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                {r.occupied ? (
                  <p>
                    <span className="font-medium">Occupied</span> by Flight {r.flightNumber}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Available</p>
                )}
              </div>
              {r.occupied ? (
                <Button variant="secondary" onClick={() => release(r.id)}>
                  Release
                </Button>
              ) : (
                <div className="text-xs text-muted-foreground">Waiting...</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {msg && <p className="mt-4 text-sm text-muted-foreground">{msg}</p>}
    </SectionContainer>
  )
}

function RoutesTab() {
  const {
    state: { graph },
    actions,
    utils,
  } = useAirport()
  const [airport, setAirport] = useState("")
  const [edge, setEdge] = useState({ from: "", to: "" })
  const [check, setCheck] = useState({ from: "", to: "" })
  const [shortest, setShortest] = useState({ from: "", to: "" })
  const [msg, setMsg] = useState("")

  const graphData = utils.listGraph()

  async function addAirport() {
    setMsg("")
    const res = actions.addAirport(airport)
    setMsg(res.ok ? res.message : res.error)
    if (res.ok) setAirport("")
  }

  async function addEdge() {
    setMsg("")
    const res = actions.addRoute(edge.from, edge.to)
    setMsg(res.ok ? res.message : res.error)
    if (res.ok) setEdge({ from: "", to: "" })
  }

  async function checkConn() {
    setMsg("")
    const res = utils.isConnected(check.from, check.to)
    setMsg(res.connected ? `Connected via ${res.path.join(" → ")}` : "Not connected.")
  }

  async function shortestPath() {
    setMsg("")
    const res = utils.shortestRoute(shortest.from, shortest.to)
    setMsg(res.connected ? `Shortest path: ${res.path.join(" → ")}` : "No route found.")
  }

  return (
    <SectionContainer>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Airport</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="airport">Airport Code</Label>
              <Input
                id="airport"
                value={airport}
                onChange={(e) => setAirport(e.target.value.toUpperCase())}
                placeholder="e.g., SFO"
              />
            </div>
            <Button onClick={addAirport}>Add Airport</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Route</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                value={edge.from}
                onChange={(e) => setEdge((s) => ({ ...s, from: e.target.value.toUpperCase() }))}
                placeholder="e.g., SFO"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={edge.to}
                onChange={(e) => setEdge((s) => ({ ...s, to: e.target.value.toUpperCase() }))}
                placeholder="e.g., LAX"
              />
            </div>
            <Button onClick={addEdge}>Add Route</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connectivity</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>From</Label>
              <Input
                value={check.from}
                onChange={(e) => setCheck((s) => ({ ...s, from: e.target.value.toUpperCase() }))}
                placeholder="e.g., SFO"
              />
            </div>
            <div className="grid gap-2">
              <Label>To</Label>
              <Input
                value={check.to}
                onChange={(e) => setCheck((s) => ({ ...s, to: e.target.value.toUpperCase() }))}
                placeholder="e.g., JFK"
              />
            </div>
            <Button onClick={checkConn}>Check Connectivity</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shortest Route</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>From</Label>
              <Input
                value={shortest.from}
                onChange={(e) => setShortest((s) => ({ ...s, from: e.target.value.toUpperCase() }))}
                placeholder="e.g., SFO"
              />
            </div>
            <div className="grid gap-2">
              <Label>To</Label>
              <Input
                value={shortest.to}
                onChange={(e) => setShortest((s) => ({ ...s, to: e.target.value.toUpperCase() }))}
                placeholder="e.g., BOS"
              />
            </div>
            <Button onClick={shortestPath}>Find Shortest Path</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Airports</h3>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {(graphData.airports ?? []).map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                  {(!graphData.airports || graphData.airports.length === 0) && (
                    <p className="text-sm text-muted-foreground">No airports yet.</p>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium">Routes</h3>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {(graphData.routes ?? []).map((r, i) => (
                    <li key={`${r.from}-${r.to}-${i}`}>
                      {r.from} ↔ {r.to}
                    </li>
                  ))}
                  {(!graphData.routes || graphData.routes.length === 0) && (
                    <p className="text-sm text-muted-foreground">No routes yet.</p>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {msg && <p className="mt-4 text-sm text-muted-foreground">{msg}</p>}
    </SectionContainer>
  )
}

function CancellationsTab() {
  const {
    state: { cancellations },
    actions,
  } = useAirport()
  const [msg, setMsg] = useState("")

  async function undo() {
    setMsg("")
    const res = actions.undoCancel()
    setMsg(res.ok ? res.message : res.error)
  }

  return (
    <SectionContainer>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cancellations (Stack)</h2>
        <Button onClick={undo}>Undo Last Cancel</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Cancellations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flight</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(cancellations ?? []).map((f) => (
                  <TableRow key={`${f.flightNumber}-${f.createdAt}`}>
                    <TableCell className="font-medium">{f.flightNumber}</TableCell>
                    <TableCell>{f.destination}</TableCell>
                    <TableCell>{new Date(f.departureTime).toLocaleString()}</TableCell>
                    <TableCell>{f.emergency ? "Emergency" : "Normal"}</TableCell>
                  </TableRow>
                ))}
                {(!cancellations || cancellations.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No cancellations.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
    </SectionContainer>
  )
}

export default function Page() {
  const [tab, setTab] = useState("Flights")
  return (
    <AirportProvider>
      <main>
        <NavbarTabs active={tab} onChange={setTab} />
        {tab === "Flights" && <FlightsTab />}
        {tab === "Runways" && <RunwaysTab />}
        {tab === "Routes" && <RoutesTab />}
        {tab === "Cancellations" && <CancellationsTab />}
      </main>
    </AirportProvider>
  )
}
