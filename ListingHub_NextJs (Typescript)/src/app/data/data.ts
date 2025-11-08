import { BsTools, BsDroplet, BsLightning, BsWind, BsHouseDoor, BsPaintBucket, BsSquare, BsTree, BsHammer, BsBox, BsBarChart, BsCameraReels, BsCoin, BsCreditCard2Back, BsEnvelopeAt, BsFacebook, BsFileEarmarkTextFill, BsGraphUpArrow, BsInstagram, BsLamp, BsLinkedin, BsPatchCheck, BsPatchQuestion, BsPeopleFill, BsPersonCheck, BsPinMap, BsPinMapFill, BsPinterest, BsSuitHeart, BsTwitter, BsYelp } from "react-icons/bs";
import { FaStar, FaStarHalfStroke } from "react-icons/fa6";

export const categoryData = [
    {
        image:'/img/cats/catt-1.jpg',
        icon:BsTools,
        title:'General Contractors',
        list:'67 Lists'
    },
    {
        image:'/img/cats/catt-2.jpg',
        icon:BsDroplet,
        title:'Plumbing',
        list:'45 Lists'
    },
    {
        image:'/img/cats/catt-3.jpg',
        icon:BsLightning,
        title:'Electrical',
        list:'38 Lists'
    },
    {
        image:'/img/cats/catt-4.jpg',
        icon:BsWind,
        title:'HVAC',
        list:'52 Lists'
    },
    {
        image:'/img/cats/catt-5.jpg',
        icon:BsHouseDoor,
        title:'Roofing',
        list:'29 Lists'
    },
    {
        image:'/img/cats/catt-6.jpg',
        icon:BsPaintBucket,
        title:'Painting',
        list:'41 Lists'
    },
    {
        image:'/img/cats/catt-7.jpg',
        icon:BsSquare,
        title:'Flooring',
        list:'33 Lists'
    },
    {
        image:'/img/cats/catt-8.jpg',
        icon:BsTree,
        title:'Landscaping',
        list:'28 Lists'
    },
    {
        image:'/img/cats/catt-9.jpg',
        icon:BsHammer,
        title:'Carpentry',
        list:'22 Lists'
    },
    {
        image:'/img/cats/catt-10.jpg',
        icon:BsBox,
        title:'Concrete & Masonry',
        list:'19 Lists'
    },
]

