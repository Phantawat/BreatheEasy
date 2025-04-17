from ..database.connection import execute_query
from ..models.weather import Weather


def get_all_weather_data():
    """
    Fetch all weather data from the database.
    """
    query = "SELECT * FROM project_weather"
    result = execute_query(query)
    
    # Convert result to list of Weather models
    weather_data = [Weather(**row) for row in result]
    
    return weather_data

def get_weather_data_by_id(weather_id: int):
    """
    Fetch weather data by ID from the database.
    """
    query = "SELECT * FROM project_weather WHERE id = %s"
    result = execute_query(query, (weather_id,))
    
    if not result:
        return None
    
    # Convert result to Weather model
    weather_data = Weather(**result[0])
    
    return weather_data

def get_weather_data_by_date(date: str):
    """
    Fetch weather data by date from the database.
    """
    query = "SELECT * FROM project_weather WHERE DATE(ts) = %s"
    result = execute_query(query, (date,))
    
    if not result:
        return None
    
    # Convert result to list of Weather models
    weather_data = [Weather(**row) for row in result]
    
    return weather_data

def get_latest_weather_data():
    """
    Fetch the latest weather data entry from the database.
    """
    query = "SELECT * FROM project_weather ORDER BY ts DESC LIMIT 1"
    result = execute_query(query)

    if not result:
        return None

    latest_data = Weather(**result[0])
    return latest_data