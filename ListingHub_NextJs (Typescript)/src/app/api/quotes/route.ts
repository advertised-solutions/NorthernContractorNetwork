import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Quote, ApiResponse, PaginatedResponse } from '@/types';

// GET /api/quotes - Get quotes for a contractor or homeowner
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contractorId = searchParams.get('contractorId');
    const homeownerId = searchParams.get('homeownerId');
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    if (!contractorId && !homeownerId && !jobId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Must provide contractorId, homeownerId, or jobId',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    let query = adminDb.collection('quotes').orderBy('createdAt', 'desc');

    if (contractorId) {
      query = query.where('contractorId', '==', contractorId) as any;
    }
    
    if (jobId) {
      query = query.where('jobId', '==', jobId) as any;
    }

    if (status) {
      query = query.where('status', '==', status) as any;
    }

    // If filtering by homeownerId, we need to get their jobs first
    let jobIds: string[] = [];
    if (homeownerId) {
      const jobsSnapshot = await adminDb
        .collection('jobs')
        .where('userId', '==', homeownerId)
        .get();
      
      jobIds = jobsSnapshot.docs.map((doc) => doc.id);
      
      if (jobIds.length === 0) {
        return NextResponse.json({
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            hasMore: false,
          },
        } as PaginatedResponse<Quote>);
      }

      // Firestore 'in' queries limited to 10 items, so we need to handle larger arrays
      query = query.where('jobId', 'in', jobIds.slice(0, 10)) as any;
    }

    // Get total count
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset) as any;

    const snapshot = await query.get();

    const quotes: Quote[] = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Get contractor info
      let contractorName, contractorPhoto, contractorRating;
      if (data.contractorId) {
        const userDoc = await adminDb.collection('users').doc(data.contractorId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          contractorName = userData?.displayName;
          contractorPhoto = userData?.photoURL;
        }
        
        const listingSnapshot = await adminDb
          .collection('listings')
          .where('userId', '==', data.contractorId)
          .limit(1)
          .get();
        
        if (!listingSnapshot.empty) {
          const listingData = listingSnapshot.docs[0].data();
          contractorRating = listingData?.ratingValue;
        }
      }

      quotes.push({
        id: doc.id,
        ...data,
        contractorName,
        contractorPhoto,
        contractorRating,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Quote);
    }

    const response: PaginatedResponse<Quote> = {
      data: quotes,
      pagination: {
        page,
        limit,
        total,
        hasMore: offset + quotes.length < total,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

