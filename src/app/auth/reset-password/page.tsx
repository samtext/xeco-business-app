'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Lock, Eye, EyeOff, Check, Shield } from 'lucide-react';

// Separate component that uses useSearchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or expired reset link.');
    }
  }, [token]);

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allRequirementsMet) {
      setError('Please meet all password requirements.');
      return;
    }
    
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      console.log('Password reset:', { token, password });
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  // Invalid token view
  if (!tokenValid) {
    return (
      <>
        {/* White Form Section */}
        <div className="px-6 py-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Invalid or Expired Link</h2>
              <p className="text-gray-500 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>

            <Link
              href="/auth/forgot-password"
              className="block w-full bg-[#8B1D1D] text-white text-center py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* White Form Section */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#8B1D1D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-[#8B1D1D]" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create New Password</h2>
                <p className="text-gray-500">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">NEW PASSWORD:</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      required
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Password must contain:</p>
                  <ul className="space-y-1.5">
                    <li className="flex items-center gap-2 text-xs">
                      <Check className={`w-3.5 h-3.5 ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-300'}`} />
                      <span className={passwordRequirements.minLength ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs">
                      <Check className={`w-3.5 h-3.5 ${passwordRequirements.hasUpper ? 'text-green-600' : 'text-gray-300'}`} />
                      <span className={passwordRequirements.hasUpper ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        One uppercase letter (A-Z)
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs">
                      <Check className={`w-3.5 h-3.5 ${passwordRequirements.hasLower ? 'text-green-600' : 'text-gray-300'}`} />
                      <span className={passwordRequirements.hasLower ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        One lowercase letter (a-z)
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs">
                      <Check className={`w-3.5 h-3.5 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-300'}`} />
                      <span className={passwordRequirements.hasNumber ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        One number (0-9)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CONFIRM PASSWORD:</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      required
                      placeholder="Confirm new password"
                      className={`w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D] ${
                        confirmPassword && !passwordsMatch ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>✕</span> Passwords do not match
                    </p>
                  )}
                  {confirmPassword && passwordsMatch && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!allRequirementsMet || !passwordsMatch || isLoading}
                  className="w-full bg-[#8B1D1D] text-white py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetting Password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>

              <p className="text-center text-gray-600">
                Remember your password?{' '}
                <Link href="/auth/signin" className="text-[#8B1D1D] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Password Reset Successful!</h2>
                <p className="text-gray-500 mb-2">
                  Your password has been successfully changed.
                </p>
                <p className="text-sm text-gray-400">
                  You can now sign in with your new password.
                </p>
              </div>

              <Link
                href="/auth/signin"
                className="block w-full bg-[#8B1D1D] text-white text-center py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform mb-4"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Loading fallback for Suspense
function ResetPasswordLoading() {
  return (
    <div className="px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#8B1D1D] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}

// Main page component wrapped in Suspense
export default function ResetPasswordPage() {
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
              
              <h1 className="text-4xl font-bold text-white">NEW PASSWORD</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Wrap useSearchParams component in Suspense */}
      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}