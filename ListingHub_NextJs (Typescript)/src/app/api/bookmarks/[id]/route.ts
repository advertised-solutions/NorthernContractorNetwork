import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';

// DELETE /api/bookmarks/[id] - Delete bookmark by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = params;

    // Get bookmark
    const bookmarkDoc = await adminDb.collection('bookmarks').doc(id).get();
    
    if (!bookmarkDoc.exists) {
      return errorResponse('Bookmark not found', 404);
    }

    const bookmarkData = bookmarkDoc.data()!;

    // Verify user owns this bookmark
    if (bookmarkData.userId !== uid) {
      return errorResponse('Unauthorized: You can only delete your own bookmarks', 403);
    }

    // Delete bookmark
    await adminDb.collection('bookmarks').doc(id).delete();
    
    return successResponse(null, 'Bookmark removed successfully');
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return errorResponse('Failed to delete bookmark', 500);
  }
}

