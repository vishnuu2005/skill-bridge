import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Education.css';

const Education = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get('/api/resources');
        setResources(res.data || []);
      } catch (err) {
        console.error('Failed to load resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filterTypes = ['All', 'Course', 'Workshop', 'Program', 'Other'];

  // Filter by type
  const typeFilteredResources = filter === 'All' 
    ? resources 
    : resources.filter(r => r.type === filter);

  // Filter by search query
  const filteredResources = searchQuery.trim()
    ? typeFilteredResources.filter(r =>
        r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.skillsCovered?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : typeFilteredResources;

  const getTypeBadgeClass = (type) => {
    switch(type) {
      case 'Course': return 'badge-course';
      case 'Workshop': return 'badge-workshop';
      case 'Program': return 'badge-program';
      default: return 'badge-other';
    }
  };

  return (
    <div className="education-container">
      <div className="education-header">
        <h2>
          <span className="header-icon">📚</span>
          Education & Training
        </h2>
        <div className="education-stats">
          <div className="stat-item">
            <span className="icon">📖</span>
            <span>{resources.length} Resources</span>
          </div>
          <div className="stat-item">
            <span className="icon">✨</span>
            <span>{filteredResources.length} Showing</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title, skills, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ✖
            </button>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        {filterTypes.map(type => (
          <button
            key={type}
            className={`filter-button ${filter === type ? 'active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type === 'All' ? '🌐 All' : type === 'Course' ? '📚 Courses' : type === 'Workshop' ? '🛠️ Workshops' : type === 'Program' ? '🎓 Programs' : '📌 Other'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">
          <span>Loading education resources...</span>
        </div>
      ) : (
        <div className="resources-grid">
          {filteredResources.length === 0 ? (
            <div className="no-resources-message">
              <div className="empty-icon">📚</div>
              <h3>No {filter !== 'All' ? filter.toLowerCase() + 's' : 'resources'} available</h3>
              <p>Check back later for new learning opportunities!</p>
            </div>
          ) : (
            filteredResources.map(resource => (
              <ResourceCard key={resource._id} resource={resource} getTypeBadgeClass={getTypeBadgeClass} isAdmin={user?.isAdmin} onDelete={(id)=>{
                setResources(prev => prev.filter(r => r._id !== id));
              }} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Resource Card Component
const ResourceCard = ({ resource, getTypeBadgeClass, isAdmin, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/resources/${resource._id}`);
      // notify parent to remove from list
      onDelete && onDelete(resource._id);
      alert('Resource deleted');
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete resource');
    }
  };
  return (
    <div className="resource-card">
      <span className={`resource-type-badge ${getTypeBadgeClass(resource.type)}`}>
        {resource.type}
      </span>
      
      <h3 className="resource-title">{resource.title}</h3>
      
      <p className="resource-description">
        {resource.description || 'Learn new skills and enhance your knowledge.'}
      </p>
      
      <div className="resource-info">
        {resource.provider && (
          <div className="info-item">
            <span className="info-icon">🏢</span>
            <span className="info-label">Provider:</span>
            <span className="info-value">{resource.provider}</span>
          </div>
        )}
        {resource.village && (
          <div className="info-item">
            <span className="info-icon">📍</span>
            <span className="info-label">Location:</span>
            <span className="info-value">{resource.village}</span>
          </div>
        )}
      </div>
      
      {resource.skillsCovered && resource.skillsCovered.length > 0 && (
        <div className="skills-covered">
          <div className="skills-label">Skills You'll Learn:</div>
          <div className="skills-tags">
            {resource.skillsCovered.map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      )}
      
      {resource.url && (
        <div className="resource-action">
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-learn-more"
          >
            <span>📖</span>
            Learn More
          </a>
        </div>
      )}
      {isAdmin && (
        <div className="resource-action admin-actions">
          <button className="btn-delete" onClick={handleDelete}>🗑️ Delete</button>
        </div>
      )}
    </div>
  );
};

export default Education;
