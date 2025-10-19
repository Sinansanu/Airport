"use client"

import type React from "react"
import { createContext, useContext, useMemo, useReducer } from "react"

export type Flight = {
  flightNumber: string
  destination: string
  departureTime: string // ISO string
  emergency: boolean
  createdAt: number // insertion order for stability
}

type Runway = {
  id: number
  occupied: boolean
  flightNumber?: string
}

type Graph = Map<string, Set<string>>

type State = {
  flights: Flight[] // kept sorted by comparator to emulate a priority queue
  cancellations: Flight[] // stack (most recent at end)
  runways: Runway[]
  graph: Graph
  createdCounter: number
}

type Action =
  | { type: "ADD_FLIGHT"; payload: Omit<Flight, "createdAt"> }
  | { type: "CANCEL_FLIGHT"; payload: { flightNumber: string } }
  | { type: "UNDO_CANCEL" }
  | { type: "ASSIGN_NEXT" }
  | { type: "RELEASE_RUNWAY"; payload: { runwayId: number } }
  | { type: "ADD_AIRPORT"; payload: { code: string } }
  | { type: "ADD_ROUTE"; payload: { from: string; to: string } }

function cmp(a: Flight, b: Flight) {
  if (a.emergency !== b.emergency) return a.emergency ? -1 : 1
  const ta = new Date(a.departureTime).getTime()
  const tb = new Date(b.departureTime).getTime()
  if (ta !== tb) return ta - tb
  return a.createdAt - b.createdAt
}

function insertSorted(arr: Flight[], flight: Flight) {
  // Binary insert to maintain priority order
  let l = 0
  let r = arr.length
  while (l < r) {
    const m = (l + r) >> 1
    if (cmp(flight, arr[m]) < 0) r = m
    else l = m + 1
  }
  const next = arr.slice(0, l).concat(flight, arr.slice(l))
  return next
}

function cloneGraph(g: Graph): Graph {
  const next = new Map<string, Set<string>>()
  for (const [k, v] of g.entries()) {
    next.set(k, new Set(v))
  }
  return next
}

const initialState: State = {
  flights: [],
  cancellations: [],
  runways: Array.from({ length: 3 }, (_, i) => ({ id: i + 1, occupied: false })),
  graph: new Map(),
  createdCounter: 0,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_FLIGHT": {
      const { flightNumber, destination, departureTime, emergency } = action.payload
      const fn = String(flightNumber).trim().toUpperCase()
      if (!fn || !destination || !departureTime) {
        throw new Error("Missing required fields.")
      }
      // Prevent duplicates (scheduled or on runway)
      if (state.flights.some((f) => f.flightNumber === fn) || state.runways.some((r) => r.flightNumber === fn)) {
        throw new Error("A flight with this number already exists.")
      }
      const flight: Flight = {
        flightNumber: fn,
        destination: String(destination).trim(),
        departureTime: String(departureTime),
        emergency: !!emergency,
        createdAt: state.createdCounter,
      }
      return {
        ...state,
        flights: insertSorted(state.flights, flight),
        createdCounter: state.createdCounter + 1,
      }
    }
    case "CANCEL_FLIGHT": {
      const fn = String(action.payload.flightNumber).trim().toUpperCase()
      const idx = state.flights.findIndex((f) => f.flightNumber === fn)
      if (idx === -1) throw new Error("Flight not found in schedule.")
      const removed = state.flights[idx]
      const nextFlights = state.flights.slice(0, idx).concat(state.flights.slice(idx + 1))
      return { ...state, flights: nextFlights, cancellations: state.cancellations.concat(removed) }
    }
    case "UNDO_CANCEL": {
      if (state.cancellations.length === 0) throw new Error("No canceled flights to undo.")
      const flight = state.cancellations[state.cancellations.length - 1]
      const nextCanc = state.cancellations.slice(0, -1)
      return { ...state, cancellations: nextCanc, flights: insertSorted(state.flights, flight) }
    }
    case "ASSIGN_NEXT": {
      const runway = state.runways.find((r) => !r.occupied)
      if (!runway) throw new Error("No available runways.")
      if (state.flights.length === 0) throw new Error("No flights to assign.")
      const nextFlight = state.flights[0]
      const nextFlights = state.flights.slice(1)
      const nextRunways = state.runways.map((r) =>
        r.id === runway.id ? { ...r, occupied: true, flightNumber: nextFlight.flightNumber } : r,
      )
      return { ...state, flights: nextFlights, runways: nextRunways }
    }
    case "RELEASE_RUNWAY": {
      const id = Number(action.payload.runwayId)
      const idx = state.runways.findIndex((r) => r.id === id)
      if (idx === -1) throw new Error("Runway not found.")
      const nextRunways = state.runways.slice()
      nextRunways[idx] = { id, occupied: false }
      return { ...state, runways: nextRunways }
    }
    case "ADD_AIRPORT": {
      const code = String(action.payload.code).trim().toUpperCase()
      if (!code) throw new Error("Airport code required.")
      const g = cloneGraph(state.graph)
      if (!g.has(code)) g.set(code, new Set())
      return { ...state, graph: g }
    }
    case "ADD_ROUTE": {
      const a = String(action.payload.from).trim().toUpperCase()
      const b = String(action.payload.to).trim().toUpperCase()
      if (!a || !b) throw new Error("from and to required")
      if (a === b) throw new Error("Route must connect two different airports.")
      const g = cloneGraph(state.graph)
      if (!g.has(a)) g.set(a, new Set())
      if (!g.has(b)) g.set(b, new Set())
      g.get(a)!.add(b)
      g.get(b)!.add(a)
      return { ...state, graph: g }
    }
    default:
      return state
  }
}

