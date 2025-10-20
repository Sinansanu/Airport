"""
Flight.py
Represents a flight with priority and departure time.
"""

from datetime import datetime


class Flight:
    """Represents a flight with priority and departure time."""
    
    def __init__(self, flight_number, destination, departure_time, is_emergency=False,status='Waiting for assigning'):
        self.flight_number = flight_number
        self.status = status
        self.destination = destination
        self.departure_time = departure_time
        self.is_emergency = is_emergency
        self.assigned_runway_no = None
        self.assigned_runway = None
        self.priority = 1 if is_emergency else 2  # Lower number = higher priority
    
    def __lt__(self, other):
        """For priority queue ordering: (priority, departure_time)"""
        if self.priority != other.priority:
            return self.priority < other.priority
        return self.departure_time < other.departure_time
    
    def __str__(self):
        emergency_status = "EMERGENCY" if self.is_emergency else "Normal"
        return f"{self.flight_number} → {self.destination} ({emergency_status}) - {self.departure_time.strftime('%H:%M')}"
