# Dashboard System Documentation

## Overview
The Northern Contractor Directory implements a dual-dashboard system that provides tailored experiences for **Contractors** and **Homeowners**.

---

## Account Types

### 1. Contractor Account
**Purpose**: For businesses and service providers

**Features**:
- ✅ Create business listing (required)
- ✅ Access full contractor dashboard
- ✅ Respond to job postings
- ✅ Submit quotes
- ✅ Manage bookings
- ✅ Respond to reviews
- ✅ View analytics (Pro/Elite)
- ✅ Manage subscriptions
- ✅ Portfolio management
- ✅ Service area configuration

**Access**: Full dashboard at `/dashboard-user` (and related pages)

### 2. Homeowner Account
**Purpose**: For customers looking for contractors

**Features**:
- ✅ Save businesses in collections/bookmarks
- ✅ Write verified reviews
- ✅ Manage bookings
- ✅ Post jobs for quotes
- ✅ View and accept quotes
- ✅ Manage account information
- ❌ Cannot create business listings
- ❌ No access to contractor dashboard

**Access**: Simplified dashboard at `/dashboard-homeowner`

---

## User Flow

### Contractor Registration & Onboarding

```
1. Register → Select "Contractor" account type
2. Login → Auto-redirect to onboarding
3. Onboarding Flow:
   Step 1: Business Info (name, category, description)
   Step 2: Contact Details (address, phone, email, website)
   Step 3: Photos (upload business images)
4. Create Listing → Access granted to contractor dashboard
5. Dashboard unlocked with all features
```

**File**: `/onboarding-contractor/page.tsx`

### Homeowner Registration & Access

```
1. Register → Select "Customer" account type
2. Login → Auto-redirect to homeowner dashboard
3. Simple Dashboard:
   - View saved businesses
   - Manage bookings
   - Quick actions (find contractors, post jobs)
4. No onboarding required
```

**File**: `/dashboard-homeowner/page.tsx`

---

## Smart Routing Logic

### Dashboard Routes Protection

All routes automatically check:
1. **Is user logged in?** → Redirect to `/login`
2. **Is user a contractor?** 
   - Yes → Check if they have a listing
     - No listing → Redirect to `/onboarding-contractor`
     - Has listing → Grant access
   - No (homeowner) → Redirect to `/dashboard-homeowner`

### Implementation

**Hook**: `src/hooks/useContractorCheck.ts`
- Checks if contractor has completed onboarding (has a listing)
- Returns: `{ hasListing, listingId, loading }`

**Guard Component**: `src/app/components/ContractorDashboardGuard.tsx`
- Reusable wrapper for contractor-only pages
- Handles all routing logic

**Protected Pages**:
- `/dashboard-user` ✓
- `/dashboard-my-listings` - Protected via guard
- `/dashboard-add-listing` - Protected via guard
- `/dashboard-bookmarks` - Protected via guard
- `/dashboard-messages` - Protected via guard
- `/dashboard-reviews` - Protected via guard
- `/dashboard-wallet` - Protected via guard

---

## Dashboard Pages

### Contractor Dashboard (`/dashboard-user`)

**Main Features**:
- Overview stats (listings, bookings, reviews, revenue)
- Recent activity feed
- Quick actions
- Chart/analytics (Pro/Elite only)
- Notification center
- Recent messages

**Sub-pages**:
- `/dashboard-my-listings` - Manage business listings
- `/dashboard-add-listing` - Create additional listings
- `/dashboard-bookmarks` - Saved jobs/businesses
- `/dashboard-messages` - Customer communications
- `/dashboard-reviews` - Reviews received
- `/dashboard-my-bookings` - Booking management
- `/dashboard-wallet` - Payment & subscription management

### Homeowner Dashboard (`/dashboard-homeowner`)

**Main Features**:
- Stats cards (saved businesses, active bookings, reviews written)
- Quick actions (find contractors, post job, view saved, edit profile)
- Recent bookings list
- Saved businesses preview
- Help section

**Sub-pages**:
- `/dashboard-homeowner/bookmarks` - Saved contractors ✓
- `/dashboard-homeowner/profile` - Account management ✓
- `/dashboard-my-bookings` - Shared with contractors
- `/post-job` - Job posting (public page)

---

## Key Files

### Hooks
- `src/hooks/useAuth.ts` - Authentication state
- `src/hooks/useContractorCheck.ts` - Listing verification

### Components
- `src/app/components/ContractorDashboardGuard.tsx` - Route protection
- `src/app/components/navbar/admin-navbar.tsx` - Contractor nav
- `src/app/components/admin/admin-sidebar.tsx` - Contractor sidebar

### Pages
- `src/app/onboarding-contractor/page.tsx` - Contractor onboarding
- `src/app/dashboard-user/page.tsx` - Contractor dashboard
- `src/app/dashboard-homeowner/page.tsx` - Homeowner dashboard
- `src/app/dashboard-homeowner/bookmarks/page.tsx` - Saved businesses
- `src/app/dashboard-homeowner/profile/page.tsx` - Profile management

---

## Usage Examples

### Protect a New Contractor Page

```typescript
'use client';
import ContractorDashboardGuard from '@/app/components/ContractorDashboardGuard';

export default function NewContractorPage() {
  return (
    <ContractorDashboardGuard>
      {/* Your contractor-only content */}
    </ContractorDashboardGuard>
  );
}
```

### Check User Type in Component

