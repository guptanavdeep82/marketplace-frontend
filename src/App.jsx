import React, { useEffect, useRef, useState } from "react";
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

const resolveSellerApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:8000/api`;
    }
  }

  return "/api";
};

const SELLER_API_BASE_URL = resolveSellerApiBaseUrl();
const SELLER_API_ORIGIN = SELLER_API_BASE_URL.replace(/\/api$/, "");
const CUSTOMER_AUTH_STORAGE_KEY = "estoreindie_customer_session";
const CUSTOMER_CART_STORAGE_KEY = "estoreindie_customer_cart";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatLabel = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getInitials = (value) =>
  String(value || "Vendor")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || "")
    .join("");

const resolveStorefrontMediaUrl = (path) => {
  if (!path) return heroSectionImage;
  if (/^(https?:|data:)/i.test(path)) return path;
  const normalizedPath = String(path).replace(/^\/+/, "");
  return `${SELLER_API_ORIGIN}/${normalizedPath}`;
};

const getVendorStorefrontSlugFromPath = () => {
  if (typeof window === "undefined") return "";
  const [, vendorShopSegment, slugSegment = ""] = window.location.pathname.split("/");
  return vendorShopSegment === "vendor-shop" ? decodeURIComponent(slugSegment) : "";
};

const getBlogPostSlugFromPath = () => {
  if (typeof window === "undefined") return "";
  const parts = window.location.pathname.split("/");
  if (parts[1] === "blog-details" && parts[2]) {
    return decodeURIComponent(parts[2]);
  }
  return "";
};

const getQueryParam = (key) => {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(key) || "";
};

const getStoredCustomerSession = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storeCustomerSession = (user) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CUSTOMER_AUTH_STORAGE_KEY, JSON.stringify(user));
};

const clearCustomerSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
};

const getStoredCartItems = () => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CUSTOMER_CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const storeCartItems = (items) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CUSTOMER_CART_STORAGE_KEY, JSON.stringify(items));
};

/**
 * Cart Session Management (for tracking guest carts)
 */
const getStoredCartSession = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("estoreindie_cart_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storeCartSession = (session) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("estoreindie_cart_session", JSON.stringify(session));
};

const clearCartSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("estoreindie_cart_session");
};

/**
 * Cart API Functions
 */
const createOrGetCart = async (userId = null, sessionToken = null) => {
  try {
    if (userId) {
      // Get current cart for logged-in user
      const response = await fetch(`${SELLER_API_BASE_URL}/carts/current`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Auth-User-Id": String(userId),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      return data.cart;
    } else if (sessionToken) {
      // Get guest cart
      const response = await fetch(`${SELLER_API_BASE_URL}/carts/current?session_token=${sessionToken}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      return data.cart;
    } else {
      // Create new guest cart
      const response = await fetch(`${SELLER_API_BASE_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error("Failed to create cart");
      const data = await response.json();
      return data.cart;
    }
  } catch (error) {
    console.error("Cart API Error:", error);
    return null;
  }
};

const saveCartItemToDb = async (cart, item, userId = null, sessionToken = null) => {
  try {
    const url = `${SELLER_API_BASE_URL}/carts/${cart.id}/items`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (userId) {
      headers["X-Auth-User-Id"] = String(userId);
    } else if (sessionToken) {
      // Add session token to query
      return fetch(`${url}?session_token=${sessionToken}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          product_id: item.productId || null,
          vendor_id: item.vendorId,
          product_name: item.title,
          product_sku: item.sku || null,
          unit_price: item.numericPrice,
          quantity: item.qty,
          product_snapshot: {
            vendor_slug: item.vendorSlug,
            image: item.image,
            meta: item.meta,
          },
        }),
      }).then(r => r.json());
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        product_id: item.productId || null,
        vendor_id: item.vendorId,
        product_name: item.title,
        product_sku: item.sku || null,
        unit_price: item.numericPrice,
        quantity: item.qty,
        product_snapshot: {
          vendor_slug: item.vendorSlug,
          image: item.image,
          meta: item.meta,
        },
      }),
    });

    if (!response.ok) throw new Error("Failed to save cart item");
    return await response.json();
  } catch (error) {
    console.error("Save cart item error:", error);
    return null;
  }
};

