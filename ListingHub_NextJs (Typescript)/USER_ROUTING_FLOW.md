# User Registration & Login Routing Flow

## 🎯 Overview

The application now intelligently routes users based on their account type:
- **Contractors** → Onboarding flow to create business listing
- **Homeowners/Customers** → Homeowner dashboard

---

## 📋 Registration Flow

### **Step 1: User Selects Account Type**
At `/register`, users select either:
- **Customer** (Homeowner)
- **Contractor** (Business)

### **Step 2: Account Creation**
Form collects:
- Full Name
- Email
- Password
- **User Type** ← Saved to Firebase

### **Step 3: Automatic Redirect**
After successful registration:

```
Contractor Account
   ↓
/onboarding-contractor
   ↓
3-Step Business Setup
   ↓
/dashboard-user (Contractor Dashboard)
```

```
Customer Account
   ↓
/dashboard-homeowner
   ↓
Homeowner Dashboard
```

---

## 🔐 Login Flow

### **Step 1: Sign In**
User logs in at `/login` with email/password or social auth

### **Step 2: Smart Routing**
Login redirects to `/dashboard-user` which acts as a **smart router**:

```
Login Success
   ↓
/dashboard-user (Router)
   ↓
   ├─→ Contractor WITHOUT listing → /onboarding-contractor
   ├─→ Contractor WITH listing → Contractor Dashboard
   └─→ Customer/Homeowner → /dashboard-homeowner
```

---

## 🛣️ Routing Logic

### **Register Page** (`/register`)
```typescript
// After signup
if (userType === 'contractor') {
  router.push('/onboarding-contractor');
} else {
  router.push('/dashboard-homeowner');
}
```

### **Login Page** (`/login`)
```typescript
// After login (all users)
router.push('/dashboard-user'); // Smart router
```

### **Dashboard Router** (`/dashboard-user`)
```typescript
useEffect(() => {
  if (!user) {
    router.push('/login'); // Not authenticated
  } else if (user.userType === 'customer') {
    router.push('/dashboard-homeowner'); // Homeowner
  } else if (user.userType === 'contractor') {
    if (!hasListing) {
      router.push('/onboarding-contractor'); // New contractor
    }
    // else: Stay on contractor dashboard
  }
}, [user, hasListing]);
```

---

## 🎨 User Experience

### **New Contractor Registration:**
1. Visits `/register`
2. Selects "Contractor"
3. Creates account ⚡ (Fast!)
4. **Immediately** redirected to onboarding
5. Completes 3-step business setup
6. Lands on contractor dashboard

**Time:** ~2-3 minutes total

### **New Homeowner Registration:**
1. Visits `/register`
2. Selects "Customer" (default)
3. Creates account ⚡ (Fast!)
4. **Immediately** redirected to homeowner dashboard
5. Can start browsing contractors

**Time:** <1 minute

### **Returning User Login:**
1. Visits `/login`
2. Signs in ⚡ (Fast!)
3. **Automatically** routed to correct dashboard
4. Ready to use platform

**Time:** <5 seconds

---

## 📍 Key Routes

| Route | Purpose | Who |
|-------|---------|-----|
| `/register` | Create account | Everyone |
| `/login` | Sign in | Everyone |
| `/dashboard-user` | Smart router | Internal (redirects) |
| `/onboarding-contractor` | Business setup | New contractors |
| `/dashboard-homeowner` | Customer features | Homeowners |
| Contractor dashboard pages | Business management | Contractors with listings |

---

## 🔒 Route Protection

### **Public Routes:**
- `/` (Homepage)
- `/register`
- `/login`
- `/forgot-password`
- Listing browse pages

### **Protected Routes:**
All dashboard pages require authentication and redirect to `/login` if not signed in.

### **Role-Based Routes:**

**Homeowner Only:**
- `/dashboard-homeowner`
- `/dashboard-homeowner/bookmarks`
- `/dashboard-homeowner/profile`

**Contractor Only:**
- `/onboarding-contractor` (if no listing)
- `/dashboard-add-listing`
- `/dashboard-my-listings`
- `/dashboard-reviews`
- All other contractor dashboard pages

---

## 🎯 Firebase User Data

### **User Document Structure:**
```typescript
{
  id: string,
  email: string,
  displayName: string,
  userType: 'contractor' | 'customer', // ← Key field
  // ... other fields
}
```

The `userType` field determines routing behavior throughout the app.

---

## ✅ Testing the Flow

### **Test 1: Contractor Registration**
1. Go to http://localhost:3000/register
2. Fill in details
3. Select **"Contractor"** from dropdown
4. Click "Create Account"
5. ✅ Should redirect to `/onboarding-contractor`

### **Test 2: Homeowner Registration**
1. Go to http://localhost:3000/register
2. Fill in details
3. Select **"Customer"** from dropdown (or leave default)
4. Click "Create Account"
5. ✅ Should redirect to `/dashboard-homeowner`

### **Test 3: Login Routing**
1. Go to http://localhost:3000/login
2. Sign in with existing account
3. ✅ Contractors with listings → Contractor dashboard
4. ✅ Contractors without listings → Onboarding
5. ✅ Customers → Homeowner dashboard

---

## 🚀 Performance Notes

All redirects are **instant** thanks to:
- Non-blocking auth operations
- 30-second caching for listing checks
- Optimistic UI updates
- Progressive data loading

Users experience **smooth, fast transitions** between pages! ⚡

---

**Last Updated:** November 8, 2025
**Status:** Smart routing fully implemented and tested

