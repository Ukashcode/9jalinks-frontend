import React, { useEffect, useState } from 'react';
import { Product, User } from '../types';
import { Api } from '../services/api'; // UPDATED IMPORT
import { ArrowLeft, MessageCircle, MapPin, Shield, Star, X } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const [seller, setSeller] = useState<User | null>(null);
  const [activeImage, setActiveImage] = useState(product.images[0] || '');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Fetch seller from real API
      const u = await Api.getUserById(product.sellerId);
      if (u) setSeller(u);
      setCurrentUser(Api.getCurrentUser());
    };
    loadData();
  }, [product.sellerId]);

  const handleWhatsAppClick = () => {
    if (seller && seller.socialLinks?.whatsapp) {
      const message = `Hello, I'm interested in your product "${product.title}" listed on 9jalinks.`;
      const url = `https://wa.me/${seller.socialLinks.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      alert("This seller hasn't provided a WhatsApp number yet.");
    }
  };

  const handleRateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to rate.");
    if (ratingValue === 0) return alert("Select a rating.");
    
    setSubmittingRating(true);
    try {
        const updatedSeller = await Api.rateSeller(product.sellerId, {
            raterId: currentUser.id,
            raterName: currentUser.name,
            rating: ratingValue,
            comment: ratingComment
        });
        setSeller(updatedSeller);
        setShowRateModal(false);
        setRatingValue(0);
        setRatingComment('');
        alert("Review submitted!");
    } catch (err) {
        alert("Failed to submit review.");
    }
    setSubmittingRating(false);
  };

  const renderStars = (count: number, size = 16) => Array.from({ length: 5 }).map((_, i) => (
       <Star key={i} size={size} className={`${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'} inline-block mr-0.5`} />
  ));

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button onClick={onBack} className="flex items-center text-gray-600 mb-6 hover:text-nigeria-green">
          <ArrowLeft size={20} className="mr-2" /> Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 h-96 flex items-center justify-center bg-gray-100">
              {activeImage ? <img src={activeImage} className="max-h-full max-w-full object-contain" /> : <span className="text-gray-400">No Image</span>}
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <div key={idx} className={`h-20 w-20 flex-shrink-0 rounded-md border-2 cursor-pointer overflow-hidden ${activeImage === img ? 'border-nigeria-green' : 'border-transparent'}`} onClick={() => setActiveImage(img)}>
                   <img src={img} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-6">
                 <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase">{product.condition}</span>
                 <span className="text-gray-500 text-sm">{product.category}</span>
                 <span className="text-gray-500 text-sm">{product.views} Views</span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            {/* Reviews */}
            {seller && seller.reviews && seller.reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <h3 className="text-xl font-bold mb-4">Reviews ({seller.reviewCount})</h3>
                    <div className="space-y-4">
                        {seller.reviews.map((review: any, idx: number) => (
                            <div key={idx} className="border-b pb-4 last:border-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-gray-800">{review.raterName}</span>
                                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mb-2">{renderStars(review.rating, 14)}</div>
                                <p className="text-sm text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>

          <div className="lg:col-span-1">
             <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="text-3xl font-bold text-nigeria-green mb-1">₦{product.price.toLocaleString()}</div>
                <button onClick={handleWhatsAppClick} className="w-full bg-[#25D366] text-white py-4 mt-6 rounded-lg font-bold text-lg hover:bg-green-600 flex items-center justify-center shadow-lg">
                   <MessageCircle className="mr-2" size={24} /> Contact on WhatsApp
                </button>
             </div>

             <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Seller Information</h3>
                {seller ? (
                  <div>
                     <div className="flex items-center mb-4">
                        <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300 mr-3 shrink-0">
                           {seller.profileImage ? <img src={seller.profileImage} className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-gray-500">{seller.name.charAt(0)}</span>}
                        </div>
                        <div>
                           <div className="font-bold text-lg leading-tight">{seller.storeName || seller.name}</div>
                           <div className="flex items-center mt-1">{renderStars(Math.round(seller.rating || 0), 12)} <span className="text-xs text-gray-500 ml-1">({seller.reviewCount || 0})</span></div>
                        </div>
                     </div>
                     <div className="space-y-3 text-sm text-gray-600 mb-6">
                        {seller.location && <div className="flex items-start"><MapPin size={16} className="mr-2 mt-1" /> {seller.location}</div>}
                     </div>
                     {currentUser && currentUser.id !== seller.id && (
                        <button onClick={() => setShowRateModal(true)} className="text-nigeria-green border border-nigeria-green rounded py-1 text-sm font-semibold hover:bg-green-50 w-full text-center">Rate Seller</button>
                     )}
                  </div>
                ) : <div>Loading...</div>}
             </div>
          </div>
        </div>
      </div>
      
      {/* Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="font-bold text-lg mb-4">Rate Seller</h3>
                <form onSubmit={handleRateSeller}>
                    <div className="mb-6 flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button type="button" key={star} onClick={() => setRatingValue(star)}>
                                <Star size={32} className={`${ratingValue >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            </button>
                        ))}
                    </div>
                    <textarea required rows={3} className="w-full border rounded-md px-3 py-2 mb-4" placeholder="Describe your experience..." value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setShowRateModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" disabled={submittingRating} className="bg-nigeria-green text-white px-6 py-2 rounded-md font-bold">{submittingRating ? '...' : 'Submit'}</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;