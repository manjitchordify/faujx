import React from 'react';

interface ButtonProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
}

function Button({ text, icon, className = '' }: ButtonProps) {
  return (
    <button
      className={`px-8 py-4 bg-[#1F514C] text-white font-medium rounded-full shadow-lg hover:bg-[#1a433f] transition-colors flex items-center justify-center ${className}`}
    >
      {text}
      {icon && <span className="inline-block ml-2">{icon}</span>}
    </button>
  );
}

export default Button;
