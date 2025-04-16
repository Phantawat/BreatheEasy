import React, { useEffect, useState } from 'react';
import { aqicnApi } from '../services/api';

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

  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!data) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#333' }}>Latest Air Quality</h2>
      <div style={{ lineHeight: '1.6', color: '#555' }}>
        <p><strong>Timestamp:</strong><br /> {new Date(data.ts).toLocaleString()}</p>
        <p><strong>PM2.5:</strong> {data.pm25}</p>
        <p><strong>PM10:</strong> {data.pm10}</p>
        <p><strong>AQI Score:</strong> {data.aqi_score}</p>
      </div>
    </div>
  );
};

export default LatestAQICN;
