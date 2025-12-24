import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PracticeModules.css';

const PracticeModules = () => {
  const navigate = useNavigate();
  const [examType, setExamType] = useState('academic');

useEffect(() => {
  const fetchExamType = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';
      const response = await fetch(`${API_URL}/api/user/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExamType(data.examType || 'academic');
      }
    } catch (err) {
      console.error('Failed to fetch exam type:', err);
    }
  };
  fetchExamType();
}, []);

const modules = [
  {
    id: 'writing',
    icon: '✍️',
    title: 'Writing Practice',
    description: examType === 'general' 
      ? 'Task 1 letters & Task 2 essays with AI feedback'
      : 'Task 1 reports & Task 2 essays with AI feedback',
    path: '/practice',
    color: '#667eea'
  },
  {
    id: 'speaking',
    icon: '🎤',
    title: 'Speaking Practice',
    description: 'Parts 1, 2 & 3 with AI feedback and model answers',
    path: '/speaking',
    color: '#ec407a'
  },
  {
    id: 'reading',
    icon: '📖',
    title: 'Reading Practice',
    description: examType === 'general'
      ? 'Practical texts like notices, ads, and workplace documents'
      : 'Academic passages with multiple question types',
    path: '/reading',
    color: '#43a047'
  },
  {
    id: 'listening',
    icon: '🎧',
    title: 'Listening Practice',
    description: 'Audio sections with comprehension questions',
    path: '/listening',
    color: '#fb8c00'
  }
];

  return (
    <div className="practice-modules">
      <header className="modules-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1>Practice Modules</h1>
          <p className="subtitle">Choose a skill to practice</p>
        </div>
      </header>

      <main className="modules-main">
        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              onClick={() => navigate(module.path)}
              style={{ '--module-color': module.color }}
            >
              <div className="module-icon">{module.icon}</div>
              <div className="module-info">
                <h2>{module.title}</h2>
                <p>{module.description}</p>
              </div>
              <div className="module-arrow">→</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PracticeModules;