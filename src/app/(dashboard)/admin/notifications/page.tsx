'use client';

import React, { useState, useMemo } from 'react';
import {
  FiBell,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiMessageSquare,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSearch,
  FiTrash2,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiMail,
  FiTrendingUp,
  FiShield,
} from 'react-icons/fi';

// Sample notifications data
const notificationsData = [
  {
    id: 'N001',
    type: 'user',
    priority: 'high',
    title: 'New User Registration',
    message: 'John Doe has registered as a farmer and is pending approval.',
    timestamp: '2025-01-07T14:30:00Z',
    read: false,
    actionRequired: true,
    category: 'user_management',
    relatedUser: 'John Doe',
    relatedEmail: 'john@example.com',
  },
  {
    id: 'N002',
    type: 'system',
    priority: 'critical',
    title: 'System Alert',
    message:
      'Database connection is running slow. Performance may be affected.',
    timestamp: '2025-01-07T14:15:00Z',
    read: false,
    actionRequired: true,
    category: 'system_health',
  },
  {
    id: 'N003',
    type: 'order',
    priority: 'medium',
    title: 'High Value Order',
    message: 'Order #ORD-003 worth $2,500 has been placed and requires review.',
    timestamp: '2025-01-07T13:45:00Z',
    read: true,
    actionRequired: false,
    category: 'orders',
    relatedOrder: 'ORD-003',
  },
  {
    id: 'N004',
    type: 'product',
    priority: 'low',
    title: 'Product Approval',
    message: '5 new products are waiting for approval in the pending queue.',
    timestamp: '2025-01-07T12:30:00Z',
    read: false,
    actionRequired: true,
    category: 'product_management',
  },
  {
    id: 'N005',
    type: 'security',
    priority: 'high',
    title: 'Failed Login Attempts',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100.',
    timestamp: '2025-01-07T11:15:00Z',
    read: true,
    actionRequired: false,
    category: 'security',
  },
  {
    id: 'N006',
    type: 'message',
    priority: 'medium',
    title: 'Support Message',
    message: 'A farmer has sent a support message regarding payment issues.',
    timestamp: '2025-01-07T10:00:00Z',
    read: false,
    actionRequired: true,
    category: 'support',
    relatedUser: 'Mike Johnson',
  },
  {
    id: 'N007',
    type: 'system',
    priority: 'low',
    title: 'Backup Completed',
    message: 'Daily database backup completed successfully at 3:00 AM.',
    timestamp: '2025-01-07T03:00:00Z',
    read: true,
    actionRequired: false,
    category: 'system_maintenance',
  },
  {
    id: 'N008',
    type: 'revenue',
    priority: 'medium',
    title: 'Revenue Milestone',
    message: 'Platform revenue has reached $50,000 this month!',
    timestamp: '2025-01-06T18:00:00Z',
    read: false,
    actionRequired: false,
    category: 'analytics',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === 'all' || notification.type === typeFilter;
      const matchesPriority =
        priorityFilter === 'all' || notification.priority === priorityFilter;
      const matchesRead =
        readFilter === 'all' ||
        (readFilter === 'read' && notification.read) ||
        (readFilter === 'unread' && !notification.read);

      return matchesSearch && matchesType && matchesPriority && matchesRead;
    });
  }, [notifications, searchTerm, typeFilter, priorityFilter, readFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    endIndex
  );

  // Statistics
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const actionRequired = notifications.filter(n => n.actionRequired).length;
    const critical = notifications.filter(
      n => n.priority === 'critical'
    ).length;

    return { total, unread, actionRequired, critical };
  }, [notifications]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <FiUsers className="w-5 h-5" />;
      case 'system':
        return <FiSettings className="w-5 h-5" />;
      case 'order':
        return <FiShoppingCart className="w-5 h-5" />;
      case 'product':
        return <FiPackage className="w-5 h-5" />;
      case 'security':
        return <FiShield className="w-5 h-5" />;
      case 'message':
        return <FiMessageSquare className="w-5 h-5" />;
      case 'revenue':
        return <FiTrendingUp className="w-5 h-5" />;
      default:
        return <FiBell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'text-blue-600 bg-blue-50';
      case 'system':
        return 'text-gray-600 bg-gray-50';
      case 'order':
        return 'text-green-600 bg-green-50';
      case 'product':
        return 'text-purple-600 bg-purple-50';
      case 'security':
        return 'text-red-600 bg-red-50';
      case 'message':
        return 'text-orange-600 bg-orange-50';
      case 'revenue':
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: false } : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleBulkAction = (action: string) => {
    if (action === 'mark_read') {
      setNotifications(prev =>
        prev.map(notification =>
          selectedNotifications.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      );
    } else if (action === 'delete') {
      setNotifications(prev =>
        prev.filter(
          notification => !selectedNotifications.includes(notification.id)
        )
      );
    }
    setSelectedNotifications([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            System alerts and important updates
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiCheckCircle className="w-4 h-4" />
            Mark All Read
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
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiBell className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
            </div>
            <FiMail className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Action Required</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.actionRequired}
              </p>
            </div>
            <FiAlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.critical}
              </p>
            </div>
            <FiXCircle className="w-8 h-8 text-red-600" />
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
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white pr-8"
            >
              <option value="all">All Types</option>
              <option value="user">User</option>
              <option value="system">System</option>
              <option value="order">Order</option>
              <option value="product">Product</option>
              <option value="security">Security</option>
              <option value="message">Message</option>
              <option value="revenue">Revenue</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
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

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white pr-8"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
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

          <div className="relative">
            <select
              value={readFilter}
              onChange={e => setReadFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white pr-8"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
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

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedNotifications.length} notification
              {selectedNotifications.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('mark_read')}
                className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-700 transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {currentNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedNotifications([
                        ...selectedNotifications,
                        notification.id,
                      ]);
                    } else {
                      setSelectedNotifications(
                        selectedNotifications.filter(
                          id => id !== notification.id
                        )
                      );
                    }
                  }}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />

                <div
                  className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}
                >
                  {getTypeIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}
                        >
                          {notification.title}
                        </h3>
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </span>
                        {notification.actionRequired && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Action Required
                          </span>
                        )}
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.relatedUser && (
                          <span>User: {notification.relatedUser}</span>
                        )}
                        {notification.relatedOrder && (
                          <span>Order: {notification.relatedOrder}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-4">
                      <button
                        onClick={() =>
                          notification.read
                            ? handleMarkAsUnread(notification.id)
                            : handleMarkAsRead(notification.id)
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title={
                          notification.read ? 'Mark as unread' : 'Mark as read'
                        }
                      >
                        {notification.read ? (
                          <FiMail className="w-4 h-4" />
                        ) : (
                          <FiCheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete notification"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
                {startIndex + 1}-
                {Math.min(endIndex, filteredNotifications.length)} of{' '}
                {filteredNotifications.length}
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
    </div>
  );
}
