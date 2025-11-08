'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Category, Job } from '@/types';
import { BiUpload } from 'react-icons/bi';

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function PostJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    city: '',
    state: '',
    zipCode: '',
    budgetMin: '',
    budgetMax: '',
    timeline: 'Flexible',
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login?redirect=/post-job');
      return;
    }

    // Fetch categories
    fetchCategories();
  }, [user, router]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 5 - images.length);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to post a job');
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      const imageUrls = images.length > 0 ? await uploadImages() : [];

      const jobData = {
        userId: user.id,
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        location: {
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        budget: formData.budgetMin && formData.budgetMax ? {
          min: parseFloat(formData.budgetMin),
          max: parseFloat(formData.budgetMax),
        } : undefined,
        timeline: formData.timeline,
        images: imageUrls,
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Job posted successfully! Contractors will start sending quotes soon.');
        router.push(`/jobs/${data.data.id}`);
      } else {
        alert(data.error || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred while posting the job');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const timelineOptions = [
    { value: 'ASAP', label: 'As soon as possible' },
    { value: '1-2 weeks', label: 'Within 1-2 weeks' },
    { value: '1 month', label: 'Within 1 month' },
    { value: '1-3 months', label: 'Within 1-3 months' },
    { value: '3+ months', label: '3+ months' },
    { value: 'Flexible', label: 'Flexible' },
  ];

  if (!user) {
    return <div className="container py-5">Loading...</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="page-title">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <h1 className="ft-bold mb-0">Post a Job</h1>
              <p className="text-muted">Get quotes from qualified contractors in your area</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="gray-simple">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-lg-5 p-4">
                  <form onSubmit={handleSubmit}>
                    {/* Job Title */}
                    <div className="form-group mb-4">
                      <label className="fw-semibold mb-2">Job Title *</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="e.g., Kitchen Renovation, Bathroom Remodel"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="form-group mb-4">
                      <label className="fw-semibold mb-2">Category *</label>
                      <Select
                        options={categoryOptions}
                        placeholder="Select a category"
                        className="basic-select"
                        onChange={(option: any) =>
                          setFormData((prev) => ({ ...prev, categoryId: option?.value || '' }))
                        }
                      />
                    </div>

                    {/* Description */}
                    <div className="form-group mb-4">
                      <label className="fw-semibold mb-2">Job Description *</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows={6}
                        placeholder="Describe the work you need done, including any specific requirements or preferences..."
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted">
                        Be as detailed as possible to get accurate quotes
                      </small>
                    </div>

                    {/* Location */}
                    <div className="row mb-4">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="fw-semibold mb-2">City *</label>
                          <input
                            type="text"
                            name="city"
                            className="form-control"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="fw-semibold mb-2">State *</label>
                          <input
                            type="text"
                            name="state"
                            className="form-control"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="fw-semibold mb-2">Zip Code *</label>
                          <input
                            type="text"
                            name="zipCode"
                            className="form-control"
                            placeholder="Zip Code"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <label className="fw-semibold mb-2">Budget Range (Optional)</label>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="number"
                            name="budgetMin"
                            className="form-control"
                            placeholder="Min Budget"
                            value={formData.budgetMin}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="number"
                            name="budgetMax"
                            className="form-control"
                            placeholder="Max Budget"
                            value={formData.budgetMax}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="form-group mb-4">
                      <label className="fw-semibold mb-2">Timeline</label>
                      <Select
                        options={timelineOptions}
                        placeholder="Select timeline"
                        className="basic-select"
                        defaultValue={timelineOptions.find((opt) => opt.value === 'Flexible')}
                        onChange={(option: any) =>
                          setFormData((prev) => ({ ...prev, timeline: option?.value || 'Flexible' }))
                        }
                      />
                    </div>

                    {/* Images */}
                    <div className="form-group mb-4">
                      <label className="fw-semibold mb-2">Photos (Optional)</label>
                      <div className="upload-area border rounded p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="d-none"
                          id="job-images"
                        />
                        <label htmlFor="job-images" className="cursor-pointer">
                          <BiUpload className="fs-1 text-primary mb-2" />
                          <p className="mb-0">Click to upload photos</p>
                          <small className="text-muted">Up to 5 images</small>
                        </label>
                      </div>
                      
                      {/* Image Previews */}
                      {images.length > 0 && (
                        <div className="row mt-3">
                          {images.map((image, index) => (
                            <div key={index} className="col-md-2 mb-2">
                              <div className="position-relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="img-fluid rounded"
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                  onClick={() => removeImage(index)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="form-group mb-0">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg full-width fw-semibold"
                        disabled={loading}
                      >
                        {loading ? 'Posting...' : 'Post Job (Free)'}
                      </button>
                      <p className="text-center text-muted mt-3 mb-0">
                        <small>
                          By posting, you agree to receive quotes from contractors. No payment required upfront.
                        </small>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Info Section */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">How it works</h5>
                  <ol className="mb-0">
                    <li className="mb-2">Post your job for free</li>
                    <li className="mb-2">Receive quotes from qualified contractors</li>
                    <li className="mb-2">Review their profiles, ratings, and quotes</li>
                    <li className="mb-0">Choose the best contractor for your project</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

