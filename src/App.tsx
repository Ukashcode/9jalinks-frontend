import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Help from './pages/Help';
import { User, Product } from './types';
import { Api } from './services/api'; // UPDATED IMPORT
import './index.css';

type Page = 'home' | 'login' | 'signup' | 'dashboard' | 'product_detail' | 'about' | 'help';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Initialize app check for existing session
  useEffect(() => {
    const user = Api.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'SELLER') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    Api.logout();
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product_detail');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home onProductClick={handleProductClick} user={currentUser} />;
      
      case 'login':
        return <Auth type="login" onAuthSuccess={handleLogin} onNavigate={setCurrentPage as any} />;
      
      case 'signup':
        return <Auth type="signup" onAuthSuccess={handleLogin} onNavigate={setCurrentPage as any} />;
      
      case 'dashboard':
        if (!currentUser) return <Home onProductClick={handleProductClick} user={currentUser} />;
        return <Dashboard user={currentUser} onUpdateUser={setCurrentUser} />;
      
      case 'product_detail':
        if (!selectedProduct) return <Home onProductClick={handleProductClick} user={currentUser} />;
        return <ProductDetail product={selectedProduct} onBack={() => setCurrentPage('home')} />;
      
      case 'about':
        return <About onBack={() => setCurrentPage('home')} />;

      case 'help':
        return <Help onBack={() => setCurrentPage('home')} />;

      default:
        return <Home onProductClick={handleProductClick} user={currentUser} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout} 
        onNavigate={(page) => setCurrentPage(page as Page)} 
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;