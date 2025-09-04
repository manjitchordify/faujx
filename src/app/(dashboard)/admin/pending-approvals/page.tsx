'use client';

import React, { useState, useMemo } from 'react';
// import Image from 'next/image'
import {
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiPackage,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiRefreshCw,
  FiShield,
} from 'react-icons/fi';

interface ProductApproval {
  id: string;
  productName: string;
  description: string;
  price: number;
  category: string;
  farmer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    verificationStatus: 'verified' | 'pending' | 'rejected';
  };
  images: string[];
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  notes?: string;
}

interface UserApproval {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'transporter';
  businessName?: string;
  businessType?: string;
  location: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  avatar?: string;
  rejectionReason?: string;
  verificationNotes?: string;
}

interface DisputeApproval {
  id: string;
  orderId: string;
  disputeType: 'quality' | 'delivery' | 'payment' | 'other';
  description: string;
  submittedBy: {
    id: string;
    name: string;
    email: string;
    role: 'farmer' | 'buyer' | 'transporter';
    avatar?: string;
  };
  submittedDate: string;
  status: 'pending' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  evidence: string[];
  resolutionNotes?: string;
}

// Sample data
const productApprovals: ProductApproval[] = [
  {
    id: 'PA001',
    productName: 'Organic Sweet Corn',
    description:
      'Fresh organic sweet corn harvested daily from our certified organic farm.',
    price: 4.5,
    category: 'Vegetables',
    farmer: {
      id: 'F001',
      name: 'Robert Martinez',
      email: 'robert@example.com',
      phone: '+1 (555) 678-9012',
      avatar: '/avatars/robert.jpg',
      verificationStatus: 'verified',
    },
    images: ['/products/corn1.jpg', '/products/corn2.jpg'],
    submittedDate: '2025-01-08T09:30:00Z',
    status: 'pending',
    notes: 'Need to verify organic certification documents.',
  },
  {
    id: 'PA002',
    productName: 'Premium Strawberries',
    description:
      'Sweet, juicy strawberries grown using sustainable farming practices.',
    price: 12.0,
    category: 'Fruits',
    farmer: {
      id: 'F002',
      name: 'Lisa Chen',
      email: 'lisa@example.com',
      phone: '+1 (555) 789-0123',
      avatar: '/avatars/lisa.jpg',
      verificationStatus: 'pending',
    },
    images: ['/products/strawberries1.jpg'],
    submittedDate: '2025-01-07T14:20:00Z',
    status: 'pending',
  },
];

const userApprovals: UserApproval[] = [
  {
    id: 'UA001',
    name: 'Mark Johnson',
    email: 'mark@example.com',
    phone: '+1 (555) 890-1234',
    role: 'farmer',
    businessName: 'Johnson Organic Farms',
    businessType: 'Organic Farming',
    location: 'Oregon, USA',
    submittedDate: '2025-01-06T16:45:00Z',
    status: 'pending',
    documents: [
      {
        id: 'DOC001',
        name: 'Business License',
        type: 'PDF',
        url: '/docs/business-license.pdf',
      },
      {
        id: 'DOC002',
        name: 'Organic Certification',
        type: 'PDF',
        url: '/docs/organic-cert.pdf',
      },
    ],
    avatar: '/avatars/mark.jpg',
  },
  {
    id: 'UA002',
    name: 'Amanda Rodriguez',
    email: 'amanda@example.com',
    phone: '+1 (555) 901-2345',
    role: 'transporter',
    businessName: 'Rodriguez Logistics',
    businessType: 'Transportation',
    location: 'California, USA',
    submittedDate: '2025-01-05T11:30:00Z',
    status: 'pending',
    documents: [
      {
        id: 'DOC003',
        name: 'Commercial License',
        type: 'PDF',
        url: '/docs/commercial-license.pdf',
      },
      {
        id: 'DOC004',
        name: 'Insurance Certificate',
        type: 'PDF',
        url: '/docs/insurance.pdf',
      },
    ],
    avatar: '/avatars/amanda.jpg',
  },
];

