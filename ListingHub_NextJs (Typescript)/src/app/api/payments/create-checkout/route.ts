import { NextRequest } from 'next/server';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { stripe } from '@/lib/stripe';

// POST /api/payments/create-checkout - Create a Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    
    if (!body.amount || !body.successUrl || !body.cancelUrl) {
      return errorResponse('Missing required fields: amount, successUrl, cancelUrl', 400);
    }
    
    const amount = Math.round(body.amount * 100); // Convert to cents
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: body.currency || 'usd',
            product_data: {
              name: body.name || 'Listing Fee',
              description: body.description || '',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: body.mode || 'payment', // 'payment' or 'subscription'
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      metadata: {
        userId: uid,
        bookingId: body.bookingId || '',
        listingId: body.listingId || '',
        type: body.type || 'listing_fee',
      },
      customer_email: body.customerEmail,
    });
    
    return successResponse({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return errorResponse('Failed to create checkout session', 500);
  }
}

