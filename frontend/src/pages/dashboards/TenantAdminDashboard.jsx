import React, { useEffect, useState } from 'react';
import Book3D from '../../components/Book3D';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- NEW: Custom KPI Card Component for LIGHT THEME ---
const KpiCard = ({ title, value, icon, link }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg text-gray-900 cursor-pointer hover:shadow-xl transition-shadow"
  >
    <Link to={link}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {/* Icon coloring is handled by the component's SVG text-primary class */}
        {icon} 
      </div>
      <p className="text-4xl font-extrabold mt-3">{value}</p>
    </Link>
  </motion.div>
);

export default function TenantAdminDashboard({ user, tenant }) {
  const [stats, setStats] = useState({
    sales: '₹8,450',
    orders: 124,
    products: 17,
  });

  useEffect(() => {
    // Runtime Theming: This remains essential for the custom color
    if (tenant && tenant.theme) {
      document.documentElement.style.setProperty('--color-primary', tenant.theme.primaryColor);
    }
  }, [tenant]);

  const show3dModel = tenant.settings ? tenant.settings.enable3dModel : true;

  return (
    // We override the background here to be a light color for contrast
    <div className="p-10 bg-gray-50 min-h-screen"> 
      
      {/* Welcome Header */}
      <div className="mb-10 flex items-center justify-between border-b border-gray-300 pb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Hello, {user.name.split(' ')[0]}
        </h1>
        <p className="text-lg text-primary font-semibold">{tenant.storeName}</p>
      </div>

      {/* --- 1. KPI SECTION (Light Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KpiCard title="Total Revenue" value={stats.sales} link="/dashboard/orders" icon={<RevenueIcon />} />
        <KpiCard title="Total Orders" value={stats.orders} link="/dashboard/orders" icon={<OrdersIcon />} />
        <KpiCard title="Active Products" value={stats.products} link="/dashboard/products" icon={<ProductsIcon />} />
      </div>

      {/* --- 2. 3D Model / Quick Access Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side (3D Model / Co-pilot) */}
        {show3dModel && (
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="p-6">
               <h2 className="text-xl font-semibold mb-4 text-gray-900">Featured Product Showcase</h2>
            </div>
            <div className="h-64 bg-gray-100 flex items-center justify-center">
                <Book3D /> {/* Your spinning model is here */}
            </div>
          </div>
        )}

        {/* Right Side (Quick Access) */}
        <div className={show3dModel ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Access & Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickButton title="View Inventory" subtitle="Manage all your books" link="/dashboard/products" icon={<ProductsIcon />} />
              <QuickButton title="Update Branding" subtitle="Change colors & logo" link="/dashboard/settings" icon={<SettingsIcon />} />
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
               <p className="text-gray-500 text-sm">Last login: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Helper Components (Updated to be light theme compliant) ---
const QuickButton = ({ title, subtitle, link, icon }) => (
    <Link to={link}>
        {/* FIX: Bg-gray-50 and border-gray-300 for clean light look */}
        <motion.div whileHover={{ scale: 1.01 }} className="flex items-center p-4 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            {/* FIX: bg-primary/20 and text-primary ensures custom color is used */}
            <div className="p-2 bg-primary/20 rounded-full mr-4 text-primary">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </motion.div>
    </Link>
);

// --- Icons (No Change, they correctly use text-primary) ---

const RevenueIcon = () => (
    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.03 60.03 0 0113.013-1.637l2.84 2.844.736-2.585a2.25 2.25 0 00-1.04-2.583L14 13.5m-5.454 4.226l-1.39-1.39M3 6.75h1.5a.75.75 0 01.75.75v3.75m-3.75-4.5h3.75m-3.75 0V3.75m4.5 4.5V3.75" />
    </svg>
);

const OrdersIcon = () => (
    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l-1.263 12c-.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const ProductsIcon = () => (
    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75V3m0 0l-3-3m3 3l3-3m-3 3h-.75M21.75 12h-3.75m3.75 0L24 15m-2.25-3l-3 3m-2.25 0H3m3.75 0l-3 3m2.25-3l-3 3M12 21.75V15" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5h15m-15 4.5h15m-15 4.5h15M6.75 4.5h10.5M6.75 19.5h10.5" />
    </svg>
);


