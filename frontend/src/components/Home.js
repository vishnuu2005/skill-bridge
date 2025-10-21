import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Connect with <span className="highlight">Village Skills</span>
          </h1>
          <p className="hero-subtitle">
            Discover talented artisans, craftsmen, and skilled professionals in your village. 
            Connect, collaborate, and preserve traditional skills for future generations.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/skills" className="btn btn-primary">
                Explore Skills
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <span className="emoji">🏘️</span>
            <span className="emoji">🛠️</span>
            <span className="emoji">🎨</span>
            <span className="emoji">🌾</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Village Skill Portal?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Discover Skills</h3>
            <p>Find skilled professionals in your village - from traditional crafts to modern services.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Connect & Collaborate</h3>
            <p>Build meaningful connections with local artisans and craftsmen.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Learn & Share</h3>
            <p>Share your skills and learn from others in your community.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Economic Growth</h3>
            <p>Support local businesses and promote village entrepreneurship.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create your profile and list your skills or services</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Connect</h3>
            <p>Find and connect with skilled professionals</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Collaborate</h3>
            <p>Work together and grow your community</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Join the Village Community?</h2>
          <p>Start connecting with skilled professionals in your village today!</p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-large">
              Join Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;


