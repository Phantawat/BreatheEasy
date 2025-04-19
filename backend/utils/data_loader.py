# backend/utils/data_loader.py

import pandas as pd
from swagger_server.database.connection import execute_query

def load_pm25_series():
    query = """
        SELECT timestamp, pm25 
        FROM SensorData 
        WHERE pm25 IS NOT NULL 
        ORDER BY timestamp ASC
    """
    result = execute_query(query)
    df = pd.DataFrame(result)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)
    return df['pm25']


def load_combined_pm25_data():
    query = """
        SELECT 
            s.timestamp as ts,
            s.pm25 as indoor_pm25,
            a.pm25 as outdoor_pm25
        FROM 
            SensorData s
        JOIN 
            project_aqicn a 
            ON DATE(s.timestamp) = DATE(a.timestamp)
        ORDER BY 
            s.timestamp ASC
    """
    result = execute_query(query)
    df = pd.DataFrame(result)
    
    # Parse and set datetime index
    df['ts'] = pd.to_datetime(df['ts'])
    df.set_index('ts', inplace=True)

    # Resample both series hourly and interpolate
    df = df.resample("1H").mean().interpolate()

    return df[['indoor_pm25', 'outdoor_pm25']]