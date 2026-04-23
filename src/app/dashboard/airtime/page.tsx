'use client';

import { useState } from 'react';
import {
  Wifi,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Phone,
  ChevronRight,
} from 'lucide-react';

// Mock stock data
const mockStockData = {
  safaricom: {
    network: 'Safaricom',
    color: 'bg-green-500',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50',
    stock: [
      { denomination: 10, stock: 150, sold: 45, cost: 9.5, price: 10, profit: 0.5 },
      { denomination: 20, stock: 100, sold: 32, cost: 19, price: 20, profit: 1 },
      { denomination: 50, stock: 80, sold: 28, cost: 47.5, price: 50, profit: 2.5 },
      { denomination: 100, stock: 25, sold: 67, cost: 95, price: 100, profit: 5 },
      { denomination: 250, stock: 15, sold: 22, cost: 238, price: 250, profit: 12 },
      { denomination: 500, stock: 8, sold: 12, cost: 475, price: 500, profit: 25 },
    ],
  },
  airtel: {
    network: 'Airtel',
    color: 'bg-red-500',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50',
    stock: [
      { denomination: 10, stock: 120, sold: 35, cost: 9.3, price: 10, profit: 0.7 },
      { denomination: 20, stock: 90, sold: 25, cost: 18.5, price: 20, profit: 1.5 },
      { denomination: 50, stock: 60, sold: 20, cost: 46, price: 50, profit: 4 },
      { denomination: 100, stock: 15, sold: 45, cost: 93, price: 100, profit: 7 },
      { denomination: 250, stock: 10, sold: 15, cost: 235, price: 250, profit: 15 },
    ],
  },
  telkom: {
    network: 'Telkom',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50',
    stock: [
      { denomination: 10, stock: 80, sold: 20, cost: 9.2, price: 10, profit: 0.8 },
      { denomination: 20, stock: 50, sold: 15, cost: 18, price: 20, profit: 2 },
      { denomination: 50, stock: 30, sold: 10, cost: 45, price: 50, profit: 5 },
      { denomination: 100, stock: 10, sold: 25, cost: 92, price: 100, profit: 8 },
    ],
  },
};

// Recent stock top-ups
const mockTopUps = [
  { id: 'top_1', network: 'Safaricom', denominations: 'KES 100 x 50', amount: 4750, timestamp: '2026-01-15T10:00:00' },
  { id: 'top_2', network: 'Airtel', denominations: 'KES 50 x 30', amount: 1380, timestamp: '2026-01-15T08:30:00' },
  { id: 'top_3', network: 'Telkom', denominations: 'KES 20 x 40', amount: 720, timestamp: '2026-01-14T16:00:00' },
  { id: 'top_4', network: 'Safaricom', denominations: 'KES 250 x 20', amount: 4760, timestamp: '2026-01-14T12:00:00' },
];

// Auto-delivery logs
const mockDeliveryLogs = [
  { id: 'del_1', network: 'Safaricom', denomination: 100, phone: '0723123456', status: 'success', timestamp: '2 min ago' },
  { id: 'del_2', network: 'Airtel', denomination: 50, phone: '0712123456', status: 'success', timestamp: '15 min ago' },
  { id: 'del_3', network: 'Safaricom', denomination: 20, phone: '0798123456', status: 'failed', timestamp: '30 min ago' },
  { id: 'del_4', network: 'Telkom', denomination: 100, phone: '0741123456', status: 'success', timestamp: '1 hour ago' },
];