export const listData = [
    {
        id:1,
        image:'/img/list-1.jpg',
        user:'/img/team-1.jpg',
        status:'open',
        featured:true,
        title:'Premier Plumbing Solutions',
        desc:'Licensed plumbers providing expert installation, repair, and maintenance services for residential and commercial properties.',
        call:'+1 (555) 123-4567',
        loction:'New York, NY',
        tag:'Plumbing',
        tagIcon:BsDroplet,
        tagIconStyle:'catIcon me-2 cats-1',
        review:'46 Reviews',
        rating:'good',
        ratingRate:'4.5',
        instantBooking:false
    },
    {
        id:2,
        image:'/img/list-2.jpg',
        user:'/img/team-2.jpg',
        status:'open',
        featured:false,
        title:'Elite Electrical Services',
        desc:'Professional electricians specializing in wiring, panel upgrades, and electrical repairs with 24/7 emergency service.',
        call:'+1 (555) 234-5678',
        loction:'Los Angeles, CA',
        tag:'Electrical',
        tagIcon:BsLightning,
        tagIconStyle:'catIcon me-2 cats-2',
        review:'35 Reviews',
        rating:'midium',
        ratingRate:'4.3',
        instantBooking:true
    },
    {
        id:3,
        image:'/img/list-3.jpg',
        user:'/img/team-3.jpg',
        status:'closed',
        featured:true,
        title:'Comfort Zone HVAC',
        desc:'Full-service heating and cooling specialists offering installation, repair, and maintenance for all HVAC systems.',
        call:'+1 (555) 345-6789',
        loction:'Chicago, IL',
        tag:'HVAC',
        tagIcon:BsWind,
        tagIconStyle:'catIcon me-2 cats-3',
        review:'12 Reviews',
        rating:'excellent',
        ratingRate:'4.8',
        instantBooking:false
    },
    {
        id:4,
        image:'/img/list-4.jpg',
        user:'/img/team-4.jpg',
        status:'open',
        featured:false,
        title:'Peak Roofing Professionals',
        desc:'Experienced roofing contractors providing roof installation, repair, and replacement services with quality materials.',
        call:'+1 (555) 456-7890',
        loction:'Houston, TX',
        tag:'Roofing',
        tagIcon:BsHouseDoor,
        tagIconStyle:'catIcon me-2 cats-4',
        review:'72 Reviews',
        rating:'good',
        ratingRate:'4.6',
        instantBooking:true
    },
    {
        id:5,
        image:'/img/list-5.jpg',
        user:'/img/team-5.jpg',
        status:'close',
        featured:true,
        title:'Master Builders General Contracting',
        desc:'Complete construction and renovation services for residential and commercial projects with full project management.',
        call:'+1 (555) 567-8901',
        loction:'Phoenix, AZ',
        tag:'General Contractors',
        tagIcon:BsTools,
        tagIconStyle:'catIcon me-2 cats-5',
        review:'112 Reviews',
        rating:'midium',
        ratingRate:'4.2',
        instantBooking:false
    },
    {
        id:6,
        image:'/img/list-6.jpg',
        user:'/img/team-6.jpg',
        status:'open',
        featured:false,
        title:'Perfect Paint Pros',
        desc:'Professional interior and exterior painting services with premium paints and expert color consultation.',
        call:'+1 (555) 678-9012',
        loction:'Philadelphia, PA',
        tag:'Painting',
        tagIcon:BsPaintBucket,
        tagIconStyle:'catIcon me-2 cats-6',
        review:'52 Reviews',
        rating:'excellent',
        ratingRate:'4.8',
        instantBooking:true
    },
    {
        id:7,
        image:'/img/list-7.jpg',
        user:'/img/team-7.jpg',
        status:'open',
        featured:true,
        title:'Flooring Masters',
        desc:'Expert installation of hardwood, tile, carpet, and laminate flooring with free estimates and warranty coverage.',
        call:'+1 (555) 789-0123',
        loction:'San Antonio, TX',
        tag:'Flooring',
        tagIcon:BsSquare,
        tagIconStyle:'catIcon me-2 cats-1',
        review:'46 Reviews',
        rating:'good',
        ratingRate:'4.5',
        instantBooking:false
    },
    {
        id:8,
        image:'/img/list-8.jpg',
        user:'/img/team-8.jpg',
        status:'close',
        featured:true,
        title:'Green Thumb Landscaping',
        desc:'Complete landscaping services including lawn care, garden design, irrigation, and outdoor hardscaping.',
        call:'+1 (555) 890-1234',
        loction:'San Diego, CA',
        tag:'Landscaping',
        tagIcon:BsTree,
        tagIconStyle:'catIcon me-2 cats-1',
        review:'42 Reviews',
        rating:'excellent',
        ratingRate:'4.9',
        instantBooking:true
    },
    {
        id:9,
        image:'/img/list-9.jpg',
        user:'/img/team-9.jpg',
        status:'open',
        featured:true,
        title:'Precision Carpentry Works',
        desc:'Custom woodworking, cabinet installation, framing, and finish carpentry services for homes and businesses.',
        call:'+1 (555) 901-2345',
        loction:'Dallas, TX',
        tag:'Carpentry',
        tagIcon:BsHammer,
        tagIconStyle:'catIcon me-2 cats-8',
        review:'76 Reviews',
        rating:'good',
        ratingRate:'4.7',
        instantBooking:false
    },
]

