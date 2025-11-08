'use client';
import React from 'react';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { BiCheck, BiX } from 'react-icons/bi';

export default function ContractorPricingPage() {
  return (
    <>
      {/* Header */}
      <div className="page-title primary-bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 text-center">
              <h1 className="ft-bold mb-2 text-light">Contractor Pricing</h1>
              <p className="text-light opacity-75">
                Choose the plan that works best for your business
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-3">Subscription Plans</h2>
              <p className="text-muted">
                Get unlimited access to job leads with our Pro and Elite plans
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            {SUBSCRIPTION_PLANS.map((plan, index) => (
              <div key={plan.tier} className="col-lg-4 col-md-6 mb-4">
                <div
                  className={`card h-100 ${
                    plan.tier === 'elite'
                      ? 'border-primary shadow-lg'
                      : plan.tier === 'pro'
                      ? 'border-secondary shadow'
                      : 'shadow-sm'
                  }`}
                >
                  {plan.tier === 'elite' && (
                    <div className="ribbon ribbon-top-right">
                      <span className="bg-primary">RECOMMENDED</span>
                    </div>
                  )}
                  <div className="card-body p-4">
                    <div className="text-center mb-4">
                      <h4 className="fw-bold mb-2">{plan.name}</h4>
                      <div className="mb-3">
                        <span className="display-4 fw-bold">
                          ${plan.price / 100}
                        </span>
                        <span className="text-muted">/month</span>
                      </div>
                      {plan.tier === 'free' ? (
                        <Link
                          href="/register"
                          className="btn btn-outline-primary full-width"
                        >
                          Get Started
                        </Link>
                      ) : (
                        <Link
                          href={`/checkout?plan=${plan.tier}`}
                          className={`btn ${
                            plan.tier === 'elite'
                              ? 'btn-primary'
                              : 'btn-secondary'
                          } full-width`}
                        >
                          Subscribe Now
                        </Link>
                      )}
                    </div>

                    <ul className="list-unstyled">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="mb-2 d-flex align-items-start">
                          <BiCheck className="text-success fs-5 me-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-3">Feature Comparison</h2>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Feature</th>
                        <th className="text-center">Free</th>
                        <th className="text-center">Pro</th>
                        <th className="text-center">Elite</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Job Responses / Month</td>
                        <td className="text-center">3</td>
                        <td className="text-center">Unlimited</td>
                        <td className="text-center">Unlimited</td>
                      </tr>
                      <tr>
                        <td>Featured Listing</td>
                        <td className="text-center">
                          <BiX className="text-danger fs-5" />
                        </td>
                        <td className="text-center">
                          <BiCheck className="text-success fs-5" />
                        </td>
                        <td className="text-center">
                          <BiCheck className="text-success fs-5" />
                        </td>
                      </tr>
                      <tr>
                        <td>Priority Search</td>
                        <td className="text-center">
                          <BiX className="text-danger fs-5" />
                        </td>
                        <td className="text-center">
                          <BiCheck className="text-success fs-5" />
                        </td>
                        <td className="text-center">
                          <BiCheck className="text-success fs-5" />
                        </td>
                      </tr>
                      <tr>
                        <td>Badge</td>
                        <td className="text-center">-</td>
                        <td className="text-center">Pro Member</td>
                        <td className="text-center">Elite Member</td>
                      </tr>
                      <tr>
                        <td>Analytics</td>
                        <td className="text-center">-</td>
                        <td className="text-center">Basic</td>
                        <td className="text-center">Advanced</td>
                      </tr>
                      <tr>
                        <td>SMS Notifications</td>
                        <td className="text-center">
                          <BiX className="text-danger fs-5" />
                        </td>
                        <td className="text-center">
                          <BiCheck className="text-success fs-5" />
                        </td>
                        <td className="text-center">
                          <BiCheck className="text-success fs-5" />
                        </td>
                      </tr>
                      <tr>
                        <td>Homepage Featured</td>
                        <td className="text-center">
                          <BiX className="text-danger fs-5" />
                        </td>
                        <td className="text-center">
                          <BiX className="text-danger fs-5" />
                        </td>
                        <td className="text-center">
                          <BiCheck className="text-success fs-5" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="gray-simple py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4 text-center">
                Frequently Asked Questions
              </h2>

              <div className="accordion" id="pricingFAQ">
                <div className="card mb-2">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq1"
                      >
                        Can I cancel anytime?
                      </button>
                    </h5>
                  </div>
                  <div id="faq1" className="collapse show">
                    <div className="card-body">
                      Yes! You can cancel your subscription at any time. You'll
                      continue to have access until the end of your billing period.
                    </div>
                  </div>
                </div>

                <div className="card mb-2">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <button className="btn btn-link" type="button">
                        What happens to unused lead credits?
                      </button>
                    </h5>
                  </div>
                  <div className="card-body">
                    Lead credits never expire! Use them whenever you need to
                    respond to jobs.
                  </div>
                </div>

                <div className="card mb-2">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <button className="btn btn-link" type="button">
                        Can I upgrade or downgrade my plan?
                      </button>
                    </h5>
                  </div>
                  <div className="card-body">
                    Absolutely! Upgrade anytime to access more features. When you
                    downgrade, changes take effect at the end of your current
                    billing period.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