const mergeGuestCartToUser = async (sessionToken, userId) => {
  try {
    const response = await fetch(`${SELLER_API_BASE_URL}/carts/merge-guest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Auth-User-Id": String(userId),
      },
      body: JSON.stringify({ session_token: sessionToken }),
    });

    if (!response.ok) throw new Error("Failed to merge cart");
    return await response.json();
  } catch (error) {
    console.error("Merge cart error:", error);
    return null;
  }
};

const normalizeCartItem = (item, quantity = 1) => ({
  id: item.id ?? `${item.vendorId || "vendor"}-${item.productId || item.sku || item.title}`,
  title: item.title,
  vendor: item.vendor || "Marketplace Seller",
  vendorId: item.vendorId ?? null,
  vendorSlug: item.vendorSlug ?? "",
  productId: item.productId ?? null,
  sku: item.sku ?? "",
  price: item.price,
  numericPrice: item.numericPrice ?? (Number(String(item.price || 0).replace(/[^\d.]/g, "")) || 0),
  image: item.image || heroSectionImage,
  meta: item.meta || item.category || item.description || "Marketplace product",
  qty: quantity,
});

const calculateCheckoutTotals = (items, couponCode = "") => {
  const subtotal = items.reduce((sum, item) => sum + (item.numericPrice * item.qty), 0);
  const normalizedCoupon = couponCode.trim().toUpperCase();
  const discount = normalizedCoupon === "SAVE10" ? Math.min(subtotal * 0.1, 350) : 0;
  const delivery = items.length ? 120 : 0;
  const taxes = Math.max(subtotal - discount, 0) * 0.18;
  const total = Math.max(0, subtotal + delivery + taxes - discount);

  return {
    subtotal,
    delivery,
    discount,
    taxes,
    total,
    appliedCoupon: discount > 0 ? normalizedCoupon : "",
  };
};

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not available."));
      return;
    }

    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const existingScript = document.querySelector('script[data-razorpay-checkout="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.Razorpay), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay checkout.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });
const sellerRegistrationInitialState = {
  name: "",
  phone: "",
  email: "",
  business_name: "",
  address: "",
  category_id: "",
  subcategory_id: "",
  store_name: "",
  store_description: "",
  gst_number: "",
  pan_number: "",
  bank_account_number: "",
  ifsc_code: "",
  referral_source: "",
};
const sellerReferralOptions = [
  { value: "", label: "Select an option" },
  { value: "Social Media", label: "Social Media" },
  { value: "Friend / Referral", label: "Friend / Referral" },
  { value: "Google Search", label: "Google Search" },
  { value: "Advertisement", label: "Advertisement" },
];

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
  ["Marketplace", [
    { label: "All Categories", href: "/products" },
    { label: "New Arrivals", href: "/products" },
    { label: "Featured Stores", href: "/vendor-shop" },
    { label: "Top Vendors", href: "/vendor-shop" },
    { label: "Deals & Offers", href: "/products" },
  ]],
  ["Vendors", [
    { label: "Become a Seller", href: "/#onboarding" },
    { label: "Vendor Dashboard", href: "/vendor-shop" },
    { label: "Seller Guidelines", href: "/terms-conditions" },
    { label: "Commission Rates", href: "/terms-conditions" },
    { label: "Vendor Support", href: "/contact" },
  ]],
  ["Company", [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Refund Policy", href: "/refund-policy" },
  ]],
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
  const [sellerForm, setSellerForm] = useState(sellerRegistrationInitialState);
  const [sellerErrors, setSellerErrors] = useState({});
  const [sellerCategories, setSellerCategories] = useState([]);
  const [sellerOptionsLoading, setSellerOptionsLoading] = useState(false);
  const [sellerOptionsError, setSellerOptionsError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [customerSession, setCustomerSession] = useState(() => getStoredCustomerSession());
  const [cartItems, setCartItems] = useState(() => getStoredCartItems());
  const [showCartLoginPrompt, setShowCartLoginPrompt] = useState(false);
  const [cartNotice, setCartNotice] = useState("");
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
  const isAdminBlogPage = typeof window !== "undefined" && window.location.pathname.startsWith("/admin/blog");
  const isTermsPage = typeof window !== "undefined" && window.location.pathname.startsWith("/terms-conditions");
  const isPrivacyPage = typeof window !== "undefined" && window.location.pathname.startsWith("/privacy-policy");
  const isRefundPage = typeof window !== "undefined" && window.location.pathname.startsWith("/refund-policy");
  const isVendorShopPage = typeof window !== "undefined" && window.location.pathname.startsWith("/vendor-shop");
  const vendorStorefrontSlug = getVendorStorefrontSlugFromPath();
  const isHomePage = !isAboutPage && !isContactPage && !isBlogDetailPage && !isBlogPage && !isProductDetailPage && !isProductsPage && !isCartPage && !isCheckoutPage && !isLoginPage && !isRegisterPage && !isProfilePage && !isAdminBlogPage && !isTermsPage && !isPrivacyPage && !isRefundPage && !isVendorShopPage;
  const statsRef = useRef(null);
  const onboardingRef = useRef(null);

  const persistCustomerSession = async (user) => {
    setCustomerSession(user);
    storeCustomerSession(user);

    // On login: merge guest cart to user cart
    if (user?.id) {
      const cartSession = getStoredCartSession();
      if (cartSession?.session_token && cartSession.session_token !== user.id) {
        try {
          const mergeResponse = await mergeGuestCartToUser(cartSession.session_token, user.id);
          if (mergeResponse?.cart) {
            // Clear local storage cart and save merged one
            storeCartItems([]);
            clearCartSession();
            
            // Update local cart with merged items
            const mergedItems = mergeResponse.cart.items.map(item => ({
              id: item.id,
              title: item.product_name,
              vendor: cartSession.vendor || "Merged Vendor",
              vendorId: item.vendor_id,
              vendorSlug: cartSession.vendorSlug || "",
              productId: item.product_id,
              sku: item.product_sku,
              price: formatCurrency(item.unit_price),
              numericPrice: item.unit_price,
              image: item.product_snapshot?.image || heroSectionImage,
              meta: item.product_snapshot?.meta || "Marketplace product",
              qty: item.quantity,
            }));
            
            setCartItems(mergedItems);
            storeCartItems(mergedItems);
          }
        } catch (error) {
          console.error("Failed to merge guest cart:", error);
          // Continue anyway - user can still use local cart
        }
      }
    }
  };

  const logoutCustomerSession = () => {
    clearCustomerSession();
    setCustomerSession(null);
    storeCartItems([]);
    setCartItems([]);
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  };

  const addToCart = async (item, quantity = 1) => {
    const normalized = normalizeCartItem(item, quantity);

    if (normalized.vendorId && cartItems.length) {
      const activeVendorId = cartItems[0]?.vendorId;

      if (activeVendorId && String(activeVendorId) !== String(normalized.vendorId)) {
        setCartNotice("Checkout currently supports one vendor storefront at a time. Clear the cart before adding products from another vendor.");
        return false;
      }
    }

    // Update local cart state
    setCartItems((current) => {
      const next = current.some((cartItem) => String(cartItem.id) === String(normalized.id))
        ? current.map((cartItem) =>
          String(cartItem.id) === String(normalized.id)
            ? { ...cartItem, qty: cartItem.qty + quantity }
            : cartItem
        )
        : [...current, normalized];

      storeCartItems(next);
      
      // Save to database (both guest and logged-in users)
      (async () => {
        try {
          let cartSession = getStoredCartSession();
          
          if (!cartSession) {
            // Create new cart (guest or user)
            const createResponse = await createOrGetCart(customerSession?.id);
            if (createResponse) {
              cartSession = {
                id: createResponse.id,
                session_token: createResponse.session_token,
                vendor_id: normalized.vendorId,
              };
              storeCartSession(cartSession);
            }
          }

          if (cartSession?.id) {
            // Save item to cart
            await saveCartItemToDb(
              cartSession,
              normalized,
              customerSession?.id || null,
              cartSession.session_token
            );
            console.log("✅ Item saved to database!");
          }
        } catch (error) {
          console.error("Failed to save to database:", error);
          // Continue anyway - cart is still in localStorage
        }
      })();

      return next;
    });

    setCartNotice("");
    return true;
  };

  const updateCartItemQuantity = (id, nextQuantity) => {
    setCartItems((current) => {
      const next = nextQuantity <= 0
        ? current.filter((item) => String(item.id) !== String(id))
        : current.map((item) =>
          String(item.id) === String(id) ? { ...item, qty: nextQuantity } : item
        );

      storeCartItems(next);
      return next;
    });
  };

  const removeCartItem = (id) => {
    setCartItems((current) => {
      const next = current.filter((item) => String(item.id) !== String(id));
      storeCartItems(next);
      return next;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartNotice("");
    storeCartItems([]);
  };

  const openCart = () => {
    if (typeof window !== "undefined") {
      window.location.assign("/cart");
    }
  };

  const handleCartLinkClick = (event) => {
    event.preventDefault();
    openCart();
  };

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
  const selectedSellerCategory = sellerCategories.find((item) => String(item.id) === String(sellerForm.category_id));
  const sellerCategoryOptions = [
    { value: "", label: sellerOptionsLoading ? "Loading categories..." : "Select Category" },
    ...sellerCategories.map((item) => ({ value: String(item.id), label: item.name })),
  ];
  const sellerSubcategoryOptions = [
    {
      value: "",
      label: sellerForm.category_id ? "Select Sub-Category" : "Select category first",
    },
    ...((selectedSellerCategory?.subcategories ?? []).map((item) => ({ value: String(item.id), label: item.name }))),
  ];

  useEffect(() => {
    if (!isHomePage) {
      return undefined;
    }

    const controller = new AbortController();

    const loadSellerOptions = async () => {
      setSellerOptionsLoading(true);
      setSellerOptionsError("");

      try {
        const response = await fetch(`${SELLER_API_BASE_URL}/seller-registration/options`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load seller categories right now.");
        }

        const payload = await response.json();
        setSellerCategories(payload.categories ?? []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setSellerOptionsError(error.message || "Unable to load seller categories right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setSellerOptionsLoading(false);
        }
      }
    };

    loadSellerOptions();

    return () => controller.abort();
  }, [isHomePage]);

  const updateSellerForm = (name, value) => {
    setSellerForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "category_id" ? { subcategory_id: "" } : {}),
    }));
    setSellerErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateSellerStep = (targetStep = step) => {
    const nextErrors = {};

    if (targetStep === 1) {
      if (!sellerForm.name.trim()) nextErrors.name = "Full name is required.";
      if (!sellerForm.phone.trim()) nextErrors.phone = "Mobile number is required.";
      if (!sellerForm.email.trim()) nextErrors.email = "Email address is required.";
      if (!sellerForm.business_name.trim()) nextErrors.business_name = "Business name is required.";
      if (!sellerForm.address.trim()) nextErrors.address = "City and state are required.";
    }

    if (targetStep === 2) {
      if (!sellerForm.category_id) nextErrors.category_id = "Category is required.";
      if (!sellerForm.subcategory_id) nextErrors.subcategory_id = "Sub-category is required.";
      if (!sellerForm.store_name.trim()) nextErrors.store_name = "Store name is required.";
      if (!sellerForm.store_description.trim()) nextErrors.store_description = "Store description is required.";
    }

    if (targetStep === 3) {
      if (!sellerForm.pan_number.trim()) nextErrors.pan_number = "PAN number is required.";
      if (!sellerForm.bank_account_number.trim()) nextErrors.bank_account_number = "Bank account number is required.";
      if (!sellerForm.ifsc_code.trim()) nextErrors.ifsc_code = "IFSC code is required.";
    }

    setSellerErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const goStep = (nextStep) => {
    if (nextStep > step && !validateSellerStep(step)) {
      return;
    }

    setStep(nextStep);
    onboardingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSellerSubmit = async () => {
    if (!validateSellerStep(3)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(`${SELLER_API_BASE_URL}/seller-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(sellerForm),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 422 && payload.errors) {
          const normalizedErrors = Object.fromEntries(
            Object.entries(payload.errors).map(([field, messages]) => [field, messages[0]])
          );
          setSellerErrors(normalizedErrors);
          setSubmitMessage(payload.message || "Please fix the highlighted fields.");
          return;
        }

        throw new Error(payload.message || "Unable to submit seller registration right now.");
      }

      const storefrontUrl = payload.storefront_url || (payload.vendor?.slug ? `/vendor-shop/${payload.vendor.slug}` : "");

      setSubmitted(true);
      setSellerErrors({});
      setSubmitMessage(
        storefrontUrl
          ? `${payload.message || "Seller registration submitted successfully."} Opening your storefront...`
          : (payload.message || "Seller registration submitted successfully.")
      );

      if (storefrontUrl && typeof window !== "undefined") {
        window.setTimeout(() => {
          window.location.assign(storefrontUrl);
        }, 700);
      }
    } catch (error) {
      setSubmitMessage(error.message || "Unable to submit seller registration right now.");
    } finally {
      setIsSubmitting(false);
    }
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
    return <AboutPage onCartClick={handleCartLinkClick} cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)} customerSession={customerSession} onLogout={logoutCustomerSession} />;
  }

  if (isContactPage) {
    return <ContactPage onCartClick={handleCartLinkClick} cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)} customerSession={customerSession} onLogout={logoutCustomerSession} />;
  }

  if (isBlogDetailPage) {
    return <BlogDetailPage onCartClick={handleCartLinkClick} cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)} customerSession={customerSession} onLogout={logoutCustomerSession} />;
  }

  if (isBlogPage) {
    return <BlogPage onCartClick={handleCartLinkClick} cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)} customerSession={customerSession} onLogout={logoutCustomerSession} />;
  }

  if (isProductDetailPage) {
    return <ProductDetailPage onAddToCart={addToCart} onCartClick={handleCartLinkClick} cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)} cartItems={cartItems} onUpdateQty={updateCartItemQuantity} onRemoveItem={removeCartItem} customerSession={customerSession} onLogout={logoutCustomerSession} />;
  }

  if (isProductsPage) {
    return <ProductListingPage onAddToCart={addToCart} onCartClick={handleCartLinkClick} cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)} cartItems={cartItems} onUpdateQty={updateCartItemQuantity} onRemoveItem={removeCartItem} customerSession={customerSession} onLogout={logoutCustomerSession} />;
  }

  if (isCartPage) {
    return (
      <CartPage cartItems={cartItems} cartNotice={cartNotice} onCartClick={handleCartLinkClick} onUpdateQty={updateCartItemQuantity} onRemoveItem={removeCartItem} customerSession={customerSession} onLogout={logoutCustomerSession} />
    );
  }

  if (isCheckoutPage) {
    return <CheckoutPage cartItems={cartItems} customerSession={customerSession} onCartClick={handleCartLinkClick} onOrderPlaced={clearCart} />;
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

  if (isAdminBlogPage) {
    return <AdminBlogPage />;
  }

  if (isTermsPage) {
    return <PolicyPage policy={policyPageContent["/terms-conditions"]} />;
  }

  if (isPrivacyPage) {
    return <PolicyPage policy={policyPageContent["/privacy-policy"]} />;
  }

  if (isRefundPage) {
    return <PolicyPage policy={policyPageContent["/refund-policy"]} />;
  }

  if (isVendorShopPage) {
    return <VendorShopPage storefrontSlug={vendorStorefrontSlug} onAddToCart={addToCart} cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)} cartItems={cartItems} onUpdateQty={updateCartItemQuantity} onRemoveItem={removeCartItem} customerSession={customerSession} onLogout={logoutCustomerSession} />;
  }

  return (
    <div className="bg-light text-textc">
      {showCartLoginPrompt ? (
        <CartLoginPrompt
          onClose={() => setShowCartLoginPrompt(false)}
        />
      ) : null}
      <div ref={cursorRef} className="cursor-glow hidden md:block" />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`scroll-top ${showTop ? "show" : ""}`}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>

      <Header
        scrolled={isScrolled}
        showUtilityLinks
        showHomeCta
        cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
        onCartClick={handleCartLinkClick}
        customerSession={customerSession}
        onLogout={logoutCustomerSession}
      />

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

              {submitMessage ? <p className="mt-4 text-sm font-medium text-[#d64545]">{submitMessage}</p> : null}
              {sellerOptionsError ? <p className="mt-3 text-sm font-medium text-[#d64545]">{sellerOptionsError}</p> : null}

              <div className="anim text-left">
                {step === 1 ? (
                  <div className="form-panel">
                    <div className="form-row">
                      <Field label="Full Name *" name="name" placeholder="Rajesh Kumar" value={sellerForm.name} onChange={updateSellerForm} error={sellerErrors.name} />
                      <Field label="Mobile Number *" name="phone" placeholder="+91 98765 43210" value={sellerForm.phone} onChange={updateSellerForm} error={sellerErrors.phone} />
                    </div>
                    <div className="form-row">
                      <Field label="Email Address *" name="email" type="email" placeholder="you@example.com" value={sellerForm.email} onChange={updateSellerForm} error={sellerErrors.email} />
                      <Field label="Business Name *" name="business_name" placeholder="Rajesh Handlooms" value={sellerForm.business_name} onChange={updateSellerForm} error={sellerErrors.business_name} />
                    </div>
                    <Field label="City & State *" name="address" placeholder="Jaipur, Rajasthan" value={sellerForm.address} onChange={updateSellerForm} error={sellerErrors.address} />
                    <div className="mt-7 flex justify-between gap-4">
                      <div />
                      <button type="button" className="btn-next" onClick={() => goStep(2)}>Next: Store Setup →</button>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="form-panel">
                    <div className="form-row">
                      <SelectField label="Category *" name="category_id" value={sellerForm.category_id} options={sellerCategoryOptions} onChange={updateSellerForm} error={sellerErrors.category_id} disabled={sellerOptionsLoading} />
                      <SelectField label="Sub-Category *" name="subcategory_id" value={sellerForm.subcategory_id} options={sellerSubcategoryOptions} onChange={updateSellerForm} error={sellerErrors.subcategory_id} disabled={!sellerForm.category_id || sellerOptionsLoading} />
                    </div>
                    <Field label="Store Name *" name="store_name" placeholder="My Store Name" value={sellerForm.store_name} onChange={updateSellerForm} error={sellerErrors.store_name} />
                    <TextAreaField label="Store Description *" name="store_description" placeholder="Tell buyers what makes your store unique..." value={sellerForm.store_description} onChange={updateSellerForm} error={sellerErrors.store_description} />
                    <div className="mt-7 flex justify-between gap-4">
                      <button type="button" className="btn-back" onClick={() => goStep(1)}>← Back</button>
                      <button type="button" className="btn-next" onClick={() => goStep(3)}>Next: Documents →</button>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="form-panel">
                    <div className="form-row">
                      <Field label="GST Number" name="gst_number" placeholder="22AAAAA0000A1Z5" value={sellerForm.gst_number} onChange={updateSellerForm} error={sellerErrors.gst_number} />
                      <Field label="PAN Number *" name="pan_number" placeholder="ABCDE1234F" value={sellerForm.pan_number} onChange={updateSellerForm} error={sellerErrors.pan_number} />
                    </div>
                    <div className="form-row">
                      <Field label="Bank Account Number *" name="bank_account_number" placeholder="Account Number" value={sellerForm.bank_account_number} onChange={updateSellerForm} error={sellerErrors.bank_account_number} />
                      <Field label="IFSC Code *" name="ifsc_code" placeholder="SBIN0001234" value={sellerForm.ifsc_code} onChange={updateSellerForm} error={sellerErrors.ifsc_code} />
                    </div>
                    <SelectField label="How did you hear about us?" name="referral_source" value={sellerForm.referral_source} options={sellerReferralOptions} onChange={updateSellerForm} error={sellerErrors.referral_source} />
                    <div className="mt-7 flex justify-between gap-4">
                      <button type="button" className="btn-back" onClick={() => goStep(2)}>← Back</button>
                      <button type="button" className="btn-next" onClick={handleSellerSubmit} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Application ✓"}</button>
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
                {submitMessage || "Your onboarding request has been captured and is ready for marketplace review."}
                <br />
                The next step is verification and seller store activation guidance for {sellerForm.store_name || "your store"}.
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
                {items.map(({ label, href }) => (
                  <li key={label}><a href={href} className="footer-link">{label}</a></li>
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
    sku: "EST-001",
    title: "Jaipur Blue Pottery Vase Set",
    category: "Handicrafts",
    filterCategory: "Handicrafts",
    price: "Rs. 2,499",
    rawPrice: 2499,
    oldPrice: "Rs. 3,199",
    rating: "4.8",
    reviews: 124,
    vendor: "Priya Crafts",
    vendorId: null,
    vendorSlug: null,
    badge: "Best Seller",
    delivery: "Free Delivery",
    description: "A handcrafted blue pottery set finished by Jaipur artisans.",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    sku: "EST-002",
    title: "Pure Neem Wood Dining Collection",
    category: "Home Decor",
    filterCategory: "Home Decor",
    price: "Rs. 5,899",
    rawPrice: 5899,
    oldPrice: "Rs. 7,450",
    rating: "4.7",
    reviews: 86,
    vendor: "Bharat Living",
    vendorId: null,
    vendorSlug: null,
    badge: "Curated",
    delivery: "Express Dispatch",
    description: "Premium neem wood dining furniture set.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    sku: "EST-003",
    title: "Handwoven Linen Saree - Rose Sand",
    category: "Fashion",
    filterCategory: "Fashion",
    price: "Rs. 3,290",
    rawPrice: 3290,
    oldPrice: "Rs. 4,050",
    rating: "4.9",
    reviews: 208,
    vendor: "Loom Aura",
    vendorId: null,
    vendorSlug: null,
    badge: "Editor's Pick",
    delivery: "Pan India",
    description: "Traditional handwoven linen saree in rose sand color.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    sku: "EST-004",
    title: "Cold Pressed Wellness Oils Box",
    category: "Wellness",
    filterCategory: "Wellness",
    price: "Rs. 1,799",
    rawPrice: 1799,
    oldPrice: "Rs. 2,250",
    rating: "4.6",
    reviews: 67,
    vendor: "Ayura Roots",
    vendorId: null,
    vendorSlug: null,
    badge: "Organic",
    delivery: "Free Delivery",
    description: "Set of cold-pressed wellness oils for daily wellness.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    sku: "EST-005",
    title: "Artisan Brass Pendant Lamp",
    category: "Home Decor",
    filterCategory: "Home Decor",
    price: "Rs. 4,499",
    rawPrice: 4499,
    oldPrice: "Rs. 5,700",
    rating: "4.8",
    reviews: 91,
    vendor: "Indie Habitat",
    vendorId: null,
    vendorSlug: null,
    badge: "Premium",
    delivery: "Express Dispatch",
    description: "Handcrafted brass pendant lamp for interior styling.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    sku: "EST-006",
    title: "Farm Fresh Millet Snack Box",
    category: "Organic",
    filterCategory: "Organic",
    price: "Rs. 899",
    rawPrice: 899,
    oldPrice: "Rs. 1,199",
    rating: "4.5",
    reviews: 152,
    vendor: "Grain Story",
    vendorId: null,
    vendorSlug: null,
    badge: "Healthy Pick",
    delivery: "Pan India",
    description: "Farm-fresh millet snack assortment.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    sku: "EST-007",
    title: "Minimal Leather Messenger Bag",
    category: "Fashion",
    filterCategory: "Fashion",
    price: "Rs. 2,899",
    rawPrice: 2899,
    oldPrice: "Rs. 3,499",
    rating: "4.7",
    reviews: 113,
    vendor: "Urban Tannery",
    vendorId: null,
    vendorSlug: null,
    badge: "Hot Deal",
    delivery: "Free Delivery",
    description: "Minimalist leather messenger bag for everyday use.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    sku: "EST-008",
    title: "Smart Aroma Diffuser Pro",
    category: "Electronics",
    filterCategory: "Electronics",
    price: "Rs. 2,199",
    rawPrice: 2199,
    oldPrice: "Rs. 2,890",
    rating: "4.4",
    reviews: 58,
    vendor: "Calm Circuit",
    vendorId: null,
    vendorSlug: null,
    badge: "New Launch",
    delivery: "Express Dispatch",
    description: "Smart aroma diffuser with app control.",
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
function VendorShopPage({ storefrontSlug, onAddToCart, cartCount = 0, cartItems = [], onUpdateQty, onRemoveItem, customerSession, onLogout }) {
  const [activeTab, setActiveTab] = useState("All Products");
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Trending");
  const [storefront, setStorefront] = useState(null);
  const [storefrontLoading, setStorefrontLoading] = useState(true);
  const [storefrontError, setStorefrontError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    price: [],
    rating: [],
    shipping: [],
    stock: [],
  });

  useEffect(() => {
    if (!storefrontSlug) {
      setStorefrontLoading(false);
      setStorefrontError("This vendor storefront link is incomplete.");
      return undefined;
    }

    const controller = new AbortController();

    const loadStorefront = async () => {
      setStorefrontLoading(true);
      setStorefrontError("");

      try {
        const response = await fetch(`${SELLER_API_BASE_URL}/vendor-storefront/${storefrontSlug}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.message || "Unable to load this vendor storefront right now.");
        }

        setStorefront(payload);
      } catch (error) {
        if (error.name !== "AbortError") {
          setStorefrontError(error.message || "Unable to load this vendor storefront right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setStorefrontLoading(false);
        }
      }
    };

    loadStorefront();

    return () => controller.abort();
  }, [storefrontSlug]);

  useEffect(() => {
    setActiveTab("All Products");
    setSelectedFilters({
      categories: [],
      price: [],
      rating: [],
      shipping: [],
      stock: [],
    });
    setSearchTerm("");
    setSortBy("Trending");
  }, [storefrontSlug, storefront]);

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

  const vendor = storefront?.vendor;
  const vendorCategoryName = vendor?.category?.name || storefront?.stats?.category_name || "Category";
  const vendorSubcategoryName = vendor?.subcategory?.name || storefront?.stats?.subcategory_name || "";
  const vendorDisplayName = vendor?.store_name || vendor?.business_name || vendor?.name || "Vendor Store";
  const vendorTabs = Array.from(
    new Set(["All Products", vendorCategoryName, vendorSubcategoryName, "About Store"].filter(Boolean))
  );
  const vendorFilterGroups = {
    categories: Array.from(
      new Set(
        (storefront?.products ?? [])
          .map((product) => product.subcategory?.name || product.category?.name)
          .filter(Boolean)
      )
    ),
    price: ["Under Rs. 999", "Rs. 1000 - 2499", "Rs. 2500 - 4999", "Above Rs. 5000"],
    rating: ["4.5 & above", "4.0 & above", "3.5 & above"],
    shipping: ["Free Delivery", "Express Dispatch", "Pan India"],
    stock: ["In Stock", "Featured", "Low Stock"],
  };
  const vendorStoreFacts = [
    { label: "Status", value: formatLabel(vendor?.status || "pending") },
    { label: "Category", value: vendorCategoryName },
    { label: "Sub-category", value: vendorSubcategoryName || "General Catalog" },
    { label: "Joined", value: vendor?.joined_at ? new Date(vendor.joined_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Just now" },
  ];
  const storefrontProducts = (storefront?.products ?? []).map((product, index) => {
    const currentPrice = Number(product.sale_price ?? product.price ?? 0);
    const originalPrice = Number(product.price ?? currentPrice);
    const inStock = Number(product.stock || 0) > 0;
    const derivedRating = (4.4 + ((index % 5) * 0.1) + (product.is_featured ? 0.2 : 0)).toFixed(1);

    return {
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      title: product.name,
      category: product.category?.name || vendorCategoryName,
      filterCategory: product.subcategory?.name || product.category?.name || "Catalog",
      price: formatCurrency(currentPrice),
      oldPrice: originalPrice > currentPrice ? formatCurrency(originalPrice) : "",
      rating: derivedRating,
      reviews: 24 + (index * 11),
      vendor: vendorDisplayName,
      badge: product.is_featured ? "Featured" : (inStock ? "Ready to Ship" : "Sold Out"),
      delivery: inStock && Number(product.stock || 0) > 10 ? "Express Dispatch" : (inStock ? "Pan India" : "Free Delivery"),
      stock: inStock ? (Number(product.stock || 0) <= 5 ? "Low Stock" : "In Stock") : "Sold Out",
      image: resolveStorefrontMediaUrl(product.image_path),
      description: product.short_description || `${product.name} from ${vendorDisplayName}.`,
      rawPrice: currentPrice,
      rawRating: Number(derivedRating),
      vendorId: vendor?.id,
      vendorSlug: vendor?.slug || storefrontSlug,
    };
  });

  const visibleProducts = storefrontProducts
    .filter((product) => {
      if (activeTab === "All Products" || activeTab === "About Store") return true;
      return product.category === activeTab || product.filterCategory === activeTab;
    })
    .filter((product) => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;
      return [product.title, product.category, product.filterCategory, product.badge, product.description].some((field) =>
        field.toLowerCase().includes(query),
      );
    })
    .filter((product) => {
      if (!selectedFilters.categories.length) return true;
      return selectedFilters.categories.includes(product.filterCategory);
    })
    .filter((product) => {
      if (!selectedFilters.price.length) return true;
      const numericPrice = product.rawPrice;
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
      const rating = product.rawRating;
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
      if (sortBy === "Top Rated") return b.rawRating - a.rawRating;
      return Number(b.reviews) - Number(a.reviews);
    });

  if (storefrontLoading) {
    return (
      <div className="bg-light text-textc">
        <section className="vendor-hero">
          <div className="vendor-hero-orb vendor-hero-orb-blue" />
          <div className="vendor-hero-orb vendor-hero-orb-orange" />
          <div className="vendor-hero-inner">
            <div className="vendor-store-row anim go">
              <div className="vendor-store-mark">..</div>
              <div className="vendor-store-copy">
                <h1>Loading storefront...</h1>
                <div className="vendor-meta-row">
                  <span className="vendor-mini-stat"><FaStore />Preparing vendor page</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (storefrontError || !vendor) {
    return (
      <div className="bg-light text-textc">
        <section className="section-shell pt-[140px]">
          <div className="vendor-about-card max-w-[900px]">
            <span className="filter-label">Storefront unavailable</span>
            <h3>We could not open this vendor shop.</h3>
            <p>{storefrontError || "This vendor storefront is not available right now."}</p>
            <div className="card-actions mt-6">
              <a href="/" className="btn-primary">Back to Home</a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-light text-textc">
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-6 border-b border-borderc bg-white/95 px-[5%] py-4 backdrop-blur-[16px]">
        <a href="/" className="nav-logo"><img src={siteLogo} alt="eStoreindie" className="site-logo-img" style={{height: '32px', width: 'auto'}} /></a>
        <div className="ml-auto flex items-center gap-4">
          <a href="/cart" className="nav-utility nav-icon-btn" aria-label="Cart">
            <FaShoppingCart />
            {cartCount ? <span className="ml-2 text-[0.75rem] font-bold">{cartCount}</span> : null}
          </a>

          {customerSession?.id ? (
            <>
              <a href="/profile" className="nav-utility">Profile</a>
              <button 
                type="button"
                onClick={onLogout}
                className="nav-utility"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="nav-utility">Login</a>
              <a href="/register" className="nav-utility nav-utility-accent">Register</a>
            </>
          )}
        </div>
      </div>
      <section className="vendor-hero" style={{marginTop: '60px'}}>
        <div className="vendor-hero-orb vendor-hero-orb-blue" />
        <div className="vendor-hero-orb vendor-hero-orb-orange" />
        <div className="vendor-hero-inner">
          <div className="vendor-store-row anim go">
            <div className="vendor-store-mark">{getInitials(vendorDisplayName)}</div>
            <div className="vendor-store-copy">
              <h1>{vendorDisplayName}</h1>
              <div className="vendor-meta-row">
                <span className="vendor-pill accent"><FaCheck />{formatLabel(vendor.status || "pending")} Vendor</span>
                <span className="vendor-pill blue">{vendorCategoryName}</span>
                {vendorSubcategoryName ? <span className="vendor-mini-stat"><FaStar />{vendorSubcategoryName}</span> : null}
                <span className="vendor-mini-stat"><FaStore />{storefront?.stats?.product_count || 0} products</span>
                <span className="vendor-mini-stat"><FaMapMarkerAlt />{vendor.address || "India"}</span>
              </div>
            </div>
          </div>

          <div className="vendor-tab-row anim go d2">
            {vendorTabs.map((tab) => (
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
                <h3>{vendorDisplayName} is built around {vendorSubcategoryName || vendorCategoryName} products that match this seller's registration preferences.</h3>
                <p>
                  {vendor.store_description || `${vendorDisplayName} is a live vendor storefront generated from the seller registration flow.`}
                  {" "}
                  Products below are pulled from the selected {vendorSubcategoryName ? "sub-category" : "category"} so the storefront is instantly populated after signup.
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
              {!visibleProducts.length ? (
                <div className="vendor-about-card">
                  <span className="filter-label">No products found</span>
                  <h3>No products match the current storefront filters.</h3>
                  <p>Try changing the search or filter options, or review the category and sub-category selected during vendor registration.</p>
                </div>
              ) : null}
              {visibleProducts.map((product, index) => {
                const liked = wishlist.includes(product.id);
                const cartItem = cartItems.find(item => String(item.id) === String(product.id));
                const inCart = !!cartItem;
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
                      <p className="mb-4 text-[0.88rem] leading-[1.7] text-muted">{product.description}</p>
                      <div className="rating-line">
                        <span className="rating-pill">{product.rating} ★</span>
                        <span>{product.reviews} reviews</span>
                      </div>
                      <div className="price-line">
                        <strong>{product.price}</strong>
                        <span>{product.oldPrice}</span>
                      </div>
                      <div className="card-actions">
                        {!inCart ? (
                          <>
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() =>
                                onAddToCart?.({
                                  id: product.id,
                                  title: product.title,
                                  vendor: product.vendor,
                                  vendorId: product.vendorId,
                                  vendorSlug: product.vendorSlug,
                                  productId: product.id,
                                  sku: product.sku,
                                  price: product.price,
                                  numericPrice: product.rawPrice,
                                  image: product.image,
                                  meta: product.description,
                                  category: product.filterCategory,
                                })
                              }
                            >
                              Add to Cart
                            </button>
                            <a href={`/product-details?vendor=${encodeURIComponent(product.vendorSlug)}&product=${encodeURIComponent(product.slug || product.id)}`} className="mini-link">View Details</a>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 rounded-lg border border-accent bg-accent/5 px-3 py-2">
                              <button type="button" className="text-accent hover:text-accent/80" onClick={() => onUpdateQty?.(cartItem.id, cartItem.qty - 1)}>
                                <FaMinus size={14} />
                              </button>
                              <span className="min-w-[30px] text-center font-bold text-accent">{cartItem.qty}</span>
                              <button type="button" className="text-accent hover:text-accent/80" onClick={() => onUpdateQty?.(cartItem.id, cartItem.qty + 1)}>
                                <FaPlus size={14} />
                              </button>
                            </div>
                            <button type="button" className="mini-link" onClick={() => onRemoveItem?.(cartItem.id)}>Remove</button>
                          </>
                        )}
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

function ProductListingPage({ onAddToCart, onCartClick, cartCount = 0, cartItems = [], onUpdateQty, onRemoveItem, customerSession, onLogout }) {
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
      <Header scrolled showUtilityLinks onCartClick={onCartClick} cartCount={cartCount} customerSession={customerSession} onLogout={logoutCustomerSession} />

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
                const cartItem = cartItems.find(item => String(item.id) === String(product.id));
                const inCart = !!cartItem;
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
                        {!inCart ? (
                          <>
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() =>
                                onAddToCart?.({
                                  id: product.id,
                                  title: product.title,
                                  vendor: product.vendor,
                                  vendorId: product.vendorId,
                                  vendorSlug: product.vendorSlug,
                                  productId: product.id,
                                  sku: product.sku,
                                  price: product.price,
                                  numericPrice: product.rawPrice,
                                  image: product.image,
                                  meta: product.description,
                                  category: product.filterCategory,
                                })
                              }
                            >
                              Add to Cart
                            </button>
                            <a href="/product-details" className="mini-link">View Details</a>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 rounded-lg border border-accent bg-accent/5 px-3 py-2">
                              <button type="button" className="text-accent hover:text-accent/80" onClick={() => onUpdateQty?.(cartItem.id, cartItem.qty - 1)}>
                                <FaMinus size={14} />
                              </button>
                              <span className="min-w-[30px] text-center font-bold text-accent">{cartItem.qty}</span>
                              <button type="button" className="text-accent hover:text-accent/80" onClick={() => onUpdateQty?.(cartItem.id, cartItem.qty + 1)}>
                                <FaPlus size={14} />
                              </button>
                            </div>
                            <button type="button" className="mini-link" onClick={() => onRemoveItem?.(cartItem.id)}>Remove</button>
                          </>
                        )}
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
                {items.map(({ label, href }) => (
                  <li key={label}><a href={href} className="footer-link">{label}</a></li>
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
  id: 1,
  title: "Jaipur Blue Pottery Vase Set",
  category: "Handicrafts / Home Decor",
  price: "Rs. 2,499",
  numericPrice: 2499,
  oldPrice: "Rs. 3,199",
  rating: "4.8",
  reviews: 124,
  vendor: "Priya Crafts Studio",
  vendorId: null,
  vendorSlug: null,
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
const buildVendorProductDetailData = (product, storefront) => {
  const vendor = storefront?.vendor || {};
  const vendorDisplayName = vendor.store_name || vendor.business_name || vendor.name || product.vendor_name || "Vendor Store";
  const currentPrice = Number(product.sale_price ?? product.price ?? 0);
  const originalPrice = Number(product.price ?? currentPrice);
  const image = resolveStorefrontMediaUrl(product.image_path);
  const productImages = [image, `${image}#detail-2`, `${image}#detail-3`, `${image}#detail-4`];

  return {
    id: product.id,
    slug: product.slug,
    vendorId: vendor.id,
    vendorSlug: vendor.slug,
    title: product.name,
    category: [product.category?.name, product.subcategory?.name].filter(Boolean).join(" / ") || "Vendor Collection",
    price: formatCurrency(currentPrice),
    numericPrice: currentPrice,
    oldPrice: originalPrice > currentPrice ? formatCurrency(originalPrice) : "",
    rating: product.is_featured ? "4.9" : "4.7",
    reviews: product.is_featured ? 89 : 41,
    vendor: vendorDisplayName,
    sku: product.sku || `SKU-${product.id}`,
    dispatch: Number(product.stock || 0) > 0 ? "Ships in 24-48 hours" : "Currently out of stock",
    short: product.short_description || `${product.name} is available from ${vendorDisplayName}.`,
    banner: image,
    images: productImages,
    highlights: [
      `Available from ${vendorDisplayName}`,
      product.is_featured ? "Featured on this storefront" : "Sourced from the vendor storefront catalog",
      Number(product.stock || 0) > 0 ? `${product.stock} units currently in stock` : "Stock will refresh soon",
      "Secure Razorpay checkout supported",
    ],
    specs: [
      ["Vendor", vendorDisplayName],
      ["SKU", product.sku || `SKU-${product.id}`],
      ["Category", product.category?.name || "General"],
      ["Sub-category", product.subcategory?.name || "General"],
      ["Stock", String(product.stock ?? 0)],
      ["Checkout", "Razorpay"],
    ],
    description: [
      product.short_description || `${product.name} is listed under ${vendorDisplayName}.`,
      "This product detail page is connected to the dedicated vendor storefront, so cart and checkout keep the correct vendor reference.",
      Number(product.stock || 0) > 0
        ? "Add it to cart and complete payment through Razorpay while preserving the storefront source."
        : "This item is currently unavailable for purchase, but the storefront context is still preserved.",
    ],
  };
};

function ProductDetailPage({ onAddToCart, onCartClick, cartCount = 0, cartItems = [], onUpdateQty, onRemoveItem, customerSession, onLogout }) {
  const vendorSlug = getQueryParam("vendor");
  const productSlug = getQueryParam("product");
  const [detailData, setDetailData] = useState(productDetailData);
  const [detailLoading, setDetailLoading] = useState(Boolean(vendorSlug && productSlug));
  const [detailError, setDetailError] = useState("");
  const [activeImage, setActiveImage] = useState(productDetailData.images[0]);
  const [openDetailFaq, setOpenDetailFaq] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveImage(detailData.images[0]);
  }, [detailData]);

  useEffect(() => {
    if (!vendorSlug || !productSlug) {
      setDetailLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const loadProductDetail = async () => {
      setDetailLoading(true);
      setDetailError("");

      try {
        const response = await fetch(`${SELLER_API_BASE_URL}/vendor-storefront/${vendorSlug}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.message || "Unable to load this vendor product right now.");
        }

        const matchedProduct = (payload.products || []).find((item) =>
          String(item.slug) === String(productSlug) || String(item.id) === String(productSlug)
        );

        if (!matchedProduct) {
          throw new Error("This vendor product could not be found.");
        }

        setDetailData(buildVendorProductDetailData(matchedProduct, payload));
      } catch (error) {
        if (error.name !== "AbortError") {
          setDetailError(error.message || "Unable to load this vendor product right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setDetailLoading(false);
        }
      }
    };

    loadProductDetail();

    return () => controller.abort();
  }, [productSlug, vendorSlug]);

  if (detailLoading) {
    return (
      <div className="bg-light text-textc">
        <section className="section-shell pt-[140px]">
          <div className="vendor-about-card max-w-[900px]">
            <span className="filter-label">Loading product</span>
            <h3>We are preparing the vendor product details.</h3>
            <p>The storefront context is being fetched so cart and checkout stay attached to the correct vendor.</p>
          </div>
        </section>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="bg-light text-textc">
        <section className="section-shell pt-[140px]">
          <div className="vendor-about-card max-w-[900px]">
            <span className="filter-label">Product unavailable</span>
            <h3>We could not open this product detail page.</h3>
            <p>{detailError}</p>
            <div className="card-actions mt-6">
              <a href={vendorSlug ? `/vendor-shop/${vendorSlug}` : "/products"} className="btn-primary">Back to Products</a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-light text-textc">
      <section className="section-shell pb-0 pt-6">
        <div className="detail-topbar anim go">
          {customerSession?.id ? (
            <>
              <a href="/profile" className="nav-utility">Go to Profile</a>
              <button 
                type="button"
                onClick={onLogout}
                className="nav-utility"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="nav-utility">Login</a>
              <a href="/register" className="nav-utility nav-utility-accent">Signup</a>
            </>
          )}
          <a href="/cart" className="nav-utility nav-icon-btn" aria-label="Cart" onClick={onCartClick}>
            <FaShoppingCart />
            {cartCount ? <span className="ml-2 text-[0.75rem] font-bold">{cartCount}</span> : null}
          </a>
        </div>
        <div className="detail-breadcrumbs anim go">
          <a href="/">Home</a>
          <span>/</span>
          <a href={detailData.vendorSlug ? `/vendor-shop/${detailData.vendorSlug}` : "/products"}>{detailData.vendorSlug ? "Vendor Shop" : "Products"}</a>
          <span>/</span>
          <span>{detailData.title}</span>
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="detail-layout">
          <div className="detail-gallery anim sl go">
            <div className="detail-main-image">
              <img src={activeImage} alt={detailData.title} />
            </div>
            <div className="detail-thumb-row">
              {detailData.images.map((image) => (
                <button key={image} type="button" className={`detail-thumb ${activeImage === image ? "active" : ""}`} onClick={() => setActiveImage(image)}>
                  <img src={image} alt="Product view" />
                </button>
              ))}
            </div>
          </div>

          <div className="detail-content anim sr go">
            <span className="filter-label">{detailData.category}</span>
            <h2 className="detail-title">{detailData.title}</h2>
            <p className="detail-summary">{detailData.short}</p>

            <div className="detail-rating-row">
              <span className="rating-pill">{detailData.rating} ★</span>
              <span>{detailData.reviews} verified reviews</span>
              <span>{detailData.dispatch}</span>
            </div>

            <div className="detail-price-row">
              <strong>{detailData.price}</strong>
              <span>{detailData.oldPrice}</span>
            </div>

            <div className="detail-action-card">
              <div className="detail-action-grid">
                <div>
                  <span className="detail-meta-label">Vendor</span>
                  <strong>{detailData.vendor}</strong>
                </div>
                <div>
                  <span className="detail-meta-label">SKU</span>
                  <strong>{detailData.sku}</strong>
                </div>
              </div>
              <div className="detail-cta-row">
                {(() => {
                  const cartItem = cartItems.find(item => String(item.id) === String(detailData.id || detailData.sku));
                  const inCart = !!cartItem;
                  
                  if (!inCart) {
                    return (
                      <>
                        <div className="quantity-selector">
                          <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
                          <span>{quantity}</span>
                          <button type="button" onClick={() => setQuantity((current) => current + 1)}>+</button>
                        </div>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() =>
                            onAddToCart?.({
                              id: detailData.id || detailData.sku,
                              title: detailData.title,
                              vendor: detailData.vendor,
                              vendorId: detailData.vendorId ?? null,
                              vendorSlug: detailData.vendorSlug ?? "",
                              productId: detailData.id ?? null,
                              sku: detailData.sku,
                              price: detailData.price,
                              numericPrice: detailData.numericPrice ?? (Number(String(detailData.price || 0).replace(/[^\d.]/g, "")) || 0),
                              image: activeImage,
                              meta: detailData.category,
                              category: detailData.category,
                            }, quantity)
                          }
                        >
                          Add {quantity} to Cart
                        </button>
                        <a href="#contact-form" className="btn-outline">Enquire Now</a>
                      </>
                    );
                  }
                  
                  return (
                    <>
                      <div className="flex items-center gap-3 rounded-lg border border-accent bg-accent/5 px-4 py-3">
                        <button type="button" className="text-accent hover:text-accent/80 font-bold" onClick={() => onUpdateQty?.(cartItem.id, cartItem.qty - 1)}>
                          <FaMinus size={18} />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-muted">Quantity</span>
                          <span className="text-2xl font-bold text-accent">{cartItem.qty}</span>
                        </div>
                        <button type="button" className="text-accent hover:text-accent/80 font-bold" onClick={() => onUpdateQty?.(cartItem.id, cartItem.qty + 1)}>
                          <FaPlus size={18} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => onRemoveItem?.(cartItem.id)}
                      >
                        Remove from Cart
                      </button>
                      <a href="#contact-form" className="btn-outline">Enquire Now</a>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="detail-panel">
                <h3>Highlights</h3>
                <ul>
                  {detailData.highlights.map((item) => (
                    <li key={item}><FaCheck className="text-accent" />{item}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-panel">
                <h3>Specifications</h3>
                <div className="spec-grid">
                  {detailData.specs.map(([label, value]) => (
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
                {detailData.description.map((para) => (
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

function AboutPage({ onCartClick, cartCount = 0, customerSession, onLogout }) {
  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks onCartClick={onCartClick} cartCount={cartCount} customerSession={customerSession} onLogout={onLogout} />

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
          {footerLinks.map(([title, items], index) => (<div key={title} className={`anim d${index + 1}`}><h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5><ul className="flex flex-col gap-[11px]">{items.map(({ label, href }) => (<li key={label}><a href={href} className="footer-link">{label}</a></li>))}</ul></div>))}
        </div>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 border-t border-borderc pt-7"><p className="text-[0.82rem] text-muted">© 2025 eStoreindie. All rights reserved. Made with love in India.</p><p className="text-[0.82rem] text-muted">Designed for <a href="#" className="text-accent2 no-underline">Bharat's Entrepreneurs</a></p></div>
      </footer>
    </div>
  );
}

function ContactPage({ onCartClick, cartCount = 0, customerSession, onLogout }) {
  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks onCartClick={onCartClick} cartCount={cartCount} customerSession={customerSession} onLogout={onLogout} />

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
          {footerLinks.map(([title, items], index) => (<div key={title} className={`anim d${index + 1}`}><h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5><ul className="flex flex-col gap-[11px]">{items.map(({ label, href }) => (<li key={label}><a href={href} className="footer-link">{label}</a></li>))}</ul></div>))}
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

const policyPageContent = {
  "/terms-conditions": {
    eyebrow: "Terms & Conditions",
    title: "Marketplace terms that set clear expectations for buyers, sellers, and platform use.",
    description: "These terms explain how eStoreindie storefront access, orders, account use, and marketplace responsibilities are handled across the platform.",
    sections: [
      {
        heading: "Platform Use",
        points: [
          "Users must provide accurate account, contact, and order information while using the marketplace.",
          "Any misuse of the website, including fraud, scraping, abuse, or disruption of platform services, may lead to suspension or permanent access removal.",
          "Product availability, pricing, and promotional offers may change without prior notice.",
        ],
      },
      {
        heading: "Orders and Payments",
        points: [
          "Orders are confirmed only after payment authorization or successful placement of a valid cash-on-delivery request, where available.",
          "eStoreindie may cancel or hold orders that appear fraudulent, incomplete, or outside serviceable delivery limits.",
          "Customers are responsible for reviewing product details, pricing, shipping timelines, and seller information before confirming checkout.",
        ],
      },
      {
        heading: "Seller Responsibilities",
        points: [
          "Sellers must list products honestly, including correct descriptions, pricing, stock details, and dispatch expectations.",
          "The platform may moderate, pause, or remove listings that violate category standards, legal rules, or marketplace quality expectations.",
          "Repeated order issues, policy violations, or customer complaints may affect seller visibility or account standing.",
        ],
      },
      {
        heading: "Liability and Policy Updates",
        points: [
          "The marketplace works to maintain accurate content and reliable service, but uninterrupted access and error-free performance cannot be guaranteed at all times.",
          "eStoreindie is not responsible for losses caused by third-party logistics delays, payment gateway outages, or inaccurate information supplied by users or sellers.",
          "These terms may be updated periodically, and continued use of the website means you accept the latest published version.",
        ],
      },
    ],
  },
  "/privacy-policy": {
    eyebrow: "Privacy Policy",
    title: "How customer, seller, and visitor information is collected, used, and protected.",
    description: "This policy outlines what personal data eStoreindie may collect, why it is needed, and how it is handled across browsing, account creation, and checkout activity.",
    sections: [
      {
        heading: "Information We Collect",
        points: [
          "We may collect names, email addresses, phone numbers, delivery addresses, and account details when users register, place orders, or contact support.",
          "Technical information such as browser type, device data, IP address, and usage activity may be collected to improve reliability and security.",
          "Seller onboarding may require business details, bank information, tax identifiers, and store profile content for verification purposes.",
        ],
      },
      {
        heading: "How Information Is Used",
        points: [
          "Personal information is used to manage accounts, process orders, coordinate delivery, provide support, and improve the customer experience.",
          "Seller information is used for onboarding review, payment processing, storefront setup, and marketplace compliance checks.",
          "Platform analytics may be used to understand traffic, product interest, and operational performance trends.",
        ],
      },
      {
        heading: "Sharing and Security",
        points: [
          "Relevant information may be shared with payment processors, shipping partners, and service providers only when needed to fulfill marketplace operations.",
          "We do not sell personal information to unrelated third parties for external marketing use.",
          "Reasonable technical and administrative safeguards are used to protect stored data, though no digital system can guarantee absolute security.",
        ],
      },
      {
        heading: "User Choices",
        points: [
          "Users may request profile updates or correction of inaccurate personal information by contacting platform support.",
          "Marketing messages, where enabled, can be limited or opted out of according to the communication method used.",
          "Continued use of the site after policy updates means the revised privacy practices are accepted.",
        ],
      },
    ],
  },
  "/refund-policy": {
    eyebrow: "Refund Policy",
    title: "A simple refund framework for cancelled, returned, damaged, or unavailable orders.",
    description: "This policy explains when refunds may be issued, how requests are reviewed, and the usual timelines customers can expect after approval.",
    sections: [
      {
        heading: "Eligible Refund Situations",
        points: [
          "Refunds may be considered when an order is cancelled before shipment, arrives damaged, is materially different from the listing, or cannot be fulfilled.",
          "Requests may be declined for products that show clear signs of misuse, intentional damage, or return-condition violations.",
          "Some product categories may follow additional seller-specific conditions where hygiene, perishability, or customization limits apply.",
        ],
      },
      {
        heading: "Request and Review Process",
        points: [
          "Customers should raise refund or return concerns as soon as possible after delivery, ideally with order details and supporting photos when relevant.",
          "The platform or seller may review the request before approving a refund, replacement, or another resolution option.",
          "Incomplete claims or requests raised after the allowed review window may take longer to assess or may be declined.",
        ],
      },
      {
        heading: "Refund Timelines",
        points: [
          "Approved refunds are usually sent back to the original payment method within 5 to 10 business days, depending on banking and payment partner processing.",
          "Cash-on-delivery refunds, if supported, may require additional verification of account details before release.",
          "Shipping fees or platform charges may be non-refundable in cases where the return reason is not caused by seller or platform error.",
        ],
      },
      {
        heading: "Support Escalation",
        points: [
          "If a customer and seller are unable to resolve a return or refund issue directly, eStoreindie support may review the case and guide the next step.",
          "Repeated refund abuse, false claims, or policy manipulation may lead to restricted account activity.",
          "For help with a live order issue, users should contact support through the website contact page before initiating chargebacks whenever possible.",
        ],
      },
    ],
  },
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

function Header({ scrolled = false, showUtilityLinks = false, showHomeCta = false, cartCount = 0, onCartClick, customerSession, onLogout }) {
  // Show logout button when user is logged in, otherwise show login + register
  const isLoggedIn = !!customerSession?.id;

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
          <a href="/cart" className="nav-utility nav-icon-btn" aria-label="Cart" onClick={onCartClick}>
            <FaShoppingCart />
            {cartCount ? <span className="ml-2 text-[0.75rem] font-bold">{cartCount}</span> : null}
          </a>
        ) : null}
        
        {showUtilityLinks && isLoggedIn ? (
          <>
            <a href="/profile" className="nav-utility">Profile</a>
            <button 
              type="button"
              onClick={onLogout}
              className="nav-utility"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Logout
            </button>
          </>
        ) : null}
        
        {showUtilityLinks && !isLoggedIn ? (
          <>
            <a href="/login" className="nav-utility">Login</a>
            <a href="/register" className="nav-utility nav-utility-accent">Register</a>
          </>
        ) : null}
        
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

function PolicyPage({ policy }) {
  return (
    <div className="bg-light text-textc">
      <InnerPageHero
        eyebrow={policy.eyebrow}
        title={policy.title}
        description={policy.description}
        primaryAction={{ href: "/contact", label: "Contact Support" }}
        secondaryAction={{ href: "/products", label: "Browse Products" }}
        tone="warm"
      />

      <section className="section-shell pt-0">
        <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="detail-panel anim sl go">
            <h3>Quick Notes</h3>
            <ul>
              <li><FaCheck className="text-accent" />Applies to customer and seller activity on eStoreindie.</li>
              <li><FaCheck className="text-accent" />Please review the full policy before placing orders or publishing products.</li>
              <li><FaCheck className="text-accent" />For order-specific help, use the contact page for support escalation.</li>
            </ul>
            <div className="mt-6 rounded-[22px] bg-light p-5">
              <strong className="block text-[1rem] text-primary">Related Policies</strong>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="/terms-conditions" className="nav-utility">Terms</a>
                <a href="/privacy-policy" className="nav-utility">Privacy</a>
                <a href="/refund-policy" className="nav-utility">Refunds</a>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {policy.sections.map((section, index) => (
              <article key={section.heading} className={`detail-panel anim sr go d${Math.min(index + 1, 4)}`}>
                <h3>{section.heading}</h3>
                <div className="mt-5 space-y-4">
                  {section.points.map((point) => (
                    <div key={point} className="flex items-start gap-3 text-[0.95rem] leading-[1.8] text-muted">
                      <span className="mt-1 text-accent"><FaCheck /></span>
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
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
                {items.map(({ label, href }) => (
                  <li key={label}><a href={href} className="footer-link">{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 border-t border-borderc pt-7">
          <p className="text-[0.82rem] text-muted">© 2025 eStoreindie. All rights reserved. Made with love in India.</p>
          <p className="text-[0.82rem] text-muted">Designed for <a href="/" className="text-accent2 no-underline">Bharat's Entrepreneurs</a></p>
        </div>
      </footer>
    </div>
  );
}


function ProfilePage() {
  const [customerSession, setCustomerSession] = useState(() => getStoredCustomerSession());
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const handleLogout = () => {
    clearCustomerSession();
    setCustomerSession(null);
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  };

  useEffect(() => {
    if (!customerSession?.id) {
      setOrdersLoading(false);
      return;
    }

    const fetchUserOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        // Debug: check if token exists
        if (!customerSession?.token) {
          console.error("No token found in customer session:", customerSession);
          setOrdersError("Authentication token not found. Please log in again.");
          setOrdersLoading(false);
          return;
        }

        const response = await fetch(`${SELLER_API_BASE_URL}/checkout/orders/user`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${customerSession.token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          console.error("API error response:", response.status, data);
          throw new Error(data.message || `Failed to fetch orders (${response.status})`);
        }

        setUserOrders(data.orders || []);
      } catch (error) {
        setOrdersError(error.message || "Unable to fetch orders");
        setUserOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchUserOrders();
  }, [customerSession?.id]);

  if (!customerSession) {
    return (
      <div className="bg-light text-textc">
        <InnerPageHero
          eyebrow="My Profile"
          title="Sign in to view your account, addresses, and order history."
          description="Customer account access lives on the frontend buyer flow only. Admin and vendor panels stay separate."
          primaryAction={{ href: "/login", label: "Login as Customer" }}
          secondaryAction={{ href: "/register", label: "Create Account" }}
          showTopline={false}
        />

        <section className="profile-shell">
          <div className="profile-bg-orb profile-bg-orb-one" />
          <div className="profile-bg-orb profile-bg-orb-two" />
          <div className="mx-auto max-w-[980px]">
            <div className="profile-panel anim go">
              <div className="profile-panel-head">
                <div>
                  <span className="section-label !mb-3">Customer Access Required</span>
                  <h3>Login to continue to your buyer account</h3>
                </div>
              </div>
              <p className="section-sub max-w-[720px]">
                Use the customer login/register pages on the frontend to access your shopping profile.
                Admin and vendor accounts are intentionally blocked from this user flow.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const memberSince = customerSession.created_at
    ? new Date(customerSession.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently joined";
  const locationLabel = [customerSession.city, customerSession.address].filter(Boolean).join(", ");

  // Dynamic profile stats based on orders
  const totalOrders = userOrders.length;
  const inTransitOrders = userOrders.filter(o => o.fulfillment_status === "shipped" || o.fulfillment_status === "processing").length;
  const lifetimeSpend = userOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const dynamicProfileStats = [
    { icon: FaBoxOpen, value: String(totalOrders), label: "Total orders", note: "From all marketplace vendors" },
    { icon: FaTruck, value: String(inTransitOrders), label: "In transit", note: "On their way to you" },
    { icon: FaRupeeSign, value: formatCurrency(lifetimeSpend), label: "Lifetime spend", note: "Purchases from verified sellers" },
  ];

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
              <h1>{customerSession.name}</h1>
              <p>Buyer account for tracking orders, saving addresses, and managing purchase details across the marketplace.</p>

              <div className="profile-user-meta">
                <div><FaEnvelope /><span>{customerSession.email}</span></div>
                <div><FaPhoneAlt /><span>{customerSession.phone || "Not added yet"}</span></div>
                <div><FaMapMarkerAlt /><span>{locationLabel || "Address not added yet"}</span></div>
              </div>

              <button type="button" onClick={handleLogout} className="btn-primary profile-action-btn"><FaEdit />Logout</button>
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
                {dynamicProfileStats.map(({ icon: Icon, value, label, note }) => (
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
                    <strong>{customerSession.name}</strong>
                  </div>
                  <div className="profile-detail-item">
                    <span>Member since</span>
                    <strong>{memberSince}</strong>
                  </div>
                  <div className="profile-detail-item">
                    <span>Email address</span>
                    <strong>{customerSession.email}</strong>
                  </div>
                  <div className="profile-detail-item">
                    <span>Account status</span>
                    <strong>{formatLabel(customerSession.status || "active")}</strong>
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
                  <div className="profile-address-card">
                    <span>Primary address</span>
                    <strong>{customerSession.name}</strong>
                    <p>{customerSession.address || "Address not added yet"}</p>
                    <p>{customerSession.city || "City not added yet"}</p>
                    <small>{customerSession.phone || "Phone not added yet"}</small>
                  </div>
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
                {ordersLoading ? (
                  <div className="rounded-[22px] bg-light p-6">
                    <p className="text-muted">Loading your orders...</p>
                  </div>
                ) : ordersError ? (
                  <div className="rounded-[22px] bg-light p-6">
                    <p className="text-red-600">{ordersError}</p>
                  </div>
                ) : !userOrders.length ? (
                  <div className="rounded-[22px] bg-light p-6">
                    <strong className="block text-[1rem] text-primary">No orders yet</strong>
                    <p className="mt-2 text-[0.9rem] text-muted">Start shopping to place your first order.</p>
                  </div>
                ) : (
                  userOrders.map((order) => (
                    <article key={order.id} className="profile-order-card">
                      <div className="profile-order-main">
                        <div className="profile-order-topline">
                          <span>Order {order.order_number}</span>
                          <strong>{formatCurrency(order.total_amount)}</strong>
                        </div>
                        <h4>{order.items?.[0]?.product_name || "Marketplace Order"}</h4>
                        <p>{order.vendor?.store_name || order.vendor?.business_name || "Unknown Vendor"}</p>
                      </div>

                      <div className="profile-order-meta">
                        <div><FaCalendarAlt /><span>{order.placed_at ? new Date(order.placed_at).toLocaleDateString("en-IN") : "N/A"}</span></div>
                        <div><FaClock /><span>{order.fulfillment_status || "Processing"}</span></div>
                        <div><FaCreditCard /><span>{order.payment_gateway === "razorpay" ? "Razorpay" : order.payment_method || "Online"}</span></div>
                      </div>

                      <div className={`profile-order-status ${(order.fulfillment_status || "pending").toLowerCase()}`}>
                        {order.payment_status === "paid" ? "Confirmed" : order.payment_status || "Pending"}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlogPage({ onCartClick, cartCount = 0, customerSession, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch posts
      const postsResponse = await fetch(`${API_BASE_URL}/blog/posts`);
      if (!postsResponse.ok) throw new Error("Failed to load posts");
      const postsData = await postsResponse.json();
      const allPosts = (postsData.data || postsData).map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.name,
        tag: post.categories?.[0]?.name || "General",
        excerpt: post.description?.substring(0, 150) + "..." || "No description",
        author: "eStoreindie Team",
        date: new Date(post.created_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        image: post.image
          ? `${API_BASE_URL.replace("/api", "")}/image/blog/${post.image}`
          : "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=80",
        categories: post.categories || [],
      }));
      setPosts(allPosts);

      // Fetch categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/blog/categories`);
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        const allCategories = categoriesData.data || categoriesData;
        setCategories(allCategories);
      }
    } catch (err) {
      console.error("Error loading blog data:", err);
      setError(err.message || "Failed to load blog data");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPosts = () => {
    if (activeCategory === "All Posts") return posts;
    return posts.filter((post) =>
      post.categories?.some((cat) => cat.name === activeCategory || cat.id === parseInt(activeCategory))
    );
  };

  const filteredPosts = getFilteredPosts();
  const featuredPost = posts[0];

  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks onCartClick={onCartClick} cartCount={cartCount} customerSession={customerSession} onLogout={onLogout} />

      <section className="blog-page-hero section-shell pt-[120px]">
        <div className="blog-page-grid">
          <div className="anim go">
            <span className="section-label">Marketplace Journal</span>
            <h1 className="section-title !text-[clamp(2.5rem,4.4vw,4.2rem)]">Insights for Sellers, Buyers, and Marketplace Builders</h1>
            <p className="section-sub max-w-[700px]">Stories, strategies, and practical guidance on product presentation, seller growth, trust systems, design, and marketplace performance.</p>
          </div>
          {featuredPost && (
            <a href={`/blog-details/${featuredPost.slug}`} className="featured-blog-card anim sc go d2">
              <img src={featuredPost.image} alt={featuredPost.title} />
              <div className="featured-blog-overlay">
                <span className="blog-tag">Featured Story</span>
                <h3>{featuredPost.title}</h3>
                <p>{featuredPost.excerpt}</p>
              </div>
            </a>
          )}
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto max-w-[1480px]">
          {error && <p className="text-[#d64545] mb-4">{error}</p>}
          {loading ? (
            <p className="text-center text-muted">Loading blog posts...</p>
          ) : (
            <>
              <div className="blog-chip-row">
                <button
                  type="button"
                  onClick={() => setActiveCategory("All Posts")}
                  className={`product-chip ${activeCategory === "All Posts" ? "active" : ""}`}
                >
                  All Posts
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.name)}
                    className={`product-chip ${activeCategory === cat.name ? "active" : ""}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="blogs-grid mt-10">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <article key={post.slug} className={`blog-card anim d${(index % 4) + 1}`}>
                      <div className="h-[240px] overflow-hidden">
                        <img src={post.image} alt={post.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                      </div>
                      <div className="p-[26px]">
                        <span className="blog-tag">{post.tag}</span>
                        <h3 className="mb-3 font-display text-[1.2rem] leading-[1.4] text-primary">{post.title}</h3>
                        <p className="mb-5 text-[0.88rem] leading-[1.7] text-muted">{post.excerpt}</p>
                        <div className="flex items-center justify-between gap-4 text-[0.8rem] text-muted">
                          <span>{post.author}</span>
                          <span>{post.date}</span>
                        </div>
                        <a href={`/blog-details/${post.slug}`} className="mini-link mt-4 inline-flex">
                          Read Article
                        </a>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-center text-muted col-span-full py-10">No posts found in this category</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="border-t border-borderc bg-white/95 px-[5%] pb-8 pt-20 text-textc backdrop-blur-[16px]">
        <div className="mx-auto mb-14 grid max-w-screen-xl gap-[52px] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <FooterBrand />
          {footerLinks.map(([title, items], index) => (
            <div key={title} className={`anim d${index + 1}`}>
              <h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5>
              <ul className="flex flex-col gap-[11px]">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="footer-link">
                      {label}
                    </a>
                  </li>
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

function BlogDetailPage({ onCartClick, cartCount = 0, customerSession, onLogout }) {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const blogSlug = getBlogPostSlugFromPath();
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    loadBlogPost();
  }, [blogSlug]);

  const loadBlogPost = async () => {
    if (!blogSlug) {
      setError("Blog post not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Fetch all posts
      const postsResponse = await fetch(`${API_BASE_URL}/blog/posts`);
      if (!postsResponse.ok) throw new Error("Failed to load posts");
      const postsData = await postsResponse.json();
      const allPosts = postsData.data || postsData;

      // Find the post by slug
      const foundPost = allPosts.find((p) => p.slug === blogSlug);
      if (!foundPost) {
        setError("Blog post not found");
        setLoading(false);
        return;
      }

      // Format the post
      const formattedPost = {
        id: foundPost.id,
        title: foundPost.name,
        slug: foundPost.slug,
        description: foundPost.description,
        tag: foundPost.categories?.[0]?.name || "General",
        image: foundPost.image
          ? `${API_BASE_URL.replace("/api", "")}/image/blog/${foundPost.image}`
          : "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&auto=format&fit=crop&q=80",
        author: "eStoreindie Team",
        date: new Date(foundPost.created_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        categories: foundPost.categories || [],
      };

      setPost(formattedPost);

      // Get related posts (same category or first 3 other posts)
      const related = allPosts
        .filter((p) => p.id !== foundPost.id)
        .slice(0, 3)
        .map((p) => ({
          id: p.id,
          title: p.name,
          slug: p.slug,
          excerpt: p.description?.substring(0, 100) + "..." || "No description",
          tag: p.categories?.[0]?.name || "General",
          image: p.image
            ? `${API_BASE_URL.replace("/api", "")}/image/blog/${p.image}`
            : "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80",
        }));
      setRelatedPosts(related);
    } catch (err) {
      console.error("Error loading blog post:", err);
      setError(err.message || "Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-light text-textc min-h-screen">
        <Header scrolled showUtilityLinks onCartClick={onCartClick} cartCount={cartCount} customerSession={customerSession} onLogout={onLogout} />
        <section className="section-shell pt-[120px]">
          <p className="text-center text-muted">Loading blog post...</p>
        </section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-light text-textc min-h-screen">
        <Header scrolled showUtilityLinks onCartClick={onCartClick} cartCount={cartCount} customerSession={customerSession} onLogout={onLogout} />
        <section className="section-shell pt-[120px]">
          <p className="text-center text-[#d64545]">{error}</p>
          <div className="text-center mt-6">
            <a href="/blog" className="text-accent hover:underline">← Back to Blog</a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-light text-textc">
      <Header scrolled showUtilityLinks onCartClick={onCartClick} cartCount={cartCount} customerSession={customerSession} onLogout={onLogout} />

      <section className="section-shell pt-[120px] pb-0">
        <div className="detail-breadcrumbs anim go">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/blog">Blog</a>
          <span>/</span>
          <span>{post.title}</span>
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="blog-detail-shell">
          <div className="blog-detail-main anim go">
            <span className="blog-tag">{post.tag}</span>
            <h1 className="blog-detail-title">{post.title}</h1>
            <div className="blog-detail-meta">
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
            <div className="blog-detail-image">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="blog-detail-content">
              {post.description && (
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: post.description }}
                    className="text-base leading-relaxed space-y-4"
                  />
                </div>
              )}
            </div>
          </div>
          <aside className="blog-detail-side anim sr go">
            <div className="detail-panel">
              <h3>About This Post</h3>
              <ul>
                {post.categories?.map((cat) => (
                  <li key={cat.id}>
                    <FaCheck className="text-accent" />
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
            {relatedPosts.length > 0 && (
              <div className="detail-panel mt-6">
                <h3>More Reads</h3>
                <div className="space-y-4">
                  {relatedPosts.map((p) => (
                    <a key={p.slug} href={`/blog-details/${p.slug}`} className="mini-link block hover:text-accent">
                      {p.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="section-shell bg-white">
          <div className="mx-auto max-w-[1480px]">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="section-label">Related Posts</span>
                <h2 className="section-title mb-0">Continue Reading</h2>
              </div>
            </div>
            <div className="blogs-grid">
              {relatedPosts.map((relPost, index) => (
                <article key={relPost.slug} className={`blog-card anim d${index + 1}`}>
                  <div className="h-[220px] overflow-hidden">
                    <img src={relPost.image} alt={relPost.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                  </div>
                  <div className="p-[26px]">
                    <span className="blog-tag">{relPost.tag}</span>
                    <h3 className="mb-3 font-display text-[1.12rem] leading-[1.4] text-primary">{relPost.title}</h3>
                    <p className="mb-4 text-[0.86rem] leading-[1.7] text-muted">{relPost.excerpt}</p>
                    <a href={`/blog-details/${relPost.slug}`} className="mini-link">
                      Read Article
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-borderc bg-white/95 px-[5%] pb-8 pt-20 text-textc backdrop-blur-[16px]">
        <div className="mx-auto mb-14 grid max-w-screen-xl gap-[52px] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <FooterBrand />
          {footerLinks.map(([title, items], index) => (
            <div key={title} className={`anim d${index + 1}`}>
              <h5 className="mb-5 text-[0.78rem] font-bold uppercase tracking-[2px] text-primary">{title}</h5>
              <ul className="flex flex-col gap-[11px]">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="footer-link">
                      {label}
                    </a>
                  </li>
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
function CheckoutPage({ cartItems, customerSession, onCartClick, onOrderPlaced }) {
  const checkoutItems = cartItems;
  const [couponCode, setCouponCode] = useState("SAVE10");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placed, setPlaced] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerForm, setCustomerForm] = useState(() => ({
    fullName: customerSession?.name || "",
    phone: customerSession?.phone || "",
    email: customerSession?.email || "",
    city: customerSession?.city || "",
    state: "",
    pincode: "",
    address: customerSession?.address || "",
  }));
  const { subtotal, delivery, discount, taxes, total, appliedCoupon } = calculateCheckoutTotals(checkoutItems, couponCode);
  const vendorName = checkoutItems[0]?.vendor || "Vendor Store";

  useEffect(() => {
    setCustomerForm((current) => ({
      ...current,
      fullName: customerSession?.name || current.fullName,
      phone: customerSession?.phone || current.phone,
      email: customerSession?.email || current.email,
      city: customerSession?.city || current.city,
      address: customerSession?.address || current.address,
    }));
  }, [customerSession]);

  const updateCustomerField = (field, value) => {
    setCustomerForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!customerSession?.id) {
      setCheckoutError("Please login before continuing to Razorpay checkout.");
      return;
    }

    if (!checkoutItems.length) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    if (!checkoutItems.every((item) => item.vendorId && String(item.vendorId) === String(checkoutItems[0]?.vendorId))) {
      setCheckoutError("Checkout requires all cart items to belong to the same vendor storefront.");
      return;
    }

    setCheckoutError("");
    setIsSubmitting(true);

    try {
      const Razorpay = await loadRazorpayScript();
      const createOrderResponse = await fetch(`${SELLER_API_BASE_URL}/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: customerSession.id,
          coupon_code: couponCode,
          payment_method: paymentMethod,
          customer: {
            name: customerForm.fullName,
            email: customerForm.email,
            phone: customerForm.phone,
            city: customerForm.city,
            state: customerForm.state,
            pincode: customerForm.pincode,
            address: customerForm.address,
          },
          items: checkoutItems.map((item) => ({
            vendor_id: item.vendorId,
            vendor_slug: item.vendorSlug,
            product_id: item.productId,
            title: item.title,
            sku: item.sku,
            quantity: item.qty,
            unit_price: item.numericPrice,
            image: item.image,
            meta: item.meta,
          })),
        }),
      });

      const createOrderPayload = await createOrderResponse.json().catch(() => ({}));

      if (!createOrderResponse.ok) {
        throw new Error(createOrderPayload.details || createOrderPayload.message || "Unable to start Razorpay checkout right now.");
      }

      const razorpay = new Razorpay({
        key: createOrderPayload.razorpay.key,
        amount: createOrderPayload.razorpay.amount,
        currency: createOrderPayload.razorpay.currency,
        name: createOrderPayload.razorpay.name,
        description: createOrderPayload.razorpay.description,
        order_id: createOrderPayload.razorpay.order_id,
        prefill: createOrderPayload.razorpay.prefill,
        notes: createOrderPayload.razorpay.notes,
        theme: {
          color: "#e85d2f",
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${SELLER_API_BASE_URL}/checkout/orders/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                order_id: createOrderPayload.order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyPayload = await verifyResponse.json().catch(() => ({}));

            if (!verifyResponse.ok) {
              throw new Error(verifyPayload.message || "Payment verification failed.");
            }

            setOrderSummary(verifyPayload.order);
            setPlaced(true);
            onOrderPlaced?.();
          } catch (error) {
            setCheckoutError(error.message || "Payment verification failed.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      });

      razorpay.open();
    } catch (error) {
      setCheckoutError(error.message || "Unable to start Razorpay checkout right now.");
      setIsSubmitting(false);
    }
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
            <p className="section-sub max-w-[760px]">This flow now creates a real Razorpay order while keeping the dedicated vendor reference from the storefront through payment confirmation.</p>
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
                      <input type="text" value={customerForm.fullName} onChange={(event) => updateCustomerField("fullName", event.target.value)} placeholder="Enter full name" required />
                    </label>
                    <label className="checkout-field">
                      <span>Phone Number</span>
                      <input type="tel" value={customerForm.phone} onChange={(event) => updateCustomerField("phone", event.target.value)} placeholder="+91 98765 43210" required />
                    </label>
                    <label className="checkout-field">
                      <span>Email Address</span>
                      <input type="email" value={customerForm.email} onChange={(event) => updateCustomerField("email", event.target.value)} placeholder="you@example.com" required />
                    </label>
                    <label className="checkout-field">
                      <span>City</span>
                      <input type="text" value={customerForm.city} onChange={(event) => updateCustomerField("city", event.target.value)} placeholder="Jaipur" required />
                    </label>
                    <label className="checkout-field">
                      <span>State</span>
                      <input type="text" value={customerForm.state} onChange={(event) => updateCustomerField("state", event.target.value)} placeholder="Rajasthan" required />
                    </label>
                    <label className="checkout-field">
                      <span>Pincode</span>
                      <input type="text" value={customerForm.pincode} onChange={(event) => updateCustomerField("pincode", event.target.value)} placeholder="302001" required />
                    </label>
                    <label className="checkout-field checkout-field-wide">
                      <span>Full Address</span>
                      <textarea value={customerForm.address} onChange={(event) => updateCustomerField("address", event.target.value)} placeholder="House no, street, landmark, area" required />
                    </label>
                  </div>
                </div>

                <div className="checkout-panel anim go d2">
                  <h3>Coupon & Offers</h3>
                  <div className="checkout-coupon-row">
                    <input type="text" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" />
                    <button type="button" className="nav-utility nav-utility-accent">{appliedCoupon ? "Applied" : "Apply"}</button>
                  </div>
                  <div className="checkout-meta-list mt-4">
                    <div><FaCheck className="text-accent" /><span>`SAVE10` gives 10% off up to Rs. 350 on vendor storefront orders.</span></div>
                    <div><FaCheck className="text-accent" /><span>Free buyer protection included on all eligible items.</span></div>
                  </div>
                </div>

                <div className="checkout-panel anim go d3">
                  <h3>Payment Method</h3>
                  <div className="checkout-payment-list">
                    {[
                      ["upi", "UPI / Wallet", "Handled through Razorpay for fast mobile checkout"],
                      ["card", "Credit / Debit Card", "Visa, Mastercard, and RuPay via Razorpay"],
                      ["netbanking", "Net Banking", "Pay directly from your bank with Razorpay"],
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
                  <div className="mb-4 rounded-[20px] bg-light p-4 text-[0.92rem] text-muted">
                    Buying from <strong className="text-primary">{vendorName}</strong>.
                  </div>
                  <div className="space-y-4">
                    {checkoutItems.map((item) => (
                      <div key={item.id || item.title} className="checkout-order-item">
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.vendor}</span>
                          <p>Qty: {item.qty}</p>
                        </div>
                        <strong>{formatCurrency(item.numericPrice * item.qty)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="checkout-panel anim sr go d2">
                  <h3>Price Details</h3>
                  <div className="space-y-4 text-[0.93rem] text-muted">
                    <div className="flex items-center justify-between"><span>Subtotal</span><strong className="text-primary">{formatCurrency(subtotal)}</strong></div>
                    <div className="flex items-center justify-between"><span>Delivery</span><strong className="text-primary">{formatCurrency(delivery)}</strong></div>
                    <div className="flex items-center justify-between"><span>Coupon Discount</span><strong className="text-green-600">- {formatCurrency(discount)}</strong></div>
                    <div className="flex items-center justify-between"><span>Taxes</span><strong className="text-primary">{formatCurrency(taxes)}</strong></div>
                    <div className="checkout-total-row"><span>Total Payable</span><strong>{formatCurrency(total)}</strong></div>
                  </div>
                  <div className="checkout-meta-list mt-6">
                    <div><FaShieldAlt className="text-accent" /><span>Secure encrypted Razorpay payment flow</span></div>
                    <div><FaTruck className="text-accent" /><span>Estimated delivery in 3-5 business days</span></div>
                    <div><FaRupeeSign className="text-accent" /><span>Vendor reference is stored with the order for payout clarity</span></div>
                  </div>
                  {checkoutError ? <p className="mt-4 text-sm text-red-600">{checkoutError}</p> : null}
                  <button type="submit" className="btn-primary checkout-submit" disabled={isSubmitting || !checkoutItems.length}>
                    {isSubmitting ? "Opening Razorpay..." : "Pay with Razorpay"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="checkout-success anim sc go">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[rgba(232,93,47,0.12)] text-[1.5rem] text-accent">
                <FaCheck />
              </div>
              <h2>Order placed successfully</h2>
              <p>Your payment has been verified and the order is now linked to the vendor storefront for fulfillment and payout tracking.</p>
              {orderSummary ? (
                <div className="mt-6 rounded-[24px] bg-white p-6 text-left shadow-[0_24px_60px_rgba(16,24,40,0.08)]">
                  <p><strong>Order Number:</strong> {orderSummary.order_number}</p>
                  <p><strong>Vendor:</strong> {orderSummary.vendor?.store_name || orderSummary.vendor?.business_name || orderSummary.vendor?.name}</p>
                  <p><strong>Total Paid:</strong> {formatCurrency(orderSummary.total_amount)}</p>
                </div>
              ) : null}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="/products" className="btn-primary">Continue Shopping</a>
                <a href="/cart" className="nav-utility" onClick={onCartClick}>Back to Cart</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function CartPage({ cartItems, cartNotice = "", onCartClick, onUpdateQty, onRemoveItem, customerSession, onLogout }) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.numericPrice * item.qty), 0);
  const delivery = cartItems.length ? 120 : 0;
  const taxes = Math.max(subtotal, 0) * 0.18;
  const total = subtotal + delivery + taxes;

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
                {cartNotice ? (
                  <div className="rounded-[22px] border border-[rgba(232,93,47,0.25)] bg-[rgba(232,93,47,0.08)] p-5 text-[0.92rem] text-primary">
                    {cartNotice}
                  </div>
                ) : null}
                {!cartItems.length ? (
                  <div className="rounded-[22px] bg-light p-6">
                    <strong className="block text-[1rem] text-primary">Your cart is empty</strong>
                    <p className="mt-2 text-[0.9rem] text-muted">Add products from the marketplace and they will appear here instantly.</p>
                  </div>
                ) : null}
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded-[22px] bg-light p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <strong className="block text-[1rem] text-primary">{item.title}</strong>
                        <span className="mt-1 block text-[0.85rem] text-muted">{item.vendor}</span>
                        <p className="mt-2 text-[0.88rem] text-muted">{item.meta}</p>
                        <div className="mt-4 flex items-center gap-3">
                          <button type="button" className="nav-utility" onClick={() => onUpdateQty(item.id, item.qty - 1)}>-</button>
                          <strong>{item.qty}</strong>
                          <button type="button" className="nav-utility" onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                          <button type="button" className="mini-link" onClick={() => onRemoveItem(item.id)}>Remove</button>
                        </div>
                      </div>
                      <strong className="font-display text-[1.35rem] text-primary">{formatCurrency(item.numericPrice * item.qty)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-panel anim sr go">
              <h3>Order Summary</h3>
              <div className="space-y-4 text-[0.92rem] text-muted">
                <div className="flex items-center justify-between"><span>Subtotal</span><strong className="text-primary">{formatCurrency(subtotal)}</strong></div>
                <div className="flex items-center justify-between"><span>Delivery</span><strong className="text-primary">{formatCurrency(delivery)}</strong></div>
                <div className="flex items-center justify-between"><span>Taxes (18%)</span><strong className="text-primary">{formatCurrency(taxes)}</strong></div>
                <div className="flex items-center justify-between"><span>Platform protection</span><strong className="text-primary">Free</strong></div>
                <div className="flex items-center justify-between border-t border-borderc pt-4"><span>Total</span><strong className="font-display text-[1.5rem] text-primary">{formatCurrency(total)}</strong></div>
              </div>
              <a href="/checkout" className={`btn-primary mt-8 ${!cartItems.length ? "pointer-events-none opacity-60" : ""}`}>Proceed to Checkout</a>
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredCustomerSession() && typeof window !== "undefined") {
      window.location.replace("/profile");
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setLoginData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${SELLER_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Unable to login right now.");
      }

      // Store user and token together
      const sessionData = {
        ...payload.user,
        token: payload.token,
      };
      storeCustomerSession(sessionData);
      setSubmitted(true);

      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          window.location.assign("/profile");
        }, 700);
      }
    } catch (error) {
      setErrorMessage(error.message || "Unable to login right now.");
    } finally {
      setIsSubmitting(false);
    }
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
              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="field-group">
                  <span>Email Address</span>
                  <input type="email" name="email" value={loginData.email} onChange={handleChange} placeholder="you@example.com" required />
                </label>
                <label className="field-group">
                  <span>Password</span>
                  <input type="password" name="password" value={loginData.password} onChange={handleChange} placeholder="Enter your password" required />
                </label>
                <label className="flex items-center gap-3 text-sm text-muted">
                  <input type="checkbox" name="remember" checked={loginData.remember} onChange={handleChange} />
                  Keep me signed in on this device
                </label>
                {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
                <button type="submit" className="btn-next w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </form>
            ) : (
              <div className="success-panel">
                <span className="mb-4 block text-[4.5rem] floaty">✓</span>
                <h3>Login successful</h3>
                <p>Your customer account is ready. Redirecting you to the buyer profile now.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function CartLoginPrompt({ onClose }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4" onClick={onClose}>
      <div className="w-full max-w-[520px] rounded-[28px] bg-white p-8 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <span className="section-label">Login Required</span>
        <h3 className="mt-3 font-display text-[2rem] text-primary">Please login before opening your cart</h3>
        <p className="mt-4 text-[0.98rem] leading-[1.8] text-muted">
          Your cart is available only for signed-in customers so we can keep checkout, saved details, and order tracking connected to the right buyer account.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/login" className="btn-primary" onClick={onClose}>Go to Login</a>
          <a href="/register" className="btn-outline" onClick={onClose}>Create Account</a>
          <button type="button" className="nav-utility" onClick={onClose}>Continue Browsing</button>
        </div>
      </div>
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredCustomerSession() && typeof window !== "undefined") {
      window.location.replace("/profile");
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password and confirm password must match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${SELLER_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload.errors) {
          const firstFieldError = Object.values(payload.errors)[0]?.[0];
          throw new Error(firstFieldError || payload.message || "Unable to create account right now.");
        }

        throw new Error(payload.message || "Unable to create account right now.");
      }

      // Store user and token together
      const sessionData = {
        ...payload.user,
        token: payload.token,
      };
      storeCustomerSession(sessionData);
      setSubmitted(true);

      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          window.location.assign("/profile");
        }, 800);
      }
    } catch (error) {
      setErrorMessage(error.message || "Unable to create account right now.");
    } finally {
      setIsSubmitting(false);
    }
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
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label className="field-group">
                    <span>Full Name</span>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ananya Sharma" required />
                  </label>
                  <label className="field-group">
                    <span>Email Address</span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                  </label>
                </div>
                <div className="form-row">
                  <label className="field-group">
                    <span>Phone Number</span>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
                  </label>
                  <label className="field-group">
                    <span>City</span>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" required />
                  </label>
                </div>
                <label className="field-group">
                  <span>Address</span>
                  <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Delivery address" required />
                </label>
                <div className="form-row">
                  <label className="field-group">
                    <span>Password</span>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" required />
                  </label>
                  <label className="field-group">
                    <span>Confirm Password</span>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
                  </label>
                </div>
                <label className="flex items-center gap-3 text-sm text-muted">
                  <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} required />
                  I agree to the marketplace terms, privacy policy, and account communication updates.
                </label>
                {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
                <button type="submit" className="btn-next w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            ) : (
              <div className="success-panel">
                <span className="mb-4 block text-[4.5rem] floaty">✓</span>
                <h3>Account created</h3>
                <p>Your customer account is ready. Redirecting you to the profile page now.</p>
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

function Field({ label, name, placeholder, value, onChange, error, type = "text" }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      <input type={type} name={name} placeholder={placeholder} value={value} onChange={(event) => onChange(name, event.target.value)} />
      {error ? <small className="text-[0.8rem] font-medium text-[#d64545]">{error}</small> : null}
    </label>
  );
}

function SelectField({ label, name, options, value, onChange, error, disabled = false }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      <select name={name} value={value} onChange={(event) => onChange(name, event.target.value)} disabled={disabled}>
        {options.map((option) => (
          <option key={`${name}-${option.value || "empty"}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <small className="text-[0.8rem] font-medium text-[#d64545]">{error}</small> : null}
    </label>
  );
}

function TextAreaField({ label, name, placeholder, value, onChange, error }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      <textarea name={name} placeholder={placeholder} value={value} onChange={(event) => onChange(name, event.target.value)} />
      {error ? <small className="text-[0.8rem] font-medium text-[#d64545]">{error}</small> : null}
    </label>
  );
}

function AdminBlogPage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blog/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blog/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data || data);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("sanctumToken");
      const response = await fetch(`${API_BASE_URL}/blog/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const deletePost = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("sanctumToken");
      const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handlePostAdded = (newPost) => {
    setPosts((prev) => [...prev, newPost]);
  };

  return (
    <div className="bg-light text-textc min-h-screen pt-24 pb-12">
      <section className="section-shell">
        <div className="mx-auto max-w-[1200px]">
          <div className="admin-header mb-8">
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-muted">Manage blog categories and posts</p>
          </div>

          <div className="admin-tabs mb-8 flex gap-4 border-b border-borderc">
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "categories"
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted hover:text-textc"
              }`}
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "posts"
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted hover:text-textc"
              }`}
            >
              Posts
            </button>
          </div>

          {activeTab === "categories" && (
            <div className="admin-section">
              <BlogCategoryForm onCategoryAdded={handleCategoryAdded} />
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">All Categories</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : categories.length === 0 ? (
                  <p className="text-muted">No categories yet</p>
                ) : (
                  <div className="admin-table overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-borderc">
                          <th className="text-left px-4 py-3">Name</th>
                          <th className="text-left px-4 py-3">Posts</th>
                          <th className="text-right px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => (
                          <tr key={cat.id} className="border-b border-borderc hover:bg-white/50">
                            <td className="px-4 py-3">{cat.name}</td>
                            <td className="px-4 py-3">{cat.posts_count || 0}</td>
                            <td className="text-right px-4 py-3">
                              <button
                                type="button"
                                onClick={() => deleteCategory(cat.id)}
                                className="text-[#d64545] hover:underline text-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="admin-section">
              <BlogPostForm categories={categories} onPostAdded={handlePostAdded} />
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">All Posts</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : posts.length === 0 ? (
                  <p className="text-muted">No posts yet</p>
                ) : (
                  <div className="admin-table overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-borderc">
                          <th className="text-left px-4 py-3">Title</th>
                          <th className="text-left px-4 py-3">Slug</th>
                          <th className="text-left px-4 py-3">Categories</th>
                          <th className="text-right px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((post) => (
                          <tr key={post.id} className="border-b border-borderc hover:bg-white/50">
                            <td className="px-4 py-3">{post.name}</td>
                            <td className="px-4 py-3 text-sm text-muted">{post.slug}</td>
                            <td className="px-4 py-3">
                              {post.categories?.map((c) => c.name).join(", ") || "No categories"}
                            </td>
                            <td className="text-right px-4 py-3">
                              <button
                                type="button"
                                onClick={() => deletePost(post.id)}
                                className="text-[#d64545] hover:underline text-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function BlogCategoryForm({ onCategoryAdded }) {
  const [form, setForm] = useState({ name: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!form.name.trim()) {
      setErrors({ name: "Category name is required" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("sanctumToken");
      const response = await fetch(`${API_BASE_URL}/blog/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errData = await response.json();
        setErrors(errData.errors || { submit: "Failed to create category" });
        return;
      }

      const result = await response.json();
      onCategoryAdded(result.data || result);
      setForm({ name: "" });
      alert("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form bg-white p-8 rounded-lg border border-borderc">
      <h2 className="text-2xl font-bold mb-6">Add New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row mb-6">
          <Field
            label="Category Name *"
            name="name"
            placeholder="e.g., Technology, Business"
            value={form.name}
            onChange={(name, value) => handleChange({ target: { name, value } })}
            error={errors.name}
          />
        </div>
        {errors.submit && <p className="text-[#d64545] text-sm mb-4">{errors.submit}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
}

function BlogPostForm({ categories, onPostAdded }) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: null,
    meta_group_id: "",
    categories: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "name" && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (event) => setPreview(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!form.name.trim() || !form.slug.trim() || !form.description.trim()) {
      setErrors({
        name: !form.name ? "Title is required" : "",
        slug: !form.slug ? "Slug is required" : "",
        description: !form.description ? "Description is required" : "",
      });
      return;
    }

    if (form.categories.length === 0) {
      setErrors({ categories: "Select at least one category" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("sanctumToken");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      if (form.meta_group_id) formData.append("meta_group_id", form.meta_group_id);
      if (form.image) formData.append("image", form.image);
      form.categories.forEach((catId) => formData.append("categories[]", catId));

      const response = await fetch(`${API_BASE_URL}/blog/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        setErrors(errData.errors || { submit: "Failed to create post" });
        return;
      }

      const result = await response.json();
      onPostAdded(result.data || result);
      setForm({
        name: "",
        slug: "",
        description: "",
        image: null,
        meta_group_id: "",
        categories: [],
      });
      setPreview(null);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form bg-white p-8 rounded-lg border border-borderc">
      <h2 className="text-2xl font-bold mb-6">Add New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 mb-6 md:grid-cols-1">
          <Field
            label="Title *"
            name="name"
            placeholder="Post title"
            value={form.name}
            onChange={(name, value) => handleChange({ target: { name, value } })}
            error={errors.name}
          />
          <Field
            label="Slug *"
            name="slug"
            placeholder="post-slug"
            value={form.slug}
            onChange={(name, value) => handleChange({ target: { name, value } })}
            error={errors.slug}
          />
        </div>

        <div className="mb-6">
          <label className="field-group">
            <span>Description (CKEditor) *</span>
            <textarea
              name="description"
              placeholder="Write your post content here..."
              value={form.description}
              onChange={handleChange}
              className="min-h-[200px]"
            />
            {errors.description && (
              <small className="text-[0.8rem] font-medium text-[#d64545]">{errors.description}</small>
            )}
          </label>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 md:grid-cols-1">
          <div>
            <label className="field-group">
              <span>Featured Image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/jpg"
                onChange={handleImageChange}
              />
            </label>
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-[150px] rounded"
                />
              </div>
            )}
          </div>

          <div>
            <Field
              label="Meta Group ID (Optional)"
              name="meta_group_id"
              type="number"
              placeholder="Leave blank if not applicable"
              value={form.meta_group_id}
              onChange={(name, value) => handleChange({ target: { name, value } })}
              error={errors.meta_group_id}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Categories *</label>
          <div className="flex flex-wrap gap-3">
            {categories.length === 0 ? (
              <p className="text-muted text-sm">No categories available. Create one first.</p>
            ) : (
              categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.categories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))
            )}
          </div>
          {errors.categories && (
            <small className="text-[0.8rem] font-medium text-[#d64545] block mt-2">{errors.categories}</small>
          )}
        </div>

        {errors.submit && <p className="text-[#d64545] text-sm mb-4">{errors.submit}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default App;
































