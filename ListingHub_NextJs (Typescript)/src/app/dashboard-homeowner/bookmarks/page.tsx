'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BiBookmark, BiTrash, BiMapPin, BiStar } from 'react-icons/bi';
import { Bookmark, Listing } from '@/types';
import NavbarSimple from '../../components/navbar/navbar-simple';
import Footer from '../../components/footer/footer';

export default function HomeownerBookmarksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Array<Bookmark & { listing?: Listing }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard-homeowner/bookmarks');
      return;
    }

    if (user.userType === 'contractor') {
      router.push('/dashboard-user');
      return;
    }

    fetchBookmarks();
  }, [user, router]);

  const fetchBookmarks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/bookmarks/user/${user.id}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Fetch listing details for each bookmark
        const bookmarksWithListings = await Promise.all(
          data.data.map(async (bookmark: Bookmark) => {
            try {
              const listingResponse = await fetch(`/api/listings/${bookmark.listingId}`);
              const listingData = await listingResponse.json();
              
              return {
                ...bookmark,
                listing: listingData.data || null,
              };
            } catch (error) {
              console.error('Error fetching listing:', error);
              return bookmark;
            }
          })
        );
        
        setBookmarks(bookmarksWithListings);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    if (!confirm('Remove this business from your saved list?')) return;

    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
      } else {
        alert('Failed to remove bookmark');
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('An error occurred');
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
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1 className="ft-bold mb-0">Saved Businesses</h1>
                  <p className="text-muted mb-0">
                    {bookmarks.length} {bookmarks.length === 1 ? 'business' : 'businesses'} saved
                  </p>
                </div>
                <Link href="/dashboard-homeowner" className="btn btn-outline-primary">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="gray-simple">
        <div className="container">
          {bookmarks.length === 0 ? (
            <div className="row">
              <div className="col-lg-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <BiBookmark className="fs-1 text-muted mb-3" />
                    <h4 className="fw-bold mb-2">No saved businesses yet</h4>
                    <p className="text-muted mb-4">
                      Start exploring and save your favorite contractors for quick access
                    </p>
                    <Link href="/grid-layout-01" className="btn btn-primary">
                      Browse Contractors
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    {bookmark.listing?.image && (
                      <img
                        src={bookmark.listing.image}
                        alt={bookmark.listing.title}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-primary">
                          {bookmark.listing?.categoryName || 'Business'}
                        </span>
                        <button
                          onClick={() => handleRemoveBookmark(bookmark.id)}
                          className="btn btn-sm btn-link text-danger p-0"
                          title="Remove bookmark"
                        >
                          <BiTrash />
                        </button>
                      </div>

                      <h5 className="fw-bold mb-2">
                        {bookmark.listing ? (
                          <Link
                            href={`/single-listing-01/${bookmark.listingId}`}
                            className="text-dark"
                          >
                            {bookmark.listing.title}
                          </Link>
                        ) : (
                          'Business Listing'
                        )}
                      </h5>

                      {bookmark.listing?.description && (
                        <p className="text-muted small mb-3 line-clamp-2">
                          {bookmark.listing.description}
                        </p>
                      )}

                      {bookmark.listing && (
                        <div className="mb-3">
                          {bookmark.listing.ratingValue && (
                            <div className="d-flex align-items-center mb-2">
                              <BiStar className="text-warning me-1" />
                              <span className="fw-semibold me-1">
                                {bookmark.listing.ratingValue.toFixed(1)}
                              </span>
                              <span className="text-muted small">
                                ({bookmark.listing.reviewCount || 0} reviews)
                              </span>
                            </div>
                          )}

                          <div className="d-flex align-items-center text-muted small">
                            <BiMapPin className="me-1" />
                            <span>
                              {bookmark.listing.city}, {bookmark.listing.state}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <Link
                          href={`/single-listing-01/${bookmark.listingId}`}
                          className="btn btn-sm btn-primary flex-fill"
                        >
                          View Profile
                        </Link>
                        {bookmark.listing?.phoneNumber && (
                          <a
                            href={`tel:${bookmark.listing.phoneNumber}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Call
                          </a>
                        )}
                      </div>

                      <small className="text-muted d-block mt-2">
                        Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </>
  );
}

