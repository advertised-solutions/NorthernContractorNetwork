import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { Booking } from '@/types';

// GET /api/bookings/user/[userId] - Get user bookings
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    if (uid !== userId) {
      return errorResponse('Forbidden: Cannot access another user\'s bookings', 403);
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query = adminDb.collection('bookings').where('userId', '==', userId);
    
    if (status) {
      query = query.where('status', '==', status) as any;
    }
    
    query = query.orderBy('date', 'desc').limit(limit) as any;
    
    const snapshot = await query.get();
    
    const bookings: Booking[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        listingId: data.listingId,
        listingTitle: data.listingTitle,
        listingImage: data.listingImage,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        userPhone: data.userPhone,
        date: data.date?.toDate() || new Date(),
        endDate: data.endDate?.toDate(),
        time: data.time,
        guests: data.guests,
        adults: data.adults,
        children: data.children,
        status: data.status,
        totalAmount: data.totalAmount,
        paymentStatus: data.paymentStatus,
        paymentIntentId: data.paymentIntentId,
        notes: data.notes,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
    
    return successResponse(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return errorResponse('Failed to fetch bookings', 500);
  }
}

