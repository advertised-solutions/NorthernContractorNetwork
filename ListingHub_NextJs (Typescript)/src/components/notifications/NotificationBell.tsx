'use client';

import React, { useState } from 'react';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function NotificationBell() {
  const { notifications, unreadCount } = useRealtimeNotifications({ limitCount: 10 });
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="position-relative">
      <button
        className="btn btn-link position-relative"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <i className="fa-regular fa-bell fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1040 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="position-absolute end-0 mt-2 bg-white rounded shadow-lg"
            style={{ width: '350px', maxHeight: '500px', zIndex: 1050 }}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h6 className="mb-0">Notifications</h6>
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm btn-link text-primary p-0"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              {notifications.length === 0 ? (
                <div className="p-3 text-center text-muted">
                  <p className="mb-0">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id);
                      }
                      setIsOpen(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {notification.link ? (
                      <Link href={notification.link} className="text-decoration-none text-dark">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{notification.title}</h6>
                            <p className="mb-0 text-muted small">{notification.message}</p>
                            <small className="text-muted">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          {!notification.read && (
                            <span className="badge bg-primary rounded-pill ms-2">New</span>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{notification.title}</h6>
                            <p className="mb-0 text-muted small">{notification.message}</p>
                            <small className="text-muted">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          {!notification.read && (
                            <span className="badge bg-primary rounded-pill ms-2">New</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-top text-center">
                <Link href="/dashboard-messages" className="text-primary text-decoration-none">
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

