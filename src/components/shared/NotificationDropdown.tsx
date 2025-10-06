// components/NotificationDropdown.tsx
'use client';
import {
  FiBell,
  FiX,
  FiClock,
  FiRefreshCw,
  FiInfo,
  FiAlertTriangle,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from '@/services/notificationService';
import { usePathname } from 'next/navigation';

interface NotificationDropdownProps {
  className?: string;
  bellIconClassName?: string;
  onUnreadCountChange?: (count: number) => void;
  showBadge?: boolean;
}

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return 'Just now';
};

// Get priority styling
const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return {
        dot: 'bg-red-500',
        text: 'text-red-600',
        bg: 'bg-red-50',
      };
    case 'high':
      return {
        dot: 'bg-orange-500',
        text: 'text-orange-600',
        bg: 'bg-orange-50',
      };
    case 'medium':
      return {
        dot: 'bg-blue-500',
        text: 'text-blue-600',
        bg: 'bg-blue-50',
      };
    default:
      return {
        dot: 'bg-gray-400',
        text: 'text-gray-600',
        bg: 'bg-gray-50',
      };
  }
};

// Get notification type icon
const getNotificationTypeIcon = (notificationType: string) => {
  switch (notificationType) {
    case 'success':
      return <FiCheckCircle className="w-5 h-5 text-green-500" />;
    case 'warning':
      return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'error':
      return <FiAlertCircle className="w-5 h-5 text-red-500" />;
    case 'info':
    default:
      return <FiInfo className="w-5 h-5 text-blue-500" />;
  }
};

// Get notification module icon
const getModuleEmoji = (moduleName: string) => {
  const icons: Record<string, string> = {
    interview: '👥',
    profile: '👤',
    application: '📝',
    system: '⚙️',
    message: '💬',
    alert: '🔔',
    default: '📌',
  };
  return icons[moduleName.toLowerCase()] || icons.default;
};

export default function NotificationDropdown({
  className = '',
  bellIconClassName = 'w-5 h-5',
  onUnreadCountChange,
  showBadge = true,
}: NotificationDropdownProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Notify parent component when unread count changes
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Load notifications when dropdown opens
  const loadNotifications = useCallback(
    async (pageNum: number = 0, append: boolean = false) => {
      setNotificationsLoading(true);
      try {
        const response = await getNotifications({
          limit: 20,
          offset: pageNum * 20,
        });

        if (append) {
          setNotifications(prev => [...prev, ...response.notifications]);
        } else {
          setNotifications(response.notifications);
        }

        setHasMore(response.hasMore);
        setTotalCount(response.total);
        setPage(pageNum);

        // Update unread count based on actual data
        const unreadNotifications = response.notifications.filter(
          n => !n.isRead
        );
        if (!append) {
          setUnreadCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setNotificationsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (showNotifications && notifications.length === 0) {
      loadNotifications(0);
    }
  }, [showNotifications, notifications.length, loadNotifications]);

  // Load unread notifications count
  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  // Handle notification bell click
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Mark notification as read
  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    try {
      await markNotificationAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Load more notifications
  const handleLoadMore = () => {
    if (!notificationsLoading && hasMore) {
      loadNotifications(page + 1, true);
    }
  };

  // Handle notification click with action URL
  const handleNotificationAction = (notification: Notification) => {
    handleMarkAsRead(notification);
    // if (notification.actionUrl) {
    //   window.location.href = notification.actionUrl;
    // }
  };

  // Refresh notifications
  const handleRefresh = () => {
    setPage(0);
    loadNotifications(0);
    loadUnreadCount();
  };

  // Get user display name
  const getUserDisplayName = (notification: Notification) => {
    const { user } = notification;
    if (user.fullName) return user.fullName;
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  };

  const isEngineerLandingPage = pathname === '/engineer';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={handleNotificationClick}
        className="group relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <FiBell
          className={`${isEngineerLandingPage ? 'text-white group-hover:text-black' : 'text-gray-700 group-hover:text-gray-900'} ${bellIconClassName} transition-colors`}
        />
        {showBadge && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-xs text-white font-medium bg-red-500">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div
          className="absolute right-0 top-full mt-2 w-[420px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col"
          style={{ maxHeight: '520px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={handleRefresh}
                className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                title="Refresh"
              >
                <FiRefreshCw
                  className={`w-4 h-4 text-gray-500 ${notificationsLoading ? 'animate-spin' : ''}`}
                />
              </button>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded hover:bg-gray-100 cursor-pointer"
              >
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notificationsLoading && notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-gray-500">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FiBell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-900">
                  No notifications
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              <>
                {notifications.map(notification => {
                  const priorityStyle = getPriorityStyle(notification.priority);
                  const moduleEmoji = getModuleEmoji(notification.moduleName);

                  return (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                        !notification.isRead ? priorityStyle.bg : ''
                      }`}
                      onClick={() => handleNotificationAction(notification)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 flex items-start gap-1 mt-0.5">
                          <span className="text-xl">{moduleEmoji}</span>
                          {getNotificationTypeIcon(
                            notification.notificationType
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Notification Text */}
                          <p
                            className={`text-sm text-gray-900 ${!notification.isRead ? 'font-semibold' : ''}`}
                          >
                            {notification.notificationText}
                          </p>

                          {/* User Info */}
                          {notification.user && (
                            <div className="flex items-center gap-2 mt-1">
                              {notification.user.profilePic && (
                                <Image
                                  src={notification.user.profilePic}
                                  alt={getUserDisplayName(notification)}
                                  width={20}
                                  height={20}
                                  className="rounded-full object-cover"
                                />
                              )}
                              <span className="text-xs text-gray-500">
                                {getUserDisplayName(notification)}
                              </span>
                            </div>
                          )}

                          {/* Metadata */}
                          {notification.metadata &&
                            Object.keys(notification.metadata).length > 0 && (
                              <div className="mt-1">
                                <span className="text-xs text-gray-500">
                                  {JSON.stringify(notification.metadata)}
                                </span>
                              </div>
                            )}

                          {/* Footer */}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <FiClock className="w-3 h-3" />
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {notification.moduleName}
                            </span>
                            {(notification.priority === 'urgent' ||
                              notification.priority === 'high') && (
                              <span
                                className={`text-xs font-medium ${priorityStyle.text}`}
                              >
                                {notification.priority}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unread indicator dot */}
                        {!notification.isRead && (
                          <div
                            className={`w-2 h-2 rounded-full ${priorityStyle.dot} flex-shrink-0 mt-2`}
                          ></div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Load More */}
                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={notificationsLoading}
                    className="w-full py-3 text-sm text-blue-600 hover:text-blue-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {notificationsLoading ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Footer with total count */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Showing {notifications.length} of {totalCount} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
