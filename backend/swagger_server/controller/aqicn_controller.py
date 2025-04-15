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
    aqicn_data = AQICN(**result)
    
    return aqicn_data

