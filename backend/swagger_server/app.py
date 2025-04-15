# backend/swagger_server/main.py
from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime

from .models.aqicn import AQICN
from .models.sensor_data import SensorData
from .models.weather import Weather

from .controller.aqicn_controller import get_all_aqicn_data, get_aqicn_data_by_id

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

