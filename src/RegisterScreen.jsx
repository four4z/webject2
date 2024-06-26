import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css'; 
import logo from './fridge-transparent.png'; 

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/signup', formData);
      console.log('Registration successful:', response.data);
      navigate('/signin');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles['register-screen-container']}>
      <div className={styles['screen-1']}>
        <img className={styles.logo} src={logo} alt="Logo" /> {/* Use the imported image */}
        <h2 className={styles['text']}>Register</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input 
            className={styles["input-regis"]}
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
          <input
            className={styles["input-regis"]}
            type="email"
            placeholder="Email"
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
        <div className={styles["signin-link"]}>
          <p>Already have an account?
            <Link to="/signin"> Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
