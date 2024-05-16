import React from 'react';
import { Link } from 'react-router-dom';

const SignInScreen = () => {
  return (
    <div className="signin-screen">
      <h2>Sign In</h2>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        <p>Don't have an account?</p>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default SignInScreen;
