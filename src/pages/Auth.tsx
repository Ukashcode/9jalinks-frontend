import React, { useState, useEffect } from 'react';
import { Api } from '../services/api';
import { User } from '../types';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Store, ArrowLeft } from 'lucide-react';

interface AuthProps {
  type: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
  onNavigate: (page: string) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot_password' | 'reset_password' | 'otp';

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
        // 1. Create the user on the backend (sends OTP email)
        await Api.signup({ name, email, password, role: isSeller ? 'SELLER' : 'BUYER' });
        setMode('otp');
        // removed the mock alert here
      } else if (mode === 'login') {
        const response = await Api.login(email, password);
        onAuthSuccess(response.user);
      } else if (mode === 'forgot_password') {
        alert("Not configured in demo.");
        setMode('login');
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
      // 2. Verify using only Email and OTP
      // (We removed 'userData' here to fix the TypeScript error)
      const response = await Api.verifyOtp({ email, otp });
      onAuthSuccess(response.user);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'otp': return 'Verify Email';
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot_password': return 'Forgot Password';
      default: return 'Authentication';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl relative border border-gray-100">
        
        {/* Back Button */}
        {(mode !== 'login' && mode !== 'signup') && (
           <button onClick={() => setMode('login')} className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition">
             <ArrowLeft size={24} />
           </button>
        )}

        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
             <UserIcon className="h-6 w-6 text-nigeria-green" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{getTitle()}</h2>
          <p className="mt-2 text-sm text-gray-500">
             {mode === 'login' ? 'Sign in to access your dashboard' : 'Join the biggest market in Nigeria'}
          </p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center border border-red-100 font-medium">{error}</div>}

        {mode === 'otp' ? (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div className="text-center text-sm text-gray-600 mb-4">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </div>
            <input type="text" required className="block w-full px-3 py-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-nigeria-green focus:border-transparent text-center text-2xl tracking-[1em] font-mono" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-nigeria-green hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-gray-400" /></div>
                  <input name="name" type="text" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigeria-green focus:border-transparent sm:text-sm transition-shadow" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input name="email" type="email" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigeria-green focus:border-transparent sm:text-sm transition-shadow" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input name="password" type={showPassword ? "text" : "password"} required className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigeria-green focus:border-transparent sm:text-sm transition-shadow" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div onClick={() => setIsSeller(false)} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${!isSeller ? 'border-nigeria-green bg-green-50 ring-1 ring-nigeria-green' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <UserIcon size={24} className={!isSeller ? 'text-nigeria-green' : 'text-gray-400'} />
                    <span className={`mt-2 text-xs font-bold ${!isSeller ? 'text-nigeria-green' : 'text-gray-500'}`}>Buyer</span>
                  </div>
                  <div onClick={() => setIsSeller(true)} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${isSeller ? 'border-nigeria-green bg-green-50 ring-1 ring-nigeria-green' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <Store size={24} className={isSeller ? 'text-nigeria-green' : 'text-gray-400'} />
                    <span className={`mt-2 text-xs font-bold ${isSeller ? 'text-nigeria-green' : 'text-gray-500'}`}>Seller</span>
                  </div>
                </div>
              )}
            </div>

            {mode === 'login' && (
                 <div className="flex justify-end">
                   <button type="button" onClick={() => setMode('forgot_password')} className="text-sm font-medium text-nigeria-green hover:text-green-700">Forgot password?</button>
                 </div>
            )}

            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-nigeria-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nigeria-green disabled:opacity-50 shadow-lg transition-all transform hover:-translate-y-0.5">
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">{mode === 'login' ? "New to 9jalinks? " : "Already have an account? "}</span>
              <button type="button" onClick={() => { setError(''); onNavigate(mode === 'login' ? 'signup' : 'login'); }} className="text-sm font-bold text-nigeria-green hover:underline">
                {mode === 'login' ? 'Sign up now' : 'Log in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;