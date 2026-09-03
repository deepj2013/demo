/* Ujma Uniform — catalog, features, copy for the demo */

const BRAND = {
  name: "Ujma",
  full: "Ujma Uniform",
  tagline: "Uniforms that work as hard as you do.",
  city: "India",
  phone: "+91 98765 44001",
  email: "hello@ujmauniform.com",
  credits: 240
};

const TRUST = [
  { icon: "truck", label: "Free Delivery", sub: "On orders above ₹999" },
  { icon: "cod", label: "COD Available", sub: "Pay at your door" },
  { icon: "emi", label: "Easy EMI", sub: "From ₹199 / month" },
  { icon: "return", label: "Easy Returns", sub: "7-day exchange" }
];

const FEATURES = [
  {
    id: "storefront",
    title: "Storefront",
    screen: "home",
    items: [
      "Home feed with banners, trust strip & collections",
      "Shop by category — Women, Men, Lab coats, Hospitality, School",
      "Shop by colour with live swatches",
      "Bestsellers, New arrivals, Plus size",
      "Lifestyle reviews from doctors & staff"
    ]
  },
  {
    id: "catalog",
    title: "Catalog & PDP",
    screen: "shop",
    items: [
      "Filter by gender, category, colour, size, price",
      "Sort: popular, new, price, rating",
      "Product gallery, colour & size picker",
      "Size chart, fabric story, long-shift features",
      "Ratings, reviews, similar products"
    ]
  },
  {
    id: "search",
    title: "Search & discovery",
    screen: "search",
    items: [
      "Instant search across name, fabric, colour",
      "Recent searches & trending queries",
      "Category shortcuts from search"
    ]
  },
  {
    id: "cart",
    title: "Cart & checkout",
    screen: "cart",
    items: [
      "Cart with qty, colour, size, remove",
      "Coupons & store-credit apply",
      "Address book + new address",
      "COD · UPI · Cards · EMI",
      "Order confirmation with ID"
    ]
  },
  {
    id: "orders",
    title: "Orders & tracking",
    screen: "track",
    items: [
      "Track order timeline (placed → delivered)",
      "Order history with reorder",
      "Returns & exchange request"
    ]
  },
  {
    id: "account",
    title: "Account & loyalty",
    screen: "account",
    items: [
      "Login / Sign up with OTP",
      "Wishlist heart on every product",
      "Store credits & Ujma Club rewards",
      "Refer & earn 10% off",
      "Saved addresses & profile"
    ]
  },
  {
    id: "b2b",
    title: "B2B & institutions",
    screen: "bulk",
    items: [
      "Bulk / hospital / school orders",
      "Embroidery & custom branding",
      "Sample request before bulk",
      "Store locator"
    ]
  },
  {
    id: "ops",
    title: "Admin ops (web)",
    screen: "home",
    href: "admin/index.html",
    items: [
      "Item master — create style, colours, sizes, photo, publish to shop",
      "Inventory receive, +/- adjust, CSV upload, low-stock alerts",
      "Orders: confirm → pack → ship → out for delivery → delivered",
      "Courier + AWB assignment (Delhivery, BlueDart, Dunzo, own rider)",
      "Customers, coupons, B2B quotes, shipping settings"
    ]
  },
  {
    id: "platform",
    title: "App platform",
    screen: "home",
    items: [
      "iPhone-native look (Dynamic Island, tab bar)",
      "Full-screen PWA on a real phone",
      "Cart & wishlist persist in the browser",
      "HTML · CSS · JS — no backend required for demo"
    ]
  }
];

