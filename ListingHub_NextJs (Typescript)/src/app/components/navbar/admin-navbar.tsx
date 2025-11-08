'use client'
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

import { BsPersonCircle,BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill, BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus, BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check, BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop, BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX } from "react-icons/bs";
import { FiX } from 'react-icons/fi';
import { FaSortDown, FaXmark } from 'react-icons/fa6'


export default function AdminNavbar() {
    const [scroll,setScroll] = useState(false);
    const [current , setCurrent] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    const [toggle, setIsToggle] = useState(false);

    const location = usePathname(); 
    
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
        <div className={`header header-dark navdark ${scroll ? 'header-fixed' : ''}`} data-sticky-element="">
            <div className="container-fluid">
                <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : "navigation navigation-portrait"}>
                    <div className="nav-header">
                        <Link className="nav-brand" href="/"><img src='/img/logo-light.svg' className="logo" alt=""/></Link>
                        <div className="nav-toggle" onClick={()=>setIsToggle(!toggle)}></div>
                        <div className="mobile_nav">
                            <ul>
                                <li>
                                    <Link data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" className="d-inline-flex py-0 pt-1 px-1"><div className="d-inline-flex w-8 h-8 circle overflow-hidden"><img src='/img/team-2.jpg' className="img-fluid" alt=""/></div></Link>
                                </li>
                                <li>
                                    <Link href="#searchSlider" className="d-flex align-items-center" data-bs-toggle="offcanvas" role="button" aria-controls="searchSlider"><BsSearch className="me-1"/></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={`nav-menus-wrapper  ${toggle ? 'nav-menus-wrapper-open' : ''}`} style={{transitionProperty:toggle ? 'none' : 'left'}}>
                        <div className='mobLogos'>
                            <img src='/img/logo.svg' className='img-fluid lightLogo' alt='Logo'/>
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
                                <div className="btn-group account-drop">
                                    <Link href="#" className="nav-link btn-order-by-filt" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div className="d-inline-flex w-8 h-8 circle overflow-hidden"><img src='/img/team-2.jpg' className="img-fluid" alt=""/></div>
                                        <span className="fw-medium d-inline-flex ms-2 text-light">Shreethemes<FaSortDown className="ms-1"/></span>
                                    </Link>
                                    <div className="dropdown-menu pull-right animated flipInX">
                                        <div className="drp_menu_headr bg-primary">
                                            <h4>Hi, Shreethemes</h4>
                                            <div className="drp_menu_headr-right"><button type="button" className="btn btn-whites text-dark">My Profile</button></div>
                                        </div>
                                        <ul>
                                            <li><Link href="/dashboard-user"><BsSpeedometer className="me-2"/>Dashboard Area</Link></li>
                                            <li><Link href="/dashboard-my-profile"><BsPersonLinesFill className="me-2"/>My Profile</Link></li>
                                            <li><Link href="/dashboard-my-bookings"><BsJournalCheck className="me-2"/>My Bookings</Link></li>
                                            <li><Link href="/dashboard-my-listings"><BsUiRadiosGrid className="me-2"/>My Listings</Link></li>
                                            <li><Link href="/dashboard-bookmarks"><BsBookmarkStar className="me-2"/>Bookmarkes</Link></li>
                                            <li><Link href="/dashboard-messages"><BsChatDots className="me-2"/>Messages<span className="notti_coun style-1">3</span></Link></li>
                                            <li><Link href="/dashboard-reviews"><BsYelp className="me-2"/>Reviews</Link></li>
                                            <li><Link href="/dashboard-wallet"><BsWallet className="me-2"/>Wallet</Link></li>
                                            <li><Link href="/dashboard-add-listing"><BsPatchPlus className="me-2"/>Add Listing</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li className="list-buttons">
                                <Link href="/dashboard-add-listing"><BsPatchPlus className="fs-6 me-1"/>Add Listing</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div className="clearfix"></div>

        <div className="offcanvas offcanvas-end offcanvas-menu" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
				<div className="offcanvas-header">
					<button type="button" className="btn-closes" data-bs-dismiss="offcanvas" aria-label="Close"><FaXmark className=""/></button>
				</div>
				<div className="offcanvas-body" id="offcanvasExampleLabel">
                    <ul>
                        <li><a href="/dashboard-user"><BsSpeedometer className="me-2"/>Dashboard Area</a></li>
                        <li><a href="/dashboard-my-profile"><BsPersonLinesFill className="me-2"/>My Profile</a></li>
                        <li><a href="/dashboard-my-bookings"><BsJournalCheck className="me-2"/>My Bookings</a></li>
                        <li><a href="/dashboard-my-listings"><BsUiRadiosGrid className="me-2"/>My Listings</a></li>
                        <li><a href="/dashboard-bookmarks"><BsBookmarkStar className="me-2"/>Bookmarkes</a></li>
                        <li><a href="/dashboard-messages"><BsChatDots className="me-2"/>Messages<span className="notti_coun style-1">3</span></a></li>
                        <li><a href="/dashboard-reviews"><BsYelp className="me-2"/>Reviews</a></li>
                        <li><a href="/dashboard-wallet"><BsWallet className="me-2"/>Wallet</a></li>
                        <li><a href="/dashboard-add-listing"><BsPatchPlus className="me-2"/>Add Listing</a></li>
                    </ul>
				</div>
			</div>
            <div className="offcanvas offcanvas-top h-auto" tabIndex={-1} id="searchSlider" aria-labelledby="searchSliderLabel">
				<div className="offcanvas-body" id="searchSliderLabel">
					<div className="searchForm w-100 mb-3">
						<div className="p-2 ps-3 rounded border d-flex align-items-center justify-content-between gap-2">
							<div className="searchicons"><span><BsSearch className="fs-4 opacity-75"/></span></div>
							<div className="flex-fill"><input type="search" className="form-control border-0 ps-0" placeholder="What are you looking for?"/></div>
							<div className="closeSlides"><Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><BsX /></Link></div>
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
