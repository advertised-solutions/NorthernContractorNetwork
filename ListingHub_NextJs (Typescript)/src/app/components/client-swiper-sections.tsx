'use client'
import dynamic from "next/dynamic";

// Client-side only components with ssr: false to prevent hydration mismatches
const CategoryOne = dynamic(() => import("./categories/category-one"), {
  ssr: false,
  loading: () => (
    <div className="row align-items-center justify-content-center">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="category-small-wrapper light">
              <div className="categoryBox">
                <div className="categoryCapstions">
                  <div className="catsIcons"><div className="icoBoxx"></div></div>
                  <div className="catsTitle"><h5>Loading...</h5></div>
                  <div className="CatsLists"><span className="categorycounter">...</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const PopularListingOne = dynamic(() => import("./popular-listing-one"), {
  ssr: false,
  loading: () => (
    <div className="row align-items-center justify-content-center">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="row g-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-xl-3 col-lg-4 col-md-6">
              <div className="listingitem-container">
                <div className="singlelisting-item">
                  <div className="listing-top-item">
                    <div className="position-absolute start-0 top-0 ms-3 mt-3 z-2">
                      <div className="d-flex align-items-center justify-content-start gap-2">
                        <span className="badge badge-xs text-uppercase listOpen">Loading...</span>
                      </div>
                    </div>
                  </div>
                  <div className="listing-middle-item">
                    <div className="listing-details">
                      <h4 className="listingTitle">Loading...</h4>
                      <p>Loading listing details...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const ClientOne = dynamic(() => import("./client-one"), {
  ssr: false,
  loading: () => (
    <div className="row align-items-center justify-content-center">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="row g-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-xl-3 col-lg-4 col-md-6">
              <div className="reviews-wrappers">
                <div className="reviewsBox card border-0 rounded-4 shadow-sm">
                  <div className="card-body p-xl-5 p-lg-5 p-4">
                    <div className="reviews-topHeader d-flex flex-column mb-3">
                      <div className="revws-desc text-center">
                        <p className="text-dark fw-semibold mb-1">Loading...</p>
                        <p className="m-0 text-dark">Loading review...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

export { CategoryOne, PopularListingOne, ClientOne };

