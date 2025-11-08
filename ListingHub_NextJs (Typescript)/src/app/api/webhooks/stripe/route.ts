import { NextRequest } from 'next/server';
import { verifyWebhookSignature, stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { createNotification } from '@/lib/notifications';

// POST /api/webhooks/stripe - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return errorResponse('Missing stripe-signature header', 400);
    }
    
    // Verify webhook signature
    let event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return errorResponse('Invalid signature', 400);
    }
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.type, event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return successResponse({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return errorResponse('Webhook processing failed', 500);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  const metadata = paymentIntent.metadata;
  const userId = metadata.userId;
  
  // Update transaction status
  const transactions = await adminDb
    .collection('transactions')
    .where('stripePaymentIntentId', '==', paymentIntent.id)
    .get();
  
  if (!transactions.empty) {
    await adminDb.collection('transactions').doc(transactions.docs[0].id).update({
      status: 'completed',
      stripeChargeId: paymentIntent.latest_charge,
      updatedAt: new Date(),
    });
  }
  
  // Update user wallet balance if needed
  if (userId) {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const currentBalance = userDoc.data()!.walletBalance || 0;
      const amount = paymentIntent.amount / 100; // Convert from cents
      await adminDb.collection('users').doc(userId).update({
        walletBalance: currentBalance + amount,
      });
    }
  }
  
  // Update booking payment status if applicable
  if (metadata.bookingId) {
    await adminDb.collection('bookings').doc(metadata.bookingId).update({
      paymentStatus: 'paid',
      paymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    });
    
    // Create notification for booking owner
    try {
      const bookingDoc = await adminDb.collection('bookings').doc(metadata.bookingId).get();
      if (bookingDoc.exists) {
        const bookingData = bookingDoc.data()!;
        const listingDoc = await adminDb.collection('listings').doc(bookingData.listingId).get();
        const listingData = listingDoc.data();
        
        // Notify listing owner
        await createNotification(
          listingData?.userId,
          'payment',
          'Payment Received',
          `Payment received for booking: ${bookingData.listingTitle}`,
          `/dashboard-my-bookings`,
          { bookingId: metadata.bookingId, amount: paymentIntent.amount / 100 }
        );
        
        // Notify customer
        await createNotification(
          bookingData.userId,
          'payment',
          'Payment Confirmed',
          `Your payment of $${(paymentIntent.amount / 100).toFixed(2)} has been confirmed`,
          `/dashboard-my-bookings`,
          { bookingId: metadata.bookingId }
        );
      }
    } catch (error) {
      console.error('Error creating payment notification:', error);
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  // Update transaction status
  const transactions = await adminDb
    .collection('transactions')
    .where('stripePaymentIntentId', '==', paymentIntent.id)
    .get();
  
  if (!transactions.empty) {
    await adminDb.collection('transactions').doc(transactions.docs[0].id).update({
      status: 'failed',
      updatedAt: new Date(),
    });
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const metadata = session.metadata;
  const userId = metadata.userId;
  
  // Create transaction record
  await adminDb.collection('transactions').add({
    userId,
    type: session.mode === 'subscription' ? 'subscription' : 'payment',
    amount: session.amount_total / 100,
    currency: session.currency,
    status: 'completed',
    stripePaymentIntentId: session.payment_intent,
    metadata: {
      bookingId: metadata.bookingId,
      listingId: metadata.listingId,
      type: metadata.type,
    },
    createdAt: new Date(),
  });
  
  // Update booking payment status if applicable
  if (metadata.bookingId) {
    await adminDb.collection('bookings').doc(metadata.bookingId).update({
      paymentStatus: 'paid',
      paymentIntentId: session.payment_intent,
      updatedAt: new Date(),
    });
  }
}

async function handleSubscriptionChange(eventType: string, subscription: any) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) return;
  
  const subscriptionStatus = eventType.includes('deleted') ? 'cancelled' : 'active';
  
  await adminDb.collection('users').doc(userId).update({
    subscriptionStatus,
    subscriptionPlan: subscription.items?.data[0]?.price?.id || null,
    updatedAt: new Date(),
  });
}

