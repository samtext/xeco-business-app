'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Package,
  Receipt,
  Settings,
  User,
  Menu,
  X,
  Store,
  LogOut,
  Wallet,
  Building2,
  BarChart3,
  Eye,
  EyeOff,
} from 'lucide-react';

// Types
type ServiceType = 'payment_collection' | 'airtime';

interface Business {
  id: string;
  businessName: string;
  serviceType: ServiceType;
  tillNumber: string;
  aggregatorFloat?: number;
  tillBalance: number;
  accountBalance: number;
}

interface Merchant {
  fullName: string;
  business: Business;
}

// Mock data for both service types
const merchantsData: Record<string, Merchant> = {
  airtime: {
    fullName: 'Sam Mwangi',
    business: {
      id: 'biz_2',
      businessName: 'Sam Airtime Shop',
      serviceType: 'airtime',
      tillNumber: '123456',
      aggregatorFloat: 89200,
      tillBalance: 45200,
      accountBalance: 45000,
    },
  },
  payment_collection: {
    fullName: 'Isaac Kimani',
    business: {
      id: 'biz_1',
      businessName: 'Kimani Bookstore',
      serviceType: 'payment_collection',
      tillNumber: '567890',
      tillBalance: 245680,
      accountBalance: 189500,
    },
  },
};

// Default to payment if no service type found
function getMerchantFromStorage(): Merchant {
  if (typeof window === 'undefined') return merchantsData.payment_collection;
  const storedType = localStorage.getItem('serviceType') as ServiceType;
  return merchantsData[storedType] || merchantsData.payment_collection;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [merchant, setMerchant] = useState<Merchant>(merchantsData.payment_collection);
  const [serviceType, setServiceType] = useState<ServiceType>('payment_collection');
  const [showBalance, setShowBalance] = useState(true);

  // Detect service type on mount
  useEffect(() => {
    const data = getMerchantFromStorage();
    setMerchant(data);
    setServiceType(data.business.serviceType);
  }, []);

  const { business } = merchant;
  const { fullName } = merchant;
  const isAirtime = serviceType === 'airtime';
  const isPayment = serviceType === 'payment_collection';

  // Store hides header, Profile hides everything
  const hideHeader = pathname === '/dashboard/store';
  const isFullScreen = pathname === '/dashboard/profile';

  // Same red color for both - XecoFlow brand
  const headerBg = 'bg-[#8B1D1D]';
  const avatarBg = 'bg-[#8B1D1D]';

  // Different badge colors to distinguish service type
  const badgeBg = isAirtime ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';
  const badgeLabel = isAirtime ? '📡 Airtime Reseller' : '💳 Payment Collection';

  // Home dashboard path based on service type
  const homePath = isAirtime ? '/dashboard/airtime' : '/dashboard/payments';

  // Format balance with hide/show
  const formatBalance = (amount: number) => {
    if (showBalance) {
      return `KES ${amount.toLocaleString()}`;
    }
    return 'KES ****';
  };

  // UNIFIED Bottom navigation
  const bottomNavItems = [
    { key: 'home', icon: Home, label: 'Home', href: homePath, active: pathname === homePath },
    { key: 'store', icon: Package, label: 'Store', href: '/dashboard/store', active: pathname === '/dashboard/store' },
    { key: 'orders', icon: Receipt, label: 'Orders', href: '/dashboard/transactions', active: pathname === '/dashboard/transactions' },
    { key: 'settings', icon: Settings, label: 'Settings', href: '/dashboard/settings', active: pathname === '/dashboard/settings' },
    { key: 'profile', icon: User, label: 'Profile', href: '/dashboard/profile', active: pathname === '/dashboard/profile' },
  ];

  // UNIFIED Sidebar
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
    localStorage.removeItem('serviceType');
    router.push('/auth/signin');
  };

  // Profile - full screen, no nav
  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    );
  }

  // Store - no header, but keep bottom nav
  if (hideHeader) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                    item.active ? 'text-[#8B1D1D]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
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
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold tracking-tight">XECOFLOW</h1>
            </div>
            
            {/* 🟢 Business Name + Till Number in rounded pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
              <Store className="w-3.5 h-3.5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[120px] leading-tight">
                  {business.businessName}
                </span>
                <span className="text-[10px] text-white/50 leading-tight">
                  Till: {business.tillNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Display with Eye Toggle */}
        {isAirtime && business.aggregatorFloat !== undefined && (
          <div className="px-4 pb-3 space-y-2">
            {/* Aggregator Float */}
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-white/60" />
                <p className="text-xs text-white/60">Airtime Float</p>
              </div>
              <p className="text-xl font-bold">{formatBalance(business.aggregatorFloat)}</p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {showBalance ? <Eye className="w-5 h-5 text-white/70" /> : <EyeOff className="w-5 h-5 text-white/70" />}
              </button>
            </div>
            {/* Till Balance */}
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-white/60" />
                <p className="text-xs text-white/60">Till Balance</p>
              </div>
              <p className="text-lg font-semibold">{formatBalance(business.tillBalance)}</p>
            </div>
          </div>
        )}

        {isPayment && (
          <div className="px-4 pb-3">
            <div className="bg-white/10 rounded-xl p-3 relative">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-white/60" />
                <p className="text-xs text-white/60">Float Balance</p>
              </div>
              <p className="text-xl font-bold">{formatBalance(business.tillBalance)}</p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {showBalance ? <Eye className="w-5 h-5 text-white/70" /> : <EyeOff className="w-5 h-5 text-white/70" />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  item.active ? 'text-[#8B1D1D]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
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
              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center text-white font-bold`}>
                  {fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{fullName}</p>
                  <p className="text-xs text-gray-500">{business.businessName}</p>
                </div>
              </div>
              {isAirtime && business.aggregatorFloat !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Aggregator:</span>
                    <span className="font-semibold">{formatBalance(business.aggregatorFloat)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Till:</span>
                    <span className="font-semibold">{formatBalance(business.tillBalance)}</span>
                  </div>
                </div>
              )}
              {isPayment && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Float:</span>
                  <span className="font-semibold">{formatBalance(business.tillBalance)}</span>
                </div>
              )}
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${badgeBg}`}>
                {badgeLabel}
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setShowSidebar(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive ? 'bg-[#8B1D1D]/10 text-[#8B1D1D] font-semibold' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Add Another Business */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-sm font-semibold text-yellow-900 mb-1">Multiple Businesses?</p>
                <p className="text-xs text-yellow-700 mb-3">Each business requires a separate account.</p>
                <button disabled className="w-full py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium cursor-not-allowed opacity-60">
                  + Add Another Business (Coming Soon)
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}