export const reviewData = [
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"Found the Perfect Contractor!"',
        desc:`Absolutely love this platform! Whenever I need a contractor, this is my #1 go-to. Found an amazing plumber who fixed my issue same day. Wouldn't look anywhere else!`,
        image:'/img/team-1.jpg',
        name:'Sarah Johnson',
        position:'Homeowner'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"Excellent Contractor Directory"',
        desc:`Overall, this is a powerful tool for finding reliable contractors. The platform is user-friendly, has extensive listings, and all contractors are verified. Highly recommend!`,
        image:'/img/team-2.jpg',
        name:'Michael Chen',
        position:'Property Manager'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"Best Way to Find Contractors"',
        desc:`I love this platform. It's more reliable than other directories. Once I posted my project, I received multiple quality bids from licensed contractors. Excellent service!`,
        image:'/img/team-3.jpg',
        name:'David Martinez',
        position:'Business Owner'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"Trusted Contractor Network"',
        desc:`This is the best contractor directory out there. All contractors are verified and licensed. Found a great electrician who completed my project on time and within budget.`,
        image:'/img/team-4.jpg',
        name:'Emily Thompson',
        position:'Homeowner'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"Reliable & Professional"',
        desc:`The contractors on this platform are top-notch. Found an excellent HVAC specialist who solved my heating issues quickly. The review system helps make informed decisions.`,
        image:'/img/team-5.jpg',
        name:'Robert Williams',
        position:'Real Estate Developer'
    },
    {
        rate:[FaStar,FaStar,FaStar,FaStar,FaStar],
        title:'"Great Experience Every Time"',
        desc:`Used this platform for multiple projects - roofing, plumbing, and electrical. Every contractor has been professional, punctual, and reasonably priced. Highly satisfied!`,
        image:'/img/team-6.jpg',
        name:'Jennifer Davis',
        position:'Homeowner'
    },
]

export const blogData = [
    {
        id:1,
        image:'/img/blog-2.jpg',
        title:'How to Choose the Right Contractor for Your Home Renovation',
        desc:"Learn essential tips for selecting qualified contractors, checking credentials, and getting accurate estimates for your next home improvement project.",
        date:'13th Sept 2025',
        views:'12k Views'
    },
    {
        id:2,
        image:'/img/blog-3.jpg',
        title:'Top 5 Questions to Ask Before Hiring a Contractor',
        desc:"Discover the most important questions every homeowner should ask contractors to ensure quality work and avoid costly mistakes.",
        date:'29th Nov 2025',
        views:'33k Views'
    },
    {
        id:3,
        image:'/img/blog-4.jpg',
        title:'Understanding Contractor Licensing and Insurance Requirements',
        desc:"A comprehensive guide to contractor licensing, bonding, and insurance - what you need to know to protect your investment.",
        date:'13th March 2025',
        views:'15k Views'
    },
    {
        id:4,
        image:'/img/blog-5.jpg',
        title:'10 Essential Tips for Managing Your Contractor Project',
        desc:"Expert advice on managing construction projects, setting expectations, and maintaining clear communication with your contractor.",
        date:'5th May 2025',
        views:'12k Views'
    },
    {
        id:5,
        image:'/img/blog-6.jpg',
        title:'Seasonal Maintenance: When to Schedule Contractor Services',
        desc:"Learn the best times of year to schedule different types of contractor work for optimal results and better pricing.",
        date:'19th June 2025',
        views:'33k Views'
    },
    {
        id:6,
        image:'/img/blog-1.jpg',
        title:'Home Improvement Trends: What Contractors Are Seeing in 2025',
        desc:"Stay updated on the latest trends in home improvement, popular renovation projects, and contractor insights for this year.",
        date:'20th June 2025',
        views:'15k Views'
    },
]

export const footerLink1  = ['About ListingHub','Submit Listing','ListingHub Report','Careers']

export const footerLink2  = ['Trust & Safety','Investor Relations','Terms of Services','Paid Advertising','ListingHub Blog']

export const footerLink3  = ['Trust & Safety','Investor Relations','Terms of Services','Paid Advertising','ListingHub Blog']

