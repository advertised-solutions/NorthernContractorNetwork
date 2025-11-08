import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { Category } from '@/types';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const categoriesSnapshot = await adminDb.collection('categories').get();
    
    const categories: Category[] = categoriesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        icon: data.icon,
        image: data.image,
        description: data.description,
        listingCount: data.listingCount || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
    
    return successResponse(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
}

