from ..database.connection import execute_query
from ..models.aqicn import AQICN


def get_all_aqicn_data():
    """
    Fetch all AQICN data from the database.
    """
    query = "SELECT * FROM project_aqicn"
    result = execute_query(query)
    
    # Convert result to list of AQICN models
    aqicn_data = [AQICN(**row) for row in result]
    
    return aqicn_data

def get_aqicn_data_by_id(aqicn_id: int):
    """
    Fetch AQICN data by ID from the database.
    """
    query = "SELECT * FROM project_aqicn WHERE id = %s"
    result = execute_query(query, (aqicn_id,))
    
    if not result:
        return None
    
    # Convert result to AQICN model
    aqicn_data = AQICN(**result[0])
    
    return aqicn_data

def get_aqicn_data_by_date(date: str):
    """
    Fetch AQICN data by date from the database.
    """
    query = "SELECT * FROM project_aqicn WHERE DATE(ts) = %s"
    result = execute_query(query, (date,))
    
    if not result:
        return None
    
    # Convert result to list of AQICN models
    aqicn_data = [AQICN(**row) for row in result]
    
    return aqicn_data

def get_aqicn_data_by_date_range(start_date: str, end_date: str):
    """
    Fetch AQICN data by date range from the database.
    """
    query = "SELECT * FROM project_aqicn WHERE DATE(ts) BETWEEN %s AND %s"
    result = execute_query(query, (start_date, end_date))
    
    if not result:
        return None
    
    # Convert result to list of AQICN models
    aqicn_data = [AQICN(**row) for row in result]
    
    return aqicn_data

def get_latest_aqicn_data():
    """
    Fetch the latest AQICN data entry from the database.
    """
    query = "SELECT * FROM project_aqicn ORDER BY ts DESC LIMIT 1"
    result = execute_query(query)

    if not result:
        return None

    latest_data = AQICN(**result[0])
    return latest_data

def get_monthly_aqicn_data():
    """
    Fetch monthly AQICN data from the database.
    """
    query = "SELECT DATE(ts) AS date, AVG(aqi) AS avg_aqi FROM project_aqicn GROUP BY DATE(ts)"
    result = execute_query(query)

    if not result:
        return None

    monthly_data = [AQICN(**row) for row in result]
    return monthly_data

