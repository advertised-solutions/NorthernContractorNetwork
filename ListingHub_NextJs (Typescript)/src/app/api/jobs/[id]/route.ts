import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Job, ApiResponse } from '@/types';

// GET /api/jobs/[id] - Get a single job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const doc = await adminDb.collection('jobs').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: 'Job not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    const data = doc.data();
    const job: Job = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date(),
      updatedAt: data?.updatedAt?.toDate() || new Date(),
      expiresAt: data?.expiresAt?.toDate() || new Date(),
    } as Job;

    return NextResponse.json({
      success: true,
      data: job,
    } as ApiResponse<Job>);
  } catch (error: any) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id] - Update a job
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if job exists
    const doc = await adminDb.collection('jobs').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: 'Job not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Update allowed fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    const allowedFields = [
      'title',
      'description',
      'budget',
      'timeline',
      'status',
      'images',
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    await adminDb.collection('jobs').doc(id).update(updateData);

    // Get updated job
    const updatedDoc = await adminDb.collection('jobs').doc(id).get();
    const data = updatedDoc.data();
    const job: Job = {
      id: updatedDoc.id,
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date(),
      updatedAt: data?.updatedAt?.toDate() || new Date(),
      expiresAt: data?.expiresAt?.toDate() || new Date(),
    } as Job;

    return NextResponse.json({
      success: true,
      data: job,
      message: 'Job updated successfully',
    } as ApiResponse<Job>);
  } catch (error: any) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if job exists
    const doc = await adminDb.collection('jobs').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: 'Job not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Delete associated quotes
    const quotesSnapshot = await adminDb
      .collection('quotes')
      .where('jobId', '==', id)
      .get();

    const batch = adminDb.batch();
    quotesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    batch.delete(adminDb.collection('jobs').doc(id));
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    } as ApiResponse<null>);
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

