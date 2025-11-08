'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContractorCheck } from '@/hooks/useContractorCheck';

interface ContractorDashboardGuardProps {
  children: React.ReactNode;
}

/**
 * Wrapper component to protect contractor dashboard pages
 * - Redirects non-logged in users to login
 * - Redirects homeowners to homeowner dashboard
 * - Redirects contractors without listings to onboarding
 */
export default function ContractorDashboardGuard({ children }: ContractorDashboardGuardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { hasListing, loading } = useContractorCheck();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Homeowners should use their own dashboard
    if (user.userType === 'customer') {
      router.push('/dashboard-homeowner');
      return;
    }

    // Contractors without listings need to complete onboarding
    if (user.userType === 'contractor' && !loading && !hasListing) {
      router.push('/onboarding-contractor');
      return;
    }
  }, [user, hasListing, loading, router]);

  // Show loading while checking auth and listing status
  if (!user || loading || (user.userType === 'contractor' && !hasListing)) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // User is authenticated and has proper access
  return <>{children}</>;
}

