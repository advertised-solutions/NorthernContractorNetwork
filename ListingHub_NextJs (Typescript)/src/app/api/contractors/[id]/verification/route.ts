import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse } from '@/lib/api-helpers';
import { updateContractorBadges } from '@/lib/badge-calculator';

// GET /api/contractors/[id]/verification - Get verification status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: contractorId } = params;

    const profileDoc = await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .get();

    if (!profileDoc.exists) {
      return errorResponse('Contractor profile not found', 404);
    }

    const profile = profileDoc.data()!;

    const verification = {
      verifiedInsurance: profile.verifiedInsurance || false,
      verifiedLicense: profile.verifiedLicense || false,
      insuranceDocument: profile.insuranceDocument,
      licenseDocument: profile.licenseDocument,
      licenseNumber: profile.licenseNumber,
      insuranceExpiry: profile.insuranceExpiry?.toDate() || null,
    };

    return successResponse(verification, 'Verification status retrieved');
  } catch (error) {
    console.error('Error getting verification status:', error);
    return errorResponse('Failed to get verification status', 500);
  }
}

// POST /api/contractors/[id]/verification - Submit documents for verification
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }

    const { id: contractorId } = params;

    // Verify user owns this contractor profile
    if (uid !== contractorId) {
      return errorResponse('Unauthorized: You can only update your own profile', 403);
    }

    const body = await request.json();
    const {
      licenseDocument,
      insuranceDocument,
      licenseNumber,
      insuranceExpiry,
    } = body;

    // Get or create contractor profile
    let profileDoc = await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .get();

    if (!profileDoc.exists) {
      // Create default profile
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

    // Update documents (set to pending verification)
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (licenseDocument) {
      updateData.licenseDocument = licenseDocument;
      updateData.licenseNumber = licenseNumber || null;
      updateData.verifiedLicense = false; // Reset verification status
    }

    if (insuranceDocument) {
      updateData.insuranceDocument = insuranceDocument;
      updateData.insuranceExpiry = insuranceExpiry
        ? new Date(insuranceExpiry)
        : null;
      updateData.verifiedInsurance = false; // Reset verification status
    }

    await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .update(updateData);

    // Create notification for admin review
    await adminDb.collection('notifications').add({
      userId: 'admin', // Special admin user ID
      type: 'system',
      title: 'New Verification Request',
      message: `Contractor ${contractorId} has submitted documents for verification`,
      read: false,
      link: `/admin/verifications/${contractorId}`,
      metadata: { contractorId },
      createdAt: new Date(),
    });

    return successResponse(
      { documentsSubmitted: true },
      'Documents submitted for verification'
    );
  } catch (error) {
    console.error('Error submitting verification documents:', error);
    return errorResponse('Failed to submit documents', 500);
  }
}

// PATCH /api/contractors/[id]/verification - Admin: Approve/reject verification
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }

    // Check if user is admin
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    // You should implement proper admin role checking
    // For now, we'll use a simple check
    if (userData?.userType !== 'admin' && uid !== 'admin') {
      return errorResponse('Unauthorized: Admin access required', 403);
    }

    const { id: contractorId } = params;
    const body = await request.json();
    const { verifyLicense, verifyInsurance, rejectionReason } = body;

    const profileDoc = await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .get();

    if (!profileDoc.exists) {
      return errorResponse('Contractor profile not found', 404);
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (verifyLicense !== undefined) {
      updateData.verifiedLicense = verifyLicense;
    }

    if (verifyInsurance !== undefined) {
      updateData.verifiedInsurance = verifyInsurance;
    }

    if (rejectionReason) {
      updateData.verificationRejectionReason = rejectionReason;
    }

    await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .update(updateData);

    // Update badges if both are verified
    const updatedProfile = await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .get();
    const profile = updatedProfile.data()!;

    if (profile.verifiedInsurance && profile.verifiedLicense) {
      await updateContractorBadges(contractorId);
    }

    // Notify contractor
    const status =
      verifyLicense === true || verifyInsurance === true
        ? 'approved'
        : 'rejected';
    
    await adminDb.collection('notifications').add({
      userId: contractorId,
      type: 'system',
      title: `Verification ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message:
        status === 'approved'
          ? 'Your documents have been verified! You now have the Verified Pro badge.'
          : `Your verification was rejected: ${rejectionReason || 'Please resubmit valid documents'}`,
      read: false,
      link: '/dashboard-my-profile',
      metadata: { verificationStatus: status },
      createdAt: new Date(),
    });

    return successResponse(
      { verified: status === 'approved' },
      `Verification ${status}`
    );
  } catch (error) {
    console.error('Error updating verification status:', error);
    return errorResponse('Failed to update verification', 500);
  }
}

