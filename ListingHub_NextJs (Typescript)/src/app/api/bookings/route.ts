import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse, validateRequestBody } from '@/lib/api-helpers';
import { Booking } from '@/types';
import { createNotification } from '@/lib/notifications';

// POST /api/bookings - Create a booking
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    
    // Validate required fields
    const validation = validateRequestBody<Booking>(body, ['listingId', 'date', 'totalAmount']);
    
    if (!validation.valid) {
      return errorResponse(`Missing required fields: ${validation.missing?.join(', ')}`, 400);
    }
    
    // Check if listing exists
    const listingDoc = await adminDb.collection('listings').doc(body.listingId).get();
    if (!listingDoc.exists) {
      return errorResponse('Listing not found', 404);
    }
    
    const listingData = listingDoc.data()!;
    
    // Fetch user data
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    // Create booking
    const bookingData = {
      listingId: body.listingId,
      listingTitle: listingData.title,
      listingImage: listingData.image,
      userId: uid,
      userName: userData?.displayName,
      userEmail: userData?.email,
      userPhone: userData?.phoneNumber || body.userPhone,
      date: new Date(body.date),
      endDate: body.endDate ? new Date(body.endDate) : null,
      time: body.time,
      guests: body.guests,
      adults: body.adults,
      children: body.children,
      status: 'pending' as Booking['status'],
      totalAmount: body.totalAmount,
      paymentStatus: 'pending' as Booking['paymentStatus'],
      paymentIntentId: body.paymentIntentId,
      notes: body.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await adminDb.collection('bookings').add(bookingData);
    
    const booking: Booking = {
      id: docRef.id,
      ...bookingData,
      date: bookingData.date,
      endDate: bookingData.endDate,
      createdAt: bookingData.createdAt,
      updatedAt: bookingData.updatedAt,
    };
    
    // Create notification for listing owner
    try {
      await createNotification(
        listingData.userId,
        'booking',
        'New Booking Request',
        `${userData?.displayName || 'A customer'} has requested a booking for "${listingData.title}"`,
        `/dashboard-my-bookings`,
        { bookingId: docRef.id, listingId: body.listingId }
      );
    } catch (error) {
      console.error('Error creating booking notification:', error);
      // Don't fail the request if notification fails
    }
    
    return successResponse(booking, 'Booking created successfully');
  } catch (error) {
    console.error('Error creating booking:', error);
    return errorResponse('Failed to create booking', 500);
  }
}

