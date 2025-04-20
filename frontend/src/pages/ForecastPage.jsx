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
  <div className="card legend vibrant-border gradient-bg">
    <h2 className="card-title gradient-text">📘 Threshold Key</h2>
    <ul className="legend-list">
      <li><strong className="green">Green</strong> — Good / Optimal levels</li>
      <li><strong className="yellow">Yellow</strong> — Moderate levels</li>
      <li><strong className="orange">Orange</strong> — Caution / Less optimal</li>
      <li><strong className="red">Red</strong> — High / Unhealthy levels</li>
      <li><strong className="lightblue">Light Blue</strong> — Comfortable temperature</li>
    </ul>
  </div>
);

// Custom toggle switch component
const ToggleSwitch = ({ label, checked, onChange, disabled }) => (
  <div className="toggle-switch-container">
    <span className={`toggle-label ${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>{label}</span>
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="toggle-slider"></span>
    </label>
  </div>
);

const ForecastPage = () => {
  const [forecastData, setForecastData] = useState([]);
  const [selectedModel, setSelectedModel] = useState('basic');
  const [targets, setTargets] = useState({ indoor: true, outdoor: false });
  const [hours, setHours] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchForecast = async () => {
    setLoading(true);
    setForecastData([]);
    setError('');
    try {
      let allData = [];
      if (targets.indoor) {
        const res = await forecastApi.getIndoorForecast(selectedModel, hours);
        allData = allData.concat(res.data.forecast);
      }
      if (targets.outdoor) {
        const res = await forecastApi.getOutdoorForecast(hours);
        allData = allData.concat(res.data.forecast);
      }
      const formatted = allData.map(item => ({
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

  const toggleTarget = (key) => {
    // When toggling a data source, automatically disable the other
    if (targets[key]) {
      // If we're trying to uncheck the only checked source, prevent it
      const otherKey = key === 'indoor' ? 'outdoor' : 'indoor';
      if (!targets[otherKey]) {
        return; // Prevent unchecking the only source
      }
    }
    setTargets({
      indoor: key === 'indoor' ? !targets.indoor : false,
      outdoor: key === 'outdoor' ? !targets.outdoor : false
    });
  };

  // Chart color schemes with more variety
  const chartColorSchemes = {
    temperature: ['#f97316', '#ef4444', '#2563eb'],
    humidity: ['#38bdf8', '#3b82f6', '#0ea5e9'],
    pm25: ['#16a34a', '#84cc16', '#eab308'],
    pm10: ['#6366f1', '#8b5cf6', '#d946ef']
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title gradient-text">📈 Forecasting Dashboard</h1>

      <div className="card fade-in full-width centered neon-border vibrant-bg">
        <h2 className="card-title">⚙️ Forecast Settings</h2>

        <div className="form-group toggle-group">
          <label className="highlighted-label">Data Source:</label>
          <div className="toggle-switches-row">
            <ToggleSwitch 
              label="Indoor" 
              checked={targets.indoor} 
              onChange={() => toggleTarget('indoor')}
              disabled={loading}
            />
            <ToggleSwitch 
              label="Outdoor" 
              checked={targets.outdoor} 
              onChange={() => toggleTarget('outdoor')}
              disabled={loading}
            />
          </div>
        </div>

        {targets.indoor && (
          <div className="form-group">
            <label className="highlighted-label" htmlFor="model-select">Prediction Model:</label>
            <div className="select-wrapper">
              <select
                id="model-select"
                className="date-input fancy-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={loading}
              >
                <option value="basic">Basic (Indoor only)</option>
                <option value="full">Full (Indoor + Outdoor)</option>
              </select>
              <span className="select-icon">⌄</span>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="highlighted-label" htmlFor="hours-select">Forecast Horizon:</label>
          <div className="select-wrapper">
            <select
              id="hours-select"
              className="date-input fancy-select"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              disabled={loading}
            >
              <option value={6}>6 Hours</option>
              <option value={12}>12 Hours</option>
              <option value={24}>24 Hours</option>
            </select>
            <span className="select-icon">⌄</span>
          </div>
        </div>

        <button 
          className={`button primary full-width glassy ${loading ? 'loading' : ''}`} 
          onClick={fetchForecast} 
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Generate Forecast'}
          {loading && <span className="spinner"></span>}
        </button>

        {error && <p className="error-message subtle-margin-top">{error}</p>}
      </div>

      {forecastData.length > 0 && (
        <>
          {[{
            title: '🌡️ Forecasted Temperature',
            dataKeys: ['temp_in', 'temperature'],
            colorScheme: chartColorSchemes.temperature,
            areas: [
              { y1: 20, y2: 27, color: 'lightblue' },
              { y1: 28, y2: 32, color: 'orange' },
              { y1: 33, y2: 50, color: 'red' }
            ]
          }, {
            title: '💧 Forecasted Humidity',
            dataKeys: ['hum_in', 'humidity'],
            colorScheme: chartColorSchemes.humidity,
            areas: [
              { y1: 30, y2: 60, color: 'green' }
            ]
          }, {
            title: '🌬️ Forecasted PM2.5',
            dataKeys: ['pm25_in', 'pm25'],
            colorScheme: chartColorSchemes.pm25,
            areas: [
              { y1: 0, y2: 12, color: 'green' },
              { y1: 13, y2: 35, color: 'yellow' },
              { y1: 36, y2: 500, color: 'red' }
            ]
          }, {
            title: '🌪️ Forecasted PM10',
            dataKeys: ['pm10_in', 'pm10'],
            colorScheme: chartColorSchemes.pm10,
            areas: [
              { y1: 0, y2: 54, color: 'green' },
              { y1: 55, y2: 154, color: 'yellow' },
              { y1: 155, y2: 500, color: 'red' }
            ]
          }].map(({ title, dataKeys, colorScheme, areas }) =>
            forecastData.some(d => dataKeys.some(key => d[key] !== undefined)) && (
              <div className="chart-container fade-in shadow-md vibrant-border" key={title}>
                <h2 className="card-title subtle-title gradient-text">{title}</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {areas.map(({ y1, y2, color }, i) => (
                      <ReferenceArea key={i} y1={y1} y2={y2} fill={color} fillOpacity={0.2} />
                    ))}
                    {dataKeys.map((key, index) => (
                      <Line 
                        key={key} 
                        type="monotone" 
                        dataKey={key} 
                        stroke={colorScheme[index % colorScheme.length]} 
                        strokeWidth={2} 
                        dot={false} 
                        name={key.includes('_') ? key.replace('_', ' ').toUpperCase() : key.toUpperCase()} 
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )
          )}
        </>
      )}

      <ThresholdLegend />
    </div>
  );
};

export default ForecastPage;