export const cityData = [
    {
        image:'/img/city/location-1.jpg',
        gridClass:'col-xl-6 col-lg-6 col-md-4 col-sm-6',
        listing:'16 Listing',
        name:'Jersey City',
        tag:['San Diego','New York','Dallas','Denver']
    },
    {
        image:'/img/city/location-2.jpg',
        gridClass:'col-xl-3 col-lg-3 col-md-4 col-sm-6',
        listing:'24 Listing',
        name:'San Diego',
        tag:['San Diego','New York','Dallas','Denver']
    },
    {
        image:'/img/city/location-3.jpg',
        gridClass:'col-xl-3 col-lg-3 col-md-4 col-sm-6',
        listing:'30 Listing',
        name:'New Orleans',
        tag:['San Diego','New York','Dallas','Denver']
    },
    {
        image:'/img/city/location-4.jpg',
        gridClass:'col-xl-3 col-lg-3 col-md-4 col-sm-6',
        listing:'10 Listing',
        name:'San Antonio',
        tag:['San Diego','New York','Dallas','Denver']
    },
    {
        image:'/img/city/location-5.jpg',
        gridClass:'col-xl-3 col-lg-3 col-md-4 col-sm-6',
        listing:'22 Listing',
        name:'Los Angeles',
        tag:['San Diego','New York','Dallas','Denver']
    },
    {
        image:'/img/city/location-6.jpg',
        gridClass:'col-xl-6 col-lg-6 col-md-4 col-sm-6',
        listing:'12 Listing',
        name:'San Francisco',
        tag:['San Diego','New York','Dallas','Denver']
    },
]

export const eventData = [
    {
        image:'/img/eve-1.jpg',
        date:'13',
        month:'March',
        tag:'Workshop',
        tagIcon:BsTools,
        iconStyle:'badge badge-xs badge-danger',
        title:'Contractor Licensing Workshop',
        time:'10:30 AM To 2:40 PM'
    },
    {
        image:'/img/eve-2.jpg',
        date:'5',
        month:'May',
        tag:'Seminar',
        tagIcon:BsLightning,
        iconStyle:'badge badge-xs badge-success',
        title:'Electrical Safety Certification',
        time:'6:00 PM To 8:30 PM'
    },
    {
        image:'/img/eve-3.jpg',
        date:'19',
        month:'June',
        tag:'Training',
        tagIcon:BsHammer,
        iconStyle:'badge badge-xs badge-warning',
        title:'Advanced Carpentry Techniques',
        time:'8:30 AM To 12:20 PM'
    },
]

export const workData = [
    {
        icon:BsPinMap,
        title:'Find Qualified Contractors',
        desc:'Search our directory of verified, licensed contractors in your area. Filter by category, location, ratings, and availability to find the perfect match for your project.'
    },
    {
        icon:BsEnvelopeAt,
        title:'Contact & Get Quotes',
        desc:'Reach out to contractors directly through our platform. Get multiple quotes, compare prices, and communicate with contractors to discuss your project needs.'
    },
    {
        icon:BsPatchCheck,
        title:'Book & Schedule Services',
        desc:'Schedule your contractor service with confidence. Our platform handles booking, payments, and ensures all contractors are licensed and insured.'
    },
]
export const reviewData2 = [
    {
        image:'/img/google.png',
        rate:'4.8',
        star:[FaStar,FaStar,FaStar,FaStar,FaStarHalfStroke],
        reviews:'422k Reviews'
    },
    {
        image:'/img/trustpilot.png',
        rate:'4.8',
        star:[FaStar,FaStar,FaStar,FaStar,FaStarHalfStroke],
        reviews:'422k Reviews'
    },
    {
        image:'/img/capterra.png',
        rate:'4.8',
        star:[FaStar,FaStar,FaStar,FaStar,FaStarHalfStroke],
        reviews:'422k Reviews'
    },
]

