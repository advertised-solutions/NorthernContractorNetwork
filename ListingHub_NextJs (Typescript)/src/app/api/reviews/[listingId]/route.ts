import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { Review, PaginatedResponse } from '@/types';

// GET /api/reviews/[listingId] - Get reviews for a listing
export async function GET(
  request: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    const listingId = params.listingId;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const lastDocId = searchParams.get('lastDocId');
    
    let query = adminDb.collection('reviews').where('listingId', '==', listingId);
    
    // Pagination
    if (lastDocId) {
      const lastDoc = await adminDb.collection('reviews').doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc) as any;
      }
    }
    
    query = query.orderBy('createdAt', 'desc').limit(limit) as any;
    
    const snapshot = await query.get();
    
    // Fetch user data for each review
    const reviews = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userDoc = await adminDb.collection('users').doc(data.userId).get();
        const userData = userDoc.data();
        
        return {
          id: doc.id,
          listingId: data.listingId,
          userId: data.userId,
          userName: userData?.displayName,
          userPhoto: userData?.photoURL,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          helpful: data.helpful || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Review;
      })
    );
    
    const response: PaginatedResponse<Review> = {
      data: reviews,
      pagination: {
        page: 1,
        limit,
        total: reviews.length,
        hasMore: snapshot.docs.length === limit,
        lastDocId: snapshot.docs[snapshot.docs.length - 1]?.id,
      },
    };
    
    return successResponse(response);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return errorResponse('Failed to fetch reviews', 500);
  }
}

