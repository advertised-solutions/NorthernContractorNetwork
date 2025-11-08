'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BiUpload, BiCheck } from 'react-icons/bi';
import { Category } from '@/types';
import { clearListingCache } from '@/hooks/useContractorCheck';

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function ContractorOnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    website: '',
  });

  useEffect(() => {
    // Redirect if not logged in or not a contractor
    if (user && user.userType !== 'contractor') {
      router.push('/');
      return;
    }

    if (!user) {
      router.push('/login?redirect=/onboarding-contractor');
      return;
    }

    // Check if contractor already has a listing
    checkExistingListing();
    fetchCategories();
  }, [user, router]);

  const checkExistingListing = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/listings?userId=${user.id}&limit=1`);
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        // Already has a listing, redirect to dashboard
        router.push('/dashboard-user');
      }
    } catch (error) {
      console.error('Error checking existing listing:', error);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const formDataImg = new FormData();
      formDataImg.append('file', image);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataImg,
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

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.title || !formData.categoryId || !formData.description) {
        alert('Please fill in all required fields');
        return;
      }
    } else if (step === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.phoneNumber) {
        alert('Please fill in all required fields');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to continue');
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      const imageUrls = images.length > 0 ? await uploadImages() : [];
      const categoryName = categories.find(c => c.id === formData.categoryId)?.name || '';

      const listingData = {
        userId: user.id,
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        categoryName,
        status: 'open',
        featured: false,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phoneNumber: formData.phoneNumber,
        email: formData.email || user.email,
        website: formData.website,
        image: imageUrls[0] || '',
        gallery: imageUrls,
        instantBooking: false,
        tags: [],
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      });

      const data = await response.json();

      if (data.success) {
        // Clear listing cache so dashboard recognizes new listing immediately
        clearListingCache(user.id);
        
        // Create contractor profile if it doesn't exist (non-blocking)
        fetch(`/api/contractors/${user.id}/badges`, {
          method: 'POST',
        }).catch(console.error);

        // Success! Redirect to dashboard immediately
        router.push('/dashboard-user?welcome=true');
      } else {
        alert(data.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('An error occurred while creating your listing');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

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
              <h1 className="ft-bold mb-0">Welcome to Northern Contractor Directory!</h1>
              <p className="text-muted">Let's create your business listing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <section className="gray-simple py-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="d-flex justify-content-between mb-4">
                <div className={`text-center ${step >= 1 ? 'text-primary' : 'text-muted'}`} style={{flex: 1}}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: 40, height: 40}}>
                    {step > 1 ? <BiCheck /> : '1'}
                  </div>
                  <div className="small fw-semibold">Business Info</div>
                </div>
                <div className={`text-center ${step >= 2 ? 'text-primary' : 'text-muted'}`} style={{flex: 1}}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: 40, height: 40}}>
                    {step > 2 ? <BiCheck /> : '2'}
                  </div>
                  <div className="small fw-semibold">Contact Details</div>
                </div>
                <div className={`text-center ${step >= 3 ? 'text-primary' : 'text-muted'}`} style={{flex: 1}}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: 40, height: 40}}>
                    3
                  </div>
                  <div className="small fw-semibold">Photos & Finish</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="gray-simple">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-lg-5 p-4">
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Business Info */}
                    {step === 1 && (
                      <>
                        <h4 className="fw-bold mb-4">Tell us about your business</h4>
                        
                        <div className="form-group mb-4">
                          <label className="fw-semibold mb-2">Business Name *</label>
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="e.g., Smith Plumbing Services"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="form-group mb-4">
                          <label className="fw-semibold mb-2">Category *</label>
                          <Select
                            options={categoryOptions}
                            placeholder="Select your primary category"
                            className="basic-select"
                            onChange={(option: any) =>
                              setFormData((prev) => ({ ...prev, categoryId: option?.value || '' }))
                            }
                          />
                        </div>

                        <div className="form-group mb-4">
                          <label className="fw-semibold mb-2">Business Description *</label>
                          <textarea
                            name="description"
                            className="form-control"
                            rows={6}
                            placeholder="Describe your services, experience, and what makes your business unique..."
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                          />
                          <small className="text-muted">
                            A great description helps customers understand your services
                          </small>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary btn-lg full-width"
                          onClick={handleNext}
                        >
                          Next Step
                        </button>
                      </>
                    )}

                    {/* Step 2: Contact Details */}
                    {step === 2 && (
                      <>
                        <h4 className="fw-bold mb-4">Where can customers reach you?</h4>

                        <div className="form-group mb-4">
                          <label className="fw-semibold mb-2">Street Address *</label>
                          <input
                            type="text"
                            name="address"
                            className="form-control"
                            placeholder="123 Main Street"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="row mb-4">
                          <div className="col-md-5">
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
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="fw-semibold mb-2">Zip *</label>
                              <input
                                type="text"
                                name="zipCode"
                                className="form-control"
                                placeholder="12345"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="form-group mb-4">
                          <label className="fw-semibold mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            className="form-control"
                            placeholder="(555) 123-4567"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="form-group mb-4">
                          <label className="fw-semibold mb-2">Email (Optional)</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="business@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                          <small className="text-muted">Leave blank to use your account email</small>
                        </div>

                        <div className="form-group mb-4">
                          <label className="fw-semibold mb-2">Website (Optional)</label>
                          <input
                            type="url"
                            name="website"
                            className="form-control"
                            placeholder="https://yourwebsite.com"
                            value={formData.website}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg"
                            onClick={handleBack}
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-lg flex-fill"
                            onClick={handleNext}
                          >
                            Next Step
                          </button>
                        </div>
                      </>
                    )}

                    {/* Step 3: Photos */}
                    {step === 3 && (
                      <>
                        <h4 className="fw-bold mb-4">Add photos of your work</h4>
                        
                        <div className="form-group mb-4">
                          <label className="fw-semibold mb-2">Business Photos (Optional)</label>
                          <div className="upload-area border rounded p-4 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="d-none"
                              id="listing-images"
                            />
                            <label htmlFor="listing-images" className="cursor-pointer">
                              <BiUpload className="fs-1 text-primary mb-2" />
                              <p className="mb-0">Click to upload photos</p>
                              <small className="text-muted">Up to 5 images (recommended)</small>
                            </label>
                          </div>
                          
                          {images.length > 0 && (
                            <div className="row mt-3">
                              {images.map((image, index) => (
                                <div key={index} className="col-md-3 mb-2">
                                  <div className="position-relative">
                                    <img
                                      src={URL.createObjectURL(image)}
                                      alt={`Preview ${index + 1}`}
                                      className="img-fluid rounded"
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
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

                        <div className="alert alert-info mb-4">
                          <strong>Pro Tip:</strong> Listings with photos get 5x more engagement!
                          You can always add more photos later from your dashboard.
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg"
                            onClick={handleBack}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success btn-lg flex-fill"
                            disabled={loading}
                          >
                            {loading ? 'Creating...' : 'Complete Setup'}
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

