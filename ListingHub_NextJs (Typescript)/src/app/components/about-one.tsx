import Image from 'next/image'
import React from 'react'
import { BsPiggyBank, BsShieldCheck } from 'react-icons/bs'

export default function AboutOne() {
  return (
        <div className="container">
            <div className="row align-items-center justify-content-between g-4">
                
                <div className="col-xl-5 col-lg-6 col-md-5">
                    <div className="featuresImage">
                        <Image src="/img/search-engine-isometric.svg" width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%'}} className="img-fluid" alt="Features Image"/>
                    </div>
                </div>
                
                <div className="col-xl-5 col-lg-6 col-md-6">
                    <div className="featuresCaption">
                        <div className="fstsTitle mb-4">
                            <h3 className="fw-medium lh-base">Why People Love & Select Our Contractor Platform?</h3>
                        </div>
                        <div className="fstsFeatures mb-4">
                            <div className="d-flex flex-column gap-4">
                            
                                <div className="d-flex align-items-start justify-content-start gap-3">
                                    <div className="fstlsIcons"><BsPiggyBank className="text-primary fs-1"/></div>
                                    <div className="fstlsPara">
                                        <h5 className="fw-medium">Compare Prices & Save</h5>
                                        <p className="lead m-0">Get multiple quotes from verified contractors and compare prices to find the best value for your project. Our platform helps you make informed decisions.</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start justify-content-start gap-3">
                                    <div className="fstlsIcons"><BsShieldCheck className="text-primary fs-1"/></div>
                                    <div className="fstlsPara">
                                        <h5 className="fw-medium">Safe &amp; Secure</h5>
                                        <p className="lead m-0">All contractors are verified for licensing and insurance. Our secure payment system protects your transactions and ensures quality workmanship.</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className="fstsButton">
                            <button className="btn btn-light-primary rounded-pill fw-medium" type="button">List Your Contractor Business</button>
                        </div>
                    </div>
                </div>
            
            </div>
        </div>
  )
}
