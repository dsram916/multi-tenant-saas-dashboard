import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// This is a "cool" placeholder for an empty orders table
const EmptyState = ({ title, description, ctaText, ctaLink }) => (
  <div className="text-center bg-bg-card p-12 rounded-lg border border-border-color">
    <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary mb-6">{description}</p>
    <Link to={ctaLink} className="btn-primary">
      {ctaText}
    </Link>
  </div>
);

export default function CustomerDashboard({ user, tenant }) {
  
  // This still applies the tenant's *custom color* (purple, green, etc.)
  useEffect(() => {
    if (tenant && tenant.theme) {
      document.documentElement.style.setProperty('--color-primary', tenant.theme.primaryColor);
    }
  }, [tenant]);

  // --- FIX: The link is now set to the general Explore route ---
  const exploreLink = "/explore";
  
  return (
    <div className="p-8">
      {/* --- 1. "COOLER" WELCOME BANNER --- */}
      <div className="bg-bg-card border border-border-color rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2 text-text-primary">Welcome, {user.name}!</h1>
        <p className="text-lg text-text-secondary">
          This is your private account page. You can manage your orders and account details here.
        </p>
      </div>
      
      {/* --- 3. "My Orders" Section --- */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">My Recent Orders</h2>
        <EmptyState 
          title="You have no recent orders"
          description="When you buy a book, your order details will appear here."
          ctaText="Start Shopping"
          ctaLink={exploreLink} // <-- FIXED LINK
        />
      </div>

      {/* --- 4. "Wishlist" Section --- */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">My Wishlist</h2>
        <EmptyState 
          title="Your wishlist is empty"
          description="Find books you want to save for later."
          ctaText="Browse the Store"
          ctaLink={exploreLink} // <-- FIXED LINK
        />
      </div>
    </div>
  );
};

// ... (Icons are the same) ...