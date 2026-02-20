import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Test credentials
  const TEST_CREDENTIALS = {
    email: 'test@evalai.com',
    password: 'Test123'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate credentials
    if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
      // Store user session
      const userData = {
        email,
        role,
        rememberMe,
        isAuthenticated: true
      };
      localStorage.setItem('evalai_user', JSON.stringify(userData));
      
      // Navigate to dashboard
      onNavigate('dashboard', { email, role });
    } else {
      setError('Invalid email or password. Use test@evalai.com / Test123');
    }
  };

  return (
    <div className="login-page">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <div 
            className="logo" 
            onClick={() => onNavigate('landing')}
            style={{ cursor: 'pointer' }}
          >
            <div className="logo-icon">EvalAI</div>
          </div>
          <div className="nav-right">
            <p className="login-subtitle">
                New to EvalAI?{' '}
                <a href="#signup" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}>
                  Create an account
                </a>
              </p>
          </div>
        </div>
      </nav>

      {/* Login Container */}
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-description">Sign in to access your assessments and dashboard</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="form-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">I am a</label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>

            <div className="form-options">
              <div className="checkbox-group">
                <input
                  id="remember"
                  type="checkbox"
                  className="checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="checkbox-label">Remember me</label>
              </div>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-login-submit">Sign In</button>
          </form>

          <div className="form-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-login">
            <button type="button" className="btn-social">
              <span>Google</span>
            </button>
            <button type="button" className="btn-social">
              <span>Microsoft</span>
            </button>
          </div>

          <p className="signup-prompt">
            Don't have an account?{' '}
            <a
              href="#signup"
              className="signup-link"
              onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}
            >
              Sign up here
            </a>
          </p>
        </div>

        <div className="login-side">
          <div className="side-content">
            <h2>Why choose EvalAI?</h2>
            <ul className="benefits-list">
              <li>Semantic understanding with SBERT technology</li>
              <li>Fair, transparent grading for all students</li>
              <li>Comprehensive analytics for educators</li>
              <li>Secure, reliable assessment platform</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