const disputeApprovals: DisputeApproval[] = [
  {
    id: 'DA001',
    orderId: 'ORD-2025-003',
    disputeType: 'quality',
    description:
      'Received tomatoes were not as fresh as advertised. Several were overripe and some had spots.',
    submittedBy: {
      id: 'B001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'buyer',
      avatar: '/avatars/sarah.jpg',
    },
    submittedDate: '2025-01-07T13:15:00Z',
    status: 'pending',
    priority: 'medium',
    evidence: ['/evidence/tomato1.jpg', '/evidence/tomato2.jpg'],
  },
  {
    id: 'DA002',
    orderId: 'ORD-2025-001',
    disputeType: 'delivery',
    description:
      'Order was delivered 3 days late without any notification. This caused issues with my restaurant service.',
    submittedBy: {
      id: 'B002',
      name: 'David Thompson',
      email: 'david@example.com',
      role: 'buyer',
      avatar: '/avatars/david.jpg',
    },
    submittedDate: '2025-01-06T18:45:00Z',
    status: 'pending',
    priority: 'high',
    evidence: ['/evidence/delivery-receipt.jpg'],
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'resolved':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getPriorityColor(priority: string) {
  return priority === 'high'
    ? 'bg-red-100 text-red-800'
    : 'bg-gray-100 text-gray-800';
}

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'disputes'>(
    'products'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<
    ProductApproval | UserApproval | DisputeApproval | null
  >(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [itemToApprove, setItemToApprove] = useState<{
    type: 'products' | 'users' | 'disputes';
    item: ProductApproval | UserApproval | DisputeApproval;
  } | null>(null);
  const [itemToReject, setItemToReject] = useState<{
    type: 'products' | 'users' | 'disputes';
    item: ProductApproval | UserApproval | DisputeApproval;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [productApprovalsList, setProductApprovalsList] =
    useState(productApprovals);
  const [userApprovalsList, setUserApprovalsList] = useState(userApprovals);
  const [disputeApprovalsList, setDisputeApprovalsList] =
    useState(disputeApprovals);
  const itemsPerPage = 10;

  const filteredProductApprovals = useMemo(() => {
    return productApprovalsList.filter(product => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, productApprovalsList]);

  const filteredUserApprovals = useMemo(() => {
    return userApprovalsList.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, userApprovalsList]);

  const filteredDisputeApprovals = useMemo(() => {
    return disputeApprovalsList.filter(dispute => {
      const matchesSearch =
        dispute.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.submittedBy.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || dispute.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, disputeApprovalsList]);

  const handleApprove = (
    type: 'products' | 'users' | 'disputes',
    id: string
  ) => {
    if (type === 'products') {
      setProductApprovalsList(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: 'approved' } : item
        )
      );
    } else if (type === 'users') {
      setUserApprovalsList(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: 'approved' } : item
        )
      );
    } else if (type === 'disputes') {
      setDisputeApprovalsList(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: 'resolved' } : item
        )
      );
    }
    setIsApproveModalOpen(false);
    setItemToApprove(null);
  };

  const handleReject = (
    type: 'products' | 'users' | 'disputes',
    id: string
  ) => {
    if (type === 'products') {
      setProductApprovalsList(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: 'rejected' } : item
        )
      );
    } else if (type === 'users') {
      setUserApprovalsList(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: 'rejected' } : item
        )
      );
    } else if (type === 'disputes') {
      setDisputeApprovalsList(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: 'rejected' } : item
        )
      );
    }
    setIsRejectModalOpen(false);
    setItemToReject(null);
    setRejectionReason('');
  };

  const openApproveModal = (
    type: 'products' | 'users' | 'disputes',
    item: ProductApproval | UserApproval | DisputeApproval
  ) => {
    setItemToApprove({ type, item });
    setIsApproveModalOpen(true);
  };

  const openRejectModal = (
    type: 'products' | 'users' | 'disputes',
    item: ProductApproval | UserApproval | DisputeApproval
  ) => {
    setItemToReject({ type, item });
    setIsRejectModalOpen(true);
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'products':
        return filteredProductApprovals;
      case 'users':
        return filteredUserApprovals;
      case 'disputes':
        return filteredDisputeApprovals;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

  // Pagination
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    const allData = [
      ...productApprovalsList,
      ...userApprovalsList,
      ...disputeApprovalsList,
    ];
    const pending = allData.filter(item => item.status === 'pending').length;
    const approved = allData.filter(item => item.status === 'approved').length;
    const rejected = allData.filter(item => item.status === 'rejected').length;
    const total = allData.length;

    return { pending, approved, rejected, total };
  }, [productApprovalsList, userApprovalsList, disputeApprovalsList]);

  const handleBulkAction = (action: string) => {
    if (action === 'approve') {
      // Handle bulk approve
      console.log('Bulk approve:', selectedItems);
    } else if (action === 'reject') {
      // Handle bulk reject
      console.log('Bulk reject:', selectedItems);
    }
    setSelectedItems([]);
  };

  const handleViewItem = (
    item: ProductApproval | UserApproval | DisputeApproval
  ) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
            Pending Approvals
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve pending submissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FiDownload className="w-4 h-4" />
            Export Report
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <FiCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <FiX className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiPackage className="w-4 h-4" />
                Product Listings (
                {productApprovals.filter(p => p.status === 'pending').length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiUser className="w-4 h-4" />
                User Accounts (
                {userApprovals.filter(u => u.status === 'pending').length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'disputes'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiShield className="w-4 h-4" />
                Disputes (
                {disputeApprovals.filter(d => d.status === 'pending').length})
              </div>
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-gray-900 pr-8"
              >
                <option value="pending">Pending Only</option>
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                {activeTab === 'disputes' && (
                  <option value="resolved">Resolved</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}{' '}
              selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
              >
                Approve Selected
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
              >
                Reject Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === currentData.length &&
                      currentData.length > 0
                    }
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedItems(currentData.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 bg-white"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'products'
                    ? 'Product'
                    : activeTab === 'users'
                      ? 'User'
                      : 'Dispute'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'products' ? 'Price' : 'Email'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'products'
                    ? 'Farmer'
                    : activeTab === 'users'
                      ? 'Role'
                      : 'Type'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(
                            selectedItems.filter(id => id !== item.id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 bg-white"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {activeTab === 'products'
                            ? (item as ProductApproval).productName
                            : activeTab === 'users'
                              ? (item as UserApproval).name
                              : (item as DisputeApproval).disputeType}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {activeTab === 'products'
                            ? (item as ProductApproval).description
                            : activeTab === 'users'
                              ? (item as UserApproval).businessName
                              : (item as DisputeApproval).description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activeTab === 'products'
                      ? `$${(item as ProductApproval).price.toFixed(2)}`
                      : activeTab === 'users'
                        ? (item as UserApproval).email
                        : (item as DisputeApproval).submittedBy.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activeTab === 'products'
                      ? (item as ProductApproval).farmer.name
                      : activeTab === 'users'
                        ? (item as UserApproval).role
                        : (item as DisputeApproval).disputeType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewItem(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openApproveModal(activeTab, item)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openRejectModal(activeTab, item)}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, currentData.length)}{' '}
              of {currentData.length} items
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedItem && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeTab === 'products' &&
                      'productName' in selectedItem &&
                      `Product: ${selectedItem.productName}`}
                    {activeTab === 'users' &&
                      'name' in selectedItem &&
                      `User: ${selectedItem.name}`}
                    {activeTab === 'disputes' &&
                      'disputeType' in selectedItem &&
                      `Dispute: ${selectedItem.disputeType}`}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedItem.status)}`}
                    >
                      {selectedItem.status}
                    </span>
                    {activeTab === 'disputes' && 'priority' in selectedItem && (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedItem.priority)}`}
                      >
                        {selectedItem.priority} priority
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Content based on active tab */}
              {activeTab === 'products' && 'productName' in selectedItem && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Product Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600">Name:</span>{' '}
                          {selectedItem.productName}
                        </div>
                        <div>
                          <span className="text-gray-600">Description:</span>{' '}
                          {selectedItem.description}
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>{' '}
                          {selectedItem.category}
                        </div>
                        <div>
                          <span className="text-gray-600">Price:</span> $
                          {selectedItem.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Farmer Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600">Name:</span>{' '}
                          {selectedItem.farmer.name}
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>{' '}
                          {selectedItem.farmer.email}
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>{' '}
                          {selectedItem.farmer.phone}
                        </div>
                        <div>
                          <span className="text-gray-600">Verification:</span>
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              selectedItem.farmer.verificationStatus ===
                              'verified'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {selectedItem.farmer.verificationStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedItem.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                      <p className="text-gray-600">{selectedItem.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'users' &&
                'name' in selectedItem &&
                'businessName' in selectedItem && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          User Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-600">Name:</span>{' '}
                            {selectedItem.name}
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span>{' '}
                            {selectedItem.email}
                          </div>
                          <div>
                            <span className="text-gray-600">Phone:</span>{' '}
                            {selectedItem.phone}
                          </div>
                          <div>
                            <span className="text-gray-600">Role:</span>{' '}
                            {selectedItem.role}
                          </div>
                          <div>
                            <span className="text-gray-600">Location:</span>{' '}
                            {selectedItem.location}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Business Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-600">
                              Business Name:
                            </span>{' '}
                            {selectedItem.businessName}
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Business Type:
                            </span>{' '}
                            {selectedItem.businessType}
                          </div>
                          <div>
                            <span className="text-gray-600">Documents:</span>{' '}
                            {selectedItem.documents.length} files
                          </div>
                        </div>
                      </div>
                    </div>
                    {'verificationNotes' in selectedItem &&
                      selectedItem.verificationNotes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Verification Notes
                          </h4>
                          <p className="text-gray-600">
                            {selectedItem.verificationNotes}
                          </p>
                        </div>
                      )}
                  </div>
                )}

              {activeTab === 'disputes' && 'disputeType' in selectedItem && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Dispute Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600">Type:</span>{' '}
                          {selectedItem.disputeType}
                        </div>
                        <div>
                          <span className="text-gray-600">Order ID:</span>{' '}
                          {selectedItem.orderId}
                        </div>
                        <div>
                          <span className="text-gray-600">Priority:</span>{' '}
                          {selectedItem.priority}
                        </div>
                        <div>
                          <span className="text-gray-600">Description:</span>{' '}
                          {selectedItem.description}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Submitted By
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600">Name:</span>{' '}
                          {selectedItem.submittedBy.name}
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>{' '}
                          {selectedItem.submittedBy.email}
                        </div>
                        <div>
                          <span className="text-gray-600">Role:</span>{' '}
                          {selectedItem.submittedBy.role}
                        </div>
                        <div>
                          <span className="text-gray-600">Evidence:</span>{' '}
                          {selectedItem.evidence.length} files
                        </div>
                      </div>
                    </div>
                  </div>
                  {'resolutionNotes' in selectedItem &&
                    selectedItem.resolutionNotes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Resolution Notes
                        </h4>
                        <p className="text-gray-600">
                          {selectedItem.resolutionNotes}
                        </p>
                      </div>
                    )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                {selectedItem.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        // handleApprove(selectedItem.id)
                        setIsViewModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FiCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        // handleReject(selectedItem.id)
                        setIsViewModalOpen(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <FiX className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {isApproveModalOpen && itemToApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0  bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsApproveModalOpen(false)}
          />
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Approve Item
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to approve this{' '}
                {itemToApprove.type === 'products'
                  ? 'product'
                  : itemToApprove.type === 'users'
                    ? 'user account'
                    : 'dispute'}
                ?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsApproveModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleApprove(itemToApprove.type, itemToApprove.item.id)
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && itemToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsRejectModalOpen(false)}
          />
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiX className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Reject Item
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to reject this{' '}
                {itemToReject.type === 'products'
                  ? 'product'
                  : itemToReject.type === 'users'
                    ? 'user account'
                    : 'dispute'}
                ?
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Reason for rejection (optional):
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter reason for rejection..."
                />
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleReject(itemToReject.type, itemToReject.item.id)
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
