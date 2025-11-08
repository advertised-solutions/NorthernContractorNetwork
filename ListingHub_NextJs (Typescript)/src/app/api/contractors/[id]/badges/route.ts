import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { updateContractorBadges } from '@/lib/badge-calculator';
import { ApiResponse } from '@/types';

// GET /api/contractors/[id]/badges - Get contractor badges
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: contractorId } = params;

    // Get badges from badges collection
    const badgesSnapshot = await adminDb
      .collection('badges')
      .where('contractorId', '==', contractorId)
      .get();

    const badges = badgesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      awardedAt: doc.data().awardedAt?.toDate() || new Date(),
      expiresAt: doc.data().expiresAt?.toDate() || null,
    }));

    return NextResponse.json({
      success: true,
      data: badges,
    } as ApiResponse<any[]>);
  } catch (error: any) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// POST /api/contractors/[id]/badges - Recalculate and update contractor badges
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: contractorId } = params;

    // Verify contractor profile exists
    const profileDoc = await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .get();

    if (!profileDoc.exists) {
      // Create a default profile if it doesn't exist
      await adminDb.collection('contractor_profiles').doc(contractorId).set({
        userId: contractorId,
        badges: [],
        verifiedInsurance: false,
        verifiedLicense: false,
        serviceAreas: [],
        portfolio: [],
        responseTime: {
          averageMinutes: 0,
          responseCount: 0,
        },
        subscriptionTier: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Calculate and update badges
    await updateContractorBadges(contractorId);

    // Get updated badges
    const badgesSnapshot = await adminDb
      .collection('badges')
      .where('contractorId', '==', contractorId)
      .get();

    const badges = badgesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      awardedAt: doc.data().awardedAt?.toDate() || new Date(),
      expiresAt: doc.data().expiresAt?.toDate() || null,
    }));

    return NextResponse.json({
      success: true,
      data: badges,
      message: 'Badges updated successfully',
    } as ApiResponse<any[]>);
  } catch (error: any) {
    console.error('Error updating badges:', error);
    return NextResponse.json(
      { success: false, error: error.message } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

