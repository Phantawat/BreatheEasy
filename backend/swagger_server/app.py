# backend/swagger_server/main.py
from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime

from .models.aqicn import AQICN
from .models.sensor_data import SensorData
from .models.weather import Weather

from .controller.aqicn_controller import get_all_aqicn_data

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
def read_aqicn_data(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, gt=0),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None)
):
    """
    Retrieve AQICN data with optional date filtering.
    """
    try:
        return get_all_aqicn_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

