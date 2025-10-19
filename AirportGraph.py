"""
AirportGraph.py
Graph representation of airport connections using adjacency list.
"""

import heapq
from collections import defaultdict


class AirportGraph:
    """Graph representation of airport connections using adjacency list."""
    
    def __init__(self):
        self.graph = defaultdict(list)  # airport -> [(neighbor, distance), ...]
    
    def add_route(self, source, destination, distance=1):
        """Add a bidirectional route between two airports."""
        self.graph[source].append((destination, distance))
        self.graph[destination].append((source, distance))
        print(f"✓ Route added: {source} ↔ {destination} (distance: {distance})")
    
    def find_shortest_route(self, start, destination):
        """Find shortest route using Dijkstra's algorithm."""
        if start not in self.graph or destination not in self.graph:
            return None, float('inf')
        
        # Dijkstra's algorithm
        distances = {airport: float('inf') for airport in self.graph}
        distances[start] = 0
        previous = {}
        heap = [(0, start)]
        
        while heap:
            current_distance, current_airport = heapq.heappop(heap)
            
            if current_airport == destination:
                # Reconstruct path
                path = []
                while current_airport is not None:
                    path.append(current_airport)
                    current_airport = previous.get(current_airport)
                path.reverse()
                return path, current_distance
            
            if current_distance > distances[current_airport]:
                continue
            
            for neighbor, weight in self.graph[current_airport]:
                distance = current_distance + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous[neighbor] = current_airport
                    heapq.heappush(heap, (distance, neighbor))
        
        return None, float('inf')  # No path found
