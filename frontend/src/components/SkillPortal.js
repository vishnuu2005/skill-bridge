import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import './SkillPortal.css';

const SkillPortal = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'Beginner',
    description: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, skillFilter, villageFilter]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term (name, skills, village)
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills.some(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by skill
    if (skillFilter) {
      filtered = filtered.filter(user =>
        user.skills.some(skill => skill.name === skillFilter)
      );
    }

    // Filter by village
    if (villageFilter) {
      filtered = filtered.filter(user => user.village === villageFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/skills', newSkill);
      // Update local user state
      const updatedUser = { ...user, skills: response.data };
      // You would need to update the auth context here
      setShowAddSkillModal(false);
      setNewSkill({ name: '', level: 'Beginner', description: '' });
      // Refresh users to show the new skill
      fetchUsers();
    } catch (error) {
      console.error('Error adding skill:', error);
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

  const getUniqueSkills = () => {
    const allSkills = users.flatMap(user => user.skills.map(skill => skill.name));
    return [...new Set(allSkills)];
  };

  const getUniqueVillages = () => {
    const villages = users.map(user => user.village);
    return [...new Set(villages)];
  };

  if (loading) {
    return <LoadingSpinner message="Loading skill portal..." />;
  }

  return (
    <div className="skill-portal">
      <div className="portal-header">
        <h1>Village Skill Portal</h1>
        <p>Discover and connect with skilled professionals in your village</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, skill, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters">
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Skills</option>
            {getUniqueSkills().map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Villages</option>
            {getUniqueVillages().map(village => (
              <option key={village} value={village}>{village}</option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddSkillModal(true)}
        >
          Add Your Skill
        </button>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>Showing {filteredUsers.length} of {users.length} members</p>
      </div>

      {/* Users Grid */}
      <div className="users-grid">
        {filteredUsers.map((member) => (
          <div key={member._id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{member.name}</h3>
                <p className="user-village">📍 {member.village}</p>
                {member.phone && (
                  <p className="user-phone">📞 {member.phone}</p>
                )}
              </div>
            </div>

            <div className="user-skills">
              <h4>Skills ({member.skills.length})</h4>
              {member.skills.length > 0 ? (
                <div className="skills-list">
                  {member.skills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                      <span className="skill-name">{skill.name}</span>
                      <span 
                        className="skill-level"
                        style={{ backgroundColor: getSkillLevelColor(skill.level) }}
                      >
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-skills">No skills listed yet</p>
              )}
            </div>

            <div className="user-actions">
              <button className="btn btn-secondary btn-sm">
                View Profile
              </button>
              <button className="btn btn-primary btn-sm">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-results">
          <p>No members found matching your criteria.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="modal-overlay" onClick={() => setShowAddSkillModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Your Skill</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddSkillModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddSkill} className="modal-form">
              <div className="form-group">
                <label htmlFor="skillName">Skill Name *</label>
                <input
                  type="text"
                  id="skillName"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  placeholder="e.g., Carpentry, Pottery, Farming"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="skillLevel">Skill Level *</label>
                <select
                  id="skillLevel"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="skillDescription">Description</label>
                <textarea
                  id="skillDescription"
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                  placeholder="Describe your skill, experience, or what you can offer..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddSkillModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillPortal;


