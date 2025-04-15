// src/components/dashboard/CurrentAQIDisplay.js
import React from 'react';
import Card from '../common/Card';
import '../../styles/Dashboard.css';

const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#00e400'; // Good
  if (aqi <= 100) return '#ffff00'; // Moderate
  if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return '#ff0000'; // Unhealthy
  if (aqi <= 300) return '#99004c'; // Very Unhealthy
  return '#7e0023'; // Hazardous
};

const getAQICategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const CurrentAQIDisplay = ({ data }) => {
  if (!data) return null;
  
  // Calculate AQI based on PM2.5 (simplified calculation)
  const pm25 = data.pm25 || 0;
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
  
  aqi = Math.round(aqi);
  const aqiColor = getAQIColor(aqi);
  const category = getAQICategory(aqi);
  
  return (
    <Card className="aqi-card">
      <div className="aqi-display">
        <div className="aqi-value" style={{ backgroundColor: aqiColor }}>
          <h2>{aqi}</h2>
          <p>AQI</p>
        </div>
        <div className="aqi-details">
          <h3>{category}</h3>
          <p>Station: {data.station_name || 'Unknown'}</p>
          <p>Last Updated: {new Date(data.timestamp).toLocaleString()}</p>
        </div>
      </div>
      <div className="pollutant-details">
        <div className="pollutant">
          <span className="label">PM2.5</span>
          <span className="value">{data.pm25} µg/m³</span>
        </div>
        <div className="pollutant">
          <span className="label">PM10</span>
          <span className="value">{data.pm10} µg/m³</span>
        </div>
        <div className="pollutant">
          <span className="label">O₃</span>
          <span className="value">{data.o3} ppb</span>
        </div>
        <div className="pollutant">
          <span className="label">NO₂</span>
          <span className="value">{data.no2} ppb</span>
        </div>
      </div>
    </Card>
  );
};

export default CurrentAQIDisplay;