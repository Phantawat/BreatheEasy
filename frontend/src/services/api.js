import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
});

export const stationsApi = {
    getAll: () => api.get('/stations'),
    getById: (id) => api.get(`/stations/${id}`),
    create: (data) => api.post('/stations', data),
};

export const readingsApi = {
    getCurrent: () => api.get('/readings/current'),
    getHistorical: (params) => api.get('/readings/historical', { params }),
    create: (data) => api.post('/readings', data),
};

export const predictionsApi = {
    predict: (data) => api.post('/predictions', data),
};

export default api;