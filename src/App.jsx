
import { useEffect, useRef, useState } from "react";
import siteLogo from "./assets/logo.png";
import heroSectionImage from "./assets/hero-section.png";
import whoImageOne from "./assets/who1.jpg";
import whoImageTwo from "./assets/who2.jpg";
import whoImageThree from "./assets/who3.jpg";
import catImageOne from "./assets/cat1.jpg";
import catImageTwo from "./assets/cat2.jpg";
import catImageThree from "./assets/cat3.jpg";
import catImageFour from "./assets/cat4.jpg";
import catImageFive from "./assets/cat5.jpg";
import {
  FaArrowUp,
  FaBoxOpen,
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaShoppingCart,
  FaSlidersH,
  FaBolt,
  FaCheck,
  FaChartBar,
  FaCompass,
  FaEnvelope,
  FaFacebookF,
  FaHeadset,
  FaInstagram,
  FaLayerGroup,
  FaLinkedinIn,
  FaClock,
  FaLock,
  FaMapMarkerAlt,
  FaMinus,
  FaPhoneAlt,
  FaPlus,
  FaRocket,
  FaRupeeSign,
  FaShieldAlt,
  FaStar,
  FaStore,
  FaStoreAlt,
  FaTruck,
  FaTwitter,
  FaUserAlt,
  FaUserCircle,
  FaUserShield,
  FaYoutube,
  FaCreditCard,
  FaEdit,
} from "react-icons/fa";

const marqueeItems = [
  { icon: FaStore, text: "Verified Indian Sellers" },
  { icon: FaShieldAlt, text: "Trusted Marketplace Protection" },
  { icon: FaTruck, text: "Pan-India Shipping Support" },
  { icon: FaRupeeSign, text: "UPI, Card, COD Friendly" },
  { icon: FaStar, text: "Trusted by Buyers Across Categories" },
  { icon: FaLayerGroup, text: "Structured Product Categories" },
  { icon: FaHeadset, text: "Seller & Buyer Support" },
  { icon: FaBolt, text: "Fast Store Setup" },
];

const pillars = [
  { icon: "🏛️", title: "Structured Marketplace", text: "Clear categories and subcategories keep products organized and easy to discover." },
  { icon: "🏪", title: "Seller-Focused", text: "Every approved vendor gets a dedicated storefront and a smoother selling workflow." },
  { icon: "🛡️", title: "Trust First", text: "Verified sellers, secure checkout, and platform-backed buyer confidence at every step." },
  { icon: "📊", title: "Growth Ready", text: "Better visibility, product management, and insights help vendors scale with clarity." },
];

const strengths = [
  { icon: FaLayerGroup, title: "Clean Category Management", text: "Products stay easy to browse because the marketplace follows a structured category system instead of random listings." },
  { icon: FaStoreAlt, title: "Dedicated Storefronts", text: "Vendors can present their products under their own store identity while staying part of one trusted marketplace." },
  { icon: FaUserShield, title: "Verified Selling Environment", text: "Seller approval and product oversight help maintain consistency, quality, and buyer confidence." },
  { icon: FaRupeeSign, title: "Buyer-Friendly Payments", text: "Support for common Indian payment habits makes checkout simple and familiar for customers." },
  { icon: FaChartBar, title: "Better Product Visibility", text: "Featured categories, organized listings, and marketplace discovery help the right products reach the right buyers." },
  { icon: FaHeadset, title: "Reliable Platform Support", text: "From onboarding questions to order-related help, the platform stays useful for both vendors and buyers." },
];

const categories = [
  ["👗", "Fashion & Apparel", "2,400+ products"],
  ["🏺", "Handicrafts", "1,800+ products"],
  ["🍱", "Organic Food", "950+ products"],
  ["💻", "Electronics", "1,200+ products"],
  ["🪴", "Home & Garden", "1,600+ products"],
  ["💄", "Beauty & Wellness", "800+ products"],
  ["📚", "Books & Stationery", "600+ products"],
  ["🎨", "Art & Decor", "1,100+ products"],
  ["🧸", "Kids & Toys", "740+ products"],
  ["⚽", "Sports & Fitness", "500+ products"],
  ["🐾", "Pet Supplies", "320+ products"],
  ["🛠️", "Tools & Hardware", "410+ products"],
];

const blogs = [
  {
    tag: "Seller Guide",
    title: "How to Create Product Listings That Build Buyer Trust",
    text: "Strong photos, clear pricing, and accurate descriptions help your products look reliable from the first click.",
    author: "Arjun Mehta",
    date: "March 12, 2025",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&auto=format&fit=crop&q=80",
    avatar: "https://i.pravatar.cc/80?img=3",
  },
  {
    tag: "Marketplace Growth",
    title: "What Helps New Vendors Start Getting Orders Faster",
    text: "Category fit, stock readiness, and complete store details are often the first things that improve conversion.",
    author: "Priya Sharma",
    date: "Feb 28, 2025",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=700&auto=format&fit=crop&q=80",
    avatar: "https://i.pravatar.cc/80?img=9",
  },
  {
    tag: "Platform Update",
    title: "Why Category Quality Matters in a Multi-Vendor Marketplace",
    text: "A structured catalog makes browsing easier for buyers and helps sellers place products in the right space from day one.",
    author: "Vikram Nair",
    date: "Jan 15, 2025",
    image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=700&auto=format&fit=crop&q=80",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
];

const faqs = [
  {
    q: "Who can sell on this marketplace?",
    a: "Artisans, independent sellers, local businesses, and growing brands can apply to join. The goal is to onboard genuine vendors whose products fit the platform categories and quality expectations.",
  },
  {
    q: "How are products organized on the website?",
    a: "Products are grouped into structured categories and subcategories so buyers can browse easily and sellers can list under the right section without confusion.",
  },
  {
    q: "Do vendors need technical skills to start selling?",
    a: "No. The platform is designed so vendors can register, set up their store details, and add products without needing coding knowledge or a separate website.",
  },
  {
    q: "What makes this website useful for buyers?",
    a: "Buyers get organized product discovery, verified sellers, clear store information, and a smoother path from browsing to checkout.",
  },
  {
    q: "Why is seller verification important here?",
    a: "Verification helps maintain trust on the platform, improves listing quality, and gives buyers more confidence when placing orders.",
  },
  {
    q: "Can the marketplace support multiple product categories?",
    a: "Yes. The homepage and marketplace structure are built to support many categories while still keeping the browsing experience clean and relevant.",
  },
];

const counterTargets = [
  { value: 12, suffix: "K+ Vendors Onboarded" },
  { value: 4.8, suffix: "★ Avg. Buyer Rating" },
  { value: 50, suffix: "+ Categories" },
];

const audienceCards = [
  {
    tag: "For Sellers",
    tagClass: "seller",
    title: "Set Up Your Store and Start Listing with Confidence",
    text: "The seller side of the platform is built to make onboarding, product listing, and store presentation easier from the start.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop&q=80",
    items: [
      "Custom branded storefront URL",
      "Easy product management dashboard",
      "Secure payouts & order tracking",
      "Admin-supported onboarding",
      "Analytics & growth insights",
    ],
  },
  {
    tag: "For Buyers",
    tagClass: "buyer",
    title: "Browse Relevant Products from Trusted Sellers",
    text: "Buyers can discover products through organized categories, better store visibility, and a marketplace experience that feels reliable.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    items: [
      "Verified, trusted sellers only",
      "Easy returns & buyer protection",
      "Pan-India delivery network",
      "Curated categories for easy discovery",
      "Multiple secure payment options",
    ],
  },
];
const visualItems = [
  [catImageOne, "Featured Beauty Range", true],
  [catImageTwo, "Jewellery Collection", false],
  [catImageThree, "Fashion Category Picks", false],
  [catImageFour, "Marketplace Shopping Flow", false],
  [catImageFive, "Trending Electronics", false],
];

const flowItems = [
  ["📝", "Register Your Details", "Submit your business, contact, and store information through the onboarding flow"],
  ["✅", "Profile Review", "The platform reviews seller details to keep the marketplace relevant and trusted"],
  ["🏪", "Store Setup", "Your seller profile and store presence are prepared for product publishing"],
  ["📦", "Add Products", "List items in the right category with details that help buyers understand what you offer"],
  ["💰", "Start Selling", "Once your store is live, buyers can discover products and place orders more easily"],
];

const footerLinks = [
  ["Marketplace", ["All Categories", "New Arrivals", "Featured Stores", "Top Vendors", "Deals & Offers"]],
  ["Vendors", ["Become a Seller", "Vendor Dashboard", "Seller Guidelines", "Commission Rates", "Vendor Support"]],
  ["Company", ["About Us", "Blog", "Careers", "Privacy Policy", "Terms of Service"]],
];

const primaryNavItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Vendor", "/vendor-shop"],
  ["Contact", "/contact"],
  ["Blog", "/blog"],
];

const registerHighlights = [
  { icon: FaShieldAlt, title: "Verified onboarding", text: "Every new user profile goes through a clean and secure signup flow." },
  { icon: FaStore, title: "Marketplace ready", text: "Register once and stay prepared for buyer journeys, wishlists, and future orders." },
  { icon: FaHeadset, title: "Fast support", text: "If a user gets stuck, the experience clearly points them toward help and next steps." },
];

const profileStats = [
  { icon: FaBoxOpen, value: "18", label: "Total orders", note: "Across fashion, decor, and wellness" },
  { icon: FaTruck, value: "3", label: "In transit", note: "Expected this week" },
  { icon: FaRupeeSign, value: "Rs. 42,580", label: "Lifetime spend", note: "Trusted purchases from verified sellers" },
];

const profileOrders = [
  {
    id: "EST-240318",
    item: "Handwoven Cotton Saree",
    vendor: "Priya Handloom Studio",
    date: "March 28, 2026",
    price: "Rs. 2,499",
    status: "Delivered",
    eta: "Delivered on March 30",
  },
  {
    id: "EST-240301",
    item: "Brass Decor Lamp",
    vendor: "Aarav Home Crafts",
    date: "March 26, 2026",
    price: "Rs. 1,899",
    status: "Shipped",
    eta: "Arriving by April 2",
  },
  {
    id: "EST-239884",
    item: "Ayurvedic Wellness Gift Box",
    vendor: "Sattva Naturals",
    date: "March 22, 2026",
    price: "Rs. 3,249",
    status: "Processing",
    eta: "Preparing for dispatch",
  },
  {
    id: "EST-239420",
    item: "Minimal Silver Jewellery Set",
    vendor: "Noor Artisan Co.",
    date: "March 14, 2026",
    price: "Rs. 1,560",
    status: "Cancelled",
    eta: "Refund initiated to original payment method",
  },
];

const profileQuickLinks = [
  ["Edit profile", "Update name, contact details, and account preferences."],
  ["Manage addresses", "Keep your home, office, and gifting addresses ready."],
  ["Payment methods", "Review saved methods and faster checkout settings."],
];

