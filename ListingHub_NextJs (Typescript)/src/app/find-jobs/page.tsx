'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Job, Category } from '@/types';
import { BiMapPin, BiTime, BiDollar, BiSearch } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import Link from 'next/link';

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function FindJobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: '',
    city: '',
    state: '',
    status: 'open',
  });

  useEffect(() => {
    fetchCategories();
    fetchJobs();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      params.append('status', filters.status);
      params.append('limit', '20');

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      
      if (data.data) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  return (
    <>
      {/* Header */}
      <div className="page-title primary-bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <h1 className="ft-bold mb-1 text-light">Find Jobs</h1>
              <p className="text-light opacity-75">
                Browse available jobs and submit your quotes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <section className="gray-simple pt-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <div className="row g-3 align-items-end">
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label fw-semibold">Category</label>
                      <Select
                        options={categoryOptions}
                        placeholder="All Categories"
                        className="basic-select"
                        onChange={(option: any) =>
                          handleFilterChange('categoryId', option?.value || '')
                        }
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label fw-semibold">City</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter city"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label fw-semibold">State</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter state"
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <button
                        className="btn btn-primary full-width"
                        onClick={handleSearch}
                      >
                        <BiSearch className="me-2" />
                        Search Jobs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="row">
            <div className="col-lg-12">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <h4 className="text-muted">No jobs found</h4>
                    <p>Try adjusting your filters or check back later</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <h5 className="fw-bold">{jobs.length} Jobs Available</h5>
                  </div>
                  
                  {jobs.map((job) => (
                    <div key={job.id} className="card border-0 shadow-sm mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-9 col-md-8">
                            <div className="d-flex mb-2">
                              <span className="badge bg-primary me-2">
                                {job.categoryName || 'Uncategorized'}
                              </span>
                              <span className="badge bg-success-light text-success">
                                {job.quoteCount} {job.quoteCount === 1 ? 'Quote' : 'Quotes'}
                              </span>
                            </div>

                            <h4 className="fw-bold mb-2">
                              <Link href={`/jobs/${job.id}`} className="text-dark">
                                {job.title}
                              </Link>
                            </h4>

                            <p className="text-muted mb-3 line-clamp-2">
                              {job.description}
                            </p>

                            <div className="d-flex flex-wrap gap-3 text-muted">
                              <div className="d-flex align-items-center">
                                <BiMapPin className="me-1" />
                                <small>
                                  {job.location.city}, {job.location.state}
                                </small>
                              </div>
                              <div className="d-flex align-items-center">
                                <FaRegClock className="me-1" />
                                <small>{getTimeAgo(job.createdAt)}</small>
                              </div>
                              {job.budget && (
                                <div className="d-flex align-items-center">
                                  <BiDollar className="me-1" />
                                  <small>
                                    ${job.budget.min.toLocaleString()} - $
                                    {job.budget.max.toLocaleString()}
                                  </small>
                                </div>
                              )}
                              <div className="d-flex align-items-center">
                                <BiTime className="me-1" />
                                <small>{job.timeline}</small>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-4 text-md-end">
                            <div className="d-grid gap-2 mt-md-0 mt-3">
                              <Link
                                href={`/jobs/${job.id}`}
                                className="btn btn-primary"
                              >
                                View Details & Quote
                              </Link>
                              {job.images && job.images.length > 0 && (
                                <span className="badge bg-light text-dark">
                                  📸 {job.images.length} Photo{job.images.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Info Banner */}
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card border-0 bg-primary text-white">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      <h4 className="text-white fw-bold mb-2">
                        Want to receive job alerts?
                      </h4>
                      <p className="text-white mb-lg-0 opacity-75">
                        Upgrade to Pro or Elite to get instant notifications when new jobs are posted in your service area
                      </p>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                      <Link href="/pricing-contractors" className="btn btn-light fw-semibold">
                        View Plans
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

