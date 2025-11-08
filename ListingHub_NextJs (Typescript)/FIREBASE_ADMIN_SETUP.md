# Firebase Admin SDK Setup

## Option 1: Using serviceAccountKey.json File (Recommended for Local Development)

1. **Download the Service Account Key from Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `northern-contractor-netw-5b5a7`
   - Go to **Project Settings** (gear icon) > **Service accounts**
   - Click **Generate new private key**
   - Save the downloaded JSON file

2. **Place the file in your project root:**
   - Rename the downloaded file to `serviceAccountKey.json`
   - Place it in: `/Users/ethanruskin/Desktop/NorthernContractorDirectory/ListingHub_NextJs (Typescript)/serviceAccountKey.json`
   - **IMPORTANT:** This file is already in `.gitignore` - DO NOT commit it to git!

3. **The code will automatically use this file:**
   - The `firebase-admin.ts` file will automatically detect and use `serviceAccountKey.json` if it exists
   - No need to update `.env.local` when using this method

## Option 2: Using Environment Variables (Recommended for Production/Deployment)

If you prefer using environment variables (better for deployment platforms like Vercel):

1. **Get the credentials from the service account JSON:**
   - Open the `serviceAccountKey.json` file you downloaded
   - Extract these values:
     - `project_id` → Use as `FIREBASE_ADMIN_PROJECT_ID`
     - `client_email` → Use as `FIREBASE_ADMIN_CLIENT_EMAIL`
     - `private_key` → Use as `FIREBASE_ADMIN_PRIVATE_KEY` (keep the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

2. **Update your `.env.local` file:**
   ```env
   FIREBASE_ADMIN_PROJECT_ID=northern-contractor-netw-5b5a7
   FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account@northern-contractor-netw-5b5a7.iam.gserviceaccount.com
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----\n"
   ```

3. **Important notes for private key:**
   - Keep the quotes around the private key
   - Replace `\n` with actual newlines in the key (or use `\\n` in the env file)
   - The key should be on a single line in the env file with `\n` for line breaks

## Verification

After setting up either method, test it by:

1. Starting your development server:
   ```bash
   npm run dev
   ```

2. Check the console for any Firebase Admin initialization errors
3. Try accessing an API route that uses Firebase Admin (like `/api/listings`)

## Security Notes

- ⚠️ **NEVER commit `serviceAccountKey.json` to git** (already in `.gitignore`)
- ⚠️ **NEVER commit `.env.local` to git** (already in `.gitignore`)
- ⚠️ For production, use environment variables in your deployment platform (Vercel, Firebase Functions, etc.)
- ⚠️ The service account key has admin access to your Firebase project - keep it secure!

## Current Status

✅ Code updated to support both methods
✅ `serviceAccountKey.json` added to `.gitignore`
✅ Falls back to environment variables if JSON file not found

## Next Steps

1. Download your service account key from Firebase Console
2. Place it as `serviceAccountKey.json` in the project root
3. Restart your dev server
4. Test authentication and API routes

