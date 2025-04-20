import pandas as pd
from swagger_server.database.connection import execute_query


def load_combined_indoor_outdoor():
    """
    Load merged indoor + outdoor dataset for multivariate prediction.
    """
    query = """
        SELECT 
            s.ts AS ts,
            s.temperature AS temp_in,
            s.humidity AS hum_in,
            s.pm25 AS pm25_in,
            s.pm10 AS pm10_in,
            a.pm25 AS pm25_out,
            a.pm10 AS pm10_out,
            w.temperature AS temp_out,
            w.humidity AS hum_out,
            w.wind_speed AS wind_speed
        FROM 
            SensorData s
        JOIN 
            project_aqicn a ON DATE(s.ts) = DATE(a.ts)
        JOIN 
            project_weather w ON DATE(s.ts) = DATE(w.ts)
        WHERE
            s.temperature IS NOT NULL AND s.humidity IS NOT NULL
            AND s.pm25 IS NOT NULL AND s.pm10 IS NOT NULL
            AND a.pm25 IS NOT NULL AND a.pm10 IS NOT NULL
            AND w.temperature IS NOT NULL AND w.humidity IS NOT NULL
        ORDER BY s.ts ASC
    """
    result = execute_query(query)
    df = pd.DataFrame(result)

    df['ts'] = pd.to_datetime(df['ts'])
    df.set_index('ts', inplace=True)
    df['hour'] = df.index.hour
    # Resample hourly and fill gaps
    df = df.resample("1h").mean().interpolate()

    return df

def load_outdoor_environment_data():
    """
    Load outdoor environmental data: pm25, pm10, temperature, humidity
    """
    query = """
        SELECT 
            a.ts AS ts,
            a.pm25 AS pm25,
            a.pm10 AS pm10,
            w.temperature AS temperature,
            w.humidity AS humidity
        FROM 
            project_aqicn a
        JOIN 
            project_weather w ON DATE(a.ts) = DATE(w.ts)
        WHERE 
            a.pm25 IS NOT NULL AND a.pm10 IS NOT NULL 
            AND w.temperature IS NOT NULL AND w.humidity IS NOT NULL
        ORDER BY 
            a.ts ASC
    """
    result = execute_query(query)
    df = pd.DataFrame(result)

    df['ts'] = pd.to_datetime(df['ts'])
    df.set_index('ts', inplace=True)
    df['hour'] = df.index.hour

    df = df.resample("1h").mean().interpolate()
    return df