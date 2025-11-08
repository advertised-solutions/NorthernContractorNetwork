import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface ContractorStatus {
  hasListing: boolean;
  listingId: string | null;
  loading: boolean;
}

// Cache to avoid repeated API calls
const listingCache = new Map<string, { hasListing: boolean; listingId: string | null; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Hook to check if a contractor has completed onboarding (has a listing)
 */
export function useContractorCheck(): ContractorStatus {
  const { user } = useAuth();
  const [status, setStatus] = useState<ContractorStatus>({
    hasListing: false,
    listingId: null,
    loading: true,
  });

  useEffect(() => {
    const checkListing = async () => {
      if (!user || user.userType !== 'contractor') {
        setStatus({ hasListing: false, listingId: null, loading: false });
        return;
      }

      // Check cache first
      const cached = listingCache.get(user.id);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        setStatus({
          hasListing: cached.hasListing,
          listingId: cached.listingId,
          loading: false,
        });
        return;
      }

      try {
        const response = await fetch(`/api/listings?userId=${user.id}&limit=1`);
        const data = await response.json();
        
        const hasListing = data.data && data.data.length > 0;
        const listingId = hasListing ? data.data[0].id : null;
        
        // Update cache
        listingCache.set(user.id, {
          hasListing,
          listingId,
          timestamp: now,
        });
        
        setStatus({
          hasListing,
          listingId,
          loading: false,
        });
      } catch (error) {
        console.error('Error checking contractor listing:', error);
        setStatus({ hasListing: false, listingId: null, loading: false });
      }
    };

    checkListing();
  }, [user]);

  return status;
}

/**
 * Clear the listing cache (call after creating a new listing)
 */
export function clearListingCache(userId?: string) {
  if (userId) {
    listingCache.delete(userId);
  } else {
    listingCache.clear();
  }
}

