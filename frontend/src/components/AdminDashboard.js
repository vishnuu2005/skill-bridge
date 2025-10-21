import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, jobs, chats
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);

  useEffect(() => {
    if (user && user.isAdmin) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, jobsRes, chatsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/stats`, { headers }),
        axios.get(`${API_URL}/api/admin/users`, { headers }),
        axios.get(`${API_URL}/api/admin/jobs`, { headers }),
        axios.get(`${API_URL}/api/admin/chats`, { headers })
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.data);
      setJobs(jobsRes.data.data);
      setChats(chatsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
      showMessage(error.response?.data?.message || 'Failed to load data', 'error');
      setLoading(false);
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/api/admin/users/${userId}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showMessage('User status updated successfully');
      loadDashboardData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This will also delete all their jobs and chats.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage('User deleted successfully');
      loadDashboardData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const handlePurgeUser = async (userId, userName) => {
    if (!window.confirm(`⚠️ COMPLETE PURGE: This will permanently delete ALL data for ${userName} including:\n- User account\n- All posted jobs\n- All chats\n- All saved jobs\n\nThis action cannot be undone. Continue?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/admin/users/purge/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage(`Purged: ${response.data.deleted.user} user, ${response.data.deleted.jobs} jobs, ${response.data.deleted.chats} chats`);
      loadDashboardData();
      setSelectedUser(null);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to purge user data', 'error');
    }
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      showMessage('Please select users to delete', 'error');
      return;
    }

    if (!window.confirm(`Delete ${selectedUsers.length} users and all their data?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/admin/users/bulk-delete`, 
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showMessage(`Deleted ${response.data.deletedCount} users successfully`);
      setSelectedUsers([]);
      loadDashboardData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to bulk delete users', 'error');
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Delete job "${jobTitle}"? This will also delete related chats.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage('Job deleted successfully');
      loadDashboardData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to delete job', 'error');
    }
  };

  const handleBulkDeleteJobs = async () => {
    if (selectedJobs.length === 0) {
      showMessage('Please select jobs to delete', 'error');
      return;
    }

    if (!window.confirm(`Delete ${selectedJobs.length} jobs and related chats?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/admin/jobs/bulk-delete`, 
        { jobIds: selectedJobs },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showMessage(`Deleted ${response.data.deletedCount} jobs successfully`);
      setSelectedJobs([]);
      loadDashboardData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to bulk delete jobs', 'error');
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Delete this chat conversation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage('Chat deleted successfully');
      loadDashboardData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to delete chat', 'error');
    }
  };

  const handleDeleteUserSkill = async (userId, skillId, skillName) => {
    if (!window.confirm(`Remove skill "${skillName}" from this user?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/users/${userId}/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage('Skill removed successfully');
      // Update selected user if viewing details
      if (selectedUser && selectedUser._id === userId) {
        const updatedUser = { ...selectedUser };
        updatedUser.skills = updatedUser.skills.filter(s => s._id !== skillId);
        setSelectedUser(updatedUser);
      }
      loadDashboardData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to remove skill', 'error');
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  if (!user?.isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, jobs, and view statistics</p>
      </div>

      {message && (
        <div className={`admin-message ${messageType === 'error' ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          💼 Jobs ({jobs.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          💬 Chats ({chats.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="overview-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
                <span className="stat-subtitle">+{stats.recentUsers} this month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-info">
                <h3>{stats.totalJobs}</h3>
                <p>Total Jobs</p>
                <span className="stat-subtitle">{stats.activeJobs} active</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.totalResources}</h3>
                <p>Resources</p>
                <span className="stat-subtitle">Learning materials</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-info">
                <h3>{stats.totalChats}</h3>
                <p>Total Chats</p>
                <span className="stat-subtitle">Conversations</span>
              </div>
            </div>
          </div>

          {/* Top Villages */}
          <div className="chart-section">
            <h3>Top Villages by Users</h3>
            <div className="chart-list">
              {stats.usersByVillage.map((item, index) => (
                <div key={index} className="chart-item">
                  <span className="chart-label">{item._id}</span>
                  <div className="chart-bar">
                    <div
                      className="chart-fill"
                      style={{
                        width: `${(item.count / stats.usersByVillage[0].count) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="chart-value">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Skills */}
          <div className="chart-section">
            <h3>Top Skills</h3>
            <div className="skills-grid">
              {stats.topSkills.map((item, index) => (
                <div key={index} className="skill-item">
                  <span className="skill-name">{item._id}</span>
                  <span className="skill-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="users-content">
          {selectedUsers.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedUsers.length} users selected</span>
              <button className="btn-bulk-delete" onClick={handleBulkDeleteUsers}>
                🗑️ Delete Selected
              </button>
              <button className="btn-clear" onClick={() => setSelectedUsers([])}>
                Clear Selection
              </button>
            </div>
          )}
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map(u => u._id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Village</th>
                  <th>Skills</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                      />
                    </td>
                    <td className="user-name">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.village}</td>
                    <td className="user-skills">
                      {user.skills?.length || 0} skills
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-toggle"
                        onClick={() => handleUserStatusToggle(user._id, user.isActive)}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? '🔒' : '🔓'}
                      </button>
                      <button
                        className="btn-action btn-view"
                        onClick={() => setSelectedUser(user)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="jobs-content">
          {selectedJobs.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedJobs.length} jobs selected</span>
              <button className="btn-bulk-delete" onClick={handleBulkDeleteJobs}>
                🗑️ Delete Selected
              </button>
              <button className="btn-clear" onClick={() => setSelectedJobs([])}>
                Clear Selection
              </button>
            </div>
          )}
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === jobs.length && jobs.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedJobs(jobs.map(j => j._id));
                        } else {
                          setSelectedJobs([]);
                        }
                      }}
                    />
                  </th>
                  <th>Title</th>
                  <th>Posted By</th>
                  <th>Village</th>
                  <th>Salary</th>
                  <th>Positions</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job._id)}
                        onChange={() => toggleJobSelection(job._id)}
                      />
                    </td>
                    <td className="job-title">{job.title}</td>
                    <td>{job.postedBy?.name || job.postedByName}</td>
                    <td>{job.village}</td>
                    <td>{job.salary || 'N/A'}</td>
                    <td>{job.positions}</td>
                    <td>
                      <span className={`status-badge ${job.isActive ? 'active' : 'inactive'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteJob(job._id, job.title)}
                        title="Delete Job"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chats Tab */}
      {activeTab === 'chats' && (
        <div className="chats-content">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Job Poster</th>
                  <th>Applicant</th>
                  <th>Messages</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {chats.map((chat) => (
                  <tr key={chat._id}>
                    <td>{chat.job?.title || 'N/A'}</td>
                    <td>{chat.jobPoster?.name || 'N/A'}</td>
                    <td>{chat.applicant?.name || 'N/A'}</td>
                    <td>{chat.messages?.length || 0} messages</td>
                    <td>{new Date(chat.updatedAt).toLocaleString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteChat(chat._id)}
                        title="Delete Chat"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content user-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedUser.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedUser.phone || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Village:</span>
                <span className="detail-value">{selectedUser.village}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${selectedUser.isActive ? 'active' : 'inactive'}`}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Admin:</span>
                <span className={`status-badge ${selectedUser.isAdmin ? 'active' : 'inactive'}`}>
                  {selectedUser.isAdmin ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Skills:</span>
                <div className="skills-list">
                  {selectedUser.skills && selectedUser.skills.length > 0 ? (
                    selectedUser.skills.map((skill, index) => (
                      <span key={skill._id || index} className="skill-badge">
                        {skill.name} - {skill.level}
                        <button
                          className="skill-delete-btn"
                          onClick={() => handleDeleteUserSkill(selectedUser._id, skill._id, skill.name)}
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span>No skills added</span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-modal btn-danger"
                onClick={() => handlePurgeUser(selectedUser._id, selectedUser.name)}
              >
                ⚠️ Complete Purge
              </button>
              <button
                className="btn-modal btn-secondary"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
