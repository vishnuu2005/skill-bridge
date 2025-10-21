import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Quick Action Handlers
  const handleAddSkill = () => {
    navigate('/add-skill');
  };
  const handleSearchSkills = () => {
    navigate('/search-skills');
  };
  const handleViewCommunity = () => {
    navigate('/community');
  };
  const handleEditProfile = () => {
    navigate('/profile');
  };
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSkills: 0,
    activeUsers: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersResponse] = await Promise.all([
        axios.get('/api/users/users')
      ]);

      const users = usersResponse.data;
      const totalSkills = users.reduce((acc, user) => acc + user.skills.length, 0);
      const activeUsers = users.filter(user => user.isActive).length;

      setStats({
        totalUsers: users.length,
        totalSkills,
        activeUsers
      });

      // Get recent users (last 5)
      setRecentUsers(users.slice(0, 5));

      // Fetch job matches for this user
      try {
        const matchesRes = await axios.get('/api/jobs/matches');
        setMatches(matchesRes.data || []);
      } catch (e) {
        console.warn('Could not fetch job matches:', e?.response?.data || e.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillLevelColor = (level) => {
    const colors = {
      'Beginner': '#10B981',
      'Intermediate': '#F59E0B',
      'Advanced': '#EF4444',
      'Expert': '#8B5CF6'
    };
    return colors[level] || '#6B7280';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Here's what's happening in your village skill community</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Members</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛠️</div>
          <div className="stat-content">
            <h3>{stats.totalSkills}</h3>
            <p>Skills Listed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.activeUsers}</h3>
            <p>Active Members</p>
          </div>
        </div>
      </div>

      {/* Job Matches Section */}
      <div className="matches-section">
        <h2>Job Matches For You</h2>
        {matches.length === 0 ? (
          <p>No matching jobs found at the moment. Check again later or broaden your skills.</p>
        ) : (
          <div className="matches-list">
            {matches.map(job => (
              <div key={job._id} className="match-card">
                <h3>{job.title}</h3>
                <p className="match-description">{job.description}</p>
                
                <div className="match-details">
                  <div className="match-detail-item">
                    <span className="detail-icon">🏢</span>
                    <span className="detail-label">Company:</span>
                    <span className="detail-value">{job.company}</span>
                  </div>
                  
                  <div className="match-detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-label">Village:</span>
                    <span className="detail-value">{job.village}</span>
                  </div>
                  
                  {job.salary && (
                    <div className="match-detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="detail-label">Salary:</span>
                      <span className="detail-value">{job.salary}</span>
                    </div>
                  )}
                  
                  {job.postedBy && job.postedBy.phone && (
                    <div className="match-detail-item">
                      <span className="detail-icon">📞</span>
                      <span className="detail-label">Contact:</span>
                      <a 
                        href={`tel:${job.postedBy.phone}`} 
                        className="detail-value phone-link"
                      >
                        {job.postedBy.phone}
                      </a>
                    </div>
                  )}
                  
                  {job.postedBy && job.postedBy.name && (
                    <div className="match-detail-item">
                      <span className="detail-icon">👤</span>
                      <span className="detail-label">Posted by:</span>
                      <span className="detail-value">{job.postedBy.name}</span>
                    </div>
                  )}
                </div>
                
                {job.skills && job.skills.length > 0 && (
                  <div className="match-skills">
                    <span className="skills-label">Required Skills:</span>
                    <div className="skills-tags">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="skill-tag-small">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


