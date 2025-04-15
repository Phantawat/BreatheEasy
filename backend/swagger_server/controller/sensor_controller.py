from ..database.connection import execute_query
from ..models.sensor_data import SensorData


def get_all_sensor_data():
    """
    Fetch all sensor data from the database.
    """
    query = "SELECT * FROM SensorData"
    result = execute_query(query)
    
    # Convert result to list of SensorData models
    sensor_data = [SensorData(**row) for row in result]
    
    return sensor_data

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

def get_sensor_data_by_date(date: str):
    """
    Fetch sensor data by date from the database.
    """
    query = "SELECT * FROM SensorData WHERE DATE(ts) = %s"
    result = execute_query(query, (date,))
    
    if not result:
        return None
    
    # Convert result to list of SensorData models
    sensor_data = [SensorData(**row) for row in result]
    
    return sensor_data