import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_inner">
        <div className="brand">
          <Link to="/" className="footer_link">
            Bidverse
          </Link>
          <p className="footer_address">Upper lane, Bengaluru, India</p>
        </div>
        <div className="links">
          <ul>
            <li>
              <Link className="footer_link" to="/">
                Recent bids
              </Link>
            </li>
            <li>
              <Link className="footer_link" to="/products">
                Live bids
              </Link>
            </li>
            <li>
              <Link className="footer_link" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="footer_link" to="/contact">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
        <div className="contact">
          <p>Socialize</p>
          <div className="footer_social">
            <Link className="footer_link" to="/">
              <i className="fa-brands fa-facebook"></i>
            </Link>
            <Link className="footer_link" to="/">
              <i className="fa-brands fa-twitter"></i>
            </Link>
            <Link className="footer_link" to="/">
              <i className="fa-brands fa-github"></i>
            </Link>
          </div>
        </div>
        <div className="footer_bottom">
          <p>All rights reserved &copy; 2022</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
