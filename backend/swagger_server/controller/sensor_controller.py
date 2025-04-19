from ..database.connection import execute_query, timed_cache
from ..models.sensor_data import SensorData

@timed_cache(ttl=15)
def get_all_sensor_data():
    """
    Fetch all sensor data from the database.
    """
    query = "SELECT * FROM SensorData"
    result = execute_query(query)
    
    # Convert result to list of SensorData models
    sensor_data = [SensorData(**row) for row in result]
    
    return sensor_data

@timed_cache(ttl=15)
def get_sensor_data_by_id(sensor_id: int):
    """
    Fetch sensor data by ID from the database.
    """
    query = "SELECT * FROM SensorData WHERE id = %s"
    result = execute_query(query, (sensor_id,))
    
    if not result:
        return None
    
    # Convert result to SensorData model
    sensor_data = SensorData(**result[0])
    
    return sensor_data

@timed_cache(ttl=15)
def get_sensor_data_by_date(date: str):
    """
    Fetch sensor data by date from the database.
    """
    query = "SELECT * FROM SensorData WHERE DATE(timestamp) = %s"
    result = execute_query(query, (date,))
    
    if not result:
        return None
    
    # Convert result to list of SensorData models
    sensor_data = [SensorData(**row) for row in result]
    
    return sensor_data

@timed_cache(ttl=15)
def get_latest_sensor_data():
    """
    Fetch the latest Sensor data entry from the database.
    """
    query = "SELECT * FROM SensorData ORDER BY timestamp DESC LIMIT 1"
    result = execute_query(query)

    if not result:
        return None

    latest_data = SensorData(**result[0])
    return latest_data

@timed_cache(ttl=15)
def get_monthly_sensor_data():
    """
    Fetch monthly sensor data from the database.
    """
    query = """
        SELECT * FROM SensorData WHERE DATE(timestamp) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
    """
    result = execute_query(query)

    if not result:
        return None

    # Convert result to list of SensorData models
    monthly_data = [SensorData(**row) for row in result]

    return monthly_data

@timed_cache(ttl=15)
def get_available_sensor_dates():
    """
    Fetch available sensor dates from the database.
    """
    query = "SELECT DISTINCT DATE(timestamp) as date FROM SensorData ORDER BY date DESC"
    result = execute_query(query)

    if not result:
        return None

    # Extract dates from the result
    dates = [row['date'] for row in result]
    return dates
