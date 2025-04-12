import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AQICNPage from './pages/AQICNPage';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/aqicn" element={<AQICNPage />} />
    </Routes>
  );
}

export default AppRoutes;