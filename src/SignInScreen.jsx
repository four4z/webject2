import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterScreen.module.css'; 

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
        <img className={styles.logo} src="https://i.pinimg.com/originals/7b/2a/86/7b2a86993b5bb7eafa019815af8a2d0c.png" alt="Logo" />
        <h2>Sign In</h2>
        <form onSubmit={handleLoginSubmit}>
          <input className={styles["input-regis"]} type="email" placeholder="Email" required />
          <input className={styles["input-regis"]} type="password" placeholder="Password" required />
          <button className={styles["button-submit"]} type="submit">Login</button>
        </form>
        <div className={styles["signin-link"]}>
          <p>Don't have an account?</p>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
