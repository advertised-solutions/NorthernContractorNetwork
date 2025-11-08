import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { Bookmark, Listing } from '@/types';

// GET /api/bookmarks/user/[userId] - Get user bookmarks
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    if (uid !== userId) {
      return errorResponse('Forbidden: Cannot access another user\'s bookmarks', 403);
    }
    
    const bookmarksSnapshot = await adminDb
      .collection('bookmarks')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    // Fetch listing details for each bookmark
    const bookmarksWithListings = await Promise.all(
      bookmarksSnapshot.docs.map(async (doc) => {
        const bookmarkData = doc.data();
        const listingDoc = await adminDb.collection('listings').doc(bookmarkData.listingId).get();
        const listingData = listingDoc.data();
        
        return {
          bookmark: {
            id: doc.id,
            userId: bookmarkData.userId,
            listingId: bookmarkData.listingId,
            createdAt: bookmarkData.createdAt?.toDate() || new Date(),
          } as Bookmark,
          listing: listingData ? {
            id: listingDoc.id,
            ...listingData,
            createdAt: listingData.createdAt?.toDate() || new Date(),
            updatedAt: listingData.updatedAt?.toDate() || new Date(),
          } as Listing : null,
        };
      })
    );
    
    return successResponse(bookmarksWithListings);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return errorResponse('Failed to fetch bookmarks', 500);
  }
}

