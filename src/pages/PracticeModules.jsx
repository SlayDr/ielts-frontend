import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PracticeModules.css';

const PracticeModules = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'writing',
      icon: '✍️',
      title: 'Writing Practice',
      description: 'Task 2 essays with AI feedback and band scores',
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
      description: 'Academic passages with multiple question types',
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