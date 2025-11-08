import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse } from '@/lib/api-helpers';

interface CategoryRequest {
  categoryName: string;
  description: string;
  name: string;
  email: string;
  phone?: string;
  reason: string;
}

// POST /api/category-requests - Submit a new category request
export async function POST(request: NextRequest) {
  try {
    const body: CategoryRequest = await request.json();
    
    // Validate required fields
    if (!body.categoryName || !body.description || !body.name || !body.email || !body.reason) {
      return errorResponse('Missing required fields', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return errorResponse('Invalid email format', 400);
    }

    // Save to Firestore
    const categoryRequestRef = await adminDb.collection('categoryRequests').add({
      categoryName: body.categoryName.trim(),
      description: body.description.trim(),
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || '',
      reason: body.reason.trim(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return successResponse(
      { id: categoryRequestRef.id },
      'Category request submitted successfully'
    );
  } catch (error) {
    console.error('Error submitting category request:', error);
    return errorResponse('Failed to submit category request', 500);
  }
}

// GET /api/category-requests - Get all category requests (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const categoryRequestsSnapshot = await adminDb.collection('categoryRequests')
      .orderBy('createdAt', 'desc')
      .get();
    
    const requests = categoryRequestsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    });
    
    return successResponse(requests);
  } catch (error) {
    console.error('Error fetching category requests:', error);
    return errorResponse('Failed to fetch category requests', 500);
  }
}

