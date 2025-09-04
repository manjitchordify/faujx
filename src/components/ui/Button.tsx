// components/ui/Button.tsx
import React, { CSSProperties } from 'react';

interface ButtonProps {
  width?: string; // Tailwind width, e.g. "w-40"
  height?: string; // Tailwind height, e.g. "h-12"
  rounded?: string; // Tailwind rounded, e.g. "rounded-full"
  bgColor?: string; // Tailwind background, e.g. "bg-blue-500"
  text: string; // Button label
  onClick?: () => void; // Click handler
  isLoading?: boolean; // Loading state
  style?: CSSProperties; // Custom inline styles
  className?: string; // Extra Tailwind classes
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  isLoading = false,
  style,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        text-white font-medium flex items-center justify-center 
        px-4 transition-colors duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
      style={style}
    >
      {isLoading ? (
        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
