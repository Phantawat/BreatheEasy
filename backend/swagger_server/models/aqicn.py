from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)