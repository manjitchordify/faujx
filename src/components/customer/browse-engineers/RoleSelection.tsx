'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null);
  const router = useRouter();

  const roles: Role[] = [
    {
      id: 'front-end',
      name: 'Front-end',
      icon: (
        <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
          {/* React-style atomic icon */}
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <ellipse
            cx="20"
            cy="20"
            rx="12"
            ry="5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <ellipse
            cx="20"
            cy="20"
            rx="12"
            ry="5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            transform="rotate(60 20 20)"
          />
          <ellipse
            cx="20"
            cy="20"
            rx="12"
            ry="5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            transform="rotate(120 20 20)"
          />
        </svg>
      ),
    },
    {
      id: 'back-end',
      name: 'Back-end',
      icon: (
        <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
          {/* Node.js style hexagon */}
          <path
            d="M20 4L30 9V23L20 28L10 23V9L20 4Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <text
            x="20"
            y="22"
            textAnchor="middle"
            className="text-sm font-bold"
            fill="currentColor"
          >
            JS
          </text>
        </svg>
      ),
    },
    {
      id: 'devops',
      name: 'Devops',
      icon: (
        <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
          {/* Simple gear icon */}
          <path
            d="M20 12C16.7 12 14 14.7 14 18V22C14 25.3 16.7 28 20 28C23.3 28 26 25.3 26 22V18C26 14.7 23.3 12 20 12Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path d="M18 8H22V12H18V8Z" fill="currentColor" />
          <path d="M18 28H22V32H18V28Z" fill="currentColor" />
          <path d="M8 18H12V22H8V18Z" fill="currentColor" />
          <path d="M28 18H32V22H28V18Z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'ai-ml',
      name: 'AI/ML',
      icon: (
        <div className="flex items-center justify-center w-12 h-12">
          <span className="text-base font-bold">AI/ML</span>
        </div>
      ),
    },
    {
      id: 'full-stack',
      name: 'Full-Stack',
      icon: (
        <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
          {/* Gear icon for Full-Stack */}
          <circle
            cx="20"
            cy="20"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M20 2V6M20 34V38M38 20H34M6 20H2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M32.5 7.5L29.8 10.2M10.2 29.8L7.5 32.5M32.5 32.5L29.8 29.8M10.2 10.2L7.5 7.5"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  const handleRoleSelect = (roleId: string, roleName: string): void => {
    setSelectedRole(roleId);
    setSelectedRoleName(roleName);
  };

  const handleNext = (): void => {
    if (selectedRoleName) {
      console.log('Selected role:', selectedRoleName);
      // Navigate to dashboard
      router.push(
        `/customer/browse-engineers/dashboard?role=${selectedRoleName}`
      );
    }
  };

  return (
    <div className=" flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16">
        {/* Title */}
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12 sm:mb-16 max-w-4xl">
          What role are you looking to hire for?
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 max-w-6xl w-full">
          {roles.map((role: Role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id, role.name)}
              className={`group relative p-6 sm:p-8 rounded-2xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                selectedRole === role.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Icon */}
              <div
                className={`flex justify-center mb-4 sm:mb-6 ${
                  selectedRole === role.id ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {role.icon}
              </div>

              {/* Role Name */}
              <h3
                className={`text-base sm:text-lg font-semibold text-center ${
                  selectedRole === role.id ? 'text-green-700' : 'text-gray-700'
                }`}
              >
                {role.name}
              </h3>

              {/* Selection indicator */}
              {selectedRole === role.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!selectedRole}
          className={`group flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            selectedRole
              ? 'text-white hover:scale-105 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={selectedRole ? { backgroundColor: '#1F514C' } : {}}
          onMouseEnter={e => {
            if (selectedRole) {
              e.currentTarget.style.backgroundColor = '#184339';
            }
          }}
          onMouseLeave={e => {
            if (selectedRole) {
              e.currentTarget.style.backgroundColor = '#1F514C';
            }
          }}
        >
          Next
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${
              selectedRole ? 'group-hover:translate-x-1' : ''
            }`}
          />
        </button>

        {/* Helper text */}
        <p className="text-sm text-gray-500 mt-6 text-center max-w-md">
          Select the role you are looking to hire for. You can change this
          later.
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