export const adminCounter = [
    {
        icon:BsPinMapFill,
        iconStyle:'text-success',
        number:23,
        symbol:'',
        title:'Active Listings',
        bg:'bg-light-success'
    },
    {
        icon:BsGraphUpArrow,
        iconStyle:'text-danger',
        number:32,
        symbol:'K',
        title:'Total Views',
        bg:'bg-light-danger'
    },
    {
        icon:BsSuitHeart,
        iconStyle:'text-warning',
        number:4,
        symbol:'K',
        title:'Total Saved',
        bg:'bg-light-warning'
    },
    {
        icon:BsYelp,
        iconStyle:'text-info',
        number:88,
        symbol:'',
        title:'Total Reviews',
        bg:'bg-light-info'
    },
]

export const chatData = [
    {
        image:'/img/team-8.jpg',
        name:'Warlinton Diggs',
        time:'08:20 AM',
        msg:'How are you stay dude?',
        pandding:false,
        message:0
    },
    {
        image:'/img/team-7.jpg',
        name:'Chad M. Pusey',
        time:'06:40 AM',
        msg:'Hey man it is possible to pay mo..',
        pandding:true,
        message:5
    },
    {
        image:'/img/team-6.jpg',
        name:'Mary D. Homer',
        time:'08:10 AM',
        msg:'Dear you have a spacial offers...',
        pandding:true,
        message:3
    },
    {
        image:'/img/team-5.jpg',
        name:'Marc S. Solano',
        time:'10:10 AM',
        msg:'Sound good! We will meet you aft...',
        pandding:false,
        message:0
    },
    {
        image:'/img/team-4.jpg',
        name:'Sandra W. Barge',
        time:'07:20 PM',
        msg:'I am also good and how are...',
        pandding:true,
        message:2
    },
]

export const invoiceData = [
    {
       name:'Basic Platinum Plan',
       id:'#PC01362' ,
       status:'Paid',
       date:'Sept 13,2025'
    },
    {
       name:'Standard Platinum Plan',
       id:'#PC01363' ,
       status:'Unpaid',
       date:'March 13,2025'
    },
    {
       name:'Extended Platinum Plan',
       id:'#PC01364' ,
       status:'On Hold',
       date:'June 19,2025'
    },
    {
       name:'Basic Platinum Plan',
       id:'#PC01365' ,
       status:'Paid',
       date:'June 20,2025'
    },
]

export const bookingData = [
    {
        image:'/img/team-1.jpg',
        title:'Premier Plumbing Solutions',
        tag:'Plumbing',
        pending:true,
        unpaid:true,
        approved:false,
        cancelled:false,
        reject:true,
        approve:true,
        sendMsg:true,
        date:'13.03.2025 at 1:00 PM',
        info:'Kitchen Sink Repair',
        name:'John Smith',
        contact:'+1 (555) 123-4567',
        price:'$250.00'
    },
    {
        image:'/img/team-2.jpg',
        title:'Elite Electrical Services',
        tag:'Electrical',
        pending:false,
        unpaid:false,
        approved:true,
        cancelled:false,
        reject:false,
        approve:false,
        sendMsg:true,
        date:'14.06.2025 at 11:30 AM',
        info:'Panel Upgrade Project',
        name:'Sarah Johnson',
        contact:'+1 (555) 234-5678',
        price:'$1,750.00'
    },
    {
        image:'/img/team-3.jpg',
        title:'Comfort Zone HVAC',
        tag:'HVAC',
        pending:false,
        unpaid:false,
        approved:false,
        cancelled:true,
        reject:false,
        approve:false,
        sendMsg:false,
        date:'12.05.2025 at 4:30 PM',
        info:'AC Installation',
        name:'Michael Chen',
        contact:'+1 (555) 345-6789',
        price:'$3,245.00'
    },
    {
        image:'/img/team-4.jpg',
        title:'Peak Roofing Professionals',
        tag:'Roofing',
        pending:false,
        unpaid:true,
        approved:true,
        cancelled:false,
        reject:false,
        approve:true,
        sendMsg:true,
        date:'14.10.2025 at 8:30 AM',
        info:'Roof Inspection & Repair',
        name:'Emily Davis',
        contact:'+1 (555) 456-7890',
        price:'$850.00'
    },
]
export const adminListing = [
    {
        image:'/img/list-1.jpg',
        title:'Premier Plumbing Solutions',
        location:'410 Main Street, New York, NY',
        review:'46 Reviews',
        expired:false
    },
    {
        image:'/img/list-2.jpg',
        title:'Elite Electrical Services',
        location:'520 Oak Avenue, Los Angeles, CA',
        review:'35 Reviews',
        expired:true
    },
    {
        image:'/img/list-3.jpg',
        title:'Comfort Zone HVAC',
        location:'102 Commerce Blvd, Chicago, IL',
        review:'52 Reviews',
        expired:false
    },
    {
        image:'/img/list-4.jpg',
        title:'Master Builders General Contracting',
        location:'789 Industrial Way, Phoenix, AZ',
        review:'112 Reviews',
        expired:false
    },
]

