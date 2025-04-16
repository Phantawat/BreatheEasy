// src/components/dashboard/AQIChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const AQIChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <Card title="Historical AQI"><p>No historical data available</p></Card>;
  }

  // Process the data for charting
  const chartData = data.map(reading => {
    // Calculate AQI based on PM2.5 (simplified)
    const pm25 = reading.pm25 || 0;
    let aqi = 0;
    
    if (pm25 <= 12) {
      aqi = (50/12) * pm25;
    } else if (pm25 <= 35.4) {
      aqi = 50 + ((100-50)/(35.4-12.1)) * (pm25-12.1);
    } else if (pm25 <= 55.4) {
      aqi = 100 + ((150-100)/(55.4-35.5)) * (pm25-35.5);
    } else {
      aqi = 150 + ((200-150)/(150.4-55.5)) * (pm25-55.5);
    }
    
    return {
      time: new Date(reading.timestamp).toLocaleTimeString(),
      aqi: Math.round(aqi),
      pm25: reading.pm25,
      pm10: reading.pm10
    };
  });

  return (
    <Card title="Historical AQI">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="aqi" stroke="#8884d8" name="AQI" />
          <Line type="monotone" dataKey="pm25" stroke="#82ca9d" name="PM2.5" />
          <Line type="monotone" dataKey="pm10" stroke="#ffc658" name="PM10" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AQIChart;