import React from 'react';

export default function Footer() {

  const handleSubscribe = (e) => {
    e.preventDefault();
    // In a real app, you'd post to an API
    alert('Thank you for subscribing! (Demo)');
    e.target.reset();
  };

  return (
    <footer className="bg-bg-card border-t border-border-color">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Bookstore</h2>
            <p className="text-text-secondary">
              Your premium multi-tenant bookstore platform.
            </p>
          </div>
          
          {/* Newsletter Column */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Subscribe to our newsletter</h3>
            <p className="text-text-secondary mb-4">
              Get the latest on new book releases, seller tips, and platform updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-grow"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border-color mt-12 pt-8 text-center text-text-secondary">
          <p>© 2025 Bookstore SaaS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}