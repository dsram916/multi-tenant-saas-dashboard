import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import { motion } from 'framer-motion';

// --- Reusable card wrapper for clean UI ---
const SettingsCard = ({ title, description, children }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
    <h3 className="text-xl font-bold mb-1 text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mb-6">{description}</p>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function StoreSettingsPage() {
  const { authInfo, setAuthInfo } = useAuth();
  const { tenant } = authInfo;

  const [storeName, setStoreName] = useState(tenant.storeName);
  const [primaryColor, setPrimaryColor] = useState(tenant.theme.primaryColor);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [enable3dModel, setEnable3dModel] = useState(
    tenant.settings ? tenant.settings.enable3dModel : true
  );

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    let newLogoUrl = tenant.theme.logoUrl;

    // 1. Upload Logo
    if (logo) {
      const formData = new FormData();
      formData.append('image', logo);
      try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data } = await axios.post('/api/upload', formData, config);
        newLogoUrl = data.imageUrl;
      } catch (err) {
        console.error('Logo upload failed', err);
        setMessage('Logo upload failed. Please try again.');
        setLoading(false);
        return;
      }
    }

    // 2. Save ALL settings
    try {
      const res = await axios.put('/api/tenants/settings', {
        storeName,
        primaryColor,
        logoUrl: newLogoUrl,
        settings: {
          enable3dModel: enable3dModel,
        },
      });

      document.documentElement.style.setProperty('--color-primary', primaryColor);
      setAuthInfo((prevInfo) => ({ ...prevInfo, tenant: res.data }));
      setMessage('Settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Store Settings</h1>
      
      <form onSubmit={handleSave} className="max-w-4xl space-y-6">

        {/* --- 1. GENERAL INFO CARD --- */}
        <SettingsCard 
          title="General Store Information" 
          description="Update your public store name and logo."
        >
          {/* Store Name */}
          <div className="flex items-center space-x-4">
            <label className="min-w-[100px] text-gray-700">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Logo Upload */}
          <div className="flex items-center space-x-4">
            <label className="min-w-[100px] text-gray-700 self-start pt-2">Logo (400x400)</label>
            <div className="flex-grow flex items-center gap-4">
              <img 
                src={tenant.theme.logoUrl.startsWith('/uploads') ? `http://localhost:5001${tenant.theme.logoUrl}` : '/assets/default-logo.svg'}
                alt="Current Logo" 
                className="w-16 h-16 rounded-full border border-gray-300 object-cover"
              />
              <input 
                type="file" 
                onChange={(e) => setLogo(e.target.files[0])} 
                className="flex-grow p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900"
              />
            </div>
          </div>
        </SettingsCard>

        {/* --- 2. THEME & FEATURE CARD --- */}
        <SettingsCard 
          title="Branding and Features" 
          description="Control your store's theme and optional modules."
        >
          {/* Theme Color */}
          <div className="flex items-center space-x-4">
            <label className="min-w-[100px] text-gray-700">Primary Color</label>
            <div className="flex items-center gap-4 flex-grow">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 p-0 border-none cursor-pointer rounded-md overflow-hidden"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              />
            </div>
          </div>

          {/* Feature Toggle */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label htmlFor="3d-model-toggle" className="font-medium text-gray-900">
                Enable 3D Book Model
              </label>
              <p className="text-xs text-gray-500">
                Show the spinning 3D book on your admin dashboard.
              </p>
            </div>
            <input
              id="3d-model-toggle"
              type="checkbox"
              checked={enable3dModel}
              onChange={(e) => setEnable3dModel(e.target.checked)}
              className="h-6 w-10 appearance-none rounded-full bg-gray-300 checked:bg-primary transition duration-200 ease-in-out cursor-pointer shadow-sm"
              style={{ padding: '0', margin: '0' }}
            />
          </div>
        </SettingsCard>
        
        {/* --- 3. SAVE BUTTON & MESSAGE --- */}
        <motion.div 
          className="flex justify-end items-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {message && <p className="text-sm text-green-500 mr-4 font-medium">{message}</p>}
          <button type="submit" className="btn-primary py-3 px-8" disabled={loading}>
            {loading ? 'Saving...' : 'Save All Settings'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}