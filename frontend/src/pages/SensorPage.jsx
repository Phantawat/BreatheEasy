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
          timestamp: new Date(item.timestamp).toLocaleString(),
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchDateData = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const response = await sensorApi.getDataByDate(selectedDate);
      setDateData(response.data);
      setError('');
    } catch (err) {
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
      <h1 className="page-title">📟 Sensor Dashboard</h1>
      <div className="grid-row">
      <div className="card narrow">
        <h2 className="card-title">📆 Select Date</h2>
        <form onSubmit={handleSubmit} className="date-form">
            <div className="form-group">
            <label htmlFor="date-picker">Select a date:</label>
            <select
                id="date-picker"
                value={selectedDate}
                onChange={handleDateChange}
                className="date-input"
            >
                {availableDates.map(date => (
                <option key={date} value={date}>{date}</option>
                ))}
            </select>
            </div>
            <button type="submit" className="button" disabled={loading}>
            {loading ? 'Loading...' : 'Get Data'}
            </button>
            {error && <p className="error" style={{ marginTop: '0.5rem' }}>{error}</p>}
        </form>
        </div>


        {latestData && (
          <div className="card wide">
            <h2 className="card-title">🔍 Latest Sensor Reading</h2>
            <div className="details">
              <p><strong>📅 Timestamp:</strong><br /> {new Date(latestData.timestamp).toLocaleString()}</p>
              <p><strong>🌡️ Temperature:</strong> {latestData.temperature} °C</p>
              <p><strong>💧 Humidity:</strong> {latestData.humidity} %</p>
              <p><strong>🌬️ PM2.5:</strong> {latestData.pm25}</p>
              <p><strong>🌪️ PM10:</strong> {latestData.pm10}</p>
              <p><strong>📍 Location:</strong> {latestData.latitude}, {latestData.longitude}</p>
              <p><strong>🏠 Room ID:</strong> {latestData.room_id}</p>
            </div>
          </div>
        )}
      </div>

      {/* Table: Sensor Data for Selected Date */}
      {dateData.length > 0 && (
        <div className="card">
          <h2 className="card-title">🗓️ Sensor Data for {selectedDate}</h2>
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
                    <td>{new Date(item.timestamp).toLocaleTimeString()}</td>
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

    {dateData.length === 0 && !loading && selectedDate && !error && (
        <div className="aqicn-card">
          <p className="aqicn-no-data">No data available for {selectedDate}.</p>
        </div>
      )}

      <ThresholdLegend />

      {/* Charts with thresholds */}
      {monthlyData.length > 0 && (
        <>
          {/* Temperature */}
          <div className="chart-container">
            <h2 className="card-title">🌡️ Temperature Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={20} y2={27} fill="lightblue" fillOpacity={0.2} />
                <ReferenceArea y1={28} y2={32} fill="orange" fillOpacity={0.2} />
                <ReferenceArea y1={33} y2={50} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} name="Temperature" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity */}
          <div className="chart-container">
            <h2 className="card-title">💧 Humidity Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={30} y2={60} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={0} y2={30} fill="orange" fillOpacity={0.1} />
                <ReferenceArea y1={60} y2={100} fill="orange" fillOpacity={0.1} />
                <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} dot={false} name="Humidity" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PM2.5 */}
          <div className="chart-container">
            <h2 className="card-title">🌬️ PM2.5 Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={0} y2={12} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={13} y2={35} fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={36} y2={500} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="pm25" stroke="#16a34a" strokeWidth={2} dot={false} name="PM2.5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PM10 */}
          <div className="chart-container">
            <h2 className="card-title">🌪️ PM10 Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={0} y2={54} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={55} y2={154} fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={155} y2={500} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="pm10" stroke="#6366f1" strokeWidth={2} dot={false} name="PM10" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default SensorPage;
