import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLatestReports } from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [data, setData] = useState({
    aqi: null,
    sensor: null,
    weather: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReports = () => {
      fetchLatestReports()
        .then(res => {
          setData(res);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching reports:", err);
          setError("Unable to fetch latest reports.");
          setLoading(false);
        });
    };
  
    loadReports();
    const intervalId = setInterval(loadReports, 3600000); // refresh hourly
    return () => clearInterval(intervalId);
  }, []);

  const getIndoorAirQualityReport = () => {
    const { pm25 } = data.sensor || {};
    if (pm25 > 35) return "⚠️ Indoor PM2.5 is high. Consider improving ventilation or using an air purifier.";
    if (pm25 > 12) return "🔸 Indoor PM2.5 is moderate. Keep the room ventilated.";
    return "✅ Indoor air quality is good.";
  };

  const getOutdoorAirQualityReport = () => {
    const { pm25 } = data.aqi || {};
    if (pm25 > 150) return "☠️ Outdoor PM2.5 is very high. Avoid going out and wear a mask.";
    if (pm25 > 55) return "🚨 Outdoor PM2.5 is high. Wear a mask if you need to go out.";
    if (pm25 > 35) return "⚠️ Outdoor PM2.5 is moderate. Sensitive groups should take precautions.";
    return "✅ Outdoor air quality is good.";
  };

  const getWeatherReport = () => {
    const { temperature, wind_speed } = data.weather || {};
    if (temperature < 18) return "🧥 It's quite cold outside. Dress warmly.";
    if (temperature > 33) return "🔥 It's hot outside. Stay hydrated and avoid direct sunlight.";
    if (wind_speed > 10) return "💨 It's windy today. Secure loose items and be cautious outdoors.";
    return "🌤️ The weather outside is pleasant.";
  };

  const getAqiStatusColor = () => {
    const { aqi_score } = data.aqi || {};
    if (!aqi_score) return "lightblue";
    if (aqi_score > 150) return "red";
    if (aqi_score > 100) return "orange";
    if (aqi_score > 50) return "yellow";
    return "green";
  };

  const getSensorStatusColor = () => {
    const { pm25 } = data.sensor || {};
    if (!pm25) return "lightblue";
    if (pm25 > 35) return "red";
    if (pm25 > 12) return "orange";
    return "green";
  };

  const getTemperatureStatusColor = () => {
    const { temperature } = data.weather || {};
    if (!temperature) return "lightblue";
    if (temperature > 33 || temperature < 0) return "red";
    if (temperature > 30 || temperature < 5) return "orange";
    if (temperature > 28 || temperature < 10) return "yellow";
    return "green";
  };

  if (loading) return (
    <div className="page-wrapper gradient-bg">
      <div className="flex items-center justify-center h-screen">
        <div className="card glassy shadow-md">
          <div className="spinner"></div>
          <p className="text-center subtle-title">Loading latest environmental data...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="page-wrapper gradient-bg">
      <div className="flex items-center justify-center h-screen">
        <div className="card glassy shadow-md">
          <p className="error-message">{error}</p>
          <button className="button primary glassy full-width" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper gradient-bg fade-in">
      <header className="flex justify-between items-center mb-8">
        <h1 className="page-title gradient-text">BreatheEasy</h1>
        <div className="text-right">
          <p className="subtle-title">Environmental Monitoring</p>
          <p className="text-sm opacity-70">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </header>

      {/* Environmental Metrics Dashboard */}
      <div className="grid-container fade-in">
        <div className="row grid-row gap-4">
          {/* AQI Card */}
          <div className="card glassy shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="card-title">Outdoor Air Quality</h3>
              <span className={`status-indicator ${getAqiStatusColor()}`}>•</span>
            </div>
            <div className="metric-display">
              <div className="metric-value">{data.aqi?.aqi_score || "—"}</div>
              <div className="metric-label">AQI</div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-center">
                <span className="metric-secondary">{data.aqi?.pm25 || "—"}</span>
                <span className="metric-label-sm">PM2.5</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="metric-secondary">{data.aqi?.pm10 || "—"}</span>
                <span className="metric-label-sm">PM10</span>
              </div>
            </div>
          </div>

          {/* Indoor Sensor Card */}
          <div className="card glassy shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="card-title">Indoor Environment</h3>
              <span className={`status-indicator ${getSensorStatusColor()}`}>•</span>
            </div>
            <div className="metric-display">
              <div className="metric-value">{data.sensor?.pm25 || "—"}</div>
              <div className="metric-label">PM2.5</div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-center">
                <span className="metric-secondary">{data.sensor?.temperature || "—"}°C</span>
                <span className="metric-label-sm">Temp</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="metric-secondary">{data.sensor?.humidity || "—"}%</span>
                <span className="metric-label-sm">Humidity</span>
              </div>
            </div>
          </div>

          {/* Weather Card */}
          <div className="card glassy shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="card-title">Weather Conditions</h3>
              <span className={`status-indicator ${getTemperatureStatusColor()}`}>•</span>
            </div>
            <div className="metric-display">
              <div className="metric-value">{data.weather?.temperature || "—"}°C</div>
              <div className="metric-label">Temperature</div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-center">
                <span className="metric-secondary">{data.weather?.wind_speed || "—"} m/s</span>
                <span className="metric-label-sm">Wind</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="metric-weather-icon">
                  {data.weather?.temperature > 25 ? "☀️" : data.weather?.temperature < 10 ? "❄️" : "🌤️"}
                </span>
                <span className="metric-label-sm">Condition</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Analysis Section */}
      <div className="card glassy vibrant-border shadow-md subtle-margin-top fade-in">
        <h2 className="card-title">Smart Analysis</h2>
        <div className="smart-analysis-grid">
          <div className="analysis-item">
            <div className="analysis-icon">{getIndoorAirQualityReport().split(" ")[0]}</div>
            <div className="analysis-text">
              <h4>Indoor Air</h4>
              <p>{getIndoorAirQualityReport().substring(2)}</p>
            </div>
          </div>
          <div className="analysis-item">
            <div className="analysis-icon">{getOutdoorAirQualityReport().split(" ")[0]}</div>
            <div className="analysis-text">
              <h4>Outdoor Air</h4>
              <p>{getOutdoorAirQualityReport().substring(2)}</p>
            </div>
          </div>
          <div className="analysis-item">
            <div className="analysis-icon">{getWeatherReport().split(" ")[0]}</div>
            <div className="analysis-text">
              <h4>Weather</h4>
              <p>{getWeatherReport().substring(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="card gradient-bg neon-border shadow-md subtle-margin-top fade-in">
        <h2 className="card-title">Explore Data</h2>
        <div className="navigation-grid">
          <Link to="/aqicn" className="nav-card">
            <div className="nav-icon">🌬️</div>
            <div className="nav-text">AQI Data</div>
          </Link>
          <Link to="/sensor" className="nav-card">
            <div className="nav-icon">📟</div>
            <div className="nav-text">Sensor Data</div>
          </Link>
          <Link to="/weather" className="nav-card">
            <div className="nav-icon">🌦️</div>
            <div className="nav-text">Weather Data</div>
          </Link>
          <Link to="/forecast" className="nav-card">
            <div className="nav-icon">📈</div>
            <div className="nav-text">Forecast</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;