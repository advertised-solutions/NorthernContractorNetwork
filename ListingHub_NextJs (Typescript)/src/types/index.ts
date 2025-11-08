// User Types
export type UserType = 'contractor' | 'customer';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  userType: UserType;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  walletBalance?: number;
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled';
  subscriptionPlan?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  listingCount?: number;
  createdAt: Date;
}

// Listing Types
export type ListingStatus = 'open' | 'closed';
export type ListingRating = 'excellent' | 'good' | 'medium' | 'poor';

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  status: ListingStatus;
  featured: boolean;
  
  // Location
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  
  // Contact
  phoneNumber: string;
  email?: string;
  website?: string;
  
  // Media
  image?: string;
  gallery?: string[];
  
  // Ratings
  rating?: ListingRating;
  ratingValue?: number;
  reviewCount?: number;
  
  // Features
  instantBooking: boolean;
  tags?: string[];
  
  // Metadata
  views?: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  
  // Phase 3-4 enhancements
  featuredUntil?: Date;
  serviceAreas?: ServiceArea[];
  portfolio?: PortfolioItem[];
  badges?: BadgeType[];
  verifiedPro?: boolean;
  responseTimeMinutes?: number;
}

// Review Types
export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName?: string;
  userPhoto?: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  helpful?: number;
  // Phase 2 enhancements
  verified: boolean; // Tied to completed booking/job
  jobId?: string;
  bookingId?: string;
  response?: {
    text: string;
    createdAt: Date;
  }; // Contractor response
  helpfulCount: number;
  photos?: string[];
}

// Booking Types
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  listingId: string;
  listingTitle?: string;
  listingImage?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  date: Date;
  endDate?: Date;
  time?: string;
  guests?: number;
  adults?: number;
  children?: number;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentIntentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message Types
export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  listingId?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: { [userId: string]: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderPhoto?: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

// Transaction Types
export type TransactionType = 'payment' | 'refund' | 'subscription' | 'payout';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Bookmark Types
export interface Bookmark {
  id: string;
  userId: string;
  listingId: string;
  createdAt: Date;
}

// Notification Types
export type NotificationType = 'booking' | 'message' | 'review' | 'payment' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    lastDocId?: string;
  };
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  categoryId?: string;
  city?: string;
  state?: string;
  minRating?: number;
  featured?: boolean;
  priceRange?: {
    min?: number;
    max?: number;
  };
  latitude?: number;
  longitude?: number;
  radius?: number; // in miles
}

// Job Types (Phase 1)
export type JobStatus = 'open' | 'reviewing_quotes' | 'hired' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  userId: string; // homeowner
  title: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  location: {
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };
  budget?: {
    min: number;
    max: number;
  };
  timeline: string; // e.g., "ASAP", "1-2 weeks", "1-3 months"
  status: JobStatus;
  quoteCount: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

// Quote Types (Phase 1)
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface Quote {
  id: string;
  jobId: string;
  contractorId: string;
  contractorName?: string;
  contractorPhoto?: string;
  contractorRating?: number;
  amount: number;
  description: string;
  timeline: string;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Badge Types (Phase 2)
export type BadgeType = 
  | 'top_rated' 
  | 'best_of_year' 
  | 'quick_responder' 
  | 'verified_pro' 
  | 'elite_member'
  | 'pro_member';

export interface Badge {
  id: string;
  contractorId: string;
  badgeType: BadgeType;
  displayName: string;
  description: string;
  awardedAt: Date;
  expiresAt?: Date;
}

// Contractor Profile Types (Phase 2-4)
export interface ContractorProfile {
  userId: string;
  badges: BadgeType[];
  verifiedInsurance: boolean;
  verifiedLicense: boolean;
  insuranceDocument?: string;
  licenseDocument?: string;
  licenseNumber?: string;
  insuranceExpiry?: Date;
  serviceAreas: ServiceArea[];
  portfolio: PortfolioItem[];
  responseTime: {
    averageMinutes: number;
    responseCount: number;
  };
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  featuredUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Service Area Types (Phase 4)
export interface ServiceArea {
  id: string;
  city?: string;
  state: string;
  zipCodes?: string[];
  radius?: number; // miles from main location
}

// Portfolio Types (Phase 4)
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  beforeImages: string[];
  afterImages: string[];
  costRange?: {
    min: number;
    max: number;
  };
  duration?: string; // e.g., "2 weeks"
  completedAt: Date;
  tags?: string[];
  createdAt: Date;
}

// Subscription Types (Phase 3)
export type SubscriptionTier = 'free' | 'pro' | 'elite';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number; // monthly price in cents
  features: string[];
  jobResponseLimit?: number; // undefined = unlimited
  featuredListing: boolean;
  prioritySearch: boolean;
  analytics: 'basic' | 'advanced' | 'none';
  smsNotifications: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'past_due' | 'inactive';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}


// Analytics Types (Phase 4)
export interface ContractorAnalytics {
  contractorId: string;
  period: {
    start: Date;
    end: Date;
  };
  profileViews: number;
  quoteRequests: number;
  quotesSubmitted: number;
  quotesAccepted: number;
  acceptanceRate: number;
  averageQuoteAmount: number;
  reviewsReceived: number;
  averageRating: number;
  revenue: number;
}