export const message = [
    {
        id:1,
        image:'/img/team-1.jpg',
        name:'Karan Shivraj',
        time:'Today'
    },
    {
        id:2,
        image:'/img/team-2.jpg',
        name:'Shree Preet',
        time:'just Now'
    },
    {
        id:3,
        image:'/img/team-3.jpg',
        name:'Shikhar Musk',
        time:'30 min ago'
    },
    {
        id:4,
        image:'/img/team-4.jpg',
        name:'Mortin Mukkar',
        time:'Yesterday'
    },
    {
        id:5,
        image:'/img/team-5.jpg',
        name:'Melly Arjun',
        time:'Today'
    },
    {
        id:6,
        image:'/img/team-6.jpg',
        name:'Mortin Mukkar',
        time:'Yesterday'
    },
]

export const adminReview =[
    {
        image:'/img/team-1.jpg',
        name:'Karan Shivraj',
        date:'13th March 2025',
        desc:'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    },
    {
        image:'/img/team-2.jpg',
        name:'Shree Preet',
        date:'5th May 2025',
        desc:'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    },
    {
        image:'/img/team-3.jpg',
        name:'Shikhar Musk',
        date:'19th June 2025',
        desc:'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    },
    {
        image:'/img/team-4.jpg',
        name:'Mortin Mukkar',
        date:'20th June 2025',
        desc:'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    },
]

export const earning = [
    {
        name:'Swarna Apartment',
        id:'#PC01362',
        date:'Dec 10,2025',
        value:'$200 USD',
        free:'$17.10 USD'
    },
    {
        name:'Blue Cafe',
        id:'#PC01363',
        date:'Jan 12,2025',
        value:'$150 USD',
        free:'$12.30 USD'
    },
    {
        name:'Kanoop Barbar Shop',
        id:'#PC01364',
        date:'Sep 22,2023',
        value:'$75.50 USD',
        free:'$10.20 USD'
    },
    {
        name:'Classic Casino',
        id:'#PC01365',
        date:'Dec 16,2024',
        value:'$652 USD',
        free:'$80.90 USD'
    },
]

export const counterData = [
    {
        number:145,
        symbol:'K',
        title:'Daily New Visitors'
    },
    {
        number:670,
        symbol:'',
        title:'Active Listings'
    },
    {
        number:22,
        symbol:'',
        title:'Won Awards'
    },
    {
        number:642,
        symbol:'K',
        title:'Happy Customers'
    },
]

export const teamData = [
    {
        image:'/img/team-1.jpg',
        name:'Julia F. Mitchell',
        position:'Chief Executive'
    },
    {
        image:'/img/team-2.jpg',
        name:'Maria P. Thomas',
        position:'Co-Founder'
    },
    {
        image:'/img/team-3.jpg',
        name:'Willa R. Fontaine',
        position:'Field Manager'
    },
    {
        image:'/img/team-4.jpg',
        name:'Rosa R. Anderson',
        position:'Business Executive'
    },
    {
        image:'/img/team-5.jpg',
        name:'Jacqueline J. Miller',
        position:'Account Manager'
    },
    {
        image:'/img/team-6.jpg',
        name:'Oralia R. Castillo',
        position:'Writing Manager'
    },
    {
        image:'/img/team-7.jpg',
        name:'Lynda W. Ruble',
        position:'Team Manager'
    },
]
export const mostViewBlog = [
    {
        image:'/img/blog-2.jpg',
        title:'How to Choose the Right Contractor for Your Home Renovation',
        date:'13th Sept 2025'
    },
    {
        image:'/img/blog-3.jpg',
        title:'Top 5 Questions to Ask Before Hiring a Contractor',
        date:'29th Nov 2025'
    },
    {
        image:'/img/blog-4.jpg',
        title:'Understanding Contractor Licensing and Insurance Requirements',
        date:'13th March 2025'
    },
    {
        image:'/img/blog-5.jpg',
        title:'10 Essential Tips for Managing Your Contractor Project',
        date:'5th May 2025'
    },
    {
        image:'/img/blog-6.jpg',
        title:'Seasonal Maintenance: When to Schedule Contractor Services',
        date:'19th June 2025'
    },
]

export const blogTag = ['Contractors','Home Improvement','Renovation','Plumbing','Electrical','HVAC']

export const blogSocial = [
    BsFacebook,BsTwitter,BsInstagram,BsPinterest,BsLinkedin
]

export const helpData = [
    {
        icon:BsPeopleFill,
        title:'Contractor Community',
        desc:`Connect with other contractors, share tips, and network within our professional contractor community.`,
        tag:['Network','Discussion','Support']
    },
   
    {
        icon:BsFileEarmarkTextFill,
        title:'Project Management',
        desc:`Manage your contractor bookings, track project progress, and maintain records all in one place.`,
        tag:['Bookings','Tracking','Management']
    },
    {
        icon:BsCoin,
        title:'Refund Policy',
        desc:`Learn about our refund policies for platform fees and how to handle contractor service refunds.`,
        tag:['Policy','Process','Claims']
    },
    {
        icon:BsPersonCheck,
        title:'Account Issues',
        desc:`Get help with your account settings, profile management, password resets, and verification issues.`,
        tag:['Profile','Settings','Password']
    },
    {
        icon:BsBarChart,
        title:'Contractor Business Tools',
        desc:`Access business analytics, manage your listings, view reports, and grow your contractor business.`,
        tag:['Dashboard','Analytics','Reports']
    },
    {
        icon:BsCreditCard2Back,
        title:'Payment & Billing',
        desc:`Learn about payment methods, billing cycles, subscription plans, and secure payment processing.`,
        tag:['Payments','Billing','Security']
    },
    {
        icon:BsCameraReels,
        title:'Guides & Resources',
        desc:`Access tutorials, best practices, contractor guides, and helpful articles for your projects.`,
        tag:['Tutorials','Guides','Resources']
    },
    {
        icon:BsPatchQuestion,
        title:`FAQ's`,
        desc:`Find answers to frequently asked questions about finding contractors, booking services, and using our platform.`,
        tag:['Help','Questions','Support']
    },
]

export const articles = [
    {
        title:'What are Bookmarks?',
        desc:`Bookmarks allow you to save your favorite contractors for quick access later. If you find a contractor you're interested in but not ready to contact yet, you can bookmark their profile...`
    },
    {
        title:'How Do I Add Or Change My Billing Details?',
        desc:`You can update your billing information in the Account Settings section. Go to Payment Methods to add, update, or remove credit cards. All payment information is securely stored and encrypted...`
    },
    {
        title:'How do I change my username?',
        desc:`You can change your username in your profile settings. Navigate to My Profile in the dashboard, click Edit Profile, and update your display name. Username changes may take a few minutes to reflect...`
    },
    {
        title:'How do I change my email address?',
        desc:`To change your email address, go to Account Settings and select Email. You'll need to verify your new email address before the change is complete. We'll send a verification email to confirm...`
    },
    {
        title:`I'm not receiving the verification email`,
        desc:`If you're not receiving verification emails, check your spam folder first. Make sure you've entered the correct email address. You can request a new verification email from your account settings...`
    },
    {
        title:'How do I change my password?',
        desc:`You can change your password in Account Settings > Security. Click Change Password and follow the prompts. Make sure your new password is strong and contains at least 8 characters with a mix of letters, numbers, and symbols...`
    },
]

export const faqData1 = [
    {
        id:'collapseOne',
        title:'How do I find a contractor in my area?',
        desc:`Use our search filters to find contractors by location, category, and ratings. Simply enter your location or use the map feature to browse contractors near you. All contractors listed on our platform are verified for licensing and insurance.`
    },
    {
        id:'collapseTwo',
        title:'Are all contractors licensed and insured?',
        desc:`Yes, we verify that all contractors on our platform have current licenses and insurance. You can view each contractor's credentials on their profile page. We recommend confirming these details before booking any service.`
    },
    {
        id:'collapseThree',
        title:'How do I get quotes from contractors?',
        desc:`You can contact contractors directly through our messaging system or request a quote by filling out a project description. Contractors will respond with detailed estimates. We recommend getting at least 3 quotes to compare prices and services.`
    },
    {
        id:'collapseFour',
        title:'Can I customize my project requirements?',
        desc:`Absolutely! When contacting contractors, you can provide detailed project requirements, preferred timeline, budget range, and any specific needs. Contractors will tailor their quotes and services to meet your exact specifications.`
    },
    {
        id:'collapseFive',
        title:'What additional services does the platform provide?',
        desc:`Beyond connecting you with contractors, we offer project management tools, secure payment processing, review and rating systems, dispute resolution, and 24/7 customer support to ensure a smooth experience.`
    },
]
export const faqData2 = [
    {
        id:'collapseOne2',
        title:'What is your refund policy?',
        desc:`Refund policies vary by contractor and project type. For platform fees, we offer a 7-day money-back guarantee if you're not satisfied with our service. For contractor work, refunds are handled directly with the contractor based on your signed contract. We recommend reviewing all terms before booking.`
    },
    {
        id:'collapseTwo2',
        title:'What payment methods do you accept?',
        desc:`We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. Payments are processed securely through Stripe. Some contractors may also accept direct payments, but we recommend using our platform for payment protection.`
    },
    {
        id:'collapseThree2',
        title:'Do you accept American Express?',
        desc:`Yes, we accept American Express along with all other major credit cards. Our secure payment processing supports Visa, Mastercard, American Express, and Discover cards. All transactions are encrypted and secure.`
    },
    {
        id:'collapseFour2',
        title:'Are there monthly subscription fees for contractors?',
        desc:`Contractors can choose from flexible subscription plans to list on our platform. Plans range from basic listings to premium featured placements. Contact us for detailed pricing information. There are no monthly fees for customers using the platform to find contractors.`
    },
    {
        id:'collapseFive2',
        title:'What additional services are available?',
        desc:`We offer premium services including priority contractor matching, project management assistance, extended warranty options, and dedicated customer support. Contractors can also access marketing tools, analytics, and premium listing features.`
    },
]
export const faqData3 = [
    {
        id:'collapseOne3',
        title:'Can I chat with contractors online?',
        desc:`Yes! Our platform includes a built-in messaging system that allows you to communicate directly with contractors. You can ask questions, share project details, discuss pricing, and schedule appointments all within our secure messaging platform.`
    },
    {
        id:'collapseTwo3',
        title:'Can I contact contractors by phone?',
        desc:`Absolutely. Each contractor profile displays their contact information including phone number. You can call contractors directly, or use our messaging system first to introduce yourself. Many contractors also offer online booking through our platform.`
    },
    {
        id:'collapseThree3',
        title:'Do you verify contractor credentials?',
        desc:`Yes, we have a rigorous verification process. All contractors must provide proof of licensing, insurance, and business registration. We regularly audit contractor credentials and customer reviews to ensure quality standards. Verified contractors are marked with a badge on their profile.`
    },
]