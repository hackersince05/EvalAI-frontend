import React, { useState, useEffect } from 'react';

// UserContext provides the authenticated user's session data (role, email, etc.)
// and a logout function to any component in the tree without prop drilling.
import { UserContext } from './UserContext';

// Supabase client — used here to manage session lifecycle (restore, listen, sign out)
import { supabase } from './supabaseClient';

// Public-facing pages — no login required
import SplashScreen from './SplashScreen'; // Animated intro screen on first load
import LandingPage from './LandingPage';   // Marketing home page
import LoginPage from './LoginPage';       // Login form
import SignUpPage from './SignUpPage';     // Registration form

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
const AUTHENTICATED_PAGES = [
  // Lecturer routes
  'dashboard', 'assessments', 'grading', 'rubrics', 'analytics', 'settings',
  // Student routes
  'take-test', 'results',
];

// The first page each role lands on immediately after login
const ROLE_HOME = {
  lecturer: 'dashboard',
  student:  'take-test',
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');

  // Holds the authenticated user's data — set by Supabase session events, not localStorage.
  // null means unauthenticated. Shape: { id, email, fullName, role, isAuthenticated }
  const [user, setUser] = useState(null);

  // On mount: check for an active Supabase session (handles page refresh)
  // and subscribe to auth state changes for the lifetime of the app.
  useEffect(() => {
    // Restore session if the user is already signed in from a previous visit
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) hydrateUserFromSession(session);
    });

    // onAuthStateChange fires on: sign in, sign out, token refresh, and initial load.
    // This is the single source of truth for session state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          hydrateUserFromSession(session);
        } else {
          // Session ended (signed out or expired) — clear user state
          setUser(null);
        }
      }
    );

    // Clean up the listener when the App component unmounts
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetches the profiles row for the given Supabase session and sets user state.
  // Also navigates to the correct role home if the user is currently on a public page.
  const hydrateUserFromSession = async (session) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', session.user.id)
      .single();

    // Primary source: profiles table row.
    // Fallback: user_metadata written at sign-up time — covers cases where the
    // handle_new_user trigger hasn't run or the profiles row doesn't exist yet.
    const role     = profile?.role     ?? session.user.user_metadata?.role;
    const fullName = profile?.full_name ?? session.user.user_metadata?.full_name ?? '';

    if (role) {
      setUser({
        id:              session.user.id,
        email:           session.user.email,
        fullName,
        role,
        isAuthenticated: true,
      });

      // If the user is still on a public page (e.g. after a refresh), send them home
      setCurrentPage(prev =>
        ['landing', 'login', 'signup'].includes(prev)
          ? (ROLE_HOME[role] ?? 'dashboard')
          : prev
      );
    }
  };

  // Called by SplashScreen once its animation completes — reveals the app
  const handleSplashFinish = () => setShowSplash(false);

  // Central navigation handler passed to every page component and the sidebar.
  // `page` — destination route key (e.g. 'dashboard', 'take-test')
  // `data` — optional user payload for optimistic state update right after sign-in,
  //           before the Supabase onAuthStateChange listener has a chance to fire.
  const handleNavigate = (page, data) => {
    if (data) setUser({ ...data, isAuthenticated: true });

    const role = data?.role ?? user?.role;

    // Redirect each role to their actual home — 'dashboard' is a generic alias
    if (page === 'dashboard' && role) {
      setCurrentPage(ROLE_HOME[role] ?? 'dashboard');
    } else {
      setCurrentPage(page);
    }
  };

  // Signs the user out via Supabase (clears the session from storage automatically),
  // then returns to the landing page. onAuthStateChange will set user to null.
  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('landing');
  };

  // True when the current route requires authentication (renders inside AppLayout)
  const isAuthenticated = AUTHENTICATED_PAGES.includes(currentPage);

  // Maps the active route key to its corresponding page component.
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
            {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
            {currentPage === 'login'   && <LoginPage   onNavigate={handleNavigate} />}
            {currentPage === 'signup'  && <SignUpPage  onNavigate={handleNavigate} />}

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
