'use client';

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaEye, FaFacebook, FaGooglePlusG } from 'react-icons/fa6'
import { useAuth } from '@/hooks/useAuth'

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, signInWithFacebook, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Show success message if redirected from signup
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in with your credentials.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await signIn(email, password);
      // Use replace instead of push for faster navigation
      router.replace('/dashboard-user');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials and try again.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignin = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/dashboard-user');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    }
  };

  const handleFacebookSignin = async () => {
    setError('');
    try {
      await signInWithFacebook();
      router.push('/dashboard-user');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Facebook. Please try again.');
    }
  };

  return (
        <section style={{backgroundImage:`url('/img/auth-bg.png')`, backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundColor:'#f0f4f8' , backgroundSize:'cover'}}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-xl-5 col-lg-7 col-md-9">
                        <div className="authWrap">
                            <div className="authhead">
                                <div className="text-center mb-4"><Link href="/"><Image className="img-fluid" src='/img/icon.png' width={0} height={0} sizes='100vw' style={{width:'55px', height:'auto'}} alt="logo"/></Link></div>
                            </div>
                            <div className="authbody d-black mb-4">
                                <div className="card rounded-4 p-sm-5 p-4">
                                    <div className="card-body p-0">
                                        <div className="text-center"><h1 className="mb-2 fs-2">Welcome To ListingHub!</h1></div>
                                        {success && (
                                            <div className="alert alert-success mt-3" role="alert">
                                                {success}
                                            </div>
                                        )}
                                        {error && (
                                            <div className="alert alert-danger mt-3" role="alert">
                                                {error}
                                            </div>
                                        )}
                                        <form className="mt-5 text-start" onSubmit={handleSubmit}>
                                            <div className="form mb-5">
                                                <div className="form-group form-border mb-4">
                                                    <label>Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        placeholder="name@example.com" 
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group form-border position-relative mb-4">
                                                    <label>Password</label>
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
                                                            className="fa-solid fa-eye toggle-password position-absolute top-50 end-0 translate-middle-y me-3"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group mb-4">
                                                    <button 
                                                        type="submit" 
                                                        className="btn btn-primary full-width fw-medium"
                                                        disabled={isSubmitting || loading}
                                                    >
                                                        {isSubmitting ? 'Signing In...' : 'Log In'}
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
                                                    <div className="devider-text text-muted text-md">Or signin with email</div>
                                                </div>
                                            </div>
                                            
                                            <div className="social-login">
                                                <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 p-0">
                                                    <div className="flex-first flex-fill mob-100">
                                                        <button 
                                                            type="button"
                                                            onClick={handleGoogleSignin}
                                                            className="btn bg-white border text-dark full-width"
                                                            disabled={isSubmitting || loading}
                                                        >
                                                            <FaGooglePlusG className="color--googleplus me-2"/>
                                                            <span className="fw-medium text-md">Signin with Google</span>
                                                        </button>
                                                    </div>
                                                    <div className="flex-last flex-fill mob-100">
                                                        <button 
                                                            type="button"
                                                            onClick={handleFacebookSignin}
                                                            className="btn bg-white border text-dark full-width"
                                                            disabled={isSubmitting || loading}
                                                        >
                                                            <FaFacebook className="color--facebook me-2"/>
                                                            <span className="fw-medium text-md">Signin with Facebook</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="authfooter">
                                <div className="text-center"><p className="text-dark mb-0">Are you new here?<Link href="/register" className="fw-medium text-primary"> Create an account</Link></p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}

export default function Login() {
  return (
    <Suspense fallback={
      <section style={{backgroundImage:`url('/img/auth-bg.png')`, backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundColor:'#f0f4f8' , backgroundSize:'cover'}}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-5 col-lg-7 col-md-9">
              <div className="text-center py-5">Loading...</div>
            </div>
          </div>
        </div>
      </section>
    }>
      <LoginForm />
    </Suspense>
  );
}
