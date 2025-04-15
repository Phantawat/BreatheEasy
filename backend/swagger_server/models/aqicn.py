from pydantic import BaseModel
from datetime import datetime


class AQICN(BaseModel):
    """
    AQICN is a model representing the Air Quality Index (AQI) data from the AQICN API.
    """
    id: int
    ts: datetime
    pm25: float
    pm10: float
    aqi_score: int

    class Config:
        orm_mode = True  # Enable ORM mode for compatibility with SQLAlchemy models
