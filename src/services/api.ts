import { User, Product, AuthResponse } from '../types';

// We cast to 'any' here as a backup in case the d.ts file doesn't pick up immediately
//const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
// const API_URL = 'http://localhost:5000/api'; // Keep this commented out for later
const API_URL = 'https://ninejalinks-backend-1.onrender.com/api';
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
    // Note: ensure your backend route is exactly /auth/signup. 
    // If your backend server.js uses app.use('/api/auth', ...), then this is correct.
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

  // 👇 UPDATED: Now connects to your REAL Backend instead of using fake "123456"
  verifyOtp: async (payload: { email: string; otp: string }): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Backend expects "code", but frontend passes "otp", so we map it here:
      body: JSON.stringify({ email: payload.email, code: payload.otp }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Invalid OTP');
    }

    const data = await res.json();
    // Save the token immediately so the user is logged in
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_session', JSON.stringify(data.user));
    return data;
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

  // --- GENERAL ---

  submitContactForm: async (data: { email: string; message?: string }) => {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  socialLogin: async (provider: string) => {
    alert("Real social login requires OAuth configuration.");
    throw new Error("Social login not implemented.");
  }
};