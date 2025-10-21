import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const SearchSkills = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleMessageUser = async (recipientId) => {
    if (!user) {
      alert('Please login to send messages');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/direct-chats/initialize`,
        { recipientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Navigate to messages page
      navigate('/messages');
    } catch (error) {
      console.error('Error initializing chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/users');
        setUsers(response.data);
      } catch (e) {
        // no-op
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const uniqueSkills = useMemo(() => {
    return [...new Set(users.flatMap(u => u.skills.map(s => s.name)))];
  }, [users]);

  const uniqueVillages = useMemo(() => {
    return [...new Set(users.map(u => u.village))];
  }, [users]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.village.toLowerCase().includes(term) ||
        u.skills.some(s => s.name.toLowerCase().includes(term))
      );
    }
    if (skillFilter) {
      filtered = filtered.filter(u => u.skills.some(s => s.name === skillFilter));
    }
    if (villageFilter) {
      filtered = filtered.filter(u => u.village === villageFilter);
    }
    return filtered;
  }, [users, searchTerm, skillFilter, villageFilter]);

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="skill-portal">
      <div className="portal-header">
        <h1>Search Skills</h1>
        <p>Find skilled professionals by name, skill, or village</p>
      </div>

      <div className="search-filters">
        <div className="search-box">
          <input
            className="search-input"
            placeholder="Search by name, skill, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters">
          <select className="filter-select" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
            <option value="">All Skills</option>
            {uniqueSkills.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="filter-select" value={villageFilter} onChange={(e) => setVillageFilter(e.target.value)}>
            <option value="">All Villages</option>
            {uniqueVillages.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map(member => (
          <div key={member._id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">{member.name.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <h3>{member.name}</h3>
                <p className="user-village">📍 {member.village}</p>
                {member.phone && <p className="user-phone">📞 {member.phone}</p>}
              </div>
            </div>
            <div className="user-skills">
              <h4>Skills ({member.skills.length})</h4>
              <div className="skills-list">
                {member.skills.map((skill, idx) => (
                  <div key={idx} className="skill-tag">
                    <span className="skill-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {user && member._id !== user.id && (
              <div className="user-actions">
                <button 
                  className="btn-message-user"
                  onClick={() => handleMessageUser(member._id)}
                >
                  💬 Message
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-results">
          <p>No members found matching your criteria.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default SearchSkills;
