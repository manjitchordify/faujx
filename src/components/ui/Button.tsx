// components/ui/Button.tsx
import React, { CSSProperties, ReactNode } from 'react';

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
  showBadge?: boolean;
  badgeCount?: number;
  textColor?: string;
  icon?: ReactNode | null;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  isLoading = false,
  style,
  className = '',
  showBadge = false,
  badgeCount = 0,
  textColor = 'text-white',
  icon = null,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${textColor} font-medium flex items-center justify-center 
        px-4 transition-colors duration-200
        disabled:opacity-60 disabled:cursor-not-allowed relative
        ${className}
      `}
      style={style}
    >
      {isLoading ? (
        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
      ) : (
        <div className="w-full flex flex-row justify-evenly items-center">
          <p>{text}</p>
          {icon && icon}
        </div>
      )}
      {/* BADEG */}
      {showBadge && badgeCount > 0 && (
        <p className="absolute -top-2 -right-2 w-5 h-5 p-1 bg-[#54A044] flex justify-center items-center text-white rounded-full">
          {badgeCount}
        </p>
      )}
    </button>
  );
};

export default Button;
