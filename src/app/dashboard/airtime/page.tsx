'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Undo2,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';

// Mock stock data
const mockStockData = [
  { denomination: 10, network: 'Safaricom', stock: 150, sold: 45, cost: 9.5, price: 10, profit: 0.5 },
  { denomination: 20, network: 'Safaricom', stock: 100, sold: 32, cost: 19, price: 20, profit: 1 },
  { denomination: 50, network: 'Safaricom', stock: 80, sold: 28, cost: 47.5, price: 50, profit: 2.5 },
  { denomination: 100, network: 'Safaricom', stock: 25, sold: 67, cost: 95, price: 100, profit: 5 },
  { denomination: 250, network: 'Safaricom', stock: 15, sold: 22, cost: 238, price: 250, profit: 12 },
  { denomination: 500, network: 'Safaricom', stock: 8, sold: 12, cost: 475, price: 500, profit: 25 },
  { denomination: 10, network: 'Airtel', stock: 120, sold: 35, cost: 9.3, price: 10, profit: 0.7 },
  { denomination: 20, network: 'Airtel', stock: 90, sold: 25, cost: 18.5, price: 20, profit: 1.5 },
  { denomination: 50, network: 'Airtel', stock: 60, sold: 20, cost: 46, price: 50, profit: 4 },
  { denomination: 100, network: 'Airtel', stock: 15, sold: 45, cost: 93, price: 100, profit: 7 },
  { denomination: 250, network: 'Airtel', stock: 10, sold: 15, cost: 235, price: 250, profit: 15 },
  { denomination: 10, network: 'Telkom', stock: 80, sold: 20, cost: 9.2, price: 10, profit: 0.8 },
  { denomination: 20, network: 'Telkom', stock: 50, sold: 15, cost: 18, price: 20, profit: 2 },
  { denomination: 50, network: 'Telkom', stock: 30, sold: 10, cost: 45, price: 50, profit: 5 },
  { denomination: 100, network: 'Telkom', stock: 15, sold: 25, cost: 92, price: 100, profit: 8 },
];

// Transaction History
const transactionHistory = [
  { id: 'txn_1', name: 'Samuel', phone: '0712071388', amount: 100, status: 'delivered', timestamp: '2 min ago' },
  { id: 'txn_2', name: 'Janet', phone: '0723123456', amount: 50, status: 'delivered', timestamp: '15 min ago' },
  { id: 'txn_3', name: 'Peter', phone: '0798123456', amount: 20, status: 'failed', timestamp: '30 min ago', failReason: 'Statum network timeout.' },
  { id: 'txn_4', name: 'Mary', phone: '0741123456', amount: 100, status: 'delivered', timestamp: '1 hour ago' },
  { id: 'txn_5', name: 'James', phone: '0712345678', amount: 250, status: 'processing', timestamp: '5 min ago' },
  { id: 'txn_6', name: 'Alice', phone: '0700123456', amount: 50, status: 'delivered', timestamp: '2 hours ago' },
];

// Failed deliveries for alerts
const mockDeliveryLogs = [
  { id: 'del_1', name: 'Samuel', phone: '0712071388', status: 'failed', timestamp: '2 min ago', failReason: 'Insufficient Kyanda balance.', failCode: 'STOCK_EMPTY' },
  { id: 'del_3', name: 'Peter', phone: '0798123456', status: 'failed', timestamp: '30 min ago', failReason: 'Statum network timeout.', failCode: 'NETWORK_TIMEOUT' },
];

const maskPhone = (phone: string) => {
  if (phone.length >= 10) return phone.slice(0, 4) + 'xxxx' + phone.slice(-2);
  return phone;
};

const networkNames: Record<string, string> = {
  'Safaricom': 'Kyanda',
  'Airtel': 'Statum',
  'Telkom': 'Telkom',
};

