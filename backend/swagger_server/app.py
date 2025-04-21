# backend/swagger_server/main.py

from typing import List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

from .models.aqicn import AQICN
from .models.sensor_data import SensorData
from .models.weather import Weather
from utils.data_loader import load_latest_features, predict

from ml.xgb_indoor_forecast import forecast_full, forecast_basic
from ml.xgb_outdoor_forecast import forecast_outdoor




from .controller.aqicn_controller import (
    get_all_aqicn_data, 
    get_aqicn_data_by_id, 
    get_aqicn_data_by_date, 
    get_aqicn_data_by_date_range, 
    get_latest_aqicn_data, 
    get_monthly_aqicn_data, 
    get_available_aqicn_dates
)
from .controller.sensor_controller import (
    get_all_sensor_data, 
    get_sensor_data_by_id, 
    get_sensor_data_by_date, 
    get_latest_sensor_data, 
    get_monthly_sensor_data, 
    get_available_sensor_dates
)
from .controller.weather_controller import (
    get_all_weather_data, 
    get_weather_data_by_id, 
    get_weather_data_by_date, 
    get_latest_weather_data, 
    get_monthly_weather_data, 
    get_available_weather_dates
)

app = FastAPI(title="Air Quality Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Air Quality Monitoring API"}


@app.get("/aqicn", response_model=List[AQICN])
def read_aqicn_data():
    try:
        return get_all_aqicn_data()
    except HTTPException:
        # propagate 4xx from inside controller if you ever raise one
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/aqicn/latest", response_model=AQICN)
def read_latest_aqicn_data():
    try:
        latest_data = get_latest_aqicn_data()
        if not latest_data:
            raise HTTPException(status_code=404, detail="Latest AQICN data not found")
        return latest_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/aqicn/monthly", response_model=List)
def read_monthly_aqicn_data():
    try:
        monthly_data = get_monthly_aqicn_data()
        if not monthly_data:
            raise HTTPException(status_code=404, detail="Monthly AQICN data not found")
        return monthly_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/aqicn/dates", response_model=List)
def aqicn_dates():
    """
    Retrieve AQICN dates.
    """
    try:
        aqicn_dates = get_available_aqicn_dates()
        if not aqicn_dates:
            raise HTTPException(status_code=404, detail="AQICN data not found")
        return aqicn_dates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/aqicn/{aqicn_id}", response_model=AQICN)
def read_aqicn_data_by_id(aqicn_id: int):
    try:
        aqicn_data = get_aqicn_data_by_id(aqicn_id)
        if not aqicn_data:
            raise HTTPException(status_code=404, detail="AQICN data not found")
        return aqicn_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sensor", response_model=List[SensorData])
def read_sensor_data():
    try:
        return get_all_sensor_data()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sensor/latest", response_model=SensorData)
def read_latest_sensor_data():
    try:
        latest_data = get_latest_sensor_data()
        if not latest_data:
            raise HTTPException(status_code=404, detail="Latest Sensor data not found")
        return latest_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/sensor/dates", response_model=List)
def sensor_dates():
    """
    Retrieve sensor dates.
    """
    try:
        sensor_dates = get_available_sensor_dates()
        if not sensor_dates:
            raise HTTPException(status_code=404, detail="Sensor data not found")
        return sensor_dates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/sensor/monthly", response_model=List[SensorData])
def read_monthly_sensor_data():
    """
    Retrieve monthly Sensor data.
    """
    try:
        monthly_data = get_monthly_sensor_data()
        if not monthly_data:
            raise HTTPException(status_code=404, detail="Monthly Sensor data not found")
        return monthly_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/sensor/{sensor_id}", response_model=SensorData)
def read_sensor_data_by_id(sensor_id: int):
    try:
        sensor_data = get_sensor_data_by_id(sensor_id)
        if not sensor_data:
            raise HTTPException(status_code=404, detail="Sensor data not found")
        return sensor_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/weather", response_model=List[Weather])
def read_weather_data():
    try:
        return get_all_weather_data()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/weather/latest", response_model=Weather)
