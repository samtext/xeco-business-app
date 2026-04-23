'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronDown,
  Download,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Mock data
const mockStats = {
  // Daily breakdown for the week
  dailyBreakdown: [
    { day: 'Mon', revenue: 12800, profit: 3200, transactions: 45 },
    { day: 'Tue', revenue: 14200, profit: 3800, transactions: 52 },
    { day: 'Wed', revenue: 11800, profit: 2900, transactions: 41 },
    { day: 'Thu', revenue: 15700, profit: 4200, transactions: 58 },
    { day: 'Fri', revenue: 18300, profit: 5100, transactions: 67 },
    { day: 'Sat', revenue: 9800, profit: 2400, transactions: 35 },
    { day: 'Sun', revenue: 6800, profit: 1800, transactions: 22 },
  ],

  // Network performance (airtime specific)
  networkPerformance: [
    { network: 'Safaricom', revenue: 45600, profit: 5200, margin: 11.4, transactions: 180 },
    { network: 'Airtel', revenue: 23400, profit: 3400, margin: 14.5, transactions: 95 },
    { network: 'Telkom', revenue: 8900, profit: 1200, margin: 13.5, transactions: 42 },
  ],

  // Peak selling hours
  peakHours: [
    { hour: '6-8 AM', percentage: 8 },
    { hour: '8-10 AM', percentage: 15 },
    { hour: '10-12 PM', percentage: 12 },
    { hour: '12-2 PM', percentage: 18 },
    { hour: '2-4 PM', percentage: 10 },
    { hour: '4-6 PM', percentage: 14 },
    { hour: '6-8 PM', percentage: 16 },
    { hour: '8-10 PM', percentage: 7 },
  ],

  // Month over month growth
  monthlyGrowth: [
    { month: 'Jan', revenue: 280000, profit: 72000 },
    { month: 'Feb', revenue: 310000, profit: 81000 },
    { month: 'Mar', revenue: 295000, profit: 76000 },
    { month: 'Apr', revenue: 340000, profit: 89000 },
    { month: 'May', revenue: 370000, profit: 98000 },
    { month: 'Jun', revenue: 420000, profit: 112000 },
  ],

  // Top products/services
  topProducts: [
    { name: 'KES 100 Safaricom', sales: 1200, revenue: 120000, profit: 6000 },
    { name: 'KES 50 Airtel', sales: 800, revenue: 40000, profit: 3200 },
    { name: 'KES 20 Telkom', sales: 500, revenue: 10000, profit: 1000 },
    { name: 'KES 250 Safaricom', sales: 300, revenue: 75000, profit: 3000 },
  ],

  // Profit margin trend
  profitMarginTrend: [11.2, 10.8, 12.1, 11.5, 13.0, 14.2, 12.8, 13.5],
};

type TimeFilter = 'today' | 'week' | 'month' | 'year';

export default function StatsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  const totalRevenue = mockStats.dailyBreakdown.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = mockStats.dailyBreakdown.reduce((sum, d) => sum + d.profit, 0);
  const totalTransactions = mockStats.dailyBreakdown.reduce((sum, d) => sum + d.transactions, 0);
  const avgMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  // Find max revenue for bar chart scaling
  const maxRevenue = Math.max(...mockStats.dailyBreakdown.map(d => d.revenue));
  const maxProfit = Math.max(...mockStats.dailyBreakdown.map(d => d.profit));
  const maxPeakPercentage = Math.max(...mockStats.peakHours.map(h => h.percentage));

  return (
    <div className="p-4 space-y-4">
      
      {/* Time Filter */}
      <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
        {(['today', 'week', 'month', 'year'] as TimeFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === filter
                ? 'bg-[#8B1D1D] text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900">
            KES {totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-green-600">+12.5%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Profit</p>
          <p className="text-xl font-bold text-green-600">
            KES {totalProfit.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-400">Margin: {avgMargin}%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Transactions</p>
          <p className="text-xl font-bold text-gray-900">{totalTransactions}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Avg Transaction</p>
          <p className="text-xl font-bold text-gray-900">
            KES {Math.round(totalRevenue / totalTransactions).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Revenue & Profit Chart (Bar Chart) */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Revenue & Profit</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#8B1D1D] rounded-sm" />
              <span className="text-xs text-gray-500">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="text-xs text-gray-500">Profit</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-3">
          {mockStats.dailyBreakdown.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-8">{day.day}</span>
              <div className="flex-1 space-y-1">
                {/* Revenue Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                    <div
                      className="bg-[#8B1D1D] h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                    >
                      {day.revenue > maxRevenue * 0.5 && (
                        <span className="text-[10px] text-white font-medium">
                          KES {day.revenue.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Profit Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(day.profit / maxRevenue) * 100}%` }}
                    >
                      {day.profit > maxRevenue * 0.3 && (
                        <span className="text-[10px] text-white font-medium">
                          KES {day.profit.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 w-10 text-right">
                {day.transactions} txn
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Network Performance (Airtime specific) */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Network Performance</h3>
        <div className="space-y-4">
          {mockStats.networkPerformance.map((network) => (
            <div key={network.network} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">{network.network}</span>
                </div>
                <span className={`text-sm font-semibold ${
                  network.margin > 13 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {network.margin}% margin
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-sm font-semibold">KES {network.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Profit</p>
                  <p className="text-sm font-semibold text-green-600">KES {network.profit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transactions</p>
                  <p className="text-sm font-semibold">{network.transactions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Selling Hours */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Peak Selling Hours</h3>
        <div className="space-y-2">
          {mockStats.peakHours.map((peak) => (
            <div key={peak.hour} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-16">{peak.hour}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full rounded-full flex items-center px-2 ${
                    peak.percentage > 15
                      ? 'bg-[#8B1D1D]'
                      : peak.percentage > 10
                      ? 'bg-orange-400'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: `${peak.percentage}%` }}
                >
                  {peak.percentage > 12 && (
                    <span className="text-[10px] text-white font-medium">
                      {peak.percentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#8B1D1D] rounded-sm" />
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-400 rounded-sm" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-sm" />
            <span>Slow</span>
          </div>
        </div>
      </div>

      {/* Monthly Growth Trend */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Growth</h3>
        <div className="space-y-3">
          {mockStats.monthlyGrowth.map((month) => (
            <div key={month.month} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-10">{month.month}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Revenue</span>
                  <span className="text-xs font-medium">KES {month.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-[#8B1D1D] h-1.5 rounded-full"
                    style={{ width: `${(month.revenue / 420000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Growth Trend</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">+50% YoY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Top Products</h3>
        <div className="space-y-2">
          {mockStats.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-300 w-6">#{index + 1}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">KES {product.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+KES {product.profit.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <button className="w-full bg-white border-2 border-[#8B1D1D] text-[#8B1D1D] py-3 rounded-lg font-semibold hover:bg-[#8B1D1D]/5 transition-colors flex items-center justify-center gap-2">
        <Download className="w-4 h-4" />
        Export Report
      </button>
    </div>
  );
}