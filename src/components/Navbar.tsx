import React, { useState } from 'react';
import { User } from '../types';
import { Menu, X, User as UserIcon, LogOut, ChevronDown, LayoutDashboard, Settings } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNav = (path: string) => {
    setIsOpen(false);
    setProfileOpen(false);
    onNavigate(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            <span className="text-3xl font-extrabold text-nigeria-green tracking-tight">9ja</span>
            <span className="text-3xl font-extrabold text-black tracking-tight">links</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNav('home')} className="text-gray-600 hover:text-nigeria-green font-medium transition-colors">Home</button>
            <button onClick={() => handleNav('about')} className="text-gray-600 hover:text-nigeria-green font-medium transition-colors">About</button>
            <button onClick={() => handleNav('help')} className="text-gray-600 hover:text-nigeria-green font-medium transition-colors">Help</button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-nigeria-green focus:outline-none transition-colors"
                >
                   <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
                     {user.profileImage ? (
                       <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                       <span className="font-bold text-nigeria-green">{user.name.charAt(0).toUpperCase()}</span>
                     )}
                   </div>
                   <span className="font-semibold text-sm">{user.name}</span>
                   <ChevronDown size={16} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleNav('dashboard')} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-nigeria-green flex items-center transition-colors"
                    >
                      {user.role === 'SELLER' ? (
                        <><LayoutDashboard size={16} className="mr-2" /> Seller Dashboard</>
                      ) : (
                        <><Settings size={16} className="mr-2" /> My Profile</>
                      )}
                    </button>
                    
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleNav('login')}
                  className="text-gray-600 hover:text-nigeria-green font-semibold transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNav('signup')}
                  className="bg-nigeria-green text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-md font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-nigeria-green focus:outline-none p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <button onClick={() => handleNav('home')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-nigeria-green hover:bg-green-50 rounded-md">Home</button>
            <button onClick={() => handleNav('about')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-nigeria-green hover:bg-green-50 rounded-md">About</button>
            <button onClick={() => handleNav('help')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-nigeria-green hover:bg-green-50 rounded-md">Help</button>
            
            {user ? (
              <div className="border-t border-gray-100 mt-2 pt-2">
                 <div className="px-3 py-3 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                     {user.profileImage ? (
                       <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                     ) : (
                       <span className="font-bold text-nigeria-green text-lg">{user.name.charAt(0).toUpperCase()}</span>
                     )}
                   </div>
                   <div>
                    <span className="block font-bold text-gray-900">{user.name}</span>
                    <span className="block text-xs text-gray-500">{user.email}</span>
                   </div>
                 </div>
                 
                 <button onClick={() => handleNav('dashboard')} className="block w-full text-left px-3 py-3 text-base font-medium text-nigeria-green bg-green-50 rounded-md mb-2">
                    {user.role === 'SELLER' ? 'Go to Dashboard' : 'View Profile'}
                 </button>
                 
                 <button onClick={onLogout} className="block w-full text-left px-3 py-3 text-base font-medium text-white bg-red-500 hover:bg-red-600 rounded-md">
                    Logout
                 </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 mt-2 pt-4 grid grid-cols-2 gap-3">
                <button onClick={() => handleNav('login')} className="block w-full text-center py-3 text-base font-semibold text-gray-700 border border-gray-300 rounded-lg">Login</button>
                <button onClick={() => handleNav('signup')} className="block w-full text-center py-3 text-base font-bold text-white bg-nigeria-green rounded-lg">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;