type AirportContextValue = {
  state: State
  actions: {
    addFlight: (payload: Omit<Flight, "createdAt">) => { ok: true; message: string } | { ok: false; error: string }
    cancelFlight: (flightNumber: string) => { ok: true; message: string } | { ok: false; error: string }
    undoCancel: () => { ok: true; message: string } | { ok: false; error: string }
    assignNext: () => { ok: true; message: string } | { ok: false; error: string }
    releaseRunway: (runwayId: number) => { ok: true; message: string } | { ok: false; error: string }
    addAirport: (code: string) => { ok: true; message: string } | { ok: false; error: string }
    addRoute: (from: string, to: string) => { ok: true; message: string } | { ok: false; error: string }
  }
  utils: {
    listGraph: () => { airports: string[]; routes: { from: string; to: string }[] }
    isConnected: (from: string, to: string) => { connected: boolean; path: string[] }
    shortestRoute: (from: string, to: string) => { connected: boolean; path: string[] }
  }
}

const AirportContext = createContext<AirportContextValue | null>(null)

export function AirportProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const actions: AirportContextValue["actions"] = {
    addFlight: (payload) => {
      try {
        dispatch({ type: "ADD_FLIGHT", payload })
        return { ok: true, message: "Flight added successfully!" }
      } catch (e: any) {
        return { ok: false, error: e?.message || "Failed to add flight." }
      }
    },
    cancelFlight: (flightNumber) => {
      try {
        dispatch({ type: "CANCEL_FLIGHT", payload: { flightNumber } })
        return { ok: true, message: "Flight canceled." }
      } catch (e: any) {
        return { ok: false, error: e?.message || "Cancel failed." }
      }
    },
    undoCancel: () => {
      try {
        dispatch({ type: "UNDO_CANCEL" })
        return { ok: true, message: "Undo successful. Flight re-scheduled." }
      } catch (e: any) {
        return { ok: false, error: e?.message || "Nothing to undo." }
      }
    },
    assignNext: () => {
      try {
        dispatch({ type: "ASSIGN_NEXT" })
        return { ok: true, message: "Runway assigned." }
      } catch (e: any) {
        return { ok: false, error: e?.message || "Assignment failed." }
      }
    },
    releaseRunway: (runwayId) => {
      try {
        dispatch({ type: "RELEASE_RUNWAY", payload: { runwayId } })
        return { ok: true, message: `Runway ${runwayId} released.` }
      } catch (e: any) {
        return { ok: false, error: e?.message || "Release failed." }
      }
    },
    addAirport: (code) => {
      try {
        dispatch({ type: "ADD_AIRPORT", payload: { code } })
        return { ok: true, message: "Airport added." }
      } catch (e: any) {
        return { ok: false, error: e?.message || "Failed to add airport." }
      }
    },
    addRoute: (from, to) => {
      try {
        dispatch({ type: "ADD_ROUTE", payload: { from, to } })
        return { ok: true, message: "Route added." }
      } catch (e: any) {
        return { ok: false, error: e?.message || "Failed to add route." }
      }
    },
  }

  const utils: AirportContextValue["utils"] = useMemo(() => {
    function listGraph() {
      const airports = Array.from(state.graph.keys())
      const routes: Array<{ from: string; to: string }> = []
      for (const [k, set] of state.graph.entries()) {
        for (const v of set) {
          if (k < v) routes.push({ from: k, to: v })
        }
      }
      return { airports, routes }
    }

    function isConnected(from: string, to: string) {
      const s = String(from || "")
        .trim()
        .toUpperCase()
      const t = String(to || "")
        .trim()
        .toUpperCase()
      if (!state.graph.has(s) || !state.graph.has(t)) return { connected: false, path: [] as string[] }

      const visited = new Set<string>([s])
      const parent = new Map<string, string | null>([[s, null]])
      const queue: string[] = [s]
      while (queue.length) {
        const u = queue.shift()!
        if (u === t) break
        for (const v of state.graph.get(u) ?? []) {
          if (!visited.has(v)) {
            visited.add(v)
            parent.set(v, u)
            queue.push(v)
          }
        }
      }
      if (!visited.has(t)) return { connected: false, path: [] as string[] }
      const path: string[] = []
      let cur: string | null = t
      while (cur) {
        path.push(cur)
        cur = parent.get(cur) ?? null
      }
      path.reverse()
      return { connected: true, path }
    }

    function shortestRoute(from: string, to: string) {
      // For an unweighted graph, BFS path = shortest
      return isConnected(from, to)
    }

    return { listGraph, isConnected, shortestRoute }
  }, [state.graph])

  const value = useMemo<AirportContextValue>(() => ({ state, actions, utils }), [state, utils])

  return <AirportContext.Provider value={value}>{children}</AirportContext.Provider>
}

export function useAirport() {
  const ctx = useContext(AirportContext)
  if (!ctx) throw new Error("useAirport must be used within AirportProvider")
  return ctx
}
