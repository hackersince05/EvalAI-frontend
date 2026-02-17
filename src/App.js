import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import './App.css';

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

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {!showSplash && (
        <>
          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentPage === 'dashboard' && <Dashboard userData={userData} onNavigate={handleNavigate} />}
        </>
      )}
    </>
  );
}

export default App;
