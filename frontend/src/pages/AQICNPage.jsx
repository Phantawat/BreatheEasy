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
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import '../styles/Shared.css';

const ThresholdLegend = () => (
  <div className="card vibrant-bg neon-border shadow-md fade-in">
    <h2 className="subtle-title gradient-text">📘 PM2.5 Threshold Legend</h2>
    <div className="legend">
      <ul className="legend-list">
        <li><strong className="green">Green</strong> — Good (0.0 – 12.0)</li>
        <li><strong className="yellow">Yellow</strong> — Moderate (12.1 – 35.4)</li>
        <li><strong className="orange">Orange</strong> — Unhealthy for Sensitive Groups (35.5 – 55.4)</li>
        <li><strong className="red">Red</strong> — Unhealthy (55.5 – 150.4)</li>
        <li><strong className="purple">Purple</strong> — Very Unhealthy (150.5 – 250.4)</li>
        <li><strong className="maroon">Maroon</strong> — Hazardous (250.5 – 500.4)</li>
      </ul>
    </div>
  </div>
);

const AQICNPage = () => {
  const [latestData, setLatestData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const latestRes = await aqicnApi.getLatestData();
        setLatestData(latestRes.data);

        const monthlyRes = await aqicnApi.getMonthlyData();
        const monthly = monthlyRes.data.map(item => ({
          ...item,
          timestamp: new Date(item.ts).toLocaleString(),
        }));
        setMonthlyData(monthly);

        const datesRes = await aqicnApi.getAvailableDates();
        const dates = datesRes.data;
        setAvailableDates(dates);

        const today = new Date().toISOString().split("T")[0];
        const defaultDate = dates.includes(today) ? today : dates[0];
        setSelectedDate(defaultDate);

        const response = await aqicnApi.getDataByDate(defaultDate);
        setDateData(response.data);
        setError('');
      } catch (err) {
        console.error("AQICN fetch error:", err);
        setError("Failed to load AQICN data.");
        setDateData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const fetchDateData = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const response = await aqicnApi.getDataByDate(selectedDate);
      setDateData(response.data);
      setError('');
    } catch (err) {
      console.error("AQICN date fetch error:", err);
      setError(`Failed to load data for ${selectedDate}.`);
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
    <div className="page-wrapper gradient-bg">
      <h1 className="page-title gradient-text">🌿 AQICN Dashboard</h1>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card vibrant-bg vibrant-border shadow-md" style={{ flex: '1', minWidth: '250px' }}>
          <h2 className="subtle-title gradient-text">📆 Select Date</h2>
          <form onSubmit={handleSubmit} className="date-form">
            <div className="form-group">
              <label htmlFor="date-picker" className="highlighted-label">Select a date:</label>
              <div className="select-wrapper">
                <select
                  id="date-picker"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="fancy-select"
                >
                  {availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
                <div className="select-icon">▼</div>
              </div>
            </div>
            <button type="submit" className="button primary glassy full-width">
              {loading ? 'Loading...' : 'Get Data'}
            </button>
          </form>
        </div>

        {latestData && (
          <div className="card gradient-bg vibrant-border shadow-md" style={{ flex: '2', minWidth: '300px' }}>
            <h2 className="subtle-title gradient-text">🌫️ Latest Air Quality</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>{latestData.pm25}</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>PM2.5</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>{latestData.pm10}</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>PM10</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{latestData.aqi_score}</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>AQI Score</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              Last Updated: {new Date(latestData.ts).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {dateData.length > 0 && (
        <div className="card vibrant-bg shadow-md fade-in">
          <h2 className="subtle-title gradient-text">🗓️ Air Quality for {selectedDate}</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>PM2.5</th>
                  <th>PM10</th>
                  <th>AQI Score</th>
                </tr>
              </thead>
              <tbody>
                {dateData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.time || new Date(item.ts).toLocaleTimeString()}</td>
                    <td>{item.pm25}</td>
                    <td>{item.pm10}</td>
                    <td>{item.aqi_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {loading && <p className="loading subtle-margin-top">Loading data...</p>}

      <ThresholdLegend />

      {monthlyData.length > 0 && (
        <>
          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title gradient-text">📊 PM2.5 Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={0} y2={12.0} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={12.1} y2={35.4} fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={35.5} y2={55.4} fill="orange" fillOpacity={0.2} />
                <ReferenceArea y1={55.5} y2={150.4} fill="red" fillOpacity={0.2} />
                <ReferenceArea y1={150.5} y2={250.4} fill="purple" fillOpacity={0.2} />
                <ReferenceArea y1={250.5} y2={500.4} fill="maroon" fillOpacity={0.2} />
                <Line type="monotone" dataKey="pm25" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card vibrant-bg shadow-md fade-in chart-container">
            <h2 className="subtle-title gradient-text">📊 PM10 Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={0} y2={54} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={55} y2={154} fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={155} y2={500} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="pm10" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AQICNPage;
