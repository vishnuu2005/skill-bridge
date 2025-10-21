import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Chat from './Chat';
import Call from './Call';
import './Jobs.css';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/api/users/saved-jobs');
      setSavedJobs(res.data || []);
    } catch (err) {
      console.error('Failed to load saved jobs', err);
      setMessage('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await axios.delete(`/api/users/jobs/${jobId}/save`);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
      setMessage('Job removed from saved list');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to unsave job');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleContact = (phone) => {
    if (!phone) {
      setMessage('No phone number available');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, give option for WhatsApp or Phone
      const useWhatsApp = window.confirm('Contact via WhatsApp? (Cancel for phone call)');
      
      if (useWhatsApp) {
        // Open WhatsApp
        window.open(`https://wa.me/91${cleanPhone}`, '_blank');
      } else {
        // Open phone dialer
        window.location.href = `tel:${cleanPhone}`;
      }
    } else {
      // On desktop, open WhatsApp web
      window.open(`https://wa.me/91${cleanPhone}`, '_blank');
    }
  };

  const handleChat = async (job) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/chats/initialize',
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveChatId(response.data._id);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to initialize chat');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCall = (job) => {
    setActiveCall({
      fullName: job.postedByName,
      phone: job.postedByPhone || job.phone,
      village: job.village
    });
  };

  if (!user) {
    return (
      <div className="jobs-container">
        <div className="no-jobs-message">
          <h3>Please login to view your saved jobs</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h2>My Saved Jobs</h2>
        <div className="jobs-stats">
          <div className="stat-item">
            <span className="icon">❤️</span>
            <span>{savedJobs.length} Saved</span>
          </div>
        </div>
      </div>
      
      {message && <div className="message-banner">{message}</div>}
      
      {loading ? (
        <div className="loading-spinner">Loading your saved jobs...</div>
      ) : (
        <div className="jobs-grid">
          {savedJobs.length === 0 ? (
            <div className="no-jobs-message">
              <h3>No saved jobs yet</h3>
              <p>Start saving jobs from the Jobs page!</p>
            </div>
          ) : (
            savedJobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="job-badge">Saved</span>
                </div>
                
                <p className="job-description">{job.description}</p>
                
                {/* Posted By Information */}
                {job.postedByName && (
                  <div className="job-poster-info">
                    <div className="poster-label">
                      <span className="poster-icon">👤</span> Posted by
                    </div>
                    <div className="poster-details">
                      <span className="poster-name">{job.postedByName}</span>
                      {(job.postedByPhone || job.phone) && (
                        <div className="poster-phone">
                          <span className="phone-icon">📞</span>
                          <a href={`tel:${job.postedByPhone || job.phone}`} className="phone-link">
                            {job.postedByPhone || job.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="job-details">
                  {job.salary && (
                    <div className="job-detail-item">
                      <span className="job-detail-icon">💰</span>
                      <span className="job-detail-label">Salary:</span>
                      <span className="job-detail-value">{job.salary}</span>
                    </div>
                  )}
                  {job.positions && (
                    <div className="job-detail-item">
                      <span className="job-detail-icon">👥</span>
                      <span className="job-detail-label">Positions:</span>
                      <span className="job-detail-value">{job.positions}</span>
                    </div>
                  )}
                  {job.village && (
                    <div className="job-detail-item">
                      <span className="job-detail-icon">📍</span>
                      <span className="job-detail-label">Location:</span>
                      <span className="job-detail-value">{job.village}</span>
                    </div>
                  )}
                </div>
                
                {job.skills && job.skills.length > 0 && (
                  <div className="job-skills">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                )}
                
                <div className="job-actions">
                  {user && job.postedBy && job.postedBy._id !== user.id && (
                    <>
                      <button 
                        className="btn-chat"
                        onClick={() => handleChat(job._id, job.postedBy)}
                        title="Chat with job poster"
                      >
                        💬 Chat
                      </button>
                      {job.postedBy.phone && (
                        <button 
                          className="btn-call"
                          onClick={() => handleCall(job.postedBy)}
                          title="Call job poster"
                        >
                          📞 Call
                        </button>
                      )}
                    </>
                  )}
                  <button 
                    className="btn-unsave"
                    onClick={() => handleUnsaveJob(job._id)}
                    title="Remove from saved jobs"
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Chat Modal */}
      {activeChatId && (
        <div className="modal-overlay" onClick={() => setActiveChatId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Chat jobId={activeChatId} onClose={() => setActiveChatId(null)} />
          </div>
        </div>
      )}

      {/* Call Modal */}
      {activeCall && (
        <Call 
          contactPerson={activeCall}
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
};

export default SavedJobs;
