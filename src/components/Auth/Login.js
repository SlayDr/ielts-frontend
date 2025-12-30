import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>IELTS Master</h1>
        <p>Your AI-powered IELTS preparation platform</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Sign In</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

         <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Connecting... Please wait' : 'Sign In'}
          </button>
          {loading && (
            <p className="loading-message">First connection may take a few seconds...</p>
          )}
        </form>
<Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
        <p className="text-center mt-20">
          Don't have an account? <Link to="/signup" className="link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;