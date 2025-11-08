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

