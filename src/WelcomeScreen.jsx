import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css'; 
import bg from './image_fridge1.png'; // Import the image

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signin');
  };

  return (
    <div className="welcome-container" style={{ backgroundImage: `url(${bg})` }}>
      <h1>Welcome to MyFridge</h1>
      <button className="button-33" onClick={handleGetStarted}>Get Started</button>
    </div>
  );
};

export default WelcomeScreen;
