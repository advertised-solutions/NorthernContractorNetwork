import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Quote, ApiResponse } from '@/types';

// GET /api/jobs/[id]/quotes - Get all quotes for a job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: jobId } = params;

    // Check if job exists
    const jobDoc = await adminDb.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Job not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Get quotes for this job
    const quotesSnapshot = await adminDb
      .collection('quotes')
      .where('jobId', '==', jobId)
      .orderBy('createdAt', 'desc')
      .get();

    const quotes: Quote[] = [];
    for (const doc of quotesSnapshot.docs) {
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
        
        // Get contractor rating from listings
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

    return NextResponse.json({
      success: true,
      data: quotes,
    } as ApiResponse<Quote[]>);
  } catch (error: any) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// POST /api/jobs/[id]/quotes - Submit a quote for a job
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: jobId } = params;
    const body = await request.json();
    const { contractorId, amount, description, timeline } = body;

    // Validate required fields
    if (!contractorId || !amount || !description || !timeline) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if job exists and is still open
    const jobDoc = await adminDb.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Job not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    const jobData = jobDoc.data();
    if (jobData?.status !== 'open') {
      return NextResponse.json(
        { success: false, error: 'Job is no longer accepting quotes' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if contractor already submitted a quote
    const existingQuote = await adminDb
      .collection('quotes')
      .where('jobId', '==', jobId)
      .where('contractorId', '==', contractorId)
      .limit(1)
      .get();

    if (!existingQuote.empty) {
      return NextResponse.json(
        { success: false, error: 'You have already submitted a quote for this job' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check contractor subscription for quote limits
    const contractorProfileDoc = await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .get();

    if (contractorProfileDoc.exists) {
      const profile = contractorProfileDoc.data();
      const subscriptionTier = profile?.subscriptionTier || 'free';

      // Check if contractor has permission to submit quote
      if (subscriptionTier === 'free') {
        // Check monthly quote limit for free tier (3 quotes per month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const quotesThisMonth = await adminDb
          .collection('quotes')
          .where('contractorId', '==', contractorId)
          .where('createdAt', '>=', startOfMonth)
          .count()
          .get();

        if (quotesThisMonth.data().count >= 3) {
          return NextResponse.json(
            {
              success: false,
              error: 'Monthly quote limit reached. Upgrade to Pro or Elite for unlimited quotes.',
            } as ApiResponse<null>,
            { status: 403 }
          );
        }
      }
    }

    // Create quote
    const now = new Date();
    const quoteData = {
      jobId,
      contractorId,
      amount,
      description,
      timeline,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const quoteRef = await adminDb.collection('quotes').add(quoteData);

    // Update job quote count
    await adminDb
      .collection('jobs')
      .doc(jobId)
      .update({
        quoteCount: (jobData?.quoteCount || 0) + 1,
        updatedAt: now,
      });

    // Create notification for job poster
    await adminDb.collection('notifications').add({
      userId: jobData?.userId,
      type: 'quote',
      title: 'New Quote Received',
      message: `You received a new quote for "${jobData?.title}"`,
      read: false,
      link: `/jobs/${jobId}`,
      metadata: { jobId, quoteId: quoteRef.id },
      createdAt: now,
    });

    const quote: Quote = {
      id: quoteRef.id,
      ...quoteData,
    } as Quote;

    return NextResponse.json({
      success: true,
      data: quote,
      message: 'Quote submitted successfully',
    } as ApiResponse<Quote>);
  } catch (error: any) {
    console.error('Error submitting quote:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

