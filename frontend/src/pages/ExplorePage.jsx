import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Loading from '../components/Loading'; // <-- THIS IS THE FIX
import { motion } from 'framer-motion';

// --- Icon Helpers ---
const BookIcon = () => (
    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75l-7.5-3.5L4.5 3.5l7.5 3.5 7.5-3.5 0 14.75-7.5 3.5zM12 7.5L4.5 3.5M12 7.5L19.5 3.5M12 7.5V21.75" />
    </svg>
);

// --- UPDATED Store Card for Cooler UI ---
const StoreCard = ({ tenant }) => {
  
  // FIX: Robust logo source logic (removed the blinking onError handler)
  const uploadedLogoUrl = (tenant.theme.logoUrl && tenant.theme.logoUrl.startsWith('/uploads'))
    ? `http://localhost:5001${tenant.theme.logoUrl}` 
    : null;
  const logoSrc = uploadedLogoUrl || '/assets/default-logo.svg';

  return (
    <motion.div
      // Enhanced interaction for a 'cool' feel
      whileHover={{ y: -6, scale: 1.02, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={`/t/${tenant.slug}`} className="block h-full transition-shadow duration-300">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md h-full flex flex-col">
          
          {/* Top Section: Logo Showcase (High Contrast) */}
          <div className="h-48 bg-gray-50 flex flex-col items-center justify-center p-6 border-b border-gray-100">
            <img 
              src={logoSrc} 
              alt={`${tenant.storeName} logo`}
              className="h-20 w-20 object-contain rounded-full border-4 border-white shadow-lg"
            />
          </div>
          
          {/* Bottom Section: Name and CTA */}
          <div className="p-6 flex-grow flex flex-col justify-between">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
              {tenant.storeName}
            </h3>
            
            <div className="flex items-center text-primary font-semibold mt-4">
              <BookIcon />
              View Bookstore &rarr;
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function ExplorePage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await axios.get('/api/public/stores');
        setStores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) return <Loading />;

  return (
    // Updated background for a clean, professional feel
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen"> 
      <h1 className="text-6xl font-extrabold mb-4 text-center text-gray-900">
        <span className="text-primary">Discover</span> Marketplaces
      </h1>
      <p className="text-xl text-center text-gray-500 mb-16">
        Explore unique collections from all our independent sellers.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {stores.map((tenant) => (
          <StoreCard key={tenant._id} tenant={tenant} />
        ))}
      </div>
    </div>
  );
}