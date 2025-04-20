import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLatestReports } from "../services/api";
import "../styles/Shared.css";

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

  if (loading) return <div className="page-wrapper"><p className="loading">Loading latest report...</p></div>;
  if (error) return <div className="page-wrapper"><p className="error">{error}</p></div>;

  return (
    <div className="page-wrapper fade-in">
      <h1 className="page-title gradient-text">🌿 Welcome to BreatheEasy</h1>

      <div className="card vibrant-bg neon-border">
        <h2 className="card-title">📊 Latest Reports</h2>
        <div className="grid-row">
          <div className="card glassy narrow">
            <h3 className="card-title">🌬️ Outdoor AQI</h3>
            <p><strong>AQI:</strong> {data.aqi?.aqi_score}</p>
            <p><strong>PM2.5:</strong> {data.aqi?.pm25}</p>
            <p><strong>PM10:</strong> {data.aqi?.pm10}</p>
          </div>
          <div className="card glassy narrow">
            <h3 className="card-title">📟 Indoor Sensor</h3>
            <p><strong>Temperature:</strong> {data.sensor?.temperature} °C</p>
            <p><strong>Humidity:</strong> {data.sensor?.humidity} %</p>
            <p><strong>PM2.5:</strong> {data.sensor?.pm25}</p>
          </div>
          <div className="card glassy narrow">
            <h3 className="card-title">🌦️ Weather</h3>
            <p><strong>Wind Speed:</strong> {data.weather?.wind_speed} m/s</p>
            <p><strong>Temperature:</strong> {data.weather?.temperature} °C</p>
          </div>
        </div>
      </div>

      <div className="card glassy subtle-margin-top">
        <h2 className="card-title">📋 Smart Report Summary</h2>
        <ul className="legend-list">
          <li>{getIndoorAirQualityReport()}</li>
          <li>{getOutdoorAirQualityReport()}</li>
          <li>{getWeatherReport()}</li>
        </ul>
      </div>

      <div className="card fade-in vibrant-border subtle-margin-top">
        <h2 className="card-title">🔍 Explore All Data</h2>
        <ul className="legend-list">
          <li><Link to="/aqicn">🌬️ View All AQI Data</Link></li>
          <li><Link to="/sensor">📟 View All Sensor Data</Link></li>
          <li><Link to="/weather">🌦️ View All Weather Data</Link></li>
          <li><Link to="/forecast">📈 View Forecast Data</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
