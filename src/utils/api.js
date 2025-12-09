// API Base URL - Change this to your backend URL when deploying
const API_URL = 'http://localhost:5000/api';

const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// --- AUTH API Calls ---

export const checkAuthAPI = async () => {
  const token = localStorage.getItem('token');
  if (!token) return { user: null };

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(token),
    });
    if (res.ok) {
      const data = await res.json();
      return { user: data.user, token };
    } else {
      localStorage.removeItem('token');
      return { user: null };
    }
  } catch (err) {
    console.error('Auth check failed:', err);
    localStorage.removeItem('token');
    return { user: null };
  }
};

export const loginAPI = async (formData) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data; // returns { token, user }
};

export const signupAPI = async (formData) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  return data; // returns { message }
};

export const verifyOTPAPI = async (email, otpCode) => {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, otp: otpCode }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Invalid OTP');
  }
  return data; // returns { message }
};


// --- PRODUCT API Calls ---

export const fetchProductsAPI = async () => {
  try {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return [];
  }
};

// You can add more API functions here (e.g., deleteProductAPI, updateProductAPI)

// The API_URL is still exported for reference if needed elsewhere.
export { API_URL };