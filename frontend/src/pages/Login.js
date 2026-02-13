import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await api.post('/auth/login', {
          username: formData.username,
          password: formData.password,
        });
        onLogin(response.data.user, response.data.access_token);
      } else {
        // Register
        const response = await api.post('/auth/register', {
          username: formData.username,
          email: formData.email,
          name: formData.name,
          password: formData.password,
        });
        // After registration, automatically login
        const loginResponse = await api.post('/auth/login', {
          username: formData.username,
          password: formData.password,
        });
        onLogin(loginResponse.data.user, loginResponse.data.access_token);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Campus FOUND System</h1>
        <p>{isLogin ? 'Sign in to continue' : 'Create an account'}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@campus.edu"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              minLength={6}
            />
            {!isLogin && (
              <small>Password must be at least 6 characters</small>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="link-button"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="link-button"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

        <div className="login-info">
          <p>This system is for campus members only.</p>
          {process.env.REACT_APP_ALLOWED_DOMAIN && (
            <p>You must use a {process.env.REACT_APP_ALLOWED_DOMAIN} email address.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
