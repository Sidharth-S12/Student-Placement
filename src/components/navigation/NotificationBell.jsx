import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  Send,
  Calendar,
  Award,
  Video,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../../services/applicationService';

export const NotificationBell = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    setIsOpen(false);

    if (onNavigate) {
      if (notif.type === 'nomination') {
        onNavigate('nominations');
      } else if (notif.type === 'application' || notif.type === 'interview' || notif.type === 'outcome') {
        onNavigate('applications');
      } else {
        onNavigate('jobs');
      }
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'nomination':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'interview':
        return <Video className="w-4 h-4 text-indigo-400" />;
      case 'outcome':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'application':
      default:
        return <Send className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadNotifications();
        }}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono font-bold text-[9px] flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in text-slate-100 flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-brand-400 hover:text-brand-300 font-medium flex items-center space-x-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 scrollbar-thin">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full p-3.5 text-left flex items-start space-x-3 transition-colors ${
                    !notif.read ? 'bg-slate-850/80 hover:bg-slate-800' : 'hover:bg-slate-850/40'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/80 flex-shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          !notif.read ? 'font-bold text-white' : 'font-medium text-slate-300'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-500 block pt-0.5">
                      {new Date(notif.createdAt).toLocaleDateString()} at{' '}
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                <Bell className="w-6 h-6 mx-auto text-slate-600" />
                <p>No notifications yet</p>
                <p className="text-[10px] text-slate-600">
                  You'll be notified when nominated by placement officers or when your application status advances.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
