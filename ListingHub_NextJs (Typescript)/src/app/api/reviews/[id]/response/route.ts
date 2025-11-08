import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { ApiResponse } from '@/types';

// POST /api/reviews/[id]/response - Add contractor response to a review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id: reviewId } = params;
    const body = await request.json();
    const { text } = body;
    
    if (!text || text.trim().length === 0) {
      return errorResponse('Response text is required', 400);
    }
    
    // Get the review
    const reviewDoc = await adminDb.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return errorResponse('Review not found', 404);
    }
    
    const reviewData = reviewDoc.data()!;
    
    // Get the listing to verify contractor ownership
    const listingDoc = await adminDb.collection('listings').doc(reviewData.listingId).get();
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    const listingData = listingDoc.data()!;
    
    // Verify that the user is the contractor who owns the listing
    if (listingData.userId !== uid) {
      return errorResponse('Only the contractor can respond to this review', 403);
    }
    
    // Check if contractor already responded
    if (reviewData.response) {
      return errorResponse('You have already responded to this review', 400);
    }
    
    // Add response to review
    const response = {
      text: text.trim(),
      createdAt: new Date(),
    };
    
    await adminDb.collection('reviews').doc(reviewId).update({
      response,
      updatedAt: new Date(),
    });
    
    // Create notification for reviewer
    await adminDb.collection('notifications').add({
      userId: reviewData.userId,
      type: 'review',
      title: 'Contractor Responded to Your Review',
      message: 'The contractor has responded to your review',
      read: false,
      link: `/single-listing-01/${reviewData.listingId}`,
      metadata: { reviewId, listingId: reviewData.listingId },
      createdAt: new Date(),
    });
    
    return successResponse({ response }, 'Response added successfully');
  } catch (error) {
    console.error('Error adding review response:', error);
    return errorResponse('Failed to add response', 500);
  }
}

// PATCH /api/reviews/[id]/response - Update contractor response
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id: reviewId } = params;
    const body = await request.json();
    const { text } = body;
    
    if (!text || text.trim().length === 0) {
      return errorResponse('Response text is required', 400);
    }
    
    // Get the review
    const reviewDoc = await adminDb.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return errorResponse('Review not found', 404);
    }
    
    const reviewData = reviewDoc.data()!;
    
    // Get the listing to verify contractor ownership
    const listingDoc = await adminDb.collection('listings').doc(reviewData.listingId).get();
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    const listingData = listingDoc.data()!;
    
    // Verify that the user is the contractor who owns the listing
    if (listingData.userId !== uid) {
      return errorResponse('Only the contractor can update this response', 403);
    }
    
    // Check if response exists
    if (!reviewData.response) {
      return errorResponse('No response to update', 404);
    }
    
    // Update response
    const response = {
      text: text.trim(),
      createdAt: reviewData.response.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    await adminDb.collection('reviews').doc(reviewId).update({
      response,
      updatedAt: new Date(),
    });
    
    return successResponse({ response }, 'Response updated successfully');
  } catch (error) {
    console.error('Error updating review response:', error);
    return errorResponse('Failed to update response', 500);
  }
}

// DELETE /api/reviews/[id]/response - Delete contractor response
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id: reviewId } = params;
    
    // Get the review
    const reviewDoc = await adminDb.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return errorResponse('Review not found', 404);
    }
    
    const reviewData = reviewDoc.data()!;
    
    // Get the listing to verify contractor ownership
    const listingDoc = await adminDb.collection('listings').doc(reviewData.listingId).get();
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    const listingData = listingDoc.data()!;
    
    // Verify that the user is the contractor who owns the listing
    if (listingData.userId !== uid) {
      return errorResponse('Only the contractor can delete this response', 403);
    }
    
    // Delete response
    await adminDb.collection('reviews').doc(reviewId).update({
      response: null,
      updatedAt: new Date(),
    });
    
    return successResponse(null, 'Response deleted successfully');
  } catch (error) {
    console.error('Error deleting review response:', error);
    return errorResponse('Failed to delete response', 500);
  }
}

