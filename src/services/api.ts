
import { User, Product, AuthResponse } from '../types';

// CHANGE THIS URL if you deploy to Render/Vercel later
// OLD LINE:
// const API_URL = 'http://localhost:5000/api';

// NEW LINE:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Helper to attach the JWT token to requests
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const Api = {
  // --- AUTHENTICATION ---

  signup: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Signup failed');
    }
    return { email: data.email };
  },

  verifyOtp: async (payload: { email: string; otp: string; userData: any }): Promise<AuthResponse> => {
    // For this real integration, we skip actual email OTP (requires paid service).
    // We check the hardcoded mock code, then log the user in.
    if (payload.otp !== '123456') throw new Error('Invalid OTP');
    
    // Auto-login after "verification"
    return Api.login(payload.userData.email, payload.userData.password);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_session', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_session');
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem('user_session');
    return session ? JSON.parse(session) : null;
  },

  // --- USERS ---

  getAllUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },

  getUserById: async (userId: string): Promise<User | null> => {
    const res = await fetch(`${API_URL}/users/${userId}`);
    if (!res.ok) return null;
    return res.json();
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const updatedUser = await res.json();
    
    // Update local session if it's the logged-in user
    const currentUser = Api.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        localStorage.setItem('user_session', JSON.stringify(updatedUser));
    }
    return updatedUser;
  },

  rateSeller: async (sellerId: string, ratingData: any): Promise<User> => {
    const res = await fetch(`${API_URL}/users/${sellerId}/rate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ratingData),
    });
    if (!res.ok) throw new Error('Failed to rate seller');
    return res.json();
  },

  // --- PRODUCTS ---

  getProducts: async (filters: any = {}): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.sellerId) params.append('sellerId', filters.sellerId);

    const res = await fetch(`${API_URL}/products?${params.toString()}`);
    return res.json();
  },

  addProduct: async (productData: any): Promise<Product> => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
  },

  updateProduct: async (productId: string, updates: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  deleteProduct: async (productId: string): Promise<void> => {
    await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // --- GENERAL / CONTACT ---

  submitContactForm: async (data: { email: string; message?: string }) => {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // --- SOCIAL LOGIN (Placeholder) ---
  socialLogin: async (provider: string) => {
    alert("Real social login requires OAuth configuration (Firebase/Passport). Please use email/password for this demo.");
    throw new Error("Social login not implemented in demo backend.");
  }
};