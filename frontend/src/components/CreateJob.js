import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', skills: '', village: '', salary: '', phone: '', positions: '1' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...form, 
        skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
        positions: parseInt(form.positions) || 1
      };
      await axios.post('/api/jobs', payload);
      setMessage('Job posted successfully');
      setTimeout(() => navigate('/jobs'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to post job');
    }
  };

  if (!user) return <p>Please sign in to post a job.</p>;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Post a Job</h2>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Village</label>
            <input name="village" value={form.village} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Salary</label>
            <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g., ₹15,000/month" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g., 9876543210" />
          </div>
          <div className="form-group">
            <label>Number of Positions</label>
            <input 
              type="number" 
              name="positions" 
              value={form.positions} 
              onChange={handleChange} 
              min="1" 
              required 
              placeholder="e.g., 5" 
            />
          </div>
          <button type="submit" className="btn btn-primary">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
