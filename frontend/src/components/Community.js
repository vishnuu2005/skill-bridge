import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Community = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="skill-portal-loading">
        <div className="loading-spinner"></div>
        <p>Loading community...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Community</h1>
        <p>Meet the members of your village skill community</p>
      </div>

      <div className="community-section">
        <div className="users-grid">
          {users.map(member => (
            <div key={member._id} className="user-card">
              <div className="user-avatar">{member.name.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <h3>{member.name}</h3>
                <p className="user-village">{member.village}</p>
                <p className="user-skills">{member.skills.length} skills</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
