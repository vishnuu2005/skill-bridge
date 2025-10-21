import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Chat from './Chat';
import Call from './Call';
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
  const [userSkills, setUserSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs');
        setJobs(res.data || []);
      } catch (err) {
        console.error('Failed to load jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const res = await axios.get('/api/users/profile');
          const skills = res.data.skills?.map(skill => skill.name.toLowerCase()) || [];
          setUserSkills(skills);
        } catch (err) {
          console.error('Failed to load user skills', err);
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user) {
        try {
          const res = await axios.get('/api/users/saved-jobs');
          setSavedJobs(res.data.map(job => job._id));
        } catch (err) {
          console.error('Failed to load saved jobs', err);
        }
      }
    };
    fetchSavedJobs();
  }, [user]);

  const handleSaveJob = async (jobId) => {
    if (!user) {
      setMessage('Please login to save jobs');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const isSaved = savedJobs.includes(jobId);
      
      if (isSaved) {
        await axios.delete(`/api/users/jobs/${jobId}/save`);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
        setMessage('Job removed from saved list');
        setMessageType('success');
      } else {
        await axios.post(`/api/users/jobs/${jobId}/save`);
        setSavedJobs([...savedJobs, jobId]);
        setMessage('✓ Job saved successfully! Check "Saved Jobs" to view it.');
        setMessageType('success');
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save job');
      setMessageType('error');
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
    if (!user) {
      setMessage('Please login to chat');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

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
    if (!user) {
      setMessage('Please login to call');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setActiveCall({
      fullName: job.postedByName,
      phone: job.postedByPhone || job.phone,
      village: job.village
    });
  };

  // Calculate skill match percentage
  const calculateSkillMatch = (jobSkills) => {
    if (!jobSkills || jobSkills.length === 0 || userSkills.length === 0) return 0;
    const matches = jobSkills.filter(skill => 
      userSkills.some(userSkill => userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill))
    );
    return Math.round((matches.length / jobSkills.length) * 100);
  };

  // Categorize and sort jobs
  const categorizeJobs = () => {
    if (!user) return { recommended: [], other: jobs };
    
    const jobsWithMatch = jobs.map(job => ({
      ...job,
      matchPercentage: calculateSkillMatch(job.skills)
    }));

    const recommended = jobsWithMatch.filter(job => job.matchPercentage >= 30).sort((a, b) => b.matchPercentage - a.matchPercentage);
    const other = jobsWithMatch.filter(job => job.matchPercentage < 30);

    return { recommended, other };
  };

  // Filter jobs based on search query
  const filterJobsBySearch = (jobsList) => {
    if (!searchQuery.trim()) return jobsList;
    
    const query = searchQuery.toLowerCase();
    return jobsList.filter(job => 
      job.title?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query) ||
      job.village?.toLowerCase().includes(query) ||
      job.skills?.some(skill => skill.toLowerCase().includes(query))
    );
  };

  const { recommended, other } = categorizeJobs();
  const filteredRecommended = filterJobsBySearch(recommended);
  const filteredOther = filterJobsBySearch(other);

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h2>Available Jobs</h2>
        <div className="jobs-stats">
          <div className="stat-item">
            <span className="icon">💼</span>
            <span>{jobs.length} Jobs</span>
          </div>
          {user && recommended.length > 0 && (
            <div className="stat-item">
              <span className="icon">⭐</span>
              <span>{recommended.length} Matched</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search jobs by title, skills, or location..."
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
      
      {message && (
        <div className={`message-banner ${messageType === 'error' ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      {loading ? (
        <div className="loading-spinner">Loading jobs...</div>
      ) : (
        <>
          {/* Recommended Jobs Section */}
          {user && filteredRecommended.length > 0 && (
            <>
              <div className="section-title">
                <span>⭐</span> Recommended For You
              </div>
              <div className="jobs-grid">
                {filteredRecommended.map(job => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={savedJobs.includes(job._id)}
                    onSave={handleSaveJob}
                    onContact={handleContact}
                    onChat={handleChat}
                    onCall={handleCall}
                    userSkills={userSkills}
                    showMatch={true}
                    currentUser={user}
                  />
                ))}
              </div>
            </>
          )}

          {/* All Jobs / Other Jobs Section */}
          {filteredOther.length > 0 && (
            <>
              {user && filteredRecommended.length > 0 && <div className="section-divider" />}
              {user && filteredRecommended.length > 0 && (
                <div className="section-title">
                  <span>📋</span> Other Jobs
                </div>
              )}
              <div className="jobs-grid">
                {filteredOther.map(job => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={savedJobs.includes(job._id)}
                    onSave={handleSaveJob}
                    onContact={handleContact}
                    onChat={handleChat}
                    onCall={handleCall}
                    userSkills={userSkills}
                    showMatch={false}
                    currentUser={user}
                  />
                ))}
              </div>
            </>
          )}

          {(filteredRecommended.length === 0 && filteredOther.length === 0) && (
            <div className="no-jobs-message">
              <h3>{searchQuery ? 'No jobs found matching your search' : 'No jobs available yet'}</h3>
              <p>{searchQuery ? 'Try different keywords or clear your search' : 'Check back later for new opportunities!'}</p>
            </div>
          )}
        </>
      )}

      {/* Chat Modal */}
      {activeChatId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Chat chatId={activeChatId} onClose={() => setActiveChatId(null)} />
          </div>
        </div>
      )}

      {/* Call Modal */}
      {activeCall && (
        <Call contactPerson={activeCall} onClose={() => setActiveCall(null)} />
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, isSaved, onSave, onContact, onChat, onCall, userSkills, showMatch, currentUser }) => {
  const matchedSkills = job.skills?.filter(skill => 
    userSkills.some(userSkill => userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill))
  ) || [];

  const isOwnJob = currentUser && job.postedBy === currentUser.id;

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        {showMatch && job.matchPercentage > 0 && (
          <span className="job-badge job-match-badge">{job.matchPercentage}% Match</span>
        )}
      </div>
      
      <p className="job-description">{job.description}</p>
      
      {/* Posted By Information - Show poster name and phone */}
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
            <span 
              key={index} 
              className={`skill-tag ${matchedSkills.includes(skill) ? 'matched' : ''}`}
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      
      <div className="job-actions">
        {!isOwnJob ? (
          <>
            <button 
              className="btn-chat"
              onClick={() => onChat(job)}
              title="Chat with job poster"
            >
              <span>💬</span> Chat
            </button>
            <button 
              className="btn-call"
              onClick={() => onCall(job)}
              title="Call job poster"
            >
              <span>📞</span> Call
            </button>
            <button 
              className={`btn-save ${isSaved ? 'saved' : ''}`}
              onClick={() => onSave(job._id)}
              title={isSaved ? "Remove from saved jobs" : "Save this job"}
            >
              {isSaved ? (
                <>
                  <span>❤️</span> Saved
                </>
              ) : (
                <>
                  <span>🤍</span> Save
                </>
              )}
            </button>
          </>
        ) : (
          <div className="own-job-notice">
            <span>✨</span> Your Job Post
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
