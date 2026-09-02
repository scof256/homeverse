export type UserRole = "customer" | "agent" | "admin";
export type ListingStatus = "draft" | "pending" | "published" | "rejected" | "archived";
export type ListingPurpose = "rent" | "sale";

export type Profile = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  agencyName?: string;
  licenseNumber?: string;
  role: UserRole;
  createdAt?: string;
};

export type Property = {
  id: string;
  agentId: string;
  slug: string;
  title: string;
  description: string;
  purpose: ListingPurpose;
  propertyType: string;
  price: number;
  currency: string;
  country: string;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  yearBuilt?: number;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  status: ListingStatus;
  featured: boolean;
  verified: boolean;
  image: string;
  images: string[];
  agent?: Profile;
  createdAt: string;
};

export type PropertyFilters = {
  query?: string;
  city?: string;
  purpose?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  amenity?: string;
  agentId?: string;
};

export type Inquiry = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerEmail: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
};

export type Appointment = {
  id: string;
  propertyTitle: string;
  scheduledAt: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
};
