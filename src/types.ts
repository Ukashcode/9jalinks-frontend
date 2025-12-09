export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER'
}

export interface SocialLinks {
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface Review {
  id?: string;
  raterId: string;
  raterName: string;
  rating: number;
  comment: string;
  createdAt: number | string | Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  // Allow string so it matches backend response easily, or enum
  role: UserRole | 'BUYER' | 'SELLER'; 
  
  // Extended Profile Fields (These are causing your errors)
  storeName?: string;
  description?: string;
  location?: string;
  profileImage?: string;
  socialLinks?: SocialLinks;

  // Rating Fields
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];

  createdAt?: number | string | Date;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  
  // This was causing the "Property condition does not exist" error
  condition: 'New' | 'Used' | 'Refurbished'; 
  
  images: string[];
  views: number;
  createdAt?: number | string | Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// This was causing the "Module has no exported member CATEGORIES" error
export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Beauty & Health",
  "Phones & Tablets",
  "Vehicles",
  "Real Estate",
  "Services",
  "Jobs",
  "Babies & Kids"
];