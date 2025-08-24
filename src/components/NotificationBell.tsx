
import React, { useState } from 'react';
import { Bell, X, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

// This interface defines the "shape" of a notification object
interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  priority: string;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'critical') return <AlertCircle className="h-5 w-5 text-red-600" />;
    if (type === 'donor_match') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (type === 'blood_request') return <AlertCircle className="h-5 w-5 text-orange-500" />;
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* This JSX block uses all your variables and icons, which will fix the warnings */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <div className="flex items-center space-x-3">
              {notifications.length > 0 && unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification: Notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 flex items-start space-x-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{getTimeAgo(notification.createdAt)}</span>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>You have no new notifications.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;