import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';

export default function EmailCaptureWidget() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email) {
      setError('Please enter a valid email.');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post('/api/auth/check-email', { email });
      if (res.data.exists) {
        navigate('/login', { state: { email } });
      } else {
        navigate('/register', { state: { email } });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className="fixed bottom-4 left-0 right-0 z-50 p-4" // Changed bottom-0 to bottom-4
    >
      <div className="container max-w-4xl mx-auto">
        <form
          onSubmit={handleContinue}
          className="bg-bg-card/80 backdrop-blur-md border border-border-color rounded-lg p-5 shadow-2xl flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="flex-grow">
            <h3 className="font-semibold text-lg text-text-primary">
              Start your premium bookstore.
            </h3>
            <p className="small text-text-secondary">
              Enter your email to create an account or log in.
            </p>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            className="input-field w-full md:w-auto flex-grow-[2]"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
        {error && (
          <p className="small text-red-400 mt-2 text-center">{error}</p>
        )}
      </div>
    </motion.div>
  );
}