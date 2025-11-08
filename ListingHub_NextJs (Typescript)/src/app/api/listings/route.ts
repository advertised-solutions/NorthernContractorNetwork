import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse, validateRequestBody } from '@/lib/api-helpers';
import { Listing, PaginatedResponse } from '@/types';

// GET /api/listings - Get listings with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const lastDocId = searchParams.get('lastDocId');
    
    let query = adminDb.collection('listings');
    
    // Apply filters
    if (categoryId) {
      query = query.where('categoryId', '==', categoryId);
    }
    if (city) {
      query = query.where('city', '==', city);
    }
    if (state) {
      query = query.where('state', '==', state);
    }
    if (featured === 'true') {
      query = query.where('featured', '==', true);
    }
    
    // Pagination
    if (lastDocId) {
      const lastDoc = await adminDb.collection('listings').doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc) as any;
      }
    }
    
    query = (query.orderBy('createdAt', 'desc').limit(limit) as any);
    
    const snapshot = await query.get();
    const listings: Listing[] = snapshot.docs.map((doc) => {
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
      };
    });
    
    const response: PaginatedResponse<Listing> = {
      data: listings,
      pagination: {
        page: 1, // TODO: Calculate actual page
        limit,
        total: listings.length, // TODO: Get total count
        hasMore: snapshot.docs.length === limit,
        lastDocId: snapshot.docs[snapshot.docs.length - 1]?.id,
      },
    };
    
    return successResponse(response);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return errorResponse('Failed to fetch listings', 500);
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    
    // Validate required fields
    const validation = validateRequestBody<Listing>(body, [
      'title',
      'description',
      'categoryId',
      'address',
      'city',
      'state',
      'phoneNumber',
    ]);
    
    if (!validation.valid) {
      return errorResponse(`Missing required fields: ${validation.missing?.join(', ')}`, 400);
    }
    
    // Create listing document
    const listingData = {
      userId: uid,
      title: body.title,
      description: body.description,
      categoryId: body.categoryId,
      categoryName: body.categoryName,
      status: body.status || 'open',
      featured: body.featured || false,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      country: body.country || 'USA',
      latitude: body.latitude,
      longitude: body.longitude,
      phoneNumber: body.phoneNumber,
      email: body.email,
      website: body.website,
      image: body.image,
      gallery: body.gallery || [],
      instantBooking: body.instantBooking || false,
      tags: body.tags || [],
      views: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    };
    
    const docRef = await adminDb.collection('listings').add(listingData);
    
    const listing: Listing = {
      id: docRef.id,
      ...listingData,
      createdAt: listingData.createdAt,
      updatedAt: listingData.updatedAt,
    };
    
    return successResponse(listing, 'Listing created successfully');
  } catch (error) {
    console.error('Error creating listing:', error);
    return errorResponse('Failed to create listing', 500);
  }
}

