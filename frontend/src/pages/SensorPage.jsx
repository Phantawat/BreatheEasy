import React, { useEffect, useState } from 'react';
import { sensorApi } from '../services/api';
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
    <h2 className="subtle-title gradient-text">📘 Threshold Key</h2>
    <div className="legend">
      <ul className="legend-list">
        <li><strong className="green">Green</strong> — Good PM2.5 & PM10 levels</li>
        <li><strong className="yellow">Yellow</strong> — Moderate concern</li>
        <li><strong className="orange">Orange</strong> — Unhealthy for Sensitive Groups</li>
        <li><strong className="red">Red</strong> — Unhealthy / Hazardous</li>
      </ul>
    </div>
  </div>
);

const SensorPage = () => {
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
        const latestRes = await sensorApi.getLatestData();
        setLatestData(latestRes.data);

        const monthlyRes = await sensorApi.getMonthlyData();
        const monthly = monthlyRes.data.map(item => ({
          ...item,
          timestamp: new Date(item.ts).toLocaleString(),
        }));
        setMonthlyData(monthly);

        const datesRes = await sensorApi.getAvailableDates();
        setAvailableDates(datesRes.data);

        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(datesRes.data.includes(today) ? today : datesRes.data[0] || '');
      } catch (err) {
        console.error("Sensor fetch error:", err);
        setError("Failed to load sensor data.");
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
      const response = await sensorApi.getDataByDate(selectedDate);
      setDateData(response.data);
      setError('');
    } catch (err) {
      setDateData([]);
      setError("Failed to fetch data for selected date.");
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
      <h1 className="page-title gradient-text">📟 Sensor Dashboard</h1>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card vibrant-bg vibrant-border shadow-md" style={{ flex: '1', minWidth: '250px' }}>
          <h2 className="subtle-title gradient-text">📆 Select Date</h2>
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
            <h2 className="subtle-title gradient-text">🔍 Latest Sensor Reading</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>{latestData.temperature}°C</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>Temperature</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>{latestData.humidity}%</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>Humidity</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{latestData.pm25}</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>PM2.5</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366f1' }}>{latestData.pm10}</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>PM10</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              Last Updated: {new Date(latestData.ts).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Date-based Table */}
      {dateData.length > 0 && (
        <div className="card vibrant-bg shadow-md fade-in">
          <h2 className="subtle-title gradient-text">🗓️ Sensor Data for {selectedDate}</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Temperature (°C)</th>
                  <th>Humidity (%)</th>
                  <th>PM2.5</th>
                  <th>PM10</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Room ID</th>
                </tr>
              </thead>
              <tbody>
                {dateData.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.ts).toLocaleTimeString()}</td>
                    <td>{item.temperature}</td>
                    <td>{item.humidity}</td>
                    <td>{item.pm25}</td>
                    <td>{item.pm10}</td>
                    <td>{item.latitude}</td>
                    <td>{item.longitude}</td>
                    <td>{item.room_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {loading && <p className="loading subtle-margin-top">Loading data...</p>}

      <ThresholdLegend />

      {/* Charts */}
      {monthlyData.length > 0 && (
        <>
          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title gradient-text">🌡️ Temperature Trends</h2>
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

          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title gradient-text">💧 Humidity Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={30} y2={60} fill="green" fillOpacity={0.2} />
                <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title gradient-text">🌬️ PM2.5 Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={0} y2={12} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={13} y2={35} fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={36} y2={500} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="pm25" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title gradient-text">🌪️ PM10 Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={0} y2={54} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={55} y2={154} fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={155} y2={500} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="pm10" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default SensorPage;