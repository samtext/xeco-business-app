'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { api } from '../../../lib/api';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const maskPhone = (phone: string) => {
  if (!phone) return 'xxxxxxxx';
  const clean = phone.replace('254', '0');
  if (clean.length >= 10) return clean.slice(0, 4) + 'xxxx' + clean.slice(-2);
  return clean;
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
};

// Check if a timestamp is within the last 24 hours
const isWithinLast24Hours = (timestamp: string): boolean => {
  if (!timestamp) return false;
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= 24;
};

const networkNames: Record<string, string> = {
  'kyanda': 'Kyanda',
  'statum': 'Statum',
  'telkom': 'Telkom',
  'Safaricom': 'Kyanda',
  'Airtel': 'Statum',
};

// ============================================================================
// TYPES
// ============================================================================
interface Transaction {
  id: string;
  name: string;
  phone: string;
  amount: number;
  status: string;
  timestamp: string;
  failReason?: string;
  failCode?: string;
  profit?: number;
}

interface Alert {
  id: string;
  name: string;
  phone: string;
  amount?: number;
  network?: string;
  timestamp: string;
  failReason?: string;
  failCode?: string;
  denomination?: number;
  stock?: number;
  type: 'low_stock' | 'failed_delivery';
  rawTimestamp?: string;
}

interface SummaryData {
  totalTransactions: number;
  successfulTransactions: number;
  missedSales: number;
  successRate: number;
  last24HoursSales: number;
  last24HoursProfit: number;
}