def read_latest_weather_data():
    try:
        weather_data = get_latest_weather_data()
        if not weather_data:
            raise HTTPException(status_code=404, detail="No weather data found")
        return weather_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/weather/monthly", response_model=List[Weather])
def read_monthly_weather_data():
    """
    Retrieve monthly weather data.
    """
    try:
        monthly_data = get_monthly_weather_data()
        if not monthly_data:
            raise HTTPException(status_code=404, detail="Monthly weather data not found")
        return monthly_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/weather/dates", response_model=List)
def weather_dates():
    """
    Retrieve weather dates.
    """
    try:
        weather_dates = get_available_weather_dates()
        if not weather_dates:
            raise HTTPException(status_code=404, detail="Weather data not found")
        return weather_dates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@app.get("/weather/{weather_id}", response_model=Weather)
def read_weather_data_by_id(weather_id: int):
    try:
        weather_data = get_weather_data_by_id(weather_id)
        if not weather_data:
            raise HTTPException(status_code=404, detail="Weather data not found")
        return weather_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/aqicn/date/{date}", response_model=List[AQICN])
def read_aqicn_data_by_date(date: str):
    try:
        aqicn_data = get_aqicn_data_by_date(date)
        if not aqicn_data:
            raise HTTPException(
                status_code=404,
                detail="AQICN data not found for the specified date",
            )
        return aqicn_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/aqicn/date/{start_date}/{end_date}", response_model=List[AQICN])
def read_aqicn_data_by_date_range(start_date: str, end_date: str):
    try:
        aqicn_data = get_aqicn_data_by_date_range(start_date, end_date)
        if not aqicn_data:
            raise HTTPException(
                status_code=404,
                detail="AQICN data not found for the specified date range",
            )
        return aqicn_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sensor/date/{date}", response_model=List[SensorData])
def read_sensor_data_by_date(date: str):
    try:
        sensor_data = get_sensor_data_by_date(date)
        if not sensor_data:
            raise HTTPException(
                status_code=404,
                detail="Sensor data not found for the specified date",
            )
        return sensor_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/weather/date/{date}", response_model=List[Weather])
def read_weather_data_by_date(date: str):
    try:
        weather_data = get_weather_data_by_date(date)
        if not weather_data:
            raise HTTPException(
                status_code=404,
                detail="Weather data not found for the specified date",
            )
        return weather_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


MODEL_CONFIG = {
    "indoor": {
        "no_ac": {
            "model": "ml/models/lstm_indoor_no_ac_model.keras",
            "scaler": "ml/models/lstm_indoor_no_ac_scaler.pkl"
        },
        "with_ac": {
            "model": "ml/models/lstm_indoor_with_ac_model.keras",
            "scaler": "ml/models/lstm_indoor_with_ac_scaler.pkl"
        }
    },
    "outdoor": {
        "model": "ml/models/lstm_outdoor_model.keras",
        "scaler": "ml/models/lstm_outdoor_scaler.pkl"
    }
}

TARGET_COLS = {
    "indoor": ['temp_in', 'hum_in', 'pm25_in', 'pm10_in'],
    "outdoor": ['temperature', 'humidity', 'pm25', 'pm10']
}


@app.get("/predict/indoor")
def predict_indoor(model_type: str = Query(..., enum=["no_ac", "with_ac"]),
                   hours: int = Query(12, enum=[6, 12, 24])):
    config = MODEL_CONFIG["indoor"][model_type]
    df = load_latest_features(mode="indoor")  # 🚫 no room_id filter
    forecast_df = predict(config["model"], config["scaler"], df, TARGET_COLS["indoor"], forecast_hours=hours)
    return {"forecast": forecast_df.to_dict(orient="index")}


@app.get("/predict/outdoor")
def predict_outdoor(hours: int = Query(12, enum=[6, 12, 24])):
    config = MODEL_CONFIG["outdoor"]
    df = load_latest_features(mode="outdoor")
    forecast_df = predict(config["model"], config["scaler"], df, TARGET_COLS["outdoor"], forecast_hours=hours)
    return {"forecast": forecast_df.to_dict(orient="index")}
