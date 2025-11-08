'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notification } from '@/types';
import { useAuth } from './useAuth';

interface UseRealtimeNotificationsOptions {
  limitCount?: number;
  unreadOnly?: boolean;
}

export function useRealtimeNotifications({ 
  limitCount = 50, 
  unreadOnly = false 
}: UseRealtimeNotificationsOptions = {}) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db || !currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    // If unreadOnly, we'd need to add another where clause, but Firestore doesn't support
    // multiple where clauses on different fields easily, so we filter client-side
    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        try {
          const allNotifications: Notification[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              userId: data.userId,
              type: data.type,
              title: data.title,
              message: data.message,
              read: data.read || false,
              link: data.link,
              metadata: data.metadata,
              createdAt: data.createdAt?.toDate() || new Date(),
            } as Notification;
          });

          const filteredNotifications = unreadOnly 
            ? allNotifications.filter(n => !n.read)
            : allNotifications;

          const unread = allNotifications.filter(n => !n.read).length;

          setNotifications(filteredNotifications);
          setUnreadCount(unread);
          setLoading(false);
        } catch (err) {
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in notifications snapshot:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser, limitCount, unreadOnly]);

  return { notifications, unreadCount, loading, error };
}

