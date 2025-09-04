'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  FiSearch,
  FiEye,
  FiRefreshCw,
  FiUser,
  FiX,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiClock,
  FiCalendar,
  FiBriefcase,
  FiAlertTriangle,
  FiTool,
  FiAward,
  FiStar,
  FiMapPin,
  FiLoader,
} from 'react-icons/fi';

// Import the service functions
import { getAllPanelists, Panelist } from '@/services/panelistService';

// Define proper error types
interface ApiError {
  message: string;
  status?: number;
}

export default function PanelistPage() {
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [seniorityFilter, setSeniorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPanelist, setSelectedPanelist] = useState<Panelist | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Memoized loadPanelists function to prevent unnecessary re-renders
  const loadPanelists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        department: departmentFilter,
        seniorityLevel: seniorityFilter,
        isActive:
          statusFilter === 'all' ? undefined : statusFilter === 'active',
        search: searchTerm,
      };

      const response = await getAllPanelists(
        currentPage,
        itemsPerPage,
        filters
      );

      setPanelists(response.panelists);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (err: unknown) {
      // Proper error type handling
      let errorMessage = 'Failed to load panelists';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = (err as ApiError).message;
      }

      setError(errorMessage);
      console.error('Error loading panelists:', err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    departmentFilter,
    seniorityFilter,
    statusFilter,
    searchTerm,
    itemsPerPage,
  ]);

  // Load panelists on component mount and when filters change
  useEffect(() => {
    loadPanelists();
  }, [loadPanelists]);

  // Filter panelists (now done client-side for any additional filtering)
  const filteredPanelists = useMemo(() => {
    return panelists.filter(panelist => {
      const matchesSearch =
        panelist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        panelist.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        panelist.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        panelist.skills.some(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesDepartment =
        departmentFilter === 'all' || panelist.department === departmentFilter;
      const matchesSeniority =
        seniorityFilter === 'all' ||
        panelist.seniority_level === seniorityFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && panelist.is_active) ||
        (statusFilter === 'inactive' && !panelist.is_active);

      return (
        matchesSearch && matchesDepartment && matchesSeniority && matchesStatus
      );
    });
  }, [panelists, searchTerm, departmentFilter, seniorityFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = panelists.length;
    const active = panelists.filter(p => p.is_active).length;
    const inactive = panelists.filter(p => !p.is_active).length;
    const totalInterviews = panelists.reduce(
      (sum, p) => sum + (p.total_interviews || 0),
      0
    );

    return { total, active, inactive, totalInterviews };
  }, [panelists]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to get user's initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (
        nameParts[0][0] + nameParts[nameParts.length - 1][0]
      ).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
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

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'junior':
        return 'bg-green-100 text-green-800';
      case 'mid':
        return 'bg-blue-100 text-blue-800';
      case 'senior':
        return 'bg-purple-100 text-purple-800';
      case 'principal':
        return 'bg-orange-100 text-orange-800';
      case 'staff':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case 'engineering':
        return 'bg-blue-100 text-blue-800';
      case 'product':
        return 'bg-green-100 text-green-800';
      case 'design':
        return 'bg-purple-100 text-purple-800';
      case 'platform':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'engineering':
        return <FiTool className="w-4 h-4" />;
      case 'product':
        return <FiBriefcase className="w-4 h-4" />;
      case 'design':
        return <FiAward className="w-4 h-4" />;
      case 'platform':
        return <FiShield className="w-4 h-4" />;
      default:
        return <FiUser className="w-4 h-4" />;
    }
  };

  const handleViewPanelist = (panelist: Panelist) => {
    setSelectedPanelist(panelist);
    setIsViewModalOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);

    switch (filterType) {
      case 'department':
        setDepartmentFilter(value);
        break;
      case 'seniority':
        setSeniorityFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
    }
  };

  const handleRefresh = () => {
    loadPanelists();
  };

  if (loading && panelists.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <FiLoader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading panelists...</span>
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
            Interview Panelist Directory
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View interview panelists, their availability, and expertise
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
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
              <p className="text-sm text-gray-600">Total Panelists</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
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
              <p className="text-sm text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalInterviews}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search panelists..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={e => handleFilterChange('department', e.target.value)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
          </select>

          <select
            value={seniorityFilter}
            onChange={e => handleFilterChange('seniority', e.target.value)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Seniority</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Panelists Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Panelist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seniority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPanelists.map(panelist => (
                <tr key={panelist.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-4 relative flex items-center justify-center">
                        {panelist.avatar ? (
                          <Image
                            src={panelist.avatar}
                            alt={panelist.name || 'Panelist'}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                            onError={e => {
                              // Fallback to initials if image fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className={`w-full h-full rounded-full ${getInitialsColor(
                              panelist.name || ''
                            )} flex items-center justify-center text-white text-sm font-semibold`}
                          >
                            {getInitials(panelist.name || '')}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {panelist.name}
                          {panelist.rating && panelist.rating > 4.5 && (
                            <FiStar className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {panelist.designation}
                        </div>
                        <div className="text-xs text-gray-400">
                          {panelist.total_interviews || 0} interviews
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(
                        panelist.department
                      )}`}
                    >
                      {getDepartmentIcon(panelist.department)}
                      {panelist.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeniorityColor(
                        panelist.seniority_level
                      )}`}
                    >
                      {panelist.seniority_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {panelist.skills.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {panelist.skills.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{panelist.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {panelist.available_timings.length} slots
                    </div>
                    <div className="text-xs text-gray-400">
                      Max {panelist.max_interviews_per_day}/day
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        panelist.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {panelist.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewPanelist(panelist)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Panelist Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPanelists.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-2">
                <FiUsers className="w-10 h-10 text-gray-400" />
              </div>
              <div className="max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No panelists found
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {searchTerm ||
                  departmentFilter !== 'all' ||
                  seniorityFilter !== 'all' ||
                  statusFilter !== 'all'
                    ? 'No panelists match your current search criteria. Try adjusting your filters.'
                    : 'No panelists are currently available in the system.'}
                </p>

                {(searchTerm ||
                  departmentFilter !== 'all' ||
                  seniorityFilter !== 'all' ||
                  statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setDepartmentFilter('all');
                      setSeniorityFilter('all');
                      setStatusFilter('all');
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
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing{' '}
                {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
                {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
                {totalItems} panelists
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const distance = Math.abs(page - currentPage);
                    return (
                      distance === 0 ||
                      distance === 1 ||
                      page === 1 ||
                      page === totalPages
                    );
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Panelist Modal */}
      {isViewModalOpen && selectedPanelist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Panelist Details
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Panelist Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 ring-4 ring-gray-100 flex items-center justify-center">
                    {selectedPanelist.avatar ? (
                      <Image
                        src={selectedPanelist.avatar}
                        alt={selectedPanelist.name || 'Panelist'}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className={`w-full h-full rounded-full ${getInitialsColor(
                          selectedPanelist.name || ''
                        )} flex items-center justify-center text-white text-xl font-semibold`}
                      >
                        {getInitials(selectedPanelist.name || '')}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      {selectedPanelist.name}
                      {selectedPanelist.rating &&
                        selectedPanelist.rating > 4.5 && (
                          <FiStar className="w-5 h-5 text-yellow-500" />
                        )}
                    </h3>
                    <p className="text-gray-600">
                      {selectedPanelist.designation}
                    </p>
                    <p className="text-gray-600">{selectedPanelist.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedPanelist.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedPanelist.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {selectedPanelist.total_interviews || 0} interviews
                        completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(
                          selectedPanelist.department
                        )}`}
                      >
                        {getDepartmentIcon(selectedPanelist.department)}
                        {selectedPanelist.department}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700">
                      Seniority
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeniorityColor(
                          selectedPanelist.seniority_level
                        )}`}
                      >
                        {selectedPanelist.seniority_level}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700">
                      Max Interviews/Day
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPanelist.max_interviews_per_day}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                      <FiMapPin className="w-3 h-3" />
                      {selectedPanelist.timezone}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPanelist.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {selectedPanelist.skills.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No skills specified
                      </p>
                    )}
                  </div>
                </div>

                {/* Interview Types */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Interview Types
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPanelist.interview_types.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {type.replace('_', ' ')}
                      </span>
                    ))}
                    {selectedPanelist.interview_types.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No interview types specified
                      </p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Available Time Slots
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPanelist.available_timings.map((timing, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-gray-900 capitalize">
                            {timing.day}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <FiClock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {timing.startTime} - {timing.endTime} (
                            {timing.timezone})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedPanelist.available_timings.length === 0 && (
                    <p className="text-gray-500 text-sm">No availability set</p>
                  )}
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
                        {formatDate(selectedPanelist.created_at)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Updated
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedPanelist.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
