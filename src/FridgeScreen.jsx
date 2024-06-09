import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './FridgeScreen.css';
import logo from './fridge-transparent.png'

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

const FridgeScreen = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState('');
  const [note, setNote] = useState('');
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [isNotePopupVisible, setNotePopupVisibility] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [nearExpiryItems, setNearExpiryItems] = useState([]);
  const [selectedFridge, setSelectedFridge] = useState('volvo');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/items'); // Update this URL to match your API
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const addItem = async () => {
    if (newItem && expiryDate) {
      const newItemObj = { name: newItem, quantity, expiryDate, note };
      try {
        const response = await axios.post('http://localhost:3000/api/items', newItemObj); // Update this URL to match your API
        setItems([...items, response.data]);
        setNewItem('');
        setQuantity(1);
        setExpiryDate('');
        setNote('');
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/items/${id}`); // Update this URL to match your API
      setItems(items.filter(items => items.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/');
  };

  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };

  const toggleNotePopup = (noteContent) => {
    setCurrentNote(noteContent);
    setNotePopupVisibility(!isNotePopupVisible);
  };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < Math.ceil(Itemname.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const today = new Date();
    const nearExpiry = items.filter(items => {
      const expiryDate = new Date(items.expiryDate);
      const diffTime = Math.abs(expiryDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3;
    });
    setNearExpiryItems(nearExpiry);
  }, [items]);


  const handleChange = (event) => {
    setSelectedFridge(event.target.value);
  };

  return (
    <div className="fridge-screen">
      <div className="navbar">
        <img src={logo} alt="Fridge Logo" className='nav-logo'/>
        <div className="navbar-buttons">
          <button onClick={togglePopup} className="profile-button2">Profile</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {isPopupVisible && (
        <div className="popup">
          <div>
            <ProfileScreen togglePopup={togglePopup} />
          </div>
        </div>
      )}
      {isNotePopupVisible && (
        <div className="note-popup">
          <div className="popup-content">
            <p>{currentNote}</p>
            <button className="btn btn-primary" onClick={() => setNotePopupVisibility(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="noti">Placeholder text for notification or additional content.</div>
      <span className="selected-fridge-text">Selected fridge: {selectedFridge.charAt(0).toUpperCase() + selectedFridge.slice(1)}</span>
      <select className="select-fridge" name="cars" id="cars" onChange={handleChange} value={selectedFridge}>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
      <div className="fridge">
        {items.map((items, index) => (
          <div className={`red-box red-box-${index + 1}`} key={index}>
            <h3>{items.name}</h3>
            <p>Quantity: {items.quantity}</p>
            <p>Expiry Date: {items.expiryDate}</p>
            <button onClick={() => toggleNotePopup(items.note)}>Note</button>
            <button onClick={() => removeItem(items.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="green-box">
        <h3 className='noti-expire'>Items Near Expiry</h3>
        {nearExpiryItems.map((items, index) => (
          <div className={`red-box red-box-${index + 1} near-expiry`} key={index}>
            <h3>{items.name}</h3>
            <p>Quantity: {items.quantity}</p>
            <p>Expiry Date: {items.expiryDate}</p>
            <button onClick={() => toggleNotePopup(items.note)}>Note</button>
          </div>
        ))}
      </div>
      {/* <div className="big-blue-box">
        <div className='add-header'>add new item</div>
        <div className="add-item">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Note (max 100 characters)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={100}
          />
          <button onClick={addItem}>Add Item</button>
        </div>
      </div> */}

      <div className="big-blue-box">
        <div className="text">
          Add item
        </div>
        <form action="#">
          <div className="form-row">
            <div className="input-data">
              <input className='input2'
              type="text"
              // placeholder="Item Name"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}required
              />
              <div className="underline"></div>
              <label htmlFor="">Item name</label>
            </div>
            <div className="input-data">
              <input className='input2'
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}required
              />
              <div className="underline"></div>
              <label htmlFor="">Quantity</label>
            </div>
          </div>
          <div className="form-row">
            <div className="input-data">
              <input className='input2'
              type="date"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}required
              />
              <div className="underline"></div>
              <label className='label-ex'htmlFor="">Expiry Date</label>
            </div>

          </div>
          <div className="form-row">
            <div className="input-data">
              <input className='input2'
              type="text"
              placeholder="Note (max 100 characters)"
              value={note}
              onChange={(e) => setNote(e.target.value)}required
              maxLength={100}
              />
              <div className="underline"></div>
              <label className='label-ex' htmlFor="">Note</label>
            </div>
          </div>
          <div className="submit-btn">
            <div className="input-data">
              <div className="inner"></div>
            < input type="button" value="Add Item" onClick={addItem} />
            </div>
          </div>

          {/* <div className="form-row">
            <div className="input-data textarea">
              <textarea rows="8" cols="80" required></textarea>
              <br />
              <div className="underline"></div>
              <label htmlFor="">Write your message</label>
              <br />
              <div className="form-row submit-btn">
                <div className="input-data">
                  <div className="inner"></div>
                  <input type="submit" value="submit" />
                </div>
              </div>
            </div>
          </div> */}
        </form>
      </div> 




    </div>
  );
};

export default FridgeScreen;
