import React, { useEffect, useState } from 'react';
import { aqicnApi } from '../services/api';
import '../styles/AQICN.css'; // ← import the new CSS

const LatestAQICN = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    aqicnApi.getLatestData()
      .then(response => setData(response.data))
      .catch(error => {
        console.error("Error fetching latest AQICN data:", error);
        setError("Unable to fetch latest AQICN data");
      });
  }, []);

  if (error) return <p className="aqicn-error">{error}</p>;
  if (!data) return <p className="aqicn-loading">Loading...</p>;
  
  return (
    <div className="aqicn-card">
      <h2 className="aqicn-title">🌫️ Latest Air Quality</h2>
      <div className="aqicn-details">
        <p><strong>📅 Timestamp:</strong><br /> {new Date(data.ts).toLocaleString()}</p>
        <p><strong>🌬️ PM2.5:</strong> {data.pm25}</p>
        <p><strong>🌪️ PM10:</strong> {data.pm10}</p>
        <p><strong>📈 AQI Score:</strong> {data.aqi_score}</p>
      </div>
    </div>
  );
};

export default LatestAQICN;
