from pydantic import BaseModel, ConfigDict
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
    
    model_config = ConfigDict(from_attributes=True)