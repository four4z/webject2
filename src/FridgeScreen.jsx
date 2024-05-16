import React, { useState } from 'react';

const FridgeScreen = () => {
  const [items, setItems] = useState([
    { name: 'Milk', quantity: 2 },
    { name: 'Eggs', quantity: 12 },
    { name: 'Butter', quantity: 1 },
  ]);

  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="fridge-screen">
      <h2>Fridge Inventory</h2>
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
      <div className="fridge-items">
        {items.map((item, index) => (
          <div className="fridge-item" key={index}>
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => removeItem(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FridgeScreen;
