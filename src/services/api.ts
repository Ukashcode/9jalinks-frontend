import { User, Product, AuthResponse } from '../types';

// Connect to Render if VITE_API_URL is set, otherwise Localhost
// The (import.meta as any) fixes the TypeScript error you saw earlier
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

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
    return res.json();
  },

  // Fixed: Only sends email and code (no userData needed)
  verifyOtp: async (data: { email: string; otp: string }) => {
    // Note: The backend controller expects 'code', but frontend usually calls it 'otp'
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, code: data.otp }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Verification failed');
    }

    const result = await res.json();
    // Auto-login the user by saving the token
    localStorage.setItem('token', result.token);
    localStorage.setItem('user_session', JSON.stringify(result.user));
    return result;
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    
    const result = await res.json();
    localStorage.setItem('token', result.token);
    localStorage.setItem('user_session', JSON.stringify(result.user));
    return result;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_session');
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem('user_session');
    return session ? JSON.parse(session) : null;
  },

  // --- PRODUCTS (Keep existing logic) ---
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },
  
  // You can add the other product functions here as you need them
};