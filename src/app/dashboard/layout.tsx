'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  BarChart3,
  Receipt,
  Settings,
  User,
  Menu,
  X,
  Store,
  ChevronDown,
  LogOut,
} from 'lucide-react';

// Mock merchant data - will come from API later
const mockMerchant = {
  fullName: 'Isaac Kimani',
  businesses: [
    {
      id: 'biz_1',
      businessName: 'Kimani Bookstore',
      serviceType: 'payment_collection' as const,
      tillNumber: '567890',
      floatBalance: 245680,
      accountBalance: 189500,
    },
    {
      id: 'biz_2',
      businessName: 'Sam Airtime Shop',
      serviceType: 'airtime' as const,
      tillNumber: '123456',
      floatBalance: 89200,
      accountBalance: 45000,
    },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeBusiness, setActiveBusiness] = useState(mockMerchant.businesses[0]);
  const [showBusinessSwitcher, setShowBusinessSwitcher] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const isPaymentCollection = activeBusiness.serviceType === 'payment_collection';
  const isAirtime = activeBusiness.serviceType === 'airtime';

  // Navigation items based on current tab
  const bottomNavItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/dashboard/overview',
      active: pathname.includes('/overview'),
    },
    {
      icon: BarChart3,
      label: 'Stats',
      href: '/dashboard/stats',
      active: pathname.includes('/stats'),
    },
    {
      icon: Receipt,
      label: 'Trans',
      href: '/dashboard/transactions',
      active: pathname.includes('/transactions'),
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
      active: pathname.includes('/settings'),
    },
    {
      icon: User,
      label: 'Profile',
      href: '/dashboard/profile',
      active: pathname.includes('/profile'),
    },
  ];

  const sidebarItems = [
    {
      icon: Home,
      label: 'Overview',
      href: '/dashboard/overview',
    },
    ...(isAirtime
      ? [
          {
            icon: Receipt,
            label: 'Airtime Stock',
            href: '/dashboard/airtime',
          },
        ]
      : []),
    ...(isPaymentCollection
      ? [
          {
            icon: Receipt,
            label: 'Payments',
            href: '/dashboard/payments',
          },
        ]
      : []),
    {
      icon: BarChart3,
      label: 'Reports',
      href: '/dashboard/stats',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
    },
  ];

  const handleBusinessSwitch = (business: typeof mockMerchant.businesses[0]) => {
    setActiveBusiness(business);
    setShowBusinessSwitcher(false);
    router.push('/dashboard/overview');
  };

  const handleLogout = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top App Bar */}
      <header className="bg-[#8B1D1D] text-white sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Menu + Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-bold tracking-tight">XECOFLOW</h1>
              </div>
            </div>

            {/* Right: Business Switcher + Notifications */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBusinessSwitcher(!showBusinessSwitcher)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Store className="w-4 h-4" />
                <span className="text-sm font-medium max-w-[120px] truncate hidden sm:block">
                  {activeBusiness.businessName}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Float Balance Bar */}
        <div className="px-4 pb-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs text-white/60 mb-1">Float Balance</p>
            <p className="text-xl font-bold">
              KES {activeBusiness.floatBalance.toLocaleString()}
            </p>
            <p className="text-xs text-white/60 mt-1">
              Till: {activeBusiness.tillNumber}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  item.active
                    ? 'text-[#8B1D1D]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Business Switcher Modal */}
      {showBusinessSwitcher && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowBusinessSwitcher(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[70vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Switch Business</h2>
              <button
                onClick={() => setShowBusinessSwitcher(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {mockMerchant.businesses.map((business) => (
                <button
                  key={business.id}
                  onClick={() => handleBusinessSwitch(business)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    activeBusiness.id === business.id
                      ? 'border-[#8B1D1D] bg-[#8B1D1D]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {business.businessName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Till: {business.tillNumber}
                      </p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                        business.serviceType === 'airtime'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {business.serviceType === 'airtime' ? 'Airtime' : 'Payments'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        KES {business.floatBalance.toLocaleString()}
                      </p>
                      {activeBusiness.id === business.id && (
                        <span className="text-xs text-[#8B1D1D] font-medium">Active</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Add Business Button */}
            <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#8B1D1D] hover:text-[#8B1D1D] transition-colors font-medium">
              + Add Another Business
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Overlay (Mobile) */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSidebar(false)}
          />

          {/* Sidebar */}
          <div className="relative w-72 bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#8B1D1D] rounded-full flex items-center justify-center text-white font-bold">
                  {mockMerchant.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{mockMerchant.fullName}</p>
                  <p className="text-xs text-gray-500">{activeBusiness.businessName}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Float: KES {activeBusiness.floatBalance.toLocaleString()}
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowSidebar(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#8B1D1D]/10 text-[#8B1D1D] font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
              >
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