'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Listing } from '@/types';

interface UseRealtimeListingsOptions {
  categoryId?: string;
  city?: string;
  state?: string;
  featured?: boolean;
  userId?: string;
  limitCount?: number;
}

export function useRealtimeListings(options: UseRealtimeListingsOptions = {}) {
  const { categoryId, city, state, featured, userId, limitCount = 20 } = options;
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const constraints: QueryConstraint[] = [];

    if (categoryId) {
      constraints.push(where('categoryId', '==', categoryId));
    }
    if (city) {
      constraints.push(where('city', '==', city));
    }
    if (state) {
      constraints.push(where('state', '==', state));
    }
    if (featured) {
      constraints.push(where('featured', '==', true));
    }
    if (userId) {
      constraints.push(where('userId', '==', userId));
    }

    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(limitCount));

    const listingsQuery = query(collection(db, 'listings'), ...constraints);

    const unsubscribe = onSnapshot(
      listingsQuery,
      (snapshot) => {
        try {
          const listingsData: Listing[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              userId: data.userId,
              title: data.title,
              description: data.description,
              categoryId: data.categoryId,
              categoryName: data.categoryName,
              status: data.status,
              featured: data.featured || false,
              address: data.address,
              city: data.city,
              state: data.state,
              zipCode: data.zipCode,
              country: data.country,
              latitude: data.latitude,
              longitude: data.longitude,
              phoneNumber: data.phoneNumber,
              email: data.email,
              website: data.website,
              image: data.image,
              gallery: data.gallery,
              rating: data.rating,
              ratingValue: data.ratingValue,
              reviewCount: data.reviewCount || 0,
              instantBooking: data.instantBooking || false,
              tags: data.tags,
              views: data.views || 0,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              expiresAt: data.expiresAt?.toDate(),
            } as Listing;
          });

          setListings(listingsData);
          setLoading(false);
        } catch (err) {
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in listings snapshot:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [categoryId, city, state, featured, userId, limitCount]);

  return { listings, loading, error };
}

