import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

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
            {t('common.welcome')}
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.dashboard')}
              </Link>
              <Link to="/jobs" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.jobs')}
              </Link>
              <Link to="/saved-jobs" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('jobs.savedJobs')}
              </Link>
              <Link to="/education" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.education')}
              </Link>
              <Link to="/create-job" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('jobs.createJob')}
              </Link>
              <Link to="/create-resource" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.resources')}
              </Link>
              <Link to="/skills" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('profile.skills')}
              </Link>
              <Link to="/messages" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                💬 {t('common.chat')}
              </Link>
              <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.profile')}
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button className="nav-button logout-btn" onClick={handleLogout}>
                {t('common.logout')}
              </button>
              <LanguageSwitcher />
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.login')}
              </Link>
              <Link to="/register" className="nav-button register-btn" onClick={() => setIsMenuOpen(false)}>
                {t('common.register')}
              </Link>
              <LanguageSwitcher />
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


