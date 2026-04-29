'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home, Package, Receipt, Settings, User, Menu, X, Store,
  LogOut, Wallet, Building2, BarChart3, Eye, EyeOff, RefreshCw,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xecoflow.onrender.com';

interface FloatData {
  aggregatorFloat: number;
  tillBalance: number;
  kyandaFloat: number;
  statumFloat: number;
}

interface MerchantData {
  fullName: string;
  email: string;
  businessName: string;
  serviceType: string;
  tillNumber: string;
}

// ============================================================================
// 🦴 SKELETON LOADING COMPONENT
// ============================================================================
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style jsx>{`
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { left: -150%; }
          100% { left: 150%; }
        }
      `}</style>

      {/* Header Skeleton */}
      <header className="bg-[#8B1D1D] text-white sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 shimmer" />
              <div className="w-24 h-5 rounded bg-white/10 shimmer" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 shimmer" />
              <div className="w-36 h-9 rounded-lg bg-white/10 shimmer" />
            </div>
          </div>
        </div>
        <div className="px-4 pb-3 space-y-2">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="w-24 h-3 rounded bg-white/10 shimmer mb-2" />
            <div className="w-32 h-6 rounded bg-white/10 shimmer mb-2" />
            <div className="flex gap-3">
              <div className="w-28 h-3 rounded bg-white/10 shimmer" />
              <div className="w-28 h-3 rounded bg-white/10 shimmer" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="w-20 h-3 rounded bg-white/10 shimmer mb-2" />
            <div className="w-28 h-5 rounded bg-white/10 shimmer" />
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-20">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="w-20 h-3 rounded bg-gray-200 shimmer mb-3" />
              <div className="w-28 h-6 rounded bg-gray-200 shimmer mb-2" />
              <div className="w-16 h-3 rounded bg-gray-200 shimmer" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-100">
            <div className="w-8 h-8 rounded-full bg-red-100 shimmer" />
            <div className="w-16 h-4 rounded bg-red-100 shimmer" />
          </div>
          <div className="p-3 space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-red-100 shimmer shrink-0" />
                <div className="flex-1">
                  <div className="w-32 h-4 rounded bg-red-100 shimmer mb-1" />
                  <div className="w-24 h-3 rounded bg-red-100 shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-36 h-4 rounded bg-gray-200 shimmer" />
            <div className="w-16 h-3 rounded bg-gray-200 shimmer" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 shimmer shrink-0" />
                  <div>
                    <div className="w-24 h-4 rounded bg-gray-200 shimmer mb-1" />
                    <div className="w-20 h-3 rounded bg-gray-200 shimmer" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-4 rounded bg-gray-200 shimmer mb-1" />
                  <div className="w-16 h-3 rounded bg-gray-200 shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Nav Skeleton */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1 px-3 py-1">
              <div className="w-5 h-5 rounded bg-gray-200 shimmer" />
              <div className="w-8 h-2 rounded bg-gray-200 shimmer" />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [merchant, setMerchant] = useState<MerchantData>({
    fullName: '',
    email: '',
    businessName: '',
    serviceType: 'airtime',
    tillNumber: '',
  });
  const [floatData, setFloatData] = useState<FloatData>({ 
    aggregatorFloat: 0, 
    tillBalance: 0,
    kyandaFloat: 0,
    statumFloat: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [serviceType, setServiceType] = useState('airtime');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    loadAllData(token);
  }, []);

  const fetchFloatOnly = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    setIsRefreshing(true);
    try {
      const floatRes = await fetch(`${API_URL}/api/v1/merchant/float`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const floatJson = await floatRes.json();
      
      if (floatJson.success) {
        setFloatData({
          aggregatorFloat: floatJson.data.aggregatorFloat || 0,
          tillBalance: floatJson.data.tillBalance || 0,
          kyandaFloat: floatJson.data.kyandaFloat || 0,
          statumFloat: floatJson.data.statumFloat || 0,
        });
      }
    } catch (e) {
      console.error('Refresh failed:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadAllData = async (token: string) => {
    try {
      const meRes = await fetch(`${API_URL}/api/v1/merchant/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meJson = await meRes.json();
      
      if (meJson.success) {
        const d = meJson.data;
        const type = d.business?.serviceType === 'AIRTIME_AUTOMATION' ? 'airtime' : 'payment_collection';
        setMerchant({
          fullName: d.fullName || 'Samuel',
          email: d.email || '',
          businessName: d.business?.businessName || 'Sam Airtime Shop',
          serviceType: type,
          tillNumber: d.business?.tillNumber || '4049263',
        });
        setServiceType(type);
        localStorage.setItem('serviceType', type);
      }

      await fetchFloatOnly();
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const isAirtime = serviceType === 'airtime';
  const headerBg = 'bg-[#8B1D1D]';
  const avatarBg = 'bg-[#8B1D1D]';
  const badgeBg = isAirtime ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';
  const badgeLabel = isAirtime ? '📡 Airtime Reseller' : '💳 Payment Collection';
  const homePath = isAirtime ? '/dashboard/airtime' : '/dashboard/payments';
  
  // UPDATED: Hide header on Store AND Transactions page
  const hideHeader = pathname === '/dashboard/store' || pathname === '/dashboard/transactions';
  
  const isFullScreen = pathname === '/dashboard/profile';

  const formatBalance = (amount: number) => {
    if (!showBalance) return 'KES ****';
    return `KES ${amount.toLocaleString()}`;
  };

  const bottomNavItems = [
    { key: 'home', icon: Home, label: 'Home', href: homePath, active: pathname === homePath },
    { key: 'store', icon: Package, label: 'Store', href: '/dashboard/store', active: pathname === '/dashboard/store' },
    { key: 'orders', icon: Receipt, label: 'Orders', href: '/dashboard/transactions', active: pathname === '/dashboard/transactions' },
    { key: 'settings', icon: Settings, label: 'Settings', href: '/dashboard/settings', active: pathname === '/dashboard/settings' },
    { key: 'profile', icon: User, label: 'Profile', href: '/dashboard/profile', active: pathname === '/dashboard/profile' },
  ];

  // Updated sidebar items - dashboard specific, removed bottom-nav duplicates
  const sidebarItems: { key: string; icon: any; label: string; href: string }[] = [
    { key: 'transactions', icon: Receipt, label: 'Transaction History', href: '/dashboard/transactions' },
    { key: 'earnings', icon: Wallet, label: 'My Earnings', href: '/dashboard/earnings' },
    { key: 'float-mgmt', icon: RefreshCw, label: 'Float Management', href: '/dashboard/float-management' },
    { key: 'add-business', icon: Building2, label: 'Add Another Business', href: '/dashboard/add-business' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/signin');
  };

  if (isFullScreen) return <div className="min-h-screen bg-white">{children}</div>;

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

  // 🦴 SHOW SKELETON WHILE LOADING
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className={`${headerBg} text-white sticky top-0 z-50`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSidebar(!showSidebar)} className="p-1 hover:bg-white/10 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold tracking-tight">XECOFLOW</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchFloatOnly} disabled={isRefreshing} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Refresh balances">
                <RefreshCw className={`w-4 h-4 text-white/70 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                <Store className="w-3.5 h-3.5" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[120px]">{merchant.businessName}</span>
                  <span className="text-[10px] text-white/50">Till: {merchant.tillNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isAirtime ? (
          <div className="px-4 pb-3 space-y-2">
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1"><Wallet className="w-4 h-4 text-white/60" /><p className="text-xs text-white/60">Airtime Float</p></div>
              <p className="text-xl font-bold">{formatBalance(floatData.aggregatorFloat)}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400" /><span className="text-white/60">Kyanda: {formatBalance(floatData.kyandaFloat).replace('KES ', '')}</span></div>
                <div className="text-white/30">|</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-white/60">Statum: {formatBalance(floatData.statumFloat).replace('KES ', '')}</span></div>
              </div>
              <button onClick={() => setShowBalance(!showBalance)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5">
                {showBalance ? <Eye className="w-5 h-5 text-white/70" /> : <EyeOff className="w-5 h-5 text-white/70" />}
              </button>
            </div>
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1"><Building2 className="w-4 h-4 text-white/60" /><p className="text-xs text-white/60">Till Balance</p></div>
              <p className="text-lg font-semibold">{formatBalance(floatData.tillBalance)}</p>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-3">
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1"><Wallet className="w-4 h-4 text-white/60" /><p className="text-xs text-white/60">Float Balance</p></div>
              <p className="text-xl font-bold">{formatBalance(floatData.tillBalance)}</p>
              <button onClick={() => setShowBalance(!showBalance)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5">
                {showBalance ? <Eye className="w-5 h-5 text-white/70" /> : <EyeOff className="w-5 h-5 text-white/70" />}
              </button>
            </div>
          </div>
        )}
      </header>

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
                <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center text-white font-bold`}>{merchant.fullName.charAt(0)}</div>
                <div><p className="font-semibold text-gray-900">{merchant.fullName}</p><p className="text-xs text-gray-500">{merchant.businessName}</p></div>
              </div>
              {isAirtime ? (
                <div className="space-y-1"><div className="flex justify-between text-sm"><span className="text-gray-500">Airtime Float:</span><span className="font-semibold">{formatBalance(floatData.aggregatorFloat)}</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Till:</span><span className="font-semibold">{formatBalance(floatData.tillBalance)}</span></div></div>
              ) : (
                <div className="flex justify-between text-sm"><span className="text-gray-500">Float:</span><span className="font-semibold">{formatBalance(floatData.tillBalance)}</span></div>
              )}
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${badgeBg}`}>{badgeLabel}</span>
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => { const Icon = item.icon; return (
                <Link key={item.key} href={item.href} onClick={() => setShowSidebar(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${pathname === item.href ? 'bg-[#8B1D1D]/10 text-[#8B1D1D] font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Icon className="w-5 h-5" /><span className="text-sm">{item.label}</span>
                </Link>
              );})}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full"><LogOut className="w-5 h-5" /><span className="text-sm font-medium">Sign Out</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}