"""
Runway.py
Represents a runway that can be assigned to flights.
"""


class Runway:
    """Represents a runway that can be assigned to flights."""
    
    def __init__(self, runway_id):
        self.runway_id = runway_id
        self.is_available = True
        self.current_flight = None
        self.current_flight_name = ""
    
    def assign_flight(self, flight):
        """Assign a flight to this runway."""
        if self.is_available:
            self.current_flight = flight
            self.current_flight_name = flight.flight_number
            self.is_available = False
            return True
        return False
    
    def release_runway(self):
        """Release the runway and return the flight that was using it."""
        if not self.is_available:
            flight = self.current_flight
            self.current_flight = None
            self.is_available = True
            return flight
        return None
    
    def __str__(self):
        status = "Available" if self.is_available else f"Occupied by {self.current_flight.flight_number}"
        return f"Runway {self.runway_id}: {status}"
