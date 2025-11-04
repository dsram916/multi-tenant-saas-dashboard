import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { motion } from 'framer-motion';

export default function BookCard({ book }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-bg-main rounded-lg overflow-hidden border border-border-color flex flex-col shadow-sm"
    >
      {/* --- THIS IS THE FIX --- */}
      {/* 1. We replaced 'h-64' with 'aspect-[2/3]' to get a taller, book-like shape */}
      <div className="aspect-[2/3] bg-bg-card flex items-center justify-center overflow-hidden">
        <img 
          src={`http://localhost:5001${book.coverImageUrl}`} 
          alt={book.title}
          // 2. We changed 'object-cover' to 'object-contain' to show the FULL image
          className="w-full h-full object-contain"
        />
      </div>
      {/* --- END OF FIX --- */}
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-text-primary mb-1 truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-text-secondary mb-4">by {book.author}</p>
        <div className="flex-grow"></div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-text-primary">₹{book.price}</p>
          <button 
            onClick={() => addToCart(book)} 
            className="btn-primary px-4 py-2 text-sm font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}