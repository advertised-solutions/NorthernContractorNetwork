import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse, validateRequestBody } from '@/lib/api-helpers';
import { Bookmark } from '@/types';

// POST /api/bookmarks - Add a bookmark
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.listingId) {
      return errorResponse('Missing required field: listingId', 400);
    }
    
    // Check if listing exists
    const listingDoc = await adminDb.collection('listings').doc(body.listingId).get();
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    // Check if bookmark already exists
    const existingBookmarks = await adminDb
      .collection('bookmarks')
      .where('userId', '==', uid)
      .where('listingId', '==', body.listingId)
      .get();
    
    if (!existingBookmarks.empty) {
      return errorResponse('Bookmark already exists', 400);
    }
    
    // Create bookmark
    const bookmarkData = {
      userId: uid,
      listingId: body.listingId,
      createdAt: new Date(),
    };
    
    const docRef = await adminDb.collection('bookmarks').add(bookmarkData);
    
    const bookmark: Bookmark = {
      id: docRef.id,
      userId: uid,
      listingId: body.listingId,
      createdAt: bookmarkData.createdAt,
    };
    
    return successResponse(bookmark, 'Bookmark added successfully');
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return errorResponse('Failed to create bookmark', 500);
  }
}

// DELETE /api/bookmarks - Remove a bookmark
export async function DELETE(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    
    if (!listingId) {
      return errorResponse('Missing required parameter: listingId', 400);
    }
    
    // Find and delete bookmark
    const bookmarks = await adminDb
      .collection('bookmarks')
      .where('userId', '==', uid)
      .where('listingId', '==', listingId)
      .get();
    
    if (bookmarks.empty) {
      return errorResponse('Bookmark not found', 404);
    }
    
    await adminDb.collection('bookmarks').doc(bookmarks.docs[0].id).delete();
    
    return successResponse(null, 'Bookmark removed successfully');
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return errorResponse('Failed to delete bookmark', 500);
  }
}

