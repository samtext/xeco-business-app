'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Phone,
  Wifi,
  ShoppingCart,
  CreditCard,
  RefreshCw,
  Users,
  ChevronRight,
} from 'lucide-react';

type ServiceType = 'payment_collection' | 'airtime';

// Airtime-specific mock data
const airtimeData = {
  aggregatorFloat: 89200,
  tillBalance: 45200,
  today: {
    sales: 8750,
    profit: 1200,
    profitMargin: 13.7,
    transactionCount: 35,
    salesChange: 8.5,
    profitChange: 15.2,
  },
  lowStockAlerts: [
    { network: 'Safaricom', denomination: 'KES 100', remaining: 2 },
    { network: 'Airtel', denomination: 'KES 50', remaining: 5 },
  ],
  topNetworks: [
    { network: 'Safaricom', sales: 5500, percentage: 63 },
    { network: 'Airtel', sales: 2500, percentage: 29 },
    { network: 'Telkom', sales: 750, percentage: 8 },
  ],
  recentTransactions: [
    { id: 'a1', type: 'airtime', network: 'Safaricom', amount: 100, profit: 5, phone: '0723123456', time: '2 min ago', status: 'completed' },
    { id: 'a2', type: 'airtime', network: 'Airtel', amount: 50, profit: 3, phone: '0712123456', time: '15 min ago', status: 'completed' },
    { id: 'a3', type: 'airtime', network: 'Safaricom', amount: 250, profit: 12, phone: '0798123456', time: '30 min ago', status: 'completed' },
    { id: 'a4', type: 'airtime', network: 'Telkom', amount: 20, profit: 1.5, phone: '0741123456', time: '1 hour ago', status: 'completed' },
    { id: 'a5', type: 'airtime', network: 'Safaricom', amount: 50, profit: 2.5, phone: '0711345678', time: '2 hours ago', status: 'pending' },
  ],
};

// Payment-specific mock data
const paymentData = {
  tillBalance: 245680,
  today: {
    revenue: 12750,
    profit: 3200,
    profitMargin: 25.1,
    transactionCount: 47,
    revenueChange: 15.5,
    profitChange: 22.3,
  },
  pendingSettlements: 4500,
  settledToday: 8200,
  recentTransactions: [
    { id: 'p1', type: 'stk', description: 'Atomic Habits - Book', amount: 500, profit: 150, phone: '0705123456', time: '2 min ago', status: 'completed' },
    { id: 'p2', type: 'c2b', description: 'Till #567890', amount: 1000, profit: 200, phone: '0798123456', time: '15 min ago', status: 'completed' },
    { id: 'p3', type: 'stk', description: 'Rich Dad Poor Dad', amount: 450, profit: 150, phone: '0728987654', time: '1 hour ago', status: 'completed' },
    { id: 'p4', type: 'c2b', description: 'Till #567890', amount: 2500, profit: 500, phone: '0700234567', time: '2 hours ago', status: 'completed' },
    { id: 'p5', type: 'stk', description: 'The Psychology of Money', amount: 600, profit: 180, phone: '0734123456', time: '3 hours ago', status: 'pending' },
  ],
  topCustomers: [
    { name: 'John M.', phone: '0705123456', purchases: 12, spent: 6500 },
    { name: 'Sarah K.', phone: '0728987654', purchases: 8, spent: 4200 },
    { name: 'Peter W.', phone: '0734123456', purchases: 6, spent: 3100 },
  ],
};

