// src/components/aqicn/AQIInfoCard.js
import React from 'react';
import Card from '../common/Card';

const AQIInfoCard = () => {
  return (
    <Card title="Understanding AQI" className="aqi-info-card">
      <div className="aqi-levels">
        <h4>AQI Levels and What They Mean</h4>
        
        <div className="aqi-level" style={{ borderLeft: '4px solid #00e400' }}>
          <div className="level-range">0-50</div>
          <div className="level-info">
            <h5>Good</h5>
            <p>Air quality is satisfactory, and air pollution poses little or no risk.</p>
          </div>
        </div>
        
        <div className="aqi-level" style={{ borderLeft: '4px solid #ffff00' }}>
          <div className="level-range">51-100</div>
          <div className="level-info">
            <h5>Moderate</h5>
            <p>Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.</p>
          </div>
        </div>
        
        <div className="aqi-level" style={{ borderLeft: '4px solid #ff7e00' }}>
          <div className="level-range">101-150</div>
          <div className="level-info">
            <h5>Unhealthy for Sensitive Groups</h5>
            <p>Members of sensitive groups may experience health effects. The general public is less likely to be affected.</p>
          </div>
        </div>
        
        <div className="aqi-level" style={{ borderLeft: '4px solid #ff0000' }}>
          <div className="level-range">151-200</div>
          <div className="level-info">
            <h5>Unhealthy</h5>
            <p>Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.</p>
          </div>
        </div>
        
        <div className="aqi-level" style={{ borderLeft: '4px solid #99004c' }}>
          <div className="level-range">201-300</div>
          <div className="level-info">
            <h5>Very Unhealthy</h5>
            <p>Health alert: The risk of health effects is increased for everyone.</p>
          </div>
        </div>
        
        <div className="aqi-level" style={{ borderLeft: '4px solid #7e0023' }}>
          <div className="level-range">301+</div>
          <div className="level-info">
            <h5>Hazardous</h5>
            <p>Health warning of emergency conditions: everyone is more likely to be affected.</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AQIInfoCard;