const CATEGORIES = [
  { id: "women", name: "Women", sub: "Scrubs & sets", emoji: "W", tone: "#1A4B6E" },
  { id: "men", name: "Men", sub: "Scrubs & sets", emoji: "M", tone: "#0E3D36" },
  { id: "lab", name: "Lab coats", sub: "Chief · Focus", emoji: "L", tone: "#F4F1EA", dark: true },
  { id: "hospitality", name: "Hospitality", sub: "Hotel & chef", emoji: "H", tone: "#3D2A1F" },
  { id: "school", name: "School", sub: "Kids uniforms", emoji: "S", tone: "#1E3A5F" },
  { id: "accessories", name: "Accessories", sub: "Caps & layers", emoji: "A", tone: "#5C2A3A" }
];

const COLORS = [
  { id: "navy", name: "Navy", hex: "#1B365D" },
  { id: "wine", name: "Wine", hex: "#7A2436" },
  { id: "black", name: "Black", hex: "#1A1A1A" },
  { id: "forest", name: "Forest", hex: "#1F4A3A" },
  { id: "grey", name: "Heather Grey", hex: "#8A8F96" },
  { id: "white", name: "White", hex: "#F4F1EA" },
  { id: "sky", name: "Ceil Blue", hex: "#6BA4C7" },
  { id: "teal", name: "Teal", hex: "#0E7C7B" }
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const PRODUCTS = [
  {
    id: "cw-navy",
    name: "Classic Women's V-Neck Scrub",
    line: "Classic",
    gender: "women",
    cat: "women",
    price: 1099,
    mrp: 1499,
    rating: 4.8,
    reviews: 2140,
    badge: "Bestseller",
    fabric: "Breathable poly-viscose · anti-wrinkle",
    colors: ["navy", "wine", "black", "forest", "grey", "sky"],
    sizes: SIZES,
    features: ["7 pockets", "Anti-distraction seams", "Long-shift verified", "Lab tested"],
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cm-navy",
    name: "Classic Men's V-Neck Scrub",
    line: "Classic",
    gender: "men",
    cat: "men",
    price: 1099,
    mrp: 1499,
    rating: 4.8,
    reviews: 1860,
    badge: "Bestseller",
    fabric: "Breathable poly-viscose · anti-wrinkle",
    colors: ["navy", "black", "wine", "forest", "grey"],
    sizes: SIZES,
    features: ["Cargo pockets", "Drawstring waist", "Long-shift verified", "Lab tested"],
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sw-navy",
    name: "StretchFlex Women's Scrub",
    line: "StretchFlex",
    gender: "women",
    cat: "women",
    price: 2499,
    mrp: 2999,
    rating: 4.9,
    reviews: 980,
    badge: "4-way stretch",
    fabric: "4-way stretch · recycled PET · engineered airflow",
    colors: ["navy", "wine", "teal", "black", "grey"],
    sizes: SIZES,
    features: ["4-way stretch", "Recycled PET bottles", "Ultra light", "Anti-wrinkle"],
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sm-navy",
    name: "StretchFlex Men's Scrub",
    line: "StretchFlex",
    gender: "men",
    cat: "men",
    price: 2499,
    mrp: 2999,
    rating: 4.8,
    reviews: 740,
    badge: "4-way stretch",
    fabric: "4-way stretch · recycled PET · engineered airflow",
    colors: ["navy", "wine", "forest", "black", "teal"],
    sizes: SIZES,
    features: ["4-way stretch", "Recycled PET bottles", "Ultra light", "Anti-wrinkle"],
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cw-wine",
    name: "Classic Women's V-Neck (Wine)",
    line: "Classic",
    gender: "women",
    cat: "women",
    price: 1099,
    mrp: 1499,
    rating: 4.8,
    reviews: 1320,
    badge: "Bestseller",
    fabric: "Breathable poly-viscose · anti-wrinkle",
    colors: ["wine", "navy", "black", "forest", "grey"],
    sizes: SIZES,
    features: ["7 pockets", "Flattering V-neck", "Long-shift verified"],
    img: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "lab-chief-w",
    name: "Chief Lab Coat — Women",
    line: "Chief",
    gender: "women",
    cat: "lab",
    price: 1899,
    mrp: 2399,
    rating: 4.7,
    reviews: 410,
    badge: "New",
    fabric: "Crisp poly · stain resistant",
    colors: ["white", "sky"],
    sizes: SIZES,
    features: ["Structured shoulders", "Deep pockets", "Length: knee"],
    img: "https://images.unsplash.com/photo-1576091160391-241bac8d7c23?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "lab-chief-m",
    name: "Chief Lab Coat — Men",
    line: "Chief",
    gender: "men",
    cat: "lab",
    price: 1899,
    mrp: 2399,
    rating: 4.7,
    reviews: 380,
    badge: "New",
    fabric: "Crisp poly · stain resistant",
    colors: ["white"],
    sizes: SIZES,
    features: ["Structured shoulders", "Deep pockets", "Length: knee"],
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "lab-everyday",
    name: "Everyday Lab Coat",
    line: "Everyday",
    gender: "unisex",
    cat: "lab",
    price: 1299,
    mrp: 1699,
    rating: 4.6,
    reviews: 290,
    fabric: "Soft poly · easy wash",
    colors: ["white", "sky"],
    sizes: SIZES,
    features: ["Lightweight", "Daily wear", "Easy iron"],
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "nurse-tunic",
    name: "Nurse Tunic Set",
    line: "Care",
    gender: "women",
    cat: "women",
    price: 999,
    mrp: 1399,
    rating: 4.7,
    reviews: 560,
    badge: "Loved by students",
    fabric: "Cool cotton-feel blend",
    colors: ["sky", "white", "navy", "wine"],
    sizes: SIZES,
    features: ["Easy movement", "Side vents", "Pen slot"],
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "chef-coat",
    name: "Executive Chef Coat",
    line: "Hospitality",
    gender: "unisex",
    cat: "hospitality",
    price: 1599,
    mrp: 1999,
    rating: 4.6,
    reviews: 210,
    fabric: "Double-breasted cotton twill",
    colors: ["white", "black"],
    sizes: SIZES,
    features: ["Heat resistant", "Cloth buttons", "Thermometer pocket"],
    img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "hotel-front",
    name: "Hotel Front Desk Uniform",
    line: "Hospitality",
    gender: "unisex",
    cat: "hospitality",
    price: 2199,
    mrp: 2799,
    rating: 4.5,
    reviews: 94,
    badge: "Institution",
    fabric: "Wrinkle-free suiting blend",
    colors: ["navy", "black", "wine"],
    sizes: SIZES,
    features: ["Tailored fit", "Embroidery ready", "All-day crease hold"],
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "school-g",
    name: "School Uniform Set — Girls",
    line: "Campus",
    gender: "women",
    cat: "school",
    price: 899,
    mrp: 1199,
    rating: 4.6,
    reviews: 640,
    fabric: "Durable poly-cotton · easy wash",
    colors: ["navy", "sky", "white"],
    sizes: ["24", "26", "28", "30", "32", "34", "36"],
    features: ["School logo embroidery", "Fade resistant", "Bulk pricing"],
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "school-b",
    name: "School Uniform Set — Boys",
    line: "Campus",
    gender: "men",
    cat: "school",
    price: 899,
    mrp: 1199,
    rating: 4.6,
    reviews: 580,
    fabric: "Durable poly-cotton · easy wash",
    colors: ["navy", "white", "sky"],
    sizes: ["24", "26", "28", "30", "32", "34", "36"],
    features: ["School logo embroidery", "Fade resistant", "Bulk pricing"],
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "under-ls",
    name: "Pima Underscrub — Long Sleeve",
    line: "Layer",
    gender: "unisex",
    cat: "accessories",
    price: 699,
    mrp: 899,
    rating: 4.8,
    reviews: 420,
    fabric: "Supersoft Pima cotton",
    colors: ["grey", "white", "navy", "black"],
    sizes: SIZES,
    features: ["Base layer", "Breathable", "Mix & match"],
    img: "https://images.unsplash.com/photo-1571772996211-2f02c9724b80?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cap-plain",
    name: "Scrub Cap — Classic",
    line: "Accessories",
    gender: "unisex",
    cat: "accessories",
    price: 349,
    mrp: 499,
    rating: 4.7,
    reviews: 310,
    fabric: "Soft tie-back cotton",
    colors: ["navy", "wine", "black", "forest", "teal", "sky"],
    sizes: ["One size"],
    features: ["All-shift comfort", "Secure fit", "Washable"],
    img: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "security",
    name: "Security Guard Uniform Set",
    line: "Duty",
    gender: "men",
    cat: "hospitality",
    price: 1799,
    mrp: 2299,
    rating: 4.4,
    reviews: 120,
    fabric: "Hard-wearing twill",
    colors: ["navy", "black"],
    sizes: SIZES,
    features: ["Shirt + trouser", "Epaulette ready", "Institutional bulk"],
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80"
  }
];

const REVIEWS = [
  { name: "Dr. Mili Sharma", role: "Anesthesiology", text: "Pockets actually hold a phone and notes. Still looks sharp after a 14-hour shift.", stars: 5 },
  { name: "Nurse Hema Rawat", role: "Registered Nurse", text: "Soft, not see-through, and the wine colour is beautiful. Ordered a second set.", stars: 5 },
  { name: "Dr. Prateek Rao", role: "Fertility Specialist", text: "StretchFlex is the first scrub that moves with me in OT. Worth the upgrade.", stars: 5 },
  { name: "Riya Garg", role: "MD Psychiatry", text: "Sizing is true. Size chart in the app made it easy. Delivery in 3 days.", stars: 4 },
  { name: "Chef Imran", role: "Hotel Kitchen", text: "Chef coat holds up to heat and wash. We bulk-ordered for the whole brigade.", stars: 5 }
];

const STORES = [
  { city: "Mumbai", place: "Worli Studio", addr: "212, Ready Money Terrace, Worli Naka", hours: "11am – 8pm" },
  { city: "Delhi", place: "GK-2 Flagship", addr: "M-block market, Greater Kailash II", hours: "11am – 8pm" },
  { city: "Bengaluru", place: "Indiranagar", addr: "100 Feet Road, Indiranagar", hours: "11am – 8pm" },
  { city: "Lucknow", place: "Gomti Nagar", addr: "Wave Mall, Gomti Nagar", hours: "11am – 9pm" }
];

const FAQS = [
  { q: "How do I pick the right size?", a: "Open any product → Size chart. Classic fits true to size. StretchFlex runs slightly relaxed. Plus sizes go to 3XL." },
  { q: "Do you offer COD and EMI?", a: "Yes. COD on orders under ₹8,000. EMI from ₹199/month on cards and UPI AutoPay." },
  { q: "Can hospitals and schools order in bulk?", a: "Yes. Use Bulk Order in the app. Embroidery, custom colours, and sample sets are available." },
  { q: "What is the return policy?", a: "Unworn items can be exchanged within 7 days. Store credit is issued instantly for returns." },
  { q: "Are StretchFlex scrubs durable?", a: "They use recycled PET with 4-way stretch, lab-tested for 50+ industrial washes." }
];

const TRENDING = ["navy scrubs", "lab coat", "StretchFlex", "wine", "chef coat", "school uniform"];

const SIZE_CHART = {
  headers: ["Size", "Bust / Chest", "Waist", "Hip", "Length"],
  rows: [
    ["XS", "32–34", "26–28", "34–36", "25"],
    ["S", "34–36", "28–30", "36–38", "26"],
    ["M", "36–38", "30–32", "38–40", "27"],
    ["L", "38–40", "32–34", "40–42", "27.5"],
    ["XL", "40–43", "34–37", "42–45", "28"],
    ["XXL", "43–46", "37–40", "45–48", "28.5"],
    ["3XL", "46–50", "40–44", "48–52", "29"]
  ]
};
