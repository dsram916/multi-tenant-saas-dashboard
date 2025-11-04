import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 

// --- Layout Wrappers ---
import PublicLayout from './components/PublicLayout';
import Dashboard from './pages/Dashboard';

// --- Public Pages ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StorefrontPage from './pages/StorefrontPage';
import CartPage from './pages/CartPage';
import ExplorePage from './pages/ExplorePage';

// --- Dashboard (Private) Pages ---
import TenantAdminDashboard from './pages/dashboards/TenantAdminDashboard';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import StoreSettingsPage from './pages/dashboards/StoreSettingsPage';
import MyBooksPage from './pages/dashboards/MyBooksPage';
import AccountSettingsPage from './pages/dashboards/AccountSettingsPage'; 

// Placeholders
const OrdersPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Orders</h1></div>;
const MyOrdersPage = () => <div className="p-8"><h1 className="text-3xl font-bold">My Orders</h1></div>;
const WishlistPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Wishlist</h1></div>;

// Component to render the correct dashboard index
const DashboardIndex = () => {
  const { authInfo } = useAuth();
  if (!authInfo) return null;
  return authInfo.user.role === 'admin' ? 
    <TenantAdminDashboard user={authInfo.user} tenant={authInfo.tenant} /> :
    <CustomerDashboard user={authInfo.user} tenant={authInfo.tenant} />;
};

export default function App() {
  const location = useLocation();
  const { authInfo } = useAuth();

  // --- FINAL THEME SWITCHING LOGIC ---
  useEffect(() => {
    const isCustomerDashboard = authInfo && authInfo.user.role === 'customer' && location.pathname.startsWith('/dashboard');
    const isPublicPage = !location.pathname.startsWith('/dashboard');

    if (isCustomerDashboard || isPublicPage) {
      // 1. Force Light Theme for all public pages AND customer dashboard
      document.body.classList.add('light-theme');
    } else {
      // 2. Force Dark Theme for Admin Dashboard
      document.body.classList.remove('light-theme');
    }
    
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, [location.pathname, authInfo]);

  return (
    <Routes>
      {/* --- 1. Public Routes (with Header/Footer) --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/t/:slug" element={<StorefrontPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* --- 2. Private Dashboard Routes --- */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardIndex />} />
        <Route path="products" element={<MyBooksPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="settings" element={<StoreSettingsPage />} />
        <Route path="my-orders" element={<MyOrdersPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="account" element={<AccountSettingsPage />} />
      </Route>
    </Routes>
  );
}