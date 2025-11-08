'use client'
import React, { useState,useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { BsPersonCircle,BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill, BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsPatchPlus, BsBoxArrowInRight, BsPersonPlus, BsEnvelopeCheck, BsInfoCircle, BsX, BsBoxArrowRight } from "react-icons/bs";
import { FiX } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function NavbarSimple() {
    const [scroll,setScroll] = useState(false);
    const [current , setCurrent] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    const [toggle, setIsToggle] = useState(false);
    const { currentUser, userData, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const location = usePathname();
    
    const isAuthenticated = !!currentUser;
    const isContractor = userData?.userType === 'contractor';
    const isDashboardPage = current?.startsWith('/dashboard');
    
    useEffect(()=>{
        if (typeof window === "undefined") return;
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
    },[location])

  return (
    <>
        <div className={`header header-light ${scroll ? 'header-fixed' : ''} `} data-sticky-element="">
            <div className="container-fluid">
                <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : " navigation navigation-portrait "}>
                    <div className="nav-header">
                        <Link className="nav-brand" href="/"><Image src='/img/logo.svg' width={166} height={50} priority className="logo" alt="Logo" style={{width:'166px', height:'auto'}}/></Link>
                        <div className="nav-toggle" onClick={()=>setIsToggle(!toggle)}></div>
                        <div className="mobile_nav">
                            <ul>
                                {isAuthenticated ? (
                                    <>
                                        <li>
                                            <Link href="/dashboard-user" className="d-flex align-items-center"><BsPersonCircle className="me-1"/></Link>
                                        </li>
                                        <li>
                                            <NotificationBell />
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link href="/login" className="d-flex align-items-center"><BsPersonCircle className="me-1"/></Link>
                                    </li>
                                )}
                                <li>
                                    <Link href="#searchSlider" className="d-flex align-items-center" data-bs-toggle="offcanvas" role="button" aria-controls="searchSlider"><BsSearch className="me-1"/></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={`nav-menus-wrapper  ${toggle ? 'nav-menus-wrapper-open' : ''}`} style={{transitionProperty:toggle ? 'none' : 'left'}}>
                        <div className='mobLogos'>
                            <Image src='/img/logo.svg' width={140} height={42} priority className='img-fluid lightLogo' alt='Logo' style={{width:'140px', height:'auto'}}/>
                        </div>
                        <span className='nav-menus-wrapper-close-button'  onClick={()=>setIsToggle(!toggle)}>✕</span>
                        <ul className="nav-menu" style={{justifyContent: 'center', width: '100%'}}>
                            <li className={`${current === '/' ? 'active' : ''}`}><Link href="/">Home</Link></li>
                            
                            {/* Browse Contractors - Show on all pages except dashboard */}
                            {!isDashboardPage && (
                                <li className={`${['/list-layout-01', '/grid-layout-01', '/half-map-01'].includes(current) ? 'active' : ''}`}>
                                    <Link href="/list-layout-01">Browse Contractors</Link>
                                </li>
                            )}

                            {/* Categories */}
                            {!isDashboardPage && (
                                <li className={`${current === '/categories' ? 'active' : ''}`}>
                                    <Link href="/categories">Categories</Link>
                                </li>
                            )}

                            {/* Blog */}
                            {!isDashboardPage && (
                                <li className={`${['/blog', '/blog-detail'].some(path => current.startsWith(path)) ? 'active' : ''}`}>
                                    <Link href="/blog">Blog</Link>
                                </li>
                            )}

                            {/* About Us */}
                            {!isDashboardPage && (
                                <li className={`${current === '/about-us' ? 'active' : ''}`}>
                                    <Link href="/about-us">About Us</Link>
                                </li>
                            )}

                        </ul>

                        <ul className="nav-menu nav-menu-social align-to-right">
                            {/* My Account - Only show when authenticated */}
                            {isAuthenticated && (
                                <li className={`${['/dashboard-user','/dashboard-my-profile','/dashboard-my-listings','/dashboard-bookmarks','/dashboard-messages','/dashboard-reviews','/dashboard-my-bookings','/dashboard-wallet'].includes(current)? 'active' : ''}`}>
                                    <Link href="#">My Account<span className="submenu-indicator"><span className="submenu-indicator-chevron"></span></span></Link>
                                    <ul className="nav-dropdown nav-submenu">
                                        <li className={`${current === '/dashboard-user' ? 'active' : ''}`}><Link href="/dashboard-user" className='d-flex'><BsSpeedometer className="me-1 align-self-center"/>Dashboard</Link></li>
                                        <li className={`${current === '/dashboard-my-profile' ? 'active' : ''}`}><Link href="/dashboard-my-profile" className='d-flex'><BsPersonLinesFill className="me-1 align-self-center"/>My Profile</Link></li>
                                        {isContractor && (
                                            <li className={`${current === '/dashboard-my-listings' ? 'active' : ''}`}><Link href="/dashboard-my-listings" className='d-flex'><BsUiRadiosGrid className="me-1 align-self-center"/>My Listings</Link></li>
                                        )}
                                        <li className={`${current === '/dashboard-bookmarks' ? 'active' : ''}`}><Link href="/dashboard-bookmarks" className='d-flex'><BsBookmarkStar className="me-1 align-self-center"/>Bookmarks</Link></li>
                                        <li className={`${current === '/dashboard-messages' ? 'active' : ''}`}><Link href="/dashboard-messages" className='d-flex'><BsChatDots className="me-1 align-self-center"/>Messages</Link></li>
                                        {isContractor && (
                                            <>
                                                <li className={`${current === '/dashboard-reviews' ? 'active' : ''}`}><Link href="/dashboard-reviews" className='d-flex'><BsYelp className="me-1 align-self-center"/>Reviews</Link></li>
                                                <li className={`${current === '/dashboard-wallet' ? 'active' : ''}`}><Link href="/dashboard-wallet" className='d-flex'><BsJournalCheck className="me-1 align-self-center"/>Wallet</Link></li>
                                            </>
                                        )}
                                        {!isContractor && (
                                            <li className={`${current === '/dashboard-my-bookings' ? 'active' : ''}`}><Link href="/dashboard-my-bookings" className='d-flex'><BsJournalCheck className="me-1 align-self-center"/>My Bookings</Link></li>
                                        )}
                                    </ul>
                                </li>
                            )}
                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <NotificationBell />
                                    </li>
                                    <li>
                                        <div className="dropdown">
                                            <button className="btn btn-link d-flex align-items-center text-decoration-none" type="button" data-bs-toggle="dropdown">
                                                <BsPersonCircle className="fs-6 me-1"/>
                                                <span className="navCl">{userData?.displayName || 'Account'}</span>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link href="/dashboard-user" className="dropdown-item">Dashboard</Link></li>
                                                <li><Link href="/dashboard-my-profile" className="dropdown-item">My Profile</Link></li>
                                                <li><hr className="dropdown-divider"/></li>
                                                <li>
                                                    <button 
                                                        className="dropdown-item d-flex align-items-center" 
                                                        onClick={async () => {
                                                            await signOut();
                                                            router.push('/');
                                                        }}
                                                    >
                                                        <BsBoxArrowRight className="me-2"/>Logout
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    {isContractor && (
                                        <li className="list-buttons">
                                            <Link href="/dashboard-add-listing"><BsGeoAlt className="fs-6 me-1"/>Add Listing</Link>
                                        </li>
                                    )}
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/login" className="d-flex align-items-center"><BsPersonCircle className="fs-6 me-1"/><span className="navCl">Login</span></Link>
                                    </li>
                                    <li className="list-buttons">
                                        <Link href="/register"><BsPersonPlus className="fs-6 me-1"/>Sign Up</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div className="clearfix"></div>

        <div className="offcanvas offcanvas-top h-auto" tabIndex={-1} id="searchSlider" aria-labelledby="searchSliderLabel">
            <div className="offcanvas-body" id="searchSliderLabel">
                <div className="searchForm w-100 mb-3">
                    <div className="p-2 ps-3 rounded border d-flex align-items-center justify-content-between gap-2">
                        <div className="searchicons"><span><BsSearch className="fs-4 opacity-75"/></span></div>
                        <div className="flex-fill"><input type="search" className="form-control border-0 ps-0" placeholder="Search for contractors..."/></div>
                        <div className="closeSlides"><Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><BsX/></Link></div>
                    </div>
                </div>
                <div className="popularSearches d-flex align-items-center justify-content-center gap-2 flex-wrap">
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Plumbing</Link></div>	
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Electrical</Link></div>	
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">HVAC</Link></div>	
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Roofing</Link></div>	
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">General Contractors</Link></div>	
                </div>
            </div>
        </div>
    </>
  )
}

