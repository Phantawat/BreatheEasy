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
  <div className="card vibrant-bg neon-border shadow-md fade-in">
    <h2 className="subtle-title ">📘 Threshold Key</h2>
    <div className="legend">
      <ul className="legend-list">
        <li><strong className="green">Green</strong> — Optimal Comfort (Humidity 30-60%)</li>
        <li><strong className="yellow">Yellow</strong> — Moderate Discomfort</li>
        <li><strong className="orange">Orange</strong> — Hot / Dry Zones</li>
        <li><strong className="red">Red</strong> — High Temperature or Humidity</li>
        <li><strong className="lightblue">Light Blue</strong> — Comfortable Temperature</li>
      </ul>
    </div>
  </div>
);

const WeatherPage = () => {
  const [latestData, setLatestData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dateData, setDateData] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
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

        const datesRes = await weatherApi.getAvailableDates();
        setAvailableDates(datesRes.data);

        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(datesRes.data.includes(today) ? today : datesRes.data[0] || '');
      } catch (err) {
        console.error("Weather data fetch error:", err);
        setError("Failed to load weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleDateChange = (e) => setSelectedDate(e.target.value);

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
    <div className="page-wrapper gradient-bg">
      <h1 className="page-title">🌦️ Weather Dashboard</h1>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card vibrant-bg vibrant-border shadow-md" style={{ flex: '1', minWidth: '250px' }}>
          <h2 className="subtle-title">📆 Select Date</h2>
          <form onSubmit={handleSubmit} className="date-form">
            <div className="form-group">
              <label htmlFor="date-picker" className="highlighted-label">Select a date:</label>
              <div className="select-wrapper">
                <select
                  id="date-picker"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="fancy-select"
                >
                  {availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
                <div className="select-icon">▼</div>
              </div>
            </div>
            <button type="submit" className="button primary glassy full-width">
              {loading ? 'Loading...' : 'Get Data'}
            </button>
          </form>
        </div>

        {latestData && (
          <div className="card gradient-bg vibrant-border shadow-md" style={{ flex: '2', minWidth: '300px' }}>
            <h2 className="subtle-title">🔍 Latest Weather Reading</h2>
            <div style={{
              display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '1rem'
            }}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>{latestData.temperature}°C</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>Temperature</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>{latestData.humidity}%</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>Humidity</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{latestData.wind_speed} m/s</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>Wind Speed</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              Last Updated: {new Date(latestData.ts).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {!loading && dateData.length > 0 && (
        <div className="card vibrant-bg shadow-md fade-in">
          <h2 className="subtle-title">🗓️ Weather Data for {selectedDate}</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Temperature (°C)</th>
                  <th>Humidity (%)</th>
                  <th>Wind Speed (m/s)</th>
                </tr>
              </thead>
              <tbody>
                {dateData.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{item.temperature}</td>
                    <td>{item.humidity}</td>
                    <td>{item.wind_speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      <ThresholdLegend />

      {monthlyData.length > 0 && (
        <>
          {/* Temperature */}
          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title">🌡️ Temperature Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={20} y2={27} fill="lightblue" fillOpacity={0.2} />
                <ReferenceArea y1={28} y2={32} fill="orange" fillOpacity={0.2} />
                <ReferenceArea y1={33} y2={50} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity */}
          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title">💧 Humidity Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={30} y2={60} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={0} y2={30} fill="orange" fillOpacity={0.1} />
                <ReferenceArea y1={60} y2={100} fill="orange" fillOpacity={0.1} />
                <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wind Speed */}
          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title">🌬️ Wind Speed Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="wind_speed" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPage;
