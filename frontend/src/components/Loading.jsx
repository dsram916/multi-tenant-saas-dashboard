import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
        <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-4 border-t-4 border-primary border-t-transparent rounded-full"
        >
        </motion.div>
        <p className="mt-4 text-lg font-medium text-gray-600">Loading Dashboard...</p>
    </div>
  );
}