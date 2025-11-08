import { NextRequest } from 'next/server';
import { verifyAuthToken, errorResponse, successResponse, validateRequestBody } from '@/lib/api-helpers';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

// POST /api/payments/create-intent - Create a Stripe payment intent
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.amount || !body.currency) {
      return errorResponse('Missing required fields: amount, currency', 400);
    }
    
    const amount = Math.round(body.amount * 100); // Convert to cents
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: body.currency || 'usd',
      metadata: {
        userId: uid,
        bookingId: body.bookingId || '',
        listingId: body.listingId || '',
        type: body.type || 'booking',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    // Store payment intent in Firestore
    await adminDb.collection('transactions').add({
      userId: uid,
      type: 'payment',
      amount: body.amount,
      currency: body.currency || 'usd',
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        bookingId: body.bookingId,
        listingId: body.listingId,
        type: body.type || 'booking',
      },
      createdAt: new Date(),
    });
    
    return successResponse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return errorResponse('Failed to create payment intent', 500);
  }
}

