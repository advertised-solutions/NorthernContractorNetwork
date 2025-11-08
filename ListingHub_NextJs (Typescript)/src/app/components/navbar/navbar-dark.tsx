'use client'
import React, { useState,useEffect } from 'react'
import { usePathname,useRouter } from 'next/navigation'

import { BsPersonCircle,BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill, BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus, BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check, BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop, BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX, } from "react-icons/bs";
import { FiX } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function NavbarDark() {
    const [scroll,setScroll] = useState(false);
    const [current , setCurrent] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    const [toggle, setIsToggle] = useState(false);

    const location = usePathname(); 

    const router = useRouter();
    
    useEffect(()=>{
        if (typeof window === "undefined") return;
        window.scrollTo(0,0)
        setCurrent(location)

        const handlerScroll=()=>{
            if(window.scrollY > 50){
                setScroll(true)
            }else{setScroll(false)}
        }

        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth);
        }

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
          };

        window.addEventListener('scroll',handlerScroll)
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll',handlerScroll)
            window.removeEventListener('resize', handleResize);
          };
    },[windowWidth])

  return (
    <>
        <div className={`header header-light ${scroll ? 'header-fixed' : ''} `} data-sticky-element="">
            <div className="container-fluid">
                <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : " navigation navigation-portrait "}>
                    <div className="nav-header">
                        <Link className="nav-brand" href="/"><Image src='/img/logo.svg' width={0} height={0} sizes='100vw' style={{width:'166px', height:'auto'}} className="logo" alt=""/></Link>
                        <div className="nav-toggle" onClick={()=>setIsToggle(!toggle)}></div>
                        <div className="mobile_nav">
                            <ul>
                                <li>
                                    <Link href="/login" className="d-flex align-items-center"><BsPersonCircle className="me-1"/></Link>
                                </li>
                                <li>
                                    <Link href="#searchSlider" className="d-flex align-items-center" data-bs-toggle="offcanvas" role="button" aria-controls="searchSlider"><BsSearch className="me-1"/></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={`nav-menus-wrapper  ${toggle ? 'nav-menus-wrapper-open' : ''}`} style={{transitionProperty:toggle ? 'none' : 'left'}}>
                        <div className='mobLogos'>
                            <Image src='/img/logo.svg' width={0} height={0} sizes='100vw' style={{width:'140px', height:'auto'}} className='img-fluid lightLogo' alt='Logo'/>
                        </div>
                        <span className='nav-menus-wrapper-close-button'  onClick={()=>setIsToggle(!toggle)}>✕</span>
                        <ul className="nav-menu" style={{justifyContent: 'center', width: '100%'}}>
                            <li className={`${current === '/' ? 'active' : ''}`}><Link href="/">Home</Link></li>
                            
                            <li className={`${['/list-layout-01', '/grid-layout-01', '/half-map-01'].includes(current) ? 'active' : ''}`}>
                                <Link href="/list-layout-01">Browse Contractors</Link>
                            </li>

                            <li className={`${current === '/categories' ? 'active' : ''}`}>
                                <Link href="/categories">Categories</Link>
                            </li>

                            <li className={`${['/blog', '/blog-detail'].some(path => current.startsWith(path)) ? 'active' : ''}`}>
                                <Link href="/blog">Blog</Link>
                            </li>

                            <li className={`${current === '/about-us' ? 'active' : ''}`}>
                                <Link href="/about-us">About Us</Link>
                            </li>
                        </ul>

                        <ul className="nav-menu nav-menu-social align-to-right">
                            <li>
                                <Link href="/login" className="d-flex align-items-center"><BsPersonCircle className="fs-6 me-1"/><span className="navCl">Login</span></Link>
                            </li>
                            <li className="list-buttons">
                                <Link href="/register"><BsPersonPlus className="fs-6 me-1"/>Sign Up</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div className="clearfix"></div>

        <div className="modal fade" id="login" tabIndex={-1} role="dialog" aria-labelledby="loginmodal" aria-hidden="true">
            <div className="modal-dialog" id="loginmodal">
                <div className="modal-content">
                    <div className="modal-header justify-content-end border-0 pb-0">
                        <Link href="#" className="square--30 circle bg-light-danger text-danger" data-bs-dismiss="modal" aria-label="Close"><FiX className=""/></Link>
                    </div>
                    
                    <div className="modal-body px-4">
                        <div className="text-center mb-5">
                            <h2>Welcome Back</h2>
                            <p className="fs-6">Login to manage your account.</p>
                        </div>

                        <form className="needs-validation px-lg-2" noValidate>
                            <div className="row align-items-center justify-content-between g-3 mb-4">
                                <div className="col-xl-6 col-lg-6 col-md-6"><Link href="#" className="btn btn-outline-secondary border rounded-3 text-md px-lg-2 full-width"><img src='/img/google.png' className="img-fluid me-2" width="16" alt=""/>Login with Google</Link></div>
                                <div className="col-xl-6 col-lg-6 col-md-6"><Link href="#" className="btn btn-outline-secondary border rounded-3 text-md px-lg-2 full-width"><img src='/img/facebook.png' className="img-fluid me-2" width="16" alt=""/>Login with Facebook</Link></div>
                            </div>
                            
                            <div className="form-group form-border mb-4">
                                <label className="form-label" htmlFor="email01">Your email</label>
                                <input type="email" className="form-control" id="email01" placeholder="email@site.com" required/>
                                <span className="invalid-feedback">Please enter a valid email address.</span>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="form-label" htmlFor="pass01">Password</label>
                                    <a href="/forgot-password"  className="link fw-medium text-primary">Forgot Password?</a>
                                </div>

                                <div className="input-group-merge form-group form-border ">
                                    <input type="password" className="form-control" id="pass01" placeholder="8+ characters required" required/>
                                </div>

                                <span className="invalid-feedback">Please enter a valid password.</span>
                            </div>

                            <div className="d-grid mb-3">
                                <button type="submit" className="btn btn-primary fw-medium">Log in</button>
                            </div>

                            <div className="text-center">
                                <p>Don't have an account yet? <a className="link fw-medium text-primary" href="/register">Sign up here</a></p>
                            </div>
                        </form>
                    </div>
                    
                    <div className="modal-footer p-3 border-top">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <div className="brand px-lg-4 px-3"><Image src='/img/brand/logo-1.png' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}}  className="img-fluid" alt=""/></div>
                            <div className="brand px-lg-4 px-3"><Image src="/img/brand/logo-2.png" width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="img-fluid" alt=""/></div>
                            <div className="brand px-lg-4 px-3"><Image src="/img/brand/logo-3.png" width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="img-fluid" alt=""/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="offcanvas offcanvas-top h-auto" tabIndex={-1} id="searchSlider" aria-labelledby="searchSliderLabel">
            <div className="offcanvas-body" id="searchSliderLabel">
                <div className="searchForm w-100 mb-3">
                    <div className="p-2 ps-3 rounded border d-flex align-items-center justify-content-between gap-2">
                        <div className="searchicons"><span><BsSearch className="fs-4 opacity-75"/></span></div>
                        <div className="flex-fill"><input type="search" className="form-control border-0 ps-0" placeholder="What are you looking for?"/></div>
                        <div className="closeSlides"><Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><BsX/></Link></div>
                    </div>
                </div>
                <div className="popularSearches d-flex align-items-center justify-content-center gap-2 flex-wrap">
                    <div className="singleItem"><Link href="/categories" className="badge badge-xs badge-primary rounded-pill">Plumbing</Link></div>	
                    <div className="singleItem"><Link href="/categories" className="badge badge-xs badge-primary rounded-pill">Electrical</Link></div>	
                    <div className="singleItem"><Link href="/categories" className="badge badge-xs badge-primary rounded-pill">HVAC</Link></div>	
                    <div className="singleItem"><Link href="/categories" className="badge badge-xs badge-primary rounded-pill">Roofing</Link></div>	
                    <div className="singleItem"><Link href="/categories" className="badge badge-xs badge-primary rounded-pill">General Contractors</Link></div>	
                </div>
            </div>
        </div>
    </>
  )
}
