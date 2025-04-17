import React, { useEffect, useState } from 'react';
import { aqicnApi } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import '../styles/AQICN.css';

const AQICNPage = () => {
  const [latestData, setLatestData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestRes = await aqicnApi.getLatestData();
        setLatestData(latestRes.data);
  
        const monthlyRes = await aqicnApi.getMonthlyData();
        const monthly = monthlyRes.data.map(item => ({
          ...item,
          timestamp: new Date(item.ts).toLocaleString(),
        }));
        setMonthlyData(monthly);
      } catch (err) {
        console.error("AQICN fetch error:", err);
        setError("Failed to load AQICN data.");
      }
    };
  
    fetchData();
  }, []);
  

  if (error) return <p className="aqicn-error">{error}</p>;
  if (!latestData || monthlyData.length === 0)
    return <p className="aqicn-loading">Loading AQICN data...</p>;

  return (
    <div className="aqicn-wrapper">
      <h1 className="aqicn-page-title">🌿 AQICN Dashboard</h1>

      {/* Latest Card */}
      <div className="aqicn-card">
        <h2 className="aqicn-title">🌫️ Latest Air Quality</h2>
        <div className="aqicn-details">
          <p><strong>📅 Timestamp:</strong><br /> {new Date(latestData.ts).toLocaleString()}</p>
          <p><strong>🌬️ PM2.5:</strong> {latestData.pm25}</p>
          <p><strong>🌪️ PM10:</strong> {latestData.pm10}</p>
          <p><strong>📈 AQI Score:</strong> {latestData.aqi_score}</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="aqicn-chart-container">
        <h2 className="aqicn-title">📈 AQICN Trends This Month</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" minTickGap={20} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pm25" stroke="#f97316" name="PM2.5" strokeWidth={2} />
            <Line type="monotone" dataKey="pm10" stroke="#38bdf8" name="PM10" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AQICNPage;
