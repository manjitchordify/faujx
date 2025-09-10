import React from 'react';

interface ButtonProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function Button({ text, icon, className = '', onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 bg-gradient-to-r from-[#2A6B65] to-[#1F514C] text-white font-medium rounded-full shadow-lg hover:from-[#1F514C] hover:to-[#1a433f] transition-all duration-300 flex items-center justify-center ${className}`}
    >
      {text}
      {icon && <span className="inline-block ml-2">{icon}</span>}
    </button>
  );
}

export default Button;
