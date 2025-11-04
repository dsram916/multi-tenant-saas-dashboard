import React, { useState, useContext, Suspense } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Auth3DScene from '../components/Auth3DScene';

// --- This is the new, custom-styled "special" input box ---
const CoolInput = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      {...props}
      className="w-full py-3 pl-12 pr-4 bg-bg-card border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);

// --- This is the new, "cool" option box for Buy/Sell ---
const CoolRoleOption = ({ title, description, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    onClick={onClick}
    className="p-6 bg-bg-card rounded-lg border border-border-color cursor-pointer hover:border-primary"
  >
    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
    <p className="text-sm text-text-secondary">{description}</p>
  </motion.div>
);

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthInfo } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.email || '',
    password: '',
    role: '',
    storeName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      setAuthInfo(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleCustomerSubmit = async () => {
    try {
      const res = await axios.post('/api/auth/register', { ...formData, role: 'customer' });
      setAuthInfo(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="auth-layout">
      
      {/* 1. THE BRANDING SIDE (Dark) */}
      <div className="auth-brand-side">
        <Suspense fallback={null}>
          <Auth3DScene />
        </Suspense>

        <h1 className="text-3xl font-bold">bookstore-saas</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-4xl font-semibold leading-snug">
            "A book is a dream that you hold in your hand."
          </p>
          <p className="text-lg text-gray-400 mt-4">- Neil Gaiman</p>
        </motion.div>
        <p className="text-gray-500">© 2025 Bookstore SaaS. All rights reserved.</p>
      </div>

      {/* 2. THE FORM SIDE (Light) */}
      <div className="auth-form-side">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-bg-main border border-border-color p-8 rounded-xl shadow-lg w-full max-w-md overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                onSubmit={(e) => { e.preventDefault(); setStep(2); }}
                className="space-y-5"
              >
                <h2 className="text-3xl font-bold text-center text-text-primary mb-2">Create your account</h2>
                <p className="text-text-secondary text-center mb-8">Let's get you started.</p>
                
                <CoolInput icon={<UserIcon />} type="text" name="name" onChange={handleChange} placeholder="Your Name" required />
                <CoolInput icon={<MailIcon />} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <CoolInput icon={<LockIcon />} type="password" name="password" onChange={handleChange} placeholder="Password" required />
                
                <button type="submit" className="btn-primary w-full py-3">Next</button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-center text-text-primary mb-6">What's your goal?</h2>
                <div className="space-y-4">
                  <CoolRoleOption
                    title="I want to sell books"
                    description="Create a store, manage inventory, and sell."
                    onClick={() => { setFormData({ ...formData, role: 'admin' }); setStep(3); }}
                  />
                  <CoolRoleOption
                    title="I want to buy books"
                    description="Browse stores and manage your orders."
                    onClick={handleCustomerSubmit}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                onSubmit={handleAdminSubmit}
                className="space-y-5"
              >
                <h2 className="text-3xl font-bold text-center text-text-primary mb-2">Name your store</h2>
                <p className="text-text-secondary text-center mb-8">This will be your public storefront name.</p>
                
                <CoolInput icon={<StoreIcon />} type="text" name="storeName" onChange={handleChange} placeholder="e.g., 'The Cozy Corner'" required />
                
                <button type="submit" className="btn-primary w-full py-3">Complete Setup</button>
              </motion.form>
            )}
          </AnimatePresence>
          
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          
          <p className="text-sm text-text-secondary text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" state={{ email: formData.email }} className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// --- ALL ICONS ARE EMBEDDED HERE ---
const UserIcon = () => (
  <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const MailIcon = () => (
  <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
const StoreIcon = () => (
  <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5V21M6.75 21v-7.5A2.25 2.25 0 019 11.25h1.5A2.25 2.25 0 0112.75 13.5V21m-4.5 0h6m-6 0H6.75m0 0H6.75m-3 0h3m1.5-7.5h.008v.008H9.75V13.5zm.008 0H9.75m-1.5 0h.008m1.5 0h.008v.008H12.75V13.5zm.008 0H12.75m-1.5 0h.008m1.5 0h.008v.008H15.75V13.5zm.008 0H15.75m-1.5 0h.008m4.5 0h.008v.008H18.75V13.5zm.008 0H18.75m-1.5 0h.008m1.5 0h.008v.008H21.75V13.5zm.008 0H21.75m-1.5 0h.008M6.75 13.5H4.5m2.25 0h.008v.008H6.75V13.5zm.008 0H6.75" />
  </svg>
);