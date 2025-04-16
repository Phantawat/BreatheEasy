import React from "react";
import { Route, Routes } from "react-router-dom";
import AQICNPage from "./pages/AQICNPage";
import Dashboard from "./pages/Dashboard";
// import other pages...

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/aqicn" element={<AQICNPage />} />
      {/* <Route path="/sensor" element={<SensorPage />} />
      <Route path="/weather" element={<WeatherPage />} /> */}
      {/* Add 404 route at the end */}
    </Routes>
  );
}

export default AppRoutes;