export default function AirtimePage() {
  const [activeNetwork, setActiveNetwork] = useState<'safaricom' | 'airtel' | 'telkom'>('safaricom');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedDenomination, setSelectedDenomination] = useState<number | null>(null);

  const currentNetwork = mockStockData[activeNetwork];
  
  const totalStockValue = currentNetwork.stock.reduce(
    (sum, item) => sum + item.stock * item.cost, 0
  );
  
  const todaySold = currentNetwork.stock.reduce(
    (sum, item) => sum + item.sold * item.price, 0
  );
  
  const todayProfit = currentNetwork.stock.reduce(
    (sum, item) => sum + item.sold * item.profit, 0
  );

  const lowStockItems = currentNetwork.stock.filter(item => item.stock <= 10);
  const outOfStockItems = currentNetwork.stock.filter(item => item.stock === 0);

  const handleTopUp = () => {
    // In real app, this would open M-Pesa STK push for top-up payment
    console.log('Top up:', selectedDenomination);
    setShowTopUpModal(false);
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Network Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-gray-200">
        {(['safaricom', 'airtel', 'telkom'] as const).map((network) => (
          <button
            key={network}
            onClick={() => setActiveNetwork(network)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeNetwork === network
                ? 'bg-[#8B1D1D] text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Phone className="w-4 h-4" />
            {mockStockData[network].network}
          </button>
        ))}
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Stock Value</p>
          <p className="text-xl font-bold text-gray-900">
            KES {totalStockValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Today's Sales</p>
          <p className="text-xl font-bold text-gray-900">
            KES {todaySold.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Today's Profit</p>
          <p className="text-xl font-bold text-green-600">
            KES {todayProfit.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Active Items</p>
          <p className="text-xl font-bold text-gray-900">
            {currentNetwork.stock.filter(i => i.stock > 0).length}
          </p>
          {lowStockItems.length > 0 && (
            <p className="text-xs text-red-600 mt-1">{lowStockItems.length} low stock</p>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-900">
                    KES {item.denomination} {currentNetwork.network}
                  </p>
                  <p className="text-xs text-gray-500">Sold {item.sold} today</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-red-600">
                    {item.stock} left
                  </span>
                  <button
                    onClick={() => {
                      setSelectedDenomination(item.denomination);
                      setShowTopUpModal(true);
                    }}
                    className="px-3 py-1.5 bg-[#8B1D1D] text-white text-xs rounded-lg font-medium hover:bg-[#701616]"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Inventory */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">
          {currentNetwork.network} Stock
        </h3>
        <div className="space-y-2">
          {currentNetwork.stock.map((item) => {
            const stockLevel = item.stock <= 0 ? 'out' : item.stock <= 10 ? 'low' : 'ok';
            return (
              <div
                key={item.denomination}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  stockLevel === 'out'
                    ? 'bg-red-50 border-red-200'
                    : stockLevel === 'low'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentNetwork.bgColor
                  }`}>
                    <span className={`text-lg font-bold ${currentNetwork.textColor}`}>
                      {item.denomination}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      KES {item.denomination}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">Stock: {item.stock}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">Sold: {item.sold} today</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    +KES {item.profit}/each
                  </p>
                  <p className="text-xs text-gray-400">
                    Cost: KES {item.cost}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Top-Up Button */}
      <button
        onClick={() => setShowTopUpModal(true)}
        className="w-full bg-[#8B1D1D] text-white py-3.5 rounded-lg font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Top Up Stock
      </button>

      {/* Recent Top-Ups */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">Recent Stock Top-Ups</h3>
        <div className="space-y-2">
          {mockTopUps.map((topUp) => (
            <div key={topUp.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  topUp.network === 'Safaricom' ? 'bg-green-100' :
                  topUp.network === 'Airtel' ? 'bg-red-100' : 'bg-purple-100'
                }`}>
                  <Phone className={`w-4 h-4 ${
                    topUp.network === 'Safaricom' ? 'text-green-600' :
                    topUp.network === 'Airtel' ? 'text-red-600' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{topUp.network}</p>
                  <p className="text-xs text-gray-500">{topUp.denominations}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">KES {topUp.amount}</p>
                <p className="text-xs text-gray-400">
                  {new Date(topUp.timestamp).toLocaleDateString('en-KE', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Delivery Logs */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">Auto-Delivery Logs</h3>
        <div className="space-y-2">
          {mockDeliveryLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {log.network} KES {log.denomination}
                  </p>
                  <p className="text-xs text-gray-500">{log.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${
                  log.status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {log.status === 'success' ? 'Delivered' : 'Failed'}
                </span>
                <p className="text-xs text-gray-400">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowTopUpModal(false)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Up Stock</h3>
            
            {!selectedDenomination ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-3">Select denomination:</p>
                {currentNetwork.stock.map((item) => (
                  <button
                    key={item.denomination}
                    onClick={() => setSelectedDenomination(item.denomination)}
                    className={`w-full text-left p-3 rounded-lg border ${
                      item.stock <= 10 ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-[#8B1D1D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">KES {item.denomination}</p>
                        <p className="text-xs text-gray-500">
                          Current stock: {item.stock} • Profit: KES {item.profit}/each
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedDenomination(null)}
                  className="text-sm text-[#8B1D1D] hover:underline"
                >
                  ← Back
                </button>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Selected</p>
                  <p className="text-xl font-bold text-gray-900">
                    {currentNetwork.network} KES {selectedDenomination}
                  </p>
                </div>
                <button
                  onClick={handleTopUp}
                  className="w-full bg-[#8B1D1D] text-white py-3 rounded-lg font-semibold hover:bg-[#701616]"
                >
                  Proceed to Top Up (M-Pesa STK)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}