from AirportManagementSystem import AirportManagementSystem
from datetime import datetime, timedelta

def main():
    ams = AirportManagementSystem()

    print("\n--- Adding Flights ---")
    # Add flights: mix of normal and emergency
    flights = [
        ("AA101", "LAX", "23:00", False),   # Normal
        ("BA202", "LHR", "08:00", False),   # Normal
        ("DL303", "SFO", "10:30", False),   # Normal
        ("EM404", "CDG", "22:45", True),    # Emergency
        ("EM505", "NRT", "21:15", True),    # Emergency
        ("EM606", "FRA", "22:00", True)     # Emergency
    ]

    for number, dest, time_str, emergency in flights:
        ams.add_flight(number, dest, time_str, emergency)

    print("\n--- Scheduling Flights ---")
    ams.schedule_flights()

    # At this point, scheduled flights are in priority order:
    # Emergencies first, sorted by departure time:
    # EM505, EM606, EM404, then normal flights sorted by departure time: AA101, BA202, DL303

    print("\n--- Allocating Runways ---")
    ams.allocate_runways()
    # Only 3 runways exist, so the first 3 flights in the scheduled list (highest priority):
    # EM505 → Runway 1
    # EM606 → Runway 2
    # EM404 → Runway 3
    # The remaining normal flights (AA101, BA202, DL303) will wait in scheduled_flights

    print("\n--- Show System Status (Interactive) ---")
    ams.show_status()

    print("\n--- Trying to Allocate Again (All runways may be full) ---")
    ams.allocate_runways()
    # Should show a message: all runways occupied and next available time

    print("\n--- Cancel a Flight ---")
    ams.cancel_flight("EM606")
    ams.show_status()
    # Runway 2 is now free, next flight AA101 will be assigned there automatically if allocate_runways is called

    print("\n--- Allocate Remaining Flights ---")
    ams.allocate_runways()  # Allocate remaining flights to free runways

    print("\n--- Final System Status ---")
    ams.show_status()

if __name__ == "__main__":
    main()
