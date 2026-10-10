import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiGlobe, FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/Login.css';

const Login = () => {
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('demo@stockportfolio.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('India');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const countries = [
    'USA', 'UK', 'India', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 
    'China', 'Singapore', 'Hong Kong', 'Brazil', 'Mexico', 'South Korea', 'Netherlands',
    'Switzerland', 'Denmark', 'Sweden', 'Norway', 'Belgium'
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name.trim()) {
        setError('Name is required');
        return;
      }

      const result = await signup(email, password, name, country);
      if (!result.success) {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
       
            <h1>Stock Portfolio</h1>
            <p>Manage your global stock portfolio with ease</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="login-form">
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <div className="input-wrapper">
                  <FiGlobe className="input-icon" />
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="form-input"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? '...' : isSignUp ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setName('');
                }}
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">🔓 Demo Account:</p>
            <p>Email: <code>demo@stockportfolio.com</code></p>
            <p>Password: <code>demo123</code></p>
          </div>

          <div className="features-grid">
            <div className="feature">
              <span>📊</span>
              <p>Portfolio Management</p>
            </div>
            <div className="feature">
              <span>🌍</span>
              <p>50+ Int'l Stocks</p>
            </div>
            <div className="feature">
              <span>📈</span>
              <p>Live Tracking</p>
            </div>
            <div className="feature">
              <span>💹</span>
              <p>Analytics</p>
            </div>
          </div>
        </div>

        <div className="login-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
