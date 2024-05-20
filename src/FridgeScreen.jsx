// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './FridgeScreen.css'; // Make sure to import the CSS file

// const FridgeScreen = () => {
//   const [items, setItems] = useState([
//     { name: 'Milk', quantity: 2 },
//     { name: 'Eggs', quantity: 12 },
//     { name: 'Butter', quantity: 1 },
//   ]);

//   const [newItem, setNewItem] = useState('');
//   const [quantity, setQuantity] = useState(1);

//   const navigate = useNavigate();

//   const addItem = () => {
//     if (newItem) {
//       setItems([...items, { name: newItem, quantity }]);
//       setNewItem('');
//       setQuantity(1);
//     }
//   };

//   const removeItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const handleLogout = () => {
//     // Add your logout logic here
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('username');
//     navigate('/signin');
//   };

//   return (
//     <div className="fridge-screen">
//       <button className="button-33 logout-button" onClick={handleLogout}>Logout</button>
//       <h2>Fridge Inventory</h2>
//       <div className="add-item">
//         <input
//           type="text"
//           placeholder="Item Name"
//           value={newItem}
//           onChange={(e) => setNewItem(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Quantity"
//           value={quantity}
//           onChange={(e) => setQuantity(Number(e.target.value))}
//         />
//         <button onClick={addItem}>Add Item</button>
//       </div>
//       <div className="fridge-items">
//         {items.map((item, index) => (
//           <div className="fridge-item" key={index}>
//             <h3>{item.name}</h3>
//             <p>Quantity: {item.quantity}</p>
//             <button onClick={() => removeItem(index)}>Remove</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FridgeScreen;




// import React from 'react';
// import './FridgeScreen.css';

// const FridgeScreen = () => {
//   return (
//     <div className="container">
//       <div className="fridge">
//         <div className="red-box red-box-1">Text</div>
//         <div className="red-box red-box-2">Text</div>
//         <div className="red-box red-box-3">Text</div>
//         <div className="red-box red-box-4">Text</div>
//         <div className="red-box red-box-5">Text</div>
//         <div className="red-box red-box-6">Text</div>
//         <div className="red-box red-box-7">Text</div>
//         <div className="red-box red-box-8">Text</div>
//         <div className="red-box red-box-9">Text</div>
//       </div>
//       <div className="green-box">Text</div>
//       <div className="small-blue-box small-blue-box-1"></div>
//       <div className="small-blue-box small-blue-box-2"></div>
//       <div className="big-blue-box">Text</div>
//     </div>
//   );
// };

// export default FridgeScreen;





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FridgeScreen.css'; // Make sure to import the CSS file

const FridgeScreen = () => {
  const [items, setItems] = useState([
    { name: 'Milk', quantity: 2 },
    { name: 'Eggs', quantity: 12 },
    { name: 'Butter', quantity: 1 },
  ]);

  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const addItem = () => {
    if (newItem) {
      setItems([...items, { name: newItem, quantity }]);
      setNewItem('');
      setQuantity(1);
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/signin');
  };

  const handleProfile = () => {

    navigate('/profile');
  };

  return (
    <div className="fridge-screen">
      <div className="navbar">
        <h1>Fridge App</h1>

        <div class="navbar-buttons">
          <button className="button-33 profile-button" onClick={handleProfile}>profile</button>
          <button className="button-33 logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="noti">เดี๋ยวเอารูปจริงมาใส่แทนกรอบแดง เขียวแจ้งเตือน ฟ้า add item</div>
      <div className="fridge">
        {items.map((item, index) => (
          <div className={`red-box red-box-${index + 1}`} key={index}>
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => removeItem(index)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="green-box">
        <h3>Green Box Content</h3>
      </div>
      <div className="big-blue-box">
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
          <button onClick={addItem}>Add Item</button>
        </div>
      </div>
    </div>
  );
};

export default FridgeScreen;

