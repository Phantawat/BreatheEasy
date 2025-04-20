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
  <div className="card fade-in vibrant-border">
    <h2 className="card-title">📘 PM2.5 Threshold Legend</h2>
    <ul className="legend-list">
      <li><strong className="green">Green</strong> — Good (0.0 – 12.0)</li>
      <li><strong className="yellow">Yellow</strong> — Moderate (12.1 – 35.4)</li>
      <li><strong className="orange">Orange</strong> — Unhealthy for Sensitive Groups (35.5 – 55.4)</li>
      <li><strong className="red">Red</strong> — Unhealthy (55.5 – 150.4)</li>
      <li><strong className="purple">Purple</strong> — Very Unhealthy (150.5 – 250.4)</li>
      <li><strong className="maroon">Maroon</strong> — Hazardous (250.5 – 500.4)</li>
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
    <div className="page-wrapper fade-in">
      <h1 className="page-title gradient-text">🌿 AQICN Dashboard</h1>

      <div className="grid-row">
        <div className="card narrow glassy">
          <h2 className="card-title">📆 Select Date</h2>
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
          <div className="card wide glassy">
            <h2 className="card-title">🌫️ Latest Air Quality</h2>
            <div className="details">
              <p><strong>📅 Timestamp:</strong><br /> {new Date(latestData.ts).toLocaleString()}</p>
              <p><strong>🌬️ PM2.5:</strong> {latestData.pm25}</p>
              <p><strong>🌪️ PM10:</strong> {latestData.pm10}</p>
              <p><strong>📈 AQI Score:</strong> {latestData.aqi_score}</p>
            </div>
          </div>
        )}
      </div>

      {dateData.length > 0 && (
        <div className="card">
          <h2 className="card-title">🗓️ Air Quality for {selectedDate}</h2>
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

      {!loading && dateData.length === 0 && selectedDate && !error && (
        <div className="card">
          <p className="no-data">No data available for {selectedDate}.</p>
        </div>
      )}

      {error && <p className="error subtle-margin-top">{error}</p>}
      {loading && <p className="loading subtle-margin-top">Loading data...</p>}

      <ThresholdLegend />

      {/* PM2.5 Chart */}
      {monthlyData.length > 0 && (
        <div className="chart-container fade-in vibrant-border">
          <h2 className="card-title">📊 PM2.5 Trends</h2>
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
              <Line type="monotone" dataKey="pm25" stroke="#f97316" name="PM2.5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* PM10 Chart */}
      {monthlyData.length > 0 && (
        <div className="chart-container fade-in vibrant-border">
          <h2 className="card-title">📊 PM10 Trends</h2>
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
              <Line type="monotone" dataKey="pm10" stroke="#38bdf8" name="PM10" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AQICNPage;
