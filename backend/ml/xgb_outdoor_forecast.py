import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.multioutput import MultiOutputRegressor
from utils.data_loader import load_outdoor_data

def prepare_features(df, target_cols, n_lags=6):
    """
    Prepares lag features and targets for multi-step time series forecasting.

    Parameters:
    - df: DataFrame with datetime index and feature columns
    - target_cols: list of columns to forecast (e.g., ['temperature', 'humidity', 'pm25', 'pm10'])
    - n_lags: number of lags to use (default: 6)

    Returns:
    - X: DataFrame of lagged input features
    - y: DataFrame of target values
    - valid_index: Index aligned with targets
    """
    X = []
    y = []
    valid_index = []

    for i in range(n_lags, len(df)):
        lagged_row = {}
        for lag in range(1, n_lags + 1):
            for col in df.columns:
                lagged_row[f"{col}_lag{lag}"] = df.iloc[i - lag][col]
        X.append(lagged_row)
        y.append(df.iloc[i][target_cols].values)
        valid_index.append(df.index[i])

    X_df = pd.DataFrame(X, index=valid_index)
    y_df = pd.DataFrame(y, index=valid_index, columns=target_cols)

    return X_df, y_df, valid_index


def forecast_outdoor(hours=6):
    df = load_outdoor_data()
    X, y, index = prepare_features(df, target_cols=['temperature', 'humidity', 'pm25', 'pm10'])

    model = MultiOutputRegressor(XGBRegressor(n_estimators=100, max_depth=4))
    model.fit(X, y)

    # Prepare input for forecasting
    last_rows = df.iloc[-6:]
    last_input = {}
    for lag in range(1, 7):
        for col in df.columns:
            last_input[f"{col}_lag{lag}"] = last_rows.iloc[-lag][col]
    
    current_input = pd.DataFrame([last_input])
    predictions = []

    for i in range(hours):
        pred = model.predict(current_input)[0]
        predictions.append(pred)

        for j, col in enumerate(['temperature', 'humidity', 'pm25', 'pm10']):
            for lag in range(6, 1, -1):
                current_input[f"{col}_lag{lag}"] = current_input[f"{col}_lag{lag-1}"]
            current_input[f"{col}_lag1"] = pred[j]

    forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(hours=1), periods=hours, freq="1h")
    forecast_df = pd.DataFrame(predictions, index=forecast_index, columns=['temperature', 'humidity', 'pm25', 'pm10'])

    return forecast_df.reset_index().rename(columns={"index": "time"})
