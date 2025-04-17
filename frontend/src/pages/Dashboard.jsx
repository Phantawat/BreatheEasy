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
  
    loadReports(); // initial load
  
    const intervalId = setInterval(loadReports, 60 * 60 * 1000); // every hour (3600000 ms)
  
    return () => clearInterval(intervalId); // cleanup on unmount
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

  if (loading) return <div className="loading">Loading latest report...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🌿 Welcome to BreatheEasy</h1>

      <section className="report-section">
        <h2 className="section-title">📊 Latest Reports</h2>
        <div className="report-cards">
          <div className="card aqi-card">
            <h3>Outdoor AQI</h3>
            <p><strong>AQI:</strong> {data.aqi?.aqi_score}</p>
            <p><strong>PM2.5:</strong> {data.aqi?.pm25}</p>
            <p><strong>PM10:</strong> {data.aqi?.pm10}</p>
          </div>
          <div className="card sensor-card">
            <h3>Indoor Sensor</h3>
            <p><strong>Temperature:</strong> {data.sensor?.temperature} °C</p>
            <p><strong>Humidity:</strong> {data.sensor?.humidity} %</p>
            <p><strong>PM2.5:</strong> {data.sensor?.pm25}</p>
          </div>
          <div className="card weather-card">
            <h3>Weather</h3>
            <p><strong>Wind Speed:</strong> {data.weather?.wind_speed}</p>
            <p><strong>Temperature:</strong> {data.weather?.temperature} °C</p>
          </div>
        </div>

        <div className="card summary-report">
          <h3>📋 Smart Report Summary</h3>
          <p>{getIndoorAirQualityReport()}</p>
          <p>{getOutdoorAirQualityReport()}</p>
          <p>{getWeatherReport()}</p>
        </div>
      </section>

      <section className="links-section">
        <h2 className="section-title">🔍 Explore All Data</h2>
        <ul className="data-links">
          <li><Link to="/aqicn">🌬️ View All AQI Data</Link></li>
          <li><Link to="/sensor">📟 View All Sensor Data</Link></li>
          <li><Link to="/weather">🌦️ View All Weather Data</Link></li>
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;