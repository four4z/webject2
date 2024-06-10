import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './FridgeScreen.css';

const ProfileScreen = ({ togglePopup }) => {
    const location = useLocation();
    const [profile, setProfile] = useState({ username: '', email: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);
    const [showFridge, setShowFridge] = useState(false);
    const [fridgeName, setFridgeName] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isCreateFridge, setIsCreateFridge] = useState(true);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [clipboardStatus, setClipboardStatus] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/getUser', { withCredentials: true });
                const { _id, username, email } = response.data;
                setProfile({ _id, username: username, email: email, password: '' });
                setTempProfile({ _id, username: username, email: email, password: '' });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempProfile((prevTempProfile) => ({ ...prevTempProfile, [name]: value }));
    };

    const handleSave = async () => {
        if (!isPasswordVerified) {
            alert('Please verify your password first!');
            return;
        }
    
        try {
            const profileData = { ...tempProfile }; // Ensure id is included
            console.log('Saving profile data:', profileData); // Debug information
    
            const response = await axios.post('http://localhost:3000/api/editaccount', profileData, { withCredentials: true });
            console.log('Profile updated successfully:', response.data);
    
            setProfile(tempProfile);
            setIsEditing(false);
            setIsPasswordVerified(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
    
            // Display detailed error message
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Failed to update profile. Please try again.';
            alert(errorMessage);
        }
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
            name: fridgeName, // Send the fridge name
        }, { withCredentials: true });
        const joinKey = response.data.joinKey;
        setGeneratedCode(joinKey);
        await navigator.clipboard.writeText(joinKey);
        setClipboardStatus('Join key copied to clipboard!');
    } catch (error) {
        console.error('Error generating join key:', error);
        setClipboardStatus('Failed to copy join key. Please try again.');
    }
};

    const handleJoinFridge = async (e) => {
        e.preventDefault();
        setShowSuccessPopup(true);
    };

    const handleCreateFridge = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/createFridge', { name: fridgeName });
            const { joinKey } = response.data;
            setJoinKey(joinKey);
            setSuccessPopup(true);
            setCopied(false);
        } catch (error) {
            console.error('Error creating fridge:', error);
        }
    };

    const handleSuccessPopupClose = () => {
        setSuccessPopup(false);
        setJoinKey('');
        setCopied(false);
    };


    const verifyPassword = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/verifyPassword', {
                password: tempProfile.password,
            }, { withCredentials: true });
            if (response.data.match) {
                setIsPasswordVerified(true);
                alert('Password verified successfully!');
            } 
        } catch (error) {
            alert('Incorrect password!', error);
        }
    };

    return (
        <div className="profile-screen">
            <div className={`profile-container ${isEditing ? 'editing' : ''} ${showFridge ? 'slide-out' : ''}`}>
                <div className="row">
                    <div className="col-md-3 border-right profile-picture-section">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="profile" />
                            <span> </span>
                        </div>
                    </div>
                    <div className="col-md-9 profile-settings-section">
                        <div className="row mt-2 edit-profile">
                            <div className="col-md-6">
                                <label className="labels">Username</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="username"
                                        name="username"
                                        value={tempProfile.username}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="display-field">{profile.username}</div>
                                )}
                            </div>
                            <div className="col-md-6">
                            <label className="labels">Email</label>
                            <div className="display-field">{profile.email}</div>
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
                                    <button className="btn btn-secondary mt-2" type="button" onClick={verifyPassword}>
                                        Check Password
                                    </button>
                                </div>
                            </div>
                        )}
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
                                placeholder="Fridge Name"
                                value={fridgeName}
                                onChange={(e) => setFridgeName(e.target.value)}
                            />
                            
                            <button className="btn btn-primary mt-2" onClick={handleGenerateCode}>
                                Generate Join Key
                            </button>
                            {generatedCode && (
                                <div className="generated-code mt-2">
                                    <strong>Join Key:</strong> {generatedCode}
                                    <div className="clipboard-status">{clipboardStatus}</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleJoinFridge}>
                            <input type="text" className="form-control mt-2" placeholder="Enter Join Key" />
                            <button type="submit" className="btn btn-primary mt-2">
                                Join Fridge
                            </button>
                        </form>
                    )}
                </div>
            </div>
            {showSuccessPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h4>Fridge Joined Successfully!</h4>
                        <button className="btn btn-primary" onClick={handleSuccessPopupClose}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;
