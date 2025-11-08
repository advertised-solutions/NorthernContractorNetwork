'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
    BsTools, BsDroplet, BsLightning, BsWind, BsHouseDoor, 
    BsPaintBucket, BsSquare, BsTree, BsHammer, BsBox,
    BsTelephone, BsEnvelope, BsCheckCircle, BsX
} from 'react-icons/bs'
import { MdArrowForwardIos } from 'react-icons/md'
import NavbarSimple from '../components/navbar/navbar-simple'
import FooterTop from '../components/footer-top'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

interface ContractorCategory {
    id: string
    name: string
    icon: any
    description: string
    listingCount: number
}

const contractorCategories: ContractorCategory[] = [
    {
        id: 'plumbing',
        name: 'Plumbing',
        icon: BsDroplet,
        description: 'Professional plumbers for installation, repair, and maintenance',
        listingCount: 45
    },
    {
        id: 'electrical',
        name: 'Electrical',
        icon: BsLightning,
        description: 'Licensed electricians for wiring, installations, and repairs',
        listingCount: 38
    },
    {
        id: 'hvac',
        name: 'HVAC',
        icon: BsWind,
        description: 'Heating, ventilation, and air conditioning specialists',
        listingCount: 52
    },
    {
        id: 'roofing',
        name: 'Roofing',
        icon: BsHouseDoor,
        description: 'Roof installation, repair, and replacement services',
        listingCount: 29
    },
    {
        id: 'general-contractors',
        name: 'General Contractors',
        icon: BsTools,
        description: 'Complete construction and renovation projects',
        listingCount: 67
    },
    {
        id: 'painting',
        name: 'Painting',
        icon: BsPaintBucket,
        description: 'Interior and exterior painting services',
        listingCount: 41
    },
    {
        id: 'flooring',
        name: 'Flooring',
        icon: BsSquare,
        description: 'Hardwood, tile, carpet, and laminate installation',
        listingCount: 33
    },
    {
        id: 'landscaping',
        name: 'Landscaping',
        icon: BsTree,
        description: 'Lawn care, garden design, and outdoor improvements',
        listingCount: 28
    },
    {
        id: 'carpentry',
        name: 'Carpentry',
        icon: BsHammer,
        description: 'Custom woodwork, cabinets, and framing',
        listingCount: 22
    },
    {
        id: 'concrete-masonry',
        name: 'Concrete & Masonry',
        icon: BsBox,
        description: 'Concrete work, brickwork, and stone installation',
        listingCount: 19
    },
]

export default function CategoriesPage() {
    const [formData, setFormData] = useState({
        categoryName: '',
        description: '',
        name: '',
        email: '',
        phone: '',
        reason: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            const response = await fetch('/api/category-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSubmitStatus('success')
                setFormData({
                    categoryName: '',
                    description: '',
                    name: '',
                    email: '',
                    phone: '',
                    reason: ''
                })
            } else {
                setSubmitStatus('error')
            }
        } catch (error) {
            console.error('Error submitting category request:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <NavbarSimple/>

            <section className="bg-cover position-relative" style={{backgroundImage:`url('/img/title-banner.jpg')`}} data-overlay="6">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12">
                            <div className="position-relative text-center mb-5 pt-5 pt-lg-0">
                                <h1 className="text-light xl-heading">Contractor Categories</h1>
                                <nav id="breadcrumbs" className="breadcrumbs light">
                                    <ul>
                                        <li><Link href="/">Home</Link></li><MdArrowForwardIos className='ms-2'/>
                                        <li>Categories</li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center align-items-center mb-5">
                        <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h3 className="sectionHeading">Contractor <span className="text-primary">Industries</span></h3>
                                <p>Browse all the contractor industries we support. Find the perfect contractor for your project needs.</p>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {contractorCategories.map((category) => {
                            const Icon = category.icon
                            return (
                                <div key={category.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                    <Link href={`/list-layout-01?category=${category.id}`} className="text-decoration-none">
                                        <div className="card rounded-4 shadow-sm h-100 border-0 hover-lift">
                                            <div className="card-body p-4">
                                                <div className="d-flex align-items-start mb-3">
                                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                                        <Icon className="fs-3 text-primary" />
                                                    </div>
                                                    <div className="flex-fill">
                                                        <h5 className="mb-1 fw-semibold">{category.name}</h5>
                                                        <p className="text-muted small mb-0">{category.listingCount} Contractors</p>
                                                    </div>
                                                </div>
                                                <p className="text-muted mb-0 small">{category.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-10 col-md-12">
                            <div className="card rounded-4 shadow-sm border-0">
                                <div className="card-body p-4 p-lg-5">
                                    <div className="text-center mb-4">
                                        <h3 className="sectionHeading mb-2">Request a New Category</h3>
                                        <p className="text-muted">Don't see the contractor industry you're looking for? Let us know and we'll consider adding it!</p>
                                    </div>

                                    {submitStatus === 'success' && (
                                        <div className="alert alert-success d-flex align-items-center" role="alert">
                                            <BsCheckCircle className="me-2" />
                                            <div>Thank you! Your category request has been submitted. We'll review it and get back to you soon.</div>
                                        </div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <BsX className="me-2" />
                                            <div>There was an error submitting your request. Please try again.</div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="categoryName" className="form-label fw-medium">Category Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="categoryName"
                                                    name="categoryName"
                                                    value={formData.categoryName}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., Flooring Installation"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="name" className="form-label fw-medium">Your Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="email" className="form-label fw-medium">Email Address *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="phone" className="form-label fw-medium">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="(555) 123-4567"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="description" className="form-label fw-medium">Category Description *</label>
                                                <textarea
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    required
                                                    rows={3}
                                                    placeholder="Brief description of what this category includes..."
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="reason" className="form-label fw-medium">Why is this category needed? *</label>
                                                <textarea
                                                    className="form-control"
                                                    id="reason"
                                                    name="reason"
                                                    value={formData.reason}
                                                    onChange={handleChange}
                                                    required
                                                    rows={3}
                                                    placeholder="Tell us why this contractor category would be valuable to our platform..."
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary rounded-pill px-5"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FooterTop/>
            <Footer/>
            <BackToTop/>
        </>
    )
}

