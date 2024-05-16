import React from 'react';

const MenuScreen = () => {
  const menuItems = [
    { name: 'Caramel Macchiato', price: 4.00 },
    { name: 'Vanilla Latte', price: 3.00 },
    { name: 'Traditional Cappuccino', price: 3.50 },
    { name: 'White Chocolate Mocha', price: 4.00 },
  ];

  return (
    <div className="menu-screen">
      <h2>Menu</h2>
      <div className="menu-container">
        {menuItems.map((item, index) => (
          <div className="menu-item" key={index}>
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
            <button>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuScreen;
