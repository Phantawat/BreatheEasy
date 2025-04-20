import React, { useState } from 'react';
import { forecastApi } from '../services/api';
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

const ForecastPage = () => {
  const [forecastData, setForecastData] = useState([]);
  const [selectedModel, setSelectedModel] = useState('basic');
  const [target, setTarget] = useState('indoor');
  const [hours, setHours] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchForecast = async () => {
    setLoading(true);
    setForecastData([]);
    setError('');
    try {
      const response = target === 'indoor'
        ? await forecastApi.getIndoorForecast(selectedModel, hours)
        : await forecastApi.getOutdoorForecast(hours);

      const formatted = response.data.forecast.map(item => ({
        ...item,
        timestamp: new Date(item.time).toLocaleString(),
      }));
      setForecastData(formatted);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch forecast data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Forecasting</h1>

      <div className="grid-row">
        <div className="card narrow">
          <h2 className="card-title">⚙️ Options</h2>
          <div className="form-group">
            <label htmlFor="target-select">Target:</label>
            <select
              id="target-select"
              className="date-input"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={loading}
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          {target === 'indoor' && (
            <div className="form-group">
              <label htmlFor="model-select">Prediction Model:</label>
              <select
                id="model-select"
                className="date-input"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={loading}
              >
                <option value="basic">Basic (Indoor only)</option>
                <option value="full">Full (Indoor + Outdoor)</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="hours-select">Forecast Horizon:</label>
            <select
              id="hours-select"
              className="date-input"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              disabled={loading}
            >
              <option value={6}>6 Hours</option>
              <option value={12}>12 Hours</option>
              <option value={24}>24 Hours</option>
            </select>
          </div>

          <button className="button" onClick={fetchForecast} disabled={loading}>
            {loading ? 'Loading...' : 'Predict!'}
          </button>

          {error && <p className="error" style={{ marginTop: '0.5rem' }}>{error}</p>}
        </div>
      </div>

      {forecastData.length > 0 && (
        <>
          {/* Temperature */}
          <div className="chart-container">
            <h2 className="card-title">🌡️ Forecasted Temperature</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={20} y2={27} fill="lightblue" fillOpacity={0.2} />
                <ReferenceArea y1={28} y2={32} fill="orange" fillOpacity={0.2} />
                <ReferenceArea y1={33} y2={50} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="temp_in" stroke="#f97316" name="Temperature (°C)" />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity */}
          <div className="chart-container">
            <h2 className="card-title">💧 Forecasted Humidity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={30} y2={60} fill="green" fillOpacity={0.2} />
                <Line type="monotone" dataKey="hum_in" stroke="#38bdf8" name="Humidity (%)" />
                <Line type="monotone" dataKey="humidity" stroke="#38bdf8" name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PM2.5 */}
          {forecastData.some(d => d.pm25_in !== undefined || d.pm25 !== undefined) && (
            <div className="chart-container">
              <h2 className="card-title">🌬️ Forecasted PM2.5</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceArea y1={0} y2={12} fill="green" fillOpacity={0.2} />
                  <ReferenceArea y1={13} y2={35} fill="yellow" fillOpacity={0.2} />
                  <ReferenceArea y1={36} y2={500} fill="red" fillOpacity={0.2} />
                  <Line type="monotone" dataKey="pm25_in" stroke="#16a34a" name="PM2.5" />
                  <Line type="monotone" dataKey="pm25" stroke="#16a34a" name="PM2.5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* PM10 */}
          {forecastData.some(d => d.pm10_in !== undefined || d.pm10 !== undefined) && (
            <div className="chart-container">
              <h2 className="card-title">🌪️ Forecasted PM10</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceArea y1={0} y2={54} fill="green" fillOpacity={0.2} />
                  <ReferenceArea y1={55} y2={154} fill="yellow" fillOpacity={0.2} />
                  <ReferenceArea y1={155} y2={500} fill="red" fillOpacity={0.2} />
                  <Line type="monotone" dataKey="pm10_in" stroke="#6366f1" name="PM10" />
                  <Line type="monotone" dataKey="pm10" stroke="#6366f1" name="PM10" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      <ThresholdLegend />
    </div>
  );
};

export default ForecastPage;
