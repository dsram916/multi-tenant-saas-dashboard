import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartIcon() {
  const { cartItems } = useCart();

  // Calculate total number of items
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Link 
      to="/cart" 
      className="fixed top-6 right-8 bg-primary text-white font-semibold py-2 px-4 rounded-md shadow-lg z-50 flex items-center gap-2"
    >
      {/* Simple cart icon (you can replace with a real icon) */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l2.433-10.946c.054-.242.048-.493 0-.734d-2.433-1.087H4.884M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      Cart
      <span className="bg-white text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {itemCount}
      </span>
    </Link>
  );
}