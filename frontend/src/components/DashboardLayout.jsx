import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Sidebar = ({ role, tenant }) => {
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  
  // Check if the current user is an admin
  const isAdmin = role === 'admin';

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout'); 
    } catch (error) {
      console.error('Logout failed on backend, clearing client session.');
    }
    setAuthInfo(null);
    navigate('/');
  };

  const uploadedLogoUrl = (tenant.theme.logoUrl && tenant.theme.logoUrl.startsWith('/uploads'))
    ? `http://localhost:5001${tenant.theme.logoUrl}` 
    : null; 
  const logoSrc = uploadedLogoUrl || '/assets/default-logo.svg';

  return (
    // --- 1. SIDEBAR IS NOW LIGHT AND CRISP ---
    <nav className="min-w-[16rem] w-64 h-screen p-6 flex flex-col border-r border-border-color bg-white text-text-primary">
      
      {/* Logo and Store Name */}
      <div className="flex items-center gap-3 mb-8">
        <img 
          src={logoSrc} 
          alt="Store Logo" 
          className="w-10 h-10 rounded-md bg-gray-200 object-cover" // Adjusted background color
        />
        <h1 className="text-xl font-bold text-gray-900">
          {tenant.storeName}
        </h1>
      </div>

      <div className="flex-grow space-y-2">
        {/* --- Admin Links --- */}
        {role === 'admin' && (
          <>
            <NavItem isAdmin={isAdmin} to="/dashboard" name="Dashboard" />
            <NavItem isAdmin={isAdmin} to="/dashboard/products" name="My Books" />
            <NavItem isAdmin={isAdmin} to="/dashboard/orders" name="Orders" />
            <NavItem isAdmin={isAdmin} to="/dashboard/settings" name="Store Settings" />
          </>
        )}
        {/* --- Customer Links --- */}
        {role === 'customer' && (
          <>
            <NavItem isAdmin={isAdmin} to="/dashboard" name="My Account" />
            <NavItem isAdmin={isAdmin} to="/dashboard/my-orders" name="My Orders" />
            <NavItem isAdmin={isAdmin} to="/dashboard/wishlist" name="Wishlist" />
          </>
        )}

        {/* --- Shared Links --- */}
        <div className="border-t border-border-color my-4 pt-2"></div>
        <NavItem isAdmin={isAdmin} to="/dashboard/account" name="Account Settings" />
        
      </div>
      
      {/* Logout Button */}
      <button onClick={handleLogout} className="text-text-secondary hover:text-red-500 font-medium text-sm py-2 px-4 rounded-md transition-colors">
        Log Out
      </button>
    </nav>
  );
};

// --- Updated NavItem Component for Theme Awareness ---
const NavItem = ({ to, name, isAdmin }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `block px-4 py-2 rounded-lg font-medium transition-colors 
        ${isActive 
          ? 'bg-primary text-white shadow-md' 
        // 2. FIX: Inactive style for ALL dashboards is now light theme subtle hover
          : 'text-text-secondary hover:bg-gray-100 hover:text-gray-900'
      }`
    }
  >
    {name}
  </NavLink>
);

// This Layout wraps your dashboard pages
export default function DashboardLayout({ children }) {
  const { authInfo } = useAuth();

  if (!authInfo) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role={authInfo.user.role} tenant={authInfo.tenant} />
      {/* 3. FIX: Main content is light, ensuring consistency */}
      <main className="flex-grow bg-gray-50 text-gray-900">
        {children}
      </main>
    </div>
  );
}