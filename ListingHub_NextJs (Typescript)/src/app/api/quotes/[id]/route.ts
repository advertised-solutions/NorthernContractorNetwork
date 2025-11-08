import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Quote, ApiResponse } from '@/types';

// GET /api/quotes/[id] - Get a single quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const doc = await adminDb.collection('quotes').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    const data = doc.data();
    const quote: Quote = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date(),
      updatedAt: data?.updatedAt?.toDate() || new Date(),
    } as Quote;

    return NextResponse.json({
      success: true,
      data: quote,
    } as ApiResponse<Quote>);
  } catch (error: any) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// PATCH /api/quotes/[id] - Update quote status (accept/reject/withdraw)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, userId } = body;

    const quoteDoc = await adminDb.collection('quotes').doc(id).get();
    if (!quoteDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    const quoteData = quoteDoc.data();

    // Validate status update
    if (status && !['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // If accepting a quote, update job status to 'hired' and reject other quotes
    if (status === 'accepted') {
      const jobDoc = await adminDb.collection('jobs').doc(quoteData?.jobId).get();
      const jobData = jobDoc.data();

      // Verify user is the job owner
      if (jobData?.userId !== userId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' } as ApiResponse<null>,
          { status: 403 }
        );
      }

      // Update job status
      await adminDb.collection('jobs').doc(quoteData?.jobId).update({
        status: 'hired',
        updatedAt: new Date(),
      });

      // Reject all other quotes for this job
      const otherQuotes = await adminDb
        .collection('quotes')
        .where('jobId', '==', quoteData?.jobId)
        .where('status', '==', 'pending')
        .get();

      const batch = adminDb.batch();
      otherQuotes.docs.forEach((doc) => {
        if (doc.id !== id) {
          batch.update(doc.ref, { status: 'rejected', updatedAt: new Date() });
        }
      });
      await batch.commit();

      // Create notification for accepted contractor
      await adminDb.collection('notifications').add({
        userId: quoteData?.contractorId,
        type: 'quote',
        title: 'Quote Accepted!',
        message: `Your quote has been accepted for "${jobData?.title}"`,
        read: false,
        link: `/jobs/${quoteData?.jobId}`,
        metadata: { jobId: quoteData?.jobId, quoteId: id },
        createdAt: new Date(),
      });
    }

    // Update quote
    await adminDb.collection('quotes').doc(id).update({
      status,
      updatedAt: new Date(),
    });

    // Get updated quote
    const updatedDoc = await adminDb.collection('quotes').doc(id).get();
    const data = updatedDoc.data();
    const quote: Quote = {
      id: updatedDoc.id,
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date(),
      updatedAt: data?.updatedAt?.toDate() || new Date(),
    } as Quote;

    return NextResponse.json({
      success: true,
      data: quote,
      message: 'Quote updated successfully',
    } as ApiResponse<Quote>);
  } catch (error: any) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// DELETE /api/quotes/[id] - Delete a quote (contractor only, if pending)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const quoteDoc = await adminDb.collection('quotes').doc(id).get();
    if (!quoteDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    const quoteData = quoteDoc.data();

    // Only allow deletion of pending quotes
    if (quoteData?.status !== 'pending' && quoteData?.status !== 'withdrawn') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete accepted or rejected quotes' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    await adminDb.collection('quotes').doc(id).delete();

    // Update job quote count
    const jobDoc = await adminDb.collection('jobs').doc(quoteData?.jobId).get();
    if (jobDoc.exists) {
      const jobData = jobDoc.data();
      await adminDb
        .collection('jobs')
        .doc(quoteData?.jobId)
        .update({
          quoteCount: Math.max(0, (jobData?.quoteCount || 1) - 1),
          updatedAt: new Date(),
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully',
    } as ApiResponse<null>);
  } catch (error: any) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

