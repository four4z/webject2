import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css'; 

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to MyFridge</h1>
      <button className="button-33" onClick={handleGetStarted}>Get Started</button>
    </div>
  );
};

export default WelcomeScreen;
