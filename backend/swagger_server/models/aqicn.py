from pydantic import BaseModel


class AQICN(BaseModel):
    """
    AQICN is a model representing the Air Quality Index (AQI) data from the AQICN API.
    """
    id: int
    ts: str
    pm25: float
    pm10: float
    aqi_score: int

    class Config:
        orm_mode = True  # Enable ORM mode for compatibility with SQLAlchemy models
