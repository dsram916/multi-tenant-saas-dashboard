import React from 'react';

export default function SocialButton({ icon, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border-color rounded-md bg-bg-main hover:bg-bg-card transition-colors"
    >
      {icon}
      <span className="font-semibold text-text-primary">{text}</span>
    </button>
  );
}