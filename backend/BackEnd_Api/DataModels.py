from pydantic import BaseModel

class add_flights(BaseModel):
    flight_no:str
    destination:str
    time_str:str
    is_emergency:bool
class cancel_flight(BaseModel):
    flight_no:str
class route_add(BaseModel):
    src:str
    dest:str
    distance:int
class route_find_data(BaseModel):
    src:str
    dest:str
class FlightResponse(BaseModel):
    flight_no:str
    destination:str
    status:str
    assigned_runway:str
    Emergency_flight:bool
    departure_time:str
class RunwayResponse(BaseModel):
    runway_no:int
    flight_no:str
