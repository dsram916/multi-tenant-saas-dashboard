import React, { useState, useContext, Suspense } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Auth3DScene from '../components/Auth3DScene';

// --- (CoolInput and CoolSocialButton components are the same) ---
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
const CoolSocialButton = ({ icon, text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border-color rounded-lg bg-bg-main hover:bg-bg-card transition-colors duration-200"
  >
    {icon}
    <span className="font-semibold text-text-primary text-sm">{text}</span>
  </button>
);


export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthInfo } = useContext(AuthContext);

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDummySocialLogin = (provider) => {
     alert(`This is a dummy login for ${provider}.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setAuthInfo(res.data);
      navigate('/dashboard');
    } catch (err) { // <-- 1. ADDED THE OPENING BRACE {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } // <-- 2. ADDED THE CLOSING BRACE }
    finally {
      setLoading(false);
    }
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
            "A room without books is like a body without a soul."
          </p> {/* <-- 3. FIXED </a.p> to </p> */}
          <p className="text-lg text-gray-400 mt-4">- Marcus Tullius Cicero</p>
        </motion.div>
        <p className="text-gray-500">© 2025 Bookstore SaaS. All rights reserved.</p>
      </div>

      {/* 2. THE FORM SIDE (Light) */}
      <div className="auth-form-side">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-bg-main border border-border-color p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center text-text-primary mb-2">Welcome Back</h2>
          <p className="text-text-secondary text-center mb-8">Please enter your details to log in.</p>

          <div className="space-y-3">
            <CoolSocialButton 
              text="Continue with Google" 
              icon={<GoogleIcon />} 
              onClick={() => handleDummySocialLogin('Google')}
            />
            <CoolSocialButton 
              text="Continue with Apple" 
              icon={<AppleIcon />} 
              onClick={() => handleDummySocialLogin('Apple')}
            />
          </div>
          
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-border-color"></div>
            <span className="px-4 text-text-secondary text-sm">OR</span>
            <div className="flex-grow border-t border-border-color"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <CoolInput
              icon={<MailIcon />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
            <CoolInput
              icon={<LockIcon />}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
          
          <p className="text-sm text-text-secondary text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" state={{ email }} className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// --- ALL ICONS ARE EMBEDDED HERE ---

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
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.574-3.108-11.196-7.46l-6.571 4.819C9.656 40.663 16.318 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.099 36.318 42 31.019 42 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);
const AppleIcon = () => (
  <svg className="w-5 h-5 text-text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.001 20C10.151 20.006 8.526 19.11 7.331 17.658c-1.229-1.496-2.003-3.486-2.003-5.632 0-2.438.93-4.546 2.788-5.748 1.859-1.201 4.091-1.238 5.88-.106l.068.04c.38.24.73.53 1.05.86-.06-.03-.11-.06-.18-.09-1.52-.7-3.33-.9-5.02-.45-.04 0-.07.01-.11.01-2.3.61-3.97 2.65-4.01 5.02-.04 2.37 1.6 4.39 3.88 5.02 1.13.31 2.3.3 3.4-.04 1.1-.33 2.1-.9 2.9-1.68.8-.78 1.4-1.76 1.7-2.88.29-1.12.3-2.33-.02-3.48-.32-1.15-1.04-2.19-2.06-3.03-.2-.17-.4-.33-.6-.49.11-.1.22-.19.33-.29 1.1-1.02 2.4-1.6 3.8-1.72 1.4-.13 2.9.17 4.1.82 1.2.65 2.2 1.63 2.9 2.85.7 1.22 1 2.64.9 4.05-.1 1.41-.6 2.8-1.4 4.05-.8 1.25-1.9 2.3-3.2 3.05-1.3.75-2.8 1.1-4.3 1.04zM12.6 6c.01-1.3.8-2.5 2-3 .1-.12.2-.24.3-.36-.9-.5-1.9-.7-2.9-.6-.9.1-1.9.5-2.6 1.2-.7.7-1.2 1.7-1.3 2.7-.1 1.1.2 2.2.8 3.1.6.9 1.5 1.5 2.5 1.7.9.2 1.9.1 2.8-.4.1-.06.2-.12.3-.18-.5-.6-1-1.3-1.3-2.1-.3-.8-.4-1.7-.2-2.5z" />
  </svg>
);