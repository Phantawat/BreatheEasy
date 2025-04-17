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
}

export const sensorApi = {
    getAllData: () => api.get('/sensor'),
    getDataById: (id) => api.get(`/sensor/${id}`),
    getDataByDate: (date) => api.get(`/sensor/date/${date}`),
    getLatestData: () => api.get('/sensor/latest'),
}

export const weatherApi = {
    getAllData: () => api.get('/weather'),
    getDataById: (id) => api.get(`/weather/${id}`),
    getDataByDate: (date) => api.get(`/weather/date/${date}`),
    getLatestData: () => api.get('/weather/latest'),
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function fetchLatestReports() {
    const aqiRes = await aqicnApi.getLatestData();
    await wait(200); // wait 200ms before next request

    const sensorRes = await sensorApi.getLatestData();
    await wait(200); // wait 200ms before next request

    const weatherRes = await weatherApi.getLatestData();

    return {
      aqi: aqiRes.data,
      sensor: sensorRes.data,
      weather: weatherRes.data
    };
}


export default api;