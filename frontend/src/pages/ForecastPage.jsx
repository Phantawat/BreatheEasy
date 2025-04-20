import React, { useEffect, useState } from 'react';
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

const OutdoorForecastPage = () => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await forecastApi.getOutdoorForecast();
        const formatted = response.data.forecast.map((item) => ({
          ...item,
          timestamp: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setForecast(formatted);
      } catch (err) {
        console.error(err);
        setError('Failed to load outdoor forecast.');
      }
    };
    fetchForecast();
  }, []);

  return (
    <div className="page-wrapper">
      <h1 className="page-title">🌤️ Outdoor Forecast (Next 6 Hours)</h1>
      {error && <p className="error">{error}</p>}

      {forecast.length > 0 && (
        <>
          {/* Temperature */}
          <div className="chart-container">
            <h2 className="card-title">🌡️ Temperature</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={20} y2={27} fill="lightblue" fillOpacity={0.2} />
                <ReferenceArea y1={28} y2={32} fill="orange" fillOpacity={0.2} />
                <ReferenceArea y1={33} y2={50} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" name="Temp (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity */}
          <div className="chart-container">
            <h2 className="card-title">💧 Humidity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={30} y2={60} fill="green" fillOpacity={0.2} />
                <Line type="monotone" dataKey="humidity" stroke="#38bdf8" name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PM2.5 */}
          <div className="chart-container">
            <h2 className="card-title">🌬️ PM2.5</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={0} y2={12} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={13} y2={35} fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={36} y2={500} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="pm25" stroke="#16a34a" name="PM2.5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PM10 */}
          <div className="chart-container">
            <h2 className="card-title">🌪️ PM10</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={0} y2={54} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={55} y2={154} fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={155} y2={500} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="pm10" stroke="#6366f1" name="PM10" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default OutdoorForecastPage;
