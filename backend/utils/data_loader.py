import pandas as pd
from swagger_server.database.connection import execute_query
from fastapi import HTTPException
import numpy as np
import joblib
from tensorflow.keras.models import load_model

def load_outdoor_data():
    query = """
        SELECT 
            a.ts AS ts,
            a.pm25 AS pm25,
            a.pm10 AS pm10,
            w.wind_speed AS wind_speed,
            w.temperature AS temperature,
            w.humidity AS humidity
        FROM 
            project_aqicn a
        JOIN 
            project_weather w ON DATE(a.ts) = DATE(w.ts)
        WHERE 
            a.pm25 IS NOT NULL AND a.pm10 IS NOT NULL AND
            w.wind_speed IS NOT NULL AND
            w.temperature IS NOT NULL AND
            w.humidity IS NOT NULL
        ORDER BY a.ts ASC
    """
    result = execute_query(query)
    df = pd.DataFrame(result)
    df['ts'] = pd.to_datetime(df['ts'])
    df.set_index('ts', inplace=True)

    # Add time-based features
    df["hour"] = df.index.hour
    df["day_of_week"] = df.index.dayofweek

    df = df.resample("1h").mean().interpolate()
    return df

def load_indoor_data():
    query = """
        SELECT 
            ts,
            temperature AS temp_in,
            humidity AS hum_in,
            pm25 AS pm25_in,
            pm10 AS pm10_in
        FROM 
            SensorData
        WHERE
            room_id = 1 AND
            temperature IS NOT NULL AND
            humidity IS NOT NULL AND
            pm25 IS NOT NULL AND
            pm10 IS NOT NULL
        ORDER BY ts ASC
    """
    result = execute_query(query)
    df = pd.DataFrame(result)
    df['ts'] = pd.to_datetime(df['ts'])
    df.set_index('ts', inplace=True)
    df = df.resample('1h').mean().interpolate()
    return df


def load_outdoor_data():
    """
    Load outdoor environment data.

    This function loads the outdoor environment data from the database. It
    fetches the following columns:

    - ts (datetime): Timestamp
    - pm25 (float): PM2.5
    - pm10 (float): PM10
    - wind_speed (float): Wind speed
    - temperature (float): Temperature
    - humidity (float): Humidity

    The data is resampled to an hourly frequency and any gaps are filled
    using linear interpolation.

    Returns
    -------
    pd.DataFrame
    """

    query = """
        SELECT 
            a.ts AS ts,
            a.pm25 AS pm25,
            a.pm10 AS pm10,
            w.wind_speed AS wind_speed,
            w.temperature AS temperature,
            w.humidity AS humidity
        FROM 
            project_aqicn a
        JOIN 
            project_weather w ON DATE(a.ts) = DATE(w.ts)
        WHERE 
            a.pm25 IS NOT NULL AND a.pm10 IS NOT NULL AND
            w.wind_speed IS NOT NULL AND w.temperature IS NOT NULL AND w.humidity IS NOT NULL
        ORDER BY a.ts ASC
    """
    result = execute_query(query)
    df = pd.DataFrame(result)

    df['ts'] = pd.to_datetime(df['ts'])
    df.set_index('ts', inplace=True)
    # Resample to hourly frequency and interpolate
    df = df.resample("1h").mean().interpolate()

    return df


def load_latest_lagged_features(n_lags=6):
    query = f"""
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
        FROM SensorData s
        LEFT JOIN project_aqicn a ON DATE(s.ts) = DATE(a.ts)
        LEFT JOIN project_weather w ON DATE(s.ts) = DATE(w.ts)
        ORDER BY s.ts DESC
        LIMIT {n_lags}
    """
    df = pd.DataFrame(execute_query(query))
    print("QUERY RESULT:")
    print(df.head())
    print(df.columns)

    # Safety check
    if df.empty or "ts" not in df.columns:
        raise HTTPException(status_code=400, detail="No valid data returned from database.")

    # Fix: ts might be a string or datetime, ensure sorted ASC
    df["ts"] = pd.to_datetime(df["ts"])
    df = df.sort_values("ts").set_index("ts")

    if len(df) < n_lags:
        raise HTTPException(status_code=400, detail="Not enough data to create lagged input.")

    return df


