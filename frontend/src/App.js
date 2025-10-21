import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SkillPortal from './components/SkillPortal';
import Profile from './components/Profile';
import AddSkill from './components/AddSkill';
import SearchSkills from './components/SearchSkills';
import Community from './components/Community';
import Jobs from './components/Jobs';
import Education from './components/Education';
import CreateJob from './components/CreateJob';
import CreateResource from './components/CreateResource';
import SavedJobs from './components/SavedJobs';
import AdminDashboard from './components/AdminDashboard';
import DirectChatList from './components/DirectChatList';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/skills" element={<ProtectedRoute><SkillPortal /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
              <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
              <Route path="/create-job" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
              <Route path="/create-resource" element={<ProtectedRoute><CreateResource /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/add-skill" element={<ProtectedRoute><AddSkill /></ProtectedRoute>} />
              <Route path="/search-skills" element={<ProtectedRoute><SearchSkills /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><DirectChatList /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default App;


