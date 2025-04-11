from pydantic import BaseModel


class Weather(BaseModel):
    """
    Weather is a model representing the weather data from the OpenWeatherMap API.
    """
    id: int
    ts: str
    temperature: float
    humidity: float
    wind_speed: float
    
    class config:
        orm_mode = True