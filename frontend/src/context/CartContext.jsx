import React, { createContext, useContext, useState } from 'react';

// 1. Create the context
const CartContext = createContext();

// 2. Create a "hook" to easily use the context
export const useCart = () => useContext(CartContext);

// 3. Create the Provider (the component that holds the state)
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add a book to the cart
  const addToCart = (book) => {
    setCartItems((prevItems) => {
      // Check if the book is already in the cart
      const existingItem = prevItems.find((item) => item._id === book._id);

      if (existingItem) {
        // If it exists, just increase the quantity
        return prevItems.map((item) =>
          item._id === book._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        // If it's a new item, add it to the cart with qty 1
        return [...prevItems, { ...book, qty: 1 }];
      }
    });
    console.log('Added to cart:', book.title);
  };

  // Function to remove a book from the cart
  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => item._id !== bookId)
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};