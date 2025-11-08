import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { Booking } from '@/types';
import { createNotification } from '@/lib/notifications';

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get();
    
    if (!bookingDoc.exists) {
      return errorResponse('Booking not found', 404);
    }
    
    const bookingData = bookingDoc.data()!;
    
    // Check if user is authorized (booking owner or listing owner)
    const listingDoc = await adminDb.collection('listings').doc(bookingData.listingId).get();
    const listingData = listingDoc.data();
    const isListingOwner = listingData?.userId === uid;
    const isBookingOwner = bookingData.userId === uid;
    
    if (!isListingOwner && !isBookingOwner) {
      return errorResponse('Forbidden: Cannot update this booking', 403);
    }
    
    const body = await request.json();
    
    // Update booking
    await adminDb.collection('bookings').doc(bookingId).update({
      ...body,
      updatedAt: new Date(),
    });
    
    // Fetch updated booking
    const updatedDoc = await adminDb.collection('bookings').doc(bookingId).get();
    const updatedData = updatedDoc.data()!;
    
    const booking: Booking = {
      id: updatedDoc.id,
      listingId: updatedData.listingId,
      listingTitle: updatedData.listingTitle,
      listingImage: updatedData.listingImage,
      userId: updatedData.userId,
      userName: updatedData.userName,
      userEmail: updatedData.userEmail,
      userPhone: updatedData.userPhone,
      date: updatedData.date?.toDate() || new Date(),
      endDate: updatedData.endDate?.toDate(),
      time: updatedData.time,
      guests: updatedData.guests,
      adults: updatedData.adults,
      children: updatedData.children,
      status: updatedData.status,
      totalAmount: updatedData.totalAmount,
      paymentStatus: updatedData.paymentStatus,
      paymentIntentId: updatedData.paymentIntentId,
      notes: updatedData.notes,
      createdAt: updatedData.createdAt?.toDate() || new Date(),
      updatedAt: new Date(),
    };
    
    // Create notification for status changes
    if (body.status && body.status !== bookingData.status) {
      try {
        const listingDoc = await adminDb.collection('listings').doc(bookingData.listingId).get();
        const listingData = listingDoc.data();
        
        // Notify the appropriate user
        const notifyUserId = isListingOwner ? bookingData.userId : listingData?.userId;
        const statusMessages: Record<string, string> = {
          approved: 'Your booking has been approved!',
          rejected: 'Your booking has been rejected.',
          cancelled: 'Your booking has been cancelled.',
          completed: 'Your booking has been marked as completed.',
        };
        
        if (notifyUserId && statusMessages[body.status]) {
          await createNotification(
            notifyUserId,
            'booking',
            'Booking Status Updated',
            statusMessages[body.status],
            `/dashboard-my-bookings`,
            { bookingId: bookingId, listingId: bookingData.listingId, status: body.status }
          );
        }
      } catch (error) {
        console.error('Error creating booking status notification:', error);
        // Don't fail the request if notification fails
      }
    }
    
    return successResponse(booking, 'Booking updated successfully');
  } catch (error) {
    console.error('Error updating booking:', error);
    return errorResponse('Failed to update booking', 500);
  }
}

