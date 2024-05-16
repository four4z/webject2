import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import SignInScreen from './SignInScreen';
import RegisterScreen from './RegisterScreen';
import FridgeScreen from './FridgeScreen';
import ProfileScreen from './ProfileScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/fridge" element={<FridgeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
