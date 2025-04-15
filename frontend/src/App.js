// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;