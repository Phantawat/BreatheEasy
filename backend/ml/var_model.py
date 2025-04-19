# backend/ml/var_model.py

from statsmodels.tsa.api import VAR
from utils.data_loader import load_combined_pm25_data
import pandas as pd

def forecast_indoor_pm25(hours: int = 6):
    df = load_combined_pm25_data()

    model = VAR(df)
    model_fit = model.fit(maxlags=15, ic='aic')

    forecast = model_fit.forecast(df.values[-model_fit.k_ar:], steps=hours)

    # Forecast returns indoor + outdoor, we only care about indoor
    forecast_df = pd.DataFrame(forecast, columns=['indoor_pm25', 'outdoor_pm25'])

    # Generate future timestamps
    last_timestamp = df.index[-1]
    forecast_index = pd.date_range(
        start=last_timestamp + pd.Timedelta(hours=1),
        periods=hours,
        freq='H'
    )

    prediction = [
        {"timestamp": ts.isoformat(), "indoor_pm25": round(float(pm25), 2)}
        for ts, pm25 in zip(forecast_index, forecast_df['indoor_pm25'])
    ]

    return prediction