def load_latest_outdoor_lagged(n_lags=6):
    query = f"""
        SELECT 
            a.ts AS ts,
            a.pm25 AS pm25,
            a.pm10 AS pm10,
            w.wind_speed AS wind_speed,
            w.temperature AS temperature,
            w.humidity AS humidity
        FROM 
            project_aqicn a
        JOIN 
            project_weather w ON DATE(a.ts) = DATE(w.ts)
        WHERE 
            a.pm25 IS NOT NULL AND a.pm10 IS NOT NULL AND
            w.wind_speed IS NOT NULL AND
            w.temperature IS NOT NULL AND
            w.humidity IS NOT NULL
        ORDER BY a.ts DESC
        LIMIT {n_lags}
    """
    df = pd.DataFrame(execute_query(query))
    if df.empty or "ts" not in df.columns:
        raise HTTPException(status_code=400, detail="No valid outdoor data returned from database.")

    df["ts"] = pd.to_datetime(df["ts"])
    df = df.sort_values("ts").set_index("ts")
    df["hour"] = df.index.hour
    df["day_of_week"] = df.index.dayofweek

    if len(df) < n_lags:
        raise HTTPException(status_code=400, detail="Not enough data to create lagged input.")

    return df


def load_latest_features(n_rows: int = 12, mode: str = "indoor"):
    if mode == "indoor":
        query = f"""
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
            FROM SensorData s
            JOIN project_aqicn a ON DATE(s.ts) = DATE(a.ts)
            JOIN project_weather w ON DATE(s.ts) = DATE(w.ts)
            ORDER BY s.ts DESC
            LIMIT {n_rows}
        """
    else:
        query = f"""
            SELECT 
                a.ts AS ts,
                a.pm25 AS pm25,
                a.pm10 AS pm10,
                w.wind_speed AS wind_speed,
                w.temperature AS temperature,
                w.humidity AS humidity
            FROM project_aqicn a
            JOIN project_weather w ON DATE(a.ts) = DATE(w.ts)
            ORDER BY a.ts DESC
            LIMIT {n_rows}
        """

    df = pd.DataFrame(execute_query(query))
    if df.empty or len(df) < n_rows:
        raise HTTPException(status_code=400, detail="Not enough data to forecast.")
    df['ts'] = pd.to_datetime(df['ts'])
    df = df.sort_values('ts').set_index('ts')
    df['hour'] = df.index.hour
    df['day_of_week'] = df.index.dayofweek
    return df


def predict(model_path, scaler_path, df, target_cols, forecast_hours):
    scaler = joblib.load(scaler_path)
    model = load_model(model_path)

    feature_cols = scaler.feature_names_in_.tolist()
    df = df[feature_cols]
    df_scaled = pd.DataFrame(scaler.transform(df), columns=feature_cols, index=df.index)

    last_seq = df_scaled[-12:].copy()
    forecast_scaled = []

    for _ in range(forecast_hours):
        input_seq = np.expand_dims(last_seq.values, axis=0)
        pred = model.predict(input_seq)[0]

        non_target_cols = [col for col in feature_cols if col not in target_cols]
        padded = np.concatenate([pred, last_seq.iloc[-1][non_target_cols].values])
        forecast_scaled.append(padded[:len(target_cols)])

        new_df = pd.DataFrame([padded], columns=feature_cols)
        last_seq = pd.concat([last_seq, new_df], ignore_index=True).iloc[1:]

    forecast_scaled = np.array(forecast_scaled)
    inverse = scaler.inverse_transform(
        np.hstack([
            forecast_scaled,
            np.zeros((forecast_scaled.shape[0], len(feature_cols) - len(target_cols)))
        ])
    )[:, :len(target_cols)]

    forecast_df = pd.DataFrame(inverse, columns=target_cols)
    forecast_df['time'] = pd.date_range(start=df.index[-1] + pd.Timedelta(hours=1), periods=forecast_hours, freq="H")
    forecast_df.set_index('time', inplace=True)
    return forecast_df