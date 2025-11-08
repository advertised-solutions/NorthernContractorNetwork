'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit, QueryConstraint, doc, getDoc, getDocFromCache } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from '@/types';

interface UseRealtimeMessagesOptions {
  conversationId: string;
  limitCount?: number;
}

// Helper function to get document with offline fallback
async function getDocWithCache(docRef: ReturnType<typeof doc>) {
  try {
    // Try cache first when offline
    return await getDocFromCache(docRef);
  } catch (cacheError: any) {
    // If not in cache, try server
    try {
      return await getDoc(docRef);
    } catch (serverError: any) {
      // If both fail and we're offline, return null
      if (serverError.code === 'unavailable' || serverError.message?.includes('offline')) {
        console.warn('Document not available offline:', serverError);
        return null;
      }
      throw serverError;
    }
  }
}

export function useRealtimeMessages({ conversationId, limitCount = 50 }: UseRealtimeMessagesOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db || !conversationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const constraints: QueryConstraint[] = [
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    ];

    const messagesQuery = query(collection(db, 'messages'), ...constraints);

    const unsubscribe = onSnapshot(
      messagesQuery,
      {
        // Include metadata changes to handle offline scenarios
        includeMetadataChanges: true,
      },
      async (snapshot) => {
        try {
          // Check if data is from cache (offline)
          const isFromCache = snapshot.metadata.fromCache;
          
          const messagesData: Message[] = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const data = docSnapshot.data();
              
              // Fetch user data for each message
              let userName: string | undefined;
              let userPhoto: string | undefined;
              
              try {
                const userDocRef = doc(db, 'users', data.senderId);
                const userDoc = await getDocWithCache(userDocRef);
                if (userDoc && userDoc.exists()) {
                  const userData = userDoc.data();
                  userName = userData?.displayName;
                  userPhoto = userData?.photoURL;
                }
              } catch (err: any) {
                // Silently handle offline errors - user data is optional
                if (err.code !== 'unavailable' && !err.message?.includes('offline')) {
                  console.error('Error fetching user data:', err);
                }
              }
              
              return {
                id: docSnapshot.id,
                conversationId: data.conversationId,
                senderId: data.senderId,
                senderName: userName,
                senderPhoto: userPhoto,
                content: data.content,
                read: data.read || false,
                createdAt: data.createdAt?.toDate() || new Date(),
              } as Message;
            })
          );

          // Reverse to show oldest first
          setMessages(messagesData.reverse());
          setLoading(false);
          
          // Log if using cached data
          if (isFromCache) {
            console.log('Using cached messages data (offline mode)');
          }
        } catch (err) {
          // Only set error if it's not an offline error
          const error = err as any;
          if (error.code !== 'unavailable' && !error.message?.includes('offline')) {
            setError(error);
          }
          setLoading(false);
        }
      },
      (err) => {
        // Handle offline errors gracefully
        const error = err as any;
        if (error.code === 'unavailable' || error.message?.includes('offline')) {
          console.warn('Firestore is offline, using cached data if available');
          // Don't set error state for offline - let cached data show
          setLoading(false);
        } else {
          console.error('Error in messages snapshot:', err);
          setError(err as Error);
          setLoading(false);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, limitCount]);

  return { messages, loading, error };
}

