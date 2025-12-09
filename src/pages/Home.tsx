import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { Product, CATEGORIES, User } from '../types';
import { Api } from '../services/api';

interface HomeProps {
  onProductClick: (product: Product) => void;
  user: User | null;
}

const Home: React.FC<HomeProps> = ({ onProductClick, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const filters: any = {};
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    if (searchTerm) filters.search = searchTerm;
    
    try {
      const productsData = await Api.getProducts(filters);
      const usersData = await Api.getAllUsers();
      const sellersMap: Record<string, User> = {};
      usersData.forEach(u => { sellersMap[u.id] = u; });
      setSellers(sellersMap);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-nigeria-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Buy & Sell in <span className="text-green-200">Nigeria</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto font-light">
            {user ? `Welcome back, ${user.name}! Find great deals or start selling today.` : "Join the fastest growing marketplace. Safe, Simple, and Local."}
          </p>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden max-w-3xl mx-auto">
             <div className="flex-grow flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100">
               <Search className="text-gray-400 mr-3" size={24} />
               <input 
                 type="text" 
                 placeholder="Search for cars, phones, clothes..." 
                 className="w-full text-lg outline-none text-gray-700 placeholder-gray-400"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <button type="submit" className="bg-black text-white px-10 py-4 font-bold text-lg hover:bg-gray-800 transition-colors">
               Search
             </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
       {/* Categories */}
        <div className="w-full mb-8">
          <div className="flex flex-nowrap overflow-x-auto space-x-3 pb-4 w-full">
            
            <button 
               onClick={() => setSelectedCategory('All')}
               className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                 selectedCategory === 'All' 
                 ? 'bg-nigeria-green text-white shadow-md' 
                 : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
               }`}
            >
              All Items
            </button>
            
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat 
                  ? 'bg-nigeria-green text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-80 animate-pulse border border-gray-100">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl text-gray-900 font-bold">No products found</h3>
            <p className="text-gray-500 mt-2">Try checking your spelling or use different keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {products.map(product => {
                const seller = sellers[product.sellerId];
                return (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group border border-gray-100"
                    onClick={() => onProductClick(product)}
                  >
                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                       <img 
                         src={product.images[0]} 
                         alt={product.title} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                       />
                       <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                         {product.condition}
                       </div>
                       {/* Gradient overlay on hover */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col">
                       <h3 className="text-gray-900 font-bold text-lg line-clamp-1 mb-1 group-hover:text-nigeria-green transition-colors">{product.title}</h3>
                       <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                       <p className="text-xl font-extrabold text-nigeria-green mb-4">₦{product.price.toLocaleString()}</p>
                       
                       <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                             <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                               {seller?.profileImage ? (
                                 <img src={seller.profileImage} alt="" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                   {seller?.name.charAt(0) || 'U'}
                                 </div>
                               )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-900 font-semibold truncate max-w-[100px]">
                                {seller?.storeName || seller?.name || 'Seller'}
                                </span>
                                {seller?.rating ? (
                                    <div className="flex items-center text-xs text-yellow-500 font-bold">
                                        <Star size={10} className="fill-current mr-0.5" />
                                        <span>{seller.rating.toFixed(1)}</span>
                                    </div>
                                ) : null}
                            </div>
                          </div>
                          
                          {seller?.location && (
                             <div className="flex items-center text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                               <MapPin size={12} className="mr-1" />
                               <span className="truncate max-w-[80px]">{seller.location.split(',')[0]}</span>
                             </div>
                          )}
                       </div>
                    </div>
                  </div>
                );
             })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;