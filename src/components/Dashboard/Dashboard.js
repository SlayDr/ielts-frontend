import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>IELTS Master</h1>
          <div className="user-section">
            <span className="user-name">{user?.name || 'Student'}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h2>Welcome back, {user?.name || 'Student'}! 👋</h2>
          <p>Continue your IELTS preparation journey</p>
        </section>

        <section className="modules-section">
          <h3>Practice Modules</h3>
          <div className="modules-grid">
            <div className="module-item" onClick={() => navigate('/practice')}>
              <span className="module-icon">✍️</span>
              <div className="module-info">
                <h3>Writing Practice</h3>
                <p>Task 2 with AI feedback</p>
              </div>
            </div>

            <div className="module-item" onClick={() => navigate('/history')}>
              <span className="module-icon">📊</span>
              <div className="module-info">
                <h3>Essay History</h3>
                <p>View past essays & progress</p>
              </div>
            </div>

            <div className="module-item" onClick={() => navigate('/speaking')}>
              <span className="module-icon">🎤</span>
              <div className="module-info">
                <h3>Speaking Practice</h3>
                <p>Parts 1, 2 & 3 with AI feedback</p>
              </div>
            </div>

            <div className="module-item" onClick={() => navigate('/reading')}>
              <span className="module-icon">📖</span>
              <div className="module-info">
                <h3>Reading Practice</h3>
                <p>Academic passages with questions</p>
              </div>
            </div>

            <div className="module-item" onClick={() => navigate('/listening')}>
              <span className="module-icon">🎧</span>
              <div className="module-info">
                <h3>Listening Practice</h3>
                <p>Audio sections with questions</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;