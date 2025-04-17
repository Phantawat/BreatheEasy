# backend/swagger_server/main.py
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models.aqicn import AQICN
from .models.sensor_data import SensorData
from .models.weather import Weather

from .controller.aqicn_controller import get_all_aqicn_data, get_aqicn_data_by_id, get_aqicn_data_by_date, get_aqicn_data_by_date_range, get_latest_aqicn_data
from .controller.sensor_controller import get_all_sensor_data, get_sensor_data_by_id, get_sensor_data_by_date
from .controller.weather_controller import get_all_weather_data, get_weather_data_by_id, get_weather_data_by_date

app = FastAPI(title="Air Quality Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Air Quality Monitoring API"}

@app.get("/aqicn", response_model=List[AQICN])
def read_aqicn_data():
    """
    Retrieve AQICN data with optional date filtering.
    """
    try:
        return get_all_aqicn_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/aqicn/latest", response_model=AQICN)
def read_latest_aqicn_data():
    """
    Retrieve the latest AQICN data.
    """
    try: 
        latest_data = get_latest_aqicn_data()
        if not latest_data:
            raise HTTPException(status_code=404, detail="Latest AQICN data not found")
        return latest_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

        
@app.get("/aqicn/{aqicn_id}", response_model=AQICN)
def read_aqicn_data_by_id(aqicn_id: int):
    """
    Retrieve AQICN data by ID.
    """
    try:
        aqicn_data = get_aqicn_data_by_id(aqicn_id)
        if not aqicn_data:
            raise HTTPException(status_code=404, detail="AQICN data not found")
        return aqicn_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/sensor", response_model=List[SensorData])
def read_sensor_data():    
    """
    Retrieve sensor data with optional date filtering.
    """
    try:
        sensor_data = get_all_sensor_data()
        return sensor_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sensor/{sensor_id}", response_model=SensorData)
def read_sensor_data_by_id(sensor_id: int):
    """
    Retrieve sensor data by ID.
    """
    try:
        sensor_data = get_sensor_data_by_id(sensor_id)
        if not sensor_data:
            raise HTTPException(status_code=404, detail="Sensor data not found")
        return sensor_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/weather", response_model=List[Weather])
def read_weather_data():
    """
    Retrieve weather data with optional date filtering.
    """
    try:
        weather_data = get_all_weather_data()
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/weather/{weather_id}", response_model=Weather)
def read_weather_data_by_id(weather_id: int):
    """
    Retrieve weather data by ID.
    """
    try:
        weather_data = get_weather_data_by_id(weather_id)
        if not weather_data:
            raise HTTPException(status_code=404, detail="Weather data not found")
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/aqicn/date/{date}", response_model=List[AQICN])
def read_aqicn_data_by_date(date: str):
    """
    Retrieve AQICN data by date.
    """
    try:
        aqicn_data = get_aqicn_data_by_date(date)
        if not aqicn_data:
            raise HTTPException(status_code=404, detail="AQICN data not found for the specified date")
        return aqicn_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/aqicn/date/{start_date}/{end_date}", response_model=List[AQICN])
def read_aqicn_data_by_date_range(start_date: str, end_date: str):
    """
    Retrieve AQICN data by date range.
    """
    try:
        aqicn_data = get_aqicn_data_by_date_range(start_date, end_date)
        if not aqicn_data:
            raise HTTPException(status_code=404, detail="AQICN data not found for the specified date range")
        return aqicn_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/sensor/date/{date}", response_model=List[SensorData])
def read_sensor_data_by_date(date: str):
    """
    Retrieve sensor data by date.
    """
    try:
        sensor_data = get_sensor_data_by_date(date)
        if not sensor_data:
            raise HTTPException(status_code=404, detail="Sensor data not found for the specified date")
        return sensor_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/weather/date/{date}", response_model=List[Weather])
def read_weather_data_by_date(date: str):
    """
    Retrieve weather data by date.
    """
    try:
        weather_data = get_weather_data_by_date(date)
        if not weather_data:
            raise HTTPException(status_code=404, detail="Weather data not found for the specified date")
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
