import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      console.log('Profile data:', response.data);
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const targetBand = profileData?.onboarding?.targetBand || '-';
  const essaysWritten = profileData?.essaysCount || 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back! 👋</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{targetBand}</div>
          <div className="stat-label">Target Band</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{essaysWritten}</div>
          <div className="stat-label">Essays Written</div>
        </div>
      </div>

      <div className="modules-card">
        <h2>Practice Modules</h2>

        <div className="module-item" onClick={() => navigate('/practice')}>
          <span className="module-icon">✍️</span>
          <div className="module-info">
            <h3>Writing Practice</h3>
            <p>Task 2 with AI feedback</p>
          </div>
        </div>

        <div className="module-item" onClick={() => navigate('/history')}>
          <span className="module-icon">📚</span>
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
  );
}

export default Dashboard;