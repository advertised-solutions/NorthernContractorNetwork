# Firebase Setup Instructions

## Your Firebase Project Configuration

**Project ID:** `northern-contractor-netw-5b5a7`  
**Project Name:** Northern Contractor Network

## Environment Variables

Update your `.env.local` file with these values:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDf7ntA_Z5V-DTkpqzNIIigKxLtvTqvAJc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=northern-contractor-netw-5b5a7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=northern-contractor-netw-5b5a7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=northern-contractor-netw-5b5a7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=501446621399
NEXT_PUBLIC_FIREBASE_APP_ID=1:501446621399:web:b94c3a9e6ca2c0c5459892
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Z0XYVGLFGH

# Firebase Admin SDK (Server-side only)
# Get these from Firebase Console > Project Settings > Service Accounts
FIREBASE_ADMIN_PROJECT_ID=northern-contractor-netw-5b5a7
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email@northern-contractor-netw-5b5a7.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## Important: Next.js API Routes Limitation

⚠️ **Firebase Hosting with static export does NOT support Next.js API routes.**

If you need API routes (which this project uses extensively), you have two options:

### Option 1: Use Firebase Cloud Functions (Recommended for Firebase)
Convert your API routes to Firebase Cloud Functions. This requires additional setup.

### Option 2: Use Vercel (Recommended for Next.js)
Vercel is optimized for Next.js and supports API routes out of the box. This is the recommended approach.

If you want to use Vercel instead:
1. Remove `output: 'export'` from `next.config.ts`
2. Deploy to Vercel (see SETUP_GUIDE.md)
3. Keep Firebase for backend services (Firestore, Auth, Storage)

## Setup Steps

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

This will open your browser to authenticate.

### 3. Initialize Firebase (if not already done)

```bash
cd "ListingHub_NextJs (Typescript)"
firebase init
```

When prompted:
- Select **Firestore** and **Hosting**
- Use existing `firestore.rules` and `firestore.indexes.json`
- Set public directory to `out` (for Next.js static export)
- Configure as single-page app: **Yes**
- Set up automatic builds: **No** (we'll build manually)

### 4. Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `northern-contractor-netw-5b5a7`
3. Go to **Project Settings** (gear icon) > **Service accounts**
4. Click **Generate new private key**
5. Save the JSON file securely
6. Extract these values for `.env.local`:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` (include the entire key with `\n`)

### 5. Enable Firebase Services

#### Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable:
   - **Email/Password**
   - **Google** (configure OAuth consent screen)
   - **Facebook** (configure with App ID/Secret)

#### Firestore Database
1. Go to **Firestore Database**
2. If not created, click **Create database**
3. Choose **Production mode**
4. Select location (closest to your users)

#### Storage
1. Go to **Storage**
2. If not created, click **Get started**
3. Choose **Start in production mode**
4. Select location (same as Firestore)

### 6. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 7. Build and Deploy

**For static export (no API routes):**
```bash
npm run build
firebase deploy
```

**Or use the deploy script:**
```bash
npm run deploy
```

## Firebase Hosting URL

After deployment, your app will be available at:
- `https://northern-contractor-netw-5b5a7.web.app`
- `https://northern-contractor-netw-5b5a7.firebaseapp.com`

## Custom Domain Setup

1. In Firebase Console, go to **Hosting**
2. Click **Add custom domain**
3. Follow the setup instructions

## Troubleshooting

### API Routes Not Working
If you see errors about API routes, you need to either:
1. Use Vercel for deployment (recommended)
2. Convert API routes to Cloud Functions

### Build Errors
If you get build errors about dynamic routes:
- Check that all pages are properly exported
- Remove any server-side only code from client components

### Authentication Issues
- Verify all providers are enabled in Firebase Console
- Check environment variables are correct
- Ensure Firebase config matches your project

## Next Steps

1. Complete Stripe setup (see SETUP_GUIDE.md)
2. Complete Google Maps API setup (see SETUP_GUIDE.md)
3. Set up environment variables
4. Test authentication flow
5. Deploy and test

