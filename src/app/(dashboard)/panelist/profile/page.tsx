'use client';

import React, { useState } from 'react';
import { FiRefreshCw, FiEdit, FiSave, FiCamera } from 'react-icons/fi';

export default function PanelistProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [panelistData, setPanelistData] = useState({
    id: 'PNL-001',
    name: 'john doe',
    email: 'john.doe@faujx.com',
    phone: '+1 (555) 123-4567',
    role: 'Panelist',
    department: 'Operations',
    joinDate: '2024-01-15',
    lastLogin: '2025-01-07 14:30',
  });

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile updated:', panelistData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Panelist Profile
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your account information and preferences
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  {isEditing ? (
                    <FiSave className="w-4 h-4" />
                  ) : (
                    <FiEdit className="w-4 h-4" />
                  )}
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                <button className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  <FiRefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Profile Information
          </h2>

          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-300 rounded-2xl overflow-hidden shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {panelistData.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <FiCamera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                {panelistData.name}
              </h3>
              <p className="text-gray-600 mb-1">{panelistData.role}</p>
              <p className="text-sm text-gray-500">ID: {panelistData.id}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={panelistData.name}
                onChange={e =>
                  setPanelistData({ ...panelistData, name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all capitalize"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={panelistData.email}
                onChange={e =>
                  setPanelistData({ ...panelistData, email: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={panelistData.phone}
                onChange={e =>
                  setPanelistData({ ...panelistData, phone: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={panelistData.role}
                onChange={e =>
                  setPanelistData({ ...panelistData, role: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={panelistData.department}
                onChange={e =>
                  setPanelistData({
                    ...panelistData,
                    department: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Join Date
              </label>
              <input
                type="text"
                value={new Date(panelistData.joinDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Login
              </label>
              <input
                type="text"
                value={new Date(panelistData.lastLogin).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Panelist ID
              </label>
              <input
                type="text"
                value={panelistData.id}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-600 font-mono transition-all"
              />
            </div>
          </div>

          {/* Save Notice */}
          {isEditing && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p>
                You have unsaved changes. Click &quot;Save Changes&quot; to
                update your profile
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
