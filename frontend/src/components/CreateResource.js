import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const CreateResource = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', type: 'Course', skillsCovered: '', provider: '', url: '', village: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, skillsCovered: form.skillsCovered ? form.skillsCovered.split(',').map(s => s.trim()) : [] };
      await axios.post('/api/resources', payload);
      setMessage('Resource created');
      setTimeout(() => navigate('/education'), 800);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create resource');
    }
  };

  if (!user) return <p>Please sign in to add a resource.</p>;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Resource</h2>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Course</option>
              <option>Workshop</option>
              <option>Program</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Skills Covered (comma separated)</label>
            <input name="skillsCovered" value={form.skillsCovered} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Provider</label>
            <input name="provider" value={form.provider} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>URL</label>
            <input name="url" value={form.url} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Village</label>
            <input name="village" value={form.village} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Create Resource</button>
        </form>
      </div>
    </div>
  );
};

export default CreateResource;
