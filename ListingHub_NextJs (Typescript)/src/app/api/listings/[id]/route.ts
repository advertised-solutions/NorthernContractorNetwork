import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { Listing } from '@/types';

// GET /api/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    
    const listingDoc = await adminDb.collection('listings').doc(listingId).get();
    
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    // Increment view count
    await adminDb.collection('listings').doc(listingId).update({
      views: (listingDoc.data()?.views || 0) + 1,
    });
    
    const data = listingDoc.data()!;
    const listing: Listing = {
      id: listingDoc.id,
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
      views: (data.views || 0) + 1,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      expiresAt: data.expiresAt?.toDate(),
    };
    
    return successResponse(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return errorResponse('Failed to fetch listing', 500);
  }
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const listingDoc = await adminDb.collection('listings').doc(listingId).get();
    
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    if (listingDoc.data()!.userId !== uid) {
      return errorResponse('Forbidden: Cannot update another user\'s listing', 403);
    }
    
    const body = await request.json();
    
    // Update listing
    await adminDb.collection('listings').doc(listingId).update({
      ...body,
      updatedAt: new Date(),
    });
    
    // Fetch updated listing
    const updatedDoc = await adminDb.collection('listings').doc(listingId).get();
    const data = updatedDoc.data()!;
    
    const listing: Listing = {
      id: updatedDoc.id,
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
      updatedAt: new Date(),
      expiresAt: data.expiresAt?.toDate(),
    };
    
    return successResponse(listing, 'Listing updated successfully');
  } catch (error) {
    console.error('Error updating listing:', error);
    return errorResponse('Failed to update listing', 500);
  }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const listingDoc = await adminDb.collection('listings').doc(listingId).get();
    
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    if (listingDoc.data()!.userId !== uid) {
      return errorResponse('Forbidden: Cannot delete another user\'s listing', 403);
    }
    
    await adminDb.collection('listings').doc(listingId).delete();
    
    return successResponse(null, 'Listing deleted successfully');
  } catch (error) {
    console.error('Error deleting listing:', error);
    return errorResponse('Failed to delete listing', 500);
  }
}

