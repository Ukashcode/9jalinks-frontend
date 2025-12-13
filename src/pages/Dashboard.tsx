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
  const isSeller = user.role === 'SELLER';
  
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'profile'>(isSeller ? 'products' : 'profile');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // --- FORM STATES ---
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    condition: 'New',
    location: '',
    images: [] as string[] // Stores Base64 strings
  });

  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    storeName: user.store?.name || '',
    description: user.store?.description || '',
    location: user.store?.location || '',
    // ✅ Fixed: Using 'social' to match Type definition
    whatsapp: user.social?.whatsapp || '', 
    instagram: user.social?.instagram || '',
  });

  // --- LOAD PRODUCTS ---
  useEffect(() => {
    if (activeTab === 'products' && isSeller) {
      loadSellerProducts();
    }
  }, [activeTab, isSeller]);

  const loadSellerProducts = async () => {
    setLoading(true);
    try {
      // We use the specialized endpoint for the logged-in seller
      const data = await Api.getProducts(); 
      // Filter client-side to ensure we only see OWN products
      const myProducts = data.filter((p: any) => {
         const sellerId = typeof p.seller === 'string' ? p.seller : p.seller._id || p.seller.id;
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
          setProductForm(prev => ({ 
            ...prev, 
            images: [...prev.images, reader.result as string] 
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return alert("Title and Price are required");
    
    setLoading(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
      };

      if (editingProductId) {
        // Cast to any to bypass strict partial checks during rapid dev
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
      console.error(error);
      alert(error.message || 'Failed to save product.');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
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
        store: {
          name: profileForm.storeName,
          description: profileForm.description,
          location: profileForm.location
        },
        social: {
          whatsapp: profileForm.whatsapp,
          instagram: profileForm.instagram
        }
      };

      const updatedUser = await Api.updateProfile(user.id, updates as any);
      onUpdateUser(updatedUser);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10">
        
        {/* PRODUCTS LIST */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Products</h2>
            {loading ? (
               <div className="flex justify-center p-10"><Loader className="animate-spin text-green-600" /></div>
            ) : products.length === 0 ? (
               <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                 <p className="text-gray-500 mb-4">No products found.</p>
                 <button onClick={() => setActiveTab('add')} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Post First Product</button>
               </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr><th className="p-4">Image</th><th className="p-4">Title</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-4">
                          <img src={p.images[0]?.url || 'https://via.placeholder.com/50'} alt={p.title} className="w-12 h-12 object-cover rounded" />
                        </td>
                        <td className="p-4 font-medium">{p.title}</td>
                        <td className="p-4 text-green-700 font-bold">₦{Number(p.price).toLocaleString()}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => { 
                             setEditingProductId(p._id); 
                             setProductForm({
                               title: p.title, description: p.description, price: p.price.toString(),
                               category: p.category, condition: p.condition || 'Used', location: p.location || '', 
                               images: p.images.map(img => img.url) 
                             }); 
                             setActiveTab('add'); 
                          }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ADD / EDIT PRODUCT */}
        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSaveProduct} className="bg-white p-8 rounded-xl shadow-sm space-y-6">
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Title</label><input type="text" required className="w-full p-3 border rounded-lg" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-gray-700 mb-2">Price (₦)</label><input type="number" required className="w-full p-3 border rounded-lg" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-2">Category</label><select className="w-full p-3 border rounded-lg" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Condition</label><div className="flex gap-4"><label className="flex items-center gap-2"><input type="radio" name="condition" value="New" checked={productForm.condition === 'New'} onChange={() => setProductForm({...productForm, condition: 'New'})} /> New</label><label className="flex items-center gap-2"><input type="radio" name="condition" value="Used" checked={productForm.condition === 'Used'} onChange={() => setProductForm({...productForm, condition: 'Used'})} /> Used</label></div></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Description</label><textarea required rows={4} className="w-full p-3 border rounded-lg" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} /></div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Images</label>
                 <div className="grid grid-cols-4 gap-4 mb-4">
                   {productForm.images.map((img, idx) => (
                     <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                       <img src={img} alt="preview" className="w-full h-full object-cover" />
                       <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><Trash2 size={12} /></button>
                     </div>
                   ))}
                   <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                     <ImageIcon className="text-gray-400" /><input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                   </label>
                 </div>
              </div>
              <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">{loading ? 'Saving...' : 'Save Product'}</button>
            </form>
          </div>
        )}

        {/* PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
             <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-xl shadow-sm space-y-6">
                <div><label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label><input type="text" className="w-full p-3 border rounded-lg" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} /></div>
                {isSeller && (
                  <>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label><input type="text" className="w-full p-3 border rounded-lg" value={profileForm.storeName} onChange={e => setProfileForm({...profileForm, storeName: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Store Description</label><textarea rows={3} className="w-full p-3 border rounded-lg" value={profileForm.description} onChange={e => setProfileForm({...profileForm, description: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Location</label><input type="text" className="w-full p-3 border rounded-lg" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} /></div>
                  </>
                )}
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp</label><input type="text" className="w-full p-3 border rounded-lg" value={profileForm.whatsapp} onChange={e => setProfileForm({...profileForm, whatsapp: e.target.value})} /></div>
                   <div><label className="block text-sm font-bold text-gray-700 mb-2">Instagram</label><input type="text" className="w-full p-3 border rounded-lg" value={profileForm.instagram} onChange={e => setProfileForm({...profileForm, instagram: e.target.value})} /></div>
                </div>
                <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">{loading ? 'Saving...' : 'Save Profile'}</button>
             </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;