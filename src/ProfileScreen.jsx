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
  const [showFridge, setShowFridge] = useState(false);
  const [fridgeName, setFridgeName] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCreateFridge, setIsCreateFridge] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

  const handleGenerateCode = () => {
    if (!fridgeName) {
      alert('Please enter a fridge name');
      return;
    }
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    setGeneratedCode(code);
  };

  const handleJoinFridge = (e) => {
    e.preventDefault();
    setShowSuccessPopup(true);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setShowFridge(false);
  };

  return (
    <div className="profile-screen">
      <div className={`profile-container container rounded bg-white ${isEditing ? 'editing' : ''} ${showFridge ? 'slide-out' : ''}`}>
        <div className="row">
          <div className="col-md-3 border-right profile-picture-section">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                className="rounded-circle mt-5"
                width="150px"
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                alt="profile"
              />
              <span> </span>
            </div>
          </div>
          <div className="col-md-9 profile-settings-section">
            <div className="p-3 py-5">
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
          <button className="btn btn-primary fridge-button" type="button" onClick={() => setShowFridge(true)}>
            Fridge
          </button>
        </div>
      </div>

      <div className={`fridge-container container rounded bg-white ${showFridge ? 'slide-in' : ''}`}>
        <div className="p-3 py-5">
          <h4>Fridge</h4>
          <div className="btn-group">
            <button
              className={`btn ${isCreateFridge ? 'btn-primary selected' : 'btn-secondary'}`}
              onClick={() => setIsCreateFridge(true)}
            >
              Create Fridge
            </button>
            <button
              className={`btn ${!isCreateFridge ? 'btn-primary selected' : 'btn-secondary'}`}
              onClick={() => setIsCreateFridge(false)}
            >
              Join Fridge
            </button>
          </div>
          {isCreateFridge ? (
            <div className="mt-3">
              <label className="labels">Fridge Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter fridge name"
                value={fridgeName}
                onChange={(e) => setFridgeName(e.target.value)}
              />
              <button className="btn btn-confirm mt-2" type="button" onClick={handleGenerateCode}>
                Confirm
              </button>
              {generatedCode && (
                <div className="mt-2">
                  <p>Generated Code: {generatedCode}</p>
                  <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(generatedCode)}>
                    Copy Code
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleJoinFridge} className="mt-3">
              <label className="labels">Enter Code</label>
              <input type="text" className="form-control" placeholder="Enter code" required />
              <button className="btn btn-confirm mt-2" type="submit">
                Confirm
              </button>
            </form>
          )}
        </div>
      </div>

      {showSuccessPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <p>Success!</p>
            <button className="btn btn-primary" onClick={handleSuccessPopupClose}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
