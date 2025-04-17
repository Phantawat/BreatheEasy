import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLatestReports } from "../services/api";
import "../styles/Dashboard.css"; // ← Import CSS

function Dashboard() {
  const [data, setData] = useState({
    aqi: null,
    sensor: null,
    weather: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, []);
  
  if (loading) return <div className="loading">Loading latest report...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🌿 Welcome to BreatheEasy</h1>

      <section className="report-section">
        <h2 className="section-title">📊 Latest Reports</h2>
        <div className="report-cards">
          <div className="card aqi-card">
            <h3>AQI</h3>
            <p><strong>AQI:</strong> {data.aqi?.aqi_score}</p>
            <p><strong>PM2.5:</strong> {data.aqi?.pm25}</p>
          </div>
          <div className="card sensor-card">
            <h3>Sensor</h3>
            <p><strong>Temperature:</strong> {data.sensor?.temperature} °C</p>
            <p><strong>Humidity:</strong> {data.sensor?.humidity} %</p>
          </div>
          <div className="card weather-card">
            <h3>Weather</h3>
            <p><strong>Wind Speed:</strong> {data.weather?.wind_speed}</p>
            <p><strong>Temperature:</strong> {data.weather?.temperature} °C</p>
          </div>
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
