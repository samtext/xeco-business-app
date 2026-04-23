'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send reset password email
    console.log('Reset password for:', email);
    setSubmitted(true);
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
                href="/auth/signin" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              
              <h1 className="text-4xl font-bold text-white">RESET PASSWORD</h1>
            </div>
          </div>
        </div>
      </div>

      {/* White Form Section */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#8B1D1D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#8B1D1D]" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Forgot Password?</h2>
                <p className="text-gray-500">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">EMAIL ADDRESS:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="isaac@business.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B1D1D] text-white py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform mb-6"
                >
                  Send Reset Link
                </button>

                <p className="text-center text-gray-600">
                  Remember your password?{' '}
                  <Link href="/auth/signin" className="text-[#8B1D1D] font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Check Your Email</h2>
                <p className="text-gray-500 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-400">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="text-[#8B1D1D] font-semibold hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>

              <Link
                href="/auth/signin"
                className="block w-full bg-[#8B1D1D] text-white text-center py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform"
              >
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}