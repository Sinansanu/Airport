# Airport Management System

A simple Python project that demonstrates the use of Data Structures and Algorithms (DSA) in a real-world scenario. This system simulates airport operations using various data structures and algorithms.

## 🎯 Features

### 1. Flight Scheduling
- **Data Structure**: Priority Queue (using `heapq`)
- **Algorithm**: Priority-based scheduling
- Emergency flights (priority = 1) always come before normal flights (priority = 2)
- Flights are sorted by departure time within the same priority level

### 2. Runway Allocation
- **Data Structure**: Priority Queue for runway assignment
- **Functionality**: Automatically assigns available runways to waiting flights
- Supports multiple runways (default: 3 runways)

### 3. Airport Routes
- **Data Structure**: Graph (Adjacency List)
- **Algorithm**: Dijkstra's Algorithm for shortest path finding
- Automatically adds routes when flights are added
- Finds shortest routes between any two airports
- Returns "No connection available" if no route exists

### 4. Flight Cancellation Log
- **Data Structure**: Stack (Python list)
- **Functionality**: 
  - Stores canceled flights in LIFO order
  - Supports "Undo last cancellation" feature
  - Can cancel flights from both scheduled list and active runways

### 5. Menu-Driven Interface
- Interactive CLI with 8 options:
  1. Add Flight
  2. Schedule Flights
  3. Allocate Runway
  4. Find Route Between Airports
  5. Cancel Flight
  6. Undo Last Cancellation
  7. Display System Status
  8. Exit

## 🏗️ System Architecture

### Modular Design
The system is organized into separate files for better maintainability and modularity:

- **`Flight.py`**: Contains the `Flight` class
- **`Runway.py`**: Contains the `Runway` class  
- **`AirportGraph.py`**: Contains the `AirportGraph` class with Dijkstra's algorithm
- **`AirportManagementSystem.py`**: Main system class that coordinates all operations
- **`main.py`**: Interactive menu interface
- **`demo.py`**: Demonstration script

### Classes

#### `Flight` (Flight.py)
- Represents a flight with flight number, destination, departure time, and emergency status
- Implements `__lt__` method for priority queue ordering
- Priority: Emergency flights (1) > Normal flights (2)

#### `Runway` (Runway.py)
- Manages individual runway operations
- Tracks availability and current flight assignment
- Supports flight assignment and release operations

#### `AirportGraph` (AirportGraph.py)
- Implements graph using adjacency list (`defaultdict(list)`)
- Uses Dijkstra's algorithm for shortest path finding
- Supports bidirectional routes between airports

#### `AirportManagementSystem` (AirportManagementSystem.py)
- Main system class that coordinates all operations
- Manages priority queues, runways, and cancellation stack
- Provides the main interface for all airport operations

## 🚀 How to Run

### Interactive Mode
```bash
python main.py
```

### Demo Mode
```bash
python demo.py
```

## 📊 Data Structures Used

1. **Priority Queue (heapq)**: 
   - Flight scheduling based on priority and time
   - Runway allocation queue

2. **Graph (Adjacency List)**:
   - Airport connections and routes
   - Efficient neighbor lookup

3. **Stack (Python list)**:
   - Flight cancellation log
   - LIFO order for undo operations

4. **Dictionary (defaultdict)**:
   - Graph representation
   - Efficient key-value lookups

## 🔧 Algorithms Implemented

1. **Dijkstra's Algorithm**:
   - Finds shortest path between airports
   - Uses priority queue for efficient implementation
   - Time Complexity: O((V + E) log V)

2. **Priority Queue Operations**:
   - Flight scheduling based on multiple criteria
   - Runway allocation optimization

3. **Graph Traversal**:
   - Path finding between airports
   - Route optimization

## 📝 Sample Usage

### Adding Flights
```
Flight Number: AA101
Destination: LAX
Departure Time: 08:30
Emergency: No
```

### Finding Routes
```
Start Airport: JFK
Destination: NRT
Result: JFK → LAX → SFO → NRT (Distance: 16)
```

### Emergency Flight Priority
- Emergency flights are always scheduled first
- Example: EM201 (Emergency) will be scheduled before AA101 (Normal) even if AA101 has an earlier time

## 🎓 Educational Value

This project demonstrates:
- **Object-Oriented Programming**: Clean class design and encapsulation
- **Data Structure Selection**: Choosing appropriate DS for each problem
- **Algorithm Implementation**: Dijkstra's algorithm and priority queues
- **System Design**: Modular architecture with clear separation of concerns
- **User Interface**: Menu-driven CLI for user interaction

## 🔍 Code Quality

- **Readable**: Clean, well-commented code suitable for learning
- **Modular**: Each class has a single responsibility
- **Extensible**: Easy to add new features or modify existing ones
- **Error Handling**: Basic input validation and error messages
- **Documentation**: Comprehensive docstrings and comments

## 📁 File Structure

```
Airport-Runway-Scheduler/
├── Flight.py                    # Flight class implementation
├── Runway.py                    # Runway class implementation
├── AirportGraph.py              # Graph and Dijkstra's algorithm
├── AirportManagementSystem.py   # Main system class
├── main.py                      # Interactive menu interface
├── demo.py                      # Demo script
├── __init__.py                  # Package initialization
├── requirements.txt             # Dependencies (core Python only)
└── README_Airport_Management.md # This documentation
```

## 🎯 Learning Outcomes

After studying this code, students will understand:
1. How to implement priority queues using `heapq`
2. Graph representation using adjacency lists
3. Dijkstra's algorithm implementation
4. Stack operations for undo functionality
5. Object-oriented design principles
6. Menu-driven program structure
7. Real-world application of DSA concepts

This project serves as an excellent example of how theoretical data structures and algorithms can be applied to solve practical problems in a clean, understandable way.
