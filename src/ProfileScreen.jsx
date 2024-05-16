import React from 'react';

const ProfileScreen = () => {
  const profileInfo = {
    name: 'Laura Vat',
    email: 'laura.vat@example.com',
    points: 124,
  };

  return (
    <div className="profile-screen">
      <h2>Profile</h2>
      <div className="profile-container">
        <h3>Name: {profileInfo.name}</h3>
        <p>Email: {profileInfo.email}</p>
        <p>Points: {profileInfo.points}</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
