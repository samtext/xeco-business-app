'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home, Package, Receipt, Settings, User, Menu, X, Store,
  LogOut, Wallet, Building2, BarChart3, Eye, EyeOff, TrendingUp,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xecoflow.onrender.com';

// Types
type ServiceType = 'airtime' | 'payment_collection';

interface Business {
  businessName: string;
  serviceType: ServiceType;
  tillNumber: string;
  aggregatorFloat?: number;
  tillBalance: number;
}

interface Merchant {
  fullName: string;
  email: string;
  business: Business;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  
  // 🆕 Real data from API
  const [merchant, setMerchant] = useState<Merchant>({
    fullName: 'Loading...',
    email: '',
    business: { businessName: 'Loading...', serviceType: 'airtime', tillNumber: '...', tillBalance: 0 },
  });
  const [floatData, setFloatData] = useState({ aggregatorFloat: 0, tillBalance: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const serviceType = localStorage.getItem('serviceType') as ServiceType || 'airtime';
  const isAirtime = serviceType === 'airtime';

  // 🆕 Fetch real data on mount
  useEffect(() => {
    fetchMerchantData();
    fetchFloatData();
  }, []);

  const fetchMerchantData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/api/v1/merchant/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        const d = json.data;
        setMerchant({
          fullName: d.fullName,
          email: d.email,
          business: {
            businessName: d.business.businessName,
            serviceType: d.business.serviceType === 'AIRTIME_AUTOMATION' ? 'airtime' : 'payment_collection',
            tillNumber: d.business.tillNumber,
            tillBalance: 0,
          },
        });
        localStorage.setItem('serviceType', d.business.serviceType === 'AIRTIME_AUTOMATION' ? 'airtime' : 'payment_collection');
      }
    } catch (e) {
      console.log('Merchant fetch failed, using defaults');
    }
  };

  const fetchFloatData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/api/v1/merchant/float`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setFloatData(json.data);
      }
    } catch (e) {
      console.log('Float fetch failed, using defaults');
    }
    setIsLoading(false);
  };

  const { business } = merchant;
  const { fullName } = merchant;

  const headerBg = 'bg-[#8B1D1D]';
  const avatarBg = 'bg-[#8B1D1D]';
  const badgeBg = isAirtime ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';
  const badgeLabel = isAirtime ? '📡 Airtime Reseller' : '💳 Payment Collection';
  const homePath = isAirtime ? '/dashboard/airtime' : '/dashboard/payments';
  const hideHeader = pathname === '/dashboard/store';
  const isFullScreen = pathname === '/dashboard/profile';

  const formatBalance = (amount: number) => {
    if (showBalance) return `KES ${amount.toLocaleString()}`;
    return 'KES ****';
  };

  // Bottom navigation
  const bottomNavItems = [
    { key: 'home', icon: Home, label: 'Home', href: homePath, active: pathname === homePath },
    { key: 'store', icon: Package, label: 'Store', href: '/dashboard/store', active: pathname === '/dashboard/store' },
    { key: 'orders', icon: Receipt, label: 'Orders', href: '/dashboard/transactions', active: pathname === '/dashboard/transactions' },
    { key: 'settings', icon: Settings, label: 'Settings', href: '/dashboard/settings', active: pathname === '/dashboard/settings' },
    { key: 'profile', icon: User, label: 'Profile', href: '/dashboard/profile', active: pathname === '/dashboard/profile' },
  ];

  // Sidebar
  const sidebarItems: { key: string; icon: any; label: string; href: string }[] = [
    { key: 'home', icon: Home, label: 'Home', href: homePath },
    { key: 'store', icon: Package, label: 'Store', href: '/dashboard/store' },
    ...(isAirtime
      ? [{ key: 'orders', icon: Receipt, label: 'Order History', href: '/dashboard/transactions' }]
      : [
          { key: 'payments', icon: Receipt, label: 'Payments', href: '/dashboard/payments' },
          { key: 'reports', icon: BarChart3, label: 'Reports', href: '/dashboard/stats' },
        ]),
    { key: 'settings', icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/signin');
  };

  // Full screen pages
  if (isFullScreen) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  // Store page (no header)
  if (hideHeader) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1 overflow-y-auto pb-20">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex items-center justify-around px-2 py-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.key} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${item.active ? 'text-[#8B1D1D]' : 'text-gray-400'}`}>
                  <Icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  // 🆕 Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8B1D1D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top App Bar */}
      <header className={`${headerBg} text-white sticky top-0 z-50`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSidebar(!showSidebar)} className="p-1 hover:bg-white/10 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold tracking-tight">XECOFLOW</h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
              <Store className="w-3.5 h-3.5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[120px] leading-tight">{business.businessName}</span>
                <span className="text-[10px] text-white/50 leading-tight">Till: {business.tillNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🆕 Real Balance Display */}
        {isAirtime && (
          <div className="px-4 pb-3 space-y-2">
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-white/60" />
                <p className="text-xs text-white/60">Airtime Float</p>
              </div>
              <p className="text-xl font-bold">{formatBalance(floatData.aggregatorFloat)}</p>
              <button onClick={() => setShowBalance(!showBalance)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5">
                {showBalance ? <Eye className="w-5 h-5 text-white/70" /> : <EyeOff className="w-5 h-5 text-white/70" />}
              </button>
            </div>
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-white/60" />
                <p className="text-xs text-white/60">Till Balance</p>
              </div>
              <p className="text-lg font-semibold">{formatBalance(floatData.tillBalance)}</p>
            </div>
          </div>
        )}

        {!isAirtime && (
          <div className="px-4 pb-3">
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-white/60" />
                <p className="text-xs text-white/60">Float Balance</p>
              </div>
              <p className="text-xl font-bold">{formatBalance(floatData.tillBalance)}</p>
              <button onClick={() => setShowBalance(!showBalance)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5">
                {showBalance ? <Eye className="w-5 h-5 text-white/70" /> : <EyeOff className="w-5 h-5 text-white/70" />}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.key} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${item.active ? 'text-[#8B1D1D]' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
          <div className="relative w-72 bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center text-white font-bold`}>{fullName.charAt(0)}</div>
                <div><p className="font-semibold text-gray-900">{fullName}</p><p className="text-xs text-gray-500">{business.businessName}</p></div>
              </div>
              {isAirtime && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Aggregator:</span><span className="font-semibold">{formatBalance(floatData.aggregatorFloat)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Till:</span><span className="font-semibold">{formatBalance(floatData.tillBalance)}</span></div>
                </div>
              )}
              {!isAirtime && (
                <div className="flex justify-between text-sm"><span className="text-gray-500">Float:</span><span className="font-semibold">{formatBalance(floatData.tillBalance)}</span></div>
              )}
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${badgeBg}`}>{badgeLabel}</span>
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.key} href={item.href} onClick={() => setShowSidebar(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${pathname === item.href ? 'bg-[#8B1D1D]/10 text-[#8B1D1D] font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Icon className="w-5 h-5" /><span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-sm font-semibold text-yellow-900 mb-1">Multiple Businesses?</p>
                <p className="text-xs text-yellow-700 mb-3">Each business requires a separate account.</p>
                <button disabled className="w-full py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium cursor-not-allowed opacity-60">+ Add Another Business (Coming Soon)</button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full"><LogOut className="w-5 h-5" /><span className="text-sm font-medium">Sign Out</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}