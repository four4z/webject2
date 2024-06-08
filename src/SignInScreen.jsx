import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterScreen.module.css'; 
import logo from './fridge-transparent.png'; // Import the image

const SignInScreen = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const userData = {
      username: 'Edogaru',
      email: 'edogaru@mail.com.my',
      password: 'password123',
    };
    navigate('/fridge', { state: userData });
  };

  return (
    <div className={styles['register-screen-container']}>
      <div className={styles['screen-2']}>
        <img className={styles.logo} src={logo} alt="Logo" /> {/* Use the imported image */}
        <h2 className={styles['text']}>Sign In</h2>
        <form onSubmit={handleLoginSubmit}>
          <input className={styles["input-regis"]} type="email" placeholder="Email" required />
          <input className={styles["input-regis"]} type="password" placeholder="Password" required />
          <button className={styles["button-submit"]} type="submit">Login</button>
        </form>
        <div className={styles["signin-link"]}>
          <p>Don't have an account?
          <Link to="/register">  Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