const profileAddresses = [
  {
    title: "Primary address",
    name: "Ananya Sharma",
    lines: ["24 Lake View Residency", "Powai, Mumbai 400076"],
    phone: "+91 98765 43210",
  },
  {
    title: "Work delivery point",
    name: "Ananya Sharma",
    lines: ["Unit 904, Sunrise Corporate Hub", "BKC, Mumbai 400051"],
    phone: "+91 98765 43210",
  },
];

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [counts, setCounts] = useState([0, 0, 0]);
  const cursorRef = useRef(null);
  const isAboutPage = typeof window !== "undefined" && window.location.pathname.startsWith("/about");
  const isContactPage = typeof window !== "undefined" && window.location.pathname.startsWith("/contact");
  const isBlogDetailPage = typeof window !== "undefined" && window.location.pathname.startsWith("/blog-details");
  const isBlogPage = typeof window !== "undefined" && window.location.pathname.startsWith("/blog");
  const isProductDetailPage = typeof window !== "undefined" && window.location.pathname.startsWith("/product-details");
  const isProductsPage = typeof window !== "undefined" && window.location.pathname.startsWith("/products");
  const isCartPage = typeof window !== "undefined" && window.location.pathname.startsWith("/cart");
  const isCheckoutPage = typeof window !== "undefined" && window.location.pathname.startsWith("/checkout");
  const isLoginPage = typeof window !== "undefined" && window.location.pathname.startsWith("/login");
  const isRegisterPage = typeof window !== "undefined" && window.location.pathname.startsWith("/register");
  const isProfilePage = typeof window !== "undefined" && window.location.pathname.startsWith("/profile");
  const isVendorShopPage = typeof window !== "undefined" && window.location.pathname.startsWith("/vendor-shop");
  const statsRef = useRef(null);
  const onboardingRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (event) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.left = `${event.clientX}px`;
      cursorRef.current.style.top = `${event.clientY}px`;
    };

    const onScroll = () => {
      setIsScrolled(window.scrollY > 30);
      setShowTop(window.scrollY > 400);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".anim:not(.go)"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("go");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        const start = performance.now();
        const duration = 1800;

        const tick = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 4;
          setCounts(counterTargets.map((item) => item.value * eased));
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            setCounts(counterTargets.map((item) => item.value));
          }
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const goStep = (nextStep) => {
    setStep(nextStep);
    onboardingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const createRipple = (event) => {
    const card = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = card.getBoundingClientRect();
    ripple.className = "cat-ripple";
    ripple.style.left = `${event.clientX - rect.left - 40}px`;
    ripple.style.top = `${event.clientY - rect.top - 40}px`;
    card.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 500);
  };

  if (isAboutPage) {
    return <AboutPage />;
  }

  if (isContactPage) {
    return <ContactPage />;
  }

  if (isBlogDetailPage) {
    return <BlogDetailPage />;
  }

  if (isBlogPage) {
    return <BlogPage />;
  }

  if (isProductDetailPage) {
    return <ProductDetailPage />;
  }

  if (isProductsPage) {
    return <ProductListingPage />;
  }

  if (isCartPage) {
    return <CartPage />;
  }

  if (isCheckoutPage) {
    return <CheckoutPage />;
  }

  if (isLoginPage) {
    return <LoginPage />;
  }

  if (isRegisterPage) {
    return <RegisterPage />;
  }

  if (isProfilePage) {
    return <ProfilePage />;
  }

  if (isVendorShopPage) {
    return <VendorShopPage />;
  }

  return (
    <div className="bg-light text-textc">
      <div ref={cursorRef} className="cursor-glow hidden md:block" />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`scroll-top ${showTop ? "show" : ""}`}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>

      <Header scrolled={isScrolled} showHomeCta />

      <section id="hero" className="section-shell relative flex min-h-screen items-center overflow-hidden bg-white pt-[110px]">
        <div className="hero-grad" />
        <div className="hero-dots" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-grid relative z-10 w-full">
          <div className="hero-text">
            <div className="badge-pill anim go">
              <span className="live-dot" />
              Marketplace-first content for sellers, buyers, and product discovery
            </div>
            <h1 className="anim go d1">
              Relevant Products
              <br />
              <em>For Real</em>
              <br />
              Marketplace Users
            </h1>
            <p className="anim go d2">
              eStoreindie is built to present marketplace products, seller storefronts, and buyer journeys with content that stays fully connected to the website.
              The homepage now focuses on categories, stores, product discovery, and trusted marketplace actions only.
            </p>
            <div className="anim go d3 flex flex-wrap gap-4">
              <a href="#onboarding" className="btn-primary"><FaStore />Start Selling</a>
              <a href="#categories" className="btn-outline"><FaCompass />Browse Categories</a>
            </div>
            <div ref={statsRef} className="anim go d4 mt-12 flex flex-wrap gap-9">
              {counterTargets.map((item, index) => (
                <div key={item.suffix} className="flex items-center gap-9">
                  <div className="flex flex-col">
                    <strong className="font-display text-[2.2rem] font-black leading-none text-primary">
                      {item.value % 1 === 0 ? counts[index].toFixed(0) : counts[index].toFixed(1)}
                    </strong>
                    <span className="mt-1 text-[0.8rem] text-muted">{item.suffix}</span>
                  </div>
                  {index < counterTargets.length - 1 ? <div className="hidden h-full w-px self-stretch bg-borderc sm:block" /> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual anim sc go d2 hidden lg:block">
            <div className="floaty overflow-hidden rounded-[28px] shadow-strong">
              <img
                src={heroSectionImage}
                alt="Indian Marketplace"
                className="h-[460px] w-full object-cover"
              />
            </div>
            <div className="hero-card hero-card-left">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-[1.2rem]">✅</div>
              <div>
                <strong>Seller Store Active</strong>
                <span>Priya's Handloom · Jaipur</span>
              </div>
            </div>
            <div className="hero-card hero-card-right">
              <div className="mb-2 flex">
                {["1", "5", "8"].map((id, idx) => (
                  <img
                    key={id}
                    src={`https://i.pravatar.cc/60?img=${id}`}
                    alt=""
                    className={`h-[30px] w-[30px] rounded-full border-2 border-white object-cover ${idx ? "-ml-2" : ""}`}
                  />
                ))}
              </div>
              <strong>Live Buyer Activity</strong>
              <span>shopping across categories</span>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee-band">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map(({ icon: Icon, text }, index) => (
            <div key={`${text}-${index}`} className="marquee-item">
              <Icon className="text-accent2" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <section id="about" className="section-shell bg-white">
        <div className="about-grid w-full">
          <div className="anim sl hidden grid-cols-2 grid-rows-[220px_220px] gap-4 lg:grid">
            <div className="about-img row-span-2">
              <img src={whoImageOne} alt="Team" />
            </div>
            <div className="about-img">
              <img src={whoImageTwo} alt="Craft" />
            </div>
            <div className="about-img">
              <img src={whoImageThree} alt="Market" />
            </div>
          </div>
          <div className="anim sr">
            <span className="section-label">Who We Are</span>
            <h2 className="section-title">Content Tailored to Your Marketplace<br />from Top to Bottom</h2>
            <p className="section-sub">
              eStoreindie is presented here as a focused multi-vendor marketplace where categories, seller stores, and buyer journeys stay clear and relevant.
              That keeps the homepage aligned with what your website actually offers instead of showing unrelated generic copy.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pillars.map((pillar, index) => (
                <div key={pillar.title} className={`pillar-card anim d${(index % 4) + 1}`}>
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-[10px] bg-[rgba(232,93,47,0.1)] text-[1.1rem]">
                    {pillar.icon}
                  </div>
                  <strong>{pillar.title}</strong>
                  <p>{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="audience" className="section-shell bg-light">
        <div className="w-full">
          <div className="anim text-center">
            <span className="section-label">Marketplace Users</span>
            <h2 className="section-title">Built for Sellers and Buyers</h2>
          </div>
          <div className="aud-grid mt-14">
            {audienceCards.map((card, index) => (
              <div key={card.tag} className={`aud-card anim ${index === 0 ? "sl" : "sr"} d1`}>
                <div className="relative h-[280px] overflow-hidden">
                  <img src={card.image} alt={card.tag} className="h-full w-full object-cover transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,60,110,0.45)] to-transparent" />
                  <span className={`aud-tag ${card.tagClass}`}>{card.tag}</span>
                </div>
                <div className="p-8">
                  <h3 className="mb-3 font-display text-[1.55rem] text-primary">{card.title}</h3>
                  <p className="mb-6 text-[0.93rem] text-muted">{card.text}</p>
                  <ul className="flex flex-col gap-[11px]">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-[11px] text-[0.9rem] text-textc">
                        <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-[0.65rem] text-white">
                          <FaCheck />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="strengths" className="section-shell relative overflow-hidden text-white">
        <div className="strength-blob strength-blob-1" />
        <div className="strength-blob strength-blob-2" />
        <div className="relative z-10 w-full">
          <div className="anim text-center">
            <span className="inline-block rounded-full bg-[rgba(245,166,35,0.2)] px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[2.5px] text-accent2">
              Our Edge
            </span>
            <h2 className="section-title !text-white">Why This Marketplace Feels Relevant</h2>
            <p className="section-sub mx-auto !text-white/65">
              Each section now supports the actual marketplace story: products, sellers, trust, and smooth onboarding.
            </p>
          </div>
          <div className="str-grid mt-14">
            {strengths.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className={`strength-card anim d${(index % 6) + 1}`}>
                <div className="strength-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="visuals" className="section-shell bg-white">
        <div className="w-full">
          <div className="vis-head mb-11">
            <div className="anim sl">
              <span className="section-label">Marketplace View</span>
              <h2 className="section-title">Product Category Showcase</h2>
            </div>
            <p className="section-sub anim sr max-w-[320px]">
              A visual snapshot of categories, products, storefronts, and real marketplace browsing moments.
            </p>
          </div>
          <div className="vis-grid anim">
            {visualItems.map(([src, label, tall]) => (
              <div key={label} className={`visual-item ${tall ? "xl:row-span-2" : ""}`}>
                <img src={src} alt={label} className="visual-image" />
                <div className="visual-overlay">
                  <div className="visual-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="section-shell bg-light">
        <div className="w-full">
          <div className="anim text-center">
            <span className="section-label">Browse</span>
            <h2 className="section-title">Explore Marketplace Categories</h2>
            <p className="section-sub mx-auto">Each category block is written to support relevant marketplace browsing instead of filler content.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map(([icon, title, text], index) => (
              <button key={title} type="button" onClick={createRipple} className={`cat-card anim sc d${(index % 4) + 1}`}>
                <span className="cat-icon">{icon}</span>
                <h4>{title}</h4>
                <span>{text}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="onboarding" ref={onboardingRef} className="section-shell bg-white">
        <div className="mx-auto max-w-[740px] text-center">
          <div className="anim go">
            <span className="section-label">Seller Onboarding</span>
            <h2 className="section-title">Start Seller Registration</h2>
            <p className="section-sub mx-auto">This onboarding flow now clearly reflects how sellers join, set up store details, and prepare listings for the marketplace.</p>
          </div>

          {!submitted ? (
            <>
              <div className="steps-bar">
                {[1, 2, 3].map((item, index) => (
                  <StepNode
                    key={item}
                    number={item}
                    current={step}
                    label={["Business Info", "Store Setup", "Documents"][index]}
                    showLine={item !== 3}
                  />
                ))}
              </div>

              <div className="anim text-left">
                {step === 1 ? (
                  <div className="form-panel">
                    <div className="form-row">
                      <Field label="Full Name *" placeholder="Rajesh Kumar" />
                      <Field label="Mobile Number *" placeholder="+91 98765 43210" />
                    </div>
                    <div className="form-row">
                      <Field label="Email Address *" placeholder="you@example.com" />
                      <Field label="Business Name *" placeholder="Rajesh Handlooms" />
                    </div>
                    <Field label="City & State *" placeholder="Jaipur, Rajasthan" />
                    <div className="mt-7 flex justify-between gap-4">
                      <div />
                      <button type="button" className="btn-next" onClick={() => goStep(2)}>Next: Store Setup →</button>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="form-panel">
                    <div className="form-row">
                      <SelectField label="Category *" options={["Select Category", "Fashion & Apparel", "Handicrafts", "Organic Food", "Electronics", "Home & Garden"]} />
                      <SelectField label="Sub-Category *" options={["Select Sub-Category", "Sarees", "Kurtis", "Handloom", "Jewellery"]} />
                    </div>
                    <Field label="Store Name *" placeholder="My Store Name" />
                    <TextAreaField label="Store Description *" placeholder="Tell buyers what makes your store unique..." />
                    <div className="mt-7 flex justify-between gap-4">
                      <button type="button" className="btn-back" onClick={() => goStep(1)}>← Back</button>
                      <button type="button" className="btn-next" onClick={() => goStep(3)}>Next: Documents →</button>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="form-panel">
                    <div className="form-row">
                      <Field label="GST Number" placeholder="22AAAAA0000A1Z5" />
                      <Field label="PAN Number *" placeholder="ABCDE1234F" />
                    </div>
                    <div className="form-row">
                      <Field label="Bank Account Number *" placeholder="Account Number" />
                      <Field label="IFSC Code *" placeholder="SBIN0001234" />
                    </div>
                    <SelectField label="How did you hear about us?" options={["Select an option", "Social Media", "Friend / Referral", "Google Search", "Advertisement"]} />
                    <div className="mt-7 flex justify-between gap-4">
                      <button type="button" className="btn-back" onClick={() => goStep(2)}>← Back</button>
                      <button type="button" className="btn-next" onClick={() => setSubmitted(true)}>Submit Application ✓</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="success-panel">
              <span className="mb-4 block text-[4.5rem] floaty">🎉</span>
              <h3>Seller Request Submitted</h3>
              <p>
                Your onboarding request has been captured and is ready for marketplace review.
                <br />
                The next step is verification and seller store activation guidance.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="flow" className="section-shell bg-light">
        <div className="w-full">
          <div className="anim text-center">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">How Selling Works on the Marketplace</h2>
            <p className="section-sub mx-auto">From registration to product visibility, this section explains the seller path on the platform.</p>
          </div>
          <div className="relative mt-16 grid gap-10 md:grid-cols-2 xl:grid-cols-5">
            <div className="flow-line hidden xl:block" />
            {flowItems.map(([icon, title, text], index) => (
              <div key={title} className={`anim text-center d${index + 1}`}>
                <div className="flow-num">{icon}</div>
                <h4 className="mb-2 text-[0.88rem] font-bold text-primary">{title}</h4>
                <p className="text-[0.79rem] leading-[1.55] text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blogs" className="section-shell bg-white">
        <div className="w-full">
          <div className="mb-11 flex flex-wrap items-center justify-between gap-4">
            <div className="anim sl">
              <span className="section-label">Insights</span>
              <h2 className="section-title">Marketplace Insights and Seller Resources</h2>
            </div>
            <a href="/blog" className="btn-outline anim sr whitespace-nowrap">View All Posts →</a>
          </div>
          <div className="blogs-grid">
            {blogs.map((blog, index) => (
              <div key={blog.title} className={`blog-card anim d${index + 1} ${index === 0 ? "sl" : index === 2 ? "sr" : ""}`}>
                <div className="h-[220px] overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                </div>
                <div className="p-[26px]">
                  <span className="blog-tag">{blog.tag}</span>
                  <h3 className="mb-2.5 font-display text-[1.1rem] leading-[1.4] text-primary">{blog.title}</h3>
                  <p className="mb-5 text-[0.84rem] leading-[1.6] text-muted">{blog.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-borderc">
                      <img src={blog.avatar} alt={blog.author} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <strong className="block text-[0.79rem] font-bold text-primary">{blog.author}</strong>
                      <span className="text-[0.73rem] text-muted">{blog.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section-shell bg-light">
        <div className="w-full">
          <div className="anim text-center">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common Marketplace Questions</h2>
            <p className="section-sub mx-auto">Answers focused on how the marketplace works for sellers, buyers, and category-based browsing.</p>
          </div>
          <div className="mt-14 flex flex-col gap-[14px]">
            {faqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.q} className={`faq-item anim d${index + 1} ${open ? "open" : ""}`}>
                  <button type="button" className="faq-question" onClick={() => setOpenFaq(open ? null : index)}>
                    <span>{faq.q}</span>
                    <span className="faq-icon">{open ? <FaMinus /> : <FaPlus />}</span>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">{faq.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ctaband" className="section-shell relative overflow-hidden text-center text-white">
        <div className="anim relative z-10">
          <h2 className="mb-4 font-display text-[clamp(2rem,4vw,3rem)]">Ready to Showcase the Right Marketplace Content?</h2>
          <p className="mb-9 text-[1.05rem] text-white/85">This homepage now stays centered on your marketplace, its products, its sellers, and its buyer flow.</p>
          <a href="#onboarding" className="btn-white"><FaRocket />Register as Seller</a>
        </div>
      </section>

      <footer className="border-t border-borderc bg-white/95 px-[5%] pb-8 pt-20 text-textc backdrop-blur-[16px]">
        <div className="mb-14 grid w-full gap-[52px] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <FooterBrand />
          {footerLinks.map(([title, items], index) => (
            <div key={title} className={`anim d${index + 1}`}>
              <h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5>
              <ul className="flex flex-col gap-[11px]">
                {items.map((item) => (
                  <li key={item}><a href="#" className="footer-link">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-borderc pt-7">
          <p className="text-[0.82rem] text-muted">© 2025 eStoreindie. All rights reserved. Made with love in India.</p>
          <p className="text-[0.82rem] text-muted">
            Designed for <a href="#" className="text-accent2 no-underline">Bharat's Entrepreneurs</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const productCategories = ["All", "Handicrafts", "Fashion", "Organic", "Home Decor", "Wellness", "Electronics"];

const vendorShopTabs = ["All Products", "Electronics", "Accessories", "About Store"];

const vendorFilterGroups = {
  categories: ["Audio", "Smart Devices", "Mobile Accessories", "Power Solutions", "Gaming"],
  price: ["Under Rs. 999", "Rs. 1000 - 2499", "Rs. 2500 - 4999", "Above Rs. 5000"],
  rating: ["4.5 & above", "4.0 & above", "3.5 & above"],
  shipping: ["Free Delivery", "Express Dispatch", "Pan India"],
  stock: ["In Stock", "Best Seller", "New Launch"],
};

const vendorShopProducts = [
  {
    id: 101,
    title: "PulseBass Wireless Earbuds",
    category: "Electronics",
    filterCategory: "Audio",
    price: "Rs. 1,899",
    oldPrice: "Rs. 2,499",
    rating: "4.8",
    reviews: 148,
    vendor: "Shree Krishna Electronics",
    badge: "Best Seller",
    delivery: "Free Delivery",
    stock: "In Stock",
    image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 102,
    title: "VoltEdge 20000mAh Power Bank",
    category: "Accessories",
    filterCategory: "Power Solutions",
    price: "Rs. 2,299",
    oldPrice: "Rs. 2,990",
    rating: "4.7",
    reviews: 93,
    vendor: "Shree Krishna Electronics",
    badge: "Fast Charge",
    delivery: "Express Dispatch",
    stock: "In Stock",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 103,
    title: "NovaFit Smart Watch Series S",
    category: "Electronics",
    filterCategory: "Smart Devices",
    price: "Rs. 3,499",
    oldPrice: "Rs. 4,150",
    rating: "4.9",
    reviews: 211,
    vendor: "Shree Krishna Electronics",
    badge: "Top Rated",
    delivery: "Pan India",
    stock: "Best Seller",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 104,
    title: "TurboCharge USB-C Adapter Kit",
    category: "Accessories",
    filterCategory: "Mobile Accessories",
    price: "Rs. 799",
    oldPrice: "Rs. 1,099",
    rating: "4.5",
    reviews: 76,
    vendor: "Shree Krishna Electronics",
    badge: "Daily Pick",
    delivery: "Free Delivery",
    stock: "In Stock",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 105,
    title: "HyperPlay RGB Gaming Headset",
    category: "Electronics",
    filterCategory: "Gaming",
    price: "Rs. 4,799",
    oldPrice: "Rs. 5,690",
    rating: "4.6",
    reviews: 64,
    vendor: "Shree Krishna Electronics",
    badge: "New Launch",
    delivery: "Express Dispatch",
    stock: "New Launch",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 106,
    title: "CrystalView 32-inch Smart Display",
    category: "Electronics",
    filterCategory: "Smart Devices",
    price: "Rs. 12,999",
    oldPrice: "Rs. 14,499",
    rating: "4.8",
    reviews: 57,
    vendor: "Shree Krishna Electronics",
    badge: "Premium",
    delivery: "Pan India",
    stock: "In Stock",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=900&auto=format&fit=crop&q=80",
  },
];

const vendorStoreFacts = [
  { label: "Verified Vendor", value: "Top Rated" },
  { label: "Response Time", value: "Within 20 mins" },
  { label: "Dispatch", value: "Same day for popular items" },
];

const filterGroups = {
  categories: ["Handloom", "Organic Food", "Home Decor", "Jewellery", "Fashion", "Wellness"],
  price: ["Under Rs. 999", "Rs. 1000 - 2499", "Rs. 2500 - 4999", "Above Rs. 5000"],
  rating: ["4.5 & above", "4.0 & above", "3.5 & above"],
  shipping: ["Free Delivery", "Express Dispatch", "Pan India"],
  seller: ["Verified Vendors", "Top Rated Stores", "New Arrivals"],
};

const products = [
  {
    id: 1,
    title: "Jaipur Blue Pottery Vase Set",
    category: "Handicrafts",
    price: "Rs. 2,499",
    oldPrice: "Rs. 3,199",
    rating: "4.8",
    reviews: 124,
    vendor: "Priya Crafts",
    badge: "Best Seller",
    delivery: "Free Delivery",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Pure Neem Wood Dining Collection",
    category: "Home Decor",
    price: "Rs. 5,899",
    oldPrice: "Rs. 7,450",
    rating: "4.7",
    reviews: 86,
    vendor: "Bharat Living",
    badge: "Curated",
    delivery: "Express Dispatch",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Handwoven Linen Saree - Rose Sand",
    category: "Fashion",
    price: "Rs. 3,290",
    oldPrice: "Rs. 4,050",
    rating: "4.9",
    reviews: 208,
    vendor: "Loom Aura",
    badge: "Editor's Pick",
    delivery: "Pan India",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Cold Pressed Wellness Oils Box",
    category: "Wellness",
    price: "Rs. 1,799",
    oldPrice: "Rs. 2,250",
    rating: "4.6",
    reviews: 67,
    vendor: "Ayura Roots",
    badge: "Organic",
    delivery: "Free Delivery",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Artisan Brass Pendant Lamp",
    category: "Home Decor",
    price: "Rs. 4,499",
    oldPrice: "Rs. 5,700",
    rating: "4.8",
    reviews: 91,
    vendor: "Indie Habitat",
    badge: "Premium",
    delivery: "Express Dispatch",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    title: "Farm Fresh Millet Snack Box",
    category: "Organic",
    price: "Rs. 899",
    oldPrice: "Rs. 1,199",
    rating: "4.5",
    reviews: 152,
    vendor: "Grain Story",
    badge: "Healthy Pick",
    delivery: "Pan India",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    title: "Minimal Leather Messenger Bag",
    category: "Fashion",
    price: "Rs. 2,899",
    oldPrice: "Rs. 3,499",
    rating: "4.7",
    reviews: 113,
    vendor: "Urban Tannery",
    badge: "Hot Deal",
    delivery: "Free Delivery",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    title: "Smart Aroma Diffuser Pro",
    category: "Electronics",
    price: "Rs. 2,199",
    oldPrice: "Rs. 2,890",
    rating: "4.4",
    reviews: 58,
    vendor: "Calm Circuit",
    badge: "New Launch",
    delivery: "Express Dispatch",
    image: "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=900&auto=format&fit=crop&q=80",
  },
];

const productFaqs = [
  {
    q: "How fast will my order be delivered?",
    a: "Most featured vendors dispatch within 24 hours. Delivery timelines vary by city, but pan-India orders usually arrive within 3 to 7 business days.",
  },
  {
    q: "Are all products from verified sellers?",
    a: "Yes. Every product shown on this marketplace page is listed by platform-approved vendors, and premium collections go through an extra quality review.",
  },
  {
    q: "Can I request bulk or custom orders?",
    a: "Absolutely. For handcrafted, decor, and gifting categories, you can use the contact form below and our team will connect you with the right seller.",
  },
  {
    q: "What if I need help choosing the right product?",
    a: "Our marketplace support team can help with recommendations, custom sourcing, dispatch questions, and vendor coordination for premium orders.",
  },
];
function VendorShopPage() {
  const [activeTab, setActiveTab] = useState("All Products");
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Trending");
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    price: [],
    rating: [],
    shipping: [],
    stock: [],
  });

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleFilter = (group, value) => {
    setSelectedFilters((current) => ({
      ...current,
      [group]: current[group].includes(value)
        ? current[group].filter((item) => item !== value)
        : [...current[group], value],
    }));
  };

  const visibleProducts = vendorShopProducts
    .filter((product) => {
      if (activeTab === "All Products" || activeTab === "About Store") return true;
      return product.category === activeTab;
    })
    .filter((product) => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;
      return [product.title, product.category, product.filterCategory, product.badge].some((field) =>
        field.toLowerCase().includes(query),
      );
    })
    .filter((product) => {
      if (!selectedFilters.categories.length) return true;
      return selectedFilters.categories.includes(product.filterCategory);
    })
    .filter((product) => {
      if (!selectedFilters.price.length) return true;
      const numericPrice = Number(product.price.replace(/[^\d]/g, ""));
      return selectedFilters.price.some((range) => {
        if (range === "Under Rs. 999") return numericPrice < 1000;
        if (range === "Rs. 1000 - 2499") return numericPrice >= 1000 && numericPrice <= 2499;
        if (range === "Rs. 2500 - 4999") return numericPrice >= 2500 && numericPrice <= 4999;
        if (range === "Above Rs. 5000") return numericPrice >= 5000;
        return true;
      });
    })
    .filter((product) => {
      if (!selectedFilters.rating.length) return true;
      const rating = Number(product.rating);
      return selectedFilters.rating.some((item) => rating >= Number(item.replace(/[^\d.]/g, "")));
    })
    .filter((product) => {
      if (!selectedFilters.shipping.length) return true;
      return selectedFilters.shipping.includes(product.delivery);
    })
    .filter((product) => {
      if (!selectedFilters.stock.length) return true;
      return selectedFilters.stock.some((item) => item === product.stock || item === product.badge);
    })
    .sort((a, b) => {
      if (sortBy === "Newest") return b.id - a.id;
      if (sortBy === "Top Rated") return Number(b.rating) - Number(a.rating);
      return Number(b.reviews) - Number(a.reviews);
    });

  return (
    <div className="bg-light text-textc">
      <section className="vendor-hero">
        <div className="vendor-hero-orb vendor-hero-orb-blue" />
        <div className="vendor-hero-orb vendor-hero-orb-orange" />
        <div className="vendor-hero-inner">
          <div className="vendor-store-row anim go">
            <div className="vendor-store-mark">SK</div>
            <div className="vendor-store-copy">
              <h1>Shree Krishna Electronics</h1>
              <div className="vendor-meta-row">
                <span className="vendor-pill accent"><FaCheck />Verified Vendor</span>
                <span className="vendor-pill blue">Top Rated</span>
                <span className="vendor-mini-stat"><FaStar />4.8 rating</span>
                <span className="vendor-mini-stat"><FaStore />1.2k+ orders</span>
                <span className="vendor-mini-stat"><FaMapMarkerAlt />Jodhpur, RJ</span>
              </div>
            </div>
          </div>

          <div className="vendor-tab-row anim go d2">
            {vendorShopTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={"vendor-tab " + (activeTab === tab ? "active" : "")}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell vendor-shop-section">
        <div className="listing-layout">
          <aside className="filter-panel vendor-filter-panel anim sl go">
            <div className="filter-header">
              <div>
                <span className="filter-label">Store Filters</span>
                <h3>Refine Products</h3>
              </div>
              <FaSlidersH className="text-accent" />
            </div>

            <div className="vendor-search-wrap">
              <FaSearch className="text-primary/60" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="vendor-fact-list">
              {vendorStoreFacts.map((item) => (
                <div key={item.label} className="vendor-fact-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <FilterBlock title="Category" groupKey="categories" items={vendorFilterGroups.categories} selected={selectedFilters.categories} onToggle={toggleFilter} />
            <FilterBlock title="Price Range" groupKey="price" items={vendorFilterGroups.price} selected={selectedFilters.price} onToggle={toggleFilter} />
            <FilterBlock title="Rating" groupKey="rating" items={vendorFilterGroups.rating} selected={selectedFilters.rating} onToggle={toggleFilter} />
            <FilterBlock title="Shipping" groupKey="shipping" items={vendorFilterGroups.shipping} selected={selectedFilters.shipping} onToggle={toggleFilter} />
            <FilterBlock title="Availability" groupKey="stock" items={vendorFilterGroups.stock} selected={selectedFilters.stock} onToggle={toggleFilter} />
          </aside>

          <div className="listing-main anim sr go">
            {activeTab === "About Store" ? (
              <div className="vendor-about-card">
                <span className="filter-label">About Store</span>
                <h3>Electronics picks trusted by customers across Jodhpur and beyond.</h3>
                <p>
                  Shree Krishna Electronics focuses on fast-moving gadgets, mobile accessories, and reliable daily-use devices.
                  The store is known for quick dispatch, verified products, and consistent after-sale support.
                </p>
              </div>
            ) : null}

            <div className="listing-toolbar">
              <div>
                <span className="filter-label">Showing {visibleProducts.length} products</span>
                <h3>{activeTab === "All Products" ? "Store Collection" : activeTab}</h3>
              </div>
              <div className="sort-wrap">
                <span>Sort by</span>
                {["Trending", "Newest", "Top Rated"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSortBy(option)}
                    className={"sort-pill " + (sortBy === option ? "active" : "")}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {visibleProducts.map((product, index) => {
                const liked = wishlist.includes(product.id);
                return (
                  <article key={product.id} className={"product-card anim go d" + ((index % 4) + 1)}>
                    <div className="product-card-media">
                      <img src={product.image} alt={product.title} />
                      <span className="product-badge">{product.badge}</span>
                      <button type="button" className="wishlist-btn" onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist">
                        {liked ? <FaHeart className="text-accent" /> : <FaRegHeart />}
                      </button>
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-topline">
                        <span>{product.filterCategory}</span>
                        <span>{product.delivery}</span>
                      </div>
                      <h4>{product.title}</h4>
                      <p className="vendor-line">by {product.vendor}</p>
                      <div className="rating-line">
                        <span className="rating-pill">{product.rating} ★</span>
                        <span>{product.reviews} reviews</span>
                      </div>
                      <div className="price-line">
                        <strong>{product.price}</strong>
                        <span>{product.oldPrice}</span>
                      </div>
                      <div className="card-actions">
                        <a href="#" className="btn-primary">Add to Cart</a>
                        <a href="/product-details" className="mini-link">View Details</a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductListingPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [openSupportFaq, setOpenSupportFaq] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Trending");
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    price: [],
    rating: [],
    shipping: [],
    seller: [],
  });

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleFilter = (group, value) => {
    setSelectedFilters((current) => ({
      ...current,
      [group]: current[group].includes(value)
        ? current[group].filter((item) => item !== value)
        : [...current[group], value],
    }));
  };

  const visibleProducts = products
    .filter((product) => activeCategory === "All" || product.category === activeCategory)
    .filter((product) => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;
      return [product.title, product.category, product.vendor, product.badge].some((field) =>
        field.toLowerCase().includes(query),
      );
    })
    .filter((product) => {
      if (!selectedFilters.categories.length) return true;
      return selectedFilters.categories.some((item) => {
        const normalized = item.toLowerCase();
        return product.category.toLowerCase().includes(normalized) || product.title.toLowerCase().includes(normalized);
      });
    })
    .filter((product) => {
      if (!selectedFilters.price.length) return true;
      const numericPrice = Number(product.price.replace(/[^\d]/g, ""));
      return selectedFilters.price.some((range) => {
        if (range === "Under Rs. 999") return numericPrice < 1000;
        if (range === "Rs. 1000 - 2499") return numericPrice >= 1000 && numericPrice <= 2499;
        if (range === "Rs. 2500 - 4999") return numericPrice >= 2500 && numericPrice <= 4999;
        if (range === "Above Rs. 5000") return numericPrice >= 5000;
        return true;
      });
    })
    .filter((product) => {
      if (!selectedFilters.rating.length) return true;
      const rating = Number(product.rating);
      return selectedFilters.rating.some((item) => rating >= Number(item.replace(/[^\d.]/g, "")));
    })
    .filter((product) => {
      if (!selectedFilters.shipping.length) return true;
      return selectedFilters.shipping.includes(product.delivery);
    })
    .filter((product) => {
      if (!selectedFilters.seller.length) return true;
      return selectedFilters.seller.some((item) => {
        if (item === "Verified Vendors") return true;
        if (item === "Top Rated Stores") return Number(product.rating) >= 4.7;
        if (item === "New Arrivals") return product.badge === "New Launch";
        return true;
      });
    })
    .sort((a, b) => {
      if (sortBy === "Newest") return b.id - a.id;
      if (sortBy === "Top Rated") return Number(b.rating) - Number(a.rating);
      return Number(b.reviews) - Number(a.reviews);
    });

  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks />

      <section className="product-hero section-shell pt-[120px]">
        <div className="product-hero-bg" />
        <div className="product-hero-glow product-hero-glow-right" />
        <div className="product-hero-glow product-hero-glow-left" />
        <div className="product-hero-inner">
          <div className="anim go">
            <span className="section-label">Marketplace Collection</span>
            <h1 className="product-title">Curated Products from India's Most Trusted Independent Sellers</h1>
            <p className="product-subtitle">
              Explore elevated essentials, handcrafted finds, and fast-moving best sellers - all organized for discovery and conversion.
            </p>
            <div className="product-search-wrap anim go d1">
              <FaSearch className="text-primary/60" />
              <input type="text" placeholder="Search pottery, sarees, wellness kits, decor..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </div>
            <div className="product-chip-row anim go d2">
              {productCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`product-chip ${activeCategory === category ? "active" : ""}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="product-hero-card anim sc go d2">
            <div className="product-stat-card">
              <strong>8,400+</strong>
              <span>Live curated products</span>
            </div>
            <div className="product-stat-card accent">
              <strong>620+</strong>
              <span>Verified premium stores</span>
            </div>
            <div className="product-stat-card dark">
              <strong>24 hrs</strong>
              <span>Average dispatch promise</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="listing-layout">
          <aside className="filter-panel anim sl go">
            <div className="filter-header">
              <div>
                <span className="filter-label">Smart Filters</span>
                <h3>Refine Your Feed</h3>
              </div>
              <FaSlidersH className="text-accent" />
            </div>
            <FilterBlock title="Category" groupKey="categories" items={filterGroups.categories} selected={selectedFilters.categories} onToggle={toggleFilter} />
            <FilterBlock title="Price Range" groupKey="price" items={filterGroups.price} selected={selectedFilters.price} onToggle={toggleFilter} />
            <FilterBlock title="Rating" groupKey="rating" items={filterGroups.rating} selected={selectedFilters.rating} onToggle={toggleFilter} />
            <FilterBlock title="Shipping" groupKey="shipping" items={filterGroups.shipping} selected={selectedFilters.shipping} onToggle={toggleFilter} />
            <FilterBlock title="Seller Type" groupKey="seller" items={filterGroups.seller} selected={selectedFilters.seller} onToggle={toggleFilter} />
          </aside>

          <div className="listing-main anim sr go">
            <div className="listing-toolbar">
              <div>
                <span className="filter-label">Showing {visibleProducts.length} products</span>
                <h3>Featured Marketplace Picks</h3>
              </div>
              <div className="sort-wrap">
                <span>Sort by</span>
                <button type="button" className="sort-pill active">Trending</button>
                <button type="button" className="sort-pill">Newest</button>
                <button type="button" className="sort-pill">Top Rated</button>
              </div>
            </div>

            <div className="product-grid">
              {visibleProducts.map((product, index) => {
                const liked = wishlist.includes(product.id);
                return (
                  <article key={product.id} className={`product-card anim go d${(index % 4) + 1}`}>
                    <div className="product-card-media">
                      <img src={product.image} alt={product.title} />
                      <span className="product-badge">{product.badge}</span>
                      <button type="button" className="wishlist-btn" onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist">
                        {liked ? <FaHeart className="text-accent" /> : <FaRegHeart />}
                      </button>
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-topline">
                        <span>{product.category}</span>
                        <span>{product.delivery}</span>
                      </div>
                      <h4>{product.title}</h4>
                      <p className="vendor-line">by {product.vendor}</p>
                      <div className="rating-line">
                        <span className="rating-pill">{product.rating} ★</span>
                        <span>{product.reviews} reviews</span>
                      </div>
                      <div className="price-line">
                        <strong>{product.price}</strong>
                        <span>{product.oldPrice}</span>
                      </div>
                      <div className="card-actions">
                        <a href="#" className="btn-primary">Add to Cart</a>
                        <a href="/product-details" className="mini-link">View Details</a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="faq-contact-layout">
          <div className="faq-wrap max-w-none anim sl go">
            <span className="section-label">Need Clarity?</span>
            <h2 className="section-title">Common Marketplace Questions</h2>
            <p className="section-sub">Quick answers to help buyers and bulk customers move faster with confidence.</p>
            <div className="mt-10 flex flex-col gap-[14px]">
              {productFaqs.map((faq, index) => {
                const open = openSupportFaq === index;
                return (
                  <div key={faq.q} className={`faq-item ${open ? "open" : ""}`}>
                    <button type="button" className="faq-question" onClick={() => setOpenSupportFaq(open ? null : index)}>
                      <span>{faq.q}</span>
                      <span className="faq-icon">{open ? <FaMinus /> : <FaPlus />}</span>
                    </button>
                    <div className="faq-answer">
                      <div className="faq-answer-inner">{faq.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="contact-panel anim sr go">
            <span className="section-label">Contact Us</span>
            <h2 className="section-title">Need a Custom Quote or Vendor Help?</h2>
            <p className="section-sub">Share your requirement and our marketplace support team will reach out with the right recommendations.</p>
            <div className="contact-form-wrap">
              <div className="form-row">
                <Field label="Full Name *" placeholder="Your name" />
                <Field label="Phone Number *" placeholder="+91 98765 43210" />
              </div>
              <div className="form-row">
                <Field label="Email Address *" placeholder="you@example.com" />
                <Field label="Business / Brand" placeholder="Brand name" />
              </div>
              <Field label="Requirement Type" placeholder="Bulk order, gifting, sourcing, vendor support" />
              <TextAreaField label="Tell us what you need *" placeholder="Mention quantity, category, city, budget, or any custom requirement..." />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="contact-note">Average response time: within 12 working hours.</p>
                <button type="button" className="btn-primary">Send Enquiry</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-borderc bg-white/95 px-[5%] pb-8 pt-20 text-textc backdrop-blur-[16px]">
        <div className="mx-auto mb-14 grid max-w-screen-xl gap-[52px] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <FooterBrand />
          {footerLinks.map(([title, items], index) => (
            <div key={title} className={`anim d${index + 1}`}>
              <h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5>
              <ul className="flex flex-col gap-[11px]">
                {items.map((item) => (
                  <li key={item}><a href="#" className="footer-link">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 border-t border-borderc pt-7">
          <p className="text-[0.82rem] text-muted">© 2025 eStoreindie. All rights reserved. Made with love in India.</p>
          <p className="text-[0.82rem] text-muted">
            Designed for <a href="#" className="text-accent2 no-underline">Bharat's Entrepreneurs</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const productDetailData = {
  title: "Jaipur Blue Pottery Vase Set",
  category: "Handicrafts / Home Decor",
  price: "Rs. 2,499",
  oldPrice: "Rs. 3,199",
  rating: "4.8",
  reviews: 124,
  vendor: "Priya Crafts Studio",
  sku: "EST-IND-2048",
  dispatch: "Ships in 24 hours",
  short: "A handcrafted blue pottery set finished by Jaipur artisans, designed to add premium Indian character to modern and heritage-inspired interiors.",
  banner: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1600&auto=format&fit=crop&q=80",
  images: [
    "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80"
  ],
  highlights: [
    "Hand-painted by Jaipur pottery artisans",
    "Premium glazed ceramic with artisan finish",
    "Ideal for console styling, gifting, and decor setups",
    "Protective packaging for long-distance delivery"
  ],
  specs: [
    ["Material", "Glazed Ceramic"],
    ["Finish", "Hand Painted"],
    ["Set Includes", "3 Decorative Vases"],
    ["Origin", "Jaipur, Rajasthan"],
    ["Care", "Soft dry cloth only"],
    ["Return Policy", "7-day easy replacement"]
  ],
  description: [
    "This premium blue pottery vase set is shaped and painted by skilled local artisans using traditional techniques that celebrate Jaipur's decorative heritage.",
    "The silhouette works beautifully across living rooms, premium gifting setups, styled shelves, boutique spaces, and hospitality interiors looking for a distinctly Indian visual signature.",
    "Each set carries subtle hand-finished variation, which adds character and authenticity rather than machine-made uniformity."
  ]
};

const detailReviews = [
  {
    name: "Aarav Malhotra",
    role: "Interior Stylist, Delhi",
    rating: "5.0",
    text: "Finish quality is excellent and the colors look even richer in person. Packaging was secure and the product felt premium from unboxing to placement.",
  },
  {
    name: "Meera Sethi",
    role: "Home Decor Buyer",
    rating: "4.8",
    text: "Perfect for console styling. I paired the set with warm lighting and brass accents and it completely elevated the space.",
  },
  {
    name: "Rohit Jain",
    role: "Boutique Hotel Procurement",
    rating: "4.9",
    text: "We ordered multiple sets for a hospitality project. The artisan finish was consistent and support during dispatch was smooth.",
  },
];
function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(productDetailData.images[0]);
  const [openDetailFaq, setOpenDetailFaq] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-light text-textc">
      <section className="section-shell pb-0 pt-6">
        <div className="detail-topbar anim go">
          <a href="/profile" className="nav-utility">Go to Profile</a>
          <a href="/login" className="nav-utility">Login</a>
          <a href="/register" className="nav-utility nav-utility-accent">Signup</a>
          <a href="/cart" className="nav-utility nav-icon-btn" aria-label="Cart">
            <FaShoppingCart />
          </a>
        </div>
        <div className="detail-breadcrumbs anim go">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/products">Products</a>
          <span>/</span>
          <span>{productDetailData.title}</span>
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="detail-layout">
          <div className="detail-gallery anim sl go">
            <div className="detail-main-image">
              <img src={activeImage} alt={productDetailData.title} />
            </div>
            <div className="detail-thumb-row">
              {productDetailData.images.map((image) => (
                <button key={image} type="button" className={`detail-thumb ${activeImage === image ? "active" : ""}`} onClick={() => setActiveImage(image)}>
                  <img src={image} alt="Product view" />
                </button>
              ))}
            </div>
          </div>

          <div className="detail-content anim sr go">
            <span className="filter-label">{productDetailData.category}</span>
            <h2 className="detail-title">{productDetailData.title}</h2>
            <p className="detail-summary">{productDetailData.short}</p>

            <div className="detail-rating-row">
              <span className="rating-pill">{productDetailData.rating} ★</span>
              <span>{productDetailData.reviews} verified reviews</span>
              <span>{productDetailData.dispatch}</span>
            </div>

            <div className="detail-price-row">
              <strong>{productDetailData.price}</strong>
              <span>{productDetailData.oldPrice}</span>
            </div>

            <div className="detail-action-card">
              <div className="detail-action-grid">
                <div>
                  <span className="detail-meta-label">Vendor</span>
                  <strong>{productDetailData.vendor}</strong>
                </div>
                <div>
                  <span className="detail-meta-label">SKU</span>
                  <strong>{productDetailData.sku}</strong>
                </div>
              </div>
              <div className="detail-cta-row">
                <div className="quantity-selector">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity((current) => current + 1)}>+</button>
                </div>
                <a href="#" className="btn-primary">Add {quantity} to Cart</a>
                <a href="#contact-form" className="btn-outline">Enquire Now</a>
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="detail-panel">
                <h3>Highlights</h3>
                <ul>
                  {productDetailData.highlights.map((item) => (
                    <li key={item}><FaCheck className="text-accent" />{item}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-panel">
                <h3>Specifications</h3>
                <div className="spec-grid">
                  {productDetailData.specs.map(([label, value]) => (
                    <div key={label} className="spec-item">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-panel mt-6">
              <h3>Description</h3>
              <div className="detail-description">
                {productDetailData.description.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell bg-white pt-0">
        <div className="mx-auto max-w-[1480px]">
          <div className="reviews-shell">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="section-label">Reviews</span>
                <h2 className="section-title mb-0">What Buyers Are Saying</h2>
              </div>
              <p className="section-sub max-w-[360px]">Trusted feedback from buyers, stylists, and project customers who have used this product in real spaces.</p>
            </div>
            <div className="reviews-grid">
              {detailReviews.map((review) => (
                <article key={review.name} className="review-card">
                  <span className="rating-pill">{review.rating} ★</span>
                  <p>{review.text}</p>
                  <strong>{review.name}</strong>
                  <span>{review.role}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="mb-8 mt-16 flex items-end justify-between gap-4">
            <div>
              <span className="section-label">Recommended</span>
              <h2 className="section-title mb-0">You May Also Like</h2>
            </div>
            <p className="section-sub max-w-[360px]">Related finds from trusted independent sellers, chosen to complement this product's style and category.</p>
          </div>
          <div className="recommend-scroll">
            {products.slice(0, 6).map((product) => (
              <article key={product.id} className="recommend-card">
                <div className="recommend-media"><img src={product.image} alt={product.title} /></div>
                <div className="recommend-body">
                  <span>{product.category}</span>
                  <h4>{product.title}</h4>
                  <strong>{product.price}</strong>
                  <a href="/product-details" className="mini-link">View Details</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="faq-contact-layout">
          <div className="faq-wrap max-w-none anim sl go">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions Buyers Usually Ask</h2>
            <p className="section-sub">Everything you might want to confirm before ordering, gifting, or placing a custom quantity request.</p>
            <div className="mt-10 flex flex-col gap-[14px]">
              {productFaqs.map((faq, index) => {
                const open = openDetailFaq === index;
                return (
                  <div key={faq.q} className={`faq-item ${open ? "open" : ""}`}>
                    <button type="button" className="faq-question" onClick={() => setOpenDetailFaq(open ? null : index)}>
                      <span>{faq.q}</span>
                      <span className="faq-icon">{open ? <FaMinus /> : <FaPlus />}</span>
                    </button>
                    <div className="faq-answer">
                      <div className="faq-answer-inner">{faq.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="contact-form" className="contact-panel anim sr go">
            <span className="section-label">Contact Us</span>
            <h2 className="section-title">Need Bulk Pricing, Styling Advice, or Vendor Support?</h2>
            <p className="section-sub">Send us your requirement and we'll help with quantity quotes, dispatch details, customization, and seller coordination.</p>
            <div className="contact-form-wrap">
              <div className="form-row">
                <Field label="Full Name *" placeholder="Your name" />
                <Field label="Phone Number *" placeholder="+91 98765 43210" />
              </div>
              <div className="form-row">
                <Field label="Email Address *" placeholder="you@example.com" />
                <Field label="City / Location" placeholder="Jaipur, Delhi, Mumbai..." />
              </div>
              <Field label="Order Intent" placeholder="Single order, gifting, bulk order, hospitality, reseller..." />
              <TextAreaField label="Tell us what you need *" placeholder="Mention quantity, customization, budget, delivery timeline, or anything else..." />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="contact-note">Support team typically responds within 12 working hours.</p>
                <button type="button" className="btn-primary">Send Request</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const aboutValues = [
  ["Built for Bharat", "We design for independent sellers, growing brands, and local businesses that want real digital momentum."],
  ["Curated with Trust", "Every experience is shaped around clarity, merchant quality, and buyer confidence."],
  ["Growth First", "From storefront creation to product discovery, our system is designed to help vendors scale."],
];

const aboutStats = [
  ["12K+", "Vendors onboarded"],
  ["50+", "Marketplace categories"],
  ["4.8", "Average buyer rating"],
  ["24 hrs", "Average seller response"],
];

const aboutChooseUs = [
  ["Premium Buyer Experience", "Thoughtful layouts, stronger trust cues, and clear buying journeys that help products convert better."],
  ["Seller Growth Support", "From onboarding to visibility and dispatch guidance, we actively help vendors improve marketplace performance."],
  ["Curated Quality Control", "We keep structure, presentation, and category clarity high so the marketplace feels polished and reliable."],
  ["India-First Marketplace Thinking", "Our workflows, support, and commercial decisions are designed around how Indian sellers and buyers actually operate."],
];
const contactCards = [
  ["Talk to Sales", "bulk@estoreindie.com", "For sourcing, gifting, hospitality, and bulk buying support."],
  ["Vendor Helpdesk", "+91 98765 43210", "Seller onboarding, listing help, dispatch assistance, and account support."],
  ["Head Office", "Jaipur, Rajasthan", "Mon to Sat, 10 AM to 7 PM - remote-first support across India."],
];

function AboutPage() {
  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks />

      <section className="about-page-hero section-shell pt-[120px]">
        <div className="about-page-grid">
          <div className="anim go">
            <span className="section-label">About Us</span>
            <h1 className="section-title !text-[clamp(2.5rem,4.5vw,4.2rem)]">A Marketplace Built to Help Independent Indian Sellers Win Online</h1>
            <p className="section-sub max-w-[720px]">eStoreindie brings together discovery-first design, curated trust systems, and vendor-friendly tools so local businesses can sell with confidence and buyers can shop with clarity.</p>
          </div>
          <div className="about-page-card anim sc go d2">
            {aboutStats.map(([value, label]) => (
              <div key={label} className="about-stat-item">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="about-story-grid">
          <div className="story-visual anim sl go">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80" alt="Marketplace team" />
          </div>
          <div className="anim sr go">
            <span className="section-label">Our Story</span>
            <h2 className="section-title">We Created eStoreindie to Close the Gap Between Local Quality and Digital Reach</h2>
            <p className="section-sub">Too many great sellers struggle not because of product quality, but because of weak presentation, low trust, and fragmented systems. We designed eStoreindie to solve that with a platform that feels premium, practical, and growth-ready from day one.</p>
            <div className="about-values-grid">
              {aboutValues.map(([title, text]) => (
                <div key={title} className="about-value-card">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="process-shell">
          <div className="tc anim go">
            <span className="section-label">How We Work</span>
            <h2 className="section-title">What Makes Our Marketplace Different</h2>
          </div>
          <div className="process-grid">
            {[
              ["01", "Curate", "We structure categories, standards, and vendor quality checks before scale."],
              ["02", "Enable", "We help sellers launch with strong product presentation and easy operations."],
              ["03", "Convert", "We design buying journeys that feel premium, trustworthy, and easy to navigate."],
              ["04", "Support", "We stay involved with onboarding, dispatch coordination, and marketplace growth."],
            ].map(([num, title, text]) => (
              <div key={num} className="process-card anim go">
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="process-shell">
          <div className="tc anim go">
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">Why Brands and Buyers Choose eStoreindie</h2>
            <p className="section-sub mx-auto">A marketplace experience built around trust, clarity, and real seller growth instead of generic catalog chaos.</p>
          </div>
          <div className="about-choose-grid">
            {aboutChooseUs.map(([title, text]) => (
              <div key={title} className="about-choose-card anim go">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="faq-contact-layout">
          <div className="faq-wrap max-w-none anim sl go">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common Marketplace Questions</h2>
            <p className="section-sub">Quick answers for brands, vendors, and buyers who want to understand how the marketplace works.</p>
            <div className="mt-10 flex flex-col gap-[14px]">
              {productFaqs.map((faq, index) => (
                <div key={faq.q} className={`faq-item ${index === 0 ? "open" : ""}`}>
                  <div className="faq-question"><span>{faq.q}</span><span className="faq-icon">+</span></div>
                  <div className="faq-answer" style={{ maxHeight: index === 0 ? '300px' : '0px' }}><div className="faq-answer-inner">{faq.a}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-panel anim sr go">
            <span className="section-label">Contact Us</span>
            <h2 className="section-title">Want to Work With Us or Need Help?</h2>
            <p className="section-sub">Share your question, collaboration interest, or marketplace requirement and our team will reach out with the next steps.</p>
            <div className="contact-form-wrap">
              <div className="form-row">
                <Field label="Full Name *" placeholder="Your name" />
                <Field label="Phone Number *" placeholder="+91 98765 43210" />
              </div>
              <div className="form-row">
                <Field label="Email Address *" placeholder="you@example.com" />
                <Field label="Company / Brand" placeholder="Your company or store" />
              </div>
              <Field label="Subject" placeholder="Vendor onboarding, partnership, support, sourcing..." />
              <TextAreaField label="Message *" placeholder="Tell us how we can help..." />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="contact-note">Average response time: within 12 working hours.</p>
                <button type="button" className="btn-primary">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-borderc bg-white/95 px-[5%] pb-8 pt-20 text-textc backdrop-blur-[16px]">
        <div className="mx-auto mb-14 grid max-w-screen-xl gap-[52px] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="anim">
            <div className="mb-3 font-display text-[1.8rem] font-black text-white">eStore<span className="text-accent2">indie</span></div>
            <p className="mb-6 max-w-[270px] text-[0.87rem] leading-[1.75] text-muted">India's trusted multi-vendor marketplace - connecting local sellers with millions of buyers across the nation.</p>
            <div className="flex gap-2.5">{[FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn].map((Icon, index) => (<a key={index} href="#" className="social-link"><Icon /></a>))}</div>
          </div>
          {footerLinks.map(([title, items], index) => (<div key={title} className={`anim d${index + 1}`}><h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5><ul className="flex flex-col gap-[11px]">{items.map((item) => (<li key={item}><a href="#" className="footer-link">{item}</a></li>))}</ul></div>))}
        </div>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 border-t border-borderc pt-7"><p className="text-[0.82rem] text-muted">© 2025 eStoreindie. All rights reserved. Made with love in India.</p><p className="text-[0.82rem] text-muted">Designed for <a href="#" className="text-accent2 no-underline">Bharat's Entrepreneurs</a></p></div>
      </footer>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks />

      <section className="contact-page-hero section-shell pt-[120px]">
        <div className="contact-page-grid">
          <div className="anim go">
            <span className="section-label">Contact Us</span>
            <h1 className="section-title !text-[clamp(2.5rem,4.5vw,4rem)]">Talk to Our Marketplace Team</h1>
            <p className="section-sub max-w-[680px]">Whether you need vendor onboarding help, bulk sourcing support, partnership information, or product assistance, we are here to help you move faster.</p>
            <div className="contact-card-grid">
              {contactCards.map(([title, value, text]) => (
                <div key={title} className="contact-info-card anim go">
                  <h3>{title}</h3>
                  <strong>{value}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="contact-panel anim sr go">
            <span className="section-label">Send a Message</span>
            <h2 className="section-title">We'll Get Back to You Quickly</h2>
            <p className="section-sub">Fill in your requirement and our team will respond with the right next steps.</p>
            <div className="contact-form-wrap">
              <div className="form-row">
                <Field label="Full Name *" placeholder="Your name" />
                <Field label="Phone Number *" placeholder="+91 98765 43210" />
              </div>
              <div className="form-row">
                <Field label="Email Address *" placeholder="you@example.com" />
                <Field label="Company / Brand" placeholder="Brand or business name" />
              </div>
              <Field label="Subject" placeholder="Vendor support, partnership, bulk order, marketplace help..." />
              <TextAreaField label="Message *" placeholder="Tell us what you need help with..." />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="contact-note">Typical response time: within 12 working hours.</p>
                <button type="button" className="btn-primary">Submit Enquiry</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="faq-contact-layout">
          <div className="faq-wrap max-w-none anim sl go">
            <span className="section-label">Support FAQ</span>
            <h2 className="section-title">Common Contact Questions</h2>
            <p className="section-sub">Answers to the most common questions about support, onboarding, and response timelines.</p>
            <div className="mt-10 flex flex-col gap-[14px]">
              {productFaqs.map((faq, index) => (
                <div key={faq.q} className={`faq-item ${index === 0 ? "open" : ""}`}>
                  <div className="faq-question"><span>{faq.q}</span><span className="faq-icon">+</span></div>
                  <div className="faq-answer" style={{ maxHeight: index === 0 ? '300px' : '0px' }}><div className="faq-answer-inner">{faq.a}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="contact-side-note anim sr go">
            <h3>Need urgent support?</h3>
            <p>For seller-side issues, dispatch blocks, or order coordination, share your registered phone number and vendor/store name in the message so our team can help faster.</p>
            <ul>
              <li><FaCheck className="text-accent" /> Vendor onboarding help</li>
              <li><FaCheck className="text-accent" /> Bulk and gifting support</li>
              <li><FaCheck className="text-accent" /> Marketplace partnerships</li>
              <li><FaCheck className="text-accent" /> Product sourcing assistance</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-borderc bg-white/95 px-[5%] pb-8 pt-20 text-textc backdrop-blur-[16px]">
        <div className="mx-auto mb-14 grid max-w-screen-xl gap-[52px] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <FooterBrand />
          {footerLinks.map(([title, items], index) => (<div key={title} className={`anim d${index + 1}`}><h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5><ul className="flex flex-col gap-[11px]">{items.map((item) => (<li key={item}><a href="#" className="footer-link">{item}</a></li>))}</ul></div>))}
        </div>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 border-t border-borderc pt-7"><p className="text-[0.82rem] text-muted">© 2025 eStoreindie. All rights reserved. Made with love in India.</p><p className="text-[0.82rem] text-muted">Designed for <a href="#" className="text-accent2 no-underline">Bharat's Entrepreneurs</a></p></div>
      </footer>
    </div>
  );
}
const blogPagePosts = [
  {
    slug: "seller-growth-playbook",
    tag: "Marketplace Growth",
    title: "The Seller Growth Playbook for Independent Indian Brands",
    excerpt: "A practical framework for improving trust, product presentation, conversion, and repeat orders on a curated marketplace.",
    author: "Priya Sharma",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=80",
  },
  {
    slug: "storefront-design-tips",
    tag: "Design",
    title: "How Better Storefront Design Improves Buyer Confidence",
    excerpt: "From spacing and hierarchy to trust cues and polished product cards, here is what actually helps a marketplace storefront convert.",
    author: "Arjun Mehta",
    date: "March 18, 2026",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
  },
  {
    slug: "marketplace-quality-system",
    tag: "Platform Update",
    title: "Why Curated Quality Systems Matter in Modern Marketplaces",
    excerpt: "A look at how category discipline, vendor review, and presentation standards shape stronger buying experiences.",
    author: "Vikram Nair",
    date: "March 10, 2026",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&auto=format&fit=crop&q=80",
  },
  {
    slug: "bulk-buying-guide",
    tag: "Buying",
    title: "A Smarter Bulk Buying Guide for Gifting, Retail, and Hospitality",
    excerpt: "What to ask vendors before placing larger orders, and how to reduce delays, quality mismatches, and sourcing friction.",
    author: "Meera Sethi",
    date: "March 02, 2026",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&auto=format&fit=crop&q=80",
  },
];

const blogDetailContent = {
  title: "The Seller Growth Playbook for Independent Indian Brands",
  tag: "Growth",
  author: "Priya Sharma",
  date: "March 25, 2026",
  image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&auto=format&fit=crop&q=80",
  intro: "Marketplace growth rarely comes from one dramatic change. It usually comes from a handful of high-leverage improvements made consistently across product presentation, trust, support, and follow-through.",
  sections: [
    ["Start With Presentation", "Your products should look intentional, premium, and easy to understand. Better images, clearer pricing, visible dispatch information, and a stronger content hierarchy can dramatically change buyer confidence."],
    ["Build Trust Before the Buyer Asks", "Trust should be visible in the interface itself. Ratings, return reassurance, verified seller cues, dispatch timelines, and clean layouts all reduce hesitation before a purchase decision is made."],
    ["Support Sellers Beyond Onboarding", "Sellers need more than activation. They need merchandising help, listing clarity, dispatch guidance, and insight into what improves conversion over time."],
    ["Design for Repeat Discovery", "If the first purchase experience feels polished, buyers are more likely to return. Related products, strong category systems, and better post-purchase support help create that loop."],
  ],
};

function FooterBrand() {
  return (
    <div className="anim">
      <a href="/" className="footer-logo-link">
        <img src={siteLogo} alt="eStoreindie" className="footer-logo-img" />
      </a>
      <p className="mb-6 max-w-[270px] text-[0.87rem] leading-[1.75] text-muted">
        India's trusted multi-vendor marketplace - connecting local sellers with millions of buyers across the nation.
      </p>
      <div className="flex gap-2.5">
        {[FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn].map((Icon, index) => (
          <a key={index} href="#" className="social-link"><Icon /></a>
        ))}
      </div>
    </div>
  );
}

function Header({ scrolled = false, showUtilityLinks = false, showHomeCta = false }) {
  return (
    <nav className={`nav-shell ${scrolled ? "scrolled" : ""}`}>
      <a href="/" className="nav-logo"><img src={siteLogo} alt="eStoreindie" className="site-logo-img" /></a>
      <ul className="nav-links">
        {primaryNavItems.map(([label, href]) => (
          <li key={label}><a href={href}>{label}</a></li>
        ))}
      </ul>
      <div className="nav-action-group">
        {showUtilityLinks ? (
          <a href="/cart" className="nav-utility nav-icon-btn" aria-label="Cart">
            <FaShoppingCart />
          </a>
        ) : null}
        {showUtilityLinks ? <a href="/profile" className="nav-utility">Profile</a> : null}
        {showUtilityLinks ? <a href="/login" className="nav-utility">Login</a> : null}
        {showUtilityLinks ? <a href="/register" className="nav-utility nav-utility-accent">Register</a> : null}
        {showHomeCta ? <a href="#onboarding" className="nav-cta">Start Selling →</a> : null}
      </div>
    </nav>
  );
}

function InnerPageHero({ eyebrow, title, description, primaryAction, secondaryAction, tone = "warm", showTopline = true }) {
  return (
    <section className={`page-intro-shell ${tone}`}>
      <div className="page-intro-card anim go">
        {showTopline ? (
          <div className="page-intro-topline">
            <a href="/" className="page-intro-brand">
              <img src={siteLogo} alt="eStoreindie" className="site-logo-img" />
            </a>
            <div className="page-intro-links">
              <a href="/products">Products</a>
              <a href="/vendor-shop">Vendor</a>
              <a href="/contact">Support</a>
            </div>
          </div>
        ) : null}

        <div className="page-intro-copy">
          <span className="section-label">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="page-intro-actions">
          {primaryAction ? <a href={primaryAction.href} className="btn-primary">{primaryAction.label}</a> : null}
          {secondaryAction ? <a href={secondaryAction.href} className="nav-utility">{secondaryAction.label}</a> : null}
        </div>
      </div>
    </section>
  );
}


function ProfilePage() {
  return (
    <div className="bg-light text-textc">
      <InnerPageHero
        eyebrow="My Profile"
        title="Keep account details, addresses, and recent orders organised in one place."
        description="This top section replaces the old header with a calmer account-focused entry point that still gives users quick navigation options."
        primaryAction={{ href: "/cart", label: "View Cart" }}
        secondaryAction={{ href: "/checkout", label: "Continue Checkout" }}
        showTopline={false}
      />

      <section className="profile-shell">
        <div className="profile-bg-orb profile-bg-orb-one" />
        <div className="profile-bg-orb profile-bg-orb-two" />

        <div className="profile-layout">
          <div className="profile-sidebar anim sl go">
            <div className="profile-user-card">
              <div className="profile-avatar">
                <FaUserCircle />
              </div>
              <span className="section-label !mb-3">My Profile</span>
              <h1>Ananya Sharma</h1>
              <p>Buyer account for tracking orders, saving addresses, and managing purchase details across the marketplace.</p>

              <div className="profile-user-meta">
                <div><FaEnvelope /><span>ananya.sharma@example.com</span></div>
                <div><FaPhoneAlt /><span>+91 98765 43210</span></div>
                <div><FaMapMarkerAlt /><span>Mumbai, Maharashtra</span></div>
              </div>

              <a href="/register" className="btn-primary profile-action-btn"><FaEdit />Edit Account</a>
            </div>

            <div className="profile-side-card">
              <h3>Quick actions</h3>
              <div className="profile-quick-list">
                {profileQuickLinks.map(([title, text]) => (
                  <div key={title} className="profile-quick-item">
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-main">
            <div className="profile-hero-card anim go">
              <span className="section-label">Account Overview</span>
              <h2 className="section-title !mb-4 !text-[clamp(2.2rem,4vw,3.6rem)]">All your essential details and orders in one place.</h2>
              <p className="section-sub max-w-[760px]">
                This profile page gives users a clear account summary with personal details, saved addresses,
                order activity, and fast next steps for managing their shopping journey.
              </p>

              <div className="profile-stats-grid">
                {profileStats.map(({ icon: Icon, value, label, note }) => (
                  <div key={label} className="profile-stat-card anim go d2">
                    <div className="profile-stat-icon"><Icon /></div>
                    <strong>{value}</strong>
                    <span>{label}</span>
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-content-grid">
              <div className="profile-panel anim go d2">
                <div className="profile-panel-head">
                  <div>
                    <span className="section-label !mb-3">User Details</span>
                    <h3>Personal information</h3>
                  </div>
                  <a href="/register" className="mini-link">Update details</a>
                </div>

                <div className="profile-detail-grid">
                  <div className="profile-detail-item">
                    <span>Full name</span>
                    <strong>Ananya Sharma</strong>
                  </div>
                  <div className="profile-detail-item">
                    <span>Member since</span>
                    <strong>January 2025</strong>
                  </div>
                  <div className="profile-detail-item">
                    <span>Email address</span>
                    <strong>ananya.sharma@example.com</strong>
                  </div>
                  <div className="profile-detail-item">
                    <span>Preferred payment</span>
                    <strong>UPI and Credit Card</strong>
                  </div>
                </div>

                <div className="profile-note-strip">
                  <FaShieldAlt />
                  <span>Your account is verified and ready for smooth repeat checkout.</span>
                </div>
              </div>

              <div className="profile-panel anim go d3">
                <div className="profile-panel-head">
                  <div>
                    <span className="section-label !mb-3">Saved Addresses</span>
                    <h3>Delivery locations</h3>
                  </div>
                  <a href="/checkout" className="mini-link">Add new</a>
                </div>

                <div className="profile-address-list">
                  {profileAddresses.map((address) => (
                    <div key={address.title} className="profile-address-card">
                      <span>{address.title}</span>
                      <strong>{address.name}</strong>
                      {address.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                      <small>{address.phone}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="profile-panel profile-orders-panel anim go d4">
              <div className="profile-panel-head">
                <div>
                  <span className="section-label !mb-3">Order History</span>
                  <h3>Recent orders</h3>
                </div>
                <a href="/products" className="mini-link">Shop again</a>
              </div>

              <div className="profile-order-list">
                {profileOrders.map((order) => (
                  <article key={order.id} className="profile-order-card">
                    <div className="profile-order-main">
                      <div className="profile-order-topline">
                        <span>Order {order.id}</span>
                        <strong>{order.price}</strong>
                      </div>
                      <h4>{order.item}</h4>
                      <p>{order.vendor}</p>
                    </div>

                    <div className="profile-order-meta">
                      <div><FaCalendarAlt /><span>{order.date}</span></div>
                      <div><FaClock /><span>{order.eta}</span></div>
                      <div><FaCreditCard /><span>Paid online</span></div>
                    </div>

                    <div className={`profile-order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlogPage() {
  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks />

      <section className="blog-page-hero section-shell pt-[120px]">
        <div className="blog-page-grid">
          <div className="anim go">
            <span className="section-label">Marketplace Journal</span>
            <h1 className="section-title !text-[clamp(2.5rem,4.4vw,4.2rem)]">Insights for Sellers, Buyers, and Marketplace Builders</h1>
            <p className="section-sub max-w-[700px]">Stories, strategies, and practical guidance on product presentation, seller growth, trust systems, design, and marketplace performance.</p>
          </div>
          <a href="/blog-details" className="featured-blog-card anim sc go d2">
            <img src={blogPagePosts[0].image} alt={blogPagePosts[0].title} />
            <div className="featured-blog-overlay">
              <span className="blog-tag">Featured Story</span>
              <h3>{blogPagePosts[0].title}</h3>
              <p>{blogPagePosts[0].excerpt}</p>
            </div>
          </a>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto max-w-[1480px]">
          <div className="blog-chip-row">
            {['All Posts', 'Growth', 'Design', 'Platform', 'Buying'].map((chip) => (
              <button key={chip} type="button" className={`product-chip ${chip === 'All Posts' ? 'active' : ''}`}>{chip}</button>
            ))}
          </div>
          <div className="blogs-grid mt-10">
            {blogPagePosts.map((post, index) => (
              <article key={post.slug} className={`blog-card anim d${(index % 4) + 1}`}>
                <div className="h-[240px] overflow-hidden"><img src={post.image} alt={post.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div>
                <div className="p-[26px]">
                  <span className="blog-tag">{post.tag}</span>
                  <h3 className="mb-3 font-display text-[1.2rem] leading-[1.4] text-primary">{post.title}</h3>
                  <p className="mb-5 text-[0.88rem] leading-[1.7] text-muted">{post.excerpt}</p>
                  <div className="flex items-center justify-between gap-4 text-[0.8rem] text-muted">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <a href="/blog-details" className="mini-link mt-4 inline-flex">Read Article</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-borderc bg-white/95 px-[5%] pb-8 pt-20 text-textc backdrop-blur-[16px]">
        <div className="mx-auto mb-14 grid max-w-screen-xl gap-[52px] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]"><FooterBrand />{footerLinks.map(([title, items], index) => (<div key={title} className={`anim d${index + 1}`}><h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5><ul className="flex flex-col gap-[11px]">{items.map((item) => (<li key={item}><a href="#" className="footer-link">{item}</a></li>))}</ul></div>))}</div>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 border-t border-borderc pt-7"><p className="text-[0.82rem] text-muted">© 2025 eStoreindie. All rights reserved. Made with love in India.</p><p className="text-[0.82rem] text-muted">Designed for <a href="#" className="text-accent2 no-underline">Bharat's Entrepreneurs</a></p></div>
      </footer>
    </div>
  );
}

function BlogDetailPage() {
  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks />

      <section className="section-shell pt-[120px] pb-0">
        <div className="detail-breadcrumbs anim go">
          <a href="/">Home</a><span>/</span><a href="/blog">Blog</a><span>/</span><span>{blogDetailContent.title}</span>
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="blog-detail-shell">
          <div className="blog-detail-main anim go">
            <span className="blog-tag">{blogDetailContent.tag}</span>
            <h1 className="blog-detail-title">{blogDetailContent.title}</h1>
            <div className="blog-detail-meta"><span>{blogDetailContent.author}</span><span>{blogDetailContent.date}</span></div>
            <div className="blog-detail-image"><img src={blogDetailContent.image} alt={blogDetailContent.title} /></div>
            <p className="blog-detail-intro">{blogDetailContent.intro}</p>
            <div className="blog-detail-content">
              {blogDetailContent.sections.map(([heading, text]) => (
                <div key={heading} className="blog-detail-section">
                  <h2>{heading}</h2>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="blog-detail-side anim sr go">
            <div className="detail-panel">
              <h3>In This Article</h3>
              <ul>
                {blogDetailContent.sections.map(([heading]) => (<li key={heading}><FaCheck className="text-accent" />{heading}</li>))}
              </ul>
            </div>
            <div className="detail-panel mt-6">
              <h3>More Reads</h3>
              <div className="space-y-4">
                {blogPagePosts.slice(1,4).map((post) => (
                  <a key={post.slug} href="/blog-details" className="mini-link block">{post.title}</a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-8 flex items-end justify-between gap-4"><div><span className="section-label">Related Posts</span><h2 className="section-title mb-0">Continue Reading</h2></div></div>
          <div className="blogs-grid">
            {blogPagePosts.slice(1).map((post, index) => (
              <article key={post.slug} className={`blog-card anim d${index + 1}`}>
                <div className="h-[220px] overflow-hidden"><img src={post.image} alt={post.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div>
                <div className="p-[26px]"><span className="blog-tag">{post.tag}</span><h3 className="mb-3 font-display text-[1.12rem] leading-[1.4] text-primary">{post.title}</h3><p className="mb-4 text-[0.86rem] leading-[1.7] text-muted">{post.excerpt}</p><a href="/blog-details" className="mini-link">Read Article</a></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-borderc bg-white/95 px-[5%] pb-8 pt-20 text-textc backdrop-blur-[16px]">
        <div className="mx-auto mb-14 grid max-w-screen-xl gap-[52px] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]"><FooterBrand />{footerLinks.map(([title, items], index) => (<div key={title} className={`anim d${index + 1}`}><h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5><ul className="flex flex-col gap-[11px]">{items.map((item) => (<li key={item}><a href="#" className="footer-link">{item}</a></li>))}</ul></div>))}</div>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 border-t border-borderc pt-7"><p className="text-[0.82rem] text-muted">© 2025 eStoreindie. All rights reserved. Made with love in India.</p><p className="text-[0.82rem] text-muted">Designed for <a href="#" className="text-accent2 no-underline">Bharat's Entrepreneurs</a></p></div>
      </footer>
    </div>
  );
}
function CheckoutPage() {
  const checkoutItems = [
    { title: "Handwoven Cotton Saree", vendor: "Priya Handloom Studio", qty: 1, price: "Rs. 2,499" },
    { title: "Brass Decor Lamp", vendor: "Aarav Home Crafts", qty: 1, price: "Rs. 1,899" },
  ];
  const [couponCode, setCouponCode] = useState("SAVE10");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placed, setPlaced] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPlaced(true);
  };

  return (
    <div className="bg-light text-textc">
      <InnerPageHero
        eyebrow="Secure Checkout"
        title="Confirm address, payment, and order summary without distraction."
        description="The page now opens with a focused checkout intro instead of the full site header so the user stays locked into completion."
        primaryAction={{ href: "/cart", label: "Back to Cart" }}
        secondaryAction={{ href: "/profile", label: "Go to Profile" }}
        showTopline={false}
      />

      <section className="checkout-shell">
        <div className="mx-auto max-w-[1480px]">
          <div className="anim go">
            <span className="section-label">Secure Checkout</span>
            <h1 className="section-title !text-[clamp(2.4rem,4.5vw,4rem)]">Review your order, confirm address, and complete payment</h1>
            <p className="section-sub max-w-[760px]">This checkout page includes the key parts users expect after cart: delivery address, coupon, payment selection, item review, and final pricing summary.</p>
          </div>

          <div className="checkout-progress anim go d1">
            {['Cart', 'Checkout', 'Confirmation'].map((label, index) => (
              <div key={label} className={`checkout-step ${index < 2 ? 'active' : ''}`}>
                <span>{index + 1}</span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>

          {!placed ? (
            <form onSubmit={handleSubmit} className="checkout-layout">
              <div className="space-y-6">
                <div className="checkout-panel anim sl go">
                  <h3>Delivery Address</h3>
                  <div className="checkout-form-grid">
                    <label className="checkout-field">
                      <span>Full Name</span>
                      <input type="text" placeholder="Enter full name" required />
                    </label>
                    <label className="checkout-field">
                      <span>Phone Number</span>
                      <input type="tel" placeholder="+91 98765 43210" required />
                    </label>
                    <label className="checkout-field">
                      <span>Email Address</span>
                      <input type="email" placeholder="you@example.com" required />
                    </label>
                    <label className="checkout-field">
                      <span>City</span>
                      <input type="text" placeholder="Jaipur" required />
                    </label>
                    <label className="checkout-field">
                      <span>State</span>
                      <input type="text" placeholder="Rajasthan" required />
                    </label>
                    <label className="checkout-field">
                      <span>Pincode</span>
                      <input type="text" placeholder="302001" required />
                    </label>
                    <label className="checkout-field checkout-field-wide">
                      <span>Full Address</span>
                      <textarea placeholder="House no, street, landmark, area" required />
                    </label>
                  </div>
                </div>

                <div className="checkout-panel anim go d2">
                  <h3>Coupon & Offers</h3>
                  <div className="checkout-coupon-row">
                    <input type="text" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" />
                    <button type="button" className="nav-utility nav-utility-accent">Apply</button>
                  </div>
                  <div className="checkout-meta-list mt-4">
                    <div><FaCheck className="text-accent" /><span>`SAVE10` gives instant savings on curated orders.</span></div>
                    <div><FaCheck className="text-accent" /><span>Free buyer protection included on all eligible items.</span></div>
                  </div>
                </div>

                <div className="checkout-panel anim go d3">
                  <h3>Payment Method</h3>
                  <div className="checkout-payment-list">
                    {[
                      ["upi", "UPI / Wallet", "Fastest checkout for mobile users"],
                      ["card", "Credit / Debit Card", "Visa, Mastercard, RuPay supported"],
                      ["netbanking", "Net Banking", "Pay directly from your bank"],
                      ["cod", "Cash on Delivery", "Available on eligible pin codes"],
                    ].map(([value, label, text]) => (
                      <label key={value} className={`checkout-payment-option ${paymentMethod === value ? 'selected' : ''}`}>
                        <input type="radio" name="paymentMethod" checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />
                        <div>
                          <strong>{label}</strong>
                          <p>{text}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="checkout-panel anim sr go">
                  <h3>Order Review</h3>
                  <div className="space-y-4">
                    {checkoutItems.map((item) => (
                      <div key={item.title} className="checkout-order-item">
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.vendor}</span>
                          <p>Qty: {item.qty}</p>
                        </div>
                        <strong>{item.price}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="checkout-panel anim sr go d2">
                  <h3>Price Details</h3>
                  <div className="space-y-4 text-[0.93rem] text-muted">
                    <div className="flex items-center justify-between"><span>Subtotal</span><strong className="text-primary">Rs. 4,398</strong></div>
                    <div className="flex items-center justify-between"><span>Delivery</span><strong className="text-primary">Rs. 120</strong></div>
                    <div className="flex items-center justify-between"><span>Coupon Discount</span><strong className="text-green-600">- Rs. 350</strong></div>
                    <div className="flex items-center justify-between"><span>Taxes</span><strong className="text-primary">Rs. 81</strong></div>
                    <div className="checkout-total-row"><span>Total Payable</span><strong>Rs. 4,249</strong></div>
                  </div>
                  <div className="checkout-meta-list mt-6">
                    <div><FaShieldAlt className="text-accent" /><span>Secure encrypted payment flow</span></div>
                    <div><FaTruck className="text-accent" /><span>Estimated delivery in 3-5 business days</span></div>
                    <div><FaRupeeSign className="text-accent" /><span>Transparent pricing with no hidden platform fee</span></div>
                  </div>
                  <button type="submit" className="btn-primary checkout-submit">Place Order</button>
                </div>
              </div>
            </form>
          ) : (
            <div className="checkout-success anim sc go">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[rgba(232,93,47,0.12)] text-[1.5rem] text-accent">
                <FaCheck />
              </div>
              <h2>Order placed successfully</h2>
              <p>Your order has been confirmed. A payment and delivery update would typically be sent to the registered email and phone number.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="/products" className="btn-primary">Continue Shopping</a>
                <a href="/cart" className="nav-utility">Back to Cart</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function CartPage() {
  const cartItems = [
    { title: "Handwoven Cotton Saree", vendor: "Priya Handloom Studio", price: "Rs. 2,499", meta: "Soft cotton | Jaipur craft" },
    { title: "Brass Decor Lamp", vendor: "Aarav Home Crafts", price: "Rs. 1,899", meta: "Warm finish | Ready to ship" },
  ];

  return (
    <div className="bg-light text-textc">
      <InnerPageHero
        eyebrow="Your Cart"
        title="Review selected items, totals, and the next step before placing the order."
        description="This top panel keeps the cart visually strong even without the main header and gives the page a clearer starting point."
        primaryAction={{ href: "/checkout", label: "Proceed to Checkout" }}
        secondaryAction={{ href: "/profile", label: "Go to Profile" }}
        showTopline={false}
      />

      <section className="section-shell pt-6">
        <div className="mx-auto max-w-[1480px]">
          <div className="anim go">
            <span className="section-label">Your Cart</span>
            <h1 className="section-title !text-[clamp(2.4rem,4.5vw,4rem)]">Review your selected marketplace items</h1>
            <p className="section-sub max-w-[720px]">A simple cart view so users can review products, pricing, and next actions before checkout.</p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="detail-panel anim sl go">
              <h3>Cart Items</h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.title} className="rounded-[22px] bg-light p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <strong className="block text-[1rem] text-primary">{item.title}</strong>
                        <span className="mt-1 block text-[0.85rem] text-muted">{item.vendor}</span>
                        <p className="mt-2 text-[0.88rem] text-muted">{item.meta}</p>
                      </div>
                      <strong className="font-display text-[1.35rem] text-primary">{item.price}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-panel anim sr go">
              <h3>Order Summary</h3>
              <div className="space-y-4 text-[0.92rem] text-muted">
                <div className="flex items-center justify-between"><span>Subtotal</span><strong className="text-primary">Rs. 4,398</strong></div>
                <div className="flex items-center justify-between"><span>Delivery</span><strong className="text-primary">Rs. 120</strong></div>
                <div className="flex items-center justify-between"><span>Platform protection</span><strong className="text-primary">Free</strong></div>
                <div className="flex items-center justify-between border-t border-borderc pt-4"><span>Total</span><strong className="font-display text-[1.5rem] text-primary">Rs. 4,518</strong></div>
              </div>
              <a href="/checkout" className="btn-primary mt-8">Proceed to Checkout</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setLoginData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-light text-textc">
      <InnerPageHero
        eyebrow="User Login"
        title="Sign in quickly and return to your saved cart, addresses, and orders."
        description="The login page now starts with a dedicated intro block that feels lighter and more premium than a repeated global header."
        primaryAction={{ href: "/register", label: "Create Account" }}
        secondaryAction={{ href: "/products", label: "Browse Products" }}
        showTopline={false}
      />

      <section className="register-shell">
        <div className="register-bg-orb register-bg-orb-one" />
        <div className="register-bg-orb register-bg-orb-two" />
        <div className="register-layout">
          <div className="register-copy anim go">
            <span className="section-label">User Login</span>
            <h1 className="register-title">Login to track orders, manage addresses, and continue checkout faster.</h1>
            <p className="register-subtitle">
              Returning users can sign in to access saved details, order history, preferred payment methods,
              and a smoother buying experience across the marketplace.
            </p>

            <div className="register-highlight-list">
              {registerHighlights.map(({ icon: Icon, title, text }) => (
                <div key={title} className="register-highlight-card">
                  <div className="register-highlight-icon">
                    <Icon />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="register-form-card anim sc go d2">
            {!submitted ? (
              <>
                <div className="register-form-head">
                  <span className="section-label !mb-3">Login</span>
                  <h2>Welcome back</h2>
                  <p>Enter your registered account details to continue.</p>
                  <div className="auth-switch-row">
                    <a href="/register" className="auth-switch-link">Register</a>
                    <a href="/login" className="auth-switch-link active">Login</a>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="register-form-grid !grid-cols-1 mt-8">
                    <label className="register-input-wrap">
                      <span><FaEnvelope /> Email Address</span>
                      <input name="email" type="email" placeholder="you@example.com" value={loginData.email} onChange={handleChange} required />
                    </label>

                    <label className="register-input-wrap">
                      <span><FaLock /> Password</span>
                      <input name="password" type="password" placeholder="Enter password" value={loginData.password} onChange={handleChange} required />
                    </label>
                  </div>

                  <div className="login-help-row">
                    <label className="register-check !mt-0">
                      <input name="remember" type="checkbox" checked={loginData.remember} onChange={handleChange} />
                      <span>Remember me</span>
                    </label>
                    <a href="/register" className="mini-link">Forgot password?</a>
                  </div>

                  <button type="submit" className="btn-primary register-submit">Login</button>
                </form>
              </>
            ) : (
              <div className="success-panel">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[rgba(232,93,47,0.12)] text-[1.5rem] text-accent">
                  <FaCheck />
                </div>
                <h3>Login successful</h3>
                <p>Your account session has been started. From here the user can move to cart, checkout, and order tracking.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <a href="/cart" className="btn-primary">Go to Cart</a>
                  <a href="/checkout" className="nav-utility">Go to Checkout</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-light text-textc">
      <InnerPageHero
        eyebrow="User Signup"
        title="Create an account and make future shopping faster, easier, and more reliable."
        description="This intro section gives the registration page a stronger first impression while keeping the form area focused and approachable."
        primaryAction={{ href: "/login", label: "Already Have an Account?" }}
        secondaryAction={{ href: "/products", label: "Explore Products" }}
        showTopline={false}
      />

      <section className="register-shell">
        <div className="register-bg-orb register-bg-orb-one" />
        <div className="register-bg-orb register-bg-orb-two" />
        <div className="register-layout">
          <div className="register-copy anim go">
            <span className="section-label">User Signup</span>
            <h1 className="register-title">Create your eStoreindie account and start exploring with confidence.</h1>
            <p className="register-subtitle">
              Simple, friendly registration flow for marketplace users. Buyers can discover trusted products faster,
              save favourites, and stay ready for smooth checkout experiences.
            </p>

            <div className="register-highlight-list">
              {registerHighlights.map(({ icon: Icon, title, text }) => (
                <div key={title} className="register-highlight-card">
                  <div className="register-highlight-icon">
                    <Icon />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="register-note-card">
              <strong>Why this page works</strong>
              <p>It keeps signup friction low while still collecting the basics needed for a reliable user profile.</p>
            </div>
          </div>

          <div className="register-form-card anim sc go d2">
            {!submitted ? (
              <>
                <div className="register-form-head">
                  <span className="section-label !mb-3">Register Now</span>
                  <h2>Welcome aboard</h2>
                  <p>Fill in your details to create a new account.</p>
                  <div className="auth-switch-row">
                    <a href="/register" className="auth-switch-link active">Register</a>
                    <a href="/login" className="auth-switch-link">Login</a>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="register-form-grid">
                    <label className="register-input-wrap">
                      <span><FaUserAlt /> Full Name</span>
                      <input name="fullName" type="text" placeholder="Enter full name" value={formData.fullName} onChange={handleChange} required />
                    </label>

                    <label className="register-input-wrap">
                      <span><FaEnvelope /> Email Address</span>
                      <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                    </label>

                    <label className="register-input-wrap">
                      <span><FaPhoneAlt /> Phone Number</span>
                      <input name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required />
                    </label>

                    <label className="register-input-wrap">
                      <span><FaMapMarkerAlt /> City</span>
                      <input name="city" type="text" placeholder="Your city" value={formData.city} onChange={handleChange} required />
                    </label>

                    <label className="register-input-wrap register-input-wide">
                      <span><FaMapMarkerAlt /> Address</span>
                      <textarea name="address" placeholder="Enter full address" value={formData.address} onChange={handleChange} required />
                    </label>

                    <div className="register-trust-box">
                      <FaCheck className="text-accent" />
                      <span>Secure signup with essential profile details only.</span>
                    </div>

                    <label className="register-input-wrap">
                      <span><FaLock /> Password</span>
                      <input name="password" type="password" placeholder="Create password" value={formData.password} onChange={handleChange} required />
                    </label>

                    <label className="register-input-wrap">
                      <span><FaLock /> Confirm Password</span>
                      <input name="confirmPassword" type="password" placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} required />
                    </label>
                  </div>

                  <label className="register-check">
                    <input name="agree" type="checkbox" checked={formData.agree} onChange={handleChange} required />
                    <span>I agree to the Terms of Service and Privacy Policy.</span>
                  </label>

                  <button type="submit" className="btn-primary register-submit">Create Account</button>
                </form>
              </>
            ) : (
              <div className="success-panel">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[rgba(232,93,47,0.12)] text-[1.5rem] text-accent">
                  <FaCheck />
                </div>
                <h3>Registration submitted</h3>
                <p>Your user account request has been captured successfully. Next step can be API integration or backend hookup.</p>
                <a href="/" className="btn-primary mt-8">Back to Home</a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterBlock({ title, groupKey, items, selected, onToggle }) {
  return (
    <div className="filter-block">
      <h4>{title}</h4>
      <div className="filter-options">
        {items.map((item) => (
          <label key={item} className="filter-option">
            <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(groupKey, item)} />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepNode({ number, current, label, showLine }) {
  const active = current === number;
  const done = current > number;

  return (
    <>
      <div className={`step-dot ${active ? "active" : ""} ${done ? "done" : ""}`}>
        {number}
        <span className="step-label">{label}</span>
      </div>
      {showLine ? <div className={`step-line ${current > number ? "done" : ""}`} /> : null}
    </>
  );
}

function Field({ label, placeholder }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      <input type="text" placeholder={placeholder} />
    </label>
  );
}

function SelectField({ label, options }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      <select defaultValue={options[0]}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, placeholder }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      <textarea placeholder={placeholder} />
    </label>
  );
}

export default App;




























