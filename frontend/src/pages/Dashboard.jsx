import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLatestReports } from "../services/api";

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

  if (loading) return <p>Loading latest report...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Welcome to BreatheEasy</h1>

      <section>
        <h2>Latest Reports</h2>
        <div>
          <h3>AQI</h3>
          <p>Value: {data.aqi?.value}</p>
          <p>Location: {data.aqi?.location}</p>
        </div>
        <div>
          <h3>Sensor</h3>
          <p>Temperature: {data.sensor?.temperature} °C</p>
          <p>Humidity: {data.sensor?.humidity} %</p>
        </div>
        <div>
          <h3>Weather</h3>
          <p>Condition: {data.weather?.condition}</p>
          <p>Temperature: {data.weather?.temperature} °C</p>
        </div>
      </section>

      <section>
        <h2>Explore All Data</h2>
        <ul>
          <li><Link to="/aqi">View All AQI Data</Link></li>
          <li><Link to="/sensor">View All Sensor Data</Link></li>
          <li><Link to="/weather">View All Weather Data</Link></li>
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
