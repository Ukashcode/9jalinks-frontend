import React, { useState, useEffect } from 'react';
import { Api } from '../services/api';
import { User } from '../types';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Store, ArrowLeft } from 'lucide-react';

interface AuthProps {
  type: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
  onNavigate: (page: string) => void;
}

type AuthMode = 'login' | 'signup' | 'otp';

const Auth: React.FC<AuthProps> = ({ type, onAuthSuccess, onNavigate }) => {
  const [mode, setMode] = useState<AuthMode>(type);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => { setMode(type); setError(''); }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // 1. Send data to backend (Trigger Email)
        await Api.signup({ name, email, password, role: isSeller ? 'SELLER' : 'BUYER' });
        // 2. Switch to OTP mode
        setMode('otp');
      } else if (mode === 'login') {
        const response = await Api.login(email, password);
        onAuthSuccess(response.user);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 3. Verify Code with Backend
      const response = await Api.verifyOtp({ email, otp });
      onAuthSuccess(response.user);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative">
        
        {/* Back Button */}
        {(mode === 'otp') && (
           <button onClick={() => setMode('login')} className="absolute top-6 left-6 text-gray-400 hover:text-gray-600">
             <ArrowLeft size={24} />
           </button>
        )}

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          {mode === 'otp' ? 'Verify Email' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-center text-sm">{error}</div>}

        {mode === 'otp' ? (
          <form className="space-y-6" onSubmit={handleVerifyOtp}>
            <p className="text-center text-gray-600 text-sm">Enter the code sent to <strong>{email}</strong></p>
            <input type="text" required className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest" 
              placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
            <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                <input name="name" type="text" required className="w-full pl-10 p-3 border rounded-lg" 
                  placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="relative">
               <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input name="email" type="email" required className="w-full pl-10 p-3 border rounded-lg" 
                placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="relative">
               <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input name="password" type={showPassword ? "text" : "password"} required className="w-full pl-10 pr-10 p-3 border rounded-lg" 
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="absolute right-3 top-3 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {mode === 'signup' && (
              <div className="flex gap-4">
                <div onClick={() => setIsSeller(false)} className={`flex-1 p-3 border rounded cursor-pointer flex flex-col items-center ${!isSeller ? 'border-green-600 bg-green-50' : ''}`}>
                  <UserIcon size={20} className={!isSeller ? 'text-green-600' : 'text-gray-400'} />
                  <span className="text-xs font-bold mt-1">Buyer</span>
                </div>
                <div onClick={() => setIsSeller(true)} className={`flex-1 p-3 border rounded cursor-pointer flex flex-col items-center ${isSeller ? 'border-green-600 bg-green-50' : ''}`}>
                  <Store size={20} className={isSeller ? 'text-green-600' : 'text-gray-400'} />
                  <span className="text-xs font-bold mt-1">Seller</span>
                </div>
              </div>
            )}

            <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>

            <div className="text-center mt-4">
              <button type="button" onClick={() => { setError(''); onNavigate(mode === 'login' ? 'signup' : 'login'); }} className="text-sm font-bold text-green-600 hover:underline">
                {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;