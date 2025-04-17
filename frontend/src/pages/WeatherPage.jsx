import React, { useEffect, useState } from 'react';
import { weatherApi } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import '../styles/Shared.css';

const ThresholdLegend = () => (
  <div className="card">
    <h2 className="card-title">📘 Threshold Key</h2>
    <ul style={{ lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '1rem' }}>
      <li><strong style={{ color: 'green' }}>Green</strong> — Good / Optimal levels</li>
      <li><strong style={{ color: 'yellow' }}>Yellow</strong> — Moderate levels</li>
      <li><strong style={{ color: 'orange' }}>Orange</strong> — Caution / Less optimal</li>
      <li><strong style={{ color: 'red' }}>Red</strong> — High / Unhealthy levels</li>
      <li><strong style={{ color: 'lightblue' }}>Light Blue</strong> — Comfortable temperature</li>
    </ul>
  </div>
);

const WeatherPage = () => {
  const [latestData, setLatestData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dateData, setDateData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const latestRes = await weatherApi.getLatestData();
        setLatestData(latestRes.data);

        const monthlyRes = await weatherApi.getMonthlyData();
        const monthly = monthlyRes.data.map(item => ({
          ...item,
          timestamp: new Date(item.ts).toLocaleString(),
        }));
        setMonthlyData(monthly);

        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Failed to load weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchDateData = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const response = await weatherApi.getDataByDate(selectedDate);
      setDateData(response.data);
      setError('');
    } catch (err) {
      console.error("Weather date fetch error:", err);
      setError(`Failed to load data for ${selectedDate}.`);
      setDateData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDateData();
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">🌦️ Weather Dashboard</h1>
      <div className="grid-row">
        <div className="card narrow">
          <h2 className="card-title">📆 Select Date</h2>
          <form onSubmit={handleSubmit} className="date-form">
            <div className="form-group">
              <label htmlFor="date-picker">Select a date:</label>
              <input
                type="date"
                id="date-picker"
                value={selectedDate}
                onChange={handleDateChange}
                className="date-input"
              />
            </div>
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Loading...' : 'Get Data'}
            </button>
          </form>
        </div>

        {latestData && (
          <div className="card wide">
            <h2 className="card-title">🔍 Latest Weather Reading</h2>
            <div className="details">
              <p><strong>📅 Timestamp:</strong><br /> {new Date(latestData.ts).toLocaleString()}</p>
              <p><strong>🌡️ Temperature:</strong> {latestData.temperature} °C</p>
              <p><strong>💧 Humidity:</strong> {latestData.humidity} %</p>
              <p><strong>🌬️ Wind Speed:</strong> {latestData.wind_speed} m/s</p>
            </div>
          </div>
        )}
      </div>

      <ThresholdLegend />

      {/* Chart 1: Temperature */}
      {monthlyData.length > 0 && (
        <div className="chart-container">
          <h2 className="card-title">🌡️ Temperature Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(str) => new Date(str).toLocaleDateString()}
                minTickGap={40}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceArea y1={20} y2={27} fill="lightblue" fillOpacity={0.2} />
              <ReferenceArea y1={28} y2={32} fill="orange" fillOpacity={0.2} />
              <ReferenceArea y1={33} y2={50} fill="red" fillOpacity={0.2} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f97316"
                name="Temperature"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart 2: Humidity */}
      {monthlyData.length > 0 && (
        <div className="chart-container">
          <h2 className="card-title">💧 Humidity Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(str) => new Date(str).toLocaleDateString()}
                minTickGap={40}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceArea y1={30} y2={60} fill="green" fillOpacity={0.2} />
              <ReferenceArea y1={0} y2={30} fill="orange" fillOpacity={0.1} />
              <ReferenceArea y1={60} y2={100} fill="orange" fillOpacity={0.1} />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#38bdf8"
                name="Humidity"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart 3: Wind Speed */}
      {monthlyData.length > 0 && (
        <div className="chart-container">
          <h2 className="card-title">🌬️ Wind Speed Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(str) => new Date(str).toLocaleDateString()}
                minTickGap={40}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="wind_speed"
                stroke="#10b981"
                name="Wind Speed"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
