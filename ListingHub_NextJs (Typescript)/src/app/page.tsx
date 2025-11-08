import Link from "next/link";
import dynamic from "next/dynamic";
import NavbarSimple from "./components/navbar/navbar-simple";
import FormOne from "./components/form/form-one";
import { BsMouse } from "react-icons/bs";
import { CategoryOne, PopularListingOne, ClientOne } from "./components/client-swiper-sections";

// Lazy load components below the hero section for faster initial load
const BrandImage = dynamic(() => import("./components/brand-image"));
const BlogOne = dynamic(() => import("./components/blog-one"), {
  loading: () => <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>,
});
const FooterTop = dynamic(() => import("./components/footer-top"));
const Footer = dynamic(() => import("./components/footer/footer"));
const BackToTop = dynamic(() => import("./components/back-to-top"));

export default function Home() {
  return (
    <>
     <NavbarSimple/>

          <div className="image-cover hero-header position-relative" style={{backgroundImage:`url('/img/banner-1.jpg')`}} data-overlay="6">
            <div className="container">
                <div className="row justify-content-center align-items-center mb-5 pt-lg-0 pt-5">
                    <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
                        <div className="position-relative text-center">
                            <h1>Find Trusted Contractors</h1>
                            <p className="subtitle">Browse high-rated contractors for your next project!</p>
                        </div>
                    </div>
                </div>
                
                <FormOne/>
                
                <div className="row align-items-center justify-content-center">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-2">
                        <div className="text-center"><h6 className="fw-semibold">Explore Popular Categories</h6></div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-md-12 col-12">
                        <div className="popularSearches d-flex align-items-center justify-content-center column-gap-3 row-gap-1 flex-wrap">
                            <div className="singleItem"><Link href="#" className="badge badge-transparent rounded-pill">Plumbing</Link></div>	
                            <div className="singleItem"><Link href="#" className="badge badge-transparent rounded-pill">Electrical</Link></div>	
                            <div className="singleItem"><Link href="#" className="badge badge-transparent rounded-pill">HVAC</Link></div>	
                            <div className="singleItem"><Link href="#" className="badge badge-transparent rounded-pill">Roofing</Link></div>	
                            <div className="singleItem"><Link href="#" className="badge badge-transparent rounded-pill">General Contractors</Link></div>	
                        </div>
                    </div>
                </div>

            </div>
            <div className="mousedrop z-1"><Link href="#mains" className="mousewheel"><BsMouse className=""/></Link></div>
          </div>

          <section className="py-4 pb-0">
            <div className="container">
               <BrandImage/>
            </div>
        </section>

        <section className="pb-0" id="mains">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                        <div className="secHeading-wrap text-center">
                            <h3 className="sectionHeading">Popular Contractor <span className="text-primary">Categories</span></h3>
                            <p>Browse trusted contractors by category</p>
                        </div>
                    </div>
                </div>
              <CategoryOne/>
            </div>
        </section>

        <section>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                        <div className="secHeading-wrap text-center">
                            <h3 className="sectionHeading">Featured <span className="text-primary">Contractors</span></h3>
                            <p>Top-rated contractors in your area</p>
                        </div>
                    </div>
                </div>
                <PopularListingOne/>
            </div>
        </section>
        <section className="bg-light">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                        <div className="secHeading-wrap text-center">
                            <h3 className="sectionHeading">Our Great <span className="text-primary">Reviews</span></h3>
                            <p>Our cliens love our services and give great & positive reviews</p>
                        </div>
                    </div>
                </div>
               <ClientOne/>
            </div>
        </section>
        <section>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                        <div className="secHeading-wrap text-center">
                            <h3 className="sectionHeading">Latest <span className="text-primary">Updates</span></h3>
                            <p>Stay updated with the latest news and tips</p>
                        </div>
                    </div>
                </div>
                <BlogOne/>
            </div>
        </section>
        <FooterTop/>
        <Footer/>
        <BackToTop/>
    </>
  );
}
