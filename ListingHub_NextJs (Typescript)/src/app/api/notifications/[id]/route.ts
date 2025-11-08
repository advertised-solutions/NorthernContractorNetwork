import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';

// PATCH /api/notifications/[id] - Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const notificationDoc = await adminDb.collection('notifications').doc(notificationId).get();
    
    if (!notificationDoc.exists) {
      return errorResponse('Notification not found', 404);
    }
    
    if (notificationDoc.data()!.userId !== uid) {
      return errorResponse('Forbidden: Cannot update another user\'s notification', 403);
    }
    
    await adminDb.collection('notifications').doc(notificationId).update({
      read: true,
    });
    
    return successResponse(null, 'Notification marked as read');
  } catch (error) {
    console.error('Error updating notification:', error);
    return errorResponse('Failed to update notification', 500);
  }
}

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const notificationDoc = await adminDb.collection('notifications').doc(notificationId).get();
    
    if (!notificationDoc.exists) {
      return errorResponse('Notification not found', 404);
    }
    
    if (notificationDoc.data()!.userId !== uid) {
      return errorResponse('Forbidden: Cannot delete another user\'s notification', 403);
    }
    
    await adminDb.collection('notifications').doc(notificationId).delete();
    
    return successResponse(null, 'Notification deleted successfully');
  } catch (error) {
    console.error('Error deleting notification:', error);
    return errorResponse('Failed to delete notification', 500);
  }
}

