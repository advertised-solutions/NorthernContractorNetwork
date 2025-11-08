import { SubscriptionPlan, SubscriptionTier } from '@/types';

/**
 * Contractor Subscription Plans
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: 0, // $0/month
    features: [
      'Basic listing',
      'Respond to 3 jobs per month',
      'Standard search visibility',
      'Email notifications',
      'Basic profile',
    ],
    jobResponseLimit: 3,
    featuredListing: false,
    prioritySearch: false,
    analytics: 'none',
    smsNotifications: false,
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 4900, // $49/month
    features: [
      'Featured listing in category',
      'Unlimited job responses',
      'Priority in search results',
      'Pro Member badge',
      'Basic analytics dashboard',
      'Email & SMS notifications',
      'Portfolio gallery',
      'Response time tracking',
    ],
    jobResponseLimit: undefined, // unlimited
    featuredListing: true,
    prioritySearch: true,
    analytics: 'basic',
    smsNotifications: true,
  },
  {
    tier: 'elite',
    name: 'Elite',
    price: 9900, // $99/month
    features: [
      'Everything in Pro',
      'Homepage featured rotation',
      'Top position in search',
      'Elite Pro badge',
      'Advanced analytics dashboard',
      'Instant lead notifications',
      'Priority customer support',
      'Promoted in "Top Contractors"',
      'Custom service areas',
      'Unlimited portfolio items',
    ],
    jobResponseLimit: undefined, // unlimited
    featuredListing: true,
    prioritySearch: true,
    analytics: 'advanced',
    smsNotifications: true,
  },
];

/**
 * Get plan by tier
 */
export function getPlanByTier(tier: SubscriptionTier): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.tier === tier);
}

/**
 * Get plan features comparison
 */
export function getPlanFeatures() {
  return SUBSCRIPTION_PLANS.map((plan) => ({
    tier: plan.tier,
    name: plan.name,
    price: plan.price / 100, // Convert to dollars
    features: plan.features,
  }));
}

/**
 * Check if contractor has access to a feature based on subscription
 */
export function hasFeatureAccess(
  tier: SubscriptionTier,
  feature: keyof Pick<
    SubscriptionPlan,
    'featuredListing' | 'prioritySearch' | 'analytics' | 'smsNotifications'
  >
): boolean {
  const plan = getPlanByTier(tier);
  if (!plan) return false;
  
  const value = plan[feature];
  
  // For analytics, check if it's not 'none'
  if (feature === 'analytics') {
    return value !== 'none';
  }
  
  return Boolean(value);
}

/**
 * Get job response limit for a tier
 */
export function getJobResponseLimit(tier: SubscriptionTier): number | null {
  const plan = getPlanByTier(tier);
  return plan?.jobResponseLimit ?? null;
}

/**
 * Stripe Price IDs (set these after creating products in Stripe)
 */
export const STRIPE_PRICE_IDS = {
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  elite_monthly: process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID || 'price_elite_monthly',
};

/**
 * Featured listing pricing
 */
export const FEATURED_LISTING_PRICES = {
  basic: 2500, // $25/month - featured in category
  premium: 5000, // $50/month - featured on homepage
};


