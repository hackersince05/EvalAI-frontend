import React, { useState } from 'react';

// UserContext provides the authenticated user's session data (role, email, etc.)
// and a logout function to any component in the tree without prop drilling.
import { UserContext } from './UserContext';

// Public-facing pages — no login required
import SplashScreen from './SplashScreen'; // Animated intro screen on first load
import LandingPage from './LandingPage';   // Marketing home page
import LoginPage from './LoginPage';       // Login form; captures email + role selection
import SignUpPage from './SignUpPage';     // Registration form; same design as login page

// Shared authenticated layout — wraps all logged-in pages with the sidebar
import AppLayout from './AppLayout';

// Lecturer page components
import DashboardPage from './lecturer/DashboardPage'; // Lecturer overview / home
import Dashboard from './lecturer/Assessments';       // Assessment management
import GradingQueue from './lecturer/GradingQueue';   // Submissions awaiting grading review
import Rubrics from './lecturer/Rubrics';             // Rubric builder and management
import Analytics from './lecturer/Analytics';         // Class performance analytics

// Student page components
import TakeTest from './student/TakeTest'; // Test-taking interface for students
import Results from './student/Results';   // Student's past test results

import './App.css';

// All route keys that require authentication.
// Any key in this list causes AppLayout (sidebar) to be rendered.
// Split into lecturer and student sets for clarity — both are authenticated.
const AUTHENTICATED_PAGES = [
  // Lecturer routes
  'dashboard', 'assessments', 'grading', 'rubrics', 'analytics', 'settings',
  // Student routes
  'take-test', 'results',
];

// The first page each role lands on immediately after login
const ROLE_HOME = {
  lecturer: 'dashboard',
  student: 'take-test',
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');

  // Initialise user state from localStorage so the session survives a page refresh.
  // If no valid stored session is found, defaults to null (unauthenticated).
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('evalai_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Called by SplashScreen once its animation completes — hides the splash overlay
  const handleSplashFinish = () => setShowSplash(false);

  // Central navigation handler passed to every page component and the sidebar.
  // `page` — destination route key (e.g. 'dashboard', 'take-test')
  // `data` — optional user payload passed from LoginPage on successful sign-in
  const handleNavigate = (page, data) => {
    // If login data is provided (first navigation after sign-in), persist the user session
    if (data) {
      setUser(data);
      localStorage.setItem('evalai_user', JSON.stringify(data));
    }

    // Resolve the active role from the incoming data or existing user state
    const role = data?.role ?? user?.role;

    // If the destination is the generic 'dashboard' key, redirect each role
    // to their actual home page — students don't have a dashboard
    if (page === 'dashboard' && role) {
      setCurrentPage(ROLE_HOME[role] ?? 'dashboard');
    } else {
      setCurrentPage(page);
    }
  };

  // Clears the user session from state and localStorage, then returns to the landing page.
  // Passed into UserContext so the Sidebar logout link can call it without prop drilling.
  const logout = () => {
    localStorage.removeItem('evalai_user');
    setUser(null);
    setCurrentPage('landing');
  };

  // True when the current route is in the authenticated pages list.
  // Determines whether to render AppLayout (sidebar) or a standalone public page.
  const isAuthenticated = AUTHENTICATED_PAGES.includes(currentPage);

  // Maps the active route key to its corresponding page component.
  // Lecturer and student routes are separated by comment for clarity.
  // Falls back to DashboardPage for any unrecognised route key.
  const renderPage = () => {
    switch (currentPage) {
      // --- Lecturer routes ---
      case 'dashboard':   return <DashboardPage />;
      case 'assessments': return <Dashboard />;
      case 'grading':     return <GradingQueue />;
      case 'rubrics':     return <Rubrics />;
      case 'analytics':   return <Analytics />;

      // --- Student routes ---
      case 'take-test':   return <TakeTest />;
      case 'results':     return <Results />;

      default:            return <DashboardPage />;
    }
  };

  return (
    // UserContext.Provider makes { user, logout } available to any component
    // in the tree (e.g. Sidebar reads role to show the correct nav items)
    <UserContext.Provider value={{ user, logout }}>
      <>
        {/* Splash screen overlay — sits on top until its animation finishes */}
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

        {/* Main app — only rendered after the splash has completed */}
        {!showSplash && (
          <>
            {/* Public pages — standalone, no sidebar */}
            {currentPage === 'landing' && <LandingPage  onNavigate={handleNavigate} />}
            {currentPage === 'login'   && <LoginPage    onNavigate={handleNavigate} />}
            {currentPage === 'signup'  && <SignUpPage   onNavigate={handleNavigate} />}

            {/* Authenticated pages — wrapped in AppLayout which renders the sidebar.
                AppLayout passes currentPage and onNavigate down to the Sidebar. */}
            {isAuthenticated && (
              <AppLayout currentPage={currentPage} onNavigate={handleNavigate}>
                {renderPage()}
              </AppLayout>
            )}
          </>
        )}
      </>
    </UserContext.Provider>
  );
}

export default App;
