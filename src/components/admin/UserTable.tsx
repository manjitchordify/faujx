'use client';

import React from 'react';
import Image from 'next/image';
import { Pencil, Eye, Trash2 } from 'lucide-react';

const mockUsers = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'Farmer',
    status: 'Approved',
    image: 'https://via.placeholder.com/40',
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Buyer',
    status: 'Pending',
    image: 'https://via.placeholder.com/40',
  },
  {
    id: 3,
    name: 'Alice Green',
    email: 'alice@example.com',
    role: 'Transporter',
    status: 'Approved',
    image: 'https://via.placeholder.com/40',
  },
];

const UserTable = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      {/* Top Buttons Row */}
      <div className="flex justify-between items-center px-4 py-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Export
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add User
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              User
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              Role
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockUsers.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 flex items-center gap-3">
                <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm text-gray-900">{user.name}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <Eye size={18} />
                </button>
                <button className="text-yellow-500 hover:text-yellow-600">
                  <Pencil size={18} />
                </button>
                <button className="text-red-500 hover:text-red-600">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
