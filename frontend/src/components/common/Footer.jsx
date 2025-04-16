import React from "react";

const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Air Quality Monitoring System</p>
        </div>
      </footer>
    );
  };

export default Footer;