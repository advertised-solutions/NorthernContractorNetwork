import React from 'react'
import Link from 'next/link'

export default function Descriptions() {
  return (
        <div className="listingSingleblock mb-4" id="descriptions">
            <div className="SingleblockHeader">
                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Description</h4></Link>
            </div>
            
            <div id="description" className="panel-collapse collapse show">
                <div className="card-body p-4 pt-2">
                    <p>Welcome to our professional contractor directory. We specialize in connecting homeowners and businesses with licensed, insured, and experienced contractors across all major trades. Our contractors are carefully vetted to ensure quality service and customer satisfaction.</p>
                    <p>Our platform features contractors specializing in plumbing, electrical work, HVAC services, roofing, general contracting, painting, flooring, landscaping, carpentry, and concrete/masonry work. Each contractor listed on our platform has been verified for proper licensing, insurance coverage, and has maintained excellent ratings from previous customers. We're committed to helping you find the right contractor for your project needs.</p>
                </div>
            </div>
        </div>
  )
}
