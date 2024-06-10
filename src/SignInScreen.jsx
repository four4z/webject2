import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css'; 
import logo from './fridge-transparent.png'; 

const SignInScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password }, {
        withCredentials: true 
      });
      console.log('Login successful:', response.data);
      navigate('/fridge', { state: response.data });
    } catch (error) {
      console.error('Error logging in:', error.response.data);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className={styles['register-screen-container']}>
      <div className={styles['screen-2']}>
        <img className={styles.logo} src={logo} alt="Logo" /> 
        <h2 className={styles['text']}>Sign In</h2>
        <form onSubmit={handleLoginSubmit}>
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
          <button className={styles["button-submit"]} type="submit">Login</button>
        </form>
        <div className={styles["signin-link"]}>
          <p>Don't have an account?
            <Link to="/register"> Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
