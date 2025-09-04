import React from 'react';

interface Role {
  id: string;
  name: string;
  icon: React.ComponentType<Record<string, unknown>>;
}

interface RoleCardProps {
  role: Role;
  isSelected: boolean;
  onSelect: (roleId: string) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, isSelected, onSelect }) => {
  const IconComponent = role.icon;

  return (
    <div
      onClick={() => onSelect(role.id)}
      className={`
        relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl border-2 cursor-pointer 
        transition-all duration-200 flex flex-col items-center justify-center gap-2 sm:gap-3 
      hover:scale-105 flex-shrink-0 shadow-xl
        ${
          isSelected
            ? 'border-[#66B848] bg-white shadow-lg'
            : 'border-[#000000] bg-white hover:border-black-300 hover:shadow-md'
        }
      `}
    >
      <div
        className={`
        p-2 sm:p-2.5 lg:p-3 rounded-xl transition-colors duration-200
        ${
          isSelected
            ? 'bg-green-50 text-[#66B848]'
            : 'bg-black-100 text-gray-400'
        }
      `}
      >
        <IconComponent
          size={24}
          className={`
            sm:w-7 sm:h-7 lg:w-8 lg:h-8 
            ${isSelected ? 'stroke-[#66B848]' : 'stroke-black'}
          `}
        />
      </div>

      <span
        className={`
        text-xs sm:text-sm font-medium transition-colors duration-200 text-center px-1
        ${isSelected ? 'text-[#66B848]' : 'text-black'}
      `}
      >
        {role.name}
      </span>
    </div>
  );
};

export default RoleCard;
export type { Role, RoleCardProps };
