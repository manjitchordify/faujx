'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiDownload,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiTruck,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiAlertCircle,
  FiShoppingCart,
  FiTrendingUp,
  FiPhone,
} from 'react-icons/fi';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  buyer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  farmer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };

  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress: string;
  notes?: string;
  trackingNumber?: string;
}

const ordersData: Order[] = [
  {
    id: 'ORD001',
    orderNumber: 'AGR-2025-001',
    buyer: {
      id: 'USR002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      avatar: '/avatars/sarah.jpg',
    },
    farmer: {
      id: 'USR001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '/avatars/john.jpg',
    },
    items: [
      {
        id: 'ITEM001',
        name: 'Organic Tomatoes',
        quantity: 50,
        unit: 'kg',
        price: 5.0,
        total: 250.0,
        image: '/products/tomatoes.jpg',
      },
      {
        id: 'ITEM002',
        name: 'Fresh Lettuce',
        quantity: 30,
        unit: 'kg',
        price: 3.5,
        total: 105.0,
        image: '/products/lettuce.jpg',
      },
    ],
    status: 'in_transit',
    paymentStatus: 'paid',
    totalAmount: 355.0,
    orderDate: '2025-01-05T10:30:00Z',
    deliveryDate: '2025-01-08T14:00:00Z',
    deliveryAddress: '567 Business Ave, New York, NY 10001',
    notes: 'Please deliver to the back entrance of the restaurant.',
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ORD002',
    orderNumber: 'AGR-2025-002',
    buyer: {
      id: 'USR005',
      name: 'David Thompson',
      email: 'david@example.com',
      phone: '+1 (555) 567-8901',
      avatar: '/avatars/david.jpg',
    },
    farmer: {
      id: 'USR004',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
      avatar: '/avatars/emily.jpg',
    },
    items: [
      {
        id: 'ITEM003',
        name: 'Organic Mangoes',
        quantity: 25,
        unit: 'kg',
        price: 8.0,
        total: 200.0,
        image: '/products/mangoes.jpg',
      },
    ],
    status: 'pending',
    paymentStatus: 'pending',
    totalAmount: 200.0,
    orderDate: '2025-01-06T15:45:00Z',
    deliveryAddress: '456 Market St, Portland, OR 97201',
    notes: 'Urgent delivery required for weekend sale.',
  },
  {
    id: 'ORD003',
    orderNumber: 'AGR-2025-003',
    buyer: {
      id: 'USR002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      avatar: '/avatars/sarah.jpg',
    },
    farmer: {
      id: 'USR001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '/avatars/john.jpg',
    },

    items: [
      {
        id: 'ITEM004',
        name: 'Organic Carrots',
        quantity: 40,
        unit: 'kg',
        price: 4.0,
        total: 160.0,
        image: '/products/carrots.jpg',
      },
      {
        id: 'ITEM005',
        name: 'Fresh Spinach',
        quantity: 20,
        unit: 'kg',
        price: 6.0,
        total: 120.0,
        image: '/products/spinach.jpg',
      },
    ],
    status: 'delivered',
    paymentStatus: 'paid',
    totalAmount: 280.0,
    orderDate: '2025-01-03T09:20:00Z',
    deliveryDate: '2025-01-05T11:30:00Z',
    deliveryAddress: '567 Business Ave, New York, NY 10001',
    trackingNumber: 'TRK987654321',
  },
  {
    id: 'ORD004',
    orderNumber: 'AGR-2025-004',
    buyer: {
      id: 'USR002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      avatar: '/avatars/sarah.jpg',
    },
    farmer: {
      id: 'USR001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '/avatars/john.jpg',
    },
    items: [
      {
        id: 'ITEM006',
        name: 'Organic Bell Peppers',
        quantity: 35,
        unit: 'kg',
        price: 7.0,
        total: 245.0,
        image: '/products/peppers.jpg',
      },
    ],
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 245.0,
    orderDate: '2025-01-07T08:15:00Z',
    deliveryDate: '2025-01-09T13:00:00Z',
    deliveryAddress: '567 Business Ave, New York, NY 10001',
    notes: 'Mixed colors preferred - red, yellow, and green peppers.',
  },
  {
    id: 'ORD005',
    orderNumber: 'AGR-2025-005',
    buyer: {
      id: 'USR005',
      name: 'David Thompson',
      email: 'david@example.com',
      phone: '+1 (555) 567-8901',
      avatar: '/avatars/david.jpg',
    },
    farmer: {
      id: 'USR004',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
      avatar: '/avatars/emily.jpg',
    },
    items: [
      {
        id: 'ITEM007',
        name: 'Fresh Avocados',
        quantity: 20,
        unit: 'kg',
        price: 12.0,
        total: 240.0,
        image: '/products/avocados.jpg',
      },
    ],
    status: 'cancelled',
    paymentStatus: 'refunded',
    totalAmount: 240.0,
    orderDate: '2025-01-04T16:30:00Z',
    deliveryAddress: '456 Market St, Portland, OR 97201',
    notes: 'Cancelled due to quality issues.',
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Delete confirmation modal state
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === 'all' || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const inTransit = orders.filter(o => o.status === 'in_transit').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      total,
      pending,
      confirmed,
      inTransit,
      delivered,
      cancelled,
      totalRevenue,
    };
  }, [orders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'confirmed':
        return <FiCheck className="w-4 h-4" />;
      case 'in_transit':
        return <FiTruck className="w-4 h-4" />;
      case 'delivered':
        return <FiPackage className="w-4 h-4" />;
      case 'cancelled':
        return <FiX className="w-4 h-4" />;
      default:
        return <FiAlertCircle className="w-4 h-4" />;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  // const handleEditOrder = (order: Order) => {
  //   setSelectedOrder(order)
  //   setEditForm({ ...order })
  //   setIsEditModalOpen(true)
  // }

  const handleSaveEdit = () => {
    if (editForm) {
      setOrders(prev =>
        prev.map(order => (order.id === editForm.id ? editForm : order))
      );
      setIsEditModalOpen(false);
      setEditForm(null);
      setSelectedOrder(null);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  function handleSaveChanges(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    handleSaveEdit();
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
            Orders Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage all orders, deliveries, and payments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FiDownload className="w-4 h-4" />
            Export Orders
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.confirmed}
              </p>
            </div>
            <FiCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.inTransit}
              </p>
            </div>
            <FiTruck className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.delivered}
              </p>
            </div>
            <FiPackage className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.cancelled}
              </p>
            </div>
            <FiX className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Payments</option>
            <option value="pending">Payment Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
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
              {currentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      {order.trackingNumber && (
                        <div className="text-xs text-gray-500">
                          Track: {order.trackingNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3 relative">
                        <Image
                          src={order.buyer.avatar || '/default-avatar.jpg'}
                          alt={order.buyer.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.buyer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.buyer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3 relative">
                        <Image
                          src={order.farmer.avatar || '/default-avatar.jpg'}
                          alt={order.farmer.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.farmer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.farmer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.length} item
                      {order.items.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items[0].name}
                      {order.items.length > 1 &&
                        ` +${order.items.length - 1} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Order"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {/* <button 
                        onClick={() => handleEditOrder(order)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit Order"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button> */}
                      <button
                        onClick={() => {
                          setDeleteOrderId(order.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Order"
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

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <div>
            <span className="text-sm text-gray-600">More</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>
                {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of{' '}
                {filteredOrders.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Details - {selectedOrder.orderNumber}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.replace('_', ' ')}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(selectedOrder.paymentStatus)}`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
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

            {/* Modal Body */}
            <div className="p-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Buyer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FiUser className="w-5 h-5" />
                    Buyer Information
                  </h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 relative">
                      <Image
                        src={
                          selectedOrder.buyer.avatar || '/default-avatar.jpg'
                        }
                        alt={selectedOrder.buyer.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedOrder.buyer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedOrder.buyer.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedOrder.buyer.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Farmer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FiPackage className="w-5 h-5" />
                    Farmer Information
                  </h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 relative">
                      <Image
                        src={
                          selectedOrder.farmer.avatar || '/default-avatar.jpg'
                        }
                        alt={selectedOrder.farmer.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedOrder.farmer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedOrder.farmer.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedOrder.farmer.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 relative">
                          <Image
                            src={item.image || '/default-product.jpg'}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.quantity} {item.unit} ×{' '}
                            {formatCurrency(item.price)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-medium text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Order Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Order Number</div>
                      <div className="font-medium text-gray-900">
                        {selectedOrder.orderNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Order Date</div>
                      <div className="font-medium text-gray-900">
                        {formatDateTime(selectedOrder.orderDate)}
                      </div>
                    </div>
                    {selectedOrder.deliveryDate && (
                      <div>
                        <div className="text-sm text-gray-600">
                          Delivery Date
                        </div>
                        <div className="font-medium text-gray-900">
                          {formatDateTime(selectedOrder.deliveryDate)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Delivery Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">
                        Delivery Address
                      </div>
                      <div className="font-medium text-gray-900">
                        {selectedOrder.deliveryAddress}
                      </div>
                    </div>
                    {selectedOrder.notes && (
                      <div>
                        <div className="text-sm text-gray-600">Notes</div>
                        <div className="font-medium text-gray-900">
                          {selectedOrder.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                {/* <button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEditOrder(selectedOrder)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Order
                </button> */}

                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'confirmed');
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FiCheck className="w-4 h-4" />
                    Confirm Order
                  </button>
                )}

                {selectedOrder.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'in_transit');
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <FiTruck className="w-4 h-4" />
                    Mark In Transit
                  </button>
                )}

                {selectedOrder.status === 'in_transit' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'delivered');
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FiPackage className="w-4 h-4" />
                    Mark Delivered
                  </button>
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

      {/* Edit Order Modal */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Order: {editForm.orderNumber}
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={e =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as Order['status'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editForm.paymentStatus}
                    onChange={e =>
                      setEditForm({
                        ...editForm,
                        paymentStatus: e.target.value as Order['paymentStatus'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      editForm.deliveryDate
                        ? new Date(editForm.deliveryDate)
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={e =>
                      setEditForm({
                        ...editForm,
                        deliveryDate: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={editForm.trackingNumber || ''}
                    onChange={e =>
                      setEditForm({
                        ...editForm,
                        trackingNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter tracking number"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  value={editForm.deliveryAddress}
                  onChange={e =>
                    setEditForm({
                      ...editForm,
                      deliveryAddress: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editForm.notes || ''}
                  onChange={e =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any special instructions or notes..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteOrderId) {
                    handleDeleteOrder(deleteOrderId);
                  }
                  setIsDeleteModalOpen(false);
                  setDeleteOrderId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
