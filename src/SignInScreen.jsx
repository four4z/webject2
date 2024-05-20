import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterScreen.module.css'; 

const SignInScreen = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    navigate('/fridge');
  };

  return (
    <div className={styles['register-screen-container']}>
      <h2>Sign In</h2>
      <form onSubmit={handleLoginSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
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
