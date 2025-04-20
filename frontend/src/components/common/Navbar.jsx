import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/aqicn", label: "AQICN", icon: "🌫️" },
    { path: "/sensor", label: "Sensor", icon: "📟" },
    { path: "/weather", label: "Weather", icon: "🌦️" },
    { path: "/forecast", label: "Forecast", icon: "🔮" },
  ];

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">BreatheEasy 🌿</Link>
      </div>
      <ul className="nav-links">
        {links.map(link => (
          <li key={link.path} className={location.pathname === link.path ? 'active' : ''}>
            <Link to={link.path} title={link.label}>
              <span role="img" aria-label={link.label}>{link.icon}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
