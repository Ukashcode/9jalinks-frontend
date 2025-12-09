import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Loader2 } from 'lucide-react';
import { Api } from '../services/api'; // ✅ CORRECT IMPORT

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // ✅ Correct Usage: Api.submitContactForm
      await Api.submitContactForm({ email, message: "Newsletter Subscription" });
      alert("Thanks for contacting us!");
      setEmail('');
    } catch (error) {
      alert("Failed to send message. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-nigeria-green">9ja</span>
                <span className="text-2xl font-bold text-white">links</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting buyers and sellers across Nigeria. Fast, secure, and reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-nigeria-green">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Terms & Condition</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Safety Tips</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-nigeria-green">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 text-nigeria-green" />
                <span>Kano, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-nigeria-green" />
                <span>+234 9044086596</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-nigeria-green" />
                <span>support@9jalinks.ng</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
             <h3 className="text-lg font-semibold mb-4 text-nigeria-green">Follow Us</h3>
             <div className="flex space-x-4 mb-6">
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-nigeria-green transition"><Facebook size={20} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-nigeria-green transition"><Instagram size={20} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-nigeria-green transition"><Twitter size={20} /></a>
             </div>
             <div className="mt-4">
               <h4 className="text-sm font-semibold mb-2">Send us a message</h4>
               <form onSubmit={handleSubscribe} className="flex">
                 <input 
                    type="text" 
                    
                    className="bg-gray-800 text-white px-3 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-nigeria-green"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                 />
                 <button disabled={loading} className="bg-nigeria-green px-3 py-2 rounded-r-md hover:bg-green-700 font-bold disabled:opacity-50">
                   {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send'}
                 </button>
               </form>
             </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} 9jalinks. All rights reserved. Made for Nigeria 🇳🇬
        </div>
      </div>
    </footer>
  );
};

export default Footer;