import React, { useState, useEffect } from 'react';
import { User, Product } from '../types';
import { Api } from '../services/api';
import { 
  Plus, Trash2, Edit, Store, 
  Settings, Package, LogOut, Image as ImageIcon,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 
  'Vehicles', 'Real Estate', 'Services', 'Others'
];

interface DashboardProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const isSeller = user?.role === 'SELLER'; // Added safe check (?)
  
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'profile'>(isSeller ? 'products' : 'profile');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // --- FORM STATES (Initialized Safely) ---
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', category: CATEGORIES[0], condition: 'New', location: '', images: [] as string[]
  });

  const [profileForm, setProfileForm] = useState({
    name: '', storeName: '', description: '', location: '', whatsapp: '', instagram: ''
  });

  // ✅ Update form when User data loads/changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        storeName: user.store?.name || '',
        description: user.store?.description || '',
        location: user.store?.location || '',
        whatsapp: user.social?.whatsapp || '',
        instagram: user.social?.instagram || '',
      });
    }
  }, [user]);

  // --- LOAD PRODUCTS ---
  useEffect(() => {
    if (activeTab === 'products' && isSeller) {
      loadSellerProducts();
    }
  }, [activeTab, isSeller]);

  const loadSellerProducts = async () => {
    setLoading(true);
    try {
      const data = await Api.getProducts(); 
      // Safe filtering
      const myProducts = data.filter((p: any) => {
         const sellerId = p.seller?._id || p.seller?.id || p.seller; 
         return sellerId === user.id || sellerId === user._id;
      });
      setProducts(myProducts);
    } catch (e) {
      console.error("Failed to load products", e);
    }
    setLoading(false);
  };

  // --- HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setProductForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...productForm, price: Number(productForm.price) };
      if (editingProductId) {
        await Api.updateProduct(editingProductId, payload as any);
        alert('Product updated successfully!');
      } else {
        await Api.addProduct(payload as any);
        alert('Product added successfully!');
      }
      setProductForm({ title: '', description: '', price: '', category: CATEGORIES[0], condition: 'New', location: '', images: [] });
      setEditingProductId(null);
      setActiveTab('products');
      loadSellerProducts();
    } catch (error: any) {
      alert(error.message || 'Failed to save product.');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await Api.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updates = {
        name: profileForm.name,
        store: { name: profileForm.storeName, description: profileForm.description, location: profileForm.location },
        social: { whatsapp: profileForm.whatsapp, instagram: profileForm.instagram }
      };
      const updatedUser = await Api.updateProfile(user.id, updates as any);
      onUpdateUser(updatedUser);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  // ✅ Safety Check: If no user, don't render anything
  if (!user) return <div className="p-10 text-center">Loading User Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r min-h-[200px] md:min-h-screen p-4">
        <div className="flex items-center gap-2 mb-8 text-green-700 font-bold text-xl px-2">
           <Store /> {user.role === 'SELLER' ? 'Seller Center' : 'My Account'}
        </div>
        <nav className="space-y-2">
          {isSeller && (
            <>
              <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'products' ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Package size={20} /> My Products
              </button>
              <button onClick={() => { setActiveTab('add'); setEditingProductId(null); setProductForm({ title: '', description: '', price: '', category: CATEGORIES[0], condition: 'New', location: '', images: [] }); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'add' ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Plus size={20} /> Add Product
              </button>
            </>
          )}
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings size={20} /> Profile Settings
          </button>
          <button onClick={() => { Api.logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 mt-8">
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        {/* Products List */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Products</h2>
            {loading ? <div className="text-center"><Loader className="animate-spin inline" /></div> : (
              <div className="bg-white rounded-xl shadow border overflow-hidden">
                 {products.length === 0 ? <div className="p-10 text-center text-gray-500">No products found.</div> : (
                   products.map(p => (
                     <div key={p._id} className="p-4 border-b flex justify-between items-center">
                       <div className="flex items-center gap-4">
                         <img src={p.images[0]?.url || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded object-cover" />
                         <span className="font-bold">{p.title}</span>
                       </div>
                       <div className="space-x-2">
                          <button onClick={() => { setEditingProductId(p._id); setProductForm({ title: p.title, description: p.description, price: p.price.toString(), category: p.category, condition: p.condition as string || 'Used', location: p.location || '', images: p.images.map(i => i.url) }); setActiveTab('add'); }} className="text-blue-600"><Edit size={18}/></button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="text-red-600"><Trash2 size={18}/></button>
                       </div>
                     </div>
                   ))
                 )}
              </div>
            )}
          </div>
        )}

        {/* Add Product Form */}
        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
             <h2 className="text-2xl font-bold mb-4">{editingProductId ? 'Edit' : 'Add'} Product</h2>
             <form onSubmit={handleSaveProduct} className="space-y-4">
                <input className="w-full border p-3 rounded" placeholder="Title" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} />
                <input className="w-full border p-3 rounded" type="number" placeholder="Price" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                <select className="w-full border p-3 rounded" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
                <textarea className="w-full border p-3 rounded" placeholder="Description" rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                <div className="border-2 border-dashed p-4 text-center rounded">
                   <p className="text-gray-500 mb-2">Upload Images</p>
                   <input type="file" multiple onChange={handleImageUpload} />
                   <div className="flex gap-2 mt-2 justify-center">{productForm.images.map((img, i) => <img key={i} src={img} className="w-10 h-10 object-cover rounded" />)}</div>
                </div>
                <button className="w-full bg-green-600 text-white p-3 rounded font-bold">{loading ? 'Saving...' : 'Save Product'}</button>
             </form>
          </div>
        )}

        {/* Profile Form */}
        {activeTab === 'profile' && (
           <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                 <input className="w-full border p-3 rounded" placeholder="Full Name" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                 {isSeller && (
                   <>
                     <input className="w-full border p-3 rounded" placeholder="Store Name" value={profileForm.storeName} onChange={e => setProfileForm({...profileForm, storeName: e.target.value})} />
                     <input className="w-full border p-3 rounded" placeholder="Location" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} />
                   </>
                 )}
                 <input className="w-full border p-3 rounded" placeholder="WhatsApp" value={profileForm.whatsapp} onChange={e => setProfileForm({...profileForm, whatsapp: e.target.value})} />
                 <input className="w-full border p-3 rounded" placeholder="Instagram" value={profileForm.instagram} onChange={e => setProfileForm({...profileForm, instagram: e.target.value})} />
                 <button className="w-full bg-green-600 text-white p-3 rounded font-bold">{loading ? 'Saving...' : 'Save Profile'}</button>
              </form>
           </div>
        )}
      </main>
    </div>
  );
};
export default Dashboard;