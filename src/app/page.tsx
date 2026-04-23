'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#8B1D1D]">
      {/* Background Gradient Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A02323] to-[#701616]" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Faded Watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[20vw] font-black text-white/5 select-none transform -rotate-12">
          XECO
        </h1>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between py-16 px-6">
        
        {/* Top Logo Area */}
        <div className="w-full flex justify-start">
          <div className="flex flex-col items-start">
            <div className="w-12 h-1 bg-white mb-1" />
            <h1 className="text-xl font-black text-white tracking-tighter uppercase">
              Xeco
            </h1>
          </div>
        </div>

        {/* Center Text Area */}
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-3 leading-tight tracking-tight">
            One Dashboard.<br />Multiple M-Pesa Channels.
          </h2>
          <p className="text-white/70 text-sm font-medium mb-8">
            Aggregate all your tills, automate airtime delivery, and accept STK payments—all from one backend.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-white/90 text-xs border border-white/20">
              💳 Multi-Till Support
            </span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-white/90 text-xs border border-white/20">
              ⚡ Airtime Automation
            </span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-white/90 text-xs border border-white/20">
              🔗 STK Push Ready
            </span>
          </div>
        </div>

        {/* Bottom Actions Area */}
        <div className="w-full max-w-sm space-y-4">
          <p className="text-white/50 text-[10px] text-center uppercase tracking-widest mb-2">
            Join 100+ merchants using XecoFlow
          </p>
          
          <Link
            href="/auth/signup"
            className="block w-full bg-white text-[#8B1D1D] text-center py-3.5 rounded-lg font-bold shadow-xl active:scale-95 transition-transform"
          >
            Create Business Account
          </Link>

          <Link
            href="/auth/signin"
            className="block w-full bg-transparent text-white text-center py-3.5 rounded-lg font-bold border-2 border-white/80 hover:bg-white/5 active:scale-95 transition-all"
          >
            Sign In
          </Link>

          {/* Trust Layer */}
          <p className="text-white/60 text-xs text-center pt-2">
            🔒 Powered by Safaricom Daraja API • Real-time settlements
          </p>
        </div>
      </div>
    </div>
  );
}