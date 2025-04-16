import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
        <div className="logo">
            <Link to="/">Air Quality Monitoring</Link>
        </div>
        <ul className="nav-links">
            <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Dashboard</Link>
            </li>
            <li className={location.pathname === '/aqicn' ? 'active' : ''}>
            <Link to="/aqicn">AQICN</Link>
            </li>
        </ul>
        </nav>
    );
};
  
export default Navbar;