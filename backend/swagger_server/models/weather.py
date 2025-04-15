from pydantic import BaseModel
from datetime import datetime


class Weather(BaseModel):
    """
    Weather is a model representing the weather data from the OpenWeatherMap API.
    """
    id: int
    ts: datetime
    temperature: float
    humidity: float
    wind_speed: float
    
    class config:
        orm_mode = True