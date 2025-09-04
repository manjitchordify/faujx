'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
  FiCheck,
  FiX,
  FiUserCheck,
  FiUserX,
  FiDollarSign,
  FiAlertTriangle,
  FiFileText,
} from 'react-icons/fi';
import { User } from 'lucide-react';
import { useAppSelector } from '@/store/store';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'customer' | 'engineer' | 'expert' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  joinedDate: string;
  lastActive: string;
  avatar?: string;
  verified: boolean;
  documentsSubmitted: boolean;
  totalOrders: number;
  totalEarnings: number;
  rating: number;
  bio?: string;
  address?: string;
  businessName?: string;
  businessType?: string;
  experience?: string;
  specialization?: string[];
}

const usersData: User[] = [
  {
    id: 'USR001',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, USA',
    role: 'customer',
    status: 'active',
    joinedDate: '2024-01-15T10:30:00Z',
    lastActive: '2025-01-07T14:30:00Z',
    avatar: '/avatars/john.jpg',
    verified: true,
    documentsSubmitted: true,
    totalOrders: 12,
    totalEarnings: 7200,
    rating: 4.6,
    bio: 'Startup founder looking for reliable SaaS and cloud-based development teams.',
    address: '100 Startup Lane, San Francisco, CA 94103',
    businessName: 'GreenCore Labs',
    businessType: 'CleanTech SaaS',
    experience: '5 years',
    specialization: ['SaaS Products', 'API Integrations', 'Cloud Automation'],
  },
  {
    id: 'USR002',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    location: 'New York, USA',
    role: 'engineer',
    status: 'active',
    joinedDate: '2024-02-20T09:15:00Z',
    lastActive: '2025-01-07T12:45:00Z',
    avatar: '/avatars/sarah.jpg',
    verified: true,
    documentsSubmitted: true,
    totalOrders: 34,
    totalEarnings: 30500,
    rating: 4.9,
    bio: 'Full-stack engineer with expertise in scalable web applications and DevOps practices.',
    address: '789 Developer St, New York, NY 10012',
    businessName: 'CodeSync Solutions',
    businessType: 'Software Development Agency',
    experience: '7 years',
    specialization: [
      'React & Node.js',
      'CI/CD Pipelines',
      'Cloud Infrastructure',
    ],
  },
  {
    id: 'USR003',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1 (555) 345-6789',
    location: 'Austin, USA',
    role: 'expert',
    status: 'active',
    joinedDate: '2024-03-10T14:20:00Z',
    lastActive: '2025-01-07T16:10:00Z',
    avatar: '/avatars/michael.jpg',
    verified: true,
    documentsSubmitted: true,
    totalOrders: 58,
    totalEarnings: 48000,
    rating: 4.8,
    bio: 'Cloud architect specializing in AWS, Kubernetes, and infrastructure automation.',
    address: '321 Cloud Ave, Austin, TX 78701',
    businessName: 'Chen Cloud Consulting',
    businessType: 'Cloud Architecture & DevOps',
    experience: '10 years',
    specialization: ['AWS', 'Kubernetes', 'Terraform'],
  },
  {
    id: 'USR004',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, USA',
    role: 'customer',
    status: 'pending',
    joinedDate: '2025-01-05T11:00:00Z',
    lastActive: '2025-01-07T13:20:00Z',
    avatar: '/avatars/emily.jpg',
    verified: false,
    documentsSubmitted: true,
    totalOrders: 0,
    totalEarnings: 0,
    rating: 0,
    bio: 'Small business owner seeking mobile app development for e-commerce platform.',
    address: '456 Startup Blvd, Seattle, WA 98101',
    businessName: 'Rodriguez Retail',
    businessType: 'E-Commerce',
    experience: '2 years',
    specialization: ['Mobile Apps', 'Payment Integration', 'User Onboarding'],
  },
  {
    id: 'USR005',
    name: 'David Thompson',
    email: 'david@example.com',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, USA',
    role: 'engineer',
    status: 'suspended',
    joinedDate: '2024-06-01T08:30:00Z',
    lastActive: '2025-01-06T10:15:00Z',
    avatar: '/avatars/david.jpg',
    verified: true,
    documentsSubmitted: true,
    totalOrders: 15,
    totalEarnings: 9600,
    rating: 3.4,
    bio: 'Backend engineer focused on microservices, databases, and API security.',
    address: '654 Server Rd, Chicago, IL 60601',
    businessName: 'Thompson Techworks',
    businessType: 'Backend Development Services',
    experience: '6 years',
    specialization: ['Node.js', 'PostgreSQL', 'RESTful APIs'],
  },
];

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dateOfBirth: string | null;
  location: string | null;
  userType: 'candidate' | 'admin' | 'expert'; // Extend if needed
  isVerified: boolean;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface PaginatedUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const InfoCard = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <p className="mt-1 text-sm text-gray-900">{value || '-'}</p>
  </div>
);

