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
  const [selectedDate, setSelectedDate] = useState('');
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

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
      } catch (err) {
        console.error("AQICN fetch error:", err);
        setError("Failed to load AQICN data.");
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

      {/* Grid: Selector (Left) + Latest AQI (Right) */}
      <div className="aqicn-grid-row">
        {/* Date Selector */}
        <div className="aqicn-card narrow">
          <h2 className="aqicn-title">📆 Select Date</h2>
          <form onSubmit={handleSubmit} className="aqicn-date-form">
            <div className="aqicn-form-group">
              <label htmlFor="date-picker">Select a date:</label>
              <input
                type="date"
                id="date-picker"
                value={selectedDate}
                onChange={handleDateChange}
                className="aqicn-date-input"
              />
            </div>
            <button 
              type="submit" 
              className="aqicn-button"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Data'}
            </button>
          </form>
        </div>

        {/* Latest AQI Data */}
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

      {/* Table: Data by Date */}
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

      {/* No Data Message */}
      {dateData.length === 0 && !loading && selectedDate && !error && (
        <div className="aqicn-card">
          <p className="aqicn-no-data">No data available for {selectedDate}.</p>
        </div>
      )}

      {/* Error & Loading */}
      {error && <p className="aqicn-error">{error}</p>}
      {loading && <p className="aqicn-loading">Loading data...</p>}

      {/* Monthly Line Chart */}
      {monthlyData.length > 0 && (
        <div className="aqicn-chart-container">
          <h2 className="aqicn-title">📈 AQICN Trends This Month</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
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
      )}
    </div>
  );
};

export default AQICNPage;
