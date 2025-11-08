# Setup Guide for ListingHub Contractor Directory

This guide will help you set up all external services and configure the application for production use.

## Prerequisites

- Node.js 18+ and npm installed
- A Firebase account (free tier available)
- A Stripe account (for payments)
- A Google Cloud account (for Maps API)
- A Vercel account (for deployment, optional)

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name: `listinghub` (or your preferred name)
   - Enable Google Analytics (optional)
   - Click "Create project"

### 1.2 Enable Firebase Services

#### Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click and enable
   - **Google**: Click, enable, and follow setup (requires OAuth consent screen)
   - **Facebook**: Click, enable, and follow setup (requires Facebook App ID/Secret)

#### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll use security rules)
4. Select a location (choose closest to your users)
5. Click "Enable"

#### Storage
1. Go to **Storage**
2. Click "Get started"
3. Choose "Start in production mode" (we'll use security rules)
4. Select a location (same as Firestore)
5. Click "Done"

### 1.3 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register app with a nickname (e.g., "ListingHub Web")
5. Copy the Firebase configuration object

### 1.4 Set Up Firebase Admin SDK

1. Go to **Project Settings** > **Service accounts**
2. Click "Generate new private key"
3. Save the JSON file securely (DO NOT commit to git)
4. You'll need the `project_id`, `client_email`, and `private_key` from this file

### 1.5 Deploy Firestore Security Rules

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   cd "ListingHub_NextJs (Typescript)"
   firebase init firestore
   ```
   - Select your Firebase project
   - Use existing `firestore.rules` file
   - Use existing `firestore.indexes.json` file

4. Deploy rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

### 1.6 Set Up Storage Security Rules

1. In Firebase Console, go to **Storage** > **Rules**
2. Replace the default rules with:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Users can upload to their own folder
       match /users/{userId}/{allPaths=**} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Listing images
       match /listings/{listingId}/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
3. Click "Publish"

## Step 2: Stripe Setup

### 2.1 Create Stripe Account

1. Go to [Stripe](https://stripe.com/)
2. Sign up for an account (test mode is available)
3. Complete account verification

### 2.2 Get API Keys

1. In Stripe Dashboard, go to **Developers** > **API keys**
2. Copy the following:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Click "Reveal test key" to see secret key

### 2.3 Set Up Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click "Add endpoint"
3. Enter endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - For local testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli)
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)

### 2.4 Local Webhook Testing (Optional)

For local development, use Stripe CLI:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Or download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will provide a webhook signing secret starting with `whsec_` - use this in your `.env.local`.

## Step 3: Google Maps API Setup

### 3.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Maps JavaScript API"
   - Click and enable

### 3.2 Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Recommended) Restrict the API key:
   - Click on the key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Maps JavaScript API"
   - Under "Application restrictions", add your website domain

### 3.3 Enable Billing

Google Maps API requires billing to be enabled (free tier available):
- Go to **Billing** in Google Cloud Console
- Link a billing account
- Free tier: $200 credit per month

## Step 4: Environment Variables Setup

### 4.1 Create Environment Files

1. In the project root, create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in all values in `.env.local`:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (Server-side only)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4.2 Important Notes

- **Never commit `.env.local` to git** - it's already in `.gitignore`
- The `FIREBASE_ADMIN_PRIVATE_KEY` should include the entire private key including `\n` characters
- For production, use production API keys and update `NEXT_PUBLIC_APP_URL`

## Step 5: Seed Initial Data (Optional)

Create a script to seed categories and initial data:

```typescript
// scripts/seed.ts
import { adminDb } from '../src/lib/firebase-admin';

async function seedCategories() {
  const categories = [
    { name: 'Plumbing', slug: 'plumbing', icon: 'fa-faucet' },
    { name: 'Electrical', slug: 'electrical', icon: 'fa-bolt' },
    { name: 'HVAC', slug: 'hvac', icon: 'fa-fan' },
    { name: 'Roofing', slug: 'roofing', icon: 'fa-home' },
    { name: 'General Contractors', slug: 'general-contractors', icon: 'fa-tools' },
  ];

  for (const category of categories) {
    await adminDb.collection('categories').add({
      ...category,
      listingCount: 0,
      createdAt: new Date(),
    });
  }
}

seedCategories().then(() => {
  console.log('Categories seeded successfully');
  process.exit(0);
});
```

Run with: `npx ts-node scripts/seed.ts`

## Step 6: Vercel Deployment Setup

### 6.1 Prepare for Deployment

1. Push your code to GitHub/GitLab/Bitbucket

2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

3. Deploy:
   ```bash
   vercel
   ```

### 6.2 Configure Environment Variables in Vercel

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** > **Environment Variables**
3. Add all environment variables from `.env.local`
4. Make sure to add them for:
   - **Production**
   - **Preview**
   - **Development** (optional)

### 6.3 Update Stripe Webhook URL

1. In Stripe Dashboard, update webhook endpoint URL to:
   `https://your-vercel-domain.vercel.app/api/webhooks/stripe`

2. Copy the new webhook signing secret and update in Vercel environment variables

## Step 7: Testing the Setup

### 7.1 Test Firebase Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/register`
3. Try creating an account with email/password
4. Try Google/Facebook login (if configured)

### 7.2 Test Firestore

1. Check Firebase Console > Firestore Database
2. You should see a `users` collection with your test user

### 7.3 Test Stripe (Test Mode)

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any CVC
4. Create a test booking and complete payment

### 7.4 Test Google Maps

1. Navigate to a page with a map component
2. Map should load and display markers

## Step 8: Production Checklist

Before going live:

- [ ] Switch Stripe to live mode
- [ ] Update all API keys to production keys
- [ ] Verify Firebase security rules
- [ ] Set up Firebase App Check for security
- [ ] Configure custom domain in Vercel
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable Firebase backups
- [ ] Test all payment flows
- [ ] Test authentication flows
- [ ] Verify webhook endpoints are working
- [ ] Set up monitoring and alerts

## Troubleshooting

### Firebase Admin SDK Error
- Ensure `FIREBASE_ADMIN_PRIVATE_KEY` includes `\n` characters
- Verify service account email is correct
- Check project ID matches

### Stripe Webhook Not Working
- Verify webhook URL is correct
- Check webhook signing secret matches
- Use Stripe Dashboard to view webhook logs

### Maps Not Loading
- Verify API key is correct
- Check API restrictions in Google Cloud Console
- Ensure billing is enabled

### Authentication Issues
- Verify Firebase Auth providers are enabled
- Check OAuth redirect URIs are configured
- Verify Firebase config in environment variables

## Support

For issues or questions:
- Firebase: [Firebase Support](https://firebase.google.com/support)
- Stripe: [Stripe Support](https://support.stripe.com/)
- Google Maps: [Google Cloud Support](https://cloud.google.com/support)

