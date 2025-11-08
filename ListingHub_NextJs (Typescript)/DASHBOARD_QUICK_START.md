# Dashboard Quick Start Guide

## 🎯 Two Account Types

### Contractor Account
**What they can do:**
- Create and manage business listing(s)
- Browse and respond to job postings
- Submit quotes to homeowners
- Respond to reviews
- Access full dashboard features
- Upgrade to Pro/Elite subscriptions

**Registration Flow:**
1. Register → Select "Contractor"
2. Login → **Auto-redirected to onboarding**
3. Complete 3-step listing creation:
   - Business info
   - Contact details
   - Photos
4. Dashboard unlocked!

**Dashboard Access:** `/dashboard-user`

### Homeowner Account
**What they can do:**
- Save businesses in bookmarks/collections
- Write verified reviews
- Post jobs for free
- View and accept quotes
- Manage bookings
- Update profile

**Registration Flow:**
1. Register → Select "Customer"
2. Login → **Auto-redirected to homeowner dashboard**
3. No onboarding required
4. Start browsing contractors!

**Dashboard Access:** `/dashboard-homeowner`

---

## 🚀 Testing Your Implementation

### Test as Contractor:

1. **Register**: http://localhost:3000/register
   - Choose "Contractor" account type
   - Create account

2. **Login**: You'll be redirected to onboarding
   - Complete all 3 steps
   - Add at least 1 photo for best results

3. **Dashboard**: http://localhost:3000/dashboard-user
   - View contractor dashboard
   - See your listing stats

4. **Find Jobs**: http://localhost:3000/find-jobs
   - Browse available jobs
   - Submit quotes (3/month on free tier)

5. **Pricing**: http://localhost:3000/pricing-contractors
   - View subscription plans
   - Upgrade to Pro ($49) or Elite ($99)

### Test as Homeowner:

1. **Register**: http://localhost:3000/register
   - Choose "Customer" account type
   - Create account

2. **Login**: Auto-redirected to homeowner dashboard
   - See simplified interface

3. **Post Job**: http://localhost:3000/post-job
   - Create a job posting
   - Wait for contractor quotes

4. **Browse**: http://localhost:3000/grid-layout-01
   - Find contractors
   - Save to bookmarks

5. **Dashboard**: http://localhost:3000/dashboard-homeowner
   - View saved businesses
   - Manage bookings
   - Edit profile

---

## 📁 Key Pages Overview

### Public Pages (No Login Required)
- `/` - Homepage
- `/grid-layout-01` - Browse contractors
- `/single-listing-01/[id]` - Contractor profile
- `/login` - Login page
- `/register` - Registration
- `/pricing-contractors` - Contractor pricing

### Contractor Pages (Login + Listing Required)
- `/dashboard-user` - Main dashboard ⭐
- `/dashboard-my-listings` - Manage listings
- `/dashboard-add-listing` - Create additional listing
- `/dashboard-messages` - Customer messages
- `/dashboard-reviews` - Reviews received
- `/dashboard-wallet` - Payments & subscriptions
- `/find-jobs` - Job board
- `/onboarding-contractor` - First-time setup ⭐

### Homeowner Pages (Login Required)
- `/dashboard-homeowner` - Main dashboard ⭐
- `/dashboard-homeowner/bookmarks` - Saved businesses ⭐
- `/dashboard-homeowner/profile` - Account settings ⭐
- `/post-job` - Post a job (also public)
- `/dashboard-my-bookings` - View bookings

---

## 🔒 Access Control Logic

### Automatic Redirects:

**Not Logged In** → `/login`

**Contractor WITHOUT Listing** → `/onboarding-contractor`
- Must complete onboarding before accessing dashboard

**Contractor WITH Listing** → `/dashboard-user`
- Full access to contractor features

**Homeowner** → `/dashboard-homeowner`
- Cannot access contractor dashboard
- Auto-redirected if they try

**Contractor trying Homeowner Dashboard** → `/dashboard-user`
- Auto-redirected to contractor dashboard

---

## 🛠️ Implementation Details

### Route Protection
All contractor dashboard pages use:
```typescript
import { useContractorCheck } from '@/hooks/useContractorCheck';

const { hasListing, loading } = useContractorCheck();
// Auto-redirects if no listing
```

### User Type Checking
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user } = useAuth();
// user.userType === 'contractor' or 'customer'
```

---

## 📊 Free Tier Limits

### Contractor - Free Tier
- ✅ Create 1 business listing
- ✅ Submit 3 quotes per month
- ✅ Receive bookings
- ✅ Basic profile
- ❌ No featured listing
- ❌ No analytics
- ❌ No SMS notifications

**Monthly Limit Resets:** 1st of each month

### Upgrade Benefits

**Pro ($49/month):**
- Unlimited quotes
- Featured in category
- Pro badge
- Priority search
- Basic analytics
- SMS notifications

**Elite ($99/month):**
- Everything in Pro
- Homepage featured
- Elite badge
- Advanced analytics
- Top search position

---

## 🎨 UI Differences

### Contractor Dashboard
- Complex, feature-rich interface
- Sidebar navigation
- Analytics charts
- Revenue tracking
- Business management tools

### Homeowner Dashboard
- Simple, clean design
- Card-based layout
- Quick actions focus
- Easy navigation
- Consumer-friendly

---

## ✅ What's Working Now

### Contractor Features ✓
- Registration with contractor account
- Forced onboarding with 3-step listing creation
- Dashboard access after listing creation
- Quote submission with monthly limits
- Badge system
- Subscription framework

### Homeowner Features ✓
- Registration with customer account
- Simple dashboard access
- Save/bookmark businesses
- Profile management
- Job posting
- Review writing

### Smart Routing ✓
- Auto-redirect based on user type
- Onboarding enforcement for contractors
- Protection on all dashboard routes
- Login redirect preservation

---

## 🔧 Still Need Configuration

1. **Stripe Setup**
   - Create Pro and Elite products
   - Get price IDs
   - Configure webhooks

2. **Firestore Rules**
   - Add security rules for new collections
   - Test access control

3. **Environment Variables**
   - Add Stripe keys
   - Configure app URL

4. **Additional UI**
   - Job detail page with quotes
   - Portfolio management page
   - Analytics dashboard
   - Service area settings

---

## 🐛 Troubleshooting

**Issue**: Contractor can't access dashboard
- **Fix**: Check if they completed onboarding (created listing)

**Issue**: Homeowner sees contractor dashboard
- **Fix**: Should auto-redirect; check userType in database

**Issue**: Quote submission fails
- **Fix**: Check monthly limit (3 for free tier)

**Issue**: Onboarding doesn't redirect to dashboard
- **Fix**: Ensure listing was created successfully

---

## 📞 Support

For questions about the dashboard system:
- Review `DASHBOARD_SYSTEM.md` for technical details
- Check `IMPLEMENTATION_STATUS.md` for feature list
- Test both account types thoroughly

**Ready to test!** Visit http://localhost:3000 and create both account types to see the system in action.

