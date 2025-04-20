import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.multioutput import MultiOutputRegressor
from utils.data_loader import load_combined_indoor_outdoor


def prepare_features(df, target_cols=None, n_lags=6):
    """
    Prepare lagged features for time series forecasting.
    
    Parameters:
    - df: DataFrame with time index and indoor/outdoor variables
    - target_cols: list of columns to predict (default is all df.columns)
    - n_lags: number of time lags to generate
    
    Returns:
    - X: Feature DataFrame with lagged values
    - y: Target DataFrame
    - valid_index: Index corresponding to valid prediction rows
    """
    if target_cols is None:
        target_cols = ['temp_in', 'hum_in', 'pm25_in', 'pm10_in']
    
    X, y, valid_index = [], [], []

    for i in range(n_lags, len(df)):
        lagged_features = {}
        for lag in range(1, n_lags + 1):
            for col in df.columns:
                lagged_features[f"{col}_lag{lag}"] = df.iloc[i - lag][col]
        X.append(lagged_features)
        y.append(df.iloc[i][target_cols].values)
        valid_index.append(df.index[i])

    X_df = pd.DataFrame(X, index=valid_index)
    y_df = pd.DataFrame(y, index=valid_index, columns=target_cols)
    return X_df, y_df, valid_index


def forecast_full(hours: int = 6):
    df = load_combined_indoor_outdoor()

    # Prepare lag features
    X, y, index = prepare_features(df)

    # Train model
    model = MultiOutputRegressor(XGBRegressor(n_estimators=100, max_depth=4))
    model.fit(X, y)

    # Prepare last known lag features for prediction
    last_row = df.iloc[-6:].copy()
    last_features = {}
    for lag in range(1, 7):
        for col in df.columns:
            last_features[f"{col}_lag{lag}"] = last_row.iloc[-lag][col]
    current_input = pd.DataFrame([last_features])

    # Predict recursively
    predictions = []
    target_cols = ['temp_in', 'hum_in', 'pm25_in', 'pm10_in']

    for _ in range(hours):
        pred = model.predict(current_input)[0]
        predictions.append(pred)

        for j, col in enumerate(target_cols):
            for lag in range(6, 1, -1):
                current_input[f"{col}_lag{lag}"] = current_input[f"{col}_lag{lag-1}"]
            current_input[f"{col}_lag1"] = pred[j]

    forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(hours=1), periods=hours, freq="1h")
    forecast_df = pd.DataFrame(predictions, columns=target_cols, index=forecast_index)
    forecast_df = forecast_df.reset_index().rename(columns={"index": "time"})

    return forecast_df


def forecast_basic(hours: int = 6):
    df = load_combined_indoor_outdoor()

    # Only keep indoor variables
    target_cols = ['temp_in', 'hum_in', 'pm25_in', 'pm10_in']
    df = df[target_cols]

    # Prepare lag features
    X, y, index = prepare_features(df)

    model = MultiOutputRegressor(XGBRegressor(n_estimators=100, max_depth=4))
    model.fit(X, y)

    # Build lag input from last 6 rows
    last_row = df.iloc[-6:]
    last_features = {}
    for lag in range(1, 7):
        for col in df.columns:
            last_features[f"{col}_lag{lag}"] = last_row.iloc[-lag][col]
    current_input = pd.DataFrame([last_features])

    # Predict recursively
    predictions = []

    for _ in range(hours):
        pred = model.predict(current_input)[0]
        predictions.append(pred)

        for j, col in enumerate(target_cols):
            for lag in range(6, 1, -1):
                current_input[f"{col}_lag{lag}"] = current_input[f"{col}_lag{lag-1}"]
            current_input[f"{col}_lag1"] = pred[j]

    forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(hours=1), periods=hours, freq="1h")
    forecast_df = pd.DataFrame(predictions, columns=target_cols, index=forecast_index)
    forecast_df = forecast_df.reset_index().rename(columns={"index": "time"})

    return forecast_df
