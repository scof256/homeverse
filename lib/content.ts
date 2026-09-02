export const serviceContent = [
  {
    slug: "buy",
    title: "Buy a home",
    shortTitle: "Buying",
    image: "/assets/images/service-1.png",
    summary: "Search verified homes, compare the full cost, arrange viewings and move toward an offer with a clear record of every step.",
    steps: ["Define your budget and preferred locations", "Shortlist and compare verified listings", "Book viewings with the listing agent", "Complete checks and prepare an informed offer"],
    cta: "Browse homes for sale",
    href: "/properties?purpose=sale",
  },
  {
    slug: "rent",
    title: "Rent a home",
    shortTitle: "Renting",
    image: "/assets/images/service-2.png",
    summary: "Find available rentals, understand the monthly costs and arrange a convenient viewing directly with the responsible agent.",
    steps: ["Choose a location and monthly budget", "Review available homes and amenities", "Ask the agent questions before travelling", "Schedule a viewing and confirm the terms"],
    cta: "Browse homes for rent",
    href: "/properties?purpose=rent",
  },
  {
    slug: "sell",
    title: "Sell a home",
    shortTitle: "Selling",
    image: "/assets/images/service-3.png",
    summary: "Create a complete property listing, upload good photographs and manage buyer enquiries from a dedicated agent workspace.",
    steps: ["Create or upgrade to an agent account", "Add accurate property and location details", "Submit the listing for marketplace review", "Respond to enquiries and manage viewings"],
    cta: "Create a property listing",
    href: "/dashboard/listings/new",
  },
] as const;

export const amenityContent = [
  { slug: "parking-space", icon: "car-sport-outline", title: "Parking Space", query: "Parking", description: "Homes with dedicated, secure or resident parking options." },
  { slug: "swimming-pool", icon: "water-outline", title: "Swimming Pool", query: "Swimming pool", description: "Properties with private or shared swimming facilities." },
  { slug: "private-security", icon: "shield-checkmark-outline", title: "Private Security", query: "Security", description: "Homes offering controlled access, guards or monitored security." },
  { slug: "medical-center", icon: "fitness-outline", title: "Medical Center", query: "Medical centre", description: "Homes located near practical healthcare services." },
  { slug: "library-area", icon: "library-outline", title: "Library Area", query: "Library", description: "Quiet homes with reading, study or library space nearby." },
  { slug: "king-size-beds", icon: "bed-outline", title: "King Size Beds", query: "Large bedrooms", description: "Homes with generous principal bedrooms and practical storage." },
  { slug: "smart-homes", icon: "home-outline", title: "Smart Homes", query: "Smart home", description: "Properties with connected access, lighting or energy controls." },
  { slug: "kids-playland", icon: "football-outline", title: "Kid’s Playland", query: "Playground", description: "Family-friendly homes with play areas or nearby recreation." },
] as const;

export const blogPosts = [
  {
    slug: "prepare-home-for-viewing",
    title: "How to prepare a home for a successful viewing",
    image: "/assets/images/blog-1.png",
    category: "Seller guide",
    date: "2026-08-26",
    excerpt: "Simple preparation helps buyers understand the space and gives agents better information to work with.",
    sections: [
      ["Start with clarity", "Make sure the listing, price, address and available viewing times are accurate before anyone travels. Remove avoidable clutter so room sizes and storage are easy to judge."],
      ["Prepare the practical details", "Check lighting, water, access arrangements and parking. Keep documents about utilities, maintenance and service charges ready for serious questions."],
      ["Let the property speak honestly", "Good presentation should reveal the home, not disguise it. Disclose material issues and allow enough time for visitors to inspect the areas important to them."],
    ],
  },
  {
    slug: "questions-before-buying-apartment",
    title: "Questions to ask before buying an apartment",
    image: "/assets/images/blog-2.jpg",
    category: "Buyer guide",
    date: "2026-08-19",
    excerpt: "The purchase price is only one part of the decision. Ask about ownership, recurring costs and the building itself.",
    sections: [
      ["Understand the full cost", "Ask about service charges, taxes, insurance, parking, utilities and planned building work. A lower asking price can still carry higher long-term costs."],
      ["Check management and rules", "Find out who manages shared areas, how decisions are made and whether there are restrictions on renovation, pets, guests or renting the property later."],
      ["Verify before committing", "Use qualified legal and technical professionals to confirm ownership, approvals and physical condition. Keep important representations in writing."],
    ],
  },
  {
    slug: "compare-rental-homes",
    title: "A practical way to compare rental homes",
    image: "/assets/images/blog-3.jpg",
    category: "Renter guide",
    date: "2026-08-11",
    excerpt: "Compare location, monthly cost, condition and lease terms together instead of choosing from photographs alone.",
    sections: [
      ["Compare like with like", "Record rent, deposit, utilities, transport costs and any service charges for every home. Use the same monthly estimate across your shortlist."],
      ["Inspect daily-life details", "Test water, lighting, mobile coverage, access and noise at the viewing. Check the route you would regularly use, not only the map distance."],
      ["Read the agreement", "Confirm notice periods, repairs, payment dates and deposit return conditions before signing. Ask for unclear terms to be explained in writing."],
    ],
  },
] as const;

export function findService(slug: string) { return serviceContent.find((item) => item.slug === slug); }
export function findAmenity(slug: string) { return amenityContent.find((item) => item.slug === slug); }
export function findPost(slug: string) { return blogPosts.find((item) => item.slug === slug); }
