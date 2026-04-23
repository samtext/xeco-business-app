'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertTriangle,
  Zap,
  Users,
  Clock,
  ChevronRight,
  Phone,
  Wifi,
  ShoppingCart,
  CreditCard,
} from 'lucide-react';

// Mock data - will come from API
const mockMetrics = {
  floatBalance: 245680,
  accountBalance: 189500,
  lastTopUp: 50000,
  
  today: {
    revenue: 12750,
    profit: 3200,
    profitMargin: 25.1,
    transactionCount: 47,
    revenueChange: 15.5,  // % change from yesterday
    profitChange: 22.3,
  },
  
  thisWeek: {
    revenue: 89400,
    profit: 22400,
    transactionCount: 320,
  },
  
  lowStockAlerts: [
    { network: 'Safaricom', denomination: 'KES 100', remaining: 2 },
    { network: 'Airtel', denomination: 'KES 50', remaining: 5 },
  ],
  
  topNetworks: [
    { network: 'Safaricom', sales: 8500, percentage: 68 },
    { network: 'Airtel', sales: 3500, percentage: 28 },
    { network: 'Telkom', sales: 500, percentage: 4 },
  ],
  
  recentTransactions: [
    {
      id: 'txn_1',
      type: 'airtime_sale' as const,
      network: 'Safaricom',
      amount: 100,
      profit: 5,
      phone: '0723123456',
      timestamp: '2 min ago',
      status: 'completed' as const,
    },
    {
      id: 'txn_2',
      type: 'airtime_sale' as const,
      network: 'Airtel',
      amount: 50,
      profit: 3,
      phone: '0712123456',
      timestamp: '15 min ago',
      status: 'completed' as const,
    },
    {
      id: 'txn_3',
      type: 'stk_payment' as const,
      description: 'Book Purchase - Atomic Habits',
      amount: 500,
      profit: 150,
      phone: '0705123456',
      timestamp: '1 hour ago',
      status: 'completed' as const,
    },
    {
      id: 'txn_4',
      type: 'c2b_received' as const,
      description: 'Till #567890',
      amount: 1000,
      profit: 200,
      phone: '0798123456',
      timestamp: '2 hours ago',
      status: 'completed' as const,
    },
    {
      id: 'txn_5',
      type: 'airtime_sale' as const,
      network: 'Telkom',
      amount: 20,
      profit: 1.5,
      phone: '0741123456',
      timestamp: '3 hours ago',
      status: 'pending' as const,
    },
  ],
  
  peakHours: [
    { hour: '8-10 AM', transactions: 45 },
    { hour: '12-2 PM', transactions: 82 },
    { hour: '5-8 PM', transactions: 128 },
  ],
};

export default function OverviewPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(mockMetrics);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // In real app, fetch new data here
    }, 1000);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'airtime_sale':
        return <Wifi className="w-4 h-4 text-blue-600" />;
      case 'stk_payment':
        return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case 'c2b_received':
        return <CreditCard className="w-4 h-4 text-orange-600" />;
      default:
        return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'airtime_sale': return 'bg-blue-50 border-blue-200';
      case 'stk_payment': return 'bg-green-50 border-green-200';
      case 'c2b_received': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Quick Insight Banner */}
      <div className="bg-gradient-to-r from-[#8B1D1D] to-[#A02323] rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm font-medium">
              You've made <span className="font-bold">22% more profit</span> than yesterday!
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Today's Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Today's Sales</p>
          <p className="text-xl font-bold text-gray-900">
            KES {metrics.today.revenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {metrics.today.revenueChange > 0 ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span className={`text-xs font-medium ${
              metrics.today.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.today.revenueChange > 0 ? '+' : ''}{metrics.today.revenueChange}%
            </span>
            <span className="text-xs text-gray-400">vs yesterday</span>
          </div>
        </div>

        {/* Profit Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Today's Profit</p>
          <p className="text-xl font-bold text-green-600">
            KES {metrics.today.profit.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {metrics.today.profitChange > 0 ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span className={`text-xs font-medium ${
              metrics.today.profitChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.today.profitChange > 0 ? '+' : ''}{metrics.today.profitChange}%
            </span>
            <span className="text-xs text-gray-400">vs yesterday</span>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Transactions</p>
          <p className="text-xl font-bold text-gray-900">
            {metrics.today.transactionCount}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Today</span>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Profit Margin</p>
          <p className="text-xl font-bold text-[#8B1D1D]">
            {metrics.today.profitMargin}%
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Average</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts (Airtime specific) */}
      {metrics.lowStockAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {metrics.lowStockAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-900">{alert.network}</p>
                  <p className="text-sm text-gray-500">{alert.denomination}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{alert.remaining} left</p>
                  <Link href="/dashboard/airtime" className="text-xs text-[#8B1D1D] hover:underline">
                    Restock →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Networks (Airtime specific) */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Top Networks Today</h3>
          <Link href="/dashboard/stats" className="text-xs text-[#8B1D1D] hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {metrics.topNetworks.map((network, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{network.network}</span>
                </div>
                <span className="text-sm text-gray-500">
                  KES {network.sales.toLocaleString()} ({network.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-[#8B1D1D] h-2 rounded-full"
                  style={{ width: `${network.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-1 text-xs text-[#8B1D1D] hover:underline"
          >
            See All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {metrics.recentTransactions.slice(0, 5).map((txn) => (
            <div
              key={txn.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${getTransactionColor(txn.type)}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {getTransactionIcon(txn.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {txn.type === 'airtime_sale' && `${txn.network} Airtime`}
                    {txn.type === 'stk_payment' && txn.description}
                    {txn.type === 'c2b_received' && txn.description}
                  </p>
                  <p className="text-xs text-gray-500">{txn.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  KES {txn.amount}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-green-600">+KES {txn.profit}</span>
                  <span className="text-xs text-gray-400">{txn.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {/* Stock Management */}
        <Link
          href="/dashboard/airtime"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-[#8B1D1D] transition-colors"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 text-sm">Stock Management</h4>
          <p className="text-xs text-gray-500 mt-1">View & manage airtime stock</p>
        </Link>

        {/* Profit & Loss */}
        <Link
          href="/dashboard/stats"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-[#8B1D1D] transition-colors"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 text-sm">Profit & Loss</h4>
          <p className="text-xs text-gray-500 mt-1">View detailed reports</p>
        </Link>
      </div>

      {/* This Week Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">This Week</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Revenue</span>
            <span className="text-sm font-semibold text-gray-900">
              KES {metrics.thisWeek.revenue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Profit</span>
            <span className="text-sm font-semibold text-green-600">
              KES {metrics.thisWeek.profit.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Transactions</span>
            <span className="text-sm font-semibold text-gray-900">
              {metrics.thisWeek.transactionCount}
            </span>
          </div>
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      <div className="text-center py-4">
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </button>
      </div>
    </div>
  );
}