```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user } = useAuth();
  
  if (user?.userType === 'contractor') {
    // Show contractor features
  } else {
    // Show homeowner features
  }
}
```

### Check if Contractor Has Listing

```typescript
import { useContractorCheck } from '@/hooks/useContractorCheck';

export default function MyComponent() {
  const { hasListing, listingId, loading } = useContractorCheck();
  
  if (loading) return <Spinner />;
  if (!hasListing) return <CompleteOnboarding />;
  
  // Contractor has completed onboarding
}
```

---

## Database Structure

### Users Collection
```typescript
{
  id: string,
  email: string,
  displayName: string,
  userType: 'contractor' | 'customer', // ← Key field
  // ... other fields
}
```

### Contractor Profiles Collection
```typescript
{
  userId: string, // Links to user
  badges: BadgeType[],
  verifiedInsurance: boolean,
  verifiedLicense: boolean,
  subscriptionTier: 'free' | 'pro' | 'elite',
  // ... other fields
}
```

---

## Access Control Matrix

| Feature | Homeowner | Free Contractor | Pro Contractor | Elite Contractor |
|---------|-----------|----------------|----------------|------------------|
| Browse Listings | ✅ | ✅ | ✅ | ✅ |
| Save Bookmarks | ✅ | ✅ | ✅ | ✅ |
| Write Reviews | ✅ | ✅ | ✅ | ✅ |
| Post Jobs | ✅ | ✅ | ✅ | ✅ |
| Create Listing | ❌ | ✅ | ✅ | ✅ |
| Submit Quotes | ❌ | ✅ (3/month) | ✅ Unlimited | ✅ Unlimited |
| Featured Listing | ❌ | ❌ | ✅ | ✅ |
| Homepage Featured | ❌ | ❌ | ❌ | ✅ |
| Analytics | ❌ | ❌ | ✅ Basic | ✅ Advanced |
| SMS Alerts | ❌ | ❌ | ✅ | ✅ |

---

## Navigation Updates Needed

### Update Main Navigation
Show different menu items based on user type:

**For Contractors**:
- Dashboard
- My Listings
- Find Jobs
- Messages
- Reviews
- Wallet/Subscription

**For Homeowners**:
- Dashboard (simpler)
- Saved Businesses
- Post a Job
- My Bookings
- Messages
- My Profile

---

## Future Enhancements

### Homeowner Features (Mentioned by User)
1. **Pinterest-style Collections** (Future)
   - Create named collections
   - Save jobs/posts by contractors
   - Acts as ranking system
   - Visual boards

2. **Social Features** (Future)
   - Follow contractors
   - Like/share posts
   - Comment on portfolio items

### Contractor Features
1. **Portfolio Management** (Types ready)
   - Before/after galleries
   - Project showcases
   - Cost ranges

2. **Service Area Management** (Types ready)
   - Define service radius
   - Multiple service areas
   - Zip code targeting

3. **Analytics Dashboard** (Types ready)
   - Profile views
   - Quote acceptance rate
   - Revenue tracking
   - Lead sources

---

## Testing Checklist

### Contractor Flow
- [ ] Register as contractor
- [ ] Verify redirect to onboarding
- [ ] Complete onboarding (all 3 steps)
- [ ] Verify listing created
- [ ] Verify access to contractor dashboard
- [ ] Try accessing dashboard pages
- [ ] Test quote submission (free tier - 3/month limit)

### Homeowner Flow
- [ ] Register as homeowner/customer
- [ ] Verify redirect to homeowner dashboard
- [ ] Test saving businesses
- [ ] Test posting a job
- [ ] Test profile management
- [ ] Verify NO access to contractor dashboard

### Edge Cases
- [ ] Contractor tries to access homeowner dashboard → redirects
- [ ] Homeowner tries to access contractor dashboard → redirects
- [ ] Contractor without listing tries to access dashboard → onboarding
- [ ] Logout and login redirects work correctly

---

## API Endpoints for Dashboard

### Contractor-Specific:
- `GET /api/listings?userId={id}` - Get contractor's listings
- `POST /api/listings` - Create listing (onboarding)
- `GET /api/quotes?contractorId={id}` - Contractor's quotes
- `POST /api/jobs/{id}/quotes` - Submit quote
- `GET /api/subscriptions` - Current subscription
- `POST /api/contractors/{id}/badges` - Recalculate badges

### Homeowner-Specific:
- `GET /api/bookmarks/user/{id}` - Saved businesses
- `POST /api/bookmarks` - Save a business
- `DELETE /api/bookmarks/{id}` - Remove bookmark
- `GET /api/bookings/user/{id}` - User's bookings
- `POST /api/jobs` - Post a job
- `PATCH /api/users/{id}` - Update profile

### Shared:
- `GET /api/reviews?userId={id}` - Reviews by user
- `GET /api/messages/conversations` - Conversations
- `GET /api/notifications` - Notifications

---

## Styling & UI Consistency

### Contractor Dashboard
- Uses existing admin theme
- AdminNavbar + AdminSidebar
- Full-featured interface
- Charts and analytics

### Homeowner Dashboard
- Cleaner, simpler design
- Card-based layout
- Focus on key actions
- Minimal navigation
- Consumer-friendly language

---

## Environment Setup

No additional environment variables needed for dashboard system.
Existing Firebase and Stripe configs are sufficient.

---

**Last Updated**: November 8, 2025
**Status**: Core dashboard system implemented and functional
**Next**: Build portfolio management and analytics dashboards