// ============================================================================
// COMPONENT
// ============================================================================
export default function AirtimePage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    totalTransactions: 0, successfulTransactions: 0,
    missedSales: 0, successRate: 0, last24HoursSales: 0, last24HoursProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedFailedLog, setSelectedFailedLog] = useState<Alert | null>(null);
  const [showFailedModal, setShowFailedModal] = useState(false);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch ALL transactions and calculate 24-hour stats locally
      const [allTransactionsData, alertsData] = await Promise.all([
        api.getTransactions({ limit: 1000 }),
        api.getAlerts(),
      ]);

      // Calculate last 24 hours stats from all transactions
      let last24HoursSales = 0;
      let totalTransactions = 0;
      let successfulTransactions = 0;
      let missedSales = 0;

      if (allTransactionsData?.transactions) {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        
        allTransactionsData.transactions.forEach((txn: any) => {
          const txnDate = new Date(txn.timestamp);
          if (txnDate >= twentyFourHoursAgo) {
            // Count for last 24 hours
            totalTransactions++;
            if (txn.status === 'delivered' || txn.status === 'completed') {
              successfulTransactions++;
              last24HoursSales += txn.amount || 0;
            } else if (txn.status === 'failed') {
              missedSales++;
            }
          }
        });
        
        const successRate = totalTransactions > 0 
          ? Math.round((successfulTransactions / totalTransactions) * 100) 
          : 0;

        setSummary({
          totalTransactions,
          successfulTransactions,
          missedSales,
          successRate,
          last24HoursSales,
          last24HoursProfit: 0,
        });

        // Format transactions for display (last 5)
        const formatted = allTransactionsData.transactions
          .filter((txn: any) => new Date(txn.timestamp) >= twentyFourHoursAgo)
          .slice(0, 5)
          .map((txn: any) => ({
            id: txn.id,
            name: txn.name || 'Customer',
            phone: txn.phone || '',
            amount: txn.amount || 0,
            status: txn.status || 'processing',
            timestamp: formatTimeAgo(txn.timestamp),
            failReason: txn.failReason,
            failCode: txn.failCode,
            profit: txn.profit || 0,
          }));
        setTransactions(formatted);
      }

      if (alertsData) {
        // Filter failed deliveries to ONLY those within last 24 hours
        const recentFailedDeliveries = (alertsData.failedDeliveries || [])
          .filter((item: any) => isWithinLast24Hours(item.timestamp))
          .map((item: any) => ({
            id: item.id,
            name: item.name || 'Customer',
            phone: item.phone || '',
            amount: item.amount,
            timestamp: formatTimeAgo(item.timestamp),
            rawTimestamp: item.timestamp,
            failReason: item.failReason || 'Delivery failed',
            failCode: item.failCode || 'UNKNOWN',
            type: 'failed_delivery' as const,
          }));

        // Low stock alerts - always show (these don't have timestamps)
        const lowStockAlerts = (alertsData.lowStock || []).map((item: any) => ({
          id: `stock_${item.network}_${item.denomination}`,
          name: networkNames[item.network] || item.network,
          phone: '',
          denomination: item.denomination,
          stock: item.stock,
          timestamp: '',
          type: 'low_stock' as const,
        }));

        const allAlerts: Alert[] = [...lowStockAlerts, ...recentFailedDeliveries];
        setAlerts(allAlerts);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFailedClick = (log: Alert) => { 
    setSelectedFailedLog(log); 
    setShowFailedModal(true); 
  };

  const handleRetry = async () => {
    if (!selectedFailedLog) return;
    try { 
      await api.retryTransaction(selectedFailedLog.id); 
      setShowFailedModal(false); 
      setSelectedFailedLog(null); 
      loadDashboardData(); 
    } catch (error) { 
      console.error('Retry failed:', error); 
    }
  };

  const handleRefund = async () => {
    if (!selectedFailedLog) return;
    try { 
      await api.refundTransaction(selectedFailedLog.id); 
      setShowFailedModal(false); 
      setSelectedFailedLog(null); 
      loadDashboardData(); 
    } catch (error) { 
      console.error('Refund failed:', error); 
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': 
      case 'completed': 
        return { bg: 'bg-green-100', text: 'text-green-600', label: 'Delivered', icon: CheckCircle };
      case 'failed': 
        return { bg: 'bg-red-100', text: 'text-red-600', label: 'Failed', icon: X };
      case 'processing': 
        return { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Processing', icon: Loader2 };
      default: 
        return { bg: 'bg-gray-100', text: 'text-gray-600', label: status, icon: Clock };
    }
  };

  const lowStockItems = alerts.filter(a => a.type === 'low_stock');
  const failedDeliveries = alerts.filter(a => a.type === 'failed_delivery');
  const hasAlerts = alerts.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#8B1D1D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">

      {/* Last 24 Hours Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Last 24 Hours Sales</p>
          <p className="text-xl font-bold text-gray-900">KES {summary.last24HoursSales.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-gray-400">From airtime sales</span></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Failed Transactions</p>
          <p className="text-xl font-bold text-red-500">{summary.missedSales}</p>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-gray-400">Last 24 hours</span></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Transactions</p>
          <p className="text-xl font-bold text-gray-900">{summary.totalTransactions}</p>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-gray-400">Last 24 hours</span></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Success Rate</p>
          <p className="text-xl font-bold text-emerald-600">{summary.successRate}%</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-400">{summary.successfulTransactions} of {summary.totalTransactions} successful</span>
          </div>
        </div>
      </div>

      {/* Alerts - Only showing alerts from last 24 hours */}
      {hasAlerts && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-100">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Recent Alerts (Last 24 Hours)</h3>
            <span className="ml-auto text-xs text-red-500 font-medium">{alerts.length} issues</span>
          </div>
          <div className="p-3 space-y-2 max-h-[280px] overflow-y-auto">
            {lowStockItems.map((item, index) => (
              <div key={`stock-${index}`} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Low Stock: {item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{item.denomination} denom</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-semibold text-red-600">{item.stock} left</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {failedDeliveries.map((log, index) => (
              <div key={`failed-${index}`} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{log.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {log.timestamp}
                      </span>
                      {log.phone && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">📱 {maskPhone(log.phone)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleFailedClick(log)} 
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-50 shrink-0"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Alerts Message */}
      {!hasAlerts && (
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border-b border-green-100">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">All Clear</h3>
            <span className="ml-auto text-xs text-green-500 font-medium">No active alerts</span>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No alerts in the last 24 hours. Your system is running smoothly!</p>
          </div>
        </div>
      )}

      {/* Recent Transactions (Last 24 Hours) */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Transactions (Last 24 Hours)</h3>
          <button 
            onClick={() => router.push('/dashboard/transactions')}
            className="text-xs text-[#8B1D1D] font-semibold"
          >
            See All
          </button>
        </div>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No transactions in the last 24 hours</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((txn) => {
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
        )}
      </div>

      {/* Failed Transaction Detail Modal */}
      {showFailedModal && selectedFailedLog && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFailedModal(false)} />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">{selectedFailedLog.name}</h3>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {selectedFailedLog.timestamp}
              </span>
              {selectedFailedLog.phone && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-400">📱 {maskPhone(selectedFailedLog.phone)}</span>
                </>
              )}
            </div>
            <div className="bg-red-50 rounded-2xl p-4 mt-4">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Failure Reason</p>
              <p className="text-sm text-gray-800 leading-relaxed">{selectedFailedLog.failReason || 'Unknown error'}</p>
              {selectedFailedLog.failCode && (
                <p className="text-xs text-red-400 mt-2">Code: {selectedFailedLog.failCode}</p>
              )}
            </div>
            <div className="space-y-3 mt-4">
              <button 
                onClick={handleRetry} 
                className="w-full bg-[#8B1D1D] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#701616]"
              >
                <RotateCcw className="w-5 h-5" />Retry
              </button>
              <button 
                onClick={handleRefund} 
                className="w-full bg-white border-2 border-red-200 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50"
              >
                <Undo2 className="w-5 h-5" />Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}