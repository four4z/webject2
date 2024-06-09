import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './FridgeScreen.css';

const ProfileScreen = ({ togglePopup }) => {
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

  const handleGenerateCode = async () => {
    if (!fridgeName) {
      alert('Please enter a fridge name');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/createFridge', {
        name: fridgeName,
        owner: profile.firstName // or another identifier for the owner
      });
      const { joinKey } = response.data;
      setGeneratedCode(joinKey);
    } catch (error) {
      console.error('Error generating join key:', error);
      alert('Failed to generate join key. Please try again.');
    }
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
      <div className={`profile-container ${isEditing ? 'editing' : ''} ${showFridge ? 'slide-out' : ''}`}>
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
            <div className="">
              <div className="row mt-2 edit-profile">
                <div className="col-md-6 edit-profile">
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

      <div className={`fridge-container ${showFridge ? 'slide-in' : ''}`}>
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
            <div className="mt-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter fridge name"
                value={fridgeName}
                onChange={(e) => setFridgeName(e.target.value)}
              />
              <button className="btn btn-primary mt-2" onClick={handleGenerateCode}>
                Generate Code
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
            <form onSubmit={handleJoinFridge}>
              <input type="text" className="form-control" placeholder="Enter join code" required />
              <button type="submit" className="btn btn-primary mt-2">
                Join Fridge
              </button>
            </form>
          )}
        </div>
      </div>

      {showSuccessPopup && (
        <div className="popup-container">
          <div className="popup">
            <p>Successfully joined the fridge!</p>
            <button className="btn btn-secondary" onClick={handleSuccessPopupClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
