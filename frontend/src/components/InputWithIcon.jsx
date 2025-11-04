import React from 'react';

export default function InputWithIcon({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        {...props}
        className="input-field pl-10" // Add padding to make space for the icon
      />
    </div>
  );
}