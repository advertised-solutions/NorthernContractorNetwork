'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaEye, FaFacebookF, FaGooglePlusG } from 'react-icons/fa6'
import { useAuth } from '@/hooks/useAuth'

export default function Register() {
  const router = useRouter();
  const { signUp, signOut, signInWithGoogle, signInWithFacebook, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState<'contractor' | 'customer'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword || !displayName) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(email, password, displayName, userType);
      
      // Redirect based on user type
      if (userType === 'contractor') {
        // Contractors go to onboarding to create their business listing
        router.push('/onboarding-contractor');
      } else {
        // Homeowners/customers go to their dashboard
        router.push('/dashboard-homeowner');
      }
      // Note: Don't reset isSubmitting here - let the redirect handle it
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    try {
      await signInWithGoogle();
      // Social sign-in defaults to customer type, redirect to dashboard router
      router.push('/dashboard-user');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google. Please try again.');
    }
  };

  const handleFacebookSignup = async () => {
    setError('');
    try {
      await signInWithFacebook();
      // Social sign-in defaults to customer type, redirect to dashboard router
      router.push('/dashboard-user');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Facebook. Please try again.');
    }
  };

  return (
        <section style={{backgroundImage:`url('/img/auth-bg.png')`, backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundColor:'#f0f4f8' , backgroundSize:'cover'}}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-xl-5 col-lg-7 col-md-9">
                        <div className="authWrap">
                            <div className="authhead">
                                <div className="text-center mb-4"><Link href="/"><Image className="img-fluid" src='/img/icon.png' width={0} height={0} sizes='100vw' style={{width:'55px' , height:'auto'}} alt="logo"/></Link></div>
                            </div>
                            <div className="authbody d-black mb-4">
                                <div className="card rounded-4 p-sm-5 p-4">
                                    <div className="card-body p-0">
                                        <div className="text-center"><h1 className="mb-2 fs-2">Create An Account!</h1></div>
                                        {error && (
                                            <div className="alert alert-danger mt-3" role="alert">
                                                {error}
                                            </div>
                                        )}
                                        <form className="mt-5 text-start" onSubmit={handleSubmit}>
                                            <div className="form mb-5">
                                                <div className="form-group form-border mb-4">
                                                    <label className="form-label">Full Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        placeholder="Enter your full name"
                                                        value={displayName}
                                                        onChange={(e) => setDisplayName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group form-border mb-4">
                                                    <label className="form-label">Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        placeholder="name@example.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group form-border mb-4">
                                                    <label className="form-label">User Type</label>
                                                    <select 
                                                        className="form-control" 
                                                        value={userType}
                                                        onChange={(e) => setUserType(e.target.value as 'contractor' | 'customer')}
                                                        required
                                                    >
                                                        <option value="customer">Customer</option>
                                                        <option value="contractor">Contractor</option>
                                                    </select>
                                                </div>
                                                <div className="form-group form-border mb-4">
                                                    <label className="form-label">Enter Password</label>
                                                    <div className="position-relative">
                                                        <input 
                                                            type={showPassword ? "text" : "password"} 
                                                            className="form-control" 
                                                            id="password-field" 
                                                            name="password" 
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                        />
                                                        <FaEye 
                                                            className="toggle-password position-absolute top-50 end-0 translate-middle-y me-3" 
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group form-border mb-4">
                                                    <label className="form-label">Confirm Password</label>
                                                    <div className="position-relative">
                                                        <input 
                                                            type={showConfirmPassword ? "text" : "password"} 
                                                            className="form-control" 
                                                            placeholder="*********"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            required
                                                        />
                                                        <FaEye 
                                                            className="toggle-password position-absolute top-50 end-0 translate-middle-y me-3"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group mb-4">
                                                    <button 
                                                        type="submit" 
                                                        className="btn btn-primary full-width fw-medium"
                                                        disabled={isSubmitting || loading}
                                                    >
                                                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                                                    </button>
                                                </div>

                                                <div className="modal-flex-item d-flex align-items-center justify-content-between mb-3">
                                                    <div className="modal-flex-first">
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="checkbox" id="savepassword" value="option1"/>
                                                            <label className="form-check-label" htmlFor="savepassword">Save Password</label>
                                                        </div>
                                                    </div>
                                                    <div className="modal-flex-last">
                                                        <Link href="/forgot-password" className="text-primary fw-medium">Forget Password?</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="prixer my-5">
                                                <div className="devider-wraps position-relative">
                                                    <div className="devider-text text-muted text-md">Or Signup with</div>
                                                </div>
                                            </div>
                                            
                                            <div className="social-login">
                                                <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 p-0">
                                                    <div className="flex-first flex-fill mob-100">
                                                        <button 
                                                            type="button"
                                                            onClick={handleGoogleSignup}
                                                            className="btn bg-white border text-dark full-width"
                                                            disabled={isSubmitting || loading}
                                                        >
                                                            <FaGooglePlusG className="color--googleplus me-2"/>
                                                            <span className="fw-medium text-md">Signup with Google</span>
                                                        </button>
                                                    </div>
                                                    <div className="flex-last flex-fill mob-100">
                                                        <button 
                                                            type="button"
                                                            onClick={handleFacebookSignup}
                                                            className="btn bg-white border text-dark full-width"
                                                            disabled={isSubmitting || loading}
                                                        >
                                                            <FaFacebookF className="color--facebook me-2"/>
                                                            <span className="fw-medium text-md">Signup with Facebook</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="authfooter">
                                <div className="text-center"><p className="text-dark mb-0">Already have an account?<Link href="/login" className="fw-medium text-primary"> Sign in</Link></p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}
