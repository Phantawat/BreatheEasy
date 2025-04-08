from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class SensorData(BaseModel):
    """
    SensorData is a model representing the data from a sensor.
    """
    id: Optional[int] = Field(None, description="Unique identifier for the sensor data")
    timestamp: datetime = Field(..., description="Timestamp when the data was recorded")
    temperature: float = Field(..., description="Temperature reading from the sensor")
    humidity: float = Field(..., description="Humidity reading from the sensor")
    pm25: float = Field(..., description="Pressure reading from the sensor")
    pm10: str = Field(..., description="Location where the sensor is deployed")
    latitude: float = Field(..., description="Latitude of the sensor location")
    longitude: float = Field(..., description="Longitude of the sensor location")

    class Config:
        orm_mode = True  # Enable ORM mode for compatibility with SQLAlchemy models
        schema_extra = {
            "example": {
                "id": 1,
                "timestamp": "2023-10-01T12:00:00Z",
                "temperature": 22.5,
                "humidity": 45.0,
                "pm25": 12.0,
                "pm10": 15.0,
                "latitude": 37.7749,
                "longitude": -122.4194
            }
        }