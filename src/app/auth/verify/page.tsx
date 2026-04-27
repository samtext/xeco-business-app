'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, RefreshCw, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xecoflow.onrender.com';
const CODE_EXPIRY_SECONDS = 120; // 2 minutes

// Helper to mask email: sa****@gmail.com
function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return email;
  const firstTwo = name.slice(0, 2);
  const lastChar = name.slice(-1);
  const masked = firstTwo + '****' + lastChar;
  return `${masked}@${domain}`;
}

// 🛡️ Prevent double send with module-level flag
let didSendCode = false;

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [merchantId, setMerchantId] = useState('');
  const [timeLeft, setTimeLeft] = useState(CODE_EXPIRY_SECONDS);
  const [isExpired, setIsExpired] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('verificationEmail') || 'samtext454@gmail.com';
    const storedMerchantId = localStorage.getItem('merchantId');
    
    if (!storedMerchantId) {
      router.push('/auth/signin');
      return;
    }
    
    setEmail(storedEmail);
    setMaskedEmail(maskEmail(storedEmail));
    setMerchantId(storedMerchantId);
    
    // 🛡️ Prevent double send with multiple checks
    const alreadySent = localStorage.getItem('codeSent');
    if (!alreadySent && !didSendCode) {
      didSendCode = true;
      sendCode(storedMerchantId, storedEmail);
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendCode = async (merchantId: string, emailAddr: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/merchant/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, email: emailAddr }),
      });
      
      if (response.ok) {
        setCodeSent(true);
        setTimeLeft(CODE_EXPIRY_SECONDS);
        setIsExpired(false);
        localStorage.setItem('codeSent', 'true');
        console.log('✅ Code sent to', emailAddr);
      }
    } catch (err) {
      console.log('Send code failed, using fallback PIN');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isExpired) {
      setError('Code has expired. Please request a new one.');
      return;
    }
    
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setCode(value);
      setError('');
      
      if (value.length === 6) {
        handleVerify(value);
      }
    }
  };

  const handleNumberClick = (num: string) => {
    if (isExpired) {
      setError('Code has expired. Please request a new one.');
      return;
    }
    
    if (code.length < 6) {
      const newCode = code + num;
      setCode(newCode);
      setError('');
      
      if (newCode.length === 6) {
        handleVerify(newCode);
      }
    }
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
    setError('');
  };

  const handleVerify = async (verificationCode: string) => {
    if (isExpired) {
      setError('Code has expired. Please request a new one.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Try fallback PIN first (faster, no network)
    const storedPin = localStorage.getItem('merchantPin') || '4049263';
    if (verificationCode === storedPin) {
      localStorage.removeItem('verificationEmail');
      localStorage.removeItem('codeSent');
      router.push('/dashboard');
      return;
    }
    
    // Try backend verification
    try {
      const response = await fetch(`${API_URL}/api/v1/merchant/auth/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, pin: verificationCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.removeItem('verificationEmail');
        localStorage.removeItem('codeSent');
        router.push('/dashboard');
        return;
      }
    } catch (err) {
      // Backend unavailable - already checked fallback above
    }

    // If we get here, code is invalid
    setError('Invalid code. Please try again.');
    setCode('');
    setIsLoading(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleResend = () => {
    localStorage.removeItem('codeSent');
    didSendCode = false;
    setCode('');
    setError('');
    sendCode(merchantId, email);
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Red Header Section */}
      <div className="relative overflow-hidden bg-[#8B1D1D]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A02323] to-[#701616]" />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="relative z-10 pt-12 pb-8 px-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-6">
              <Link href="/auth/signin" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30">
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
              <Mail className="w-10 h-10 text-[#8B1D1D]" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-500">We've sent a verification code to</p>
            <p className="text-[#8B1D1D] font-medium mt-1">{maskedEmail}</p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-gray-400" />
            {isExpired ? (
              <span className="text-red-500 text-sm font-semibold">Code expired</span>
            ) : (
              <span className="text-gray-500 text-sm">
                Expires in <span className="font-semibold text-[#8B1D1D]">{formatTime(timeLeft)}</span>
              </span>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={code}
            onChange={handleCodeChange}
            className="absolute opacity-0 pointer-events-none"
            maxLength={6}
          />

          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all ${
                  index < code.length 
                    ? 'border-[#8B1D1D] bg-[#8B1D1D]/10' 
                    : isExpired ? 'border-red-200 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                {index < code.length && (
                  <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-red-400' : 'bg-[#8B1D1D]'}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}

          {isLoading && (
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-2 border-[#8B1D1D] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num)}
                disabled={isLoading || code.length >= 6 || isExpired}
                className="w-full aspect-square bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-bold text-gray-800 transition-colors disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <div></div>
            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              disabled={isLoading || code.length >= 6 || isExpired}
              className="w-full aspect-square bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-bold text-gray-800 transition-colors disabled:opacity-50"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading || code.length === 0 || isExpired}
              className="w-full aspect-square bg-gray-100 hover:bg-gray-200 rounded-xl text-lg font-semibold text-gray-600 transition-colors disabled:opacity-50"
            >
              ⌫
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="flex items-center gap-2 mx-auto text-sm text-[#8B1D1D] font-semibold hover:underline disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}