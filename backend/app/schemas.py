from pydantic import BaseModel
from typing import Any, Dict, List

class TrafficProperties(BaseModel):
    id: int
    sensor_id: str
    current_speed: float
    congestion_level: str
    updated_at: str

class TrafficFeature(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: TrafficProperties

class TrafficFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[TrafficFeature]

class TransportProperties(BaseModel):
    vehicle_id: str
    route: str
    occupancy: int
    updated_at: str

class TransportFeature(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: TransportProperties

class TransportFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[TransportFeature]