import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// --- This is the CartIcon, moved inside the Header ---
const CartIcon = () => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Link to="/cart" className="relative flex items-center">
      {/* ... (SVG code is the same) ... */}
      <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
      <span className="absolute -top-2 -right-3 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {itemCount}
      </span>
    </Link>
  );
};

// --- This is the new Header ---
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-main/70 backdrop-blur-lg border-b border-border-color shadow-sm">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-text-primary transition-transform hover:scale-105">
          Bookstore
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link to="/" className="font-medium text-text-secondary hover:text-text-primary transition-colors">Home</Link>
          {/* --- FIX: Link to the general Explore page --- */}
          <Link to="/explore" className="font-medium text-text-secondary hover:text-text-primary transition-colors">
            Explore Stores
          </Link>
          <CartIcon />
        </nav>
      </div>
    </header>
  );
}