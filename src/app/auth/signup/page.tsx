'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Shield, Lock, FileText } from 'lucide-react';

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  
  // Step 1: Identity Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2: Business Fields
  const [businessName, setBusinessName] = useState('');
  const [mpesaTill, setMpesaTill] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [kraPin, setKraPin] = useState('');
  
  // Step 3: Review & Terms
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToDataProcessing, setAgreeToDataProcessing] = useState(false);
  const [agreeToMpesa, setAgreeToMpesa] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Submit registration
      console.log('Registration Complete:', { 
        fullName, email, phone, password, 
        businessName, mpesaTill, businessCategory, kraPin,
        agreements: { agreeToTerms, agreeToDataProcessing, agreeToMpesa }
      });
      // Redirect to dashboard or success page
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Red Header Section */}
      <div className="relative overflow-hidden bg-[#8B1D1D]">
        {/* Background Gradient Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A02323] to-[#701616]" />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        {/* Faded Watermark */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-[15vw] font-black text-white/5 select-none">
            XECO
          </h1>
        </div>

        {/* Header Content */}
        <div className="relative z-10 pt-12 pb-8 px-6">
          <div className="max-w-md mx-auto">
            {/* Back Arrow and Title Row */}
            <div className="flex items-center gap-6">
              <Link 
                href="/auth" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              
              <h1 className="text-4xl font-bold text-white">SIGN UP</h1>
            </div>
          </div>
        </div>
      </div>

      {/* White Form Section */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                step > 1 ? 'bg-green-500 text-white' : step === 1 ? 'bg-[#8B1D1D] text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                Identity
              </span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-[#8B1D1D]' : 'bg-gray-300'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                step > 2 ? 'bg-green-500 text-white' : step === 2 ? 'bg-[#8B1D1D] text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                Business
              </span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-[#8B1D1D]' : 'bg-gray-300'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                step === 3 ? 'bg-[#8B1D1D] text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                3
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step === 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                Review
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                {/* Step 1: Identity Details */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">Create Account</h2>
                <p className="text-gray-500 mb-8">Start your business journey today!</p>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">FULL NAME:</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Isaac Kimani"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                </div>

                <div className="mb-4">
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

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PHONE NUMBER:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+254 712 345 678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Should be your M-Pesa registered number</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PASSWORD:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B1D1D] text-white py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform mb-6"
                >
                  Continue to Business Details
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Step 2: Business Details */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">Business Details</h2>
                <p className="text-gray-500 mb-8">Tell us about your business</p>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">BUSINESS NAME:</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    placeholder="Kimani Enterprises Ltd"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">M-PESA TILL / SHORTCODE:</label>
                  <input
                    type="text"
                    value={mpesaTill}
                    onChange={(e) => setMpesaTill(e.target.value)}
                    required
                    placeholder="e.g., 123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your Lipa Na M-Pesa Till Number</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">BUSINESS CATEGORY:</label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  >
                    <option value="">Select category</option>
                    <option value="retail">Retail</option>
                    <option value="airtime">Airtime Vendor</option>
                    <option value="service">Service Provider</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">KRA PIN (Optional):</label>
                  <input
                    type="text"
                    value={kraPin}
                    onChange={(e) => setKraPin(e.target.value)}
                    placeholder="A001234567X"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]"
                  />
                  <p className="text-xs text-gray-500 mt-1">For tax compliance (recommended)</p>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#8B1D1D] text-white py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform"
                  >
                    Continue to Review
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {/* Step 3: Review & Terms */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">Review & Terms</h2>
                <p className="text-gray-500 mb-6">Review your details and accept terms</p>

                {/* Summary Cards */}
                <div className="space-y-4 mb-6">
                  {/* Personal Info Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#8B1D1D]" />
                      Personal Information
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-500">Name:</span> {fullName || '—'}</p>
                      <p><span className="text-gray-500">Email:</span> {email || '—'}</p>
                      <p><span className="text-gray-500">Phone:</span> {phone || '—'}</p>
                    </div>
                  </div>

                  {/* Business Info Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#8B1D1D]" />
                      Business Information
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-500">Business Name:</span> {businessName || '—'}</p>
                      <p><span className="text-gray-500">M-Pesa Till:</span> {mpesaTill || '—'}</p>
                      <p><span className="text-gray-500">Category:</span> {businessCategory || '—'}</p>
                      <p><span className="text-gray-500">KRA PIN:</span> {kraPin || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#8B1D1D]" />
                      Terms & Conditions
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-[#8B1D1D] border-gray-300 rounded focus:ring-[#8B1D1D]"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          I agree to the <button type="button" className="text-[#8B1D1D] hover:underline">Terms of Service</button> and <button type="button" className="text-[#8B1D1D] hover:underline">Privacy Policy</button>
                        </span>
                      </label>

                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeToDataProcessing}
                          onChange={(e) => setAgreeToDataProcessing(e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-[#8B1D1D] border-gray-300 rounded focus:ring-[#8B1D1D]"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          I agree to the processing of my data in accordance with the Kenya Data Protection Act.
                        </span>
                      </label>

                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeToMpesa}
                          onChange={(e) => setAgreeToMpesa(e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-[#8B1D1D] border-gray-300 rounded focus:ring-[#8B1D1D]"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          I authorize Xeco to initiate M-Pesa transactions on my behalf using the provided Till Number.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!agreeToTerms || !agreeToDataProcessing || !agreeToMpesa}
                    className="flex-1 bg-[#8B1D1D] text-white py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Registration
                  </button>
                </div>
              </>
            )}

            {/* Sign In Link */}
            <p className="text-center text-gray-600">
              Already have an Account?{' '}
              <Link href="/auth/signin" className="text-[#8B1D1D] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}