const ActivityCard = ({
  icon,
  title,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

const Spinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(usersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<AdminUser | null>(null);
  const [addForm, setAddForm] = useState<Partial<AdminUser>>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    userType: 'candidate',
    isVerified: false,
    isActive: true,
  });
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const { loggedInUser } = useAppSelector(state => state.user);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Pagination
  // const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Statistics
  // const stats = useMemo(() => {
  //   const total = users.length;
  //   const active = users.filter(u => u.status === 'active').length;
  //   const pending = users.filter(u => u.status === 'pending').length;
  //   const suspended = users.filter(u => u.status === 'suspended').length;
  //   const verified = users.filter(u => u.verified).length;

  //   return { total, active, pending, suspended, verified };
  // }, [users]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // const getRoleColor = (role: string) => {
  //   switch (role) {
  //     case 'customer':
  //       return 'bg-green-100 text-green-800';
  //     case 'engineer':
  //       return 'bg-blue-100 text-blue-800';
  //     case 'expert':
  //       return 'bg-purple-100 text-purple-800';
  //     case 'admin':
  //       return 'bg-red-100 text-red-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'active':
  //       return 'bg-green-100 text-green-800';
  //     case 'inactive':
  //       return 'bg-gray-100 text-gray-800';
  //     case 'suspended':
  //       return 'bg-red-100 text-red-800';
  //     case 'pending':
  //       return 'bg-yellow-100 text-yellow-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // const getRoleIcon = (role: string) => {
  //   switch (role) {
  //     case 'customer':
  //       return <FiPackage className="w-4 h-4" />;
  //     case 'engineer':
  //       return <FiTool className="w-4 h-4" />;
  //     case 'expert':
  //       return <FiAward className="w-4 h-4" />;
  //     case 'admin':
  //       return <FiShield className="w-4 h-4" />;
  //     default:
  //       return <FiUser className="w-4 h-4" />;
  //   }
  // };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditForm({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      // setUsers(prev =>
      //   prev.map(user => (user.id === editForm.id ? editForm : user))
      // );
      setAdminUsers(prev =>
        prev.map(user => (user.id === editForm.id ? editForm : user))
      );
      setIsEditModalOpen(false);
      setEditForm(null);
      setSelectedUser(null);
    }
  };

  const handleAddUser = () => {
    const { firstName, lastName, email, phone } = addForm;

    if (firstName && lastName && email && phone) {
      const newUser: AdminUser = {
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: addForm.dateOfBirth || null,
        location: addForm.location || null,
        userType: addForm.userType || 'candidate',
        isVerified: addForm.isVerified ?? false,
        isActive: addForm.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAdminUsers(prev => [...prev, newUser]);
      setIsAddModalOpen(false);

      // Reset form
      setAddForm({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        location: '',
        userType: 'candidate',
        isVerified: false,
        isActive: true,
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleSuspendUser = (user: AdminUser) => {
    setUserToSuspend(user);
    setIsSuspendModalOpen(true);
  };

  const confirmSuspendUser = () => {
    if (userToSuspend) {
      handleStatusChange(userToSuspend.id, 'suspended');
      setIsSuspendModalOpen(false);
      setUserToSuspend(null);
    }
  };

  const handleDeleteUser = (user: AdminUser) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.totalPages) {
      fetchAdminUsers(Number(pagination.page + 1), roleFilter);
    }
  };

  const handlePrevious = () => {
    if (pagination.page > 1) {
      fetchAdminUsers(Number(pagination.page - 1), roleFilter);
    }
  };

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const confirmBulkDelete = () => {
    setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  const handleVerifyUser = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, verified: true, status: 'active' }
          : user
      )
    );
  };

  const fetchAdminUsers = useCallback(
    async (page: number, userType = roleFilter) => {
      setIsUsersLoading(true);
      const userRole = userType == 'engineer' ? 'candidate' : userType;
      const typeParam = userType !== 'all' ? `userType=${userRole}&` : '';

      try {
        const response = await fetch(
          `https://devapi.faujx.com/api/users?${typeParam}page=${page}&perPage=${pagination.perPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${loggedInUser?.accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch admin users');
        const data: PaginatedUsersResponse = await response.json();
        setAdminUsers(data.data);
        setPagination({
          total: Number(data.total),
          page: Number(data.page),
          perPage: Number(data.perPage),
          totalPages: Number(data.totalPages),
        });
      } catch (err: unknown) {
        console.log(
          err instanceof Error ? err.message : 'Unknown error fetching users'
        );
      } finally {
        setIsUsersLoading(false);
      }
    },
    [loggedInUser?.accessToken, pagination.perPage, roleFilter]
  );

  useEffect(() => {
    if (!loggedInUser?.accessToken) return;

    fetchAdminUsers(pagination.page);
  }, [loggedInUser?.accessToken, pagination.page, fetchAdminUsers]);

  useEffect(() => {
    if (!loggedInUser?.accessToken) return;
    fetchAdminUsers(1, roleFilter);
  }, [roleFilter, loggedInUser?.accessToken, fetchAdminUsers]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
            Users Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage user accounts, permissions, and verification status
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Bulk Delete Modal */}
          {isBulkDeleteModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <FiTrash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Delete Selected Users
                      </h3>
                      <p className="text-sm text-gray-600">
                        Are you sure you want to delete{' '}
                        <span className="font-medium">
                          {selectedUsers.length}
                        </span>{' '}
                        selected users? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <FiAlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium">
                          This action will permanently:
                        </p>
                        <ul className="mt-1 list-disc list-inside space-y-1">
                          <li>Remove all selected user data and history</li>
                          <li>Cancel all their active orders</li>
                          <li>Delete all associated records</li>
                          <li>This cannot be reversed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsBulkDeleteModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBulkDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Users
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="engineer">Engineers</option>
            <option value="expert">Experts</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isUsersLoading ? (
        <Spinner />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === currentUsers.length &&
                        currentUsers.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email / Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.location && (
                            <div className="text-sm text-gray-500">
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{user.email}</div>
                      <div className="text-sm text-gray-500">
                        {user.phone || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        {user.userType == 'candidate'
                          ? 'engineer'
                          : user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View User"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit User"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                        {user.userType === 'candidate' && (
                          <button
                            onClick={() =>
                              window.open(
                                `/vetting-report/candidate/${user.id}`,
                                '_blank'
                              )
                            }
                            className="text-purple-600 hover:text-purple-900"
                            title="Vetting Report"
                          >
                            <FiFileText className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={pagination.page === 1}
                className="text-gray-700 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={pagination.page === pagination.totalPages}
                className="text-gray-700 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 text-gray-700 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New User
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleAddUser();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.firstName || ''}
                    onChange={e =>
                      setAddForm(prev => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.lastName || ''}
                    onChange={e =>
                      setAddForm(prev => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={addForm.email || ''}
                    onChange={e =>
                      setAddForm(prev => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={addForm.phone || ''}
                    onChange={e =>
                      setAddForm(prev => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    required
                    value={addForm.userType || ''}
                    onChange={e =>
                      setAddForm(prev => ({
                        ...prev,
                        userType: e.target.value as
                          | 'candidate'
                          | 'expert'
                          | 'admin',
                      }))
                    }
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Role</option>
                    <option value="candidate">Candidate</option>
                    <option value="expert">Expert</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={addForm.location || ''}
                    onChange={e =>
                      setAddForm(prev => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={addForm.isVerified || false}
                    onChange={e =>
                      setAddForm(prev => ({
                        ...prev,
                        isVerified: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">Verified</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={addForm.isActive ?? true}
                    onChange={e =>
                      setAddForm(prev => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">Active</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 text-gray-700 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit User
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName || ''}
                    onChange={e =>
                      setEditForm(prev =>
                        prev ? { ...prev, firstName: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName || ''}
                    onChange={e =>
                      setEditForm(prev =>
                        prev ? { ...prev, lastName: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email || ''}
                    onChange={e =>
                      setEditForm(prev =>
                        prev ? { ...prev, email: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={e =>
                      setEditForm(prev =>
                        prev ? { ...prev, phone: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    required
                    value={editForm.userType || ''}
                    onChange={e =>
                      setEditForm(prev =>
                        prev
                          ? {
                              ...prev,
                              userType: e.target.value as
                                | 'candidate'
                                | 'expert'
                                | 'admin',
                            }
                          : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Role</option>
                    <option value="candidate">Candidate</option>
                    <option value="expert">Expert</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location || ''}
                    onChange={e =>
                      setEditForm(prev =>
                        prev ? { ...prev, location: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isVerified"
                    checked={editForm.isVerified || false}
                    onChange={e =>
                      setEditForm(prev =>
                        prev ? { ...prev, isVerified: e.target.checked } : null
                      )
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isVerified" className="text-sm text-gray-700">
                    Verified
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editForm.isActive ?? true}
                    onChange={e =>
                      setEditForm(prev =>
                        prev ? { ...prev, isActive: e.target.checked } : null
                      )
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  User Details
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 ring-4 ring-gray-100">
                    <Image
                      // src={selectedUser.avatar || '/default-avatar.jpg'}
                      src={'/default-avatar.jpg'}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      {selectedUser.firstName} {selectedUser.lastName}
                      {selectedUser.isVerified && (
                        <FiCheck className="w-5 h-5 text-green-500" />
                      )}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <p className="text-gray-600">{selectedUser.phone || '-'}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard label="User Type" value={selectedUser.userType} />
                  <InfoCard
                    label="Active Status"
                    value={
                      selectedUser.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )
                    }
                  />
                  <InfoCard
                    label="Location"
                    value={selectedUser.location || '-'}
                  />
                  <InfoCard
                    label="Joined Date"
                    value={formatDate(selectedUser.createdAt)}
                  />
                  {/* <InfoCard
                    label="Last Active"
                    value={formatDate(selectedUser.lastActive)}
                  /> */}
                  <InfoCard
                    label="Verified"
                    value={
                      selectedUser.isVerified ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <FiCheck className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <FiX className="w-4 h-4" />
                          Not Verified
                        </span>
                      )
                    }
                  />
                  {/* <InfoCard
                    label="Rating"
                    value={
                      selectedUser.rating > 0
                        ? `${selectedUser.rating}/5.0`
                        : 'No rating yet'
                    }
                  /> */}
                </div>

                {/* Business Info */}
                {/*(selectedUser.businessName ||
                  selectedUser.specialization?.length) && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Business Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard
                        label="Business Name"
                        value={selectedUser.businessName}
                      />
                      <InfoCard
                        label="Business Type"
                        value={selectedUser.businessType}
                      />
                      <InfoCard
                        label="Experience"
                        value={selectedUser.experience}
                      />
                      <InfoCard label="Address" value={selectedUser.address} />
                    </div>
                    {selectedUser.specialization?.length > 0 && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialization
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.specialization.map((spec, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )*/}

                {/* Bio */}
                {/*selectedUser.bio && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Bio
                    </h4>
                    <p className="text-sm text-gray-700">{selectedUser.bio}</p>
                  </div>
                )*/}

                {/* Recent Activity */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Recent Activity
                  </h4>
                  <div className="space-y-3">
                    <ActivityCard
                      icon={<FiUser className="w-4 h-4 text-green-600" />}
                      title="Profile updated"
                      time="1 day ago"
                    />
                    <ActivityCard
                      icon={
                        <FiDollarSign className="w-4 h-4 text-purple-600" />
                      }
                      title="Payment received"
                      time="3 days ago"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleEditUser(selectedUser);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit User
                  </button>

                  {!selectedUser.isVerified && (
                    <button
                      onClick={() => {
                        handleVerifyUser(selectedUser.id);
                        setIsViewModalOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <FiCheck className="w-4 h-4" />
                      Verify User
                    </button>
                  )}

                  {selectedUser.isActive ? (
                    <button
                      onClick={() => {
                        handleSuspendUser(selectedUser);
                        setIsViewModalOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <FiUserX className="w-4 h-4" />
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedUser.id, 'active');
                        setIsViewModalOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiUserCheck className="w-4 h-4" />
                      Activate
                    </button>
                  )}

                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      {isSuspendModalOpen && userToSuspend && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <FiAlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Suspend User
                  </h3>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to suspend{' '}
                    <span className="font-medium">
                      {userToSuspend.firstName} {userToSuspend.lastName}
                    </span>
                    ? They will not be able to access their account.
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FiAlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-800">
                    <p className="font-medium">This action will:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Prevent the user from logging in</li>
                      <li>Suspend all active orders</li>
                      <li>Require admin approval to reactivate</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsSuspendModalOpen(false);
                    setUserToSuspend(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSuspendUser}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Suspend User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FiTrash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete User
                  </h3>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete{' '}
                    <span className="font-medium">
                      {userToDelete.firstName} {userToDelete.lastName}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FiAlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">This action will permanently:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Remove all user data and history</li>
                      <li>Cancel all active orders</li>
                      <li>Delete all associated records</li>
                      <li>This cannot be reversed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
