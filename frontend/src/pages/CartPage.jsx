import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Cart Item Component (Minimalist Redesign) ---
const CartItem = ({ item }) => {
  const { removeFromCart, addToCart } = useCart();

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-border-color shadow-sm">
      
      {/* Image and Details */}
      <div className="flex items-start flex-grow pr-4">
        <img 
          src={`http://localhost:5001${item.coverImageUrl}`} 
          alt={item.title}
          className="w-16 h-24 object-contain rounded-md border border-gray-100 mr-4"
        />
        <div className="flex flex-col pt-1">
          <h2 className="text-lg font-semibold text-text-primary">{item.title}</h2>
          <p className="text-sm text-text-secondary">by {item.author}</p>
        </div>
      </div>

      {/* Quantity, Price, and Actions */}
      <div className="flex items-center space-x-6">
        
        {/* Price */}
        <p className="text-lg font-bold text-text-primary min-w-[5rem] text-right">
          ₹{(item.price * item.qty).toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center border border-border-color rounded-md">
            <button 
                onClick={() => {
                  if (item.qty > 1) {
                    // Manually reducing quantity, assuming you have a decrement function
                    // Since we don't have a decrement, we'll just use the remove logic for the first item
                    // If you added a decrement in CartContext, you'd call it here
                  }
                  removeFromCart(item._id); 
                }} 
                className="w-8 h-8 text-lg font-semibold text-text-secondary hover:bg-bg-card transition-colors"
                title="Remove one"
            >
                -
            </button>
            <span className="w-8 text-center text-text-primary">{item.qty}</span>
            <button 
                onClick={() => addToCart(item)} 
                className="w-8 h-8 text-lg font-semibold text-text-secondary hover:bg-bg-card transition-colors"
                title="Add one more"
            >
                +
            </button>
        </div>

        {/* Remove Button */}
        <button 
          onClick={() => removeFromCart(item._id)} 
          className="text-red-500 hover:text-red-600 transition-colors"
          title="Remove item"
        >
          {/* Trash Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9.011L13.193 18.23a1.5 1.5 0 01-1.492 1.25H12a1.5 1.5 0 01-1.492-1.25L9.26 9.011m6.98 0l-1.492-9.219a1.5 1.5 0 00-1.492-1.25H9.26a1.5 1.5 0 00-1.492 1.25L6.02 9.011m6.98 0H14m1.48 0H13.193M9.26 9.011H7.8M6.02 9.011H4.5M3 13.5V12M21 12v1.5M4.5 12h15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function CartPage() {
  const { cartItems } = useCart();

  // Calculate totals
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalSubtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = totalSubtotal * 0.05; // 5% tax
  const finalPrice = totalSubtotal + tax;

  return (
    // Apply the light theme background
    <div className="bg-bg-card min-h-[calc(100vh-80px)] py-12">
      <div className="container mx-auto p-4">
        
        <h1 className="text-4xl font-extrabold mb-10 text-text-primary">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white p-16 rounded-xl border border-border-color shadow-lg"
          >
            <h2 className="text-2xl text-text-primary mb-4">Your cart is empty.</h2>
            <Link to="/explore" className="btn-primary">
              Discover Books
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>

            {/* Order Summary (1/3 width) - Sticky and Cool */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white p-6 rounded-xl border border-border-color shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-text-primary">Order Summary</h2>
                
                {/* Breakdown */}
                <div className="space-y-3 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items):</span>
                    {/* FIX 1: Corrected syntax here */}
                    <span className="font-medium text-text-primary">₹{totalSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span className="font-medium text-text-primary">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border-color my-4"></div>

                {/* Final Total */}
                <div className="flex justify-between text-xl font-extrabold mb-6">
                  <span className="text-text-primary">Order Total:</span>
                  <span className="text-primary">₹{finalPrice.toFixed(2)}</span>
                </div>
                
                <button className="btn-primary w-full py-3">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}