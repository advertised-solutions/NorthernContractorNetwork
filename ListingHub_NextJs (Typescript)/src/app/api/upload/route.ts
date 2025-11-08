import { NextRequest } from 'next/server';
import { adminStorage, adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';

// POST /api/upload - Upload a file to Firebase Storage
// This endpoint receives a presigned URL request or handles direct upload
// For direct client-side uploads, we'll return upload configuration
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    const { type, path } = body; // type: 'profile' | 'listing' | 'gallery', path: custom path
    
    if (!type) {
      return errorResponse('Missing required field: type', 400);
    }
    
    // Generate storage path based on type
    let storagePath = '';
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    
    switch (type) {
      case 'profile':
        storagePath = path || `users/${uid}/profile/${timestamp}_${randomId}`;
        break;
      case 'listing':
        if (!body.listingId) {
          return errorResponse('Missing required field: listingId for listing upload', 400);
        }
        storagePath = path || `listings/${body.listingId}/images/${timestamp}_${randomId}`;
        break;
      case 'gallery':
        if (!body.listingId) {
          return errorResponse('Missing required field: listingId for gallery upload', 400);
        }
        storagePath = path || `listings/${body.listingId}/gallery/${timestamp}_${randomId}`;
        break;
      default:
        return errorResponse('Invalid upload type', 400);
    }
    
    // Return upload configuration
    // Note: Actual file upload should be done client-side using Firebase Storage SDK
    // This endpoint provides the path and configuration
    return successResponse({
      path: storagePath,
      uploadUrl: null, // Client-side uploads use Firebase Storage SDK directly
      message: 'Use Firebase Storage SDK on client-side to upload files',
    });
  } catch (error) {
    console.error('Error processing upload request:', error);
    return errorResponse('Failed to process upload request', 500);
  }
}

// DELETE /api/upload - Delete a file from Firebase Storage
export async function DELETE(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return errorResponse('Missing required parameter: path', 400);
    }
    
    // Verify user has permission to delete this file
    // (e.g., if it's their profile image or their listing image)
    if (!path.startsWith(`users/${uid}/`) && !path.startsWith(`listings/`)) {
      return errorResponse('Forbidden: Cannot delete this file', 403);
    }
    
    // If it's a listing image, verify user owns the listing
    if (path.startsWith('listings/')) {
      const listingId = path.split('/')[1];
      const listingDoc = await adminDb.collection('listings').doc(listingId).get();
      
      if (!listingDoc.exists || listingDoc.data()!.userId !== uid) {
        return errorResponse('Forbidden: Cannot delete this file', 403);
      }
    }
    
    // Delete file from Firebase Storage
    const bucket = adminStorage.bucket();
    const file = bucket.file(path);
    
    const exists = await file.exists();
    if (!exists[0]) {
      return errorResponse('File not found', 404);
    }
    
    await file.delete();
    
    return successResponse(null, 'File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    return errorResponse('Failed to delete file', 500);
  }
}

