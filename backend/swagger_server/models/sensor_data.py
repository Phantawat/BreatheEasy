from pydantic import BaseModel
from datetime import datetime


class SensorData(BaseModel):
    """
    SensorData is a model representing the data from a sensor.
    """
    id: int
    timestamp: datetime
    temperature: float
    humidity: float
    pm25: int
    pm10: int
    latitude: float
    longitude: float

    class Config:
        orm_mode = True  # Enable ORM mode for compatibility with SQLAlchemy models
        