import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import SignInScreen from './SignInScreen';
import RegisterScreen from './RegisterScreen';
import FridgeScreen from './FridgeScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/fridge" element={<FridgeScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
