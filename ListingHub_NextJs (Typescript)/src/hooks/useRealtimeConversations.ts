'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, arrayContains } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Conversation } from '@/types';
import { useAuth } from './useAuth';

export function useRealtimeConversations() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db || !currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      conversationsQuery,
      (snapshot) => {
        try {
          const conversationsData: Conversation[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              participants: data.participants,
              listingId: data.listingId,
              lastMessage: data.lastMessage,
              lastMessageAt: data.lastMessageAt?.toDate(),
              unreadCount: data.unreadCount || {},
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Conversation;
          });

          setConversations(conversationsData);
          setLoading(false);
        } catch (err) {
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in conversations snapshot:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return { conversations, loading, error };
}

