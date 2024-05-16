import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterScreen.module.css'; // Import the CSS module file
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

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        navigate('/signin');
      }
    } catch (err) {
      console.error(err);
      alert('Error registering user');
    }
  };

  return (
    <div className={styles['register-screen']}> {/* Apply CSS module class */}
      <h2>Register</h2>
      <form onSubmit={handleRegisterSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          value={name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          required
        />
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
