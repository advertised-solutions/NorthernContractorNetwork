import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Job, ApiResponse, PaginatedResponse } from '@/types';

// GET /api/jobs - List jobs with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const status = searchParams.get('status') || 'open';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const contractorId = searchParams.get('contractorId'); // For filtering by contractor's service area

    let query = adminDb.collection('jobs').orderBy('createdAt', 'desc');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status) as any;
    }
    if (categoryId) {
      query = query.where('categoryId', '==', categoryId) as any;
    }
    if (state) {
      query = query.where('location.state', '==', state) as any;
    }
    if (city) {
      query = query.where('location.city', '==', city) as any;
    }

    // Get total count for pagination
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset) as any;

    const snapshot = await query.get();

    const jobs: Job[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      jobs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate() || new Date(),
      } as Job);
    });

    const response: PaginatedResponse<Job> = {
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        hasMore: offset + jobs.length < total,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      title,
      description,
      categoryId,
      location,
      budget,
      timeline,
      images,
    } = body;

    // Validate required fields
    if (!userId || !title || !description || !categoryId || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Create job object
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Jobs expire in 30 days

    const jobData = {
      userId,
      title,
      description,
      categoryId,
      location,
      budget: budget || null,
      timeline: timeline || 'Flexible',
      status: 'open',
      quoteCount: 0,
      images: images || [],
      createdAt: now,
      updatedAt: now,
      expiresAt,
    };

    // Get category name
    const categoryDoc = await adminDb.collection('categories').doc(categoryId).get();
    if (categoryDoc.exists) {
      (jobData as any).categoryName = categoryDoc.data()?.name;
    }

    // Add to Firestore
    const docRef = await adminDb.collection('jobs').add(jobData);

    const job: Job = {
      id: docRef.id,
      ...jobData,
    } as Job;

    // Create notification for contractors in this category
    // TODO: Implement notification system for contractors

    return NextResponse.json({
      success: true,
      data: job,
      message: 'Job posted successfully',
    } as ApiResponse<Job>);
  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

