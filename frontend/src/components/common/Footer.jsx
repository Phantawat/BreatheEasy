import React from "react";
import { FaGithub, FaHeart } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <p className="copyright">
            &copy; {new Date().getFullYear()} BreatheEasy Air Quality Monitoring System
          </p>
          <span className="divider">|</span>
          <p className="made-with">
            Made with <FaHeart className="heart-icon" /> for cleaner air
          </p>
        </div>
        <div className="footer-links">
          <a 
            href="https://github.com/Phantawat/BreatheEasy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <FaGithub className="github-icon" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;