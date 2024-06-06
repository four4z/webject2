import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const location = useLocation();
  const { username, email, password } = location.state || {};

  const initialProfileState = {
    firstName: username || '',
    email: email || '',
    password: password || '',
    confirmPassword: password || '',
  };

  const [profile, setProfile] = useState(initialProfileState);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(initialProfileState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prevTempProfile) => ({
      ...prevTempProfile,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (tempProfile.password !== tempProfile.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-screen">
      <div className={`profile-container container rounded bg-white ${isEditing ? 'editing' : ''}`}>
        <div className="row">
          <div className="col-md-3 border-right profile-picture-section">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                className="rounded-circle mt-5"
                width="150px"
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                alt="profile"
              />
              <span className="font-weight-bold">{profile.firstName}</span>
              <span className="text-black-50">{profile.email}</span>
              <span> </span>
            </div>
          </div>
          <div className="col-md-9 profile-settings-section">
            <div className="p-3 py-5">
              {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Settings</h4>
              </div> */}
              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="labels">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="username"
                      name="firstName"
                      value={tempProfile.firstName}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="display-field">{profile.firstName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="labels">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control"
                      placeholder="email"
                      name="email"
                      value={tempProfile.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="display-field">{profile.email}</div>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="labels">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="enter password"
                      name="password"
                      value={tempProfile.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="labels">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="confirm password"
                      name="confirmPassword"
                      value={tempProfile.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-right mt-3 edit-buttons">
          <button className="btn btn-secondary" onClick={isEditing ? handleCancel : () => setIsEditing(true)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          {isEditing && (
            <button className="btn btn-primary profile-button" type="button" onClick={handleSave}>
              Save Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
