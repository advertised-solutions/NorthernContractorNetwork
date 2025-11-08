'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BiUser, BiEnvelope, BiPhone, BiMapPin } from 'react-icons/bi';
import NavbarSimple from '../../components/navbar/navbar-simple';
import Footer from '../../components/footer/footer';

export default function HomeownerProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard-homeowner/profile');
      return;
    }

    if (user.userType === 'contractor') {
      router.push('/dashboard-user');
      return;
    }

    // Pre-fill form with user data
    setFormData({
      displayName: user.displayName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || '',
    });
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Profile updated successfully!');
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
                  <h1 className="ft-bold mb-0">My Profile</h1>
                  <p className="text-muted mb-0">Manage your account information</p>
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
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-lg-5 p-4">
                  <form onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <h5 className="fw-bold mb-4">Personal Information</h5>

                    <div className="form-group mb-4">
                      <label className="fw-semibold mb-2">
                        <BiUser className="me-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        className="form-control"
                        placeholder="Your full name"
                        value={formData.displayName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group mb-4">
                      <label className="fw-semibold mb-2">
                        <BiEnvelope className="me-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        disabled
                      />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>

                    <div className="form-group mb-4">
                      <label className="fw-semibold mb-2">
                        <BiPhone className="me-2" />
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        className="form-control"
                        placeholder="(555) 123-4567"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>

                    <hr className="my-4" />

                    {/* Address */}
                    <h5 className="fw-bold mb-4">
                      <BiMapPin className="me-2" />
                      Address (Optional)
                    </h5>

                    <div className="form-group mb-4">
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-5">
                        <div className="form-group">
                          <input
                            type="text"
                            name="city"
                            className="form-control"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <input
                            type="text"
                            name="state"
                            className="form-control"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <input
                            type="text"
                            name="zipCode"
                            className="form-control"
                            placeholder="Zip"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg full-width"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
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

