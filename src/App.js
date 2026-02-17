import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import AppLayout from './AppLayout';
import DashboardPage from './DashboardPage';
import Dashboard from './Assessments';
import './App.css';

const AUTHENTICATED_PAGES = ['dashboard', 'assessments', 'grading', 'rubrics', 'analytics', 'settings'];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [userData, setUserData] = useState(null);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleNavigate = (page, data) => {
    setCurrentPage(page);
    if (data) {
      setUserData(data);
    }
  };

  const isAuthenticated = AUTHENTICATED_PAGES.includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'assessments':
        return <Dashboard />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {!showSplash && (
        <>
          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {isAuthenticated && (
            <AppLayout currentPage={currentPage} onNavigate={handleNavigate}>
              {renderPage()}
            </AppLayout>
          )}
        </>
      )}
    </>
  );
}

export default App;
