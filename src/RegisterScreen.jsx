import React from 'react';
import { Link } from 'react-router-dom';

const RegisterScreen = () => {
  return (
    <div className="register-screen">
      <h2>Register</h2>
      <form>
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit">Register</button>
      </form>
      <div className="signin-link">
        <p>Already have an account?</p>
        <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
};

export default RegisterScreen;
