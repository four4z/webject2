import React, { useState } from 'react';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    surname: '',
    mobileNumber: '',
    addressLine1: '',
    addressLine2: '',
    postcode: '',
    state: '',
    area: '',
    email: '',
    education: '',
    country: '',
    region: '',
    experience: '',
    additionalDetails: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Profile saved:', profile);
  };

  return (
    <div className="profile-screen">
      <div className="profile-container container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-3 border-right profile-picture-section">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                className="rounded-circle mt-5"
                width="150px"
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                alt="profile"
              />
              <span className="font-weight-bold">Edogaru</span>
              <span className="text-black-50">edogaru@mail.com.my</span>
              <span> </span>
            </div>
          </div>
          <div className="col-md-5 border-right profile-settings-section">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Settings</h4>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="labels">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="first name"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">Surname</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="surname"
                    name="surname"
                    value={profile.surname}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label className="labels">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="enter phone number"
                    name="mobileNumber"
                    value={profile.mobileNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12">
                  <label className="labels">Email ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="enter email id"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>
              
              </div>
              <div className="mt-5 text-center">
                <button className="btn btn-primary profile-button" type="button" onClick={handleSubmit}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
