from pydantic import BaseModel, ConfigDict
from datetime import datetime


class SensorData(BaseModel):
    """
    SensorData is a model representing the data from a sensor.
    """
    id: int
    ts: datetime
    temperature: float
    humidity: float
    pm25: int
    pm10: int
    latitude: float
    longitude: float
    room_id: int

    model_config = ConfigDict(from_attributes=True)
        