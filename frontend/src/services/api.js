import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
});


export const aqicnApi = {
    getAllData: () => api.get('/aqicn'),
    getDataById: (id) => api.get(`/aqicn/${id}`),
    getDataByDate: (date) => api.get(`/aqicn/date/${date}`),
    getLatestData: () => api.get('/aqicn/latest'),
    getMonthlyData: () => api.get('/aqicn/monthly'),
    getAvailableDates: () => api.get('/aqicn/dates'),
}

export const sensorApi = {
    getAllData: () => api.get('/sensor'),
    getDataById: (id) => api.get(`/sensor/${id}`),
    getDataByDate: (date) => api.get(`/sensor/date/${date}`),
    getLatestData: () => api.get('/sensor/latest'),
    getMonthlyData: () => api.get('/sensor/monthly'),
    getAvailableDates: () => api.get('/sensor/dates'),
}

export const weatherApi = {
    getAllData: () => api.get('/weather'),
    getDataById: (id) => api.get(`/weather/${id}`),
    getDataByDate: (date) => api.get(`/weather/date/${date}`),
    getLatestData: () => api.get('/weather/latest'),
    getMonthlyData: () => api.get('/weather/monthly'),
    getAvailableDates: () => api.get('/weather/dates'),
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function fetchLatestReports() {
    let aqi = null, sensor = null, weather = null;
  
    try {
      const res = await aqicnApi.getLatestData();
      aqi = res.data;
    } catch (e) {
      console.error("AQI fetch failed", e);
    }
    await wait(20);
  
    try {
      const res = await sensorApi.getLatestData();
      sensor = res.data;
    } catch (e) {
      console.error("Sensor fetch failed", e);
    }
    await wait(20);
  
    try {
      const res = await weatherApi.getLatestData();
      weather = res.data;
    } catch (e) {
      console.error("Weather fetch failed", e);
    }
  
    return { aqi, sensor, weather };
  }
  


export default api;