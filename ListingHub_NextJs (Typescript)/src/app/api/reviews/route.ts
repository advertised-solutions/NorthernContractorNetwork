import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse, validateRequestBody } from '@/lib/api-helpers';
import { Review } from '@/types';

// POST /api/reviews - Create a review
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    
    // Validate required fields
    const validation = validateRequestBody<Review>(body, ['listingId', 'rating', 'comment']);
    
    if (!validation.valid) {
      return errorResponse(`Missing required fields: ${validation.missing?.join(', ')}`, 400);
    }
    
    // Check if listing exists
    const listingDoc = await adminDb.collection('listings').doc(body.listingId).get();
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    // Check if user already reviewed this listing
    const existingReviews = await adminDb
      .collection('reviews')
      .where('listingId', '==', body.listingId)
      .where('userId', '==', uid)
      .get();
    
    if (!existingReviews.empty) {
      return errorResponse('You have already reviewed this listing', 400);
    }
    
    // Create review using transaction to update listing rating
    const result = await adminDb.runTransaction(async (transaction) => {
      // Create review
      const reviewRef = adminDb.collection('reviews').doc();
      const reviewData = {
        listingId: body.listingId,
        userId: uid,
        rating: body.rating,
        title: body.title,
        comment: body.comment,
        helpful: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      transaction.set(reviewRef, reviewData);
      
      // Update listing rating
      const listingRef = adminDb.collection('listings').doc(body.listingId);
      const listingData = listingDoc.data()!;
      const currentReviewCount = listingData.reviewCount || 0;
      const currentRating = listingData.ratingValue || 0;
      const newReviewCount = currentReviewCount + 1;
      const newRating = (currentRating * currentReviewCount + body.rating) / newReviewCount;
      
      transaction.update(listingRef, {
        reviewCount: newReviewCount,
        ratingValue: newRating,
        updatedAt: new Date(),
      });
      
      return { reviewRef, reviewData };
    });
    
    // Fetch user data for response
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    const review: Review = {
      id: result.reviewRef.id,
      listingId: result.reviewData.listingId,
      userId: uid,
      userName: userData?.displayName,
      userPhoto: userData?.photoURL,
      rating: result.reviewData.rating,
      title: result.reviewData.title,
      comment: result.reviewData.comment,
      helpful: 0,
      createdAt: result.reviewData.createdAt,
      updatedAt: result.reviewData.updatedAt,
    };
    
    return successResponse(review, 'Review created successfully');
  } catch (error) {
    console.error('Error creating review:', error);
    return errorResponse('Failed to create review', 500);
  }
}

