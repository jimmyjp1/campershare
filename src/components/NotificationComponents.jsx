import React, { useState, useEffect, useRef } from 'react';
import { useNotifications, NOTIFICATION_TYPES, NOTIFICATION_PRIORITY } from '../services/notificationService';

// Notification badge component
export const NotificationBadge = ({ count, className = '' }) => {
  if (count === 0) return null;
  
  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

// Individual notification item
export const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case NOTIFICATION_TYPES.BOOKING_CONFIRMED:
        return (
          <svg className={`${iconClass} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case NOTIFICATION_TYPES.PAYMENT_SUCCESSFUL:
        return (
          <svg className={`${iconClass} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case NOTIFICATION_TYPES.REMINDER_PICKUP:
      case NOTIFICATION_TYPES.REMINDER_RETURN:
        return (
          <svg className={`${iconClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case NOTIFICATION_TYPES.MESSAGE_RECEIVED:
        return (
          <svg className={`${iconClass} text-purple-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case NOTIFICATION_TYPES.REVIEW_REQUEST:
        return (
          <svg className={`${iconClass} text-yellow-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case NOTIFICATION_TYPES.PROMOTION:
        return (
          <svg className={`${iconClass} text-pink-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClass} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case NOTIFICATION_PRIORITY.URGENT:
        return 'border-l-4 border-red-500';
      case NOTIFICATION_PRIORITY.HIGH:
        return 'border-l-4 border-orange-500';
      case NOTIFICATION_PRIORITY.MEDIUM:
        return 'border-l-4 border-blue-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  return (
    <div
      className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.read ? 'bg-blue-50' : 'bg-white'
      } ${getPriorityBorder(notification.priority)}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {formatTimestamp(notification.timestamp)}
              </span>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
          
          <p className={`mt-1 text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'} ${
            !isExpanded && notification.message.length > 100 ? 'line-clamp-2' : ''
          }`}>
            {notification.message}
          </p>
          
          {notification.message.length > 100 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-1 text-xs text-blue-600 hover:text-blue-700"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
          
          {/* Action buttons */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.(notification);
                  }}
                  className={`px-3 py-1 text-xs rounded-md font-medium ${
                    action.primary
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Delete notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification dropdown panel
export const NotificationPanel = ({ isOpen, onClose, className = '' }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    isConnected
  } = useNotifications();

  const panelRef = useRef(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={`absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <NotificationBadge count={unreadCount} className="ml-2" />
            )}
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={isConnected ? 'Connected' : 'Disconnected'} />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex space-x-1 mt-3">
          {['all', 'unread', 'read'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 text-sm rounded-md capitalize ${
                filter === filterType
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filterType}
              {filterType === 'unread' && unreadCount > 0 && (
                <span className="ml-1 text-xs">({unreadCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Notifications list */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onClick={(notification) => {
                // Handle notification click
                onClose();
              }}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 111 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'read' ? 'No read notifications' : 
               'No notifications'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'All notifications will appear here.' : 
               'Try changing the filter to see more notifications.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <button
          onClick={() => {
            onClose();
            // Navigate to full notifications page
            window.location.href = '/notifications';
          }}
          className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

// Notification bell icon with dropdown
export const NotificationBell = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 111 0z" />
        </svg>
        {unreadCount > 0 && (
          <NotificationBadge 
            count={unreadCount} 
            className="absolute -top-1 -right-1"
          />
        )}
      </button>
      
      <NotificationPanel 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

// Toast notification component
export const NotificationToast = ({ notification, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notification.priority !== NOTIFICATION_PRIORITY.URGENT) {
        handleClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, notification.priority]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getToastStyle = (priority) => {
    switch (priority) {
      case NOTIFICATION_PRIORITY.URGENT:
        return 'bg-red-100 border-red-500 text-red-800';
      case NOTIFICATION_PRIORITY.HIGH:
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case NOTIFICATION_PRIORITY.MEDIUM:
        return 'bg-blue-100 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full p-4 rounded-lg border-l-4 shadow-lg transform transition-all duration-300 z-50 ${
        getToastStyle(notification.priority)
      } ${isRemoving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h4 className="font-medium">{notification.title}</h4>
          <p className="mt-1 text-sm">{notification.message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 text-current opacity-70 hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Container for toast notifications
export const NotificationToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const { notifications } = useNotifications();

  useEffect(() => {
    // Show toast for new high priority notifications
    const latestNotification = notifications[0];
    if (latestNotification && 
        (latestNotification.priority === NOTIFICATION_PRIORITY.HIGH || 
         latestNotification.priority === NOTIFICATION_PRIORITY.URGENT) &&
        !toasts.find(t => t.id === latestNotification.id)) {
      setToasts(prev => [latestNotification, ...prev]);
    }
  }, [notifications, toasts]);

  const removeToast = (notificationId) => {
    setToasts(prev => prev.filter(t => t.id !== notificationId));
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          notification={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
