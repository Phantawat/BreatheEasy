import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaWind } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle scroll for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/aqicn", label: "AQICN", icon: "🌫️" },
    { path: "/sensor", label: "Sensor", icon: "📟" },
    { path: "/weather", label: "Weather", icon: "🌦️" },
    { path: "/forecast", label: "Forecast", icon: "🔮" },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <FaWind className="logo-icon" />
            <span className="logo-text">BreatheEasy</span>
            <span className="logo-badge">Air</span>
          </Link>
        </div>
        
        <button 
          className={`mobile-toggle ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          {links.map(link => (
            <li 
              key={link.path} 
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
            >
              <Link to={link.path}>
                <span className="nav-icon" role="img" aria-label={link.label}>
                  {link.icon}
                </span>
                <span className="nav-label">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;