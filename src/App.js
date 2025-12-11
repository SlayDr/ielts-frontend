import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Onboarding from './components/Onboarding/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import WritingPractice from './components/WritingPractice/WritingPractice';
import EssayHistory from './pages/EssayHistory';
import SpeakingPractice from './pages/SpeakingPractice';
import ReadingPractice from './pages/ReadingPractice';
import ListeningPractice from './pages/ListeningPractice';
import './styles/index.css';
import SpeakingHistory from './pages/SpeakingHistory';
import ReadingHistory from './pages/ReadingHistory';
import ListeningHistory from './pages/ListeningHistory';
import PracticeModules from './pages/PracticeModules';
import ProfileSettings from './pages/ProfileSettings';
// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

// App Routes
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <WritingPractice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <EssayHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/speaking"
        element={
          <ProtectedRoute>
            <SpeakingPractice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reading"
        element={
          <ProtectedRoute>
            <ReadingPractice />
          </ProtectedRoute>
        }
      />
<Route
  path="/listening"
  element={
    <ProtectedRoute>
      <ListeningPractice />
    </ProtectedRoute>
  }
  />
  <Route
  path="/modules"
  element={
    <ProtectedRoute>
      <PracticeModules />
    </ProtectedRoute>
  }
/>
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <ProfileSettings />
    </ProtectedRoute>
  }
/>
  <Route
  path="/speaking-history"
  element={
    <ProtectedRoute>
      <SpeakingHistory />
    </ProtectedRoute>
  }
/>
<Route
  path="/reading-history"
  element={
    <ProtectedRoute>
      <ReadingHistory />
    </ProtectedRoute>
  }
/>
<Route
  path="/listening-history"
  element={
    <ProtectedRoute>
      <ListeningHistory />
    </ProtectedRoute>
  }
/>
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;