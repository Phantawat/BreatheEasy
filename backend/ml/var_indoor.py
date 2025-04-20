from utils.data_loader import load_combined_indoor_outdoor
from statsmodels.tsa.api import VAR
import pandas as pd

def forecast_indoor_multivariate(steps=6):
    df = load_combined_indoor_outdoor()

    # Only predict indoor variables
    target_columns = ['temp_in', 'hum_in', 'pm25_in', 'pm10_in']

    # Train on full dataset
    model = VAR(df)
    results = model.fit(maxlags=12, ic='aic')

    # Forecast all variables, then select only the target ones
    forecast = results.forecast(df.values[-results.k_ar:], steps=steps)
    forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(hours=1), periods=steps, freq="1h")

    forecast_df = pd.DataFrame(forecast, index=forecast_index, columns=df.columns)
    return forecast_df[target_columns].reset_index().rename(columns={'index': 'time'})

