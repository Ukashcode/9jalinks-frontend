import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import About from './pages/About'; 
import Help from './pages/Help';
// Note: ProductDetail logic needs to be updated to use useParams() 
// For now, we will route it to a placeholder or the existing component if adapted
import ProductDetail from './pages/ProductDetail'; 
import { User } from './types';
import { Api } from './services/api';
import './index.css';

// --- LAYOUT WRAPPER ---
const Layout = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Update user state whenever the route changes (e.g. after login)
  useEffect(() => {
    const currentUser = Api.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]);

  const handleLogout = () => {
    Api.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={(path) => navigate(`/${path}`)} 
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onProductClick={(p) => navigate(`/product/${p.id || p._id}`)} user={user} />} />
          
          <Route path="/login" element={<AuthWrapper type="login" />} />
          <Route path="/signup" element={<AuthWrapper type="signup" />} />
          
          <Route path="/dashboard" element={<Dashboard user={user!} onUpdateUser={setUser} />} />
          
          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />

          {/* Dynamic Product Page */}
          {/* If ProductDetail expects props, you might need to wrap it to fetch ID from params */}
          <Route path="/product/:id" element={<div className="p-20 text-center">Product Detail Page (Update Component to use useParams)</div>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// --- AUTH WRAPPER ---
const AuthWrapper = ({ type }: { type: 'login' | 'signup' }) => {
  const navigate = useNavigate();

  const handleSuccess = (user: User) => {
    // Redirect logic
    if (user.role === 'SELLER') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // Or '/'
    }
  };

  return (
    <Auth 
      type={type} 
      onAuthSuccess={handleSuccess} 
      onNavigate={(path) => navigate(`/${path}`)} 
    />
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;