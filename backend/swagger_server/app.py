# backend/swagger_server/main.py

from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models.aqicn import AQICN
from .models.sensor_data import SensorData
from .models.weather import Weather

from .controller.aqicn_controller import (
    get_all_aqicn_data,
    get_aqicn_data_by_id,
    get_aqicn_data_by_date,
    get_aqicn_data_by_date_range,
    get_latest_aqicn_data,
)
from .controller.sensor_controller import (
    get_all_sensor_data,
    get_sensor_data_by_id,
    get_sensor_data_by_date,
    get_latest_sensor_data,
)
from .controller.weather_controller import (
    get_all_weather_data,
    get_weather_data_by_id,
    get_weather_data_by_date,
    get_latest_weather_data,
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


@app.get("/aqicn/monthly", response_model=List[AQICN])
def read_monthly_aqicn_data():
    try:
        monthly_data = get_all_aqicn_data()
        if not monthly_data:
            raise HTTPException(status_code=404, detail="Monthly AQICN data not found")
        return monthly_data
    except HTTPException:
        raise
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
