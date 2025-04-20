from utils.data_loader import load_outdoor_environment_data
from statsmodels.tsa.api import VAR
import pandas as pd

def forecast_outdoor_environment(steps=6):
    df = load_outdoor_environment_data()

    # Only predict these columns
    target_columns = ['pm25', 'pm10', 'temperature', 'humidity']
    
    model = VAR(df)
    results = model.fit(maxlags=12, ic='aic')

    forecast = results.forecast(df.values[-results.k_ar:], steps=steps)
    forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(hours=1), periods=steps, freq="1h")

    forecast_df = pd.DataFrame(forecast, index=forecast_index, columns=df.columns)
    return forecast_df[target_columns].reset_index().rename(columns={'index': 'time'})
