export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string; // The frontend usually maps _id to id
  _id?: string; // For safety
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  isVerified?: boolean;
  
  // ✅ Fixed: Matches your Backend Schema (storeSchema)
  store?: {
    name: string;
    description: string;
    location: string;
  };

  // ✅ Fixed: Matches your Backend Schema (socialSchema)
  social?: {
    whatsapp: string;
    instagram: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface Product {
  _id: string; // MongoDB ID
  id?: string; // Frontend helper
  title: string;
  price: number;
  category: string;
  description: string;
  
  // ✅ Fixed: Added Condition to remove type error
  condition: 'New' | 'Used' | 'Refurbished' | string; 
  
  location?: string;
  
  // ✅ Fixed: Matches backend response
  images: { url: string; public_id?: string }[]; 
  
  seller: User | string; // Can be the User object or just the ID string
  views: number;
  createdAt?: string | Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

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