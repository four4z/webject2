import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterScreen.module.css'; 
import axios from 'axios';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    navigate('/signin');
  };

  return (
    <div className={styles['register-screen-container']}>
      <div className={styles['screen-1']}>
        <img className={styles.logo} src="https://i.pinimg.com/originals/7b/2a/86/7b2a86993b5bb7eafa019815af8a2d0c.png" alt="Logo" />
        <h2>Register</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input
            className={styles["input-regis"]}
            type="text"
            placeholder="User Name"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
          <input
            className={styles["input-regis"]}
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
          <input
            className={styles["input-regis"]}
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
          <input 
            className={styles["input-regis"]}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
          <button className={styles["button-submit"]} type="submit">Register</button>
        </form>
        <div className={styles['signin-link']}>
          <p>Already have an account?</p>
          <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
