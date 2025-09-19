'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  FiSearch,
  FiEye,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiPhone,
  FiMail,
  FiMapPin,
  FiLoader,
  FiChevronsLeft,
  FiChevronsRight,
  FiStar,
  FiAward,
  FiEdit,
  FiRefreshCw,
  FiAlertCircle,
} from 'react-icons/fi';
import { getAllCustomers } from '@/services/admin-panelist-services/customerService';

// Customer interface based on the provided data structure
interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  phone: string;
  profilePic?: string | null;
  profilePicKey?: string | null;
  profileVideoKey?: string | null;
  profileVideo?: string | null;
  dateOfBirth: string;
  location: string;
  country?: string | null;
  isVerified: boolean;
  isActive: boolean;
  isSubscribed: boolean;
  subscribedAt?: string | null;
  isPremium: boolean;
  premiumSince?: string | null;
  premiumUntil?: string | null;
}

// View Customer Details Modal
function ViewCustomerModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {customer.firstName} {customer.lastName} - Customer Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer ID
                  </label>
                  <p className="text-gray-900 font-mono text-xs">
                    {customer.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">
                    {formatDate(customer.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="text-gray-900">
                    {customer.location}
                    {customer.country && `, ${customer.country}`}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Status
              </h3>
              <div className="space-y-4">
                {/* Account Status */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        customer.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {customer.isActive ? (
                        <FiCheckCircle className="w-4 h-4" />
                      ) : (
                        <FiXCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Account Status
                      </h4>
                      <p
                        className={`text-sm font-medium ${
                          customer.isActive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        customer.isVerified ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                    >
                      {customer.isVerified ? (
                        <FiCheckCircle className="w-4 h-4" />
                      ) : (
                        <FiXCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Verification
                      </h4>
                      <p
                        className={`text-sm font-medium ${
                          customer.isVerified
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {customer.isVerified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subscription Status */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        customer.isSubscribed ? 'bg-purple-500' : 'bg-gray-500'
                      }`}
                    >
                      <FiStar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Subscription
                      </h4>
                      <p
                        className={`text-sm font-medium ${
                          customer.isSubscribed
                            ? 'text-purple-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {customer.isSubscribed
                          ? 'Subscribed'
                          : 'Not Subscribed'}
                      </p>
                      {customer.subscribedAt && (
                        <p className="text-xs text-gray-500">
                          Since: {formatDate(customer.subscribedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Premium Status */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        customer.isPremium ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                    >
                      <FiAward className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Premium Status
                      </h4>
                      <p
                        className={`text-sm font-medium ${
                          customer.isPremium
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {customer.isPremium
                          ? 'Premium Member'
                          : 'Regular Member'}
                      </p>
                      {customer.isPremium && customer.premiumUntil && (
                        <p className="text-xs text-gray-500">
                          Until: {formatDate(customer.premiumUntil)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCustomers();

      // Type assertion to handle API response
      // Adjust based on your actual API response structure
      setCustomers(data as Customer[]);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch customers. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers locally for search and status
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch =
        customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && customer.isActive) ||
        (statusFilter === 'inactive' && !customer.isActive) ||
        (statusFilter === 'verified' && customer.isVerified) ||
        (statusFilter === 'subscribed' && customer.isSubscribed) ||
        (statusFilter === 'premium' && customer.isPremium);

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // Calculate pagination
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Calculate stats
  const totalStats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.isActive).length;
    const verified = customers.filter(c => c.isVerified).length;
    const subscribed = customers.filter(c => c.isSubscribed).length;
    const premium = customers.filter(c => c.isPremium).length;

    return { total, active, verified, subscribed, premium };
  }, [customers]);

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Handle view customer
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchCustomers();
  };

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Customer Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer accounts and subscription status
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading customers
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '-' : totalStats.total}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? '-' : totalStats.active}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? '-' : totalStats.verified}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Subscribed</p>
              <p className="text-2xl font-bold text-purple-600">
                {loading ? '-' : totalStats.subscribed}
              </p>
            </div>
            <FiStar className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Premium</p>
              <p className="text-2xl font-bold text-yellow-600">
                {loading ? '-' : totalStats.premium}
              </p>
            </div>
            <FiAward className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="subscribed">Subscribed</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading customers...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCustomers.map(customer => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {customer.profilePic ? (
                              <Image
                                src={customer.profilePic}
                                alt={`${customer.firstName} ${customer.lastName}`}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <FiUser className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {customer.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <FiMail className="w-3 h-3 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <FiPhone className="w-3 h-3 text-gray-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FiMapPin className="w-3 h-3 text-gray-400" />
                          {customer.location}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center">
                            {customer.isActive ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiCheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FiXCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </span>
                            )}
                          </div>
                          {customer.isVerified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <FiCheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {customer.isSubscribed && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <FiStar className="w-3 h-3 mr-1" />
                              Subscribed
                            </span>
                          )}
                          {customer.isPremium && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FiAward className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                          {!customer.isSubscribed && !customer.isPremium && (
                            <span className="text-xs text-gray-500">
                              Regular
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewCustomer(customer)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                          >
                            <FiEye className="w-3 h-3" />
                            View
                          </button>
                          <button className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors">
                            <FiEdit className="w-3 h-3" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {currentCustomers.length === 0 && !loading && (
              <div className="text-center py-12">
                <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No customers found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'No customers available at this time'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{' '}
                  {totalItems} customers
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={e =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First page"
                  >
                    <FiChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last page"
                  >
                    <FiChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      {isViewModalOpen && selectedCustomer && (
        <ViewCustomerModal
          customer={selectedCustomer}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
}

export default CustomerManagement;