export default function AirtimePage() {
  const [selectedFailedLog, setSelectedFailedLog] = useState<any>(null);
  const [showFailedModal, setShowFailedModal] = useState(false);

  const todaySold = mockStockData.reduce((sum, item) => sum + item.sold * item.price, 0);
  const lowStockItems = mockStockData.filter(item => item.stock <= 10);
  const failedDeliveries = mockDeliveryLogs.filter(log => log.status === 'failed');
  
  const totalTransactions = 416;
  const successfulTransactions = 312;
  const missedSales = totalTransactions - successfulTransactions;
  const successRate = 75;
  const hasAlerts = lowStockItems.length > 0 || failedDeliveries.length > 0;

  const handleFailedClick = (log: any) => {
    setSelectedFailedLog(log);
    setShowFailedModal(true);
  };

  const handleTopUp = (network: string, denomination: number) => {
    console.log('Top up:', network, denomination);
    // In real app: open top-up flow
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': return { bg: 'bg-green-100', text: 'text-green-600', label: 'Delivered', icon: CheckCircle };
      case 'failed': return { bg: 'bg-red-100', text: 'text-red-600', label: 'Failed', icon: X };
      case 'processing': return { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Processing', icon: Loader2 };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', label: status, icon: Clock };
    }
  };

  return (
    <div className="p-4 space-y-4">

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Today's Sales</p>
          <p className="text-xl font-bold text-gray-900">KES {todaySold.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-green-600">↑ 12%</span><span className="text-xs text-gray-400">vs yesterday</span></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Missed Sales</p>
          <p className="text-xl font-bold text-red-500">{missedSales}</p>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-gray-400">Failed transactions</span></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Today's Transactions</p>
          <p className="text-xl font-bold text-gray-900">{totalTransactions}</p>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-gray-400">Total orders</span></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Successful Rate</p>
          <p className="text-xl font-bold text-emerald-600">{successRate}%</p>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-gray-400">{successfulTransactions} of {totalTransactions}</span></div>
        </div>
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-100">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="w-4 h-4 text-red-600" /></div>
            <h3 className="font-semibold text-gray-900">Alerts</h3>
            <span className="ml-auto text-xs text-red-500 font-medium">{lowStockItems.length + failedDeliveries.length} issues</span>
          </div>
          <div className="p-3 space-y-2 max-h-[280px] overflow-y-auto">
            
            {/* Low Stock Alerts WITH Top Up button */}
            {lowStockItems.map((item, index) => (
              <div key={`stock-${index}`} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Low Stock: {networkNames[item.network] || item.network}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{item.denomination} denom</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-semibold text-red-600">{item.stock} left</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTopUp(item.network, item.denomination)}
                  className="px-4 py-2 bg-[#8B1D1D] text-white text-xs font-semibold rounded-xl hover:bg-[#701616] transition-colors shrink-0"
                >
                  Top Up
                </button>
              </div>
            ))}

            {/* Failed Delivery Alerts */}
            {failedDeliveries.map((log, index) => (
              <div key={`failed-${index}`} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><X className="w-5 h-5 text-red-600" /></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{log.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {log.timestamp}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400">📱 {maskPhone(log.phone)}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleFailedClick(log)} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-50 shrink-0">View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Transaction History</h3>
          <button className="text-xs text-[#8B1D1D] font-semibold">See All</button>
        </div>
        <div className="space-y-2">
          {transactionHistory.map((txn) => {
            const statusStyle = getStatusStyle(txn.status);
            const StatusIcon = statusStyle.icon;
            return (
              <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${statusStyle.bg} rounded-full flex items-center justify-center`}>
                    <StatusIcon className={`w-4 h-4 ${statusStyle.text} ${txn.status === 'processing' ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{txn.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">📱 {maskPhone(txn.phone)}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{txn.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">KES {txn.amount}</p>
                  <span className={`text-[11px] font-semibold ${statusStyle.text}`}>{statusStyle.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Failed Transaction Detail Modal */}
      {showFailedModal && selectedFailedLog && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFailedModal(false)} />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex justify-center mb-4"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"><X className="w-8 h-8 text-red-600" /></div></div>
            <h3 className="text-xl font-bold text-gray-900 text-center">{selectedFailedLog.name}</h3>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedFailedLog.timestamp}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-400">📱 {maskPhone(selectedFailedLog.phone)}</span>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 mt-4">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Failure Reason</p>
              <p className="text-sm text-gray-800 leading-relaxed">{selectedFailedLog.failReason}</p>
              <p className="text-xs text-red-400 mt-2">Code: {selectedFailedLog.failCode}</p>
            </div>
            <div className="space-y-3 mt-4">
              <button onClick={() => setShowFailedModal(false)} className="w-full bg-[#8B1D1D] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#701616]"><RotateCcw className="w-5 h-5" />Retry</button>
              <button onClick={() => setShowFailedModal(false)} className="w-full bg-white border-2 border-red-200 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50"><Undo2 className="w-5 h-5" />Refund</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}