export default function OverviewPage() {
  const [serviceType, setServiceType] = useState<ServiceType>('payment_collection');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Detect service type
  useEffect(() => {
    const storedType = localStorage.getItem('serviceType') as ServiceType;
    if (storedType) {
      setServiceType(storedType);
    }
  }, []);

  const isAirtime = serviceType === 'airtime';
  const data = isAirtime ? airtimeData : paymentData;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // =============================================
  // AIRTIME DASHBOARD
  // =============================================
  if (isAirtime) {
    return (
      <div className="p-4 space-y-4">
        {/* Insight Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm font-medium">
              Sales up <span className="font-bold">{airtimeData.today.salesChange}%</span> from yesterday!
            </p>
          </div>
        </div>

        {/* Airtime Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Today's Sales</p>
            <p className="text-xl font-bold text-gray-900">KES {airtimeData.today.sales.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">↑ {airtimeData.today.salesChange}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Today's Profit</p>
            <p className="text-xl font-bold text-green-600">KES {airtimeData.today.profit.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">↑ {airtimeData.today.profitChange}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Transactions</p>
            <p className="text-xl font-bold text-gray-900">{airtimeData.today.transactionCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Margin</p>
            <p className="text-xl font-bold text-blue-600">{airtimeData.today.profitMargin}%</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {airtimeData.lowStockAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
            </div>
            {airtimeData.lowStockAlerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 mb-2">
                <div>
                  <p className="font-medium text-gray-900">{alert.network}</p>
                  <p className="text-sm text-gray-500">{alert.denomination}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{alert.remaining} left</p>
                  <Link href="/dashboard/airtime" className="text-xs text-blue-600 hover:underline">Restock →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top Networks */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Top Networks Today</h3>
          {airtimeData.topNetworks.map((network, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{network.network}</span>
                </div>
                <span className="text-sm text-gray-500">KES {network.sales.toLocaleString()} ({network.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${network.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Airtime Transactions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Recent Sales</h3>
            <Link href="/dashboard/transactions" className="text-xs text-blue-600 flex items-center gap-1">
              See All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {airtimeData.recentTransactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{txn.network} KES {txn.amount}</p>
                  <p className="text-xs text-gray-500">{txn.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">+KES {txn.profit}</p>
                <p className="text-xs text-gray-400">{txn.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <Link href="/dashboard/airtime" className="block w-full bg-blue-600 text-white text-center py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform">
          📦 Manage Stock
        </Link>

        {/* Refresh */}
        <button onClick={handleRefresh} className="w-full text-sm text-gray-400 py-2 flex items-center justify-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </button>
      </div>
    );
  }

  // =============================================
  // PAYMENT COLLECTION DASHBOARD
  // =============================================
  return (
    <div className="p-4 space-y-4">
      {/* Insight Banner */}
      <div className="bg-gradient-to-r from-[#8B1D1D] to-[#A02323] rounded-xl p-4 text-white">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <p className="text-sm font-medium">
            You've made <span className="font-bold">{paymentData.today.profitChange}% more profit</span> than yesterday!
          </p>
        </div>
      </div>

      {/* Payment Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Today's Revenue</p>
          <p className="text-xl font-bold text-gray-900">KES {paymentData.today.revenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">↑ {paymentData.today.revenueChange}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Today's Profit</p>
          <p className="text-xl font-bold text-green-600">KES {paymentData.today.profit.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">↑ {paymentData.today.profitChange}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Transactions</p>
          <p className="text-xl font-bold text-gray-900">{paymentData.today.transactionCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Margin</p>
          <p className="text-xl font-bold text-[#8B1D1D]">{paymentData.today.profitMargin}%</p>
        </div>
      </div>

      {/* Settlement Status */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">Settlements</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600">Settled Today</p>
            <p className="text-lg font-bold text-green-900">KES {paymentData.settledToday.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-yellow-600">Pending</p>
            <p className="text-lg font-bold text-yellow-900">KES {paymentData.pendingSettlements.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          <Link href="/dashboard/transactions" className="text-xs text-[#8B1D1D] flex items-center gap-1">
            See All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {paymentData.recentTransactions.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.type === 'stk' ? 'bg-green-100' : 'bg-orange-100'}`}>
                {txn.type === 'stk' ? <ShoppingCart className="w-4 h-4 text-green-600" /> : <CreditCard className="w-4 h-4 text-orange-600" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                <p className="text-xs text-gray-500">{txn.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">KES {txn.amount}</p>
              <p className="text-xs text-green-600">+KES {txn.profit}</p>
              <p className="text-xs text-gray-400">{txn.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">Top Customers</h3>
        {paymentData.topCustomers.map((customer, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#8B1D1D]/10 rounded-full flex items-center justify-center text-[#8B1D1D] font-bold text-sm">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                <p className="text-xs text-gray-500">{customer.purchases} purchases</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">KES {customer.spent.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Quick Action */}
      <Link href="/dashboard/payments" className="block w-full bg-[#8B1D1D] text-white text-center py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
        <CreditCard className="w-5 h-5" />
        Initiate STK Push
      </Link>

      {/* Refresh */}
      <button onClick={handleRefresh} className="w-full text-sm text-gray-400 py-2 flex items-center justify-center gap-2">
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
      </button>
    </div>
  );
}