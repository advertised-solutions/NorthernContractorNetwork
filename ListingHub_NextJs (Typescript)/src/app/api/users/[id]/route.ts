import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { User } from '@/types';

// GET /api/users/[id] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return errorResponse('User not found', 404);
    }
    
    const userData = userDoc.data();
    const user: User = {
      id: userDoc.id,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      userType: userData.userType,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      zipCode: userData.zipCode,
      bio: userData.bio,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date(),
      emailVerified: userData.emailVerified || false,
      walletBalance: userData.walletBalance || 0,
      subscriptionStatus: userData.subscriptionStatus,
      subscriptionPlan: userData.subscriptionPlan,
    };
    
    return successResponse(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return errorResponse('Failed to fetch user', 500);
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    if (uid !== userId) {
      return errorResponse('Forbidden: Cannot update another user\'s profile', 403);
    }
    
    const body = await request.json();
    
    // Update user document
    await adminDb.collection('users').doc(userId).update({
      ...body,
      updatedAt: new Date(),
    });
    
    // Fetch updated user
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    const user: User = {
      id: userDoc.id,
      email: userData!.email,
      displayName: userData!.displayName,
      photoURL: userData!.photoURL,
      userType: userData!.userType,
      phoneNumber: userData!.phoneNumber,
      address: userData!.address,
      city: userData!.city,
      state: userData!.state,
      zipCode: userData!.zipCode,
      bio: userData!.bio,
      createdAt: userData!.createdAt?.toDate() || new Date(),
      updatedAt: userData!.updatedAt?.toDate() || new Date(),
      emailVerified: userData!.emailVerified || false,
      walletBalance: userData!.walletBalance || 0,
      subscriptionStatus: userData!.subscriptionStatus,
      subscriptionPlan: userData!.subscriptionPlan,
    };
    
    return successResponse(user, 'User profile updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    return errorResponse('Failed to update user', 500);
  }
}

