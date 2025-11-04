import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';

export default function StorefrontPage() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStorefront = async () => {
      try {
        const res = await axios.get(`/api/public/store/${slug}`);
        setStore(res.data);
        
        // Apply this store's theme color
        if (res.data.tenant && res.data.tenant.theme) {
          document.documentElement.style.setProperty(
            '--color-primary',
            res.data.tenant.theme.primaryColor
          );
        }
      } catch (err) {
        setError('Store not found');
      } finally {
        setLoading(false);
      }
    };
    fetchStorefront();
  }, [slug]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">{error}</h1>
        <Link to="/" className="text-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  const { tenant, books } = store;

  // --- THIS IS THE "SUPER COOL" DYNAMIC HERO ---
  const heroStyle = {
    // We create a subtle gradient using the tenant's theme color
    backgroundImage: `linear-gradient(120deg, ${tenant.theme.primaryColor} 0%, ${tenant.theme.primaryColor}33 100%)`,
  };

  return (
    <div className="bg-bg-main">
      {/* --- 1. New "Cool" Hero Section --- */}
      <motion.div 
        className="h-[40vh] min-h-[300px] flex flex-col justify-center items-center text-white p-8" 
        style={heroStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {tenant.storeName}
        </motion.h1>
        <motion.p 
          className="text-xl text-white/80"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Welcome to our official bookstore.
        </motion.p>
      </motion.div>
      
      {/* --- 2. The Book Grid --- */}
      <div className="container mx-auto px-6 py-16">
        {books.length === 0 ? (
          <p className="text-center text-text-secondary text-xl">
            This store hasn't added any books yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}