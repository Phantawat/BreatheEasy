from ..database.connection import execute_query
from ..models.aqicn import AQICN


def get_all_aqicn_data():
    """
    Fetch all AQICN data from the database.
    """
    query = "SELECT * FROM aqicn_data"
    result = execute_query(query)
    
    # Convert result to list of AQICN models
    aqicn_data = [AQICN(**row) for row in result]
    
    return aqicn_data