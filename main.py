from AirportManagementSystem import AirportManagementSystem
from datetime import datetime, timedelta

def main():
    """Main function with menu-driven interface."""
    system = AirportManagementSystem()
    
    print("🛫 Welcome to Airport Management System")
    print("=" * 50)
    
    while True:
        print("\n--- Menu ---")
        print("1. Add Flight")
        print("2. Schedule Flights")
        print("3. Allocate Runway")
        print("4. Find Route Between Airports")
        print("5. Cancel Flight")
        print("6. Undo Last Cancellation")
        print("7. Display System Status")
        print("8. Exit")
        
        choice = input("\nEnter your choice (1-8): ").strip()
        
        if choice == "1":
            flight_number = input("Enter flight number: ").strip()
            destination = input("Enter destination airport: ").strip().upper()
            departure_time = input("Enter departure time (HH:MM): ").strip()
            is_emergency = input("Is this an emergency flight? (y/n): ").strip().lower() == 'y'
            system.add_flight(flight_number, destination, departure_time, is_emergency)
        
        elif choice == "2":
            system.schedule_flights()
        
        elif choice == "3":
            system.allocate_runways()
        
        elif choice == "4":
            start = input("Enter starting airport: ").strip().upper()
            destination = input("Enter destination airport: ").strip().upper()
            system.find_route(start, destination)
        
        elif choice == "5":
            flight_number = input("Enter flight number to cancel: ").strip()
            system.cancel_flight(flight_number)
        
        elif choice == "6":
            system.undo_cancellation()
        
        elif choice == "7":
            system.show_status()
        
        elif choice == "8":
            print("Thank you for using Airport Management System! ✈️")
            break
        
        else:
            print("❌ Invalid choice. Please enter 1-8.")


if __name__ == "__main__":
    main()
