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
import '../styles/AQICN.css';

const ThresholdLegend = () => (
  <div className="aqicn-card">
    <h2 className="aqicn-title">📘 PM2.5 Threshold Legend</h2>
    <ul style={{ lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '1rem' }}>
      <li><strong style={{ color: 'green' }}>Green</strong> — Good (0.0 – 12.0)</li>
      <li><strong style={{ color: 'yellow' }}>Yellow</strong> — Moderate (12.1 – 35.4)</li>
      <li><strong style={{ color: 'orange' }}>Orange</strong> — Unhealthy for Sensitive Groups (35.5 – 55.4)</li>
      <li><strong style={{ color: 'red' }}>Red</strong> — Unhealthy (55.5 – 150.4)</li>
      <li><strong style={{ color: 'purple' }}>Purple</strong> — Very Unhealthy (150.5 – 250.4)</li>
      <li><strong style={{ color: 'maroon' }}>Maroon</strong> — Hazardous (250.5 – 500.4)</li>
    </ul>
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
  
        // Fetch available dates
        const datesRes = await aqicnApi.getAvailableDates();
        const dates = datesRes.data;
        setAvailableDates(dates);
  
        // Pick a default date (latest available or today)
        const today = new Date().toISOString().split("T")[0];
        const defaultDate = dates.includes(today) ? today : dates[0];
        setSelectedDate(defaultDate);
  
        // ✅ Immediately fetch that date's data
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
  

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

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
    <div className="aqicn-wrapper">
      <h1 className="aqicn-page-title">🌿 AQICN Dashboard</h1>
      <div className="aqicn-grid-row">
        <div className="aqicn-card narrow">
          <h2 className="aqicn-title">📆 Select Date</h2>
          <form onSubmit={handleSubmit} className="date-form">
            <div className="form-group">
              <label htmlFor="date-picker">Select a date:</label>
              <select
                id="date-picker"
                value={selectedDate}
                onChange={handleDateChange}
                className="date-input"
              >
                {availableDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Loading...' : 'Get Data'}
            </button>
          </form>
        </div>

        {latestData && (
          <div className="aqicn-card wide">
            <h2 className="aqicn-title">🌫️ Latest Air Quality</h2>
            <div className="aqicn-details">
              <p><strong>📅 Timestamp:</strong><br /> {new Date(latestData.ts).toLocaleString()}</p>
              <p><strong>🌬️ PM2.5:</strong> {latestData.pm25}</p>
              <p><strong>🌪️ PM10:</strong> {latestData.pm10}</p>
              <p><strong>📈 AQI Score:</strong> {latestData.aqi_score}</p>
            </div>
          </div>
        )}
      </div>

      {dateData.length > 0 && (
        <div className="aqicn-card">
          <h2 className="aqicn-title">🗓️ Air Quality for {selectedDate}</h2>
          <div className="aqicn-table-container">
            <table className="aqicn-table">
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

      {dateData.length === 0 && !loading && selectedDate && !error && (
        <div className="aqicn-card">
          <p className="aqicn-no-data">No data available for {selectedDate}.</p>
        </div>
      )}

      {error && <p className="aqicn-error">{error}</p>}
      {loading && <p className="aqicn-loading">Loading data...</p>}

      <ThresholdLegend />

      {/* Chart 1: PM2.5 */}
      {monthlyData.length > 0 && (
        <div className="aqicn-chart-container">
          <h2 className="aqicn-title">📊 PM2.5 Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(str) => new Date(str).toLocaleDateString()}
                minTickGap={40}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceArea y1={0} y2={12.0} fill="green" fillOpacity={0.2} />
              <ReferenceArea y1={12.1} y2={35.4} fill="yellow" fillOpacity={0.2} />
              <ReferenceArea y1={35.5} y2={55.4} fill="orange" fillOpacity={0.2} />
              <ReferenceArea y1={55.5} y2={150.4} fill="red" fillOpacity={0.2} />
              <ReferenceArea y1={150.5} y2={250.4} fill="purple" fillOpacity={0.2} />
              <ReferenceArea y1={250.5} y2={500.4} fill="maroon" fillOpacity={0.2} />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#f97316"
                name="PM2.5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart 2: PM10 */}
      {monthlyData.length > 0 && (
        <div className="aqicn-chart-container">
          <h2 className="aqicn-title">📊 PM10 Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(str) => new Date(str).toLocaleDateString()}
                minTickGap={40}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceArea y1={0} y2={54} fill="green" fillOpacity={0.2} />
              <ReferenceArea y1={55} y2={154} fill="yellow" fillOpacity={0.2} />
              <ReferenceArea y1={155} y2={500} fill="red" fillOpacity={0.2} />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#38bdf8"
                name="PM10"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AQICNPage;