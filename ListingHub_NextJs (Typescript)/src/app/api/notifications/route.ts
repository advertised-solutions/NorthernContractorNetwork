import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { Notification } from '@/types';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limitCount = parseInt(searchParams.get('limit') || '50');
    
    let query = adminDb.collection('notifications').where('userId', '==', uid);
    
    if (unreadOnly) {
      query = query.where('read', '==', false) as any;
    }
    
    query = query.orderBy('createdAt', 'desc').limit(limitCount) as any;
    
    const snapshot = await query.get();
    
    const notifications: Notification[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        read: data.read || false,
        link: data.link,
        metadata: data.metadata,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
    
    return successResponse(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return errorResponse('Failed to fetch notifications', 500);
  }
}

