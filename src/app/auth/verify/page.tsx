'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Fingerprint, Smartphone } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on hidden input for PIN entry
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setPin(value);
      setError('');
      
      // Auto-submit when 6 digits are entered
      if (value.length === 6) {
        handleVerify(value);
      }
    }
  };

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
      
      if (newPin.length === 6) {
        handleVerify(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleVerify = async (pinCode: string) => {
    setIsLoading(true);
    setError('');
    
    // Simulate PIN verification
    setTimeout(() => {
      // For demo: PIN "123456" is valid
      if (pinCode === '123456') {
        router.push('/dashboard');
      } else {
        setError('Invalid PIN. Please try again.');
        setPin('');
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }, 1000);
  };

  const handleBiometric = () => {
    setIsLoading(true);
    // Simulate biometric verification
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
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
              
              <h1 className="text-4xl font-bold text-white">VERIFY</h1>
            </div>
          </div>
        </div>
      </div>

      {/* White Form Section */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#8B1D1D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-[#8B1D1D]" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Secure Verification</h2>
            <p className="text-gray-500">
              Enter your 6-digit PIN to access your dashboard
            </p>
          </div>

          {/* Hidden Input for PIN */}
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={pin}
            onChange={handlePinChange}
            className="absolute opacity-0 pointer-events-none"
            maxLength={6}
          />

          {/* PIN Display Dots */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all ${
                  index < pin.length 
                    ? 'border-[#8B1D1D] bg-[#8B1D1D]/10' 
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {index < pin.length && (
                  <div className="w-3 h-3 rounded-full bg-[#8B1D1D]" />
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-2 border-[#8B1D1D] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num)}
                disabled={isLoading || pin.length >= 6}
                className="w-full aspect-square bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-bold text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBiometric}
              disabled={isLoading}
              className="w-full aspect-square bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Fingerprint className="w-8 h-8 text-[#8B1D1D]" />
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              disabled={isLoading || pin.length >= 6}
              className="w-full aspect-square bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-bold text-gray-800 transition-colors disabled:opacity-50"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading || pin.length === 0}
              className="w-full aspect-square bg-gray-100 hover:bg-gray-200 rounded-xl text-lg font-semibold text-gray-600 transition-colors disabled:opacity-50"
            >
              ⌫
            </button>
          </div>

          {/* Alternative Verification */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">Or verify with</p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleBiometric}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Fingerprint className="w-4 h-4 text-[#8B1D1D]" />
                <span className="text-sm text-gray-700">Biometric</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#8B1D1D]" />
                <span className="text-sm text-gray-700">SMS Code</span>
              </button>
            </div>
          </div>

          {/* Forgot PIN Link */}
          <p className="text-center mt-6">
            <Link 
              href="/auth/forgot-password" 
              className="text-[#8B1D1D] text-sm font-semibold hover:underline"
            >
              Forgot PIN?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}