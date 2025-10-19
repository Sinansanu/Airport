export type Flight = {
  flight_no: string
  destination: string
  time_str: string
  is_emergency: boolean
  runway?: string | null
}

export type FlightsResponse = { data: Flight[] }
export type StatusResponse = { status: string }
export type CancelledResponse = { cancelled_list: string[] }

const fallbackBase = "http://localhost:8000"

export const API_BASE_URL =
  (typeof window !== "undefined" && (window as any).__API_BASE_URL__) ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  fallbackBase

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export const getFlights = () => apiFetch<FlightsResponse>("/flights/list_flights")
export const addFlight = (data: {
  flight_no: string
  destination: string
  time_str: string
  is_emergency: boolean
}) =>
  apiFetch<StatusResponse>("/flights/add_flight", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const cancelFlight = (data: { flight_no: string }) =>
  apiFetch<StatusResponse>("/flights/cancel_flight", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const getCancelled = () => apiFetch<CancelledResponse>("/flights/cancelled_list")

export const addRoute = (data: { src: string; dest: string; distance: number }) =>
  apiFetch<StatusResponse>("/route/add_route", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const assignRunway = () => apiFetch<StatusResponse>("/flights/assign_runway")
