'use client';

import React, { useState } from 'react';
import { Atom, Server, GitBranch, Brain, Code2 } from 'lucide-react';
import RoleCard, { Role } from './RoleCard';
import KnowBetterQuestions from './KnowBetterQustions';
import {
  updateEngineerProfileApi,
  UpdateEngineerProfileParams,
} from '@/services/engineerService';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFromCookie } from '@/utils/apiHeader';
import { setRoleData } from '@/store/slices/engineerProfileSlice';
import { RootState } from '@/store/store';
import { setEnginnerRole } from '@/store/slices/persistSlice';

interface RoleSelectionProps {
  onNext?: (selectedRole: Role) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onNext }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showQuestions, setShowQuestions] = useState<boolean>(false);
  const [selectedRoleData, setSelectedRoleData] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();
  const engineerProfile = useSelector(
    (state: RootState) => state.engineerProfile
  );

  const roles: Role[] = [
    {
      id: 'aiml',
      name: 'AI/ML',
      icon: Brain,
    },
    {
      id: 'backend',
      name: 'Back-end',
      icon: Server,
    },
    {
      id: 'devops',
      name: 'Devops',
      icon: GitBranch,
    },
    {
      id: 'frontend',
      name: 'Front-end',
      icon: Atom,
    },
    {
      id: 'fullstack',
      name: 'Full-Stack',
      icon: Code2,
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    dispatch(setEnginnerRole(roleId));
    const selectedRoleInfo = roles.find(r => r.id === roleId);
    if (selectedRoleInfo) {
      dispatch(
        setRoleData({
          roleId: selectedRoleInfo.id,
          roleTitle: selectedRoleInfo.name,
        })
      );
    }

    setError('');
  };

  const handleNext = async () => {
    if (!selectedRole) return;

    const selected = roles.find(r => r.id === selectedRole);
    if (!selected) return;

    setIsLoading(true);
    setError('');

    try {
      // Get user from cookies instead of localStorage
      const user = getUserFromCookie();
      if (!user) {
        throw new Error('User not found. Please login again.');
      }

      const userId = String(user.id);

      // Create the API payload using current Redux state
      const profileData: UpdateEngineerProfileParams = {
        ...engineerProfile, // Use current Redux state as base
        // Only override the role-specific fields for this API call
        currentDesignation: selected.id,
      };

      // Call the API to update engineer profile
      const response = await updateEngineerProfileApi(userId, profileData);

      console.log('Profile updated successfully:', response);

      // Store the selected role data and show questions
      setSelectedRoleData(selected);
      setShowQuestions(true);
      if (onNext) {
        onNext(selected);
      }
    } catch (err: unknown) {
      console.error('Error updating profile:', err);

      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message || 'Failed to update profile. Please try again.');
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If showQuestions is true, render KnowBetterQuestions
  if (showQuestions && selectedRoleData) {
    return <KnowBetterQuestions />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 py-8 sm:py-12">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            Select your role
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm text-center">{error}</p>
            </div>
          </div>
        )}

        {/* Role Cards Container */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile: Vertical Grid */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-4 justify-items-center px-6 max-w-sm mx-auto">
              {roles.map(role => (
                <RoleCard
                  key={role.id}
                  role={role}
                  isSelected={selectedRole === role.id}
                  onSelect={handleRoleSelect}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center max-w-5xl mx-auto">
              {roles.map(role => (
                <RoleCard
                  key={role.id}
                  role={role}
                  isSelected={selectedRole === role.id}
                  onSelect={handleRoleSelect}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center px-6">
          <button
            onClick={handleNext}
            disabled={!selectedRole || isLoading}
            className={`
            px-16 md:px-12 py-3 rounded-[20px] font-medium text-white transition-all duration-200 relative
            ${
              selectedRole && !isLoading
                ? 'bg-[#1F514C] hover:bg-emerald-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-[#1F514C] opacity-50 cursor-not-allowed'
            }
          `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
