// Quick verification script for Firebase configuration
const fs = require('fs');
const path = require('path');

console.log('\n=== Firebase Client Configuration Verification ===\n');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  console.log('❌ .env.local file not found!\n');
  process.exit(1);
}

// Extract values from .env.local
const getEnvValue = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  return match ? match[1].trim() : null;
};

const firebaseConfig = {
  apiKey: getEnvValue('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvValue('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvValue('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvValue('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvValue('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvValue('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnvValue('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

const expectedValues = {
  apiKey: 'AIzaSyDf7ntA_Z5V-DTkpqzNIIigKxLtvTqvAJc',
  authDomain: 'northern-contractor-netw-5b5a7.firebaseapp.com',
  projectId: 'northern-contractor-netw-5b5a7',
  storageBucket: 'northern-contractor-netw-5b5a7.firebasestorage.app',
  messagingSenderId: '501446621399',
  appId: '1:501446621399:web:b94c3a9e6ca2c0c5459892',
  measurementId: 'G-Z0XYVGLFGH',
};

let allMatch = true;
for (const [key, expectedValue] of Object.entries(expectedValues)) {
  const actualValue = firebaseConfig[key];
  const match = actualValue === expectedValue;
  const status = match ? '✅' : '❌';
  console.log(`${status} ${key}:`);
  console.log(`   Expected: ${expectedValue}`);
  console.log(`   Actual:   ${actualValue || 'MISSING'}`);
  if (!match) allMatch = false;
  console.log('');
}

console.log('\n=== Firebase Admin SDK Status ===\n');
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
  console.log('✅ serviceAccountKey.json found');
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log(`   Project ID: ${serviceAccount.project_id}`);
    console.log(`   Client Email: ${serviceAccount.client_email ? 'Set' : 'Missing'}`);
    console.log(`   Private Key: ${serviceAccount.private_key ? 'Set' : 'Missing'}`);
  } catch (e) {
    console.log('❌ Error reading serviceAccountKey.json: ' + e.message);
  }
} else {
  console.log('⚠️  serviceAccountKey.json not found');
  const adminPrivateKey = getEnvValue('FIREBASE_ADMIN_PRIVATE_KEY');
  if (adminPrivateKey && adminPrivateKey.includes('placeholder')) {
    console.log('   ⚠️  Admin credentials are still placeholders');
    console.log('   📝 Add serviceAccountKey.json or update .env.local with real credentials');
  } else if (adminPrivateKey) {
    console.log('   ✅ Admin credentials found in .env.local');
  } else {
    console.log('   ❌ No admin credentials found');
  }
}

console.log('\n=== Summary ===\n');
if (allMatch) {
  console.log('✅ All Firebase client keys are correctly configured!');
  console.log('✅ Firebase client-side authentication should work');
  console.log('✅ Firestore database connection should work');
  console.log('✅ Firebase Storage should work');
} else {
  console.log('❌ Some Firebase keys do not match. Please check your .env.local file');
}

console.log('\n=== Next Steps ===\n');
console.log('1. ✅ Client-side Firebase is configured');
console.log('2. ⚠️  Add serviceAccountKey.json for Admin SDK (for API routes)');
console.log('3. ✅ Test authentication: Try registering/logging in');
console.log('4. ✅ Verify Firestore: Check if data saves correctly');
console.log('\n');
