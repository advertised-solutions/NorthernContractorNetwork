import { adminDb } from './firebase-admin';
import { BadgeType, ContractorProfile } from '@/types';

/**
 * Calculate and award badges to a contractor based on their performance
 */
export async function calculateContractorBadges(contractorId: string): Promise<BadgeType[]> {
  const badges: BadgeType[] = [];

  try {
    // Get contractor profile
    const profileDoc = await adminDb
      .collection('contractor_profiles')
      .doc(contractorId)
      .get();

    if (!profileDoc.exists) {
      return badges;
    }

    const profile = profileDoc.data() as ContractorProfile;

    // Check for subscription-based badges
    if (profile.subscriptionTier === 'elite') {
      badges.push('elite_member');
    } else if (profile.subscriptionTier === 'pro') {
      badges.push('pro_member');
    }

    // Check for verified pro badge (license and insurance)
    if (profile.verifiedInsurance && profile.verifiedLicense) {
      badges.push('verified_pro');
    }

    // Get contractor's listing(s)
    const listingsSnapshot = await adminDb
      .collection('listings')
      .where('userId', '==', contractorId)
      .get();

    if (!listingsSnapshot.empty) {
      const listing = listingsSnapshot.docs[0].data();

      // Check for Top Rated badge (4.5+ stars, 10+ reviews)
      const reviewCount = listing.reviewCount || 0;
      const ratingValue = listing.ratingValue || 0;

      if (reviewCount >= 10 && ratingValue >= 4.5) {
        badges.push('top_rated');
      }

      // Check for Quick Responder badge (avg response time < 120 minutes = 2 hours)
      if (
        profile.responseTime &&
        profile.responseTime.averageMinutes < 120 &&
        profile.responseTime.responseCount >= 5
      ) {
        badges.push('quick_responder');
      }
    }

    // Check for Best of Year badge (Top 5% in category)
    const categoryPerformance = await checkBestOfYearEligibility(contractorId);
    if (categoryPerformance) {
      badges.push('best_of_year');
    }

    return badges;
  } catch (error) {
    console.error('Error calculating badges:', error);
    return badges;
  }
}

/**
 * Check if contractor is in top 5% of their category
 */
async function checkBestOfYearEligibility(contractorId: string): Promise<boolean> {
  try {
    // Get contractor's listings
    const listingsSnapshot = await adminDb
      .collection('listings')
      .where('userId', '==', contractorId)
      .limit(1)
      .get();

    if (listingsSnapshot.empty) {
      return false;
    }

    const listing = listingsSnapshot.docs[0].data();
    const categoryId = listing.categoryId;
    const contractorRating = listing.ratingValue || 0;
    const reviewCount = listing.reviewCount || 0;

    // Minimum requirements: 20+ reviews, 4.7+ rating
    if (reviewCount < 20 || contractorRating < 4.7) {
      return false;
    }

    // Get all contractors in same category
    const categoryListings = await adminDb
      .collection('listings')
      .where('categoryId', '==', categoryId)
      .get();

    if (categoryListings.empty) {
      return false;
    }

    // Calculate scores for all contractors (rating * log(reviewCount + 1))
    const scores = categoryListings.docs.map((doc) => {
      const data = doc.data();
      const rating = data.ratingValue || 0;
      const reviews = data.reviewCount || 0;
      return {
        userId: data.userId,
        score: rating * Math.log(reviews + 1),
      };
    });

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    // Find contractor's rank
    const contractorRank =
      scores.findIndex((s) => s.userId === contractorId) + 1;

    // Top 5% check
    const top5PercentThreshold = Math.ceil(scores.length * 0.05);

    return contractorRank > 0 && contractorRank <= top5PercentThreshold;
  } catch (error) {
    console.error('Error checking best of year eligibility:', error);
    return false;
  }
}

/**
 * Update all badges for a contractor
 */
export async function updateContractorBadges(
  contractorId: string
): Promise<void> {
  try {
    const newBadges = await calculateContractorBadges(contractorId);

    // Update contractor profile with new badges
    await adminDb.collection('contractor_profiles').doc(contractorId).update({
      badges: newBadges,
      updatedAt: new Date(),
    });

    // Update listing(s) with new badges
    const listingsSnapshot = await adminDb
      .collection('listings')
      .where('userId', '==', contractorId)
      .get();

    const batch = adminDb.batch();
    listingsSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        badges: newBadges,
        verifiedPro:
          newBadges.includes('verified_pro') ||
          newBadges.includes('elite_member'),
        updatedAt: new Date(),
      });
    });

    await batch.commit();

    // Create badge documents for tracking
    const existingBadgesSnapshot = await adminDb
      .collection('badges')
      .where('contractorId', '==', contractorId)
      .get();

    // Delete old badges
    const deleteBatch = adminDb.batch();
    existingBadgesSnapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();

    // Create new badge documents
    const createBatch = adminDb.batch();
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    newBadges.forEach((badgeType) => {
      const badgeRef = adminDb.collection('badges').doc();
      createBatch.set(badgeRef, {
        contractorId,
        badgeType,
        displayName: getBadgeDisplayName(badgeType),
        description: getBadgeDescription(badgeType),
        awardedAt: now,
        expiresAt:
          badgeType === 'best_of_year' ||
          badgeType === 'top_rated' ||
          badgeType === 'quick_responder'
            ? oneYearFromNow
            : null,
      });
    });

    await createBatch.commit();
  } catch (error) {
    console.error('Error updating contractor badges:', error);
    throw error;
  }
}

/**
 * Get display name for badge type
 */
function getBadgeDisplayName(badgeType: BadgeType): string {
  const names: Record<BadgeType, string> = {
    top_rated: 'Top Rated',
    best_of_year: 'Best of 2025',
    quick_responder: 'Quick Responder',
    verified_pro: 'Verified Pro',
    elite_member: 'Elite Member',
    pro_member: 'Pro Member',
  };
  return names[badgeType];
}

/**
 * Get description for badge type
 */
function getBadgeDescription(badgeType: BadgeType): string {
  const descriptions: Record<BadgeType, string> = {
    top_rated: '4.5+ stars with 10+ reviews',
    best_of_year: 'Top 5% in category',
    quick_responder: 'Responds within 2 hours on average',
    verified_pro: 'License and insurance verified',
    elite_member: 'Elite subscription member',
    pro_member: 'Pro subscription member',
  };
  return descriptions[badgeType];
}

/**
 * Batch update badges for all contractors (run periodically)
 */
export async function batchUpdateAllBadges(): Promise<void> {
  try {
    const contractorsSnapshot = await adminDb
      .collection('contractor_profiles')
      .get();

    console.log(
      `Updating badges for ${contractorsSnapshot.size} contractors...`
    );

    let updated = 0;
    let errors = 0;

    for (const doc of contractorsSnapshot.docs) {
      try {
        await updateContractorBadges(doc.id);
        updated++;
      } catch (error) {
        console.error(`Error updating badges for ${doc.id}:`, error);
        errors++;
      }
    }

    console.log(
      `Badge update complete: ${updated} updated, ${errors} errors`
    );
  } catch (error) {
    console.error('Error in batch badge update:', error);
    throw error;
  }
}

