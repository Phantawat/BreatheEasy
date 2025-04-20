from ..database.connection import execute_query, timed_cache
from ..models.weather import Weather

@timed_cache(ttl=15)
def get_all_weather_data():
    """
    Fetch all weather data from the database.
    """
    query = "SELECT * FROM project_weather"
    result = execute_query(query)
    weather_data = [Weather(**row) for row in result]
    return weather_data

@timed_cache(ttl=15)
def get_weather_data_by_id(weather_id: int):
    """
    Fetch weather data by ID from the database.
    """
    query = "SELECT * FROM project_weather WHERE id = %s"
    result = execute_query(query, (weather_id,))
    if not result:
        return None
    return Weather(**result[0])

@timed_cache(ttl=15)
def get_weather_data_by_date(date: str):
    """
    Fetch weather data by date from the database.
    """
    query = "SELECT * FROM project_weather WHERE DATE(ts) = %s"
    result = execute_query(query, (date,))
    if not result:
        return None
    return [Weather(**row) for row in result]

@timed_cache(ttl=15)
def get_latest_weather_data():
    """
    Fetch the latest weather data entry from the database.
    """
    query = "SELECT * FROM project_weather ORDER BY ts DESC LIMIT 1"
    result = execute_query(query)
    if not result:
        return None
    return Weather(**result[0])

@timed_cache(ttl=15)
def get_available_weather_dates():
    """
    Fetch unique available weather dates from the database (sorted).
    Returns a list of date strings in 'YYYY-MM-DD' format.
    """
    query = "SELECT DISTINCT DATE(ts) as date FROM project_weather ORDER BY date DESC"
    result = execute_query(query)
    if not result:
        return []
    return [row["date"].strftime("%Y-%m-%d") for row in result]

@timed_cache(ttl=15)
def get_monthly_weather_data():
    """
    Fetch monthly weather data from the database.
    """
    query = "SELECT * FROM project_weather WHERE DATE(ts) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)"
    result = execute_query(query)
    if not result:
        return None
    return [Weather(**row) for row in result]
