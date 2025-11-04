import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import { motion } from 'framer-motion';

// --- Reusable card wrapper for clean UI (must be redefined or imported) ---
const SettingsCard = ({ title, description, children }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
    <h3 className="text-xl font-bold mb-1 text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mb-6">{description}</p>
    <div className="space-y-4">{children}</div>
  </div>
);

// --- The "Cool" Input used throughout the app ---
const CoolInput = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      {...props}
      // Styling updated for the light dashboard environment
      className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);

export default function AccountSettingsPage() {
  const { authInfo, setAuthInfo } = useAuth();
  const { user } = authInfo;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await axios.put('/api/auth/profile', { name, email });
      setAuthInfo(data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    if (password !== confirmPassword) {
      setPasswordMessage('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      setPasswordMessage('Password must be at least 6 characters.');
      return;
    }
    
    try {
      const { data } = await axios.put('/api/auth/profile', { password });
      setAuthInfo(data);
      setPasswordMessage('Password changed successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage('Failed to change password. Try logging in again.');
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Account Settings</h1>
      
      {/* --- Profile Details Card --- */}
      <form onSubmit={handleProfileUpdate}>
        <SettingsCard 
          title="Profile Details" 
          description="Update your name and primary contact email."
        >
          <CoolInput icon={<UserIcon />} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <CoolInput icon={<MailIcon />} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <div className="flex justify-end items-center gap-4 pt-2">
            {message && <p className="text-sm text-green-500 font-medium">{message}</p>}
            <button type="submit" className="btn-primary py-3 px-8">
              Save Changes
            </button>
          </div>
        </SettingsCard>
      </form>

      {/* --- Change Password Card --- */}
      <form onSubmit={handlePasswordUpdate}>
        <SettingsCard 
          title="Change Password" 
          description="Use this section to set a new password."
        >
          <CoolInput icon={<LockIcon />} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" required />
          <CoolInput icon={<LockIcon />} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required />

          <div className="flex justify-end items-center gap-4 pt-2">
            {passwordMessage && <p className={`text-sm ${passwordMessage.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{passwordMessage}</p>}
            <button type="submit" className="btn-primary py-3 px-8">
              Update Password
            </button>
          </div>
        </SettingsCard>
      </form>
    </div>
  );
}

// --- Embedded Icons (Must be kept in the file) ---
const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const MailIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);