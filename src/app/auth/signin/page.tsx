'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xecoflow.onrender.com';

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Call backend login endpoint
      const response = await fetch(`${API_URL}/api/v1/merchant/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Store token and merchant info
      const { token, merchant } = data.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('merchantId', merchant.id);
      localStorage.setItem('merchantName', merchant.fullName);
      localStorage.setItem('businessName', merchant.businessName);
      localStorage.setItem('merchantEmail', merchant.email);
      localStorage.setItem('merchantPin', merchant.pinCode);
      localStorage.setItem('verificationEmail', merchant.email);
      
      // Map service type
      const serviceType = merchant.serviceType === 'AIRTIME_AUTOMATION' ? 'airtime' : 'payment_collection';
      localStorage.setItem('serviceType', serviceType);

      // ✅ Use sessionStorage to prevent duplicate requests across React Strict Mode mounts
      const requestKey = `send_code_${merchant.id}`;
      const requestSent = sessionStorage.getItem(requestKey);
      
      if (!requestSent) {
        sessionStorage.setItem(requestKey, 'true');
        
        // 2. Send verification code
        fetch(`${API_URL}/api/v1/merchant/auth/send-code`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            merchantId: merchant.id,
            email: merchant.email 
          }),
        }).catch(err => console.error('Background email send failed:', err));
        
        // Clear session storage after 30 seconds (allow resend if needed)
        setTimeout(() => {
          sessionStorage.removeItem(requestKey);
        }, 30000);
      }
      
      // 3. Immediately redirect to PIN verification page
      console.log('➡️ Redirecting to verification page...');
      router.push(`/auth/verify?email=${encodeURIComponent(merchant.email)}`);

    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Red Header Section */}
      <div className="relative overflow-hidden bg-[#8B1D1D]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A02323] to-[#701616]" />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-[15vw] font-black text-white/5 select-none">XECO</h1>
        </div>

        <div className="relative z-10 pt-12 pb-8 px-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              
              <h1 className="text-4xl font-bold text-white">SIGN IN</h1>
            </div>
          </div>
        </div>
      </div>

      {/* White Form Section */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Continue to sign in!</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">USERNAME:</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">PASSWORD:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="********"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                required
              />
            </div>

            <div className="text-right mb-4">
              <Link 
                href="/auth/forgot-password" 
                className="text-[#8B1D1D] text-sm font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#8B1D1D] border-gray-300 rounded focus:ring-[#8B1D1D]"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Remember me and keep me logged in
                </span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8B1D1D] text-white py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-600">
            Don't have an Account?{' '}
            <Link href="/auth/signup" className="text-[#8B1D1D] font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}