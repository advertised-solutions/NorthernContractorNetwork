import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse, validateRequestBody } from '@/lib/api-helpers';
import { Review } from '@/types';

// GET /api/reviews - Get reviews by userId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return errorResponse('userId parameter is required', 400);
    }

    const snapshot = await adminDb
      .collection('reviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });

    return successResponse({ data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return errorResponse('Failed to fetch reviews', 500);
  }
}

// POST /api/reviews - Create a review (with verification)
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
    
    const listingData = listingDoc.data()!;
    const contractorId = listingData.userId;
    
    // Check if user already reviewed this listing
    const existingReviews = await adminDb
      .collection('reviews')
      .where('listingId', '==', body.listingId)
      .where('userId', '==', uid)
      .get();
    
    if (!existingReviews.empty) {
      return errorResponse('You have already reviewed this listing', 400);
    }
    
    // Verify if user has a completed booking or accepted job with this contractor
    let verified = false;
    let relatedBookingId = null;
    let relatedJobId = null;
    
    // Check for completed booking
    const completedBookings = await adminDb
      .collection('bookings')
      .where('listingId', '==', body.listingId)
      .where('userId', '==', uid)
      .where('status', '==', 'completed')
      .limit(1)
      .get();
    
    if (!completedBookings.empty) {
      verified = true;
      relatedBookingId = completedBookings.docs[0].id;
    }
    
    // Check for completed job (where contractor was hired)
    if (!verified) {
      const userJobs = await adminDb
        .collection('jobs')
        .where('userId', '==', uid)
        .where('status', '==', 'completed')
        .get();
      
      for (const jobDoc of userJobs.docs) {
        const acceptedQuote = await adminDb
          .collection('quotes')
          .where('jobId', '==', jobDoc.id)
          .where('contractorId', '==', contractorId)
          .where('status', '==', 'accepted')
          .limit(1)
          .get();
        
        if (!acceptedQuote.empty) {
          verified = true;
          relatedJobId = jobDoc.id;
          break;
        }
      }
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
        helpfulCount: 0,
        verified,
        bookingId: relatedBookingId,
        jobId: relatedJobId,
        photos: body.photos || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      transaction.set(reviewRef, reviewData);
      
      // Update listing rating
      const listingRef = adminDb.collection('listings').doc(body.listingId);
      const currentReviewCount = listingData.reviewCount || 0;
      const currentRating = listingData.ratingValue || 0;
      const newReviewCount = currentReviewCount + 1;
      const newRating = (currentRating * currentReviewCount + body.rating) / newReviewCount;
      
      transaction.update(listingRef, {
        reviewCount: newReviewCount,
        ratingValue: newRating,
        updatedAt: new Date(),
      });
      
      // Create notification for contractor
      const notificationRef = adminDb.collection('notifications').doc();
      transaction.set(notificationRef, {
        userId: contractorId,
        type: 'review',
        title: 'New Review Received',
        message: `You received a ${body.rating}-star ${verified ? 'verified ' : ''}review`,
        read: false,
        link: `/single-listing-01/${body.listingId}`,
        metadata: { reviewId: reviewRef.id, listingId: body.listingId },
        createdAt: new Date(),
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
      helpfulCount: 0,
      verified,
      bookingId: relatedBookingId || undefined,
      jobId: relatedJobId || undefined,
      photos: body.photos || [],
      createdAt: result.reviewData.createdAt,
      updatedAt: result.reviewData.updatedAt,
    };
    
    return successResponse(review, `${verified ? 'Verified review' : 'Review'} created successfully`);
  } catch (error) {
    console.error('Error creating review:', error);
    return errorResponse('Failed to create review', 500);
  }
}

