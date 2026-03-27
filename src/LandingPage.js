import { useState, useEffect } from 'react';
import './LandingPage.css';

const TYPING_LINES = ['Intelligent Assessment', 'Beyond Keywords'];
const TYPING_SPEED = 55;

function useTypingEffect() {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase === 0) {
      if (line1.length < TYPING_LINES[0].length) {
        const t = setTimeout(() => setLine1(TYPING_LINES[0].slice(0, line1.length + 1)), TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase(1), 200);
        return () => clearTimeout(t);
      }
    } else if (phase === 1) {
      if (line2.length < TYPING_LINES[1].length) {
        const t = setTimeout(() => setLine2(TYPING_LINES[1].slice(0, line2.length + 1)), TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        setPhase(2);
      }
    }
  }, [line1, line2, phase]);

  return { line1, line2, done: phase === 2 };
}

function LandingPage({ onNavigate }) {
  const { line1, line2, done } = useTypingEffect();

  const handleGetStarted = () => {
    // Navigate to dashboard or signup
    window.location.href = '/dashboard';
  };

  const handleStudentClick = () => {
    // Navigate to student assessments
    window.location.href = '/student-assessments';
  };

  const handleLecturerClick = () => {
    // Navigate to lecturer dashboard
    window.location.href = '/lecturer-dashboard';
  };

  const handleLoginClick = () => {
    // Navigate to login page
    onNavigate('login');
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/evalai-logo.png`} alt="EvalAI" className="nav-logo-img" />
          </div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#support">Support</a></li>
          </ul>
          <div className="nav-buttons">
            <button className="btn-login" onClick={handleLoginClick}>Log In</button>
            <button className="btn-get-started" onClick={handleGetStarted}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Interactive, SBERT-powered assessment</div>
          <h1 className="hero-title">
<<<<<<< HEAD
            {line1}<span className={`type-cursor${done ? ' type-cursor-done' : ''}`}>|</span>
            {line2.length > 0 && <><br />{line2}</>}
=======
            <span>{line1}{line1.length < TYPING_LINES[0].length && <span className="type-cursor" />}</span>
            <br />
            <span>{line2}{!done && line1.length === TYPING_LINES[0].length && <span className="type-cursor" />}{done && <span className="type-cursor type-cursor-blink" />}</span>
>>>>>>> feature/dark-silver-theme
          </h1>
          <p className="hero-description">
            EvalAI uses Sentence-BERT to evaluate theory answers based on meaning, not just keyword matching.
          </p>
          <p className="hero-subtext">
            Buttons, toolips, and role-specific sections are designed to stay clear and readable on desktops, tablets, and mobile devices.
          </p>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="role-section">
        <div className="role-container">
          {/* Student Card */}
          <div className="role-card student-card">
            <img src="/studenticon.avif" alt="Student" className="role-icon" />
            <h2 className="role-title">I am a Student</h2>
            <p className="role-description">
              Personalized workspace with assessments and feedback tailored to you.
            </p>
            <ul className="role-features">
              <li>Access upcoming assessments, see rubric-based scores for assignments you've completed, and review detailed feedback that explains how your answers were evaluated.</li>
            </ul>
            <button className="btn-primary" onClick={handleStudentClick}>Go to Assessments</button>
            <a href="#results" className="secondary-link">View Past Results</a>
            <p className="role-footnote">Tip: After you sign in, this area updates with your active and completed assessments.</p>
          </div>

          {/* Lecturer Card */}
          <div className="role-card lecturer-card">
            <img src="/lecturericon.jpg" alt="Lecturer" className="role-icon" />
            <h2 className="role-title">I am a Lecturer</h2>
            <p className="role-description">
              Role-aware dashboard for question design, grading, and analytics.
            </p>
            <ul className="role-features">
              <li>Create and manage question banks, configure rubrics, and monitor automated grading at scale. Drill into cohort performance with analytics designed for secure, evidence-based evaluation.</li>
            </ul>
            <button className="btn-primary" onClick={handleLecturerClick}>Manage Assessments</button>
            <a href="#analytics" className="secondary-link">View Class Analytics</a>
            <p className="role-footnote">Tip: Once authenticated, you'll have course-specific analytics and board activity here.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Trustworthy Automated Evaluation</h2>
          <p className="features-subtitle">Built for accuracy, transparency, and academic integrity.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"/>
                  <line x1="16.5" y1="16.5" x2="22" y2="22"/>
                  <path d="M8 11a3 3 0 0 1 6 0"/>
                </svg>
              </div>
              <h3>Semantic Analysis</h3>
              <p>Uses SBERT to understand the context and meaning of answers, ensuring grades reflect true understanding.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <line x1="9" y1="7" x2="15" y2="7"/>
                  <line x1="9" y1="11" x2="15" y2="11"/>
                  <polyline points="9 15 11 17 15 13"/>
                </svg>
              </div>
              <h3>Rubric-based Scoring</h3>
              <p>Evaluates against specific criteria like accuracy, completeness, and clarity for consistent, fair results.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <line x1="9" y1="9" x2="15" y2="9"/>
                  <line x1="9" y1="13" x2="13" y2="13"/>
                </svg>
              </div>
              <h3>Detailed Feedback</h3>
              <p>Generates constructive feedback automatically, helping students learn from their mistakes immediately.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                  <line x1="2" y1="20" x2="22" y2="20"/>
                </svg>
              </div>
              <h3>Performance Analytics</h3>
              <p>Track progress over time with comprehensive dashboards for both individual students and entire classes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 EvalAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
