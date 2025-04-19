from ..database.connection import execute_query, timed_cache
from ..models.aqicn import AQICN



@timed_cache(ttl=15)
def get_all_aqicn_data():
    """
    Fetch all AQICN data from the database.
    """
    query = "SELECT * FROM project_aqicn"
    result = execute_query(query)
    
    # Convert result to list of AQICN models
    aqicn_data = [AQICN(**row) for row in result]
    
    return aqicn_data

@timed_cache(ttl=15)
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

@timed_cache(ttl=15)
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

@timed_cache(ttl=15)
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

@timed_cache(ttl=15)
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

@timed_cache(ttl=15)
def get_monthly_aqicn_data():
    """
    Fetch monthly AQICN data from the database.
    """
    query = "SELECT * FROM project_aqicn WHERE DATE(ts) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)"
    result = execute_query(query)

    if not result:
        return None

    monthly_data = [AQICN(**row) for row in result]
    return monthly_data

@timed_cache(ttl=15)
def get_available_aqicn_dates():
    """
    Fetch available AQICN dates from the database.
    """
    query = "SELECT DISTINCT DATE(ts) AS date FROM project_aqicn ORDER BY date DESC"
    result = execute_query(query)

    if not result:
        return None

    dates = [row['date'] for row in result]
    return dates

