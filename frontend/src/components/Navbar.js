import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏘️</span>
          Village Skill Portal
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/jobs" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Jobs
              </Link>
              <Link to="/saved-jobs" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Saved Jobs
              </Link>
              <Link to="/education" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Education
              </Link>
              <Link to="/create-job" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Post Job
              </Link>
              <Link to="/create-resource" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Add Resource
              </Link>
              <Link to="/skills" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Skills
              </Link>
              <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button className="nav-button logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-button register-btn" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


