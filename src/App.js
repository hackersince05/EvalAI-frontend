import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import LandingPage from './LandingPage';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {!showSplash && <LandingPage />}
    </>
  );
}

export default App;
