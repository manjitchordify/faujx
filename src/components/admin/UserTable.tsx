'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  FiAlertTriangle,
  FiUsers,
  FiShield,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiLoader,
  FiRefreshCw,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiClipboard,
  FiGlobe,
} from 'react-icons/fi';
import { useAppSelector } from '@/store/store';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
  updateUserStatus,
  getUserStatsWorkaround,
  AdminUser,
  UpdateUserRequest,
  UserStats,
} from '@/services/admin-panelist-services/userService';

const InfoCard = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 text-sm text-gray-900">{value || '-'}</div>
  </div>
);

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<AdminUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    byUserType: {
      candidate: 0,
      expert: 0,
      admin: 0,
      interview_panel: 0,
    },
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { loggedInUser } = useAppSelector(state => state.user);

  // Filter users locally for search
  const filteredUsers = useMemo(() => {
    return adminUsers.filter(user => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone &&
          user.phone.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  }, [adminUsers, searchTerm]);

  // Statistics - now using real data from all records
  const stats = useMemo(() => {
    return {
      total: userStats.total,
      active: userStats.active,
      inactive: userStats.inactive,
      verified: userStats.verified,
    };
  }, [userStats]);

  // Helper function to get user's initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return 'U';
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  // Helper function to generate background color for initials
  const getInitialsColor = (name: string) => {
    if (!name) return 'bg-gray-500';
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      case 'candidate':
        return 'bg-blue-100 text-blue-800';
      case 'interview_panel':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FiShield className="w-4 h-4" />;
      case 'expert':
        return <FiStar className="w-4 h-4" />;
      case 'candidate':
        return <FiUser className="w-4 h-4" />;
      case 'interview_panel':
        return <FiClipboard className="w-4 h-4" />;
      default:
        return <FiUser className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditForm({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;

    try {
      const updateData: UpdateUserRequest = {
        email: editForm.email,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        userType: editForm.userType,
        isVerified: editForm.isVerified,
        isActive: editForm.isActive,
      };

      const updatedUser = await updateUser(editForm.id, updateData);

      setAdminUsers(prev =>
        prev.map(user => (user.id === editForm.id ? updatedUser : user))
      );

      // Refresh statistics after user update
      loadUserStats();

      setIsEditModalOpen(false);
      setEditForm(null);
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
    }
  };

  const handleSuspendUser = (user: AdminUser) => {
    setUserToSuspend(user);
    setIsSuspendModalOpen(true);
  };

  const confirmSuspendUser = async () => {
    if (!userToSuspend) return;

    try {
      const updatedUser = await updateUserStatus(userToSuspend.id, false);

      setAdminUsers(prev =>
        prev.map(user => (user.id === userToSuspend.id ? updatedUser : user))
      );

      // Refresh statistics after status update
      loadUserStats();

      setIsSuspendModalOpen(false);
      setUserToSuspend(null);
      setError(null);
    } catch (err) {
      console.error('Error suspending user:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to suspend user';
      setError(errorMessage);
    }
  };

  const handleDeleteUser = (user: AdminUser) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);

      setAdminUsers(prev => prev.filter(user => user.id !== userToDelete.id));

      // Refresh statistics after user deletion
      loadUserStats();

      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await deleteMultipleUsers(selectedUsers);

      setAdminUsers(prev =>
        prev.filter(user => !selectedUsers.includes(user.id))
      );

      // Refresh statistics after bulk deletion
      loadUserStats();

      setSelectedUsers([]);
      setIsBulkDeleteModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error deleting users:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete selected users';
      setError(errorMessage);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      // Get the current user to preserve other data
      const currentUser = adminUsers.find(user => user.id === userId);
      if (!currentUser) {
        setError('User not found');
        return;
      }

      // Update user with verified status using general update endpoint
      const updateData: UpdateUserRequest = {
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        userType: currentUser.userType,
        isVerified: true, // Set to verified
        isActive: currentUser.isActive,
      };

      const updatedUser = await updateUser(userId, updateData);

      setAdminUsers(prev =>
        prev.map(user => (user.id === userId ? updatedUser : user))
      );

      // Refresh statistics after user verification
      loadUserStats();

      setError(null);
    } catch (err) {
      console.error('Error verifying user:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to verify user';
      setError(errorMessage);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const updatedUser = await updateUserStatus(userId, true);

      setAdminUsers(prev =>
        prev.map(user => (user.id === userId ? updatedUser : user))
      );

      // Refresh statistics after user activation
      loadUserStats();

      setError(null);
    } catch (err) {
      console.error('Error activating user:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to activate user';
      setError(errorMessage);
    }
  };

  // Toggle publish/unpublish - same pattern as vetting
  const handleTogglePublish = async (user: AdminUser) => {
    // TODO: Integrate API endpoint for publish/unpublish user
    // This should call an API similar to updateCandidatePublishStatus
    console.log('Toggle publish for user:', user.id);

    // Placeholder - shows if published or not
    if (user.isPublished) {
      alert('Unpublish feature - API integration pending');
    } else {
      alert('Publish feature - API integration pending');
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.totalPages) {
      fetchUsers(pagination.page + 1, roleFilter);
    }
  };

  const handlePrevious = () => {
    if (pagination.page > 1) {
      fetchUsers(pagination.page - 1, roleFilter);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'role') {
      setRoleFilter(value);
    }
  };

  const handleRefresh = () => {
    fetchUsers(pagination.page);
    loadUserStats();
  };

  const loadUserStats = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      const stats = await getUserStatsWorkaround();
      setUserStats(stats);
    } catch (err) {
      console.error('Error loading user statistics:', err);
      // Don't set error state for stats, just log it
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(
    async (page: number, userType = roleFilter) => {
      setIsUsersLoading(true);
      setError(null);

      try {
        const response = await getAllUsers(page, pagination.perPage, userType);

        setAdminUsers(response.data);
        setPagination({
          total: Number(response.total),
          page: Number(response.page),
          perPage: Number(response.perPage),
          totalPages: Number(response.totalPages),
        });
      } catch (err) {
        console.error('Error fetching users:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch users';
        setError(errorMessage);
      } finally {
        setIsUsersLoading(false);
      }
    },
    [pagination.perPage, roleFilter]
  );

  useEffect(() => {
    if (!loggedInUser?.accessToken) return;
    fetchUsers(pagination.page);
    loadUserStats();
  }, [loggedInUser?.accessToken, pagination.page, fetchUsers, loadUserStats]);

  useEffect(() => {
    if (!loggedInUser?.accessToken) return;
    fetchUsers(1, roleFilter);
    loadUserStats();
  }, [roleFilter, loggedInUser?.accessToken, fetchUsers, loadUserStats]);

  if ((isUsersLoading || isStatsLoading) && adminUsers.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <FiLoader className="w-6 h-6 animate-spin text-green-600" />
          <span className="text-lg text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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
          {selectedUsers.length > 0 && (
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete Selected ({selectedUsers.length})
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={isUsersLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isUsersLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <FiUserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.inactive}
              </p>
            </div>
            <FiUserX className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.verified}
              </p>
            </div>
            <FiShield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={e => handleFilterChange('role', e.target.value)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="engineer">Engineers</option>
            <option value="expert">Experts</option>
            <option value="admin">Admins</option>
            <option value="interview_panel">Interview Panel</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
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
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-4 relative flex items-center justify-center">
                        <div
                          className={`w-full h-full rounded-full ${getInitialsColor(
                            user.firstName || user.lastName || ''
                          )} flex items-center justify-center text-white text-sm font-semibold`}
                        >
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {user.firstName} {user.lastName}
                          {user.isVerified && (
                            <FiCheck className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user.id.slice(0, 8)}...
                        </div>
                        {user.dateOfBirth && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            Born:{' '}
                            {new Date(user.dateOfBirth).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <FiMail className="w-3 h-3 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <FiPhone className="w-3 h-3 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                      {user.location && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <FiMapPin className="w-3 h-3 text-gray-400" />
                          {user.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          user.userType
                        )}`}
                      >
                        {getRoleIcon(user.userType)}
                        {user.userType === 'candidate'
                          ? 'Engineer'
                          : user.userType === 'interview_panel'
                            ? 'Interview Panel'
                            : user.userType.charAt(0).toUpperCase() +
                              user.userType.slice(1)}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {user.isVerified && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiCalendar className="w-3 h-3" />
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <FiClock className="w-3 h-3" />
                        Updated: {new Date(user.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View User Details"
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
                        onClick={() => handleTogglePublish(user)}
                        className={`${
                          user.isPublished
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={
                          user.isPublished ? 'Unpublish User' : 'Publish User'
                        }
                      >
                        <FiGlobe className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !isUsersLoading && (
          <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-2">
                <FiUsers className="w-10 h-10 text-gray-400" />
              </div>
              <div className="max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {searchTerm || roleFilter !== 'all'
                    ? 'No users match your current search criteria. Try adjusting your filters.'
                    : 'No users are currently available in the system.'}
                </p>

                {(searchTerm || roleFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setRoleFilter('all');
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing{' '}
                {Math.min(
                  (pagination.page - 1) * pagination.perPage + 1,
                  pagination.total
                )}
                -
                {Math.min(
                  pagination.page * pagination.perPage,
                  pagination.total
                )}{' '}
                of {pagination.total} users
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={pagination.page === 1}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Previous page"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Next page"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div></div>
          </div>
        )}
      </div>

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
                    <span className="font-medium">{selectedUsers.length}</span>{' '}
                    selected users? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FiAlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">This action will permanently:</p>
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
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth || ''}
                    onChange={e =>
                      setEditForm(prev =>
                        prev ? { ...prev, dateOfBirth: e.target.value } : null
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
                                | 'admin'
                                | 'interview_panel',
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
                    <option value="interview_panel">Interview Panel</option>
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
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
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
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 ring-4 ring-gray-100 flex items-center justify-center">
                    <div
                      className={`w-full h-full rounded-full ${getInitialsColor(
                        selectedUser.firstName || selectedUser.lastName || ''
                      )} flex items-center justify-center text-white text-xl font-semibold`}
                    >
                      {getInitials(
                        selectedUser.firstName,
                        selectedUser.lastName
                      )}
                    </div>
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
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          selectedUser.userType
                        )}`}
                      >
                        {getRoleIcon(selectedUser.userType)}
                        {selectedUser.userType}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedUser.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="User ID" value={selectedUser.id} />
                  <InfoCard
                    label="Email"
                    value={
                      <div className="flex items-center gap-1">
                        <FiMail className="w-3 h-3 text-gray-400" />
                        {selectedUser.email}
                      </div>
                    }
                  />
                  <InfoCard
                    label="Phone"
                    value={
                      selectedUser.phone ? (
                        <div className="flex items-center gap-1">
                          <FiPhone className="w-3 h-3 text-gray-400" />
                          {selectedUser.phone}
                        </div>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <InfoCard
                    label="Location"
                    value={
                      selectedUser.location ? (
                        <div className="flex items-center gap-1">
                          <FiMapPin className="w-3 h-3 text-gray-400" />
                          {selectedUser.location}
                        </div>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <InfoCard
                    label="Date of Birth"
                    value={
                      selectedUser.dateOfBirth ? (
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-gray-400" />
                          {new Date(
                            selectedUser.dateOfBirth
                          ).toLocaleDateString()}
                        </div>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <InfoCard
                    label="User Type"
                    value={
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          selectedUser.userType
                        )}`}
                      >
                        {getRoleIcon(selectedUser.userType)}
                        {selectedUser.userType === 'candidate'
                          ? 'Engineer'
                          : selectedUser.userType === 'interview_panel'
                            ? 'Interview Panel'
                            : selectedUser.userType.charAt(0).toUpperCase() +
                              selectedUser.userType.slice(1)}
                      </span>
                    }
                  />
                </div>

                {/* Status Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Account Status
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      label="Active Status"
                      value={
                        selectedUser.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            <FiUserCheck className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            <FiUserX className="w-3 h-3 mr-1" />
                            Inactive
                          </span>
                        )
                      }
                    />
                    <InfoCard
                      label="Verification Status"
                      value={
                        selectedUser.isVerified ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            <FiCheck className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            <FiClock className="w-3 h-3 mr-1" />
                            Unverified
                          </span>
                        )
                      }
                    />
                  </div>
                </div>

                {/* Timestamps */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Record Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Created
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Updated
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedUser.updatedAt)}
                      </p>
                    </div>
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
                        handleActivateUser(selectedUser.id);
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
