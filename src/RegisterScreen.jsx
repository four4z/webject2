import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterScreen.module.css'; // Import the CSS module file

const RegisterScreen = () => {
  const navigate = useNavigate();

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    // Add your registration logic here
    // After successful registration, navigate to the sign-in page
    navigate('/signin');
  };

  return (
    <div className={styles['register-screen']}> {/* Apply CSS module class */}
      <h2>Register</h2>
      <form onSubmit={handleRegisterSubmit}>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email Address" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Confirm Password" required />
        <button type="submit">Register</button>
      </form>
      <div className={styles['signin-link']}> {/* Apply CSS module class */}
        <p>Already have an account?</p>
        <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
};

export default RegisterScreen;
