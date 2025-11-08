import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';

// POST /api/notifications/mark-all-read - Mark all notifications as read
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const notifications = await adminDb
      .collection('notifications')
      .where('userId', '==', uid)
      .where('read', '==', false)
      .get();
    
    if (notifications.empty) {
      return successResponse(null, 'No unread notifications');
    }
    
    const batch = adminDb.batch();
    notifications.docs.forEach((doc) => {
      batch.update(adminDb.collection('notifications').doc(doc.id), { read: true });
    });
    
    await batch.commit();
    
    return successResponse(null, `${notifications.docs.length} notifications marked as read`);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return errorResponse('Failed to mark all notifications as read', 500);
  }
}

