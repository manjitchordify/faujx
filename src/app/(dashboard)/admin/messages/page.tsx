'use client';

import React, { useState, useMemo } from 'react';
import {
  FiSearch,
  FiEye,
  FiCornerUpLeft,
  FiTrash2,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiUser,
  FiClock,
  FiSend,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiMessageSquare,
} from 'react-icons/fi';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    name: string;
    email: string;
    role: 'farmer' | 'buyer' | 'transporter';
  };
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'support' | 'complaint' | 'inquiry' | 'feedback';
  status: 'pending' | 'replied' | 'resolved';
}

const messagesData: Message[] = [
  {
    id: 'MSG001',
    subject: 'Payment Issue with Order #ORD-123',
    content:
      'I have not received payment for my order delivered last week. Please help resolve this issue.',
    sender: {
      name: 'John Smith',
      email: 'john@example.com',
      role: 'farmer',
    },
    timestamp: '2025-01-07T14:30:00Z',
    read: false,
    priority: 'high',
    category: 'complaint',
    status: 'pending',
  },
  {
    id: 'MSG002',
    subject: 'Question about Product Quality Standards',
    content:
      'Could you please clarify the quality standards required for organic vegetables?',
    sender: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'farmer',
    },
    timestamp: '2025-01-07T13:15:00Z',
    read: true,
    priority: 'medium',
    category: 'inquiry',
    status: 'replied',
  },
  {
    id: 'MSG003',
    subject: 'Great Platform Experience',
    content:
      'I wanted to share my positive experience with AgriLink. The platform has helped me connect with reliable suppliers.',
    sender: {
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'buyer',
    },
    timestamp: '2025-01-07T11:45:00Z',
    read: true,
    priority: 'low',
    category: 'feedback',
    status: 'resolved',
  },
  {
    id: 'MSG004',
    subject: 'Delivery Scheduling Problem',
    content:
      'I am having trouble scheduling deliveries through the platform. The calendar feature seems to be not working properly.',
    sender: {
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      role: 'transporter',
    },
    timestamp: '2025-01-07T10:20:00Z',
    read: false,
    priority: 'medium',
    category: 'support',
    status: 'pending',
  },
  {
    id: 'MSG005',
    subject: 'Account Verification Help',
    content:
      'I need help with verifying my account. I have submitted all required documents but still waiting for approval.',
    sender: {
      name: 'David Thompson',
      email: 'david@example.com',
      role: 'farmer',
    },
    timestamp: '2025-01-07T09:30:00Z',
    read: true,
    priority: 'high',
    category: 'support',
    status: 'replied',
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(messagesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Delete confirmation modal state
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      const matchesSearch =
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || message.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'all' || message.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || message.priority === priorityFilter;
      return (
        matchesSearch && matchesCategory && matchesStatus && matchesPriority
      );
    });
  }, [messages, searchTerm, categoryFilter, statusFilter, priorityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter(m => !m.read).length;
    const pending = messages.filter(m => m.status === 'pending').length;
    const highPriority = messages.filter(m => m.priority === 'high').length;
    return { total, unread, pending, highPriority };
  }, [messages]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'replied':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'support':
        return 'bg-blue-100 text-blue-800';
      case 'complaint':
        return 'bg-red-100 text-red-800';
      case 'inquiry':
        return 'bg-purple-100 text-purple-800';
      case 'feedback':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer':
        return 'bg-green-100 text-green-800';
      case 'buyer':
        return 'bg-blue-100 text-blue-800';
      case 'transporter':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(message =>
        message.id === messageId ? { ...message, read: true } : message
      )
    );
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);
    handleMarkAsRead(message.id);
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
    handleMarkAsRead(message.id);
  };

  const handleSendReply = () => {
    if (selectedMessage && replyContent.trim()) {
      setMessages(prev =>
        prev.map(message =>
          message.id === selectedMessage.id
            ? { ...message, status: 'replied' as const }
            : message
        )
      );
      setIsReplyModalOpen(false);
      setReplyContent('');
      setSelectedMessage(null);
    }
  };

  //  just perform the deletion for message
  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
            Messages
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer support and communications
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
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
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.highPriority}
              </p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-red-600" />
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
              placeholder="Search messages..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Categories</option>
            <option value="support">Support</option>
            <option value="complaint">Complaint</option>
            <option value="inquiry">Inquiry</option>
            <option value="feedback">Feedback</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMessages.map(message => (
                <tr
                  key={message.id}
                  className={`hover:bg-gray-50 ${!message.read ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {!message.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {message.subject}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {message.sender.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {message.sender.email}
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(message.sender.role)}`}
                    >
                      {message.sender.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(message.category)}`}
                    >
                      {message.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(message.priority)}`}
                    >
                      {message.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}
                    >
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewMessage(message)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Message"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReply(message)}
                        className="text-green-600 hover:text-green-900"
                        title="Reply"
                      >
                        <FiCornerUpLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteMessageId(message.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
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
                {startIndex + 1}-{Math.min(endIndex, filteredMessages.length)}{' '}
                of {filteredMessages.length}
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
      {/* View Message Modal */}
      {isViewModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedMessage.priority)}`}
                    >
                      {selectedMessage.priority} priority
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedMessage.category)}`}
                    >
                      {selectedMessage.category}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedMessage.status)}`}
                    >
                      {selectedMessage.status}
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
              {/* Sender Information */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-lg">
                      {selectedMessage.sender.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedMessage.sender.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(selectedMessage.sender.role)}`}
                      >
                        {selectedMessage.sender.role}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(selectedMessage.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Message Content */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Message Content
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.content}
                  </p>
                </div>
              </div>
              {/* Message Details */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Message Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Message ID</div>
                    <div className="font-medium text-gray-900">
                      {selectedMessage.id}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Received</div>
                    <div className="font-medium text-gray-900">
                      {formatTimestamp(selectedMessage.timestamp)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Category</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {selectedMessage.category}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Priority</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {selectedMessage.priority}
                    </div>
                  </div>
                </div>
              </div>
              {/* Read Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {selectedMessage.read ? (
                    <>
                      <FiCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        Message marked as read
                      </span>
                    </>
                  ) : (
                    <>
                      <FiMail className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-600">
                        Message was unread
                      </span>
                    </>
                  )}
                </div>
              </div>
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleReply(selectedMessage);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FiCornerUpLeft className="w-4 h-4" />
                  Reply to Message
                </button>
                {selectedMessage.status === 'pending' && (
                  <button
                    onClick={() => {
                      setMessages(prev =>
                        prev.map(message =>
                          message.id === selectedMessage.id
                            ? { ...message, status: 'replied' as const }
                            : message
                        )
                      );
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FiCheck className="w-4 h-4" />
                    Mark as Replied
                  </button>
                )}
                {selectedMessage.status === 'replied' && (
                  <button
                    onClick={() => {
                      setMessages(prev =>
                        prev.map(message =>
                          message.id === selectedMessage.id
                            ? { ...message, status: 'resolved' as const }
                            : message
                        )
                      );
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <FiCheck className="w-4 h-4" />
                    Mark as Resolved
                  </button>
                )}
                <button
                  onClick={() => {
                    setDeleteMessageId(selectedMessage.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete Message
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reply Modal */}
      {isReplyModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reply to: {selectedMessage.subject}
                </h3>
                <button
                  onClick={() => setIsReplyModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiUser className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">
                    {selectedMessage.sender.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({selectedMessage.sender.email})
                  </span>
                </div>
                <p className="text-gray-700">{selectedMessage.content}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyContent.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <FiSend className="w-4 h-4" />
                  Send Reply
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
              Are you sure you want to delete this message?
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
                  if (deleteMessageId) {
                    handleDelete(deleteMessageId);
                    setIsViewModalOpen(false);
                  }
                  setIsDeleteModalOpen(false);
                  setDeleteMessageId(null);
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
