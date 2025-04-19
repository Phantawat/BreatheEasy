# backend/ml/arima_model.py

from statsmodels.tsa.arima.model import ARIMA
from utils.data_loader import load_pm25_series
import pandas as pd

def forecast_pm25(hours: int = 6):
    # Load and prepare time series
    series = load_pm25_series()

    # Resample to 1-hour intervals and interpolate missing values
    series = series.resample('1h').mean().interpolate()

    # Fit ARIMA model
    model = ARIMA(series, order=(2, 1, 2))
    model_fit = model.fit()

    # Forecast next `hours` steps
    forecast = model_fit.forecast(steps=hours)

    # Generate future timestamps starting from the last known point
    last_timestamp = series.index[-1]
    forecast_index = pd.date_range(
        start=last_timestamp + pd.Timedelta(hours=1),
        periods=hours,
        freq='H'
    )

    # Combine timestamps and predicted values
    prediction = [
        {"timestamp": ts.isoformat(), "pm25": round(float(value), 2)}
        for ts, value in zip(forecast_index, forecast)
    ]

    return prediction
