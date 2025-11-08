import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { stripe } from '@/lib/stripe';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { Subscription, SubscriptionTier } from '@/types';
import { getPlanByTier, STRIPE_PRICE_IDS } from '@/lib/subscription-plans';
import { updateContractorBadges } from '@/lib/badge-calculator';

// GET /api/subscriptions - Get user's subscription
export async function GET(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }

    const subscriptionDoc = await adminDb
      .collection('subscriptions')
      .doc(uid)
      .get();

    if (!subscriptionDoc.exists) {
      // Return free tier as default
      return successResponse({
        userId: uid,
        tier: 'free',
        status: 'active',
      }, 'No active subscription');
    }

    const data = subscriptionDoc.data()!;
    const subscription: Subscription = {
      id: subscriptionDoc.id,
      ...data,
      currentPeriodStart: data.currentPeriodStart?.toDate() || new Date(),
      currentPeriodEnd: data.currentPeriodEnd?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Subscription;

    return successResponse(subscription, 'Subscription retrieved');
  } catch (error) {
    console.error('Error getting subscription:', error);
    return errorResponse('Failed to get subscription', 500);
  }
}

// POST /api/subscriptions - Create or update subscription
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { tier, paymentMethodId } = body as {
      tier: SubscriptionTier;
      paymentMethodId?: string;
    };

    if (!tier || (tier !== 'pro' && tier !== 'elite')) {
      return errorResponse('Invalid subscription tier', 400);
    }

    const plan = getPlanByTier(tier);
    if (!plan) {
      return errorResponse('Plan not found', 404);
    }

    // Get or create Stripe customer
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    let customerId = userData?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData?.email,
        metadata: {
          userId: uid,
        },
      });
      customerId = customer.id;
      
      await adminDb.collection('users').doc(uid).update({
        stripeCustomerId: customerId,
      });
    }

    // Attach payment method if provided
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Get price ID for the tier
    const priceId =
      tier === 'pro'
        ? STRIPE_PRICE_IDS.pro_monthly
        : STRIPE_PRICE_IDS.elite_monthly;

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Save subscription to Firestore
    const subscriptionData = {
      userId: uid,
      tier,
      status: stripeSubscription.status === 'active' ? 'active' : 'inactive',
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: customerId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection('subscriptions').doc(uid).set(subscriptionData);

    // Update contractor profile
    await adminDb.collection('contractor_profiles').doc(uid).update({
      subscriptionTier: tier,
      subscriptionExpiresAt: subscriptionData.currentPeriodEnd,
      updatedAt: new Date(),
    });

    // Update badges
    await updateContractorBadges(uid);

    // Set featured listing if applicable
    if (plan.featuredListing) {
      const listingsSnapshot = await adminDb
        .collection('listings')
        .where('userId', '==', uid)
        .get();

      const batch = adminDb.batch();
      const featuredUntil = subscriptionData.currentPeriodEnd;
      
      listingsSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          featured: true,
          featuredUntil,
          updatedAt: new Date(),
        });
      });
      
      await batch.commit();
    }

    const subscription: Subscription = {
      id: uid,
      ...subscriptionData,
    } as Subscription;

    return successResponse(
      subscription,
      'Subscription created successfully'
    );
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return errorResponse(error.message || 'Failed to create subscription', 500);
  }
}

// DELETE /api/subscriptions - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }

    const subscriptionDoc = await adminDb
      .collection('subscriptions')
      .doc(uid)
      .get();

    if (!subscriptionDoc.exists) {
      return errorResponse('No active subscription found', 404);
    }

    const data = subscriptionDoc.data()!;
    
    if (!data.stripeSubscriptionId) {
      return errorResponse('Invalid subscription', 400);
    }

    // Cancel Stripe subscription at period end
    await stripe.subscriptions.update(data.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update Firestore
    await adminDb.collection('subscriptions').doc(uid).update({
      cancelAtPeriodEnd: true,
      status: 'cancelled',
      updatedAt: new Date(),
    });

    return successResponse(
      { cancelled: true },
      'Subscription will cancel at period end'
    );
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return errorResponse(error.message || 'Failed to cancel subscription', 500);
  }
}

