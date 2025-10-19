import heapq
from datetime import datetime, timedelta
from Flight import Flight
from Runway import Runway

# Minimal AirportGraph placeholder
class AirportGraph:
    def __init__(self):
        self.graph = {}
    def add_route(self, src, dest, dist):
        self.graph[src] = self.graph.get(src, []) + [(dest, dist)]
    def find_shortest_route(self, start, destination):
        # Simple placeholder; returns dummy path and distance
        if start in self.graph:
            return [start, destination], 10
        return None, 0

class AirportManagementSystem:
    """Manages flights, runways, cancellations, and routes."""

    def __init__(self):
        self.flight_queue = []
        self.scheduled_flights = []
        self.runways = [Runway(i+1) for i in range(3)]
        self.canceled_flights = []
        self.airport_graph = AirportGraph()
        self._add_sample_routes()
        self.history = []

    # ---------------- ROUTES ----------------
    def _add_sample_routes(self):
        routes = [
            ("JFK", "LAX", 5),
            ("JFK", "LHR", 7),
            ("LAX", "SFO", 1),
            ("LHR", "CDG", 1),
            ("SFO", "NRT", 10),
            ("CDG", "FRA", 1)
        ]
        for src, dst, dist in routes:
            self.airport_graph.add_route(src, dst, dist)

    def add_route(self, src, dest, distance):
        self.airport_graph.add_route(src, dest, distance)

    def find_route(self, start, destination):
        path, dist = self.airport_graph.find_shortest_route(start, destination)
        if path:
            print(f"Route: {' → '.join(path)} (Distance: {dist})")
        else:
            print("No route found.")

    # ---------------- FLIGHTS ----------------
    def add_flight(self, number, destination, time_str, emergency=False):
        try:
            hour, minute = map(int, time_str.split(":"))
            now = datetime.now()
            departure_time = datetime(year=now.year, month=now.month, day=now.day, hour=hour, minute=minute)
            if departure_time <= now:
                departure_time += timedelta(days=1)
            flight = Flight(number, destination, departure_time, emergency)
            self.history.append(flight)
            heapq.heappush(self.flight_queue, flight)
            print(f"Added: {flight}")
            if destination not in self.airport_graph.graph:
                self.airport_graph.add_route("JFK", destination, 5)
        except ValueError:
            print("Invalid time format! Use HH:MM")

    def schedule_flights(self):
        if not self.flight_queue:
            print("No flights to schedule.")
            return
        while self.flight_queue:
            self.scheduled_flights.append(heapq.heappop(self.flight_queue))
        print(f"Scheduled {len(self.scheduled_flights)} flights.")

    # ---------------- RUNWAYS ----------------
    def _clear_departed_flights(self):
        now = datetime.now()
        for runway in self.runways:
            if not runway.is_available and runway.current_flight.departure_time <= now:
                print(f"Flight {runway.current_flight.flight_number} has departed. Clearing {runway}.")
                runway.release_runway()

    def _next_available_time(self):
        now = datetime.now()
        remaining_times = [
            (r.current_flight.departure_time - now).total_seconds() / 60
            for r in self.runways
            if not r.is_available and r.current_flight.departure_time > now
        ]
        return min(remaining_times) if remaining_times else 0

    def allocate_runways(self):
        self._clear_departed_flights()
        if all(not r.is_available for r in self.runways):
            wait_minutes = round(self._next_available_time(), 2)
            print(f"⚠️ All runways are currently occupied. Next available in ~{wait_minutes} minutes.")
            return
        if not self.scheduled_flights:
            print("No flights waiting for runways.")
            return
        for flight in self.scheduled_flights[:]:
            for runway in self.runways:
                if runway.is_available and runway.assign_flight(flight):
                    flight.status = 'Runway Assigned'
                    flight.assigned_runway = runway
                    flight.assigned_runway_no = runway.runway_id
                    print(f"{flight.flight_number} → {runway}")
                    self.scheduled_flights.remove(flight)
                    break
        self._show_runways()

    def _show_runways(self):
        print("\nRunway Status:")
        for r in self.runways:
            print(" ", r)

    # ---------------- CANCELLATIONS ----------------
    def cancel_flight(self, number):
        for f in self.scheduled_flights:
            if f.flight_number == number:
                f.status = 'Cancelled'
                self.scheduled_flights.remove(f)
                self.canceled_flights.append(f)
                print(f"Canceled: {number}")
                return
        for r in self.runways:
            if not r.is_available and r.current_flight.flight_number == number:
                f = r.release_runway()
                self.canceled_flights.append(f)
                print(f"Canceled from runway: {number}")
                return
        print("Flight not found.")

    def undo_cancellation(self):
        if self.canceled_flights:
            f = self.canceled_flights.pop()
            self.scheduled_flights.append(f)
            print(f"Restored: {f}")
        else:
            print("No canceled flights to restore.")

    # ---------------- STATUS ----------------
    def show_status(self):
        """Show system summary and optionally detailed lists."""
        print("\n=== Airport System Status ===")
        print(f" Scheduled flights: {len(self.scheduled_flights)}")
        print(f" Canceled flights: {len(self.canceled_flights)}")
        print(f" Free runways: {sum(r.is_available for r in self.runways)}")

        while True:
            print("\nDo you want to see details? Options:")
            print("  1 - Scheduled flights")
            print("  2 - Canceled flights")
            print("  3 - Runway status")
            print("  0 - Exit details")
            choice = input("Enter choice (0-3): ").strip()

            if choice == "1":
                if self.scheduled_flights:
                    print("\nScheduled Flights:")
                    for f in self.scheduled_flights:
                        print(" -", f)
                else:
                    print("No scheduled flights.")
            elif choice == "2":
                if self.canceled_flights:
                    print("\nCanceled Flights:")
                    for f in self.canceled_flights:
                        print(" -", f)
                else:
                    print("No canceled flights.")
            elif choice == "3":
                print("\nRunway Status:")
                for r in self.runways:
                    print(" -", r)
            elif choice == "0":
                break
            else:
                print("Invalid choice. Please enter 0, 1, 2, or 3.")

    def show_status_list(self):
        return {
            'scheduled flights': self.scheduled_flights,
            'cancelled flights': self.canceled_flights,
            'runways': self.runways
        }

    def get_scheduled_flights(self):
        return self.scheduled_flights
