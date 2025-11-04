import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditBookModal({ book, onClose, onBookUpdated }) {
  // Use the book's data to pre-fill the form
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [price, setPrice] = useState(book.price);
  const [loading, setLoading] = useState(false);

  // This just makes sure if the book prop changes, the form updates
  useEffect(() => {
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(book.price);
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the "Update" endpoint we already built
      const res = await axios.put(`/api/books/${book._id}`, {
        title,
        author,
        price,
      });
      onBookUpdated(res.data); // Send the updated book back
      onClose(); // Close the modal
    } catch (err) {
      console.error('Failed to update book', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose} // Close modal on backdrop click
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700"
          onClick={(e) => e.stopPropagation()} // Prevent closing
        >
          <h2 className="text-2xl font-bold mb-6">Edit Book</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Title" className="input-field" required />
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="input-field" required />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (₹)" className="input-field" required />
            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="bg-gray-700 text-white font-medium py-3 px-6 rounded-md hover:bg-gray-600 w-full">
                Cancel
              </button>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}