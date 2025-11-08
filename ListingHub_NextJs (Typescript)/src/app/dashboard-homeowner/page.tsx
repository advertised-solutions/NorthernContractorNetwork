'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BiBookmark, BiStar, BiUser, BiHeart } from 'react-icons/bi';
import { Booking, Bookmark } from '@/types';
import NavbarSimple from '../components/navbar/navbar-simple';
import Footer from '../components/footer/footer';

export default function HomeownerDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    savedBusinesses: 0,
    activeBookings: 0,
    reviewsWritten: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard-homeowner');
      return;
    }

    if (user.userType === 'contractor') {
      router.push('/dashboard-user');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch bookmarks
      const bookmarksResponse = await fetch(`/api/bookmarks/user/${user.id}`);
      const bookmarksData = await bookmarksResponse.json();
      if (bookmarksData.success) {
        setBookmarks(bookmarksData.data || []);
        setStats(prev => ({ ...prev, savedBusinesses: bookmarksData.data?.length || 0 }));
      }

      // Fetch bookings
      const bookingsResponse = await fetch(`/api/bookings/user/${user.id}`);
      const bookingsData = await bookingsResponse.json();
      if (bookingsData.success) {
        setBookings(bookingsData.data || []);
        const active = bookingsData.data?.filter((b: Booking) => 
          b.status === 'pending' || b.status === 'approved'
        ).length || 0;
        setStats(prev => ({ ...prev, activeBookings: active }));
      }

      // Fetch reviews count
      const reviewsResponse = await fetch(`/api/reviews?userId=${user.id}`);
      const reviewsData = await reviewsResponse.json();
      if (reviewsData.data) {
        setStats(prev => ({ ...prev, reviewsWritten: reviewsData.data.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarSimple />
      
      {/* Page Title Banner */}
      <div className="page-title">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <h1 className="ft-bold mb-0">Welcome back, {user.displayName || 'Homeowner'}!</h1>
              <p className="text-muted">Manage your saved businesses and bookings</p>
            </div>
          </div>
        </div>
      </div>

      <section className="gray-simple">
        <div className="container">
          <div className="row">
            {/* Stats Cards */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-light rounded p-3">
                        <BiBookmark className="fs-3 text-primary" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h3 className="fw-bold mb-0">{stats.savedBusinesses}</h3>
                      <p className="text-muted mb-0">Saved Businesses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-success-light rounded p-3">
                        <BiHeart className="fs-3 text-success" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h3 className="fw-bold mb-0">{stats.activeBookings}</h3>
                      <p className="text-muted mb-0">Active Bookings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-warning-light rounded p-3">
                        <BiStar className="fs-3 text-warning" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h3 className="fw-bold mb-0">{stats.reviewsWritten}</h3>
                      <p className="text-muted mb-0">Reviews Written</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Quick Actions</h5>
                  <div className="row g-3">
                    <div className="col-md-3 col-sm-6">
                      <Link href="/grid-layout-01" className="btn btn-outline-primary full-width">
                        Find Contractors
                      </Link>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <Link href="/post-job" className="btn btn-outline-success full-width">
                        Post a Job
                      </Link>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <Link href="/dashboard-homeowner/bookmarks" className="btn btn-outline-secondary full-width">
                        View Saved
                      </Link>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <Link href="/dashboard-homeowner/profile" className="btn btn-outline-info full-width">
                        Edit Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="row mb-4">
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Recent Bookings</h5>
                    <Link href="/dashboard-my-bookings" className="text-primary">
                      View All
                    </Link>
                  </div>
                  
                  {bookings.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted mb-3">No bookings yet</p>
                      <Link href="/grid-layout-01" className="btn btn-primary">
                        Find Contractors
                      </Link>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{booking.listingTitle || 'Booking'}</h6>
                              <small className="text-muted">
                                {new Date(booking.date).toLocaleDateString()}
                              </small>
                            </div>
                            <span className={`badge ${
                              booking.status === 'approved' ? 'bg-success' :
                              booking.status === 'pending' ? 'bg-warning' :
                              booking.status === 'rejected' ? 'bg-danger' :
                              'bg-secondary'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Businesses */}
          <div className="row">
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Saved Businesses</h5>
                    <Link href="/dashboard-bookmarks" className="text-primary">
                      View All
                    </Link>
                  </div>
                  
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-4">
                      <BiBookmark className="fs-1 text-muted mb-2" />
                      <p className="text-muted mb-3">No saved businesses yet</p>
                      <Link href="/grid-layout-01" className="btn btn-outline-primary">
                        Browse Contractors
                      </Link>
                    </div>
                  ) : (
                    <div className="row">
                      {bookmarks.slice(0, 3).map((bookmark) => (
                        <div key={bookmark.id} className="col-md-4 mb-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-0">Saved Business</h6>
                                <BiBookmark className="text-primary" />
                              </div>
                              <small className="text-muted">
                                Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card border-0 bg-primary text-white">
                <div className="card-body p-4">
                  <h5 className="text-white fw-bold mb-2">Need Help?</h5>
                  <p className="text-white opacity-75 mb-3">
                    Browse our help center or contact support for assistance
                  </p>
                  <div className="d-flex gap-2">
                    <Link href="/help-center" className="btn btn-light">
                      Help Center
                    </Link>
                    <Link href="/contact-us" className="btn btn-outline-light">
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

